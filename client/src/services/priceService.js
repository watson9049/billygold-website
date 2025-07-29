import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

class PriceService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    })
  }

  /**
   * 獲取價格狀態
   */
  async getPriceStatus() {
    try {
      const response = await this.api.get('/prices/status')
      return response.data
    } catch (error) {
      console.error('獲取價格狀態失敗:', error)
      return {
        status: 'error',
        message: '無法連接到價格服務',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * 獲取國際金價
   */
  async getInternationalGoldPrice() {
    try {
      const response = await this.api.get('/prices/international-gold')
      return response.data
    } catch (error) {
      console.error('獲取國際金價失敗:', error)
      // 返回模擬數據作為備用
      return {
        price: 3350,
        currency: 'USD',
        unit: 'oz',
        source: 'simulated',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * 獲取台灣金價
   */
  async getTaiwanGoldPrice() {
    try {
      const response = await this.api.get('/prices/taiwan-gold')
      return response.data
    } catch (error) {
      console.error('獲取台灣金價失敗:', error)
      // 返回模擬數據作為備用
      return {
        price: 12700,
        currency: 'TWD',
        unit: 'taiwan-tael',
        source: 'simulated',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * 計算商品價格
   */
  async calculateProductPrice(weight, workmanshipFee = 500) {
    try {
      const response = await this.api.post('/prices/calculate', {
        weight,
        workmanshipFee
      })
      return response.data
    } catch (error) {
      console.error('計算商品價格失敗:', error)
      // 返回模擬計算結果
      const internationalPrice = 3350
      const exchangeRate = 31.8
      const weightInOunces = weight / 8.294
      const goldCost = internationalPrice * exchangeRate * weightInOunces
      const totalWorkmanshipFee = workmanshipFee * weight
      const finalPrice = goldCost + totalWorkmanshipFee

      return {
        internationalPrice,
        exchangeRate,
        weight,
        weightInOunces,
        goldCost: Math.round(goldCost),
        workmanshipFee: totalWorkmanshipFee,
        finalPrice: Math.round(finalPrice),
        calculationTime: new Date().toISOString(),
        source: 'simulated'
      }
    }
  }

  /**
   * 獲取價格歷史
   */
  async getPriceHistory(days = 7) {
    try {
      const response = await this.api.get(`/prices/history?days=${days}`)
      return response.data
    } catch (error) {
      console.error('獲取價格歷史失敗:', error)
      // 返回模擬歷史數據
      const history = []
      const now = new Date()
      for (let i = days; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const basePrice = 3350
        const variation = (Math.random() - 0.5) * 100
        history.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(basePrice + variation),
          currency: 'USD',
          unit: 'oz'
        })
      }
      return history
    }
  }

  /**
   * 獲取所有貴金屬價格
   */
  async getAllMetalPrices() {
    try {
      const response = await this.api.get('/prices/all-metals')
      return response.data.data // 返回 data 欄位中的實際數據
    } catch (error) {
      console.error('獲取所有金屬價格失敗:', error)
      // 返回模擬數據作為備用
      return {
        gold: {
          price: 3311.96,
          change: '+12.45',
          changePercent: '+0.38%'
        },
        silver: {
          price: 38.11,
          change: '-0.23',
          changePercent: '-0.60%'
        },
        platinum: {
          price: 1408.63,
          change: '+8.92',
          changePercent: '+0.64%'
        },
        palladium: {
          price: 1274.46,
          change: '-15.78',
          changePercent: '-1.22%'
        }
      }
    }
  }
}

export default new PriceService() 