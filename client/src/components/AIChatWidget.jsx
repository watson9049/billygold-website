import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, Smile } from 'lucide-react'

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '您好！我是比例先生，您的黃金投資顧問。請問有什麼可以幫助您的嗎？',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const suggestions = [
    '黃金投資建議',
    '今日金價走勢',
    '如何挑選黃金條塊',
    '投資風險評估',
    '黃金保養方法',
    '結婚戒指推薦',
    '金飾搭配技巧',
    '真假黃金鑑定'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      // 獲取最近的對話歷史作為上下文
      const recentMessages = messages.slice(-4).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          context: recentMessages
        })
      })

      const data = await response.json()

      if (data.success) {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: data.message,
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, botMessage])
        
        // 如果聊天視窗未開啟，增加未讀訊息計數
        if (!isOpen) {
          setUnreadCount(prev => prev + 1)
        }
      } else {
        throw new Error(data.message || '回應失敗')
      }
    } catch (error) {
      console.error('AI 回應錯誤:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: '抱歉，我現在無法回應。請稍後再試。',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* 浮動按鈕 */}
      <button
        onClick={() => {
          setIsOpen(true)
          setUnreadCount(0)
          setIsMinimized(false)
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="relative">
          <MessageCircle className="w-8 h-8 mx-auto" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          比例先生諮詢
        </div>
        {/* 未讀訊息計數 */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
            <span className="text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </div>
        )}
        {/* AI標籤 */}
        {unreadCount === 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">AI</span>
          </div>
        )}
      </button>

      {/* 聊天視窗 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4 sm:p-6 animate-fade-in-up">
          <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-fade-in-up transition-all duration-300 ${
            isMinimized ? 'h-20' : 'h-96 sm:h-[500px]'
          }`} style={{ animationDelay: '0.1s' }}>
            {/* 聊天標題 */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg">比例先生</div>
                  <div className="text-yellow-100 text-sm">AI 投資顧問</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-yellow-200 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-yellow-200 transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 訊息區域 */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    style={{ animationDelay: `${message.id * 0.1}s` }}
                  >
                    <div
                      className={`max-w-xs sm:max-w-sm px-4 py-2 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                        {message.type === 'user' && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start animate-fade-in-up">
                    <div className="bg-gray-100 text-gray-800 max-w-xs sm:max-w-sm px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* 建議按鈕 */}
            {!isMinimized && messages.length === 1 && (
              <div className="px-4 pb-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-xs text-gray-500 mb-2">快速問題：</div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-gray-100 hover:bg-yellow-100 text-gray-700 px-3 py-1 rounded-full transition-colors duration-200 hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 清空對話按鈕 */}
            {!isMinimized && messages.length > 1 && (
              <div className="px-4 pb-2">
                <button
                  onClick={() => {
                    setMessages([messages[0]])
                    setIsTyping(false)
                  }}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors duration-200 flex items-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>清空對話</span>
                </button>
              </div>
            )}

            {/* 輸入區域 */}
            {!isMinimized && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="輸入您的問題..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                    title="語音輸入 (即將推出)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* 表情符號選擇器 */}
                {showEmojiPicker && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-8 gap-1">
                      {['😊', '👍', '❤️', '🎉', '💡', '💰', '🏆', '✨', '🌟', '💎', '🔥', '💯', '🎯', '📈', '💪', '🎊'].map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInputMessage(prev => prev + emoji)
                            setShowEmojiPicker(false)
                          }}
                          className="w-8 h-8 text-lg hover:bg-gray-200 rounded transition-colors duration-200"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatWidget 