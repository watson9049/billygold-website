const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// JWT 密鑰
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 驗證 JWT Token
const authenticateToken = async (req, res, next) => {
  console.log('認證中間件被調用，路由:', req.path);
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  console.log('Extracted token:', token ? 'Token exists' : 'No token');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: '未提供認證令牌',
      message: '請先登入'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('JWT decoded:', decoded);
    
    // 檢查用戶是否仍然存在且活躍
    const userResult = await query(
      'SELECT id, username, email, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    console.log('User query result:', userResult);
    console.log('User query result.rows:', userResult.rows);
    console.log('User query result.rowCount:', userResult.rowCount);

    if (userResult.rowCount === 0) {
      return res.status(401).json({
        success: false,
        error: '用戶不存在或已被停用',
        message: '請重新登入'
      });
    }

    req.user = userResult.rows[0];
    console.log('req.user set to:', req.user);
    next();
  } catch (error) {
    console.error('JWT 驗證失敗:', error);
    return res.status(403).json({
      success: false,
      error: '無效的認證令牌',
      message: '請重新登入'
    });
  }
};

// 檢查管理員權限
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: '權限不足',
      message: '需要管理員權限'
    });
  }
  next();
};

// 生成 JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  JWT_SECRET
}; 