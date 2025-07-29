import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import PriceChartPage from './pages/PriceChartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import AdminPage from './pages/AdminPage'
import ChatPage from './pages/ChatPage'
import CRMPage from './pages/CRMPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AIChatWidget from './components/AIChatWidget'
import { usePrices, usePriceStatus } from './hooks/usePrices'
import { RefreshCw } from 'lucide-react'

function App() {
  const { prices, loading, lastUpdate, fetchAllPrices } = usePrices()
  const { status } = usePriceStatus()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(price)
  }

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 頂部價格跑馬燈 */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2 sm:py-3 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
            <div className="flex items-center justify-between sm:space-x-8 mb-2 sm:mb-0">
              <div className="flex items-center space-x-3 sm:space-x-8 overflow-x-auto scrollbar-hide">
                {/* 黃金 */}
                <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0">
                  <span className="text-yellow-400 font-bold text-sm sm:text-lg">黃金</span>
                  <span className="text-yellow-300 font-semibold text-xs sm:text-sm">
                    {loading ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      formatPrice(prices.gold?.price || 3311.96)
                    )}
                  </span>
                  {prices.gold?.changePercent && (
                    <span className={`text-xs ${prices.gold.changePercent.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {prices.gold.changePercent}
                    </span>
                  )}
                </div>
                
                {/* 白銀 */}
                <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0">
                  <span className="text-gray-300 font-medium text-xs sm:text-sm">白銀</span>
                  <span className="text-gray-200 font-semibold text-xs sm:text-sm">
                    {loading ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      formatPrice(prices.silver?.price || 38.11)
                    )}
                  </span>
                  {prices.silver?.changePercent && (
                    <span className={`text-xs ${prices.silver.changePercent.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {prices.silver.changePercent}
                    </span>
                  )}
                </div>
                
                {/* 鉑金 - 手機版隱藏 */}
                <div className="hidden md:flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0">
                  <span className="text-gray-300 font-medium">鉑金</span>
                  <span className="text-gray-200 font-semibold">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      formatPrice(prices.platinum?.price || 1408.63)
                    )}
                  </span>
                  {prices.platinum?.changePercent && (
                    <span className={`text-xs ${prices.platinum.changePercent.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {prices.platinum.changePercent}
                    </span>
                  )}
                </div>
                
                {/* 銅 - 手機版隱藏 */}
                <div className="hidden md:flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0">
                  <span className="text-gray-300 font-medium">銅</span>
                  <span className="text-gray-200 font-semibold">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      formatPrice(prices.copper?.price || 4.2)
                    )}
                  </span>
                  {prices.copper?.changePercent && (
                    <span className={`text-xs ${prices.copper.changePercent.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {prices.copper.changePercent}
                    </span>
                  )}
                </div>
              </div>
              
              {/* 更新時間和重新整理按鈕 */}
              <div className="flex items-center space-x-2">
                {lastUpdate && (
                  <span className="text-gray-400 text-xs">
                    更新: {formatTime(lastUpdate)}
                  </span>
                )}
                <button
                  onClick={fetchAllPrices}
                  disabled={loading}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="重新整理價格"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 統一導航欄 */}
      <Navbar />

      {/* 主要內容區域 */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/prices" element={<PriceChartPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/crm" element={<CRMPage />} />
        </Routes>
      </div>

      {/* AI 聊天小工具 */}
      <AIChatWidget />

      {/* 頁腳 */}
      <Footer />
    </div>
  )
}

export default App 