const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const jwt = require('jsonwebtoken');

// 簡化的認證中間件
const simpleAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未提供認證令牌' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: '無效的認證令牌' });
  }
};

/**
 * GET /api/simple-cart
 * 獲取購物車商品
 */
router.get('/', simpleAuth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // 獲取購物車商品
    const cartItems = await query(`
      SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.created_at
      FROM cart_items ci
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]);

    // 計算購物車摘要
    const summary = {
      totalItems: cartItems && cartItems.length ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0,
      itemCount: cartItems ? cartItems.length : 0
    };

    res.json({
      success: true,
      data: {
        items: cartItems,
        summary
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
 * POST /api/simple-cart
 * 添加商品到購物車
 */
router.post('/', simpleAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數',
        message: '請提供商品ID'
      });
    }

    // 檢查商品是否已在購物車中
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
        message: '購物車商品數量已更新',
        data: { id: existingItem[0].id, quantity: newQuantity }
      });
    } else {
      // 新增商品
      const cartItemId = uuidv4();
      await query(
        'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
        [cartItemId, userId, product_id, quantity]
      );
      
      res.json({
        success: true,
        message: '商品已添加到購物車',
        data: { id: cartItemId, product_id, quantity }
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
 * DELETE /api/simple-cart/:id
 * 移除購物車商品
 */
router.delete('/:id', simpleAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [id, userId]
    );

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
 * DELETE /api/simple-cart
 * 清空購物車
 */
router.delete('/', simpleAuth, async (req, res) => {
  try {
    const userId = req.userId;

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