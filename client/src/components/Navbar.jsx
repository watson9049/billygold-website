import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Crown, ShoppingCart, Heart, User, ChevronDown, Search, RefreshCw, Menu, LogOut } from 'lucide-react'
import { authService } from '../services/authService'
import { cartService } from '../services/cartService'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    // 檢查用戶認證狀態
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      const user = authService.getCurrentUserFromStorage()
      setIsAuthenticated(authenticated)
      setCurrentUser(user)
      
      // 如果已登入，獲取購物車數量
      if (authenticated) {
        fetchCartItemsCount()
      } else {
        setCartItemsCount(0)
      }
    }

    checkAuth()
    // 監聽 localStorage 變化
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // 獲取購物車商品數量
  const fetchCartItemsCount = async () => {
    try {
      const response = await cartService.getCartItems()
      setCartItemsCount(response.data.summary.totalItems)
    } catch (error) {
      // 忽略錯誤，保持數量為0
      setCartItemsCount(0)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setShowUserMenu(false)
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

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
              <Link to="/cart" className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-yellow-600 cursor-pointer group">
                <div className="p-2 rounded-lg group-hover:bg-yellow-50 transition-colors relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">我的購物車</div>
                  <div className="text-xs text-gray-400">{cartItemsCount} 件商品</div>
                </div>
              </Link>
              
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
              <div className="relative">
                <div 
                  className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 cursor-pointer group"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="p-2 rounded-lg group-hover:bg-yellow-50 transition-colors">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-medium">
                      {isAuthenticated ? `您好! ${currentUser?.username || 'User'}` : '您好! Guest'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isAuthenticated ? '管理帳戶' : '登入/註冊'}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </div>

                {/* 用戶下拉選單 */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <div className="font-medium">{currentUser?.username}</div>
                          <div className="text-xs text-gray-500">{currentUser?.email}</div>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          個人資料
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          登出
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleLogin}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          登入
                        </button>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          註冊
                        </Link>
                      </>
                    )}
                  </div>
                )}
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
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300'
                }`}
              >
                首頁
              </Link>
              
              <Link
                to="/products"
                className={`font-bold text-sm sm:text-base border-b-2 pb-1 transition-colors flex-shrink-0 ${
                  location.pathname.startsWith('/products') 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300'
                }`}
              >
                商品
              </Link>
              
              <Link
                to="/prices"
                className={`font-bold text-sm sm:text-base border-b-2 pb-1 transition-colors flex-shrink-0 ${
                  location.pathname === '/prices' 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300'
                }`}
              >
                價格走勢
              </Link>
              
              <Link
                to="/blog"
                className={`font-bold text-sm sm:text-base border-b-2 pb-1 transition-colors flex-shrink-0 ${
                  location.pathname.startsWith('/blog') 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300'
                }`}
              >
                部落格
              </Link>
              
              <Link
                to="/chat"
                className={`font-bold text-sm sm:text-base border-b-2 pb-1 transition-colors flex-shrink-0 ${
                  location.pathname === '/chat' 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300'
                }`}
              >
                AI 客服
              </Link>
              
              {isAuthenticated && currentUser?.role === 'admin' && (
                <>
                  <Link
                    to="/crm"
                    className={`font-bold text-sm sm:text-base border-b-2 pb-1 transition-colors flex-shrink-0 ${
                      location.pathname === '/crm' 
                        ? 'border-yellow-500 text-yellow-600' 
                        : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300'
                    }`}
                  >
                    CRM
                  </Link>
                  
                  <Link
                    to="/admin"
                    className={`font-bold text-sm sm:text-base border-b-2 pb-1 transition-colors flex-shrink-0 ${
                      location.pathname === '/admin' 
                        ? 'border-yellow-500 text-yellow-600' 
                        : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300'
                    }`}
                  >
                    管理後台
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar 