const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

/**
 * GET /api/customers
 * 獲取所有客戶列表
 */
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    // 獲取總數
    const countQuery = `SELECT COUNT(*) as total FROM customers ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = countResult[0]?.total || 0;
    
    // 獲取客戶列表
    const customersQuery = `
      SELECT 
        id, name, email, phone, status, 
        created_at, updated_at,
        COALESCE(preferences, '[]') as preferences
      FROM customers 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const customersResult = await query(customersQuery, [...params, limit, offset]);
    
    // 獲取每個客戶的統計數據
    const customersWithStats = await Promise.all(
      customersResult.rows.map(async (customer) => {
        // 獲取訂單統計
        const orderStatsQuery = `
          SELECT 
            COUNT(*) as order_count,
            COALESCE(SUM(total_amount), 0) as total_spent,
            MAX(created_at) as last_order_date
          FROM orders 
          WHERE customer_id = ?
        `;
        const orderStats = await query(orderStatsQuery, [customer.id]);
        
        // 獲取偏好分析
        let preferences = [];
        try {
          preferences = JSON.parse(customer.preferences || '[]');
        } catch (e) {
          preferences = [];
        }
        
        return {
          ...customer,
                  orderCount: orderStats[0].order_count,
        totalSpent: orderStats[0].total_spent,
        lastOrderDate: orderStats[0].last_order_date,
          preferences: preferences
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        customers: customersWithStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('獲取客戶列表失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取客戶列表失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/customers/:id
 * 獲取特定客戶詳情
 */
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const customerQuery = `
      SELECT 
        id, name, email, phone, status, address,
        created_at, updated_at,
        COALESCE(preferences, '[]') as preferences
      FROM customers 
      WHERE id = ?
    `;
    
    const customerResult = await query(customerQuery, [id]);
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '客戶不存在'
      });
    }
    
    const customer = customerResult[0];
    
    // 獲取訂單歷史
    const ordersQuery = `
      SELECT 
        o.id, o.total_amount, o.status, o.notes, o.created_at,
        oi.product_id, oi.quantity, oi.unit_price, oi.total_price
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC
    `;
    
    const ordersResult = await query(ordersQuery, [id]);
    
    // 解析偏好
    let preferences = [];
    try {
      preferences = JSON.parse(customer.preferences || '[]');
    } catch (e) {
      preferences = [];
    }
    
    res.json({
      success: true,
      data: {
        ...customer,
        preferences,
        orders: ordersResult.rows
      }
    });
  } catch (error) {
    console.error('獲取客戶詳情失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取客戶詳情失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/customers
 * 創建新客戶
 */
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, address, preferences = [] } = req.body;
    
    // 驗證必填欄位
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: '姓名和Email為必填欄位'
      });
    }
    
    // 檢查Email是否已存在
    const existingCustomer = await query(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );
    
    if (existingCustomer.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: '此Email已被使用'
      });
    }
    
    const id = uuidv4();
    const preferencesJson = JSON.stringify(preferences);
    
    const insertQuery = `
      INSERT INTO customers (id, name, email, phone, address, preferences, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `;
    
    await query(insertQuery, [id, name, email, phone, address, preferencesJson]);
    
    res.status(201).json({
      success: true,
      data: {
        id,
        name,
        email,
        phone,
        address,
        preferences,
        status: 'active'
      },
      message: '客戶創建成功'
    });
  } catch (error) {
    console.error('創建客戶失敗:', error);
    res.status(500).json({
      success: false,
      error: '創建客戶失敗',
      message: error.message
    });
  }
});

/**
 * PUT /api/customers/:id
 * 更新客戶資料
 */
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, preferences, status } = req.body;
    
    // 檢查客戶是否存在
    const existingCustomer = await query(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );
    
    if (existingCustomer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '客戶不存在'
      });
    }
    
    // 檢查Email是否被其他客戶使用
    if (email) {
      const emailCheck = await query(
        'SELECT id FROM customers WHERE email = ? AND id != ?',
        [email, id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: '此Email已被其他客戶使用'
        });
      }
    }
    
    const updateQuery = `
      UPDATE customers 
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          preferences = COALESCE(?, preferences),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const preferencesJson = preferences ? JSON.stringify(preferences) : null;
    
    await query(updateQuery, [
      name, email, phone, address, preferencesJson, status, id
    ]);
    
    res.json({
      success: true,
      message: '客戶資料更新成功'
    });
  } catch (error) {
    console.error('更新客戶資料失敗:', error);
    res.status(500).json({
      success: false,
      error: '更新客戶資料失敗',
      message: error.message
    });
  }
});

/**
 * DELETE /api/customers/:id
 * 刪除客戶
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 檢查客戶是否存在
    const existingCustomer = await query(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );
    
    if (existingCustomer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '客戶不存在'
      });
    }
    
    // 檢查是否有相關訂單
    const orderCheck = await query(
      'SELECT COUNT(*) as count FROM orders WHERE customer_id = ?',
      [id]
    );
    
    if (orderCheck[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: '無法刪除有訂單記錄的客戶'
      });
    }
    
    await query('DELETE FROM customers WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: '客戶刪除成功'
    });
  } catch (error) {
    console.error('刪除客戶失敗:', error);
    res.status(500).json({
      success: false,
      error: '刪除客戶失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/customers/stats/overview
 * 獲取客戶統計概覽
 */
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 總客戶數
    const totalCustomers = await query('SELECT COUNT(*) as count FROM customers');
    
    // 活躍客戶數
    const activeCustomers = await query(
      'SELECT COUNT(*) as count FROM customers WHERE status = ?',
      ['active']
    );
    
    // 總訂單數
    const totalOrders = await query('SELECT COUNT(*) as count FROM orders');
    
    // 總營業額
    const totalRevenue = await query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders');
    
    // 平均客戶價值
    const avgCustomerValue = await query(`
      SELECT COALESCE(AVG(total_amount), 0) as avg_value 
      FROM (
        SELECT customer_id, SUM(total_amount) as total_amount
        FROM orders 
        GROUP BY customer_id
      )
    `);
    
    res.json({
      success: true,
      data: {
        totalCustomers: totalCustomers[0]?.count || 0,
        activeCustomers: activeCustomers[0]?.count || 0,
        totalOrders: totalOrders[0]?.count || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        avgCustomerValue: avgCustomerValue[0]?.avg_value || 0
      }
    });
  } catch (error) {
    console.error('獲取客戶統計失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取客戶統計失敗',
      message: error.message
    });
  }
});

module.exports = router; 