const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中間件
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 壓縮和日誌
app.use(compression());
app.use(morgan('combined'));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // 開發環境放寬限制
  message: '請求過於頻繁，請稍後再試'
});
app.use('/api/', limiter);

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 健康檢查
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: '銀樓智慧大腦 API',
    version: '1.0.0'
  });
});

// API 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/prices', require('./routes/prices'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/simple-cart', require('./routes/simpleCart'));

// Placeholder API for images
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  res.redirect(`https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=圖片`);
});

// Other API endpoints (to be implemented)
app.get('/api/orders', (req, res) => {
  res.json({ message: 'Orders API endpoint' });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '伺服器內部錯誤',
    message: process.env.NODE_ENV === 'development' ? err.message : '請稍後再試'
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '找不到請求的資源',
    path: req.originalUrl
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 銀樓智慧大腦 API 伺服器已啟動`);
  console.log(`📍 服務地址: http://localhost:${PORT}`);
  console.log(`🔍 健康檢查: http://localhost:${PORT}/health`);
  console.log(`⏰ 啟動時間: ${new Date().toLocaleString('zh-TW')}`);
});

module.exports = app; 