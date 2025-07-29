import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

class AIService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30秒超時
    })
  }

  /**
   * 發送消息給AI助手
   */
  async sendMessage(message, context = []) {
    try {
      const response = await this.api.post('/ai/chat', {
        message,
        context,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('AI對話失敗:', error)
      return {
        success: false,
        message: '抱歉，AI助手暫時無法回應，請稍後再試。',
        error: error.message
      }
    }
  }

  /**
   * 獲取AI助手狀態
   */
  async getAIStatus() {
    try {
      const response = await this.api.get('/ai/status')
      return response.data
    } catch (error) {
      console.error('獲取AI狀態失敗:', error)
      return {
        status: 'offline',
        message: 'AI服務暫時不可用',
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * 獲取常見問題建議
   */
  async getSuggestions() {
    try {
      const response = await this.api.get('/ai/suggestions')
      return response.data
    } catch (error) {
      console.error('獲取建議失敗:', error)
      // 返回預設建議
      return {
        suggestions: [
          '如何購買黃金？',
          '黃金價格如何計算？',
          '如何鑑定黃金真偽？',
          '黃金投資建議',
          '運費和付款方式',
          '退換貨政策'
        ]
      }
    }
  }

  /**
   * 獲取對話歷史
   */
  async getChatHistory(userId) {
    try {
      const response = await this.api.get(`/ai/history/${userId}`)
      return response.data
    } catch (error) {
      console.error('獲取對話歷史失敗:', error)
      return {
        history: []
      }
    }
  }

  /**
   * 清除對話歷史
   */
  async clearChatHistory(userId) {
    try {
      const response = await this.api.delete(`/ai/history/${userId}`)
      return response.data
    } catch (error) {
      console.error('清除對話歷史失敗:', error)
      return {
        success: false,
        message: '清除失敗，請稍後再試'
      }
    }
  }

  /**
   * 評價AI回應
   */
  async rateResponse(messageId, rating, feedback = '') {
    try {
      const response = await this.api.post('/ai/rate', {
        messageId,
        rating, // 1-5 星
        feedback,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('評價失敗:', error)
      return {
        success: false,
        message: '評價失敗，請稍後再試'
      }
    }
  }
}

export default new AIService() 