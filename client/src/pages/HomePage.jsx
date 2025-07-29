import { Link } from 'react-router-dom'
import { Crown, TrendingUp, Shield, Star, ArrowRight, Sparkles, Search, ShoppingCart, Heart, User, ChevronDown, Menu, Award, Clock, Users, RefreshCw, BookOpen } from 'lucide-react'
import { usePrices, usePriceStatus } from '../hooks/usePrices'
import AIChatWidget from '../components/AIChatWidget'
import { useState } from 'react'
import { TradingViewWidget } from '../components/TradingViewWidget'

function HomePage() {
  const { prices, loading, lastUpdate, fetchAllPrices } = usePrices()
  const { status } = usePriceStatus()
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner - 優化 RWD */}
      <section className="relative bg-gradient-to-br from-green-50 via-yellow-50 to-green-50 py-12 sm:py-20 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 sm:w-32 h-20 sm:h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-24 sm:w-40 h-24 sm:h-40 bg-green-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            {/* 左側產品展示 */}
            <div className="relative order-2 lg:order-1">
              <div className="flex space-x-4 sm:space-x-6 mb-6 sm:mb-8">
                <div className="w-24 sm:w-36 h-24 sm:h-36 bg-gradient-to-br from-green-100 to-green-200 rounded-xl sm:rounded-2xl border-2 border-green-300 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="w-12 sm:w-20 h-12 sm:h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg sm:rounded-xl mb-2 sm:mb-3 shadow-inner"></div>
                    <span className="text-xs sm:text-sm text-green-800 font-semibold">翠玉白菜</span>
                  </div>
                </div>
                <div className="w-24 sm:w-36 h-24 sm:h-36 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-2 sm:p-4 shadow-lg">
                  <div className="text-xs space-y-1 sm:space-y-2">
                    <div className="font-bold text-gray-900 text-xs sm:text-xs">JADEITE CABBAGE</div>
                    <div className="text-gray-600 text-xs">純度 Fineness Au 99.99</div>
                    <div className="text-gray-600 text-xs">重量 Weight 1g</div>
                    <div className="text-yellow-600 font-bold text-xs">TRUNEY FINE GOLD 900.0</div>
                  </div>
                </div>
              </div>
              
              {/* 主要產品展示 */}
              <div className="relative">
                <div className="w-48 sm:w-80 h-24 sm:h-40 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl sm:rounded-2xl shadow-2xl transform rotate-3"></div>
                <div className="absolute inset-0 w-48 sm:w-80 h-24 sm:h-40 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl sm:rounded-2xl shadow-xl transform -rotate-2"></div>
                <div className="absolute inset-0 w-48 sm:w-80 h-24 sm:h-40 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-xl sm:rounded-2xl shadow-lg transform rotate-1"></div>
              </div>
              
              <div className="mt-4 sm:mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                    <span>國立故宮博物院</span>
                  </div>
                  <div className="w-px h-3 sm:h-4 bg-gray-300"></div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                    <span>黃金比例 billygold.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側文案 */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
                  The Treasure of the Palace Museum
                  <span className="block text-yellow-600 mt-1 sm:mt-2">故宮鎮館之寶·黃金重生!</span>
                </h1>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <p className="text-lg sm:text-xl text-gray-600 mb-2 sm:mb-4 leading-relaxed">
                  故宮100週年翠玉白菜金條1公克
                </p>
                <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                  故宮百年珍寶·黃金聚財傳家
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold text-base sm:text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  立即收藏
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
                <Link
                  to="/chat"
                  className="inline-flex items-center px-4 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-base sm:text-lg rounded-xl border-2 border-gray-200 hover:border-yellow-300 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  比例先生諮詢
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 即時金價區塊 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">即時金價資訊</h2>
            <p className="text-lg text-gray-600">掌握最新黃金市場動態，投資決策更精準</p>
          </div>

          {/* 價格卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* 黃金 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-yellow-800">黃金</h3>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-900 mb-2">
                {loading ? (
                  <div className="w-24 h-6 bg-yellow-200 rounded animate-pulse"></div>
                ) : (
                  `$${formatPrice(prices.gold?.price || 3311.96)}`
                )}
              </div>
              <div className="text-sm text-yellow-700">
                {prices.gold?.changePercent || '+0.38%'}
              </div>
            </div>

            {/* 白銀 */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">白銀</h3>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? (
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `$${formatPrice(prices.silver?.price || 38.11)}`
                )}
              </div>
              <div className="text-sm text-gray-700">
                {prices.silver?.changePercent || '-0.60%'}
              </div>
            </div>

            {/* 鉑金 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-800">鉑金</h3>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-2">
                {loading ? (
                  <div className="w-24 h-6 bg-blue-200 rounded animate-pulse"></div>
                ) : (
                  `$${formatPrice(prices.platinum?.price || 1408.63)}`
                )}
              </div>
              <div className="text-sm text-blue-700">
                {prices.platinum?.changePercent || '+0.64%'}
              </div>
            </div>
            
            {/* 銅 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-orange-800">銅</h3>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-900 mb-2">
                {loading ? (
                  <div className="w-20 h-6 bg-orange-200 rounded animate-pulse"></div>
                ) : (
                  `$${formatPrice(prices.copper?.price || 4.2)}`
                )}
              </div>
              <div className="text-sm text-orange-700">
                {prices.copper?.changePercent || '+0.50%'}
              </div>
            </div>
          </div>

          {/* TradingView 圖表 */}
          <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl border border-yellow-200 bg-white">
            <TradingViewWidget symbol="GOLD" theme="light" height={400} />
          </div>

          {/* 查看詳細按鈕 */}
          <div className="text-center mt-8">
            <Link
              to="/prices"
              className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              查看詳細價格圖表
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 精選商品 */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">精選黃金商品</h2>
            <p className="text-lg text-gray-600">高純度黃金條塊，投資收藏首選</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: '1台錢黃金條塊', weight: 1, price: 12700, originalPrice: 13200 },
              { name: '5台錢黃金條塊', weight: 5, price: 63500, originalPrice: 66000 },
              { name: '10台錢黃金條塊', weight: 10, price: 127000, originalPrice: 132000 }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl focus-within:shadow-2xl focus-within:scale-105">
                {/* 商品圖片 */}
                <div className="relative h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                  <div className="w-24 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-inner"></div>
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-bounce group-hover:animate-none">精選</div>
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">-4%</div>
                </div>

                {/* 商品資訊 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 group-focus:text-yellow-600 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>純度:</span>
                      <span className="font-semibold">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>重量:</span>
                      <span className="font-semibold">{product.weight}台錢</span>
                    </div>
                    <div className="flex justify-between">
                      <span>庫存:</span>
                      <span className="font-semibold">50件</span>
                    </div>
                  </div>

                  {/* 價格 */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      NT$ {loading ? <span className='inline-block w-16 h-6 bg-yellow-100 rounded animate-pulse'></span> : new Intl.NumberFormat('zh-TW').format(Math.round(product.price))}
                    </div>
                    <div className="text-lg text-gray-400 line-through">
                      NT$ {new Intl.NumberFormat('zh-TW').format(product.originalPrice)}
                    </div>
                  </div>

                  <Link
                    to="/products"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-700 text-white font-bold py-4 px-6 rounded-xl text-center block transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                  >
                    立即購買
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 查看更多按鈕 */}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-200 hover:border-yellow-300 transition-all duration-200 shadow-lg"
            >
              查看更多商品
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>



      {/* 黃金投資知識庫 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">黃金投資知識庫</h2>
            <p className="text-lg text-gray-600">專業投資知識，助您做出明智決策</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: '黃金投資入門指南', excerpt: '了解黃金投資的基本概念、優勢和風險管理策略...', author: '比例先生', date: '2024-01-15', readTime: '5分鐘' },
              { title: '如何選擇適合的黃金商品', excerpt: '從投資目標、預算、風險承受度等角度分析...', author: '比例先生', date: '2024-01-12', readTime: '8分鐘' },
              { title: '黃金價格走勢分析', excerpt: '深入分析影響黃金價格的各種因素和市場趨勢...', author: '比例先生', date: '2024-01-10', readTime: '12分鐘' }
            ].map((article, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors group cursor-pointer">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">投資知識</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 查看更多按鈕 */}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-200 hover:border-yellow-300 transition-all duration-200 shadow-lg"
            >
              查看更多文章
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>



      {/* AI 聊天元件 */}
      <AIChatWidget />
    </div>
  )
}

export default HomePage 