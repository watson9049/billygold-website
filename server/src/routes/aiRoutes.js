const express = require('express')
const router = express.Router()
const OpenAI = require('openai')
require('dotenv').config()

// 檢查API金鑰
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey || apiKey === 'your_openai_api_key') {
  console.error('❌ OpenAI API金鑰未設定或無效')
} else {
  console.log('✅ OpenAI API金鑰已設定')
}

const openai = new OpenAI({
  apiKey: apiKey,
})

// 本地建議與歷史功能
class AIService {
  constructor() {
    this.conversationHistory = new Map()
    this.suggestions = [
      '如何購買黃金？',
      '黃金價格如何計算？',
      '如何鑑定黃金真偽？',
      '黃金投資建議',
      '運費和付款方式',
      '退換貨政策',
      '黃金儲存建議',
      '投資風險說明'
    ]
  }
  getSuggestions() { return this.suggestions }
  saveConversation(userId, message, response) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, [])
    }
    const history = this.conversationHistory.get(userId)
    history.push({
      timestamp: new Date().toISOString(),
      userMessage: message,
      aiResponse: response
    })
    if (history.length > 50) history.splice(0, history.length - 50)
  }
}
const aiService = new AIService()

// 呼叫 OpenAI GPT
async function generateOpenAIResponse(message, context = []) {
  try {
    // 檢查API金鑰
    if (!apiKey || apiKey === 'your_openai_api_key') {
      throw new Error('OpenAI API金鑰未設定')
    }

    const systemPrompt = `你是「黃金比例」的專業投資顧問「比例先生」，專門提供黃金投資相關的專業建議。

你的專業領域包括：
- 黃金投資策略和風險評估
- 黃金條塊、金飾的挑選和保養
- 國際金價走勢分析
- 結婚戒指和金飾搭配建議
- 黃金真偽鑑定方法
- 投資組合配置建議

回答原則：
1. 用繁體中文回答，語氣親切專業
2. 提供實用且安全的投資建議
3. 強調風險管理和長期投資觀念
4. 結合台灣本地市場情況
5. 回答要簡潔明瞭，避免過於複雜的專業術語
6. 如果是投資建議，要提醒投資有風險，建議諮詢專業理財顧問

公司資訊：
- 公司名稱：金成美銀樓
- 地址：彰化縣員林市黎明里黎明巷6號
- 電話：04-8332600
- 營業時間：週一至週五 09:00-18:00，週六 09:00-17:00

請根據用戶的問題提供專業、貼心的建議。`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...((context||[]).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))),
      { role: 'user', content: message }
    ]
    
    console.log('🤖 發送請求到OpenAI...')
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 800
    })
    
    console.log('✅ OpenAI回應成功')
    return completion.choices[0].message.content
  } catch (error) {
    console.error('❌ OpenAI API錯誤:', error.message)
    if (error.code === 'invalid_api_key') {
      throw new Error('API金鑰無效，請檢查設定')
    } else if (error.code === 'insufficient_quota') {
      throw new Error('API配額不足，請檢查帳戶餘額')
    } else if (error.code === 'rate_limit_exceeded') {
      throw new Error('API請求過於頻繁，請稍後再試')
    } else {
      throw new Error(`OpenAI服務錯誤: ${error.message}`)
    }
  }
}

// AI 聊天（OpenAI）
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: '請輸入有效的訊息' })
    }

    console.log('📝 收到聊天請求:', message.substring(0, 50) + '...')
    
    const aiReply = await generateOpenAIResponse(message, context || [])
    
    // 儲存對話歷史（這裡簡化處理，實際應有用戶ID）
    const userId = 'anonymous'
    aiService.saveConversation(userId, message, aiReply)
    
    res.json({
      success: true,
      message: aiReply,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ AI聊天錯誤:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || 'AI助手暫時無法回應，請稍後再試。'
    })
  }
})

// 狀態/建議/歷史/評價維持本地功能
router.get('/status', (req, res) => {
  const hasApiKey = apiKey && apiKey !== 'your_openai_api_key'
  res.json({
    status: hasApiKey ? 'online' : 'offline',
    message: hasApiKey ? 'AI 服務正常運行' : 'API金鑰未設定',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    hasApiKey: hasApiKey
  })
})

router.get('/suggestions', (req, res) => {
  res.json({ suggestions: aiService.getSuggestions() })
})

router.get('/history/:userId', (req, res) => {
  const { userId } = req.params
  const history = aiService.conversationHistory.get(userId) || []
  res.json({ history: history.slice(-20) })
})

router.delete('/history/:userId', (req, res) => {
  const { userId } = req.params
  aiService.conversationHistory.delete(userId)
  res.json({ success: true, message: '對話歷史已清除' })
})

router.post('/rate', (req, res) => {
  const { messageId, rating, feedback } = req.body
  console.log('AI 回應評價:', { messageId, rating, feedback })
  res.json({ success: true, message: '感謝您的評價！' })
})

module.exports = router 