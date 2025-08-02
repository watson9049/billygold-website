const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// 測試路由
router.get('/test', authenticateToken, (req, res) => {
  console.log('Test route - req.user:', req.user);
  console.log('Test route - req.user.id:', req.user?.id);
  console.log('Test route - typeof req.user:', typeof req.user);
  console.log('Test route - req.user keys:', req.user ? Object.keys(req.user) : 'null');
  res.json({
    success: true,
    user: req.user,
    userType: typeof req.user,
    userKeys: req.user ? Object.keys(req.user) : null,
    message: '認證測試成功'
  });
});

/**
 * GET /api/cart
 * 獲取購物車商品
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Cart route - req.user:', req.user);
    console.log('Cart route - req.user.id:', req.user?.id);
    const userId = req.user.id;
    
    // 獲取購物車商品
    const cartItems = await query(`
      SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        p.name,
        p.description,
        p.weight,
        p.material,
        p.category,
        p.craftsmanship_fee,
        ci.created_at,
        ci.updated_at
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]);
    
    // 計算每個商品的價格 (這裡簡化處理，實際應該調用價格服務)
    const cartWithPrices = cartItems.map(item => ({
      ...item,
      unit_price: (item.weight * 3311.96) + item.craftsmanship_fee, // 簡化的價格計算
      total_price: ((item.weight * 3311.96) + item.craftsmanship_fee) * item.quantity
    }));

    // 計算總計
    const total = cartWithPrices.reduce((sum, item) => sum + item.total_price, 0);
    const totalItems = cartWithPrices.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: {
        items: cartWithPrices,
        summary: {
          totalItems,
          totalAmount: total
        }
      }
    });
  } catch (error) {
    console.error('獲取購物車失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取購物車失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/cart
 * 添加商品到購物車
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: '商品ID是必需的'
      });
    }

    // 檢查商品是否存在
    const product = await query(
      'SELECT id, name FROM products WHERE id = ? AND is_active = 1',
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        error: '商品不存在或已下架'
      });
    }

    // 檢查是否已在購物車中
    const existingItem = await query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingItem.length > 0) {
      // 更新數量
      const newQuantity = existingItem[0].quantity + quantity;
      await query(
        'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, existingItem[0].id]
      );

      res.json({
        success: true,
        message: '商品數量已更新',
        data: {
          item_id: existingItem[0].id,
          quantity: newQuantity
        }
      });
    } else {
      // 添加新商品
      const itemId = uuidv4();
      await query(
        'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
        [itemId, userId, product_id, quantity]
      );

      res.json({
        success: true,
        message: '商品已添加到購物車',
        data: {
          item_id: itemId,
          quantity
        }
      });
    }
  } catch (error) {
    console.error('添加到購物車失敗:', error);
    res.status(500).json({
      success: false,
      error: '添加到購物車失敗',
      message: error.message
    });
  }
});

/**
 * PUT /api/cart/:id
 * 更新購物車商品數量
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: '數量必須大於0'
      });
    }

    // 檢查商品是否屬於當前用戶
    const cartItem = await query(
      'SELECT id FROM cart_items WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({
        success: false,
        error: '購物車商品不存在'
      });
    }

    // 更新數量
    await query(
      'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantity, id]
    );

    res.json({
      success: true,
      message: '商品數量已更新'
    });
  } catch (error) {
    console.error('更新購物車失敗:', error);
    res.status(500).json({
      success: false,
      error: '更新購物車失敗',
      message: error.message
    });
  }
});

/**
 * DELETE /api/cart/:id
 * 從購物車移除商品
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // 檢查商品是否屬於當前用戶
    const cartItem = await query(
      'SELECT id FROM cart_items WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({
        success: false,
        error: '購物車商品不存在'
      });
    }

    // 刪除商品
    await query('DELETE FROM cart_items WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '商品已從購物車移除'
    });
  } catch (error) {
    console.error('移除購物車商品失敗:', error);
    res.status(500).json({
      success: false,
      error: '移除購物車商品失敗',
      message: error.message
    });
  }
});

/**
 * DELETE /api/cart
 * 清空購物車
 */
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      message: '購物車已清空'
    });
  } catch (error) {
    console.error('清空購物車失敗:', error);
    res.status(500).json({
      success: false,
      error: '清空購物車失敗',
      message: error.message
    });
  }
});

module.exports = router; 