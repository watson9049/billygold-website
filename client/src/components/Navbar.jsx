import { Link, useLocation } from 'react-router-dom'
import { Crown, ShoppingCart, Heart, User, ChevronDown, Search, RefreshCw, Menu } from 'lucide-react'

function Navbar() {
  const location = useLocation()

  return (
    <>
      {/* 主要導航欄 */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Crown className="w-4 h-4 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    黃金比例
                  </div>
                  <div className="text-xs text-gray-500 font-medium hidden sm:block">billygold.com</div>
                </div>
              </Link>
            </div>

            {/* 搜尋欄 - 行動裝置隱藏 */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-12">
              <div className="relative w-full">
                <select className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-100 border-0 text-sm text-gray-600 rounded-l-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <option>全部</option>
                  <option>黃金</option>
                  <option>白銀</option>
                  <option>飾品</option>
                </select>
                <input
                  type="text"
                  placeholder="搜尋商品..."
                  className="w-full pl-24 pr-16 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base sm:text-lg transition-all duration-200"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md">
                  搜尋
                </button>
              </div>
            </div>

            {/* 用戶功能 - 行動裝置簡化 */}
            <div className="flex items-center space-x-2 sm:space-x-8">
              {/* 購物車 - 手機版隱藏 */}
              <div className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-yellow-600 cursor-pointer group">
                <div className="p-2 rounded-lg group-hover:bg-yellow-50 transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">我的購物車</div>
                  <div className="text-xs text-gray-400">0 件商品</div>
                </div>
              </div>
              
              {/* 願望清單 - 手機版隱藏 */}
              <div className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-yellow-600 cursor-pointer group">
                <div className="p-2 rounded-lg group-hover:bg-yellow-50 transition-colors">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">我的願望清單</div>
                  <div className="text-xs text-gray-400">收藏商品</div>
                </div>
              </div>
              
              {/* 用戶選單 */}
              <div className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 cursor-pointer group">
                <div className="p-2 rounded-lg group-hover:bg-yellow-50 transition-colors">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium">您好! Guest</div>
                  <div className="text-xs text-gray-400">登入/註冊</div>
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </div>
              
              {/* 手機版選單按鈕 */}
              <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 次級導航欄 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between py-3 sm:py-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-4 sm:space-x-10 text-xs sm:text-sm min-w-max">
              <Link
                to="/"
                className={`font-bold text-sm sm:text-base border-b-2 pb-1 transition-colors flex-shrink-0 ${
                  location.pathname === '/'
                    ? 'text-yellow-600 border-yellow-600'
                    : 'text-gray-700 border-transparent hover:text-yellow-600'
                }`}
              >
                精選
              </Link>
              <Link
                to="/products"
                className={`font-medium border-b-2 pb-1 transition-colors flex-shrink-0 ${
                  location.pathname === '/products'
                    ? 'text-yellow-600 border-yellow-600'
                    : 'text-gray-700 border-transparent hover:text-yellow-600'
                }`}
              >
                黃金
              </Link>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 cursor-pointer group flex-shrink-0">
                <span className="font-medium">白銀</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform" />
              </div>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 cursor-pointer group flex-shrink-0">
                <span className="font-medium">飾品</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform" />
              </div>
              <Link
                to="/recycling"
                className={`font-medium transition-colors flex-shrink-0 ${
                  location.pathname === '/recycling'
                    ? 'text-yellow-600'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                貴金屬回收
              </Link>
              <Link
                to="/price-chart"
                className={`font-medium transition-colors flex-shrink-0 ${
                  location.pathname === '/price-chart'
                    ? 'text-yellow-600'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                價格走勢
              </Link>
              <Link
                to="/blog"
                className={`font-medium transition-colors flex-shrink-0 ${
                  location.pathname === '/blog'
                    ? 'text-yellow-600'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                投資知識
              </Link>
              <Link
                to="/appointment"
                className={`font-medium transition-colors flex-shrink-0 ${
                  location.pathname === '/appointment'
                    ? 'text-yellow-600'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                線上預約
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar 