const express = require('express');
const PriceEngine = require('../services/priceEngine');
const { healthCheck } = require('../config/database');
const router = express.Router();

const priceEngine = new PriceEngine();

/**
 * GET /api/prices/health
 * 系統健康檢查
 */
router.get('/health', async (req, res) => {
  try {
    const dbHealth = await healthCheck();
    const priceEngineStatus = {
      status: 'active',
      lastUpdate: new Date().toISOString(),
      scheduleInterval: priceEngine.getScheduleInterval()
    };
    
    res.json({
      success: true,
      data: {
        database: dbHealth,
        priceEngine: priceEngineStatus,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('健康檢查失敗:', error);
    res.status(500).json({
      success: false,
      error: '健康檢查失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/prices/current
 * 獲取當前國際金價和匯率
 */
router.get('/current', async (req, res) => {
  try {
    const [internationalPrice, exchangeRate] = await Promise.all([
      priceEngine.getInternationalGoldPrice(),
      priceEngine.getTaiwanExchangeRate()
    ]);

    res.json({
      success: true,
      data: {
        internationalPrice: internationalPrice, // USD/oz
        exchangeRate: exchangeRate, // TWD/USD
        taiwanGoldPricePerTael: internationalPrice ? (internationalPrice * exchangeRate / 8.294) : null, // 台幣/台錢
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('獲取當前價格失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取價格資訊失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/prices/calculate
 * 計算特定重量的黃金價格
 */
router.post('/calculate', async (req, res) => {
  try {
    const { weight, workmanshipFee } = req.body;

    // 驗證輸入
    if (!weight || weight <= 0) {
      return res.status(400).json({
        success: false,
        error: '重量必須大於0'
      });
    }

    const priceInfo = await priceEngine.calculateTaiwanGoldPrice(
      parseFloat(weight),
      workmanshipFee ? parseFloat(workmanshipFee) : undefined
    );

    res.json({
      success: true,
      data: priceInfo
    });
  } catch (error) {
    console.error('價格計算失敗:', error);
    res.status(500).json({
      success: false,
      error: '價格計算失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/prices/calculate-batch
 * 批量計算多個商品的價格
 */
router.post('/calculate-batch', async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        error: '商品資料格式錯誤'
      });
    }

    const results = await priceEngine.calculateProductPrices(products);

    res.json({
      success: true,
      data: {
        products: results,
        calculationTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('批量價格計算失敗:', error);
    res.status(500).json({
      success: false,
      error: '批量價格計算失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/prices/history
 * 獲取價格歷史趨勢
 */
router.get('/history', async (req, res) => {
  try {
    const { period = 'daily' } = req.query; // daily, weekly, monthly
    
    const history = await priceEngine.getPriceHistory();
    
    res.json({
      success: true,
      data: {
        period,
        history: history[period] || [],
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('獲取價格歷史失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取價格歷史失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/prices/status
 * 獲取價格引擎狀態
 */
router.get('/status', async (req, res) => {
  try {
    const [internationalPrice, exchangeRate] = await Promise.all([
      priceEngine.getInternationalGoldPrice(),
      priceEngine.getTaiwanExchangeRate()
    ]);

    res.json({
      success: true,
      data: {
        status: 'active',
        internationalPrice: internationalPrice ? 'available' : 'unavailable',
        exchangeRate: exchangeRate ? 'available' : 'unavailable',
        lastCheck: new Date().toISOString(),
        configuration: {
          goldPriceAPI: priceEngine.goldPriceAPI,
          exchangeRateAPI: priceEngine.exchangeRateAPI,
          defaultExchangeRate: priceEngine.defaultExchangeRate,
          defaultWorkmanshipFee: priceEngine.defaultWorkmanshipFee
        }
      }
    });
  } catch (error) {
    console.error('獲取價格引擎狀態失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取價格引擎狀態失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/prices/all-metals
 * 獲取所有貴金屬價格
 */
router.get('/all-metals', async (req, res) => {
  try {
    const metalPrices = await priceEngine.getAllMetalPrices();
    
    res.json({
      success: true,
      data: metalPrices,
      lastUpdated: new Date().toISOString(),
      source: 'Kitco (with fallback simulation)'
    });
  } catch (error) {
    console.error('獲取所有金屬價格失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取金屬價格失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/prices/metal/:type
 * 獲取特定金屬價格
 */
router.get('/metal/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let price = null;
    
    switch (type.toLowerCase()) {
      case 'gold':
        price = await priceEngine.getInternationalGoldPrice();
        break;
      case 'silver':
        price = await priceEngine.getSilverPrice();
        break;
      case 'platinum':
        price = await priceEngine.getPlatinumPrice();
        break;
      case 'palladium':
        price = await priceEngine.getPalladiumPrice();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: '不支援的金屬類型',
          message: '支援的類型: gold, silver, platinum, palladium'
        });
    }
    
    res.json({
      success: true,
      data: {
        type: type.toLowerCase(),
        price: price,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`獲取${req.params.type}價格失敗:`, error);
    res.status(500).json({
      success: false,
      error: '獲取金屬價格失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/prices/schedule-interval
 * 查詢目前金價自動更新排程間隔（分鐘）
 */
router.get('/schedule-interval', (req, res) => {
  try {
    const intervalMs = priceEngine.getScheduleInterval();
    res.json({
      success: true,
      intervalMinutes: Math.round(intervalMs / 60000)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/prices/schedule-interval
 * 設定金價自動更新排程間隔（分鐘）
 * body: { intervalMinutes: number }
 */
router.post('/schedule-interval', (req, res) => {
  try {
    const { intervalMinutes } = req.body;
    const min = 15;
    const max = 1440;
    if (!intervalMinutes || typeof intervalMinutes !== 'number' || intervalMinutes < min || intervalMinutes > max) {
      return res.status(400).json({ success: false, message: `intervalMinutes 必須介於 ${min}~${max} 分鐘` });
    }
    priceEngine.schedulePriceUpdate(intervalMinutes * 60000);
    res.json({ success: true, intervalMinutes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 