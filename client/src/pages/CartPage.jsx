import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, ArrowLeft } from 'lucide-react'
import { cartService } from '../services/cartService'
import { authService } from '../services/authService'

function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [summary, setSummary] = useState({ totalItems: 0, totalAmount: 0 })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    // 檢查用戶是否已登入
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    fetchCartItems()
  }, [navigate])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await cartService.getCartItems()
      setCartItems(response.data.items)
      setSummary(response.data.summary)
    } catch (error) {
      console.error('獲取購物車失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }))
      await cartService.updateCartItem(itemId, newQuantity)
      await fetchCartItems() // 重新獲取購物車數據
    } catch (error) {
      console.error('更新數量失敗:', error)
      alert('更新數量失敗：' + error.message)
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }))
    }
  }

  const removeItem = async (itemId) => {
    if (!confirm('確定要移除這個商品嗎？')) return

    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }))
      await cartService.removeFromCart(itemId)
      await fetchCartItems()
    } catch (error) {
      console.error('移除商品失敗:', error)
      alert('移除商品失敗：' + error.message)
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }))
    }
  }

  const clearCart = async () => {
    if (!confirm('確定要清空購物車嗎？')) return

    try {
      setLoading(true)
      await cartService.clearCart()
      await fetchCartItems()
    } catch (error) {
      console.error('清空購物車失敗:', error)
      alert('清空購物車失敗：' + error.message)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入購物車中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題和返回按鈕 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/products')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-8 h-8 mr-3 text-yellow-600" />
              購物車
            </h1>
            <p className="text-gray-600 mt-1">
              {summary.totalItems > 0 ? `共 ${summary.totalItems} 件商品` : '購物車是空的'}
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // 空購物車狀態
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">購物車是空的</h3>
            <p className="text-gray-600 mb-8">還沒有添加任何商品到購物車</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              開始購物
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 購物車商品列表 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">商品清單</h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      清空購物車
                    </button>
                  )}
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* 商品圖片 */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>

                        {/* 商品信息 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.material} | {item.weight}台錢 | {item.category}
                          </p>
                          <p className="text-lg font-bold text-yellow-600 mt-2">
                            {formatPrice(item.unit_price)}
                          </p>
                        </div>

                        {/* 數量控制 */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating[item.id]}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          
                          <span className="w-8 text-center font-semibold">
                            {updating[item.id] ? '...' : item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating[item.id]}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        {/* 小計和刪除 */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.total_price)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating[item.id]}
                            className="mt-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="移除商品"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 訂單摘要 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">訂單摘要</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品數量</span>
                    <span className="font-semibold">{summary.totalItems} 件</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">小計</span>
                    <span className="font-semibold">{formatPrice(summary.totalAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">運費</span>
                    <span className="font-semibold text-green-600">免費</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">總計</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {formatPrice(summary.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert('結帳功能開發中...')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>前往結帳</span>
                </button>
                
                <button
                  onClick={() => navigate('/products')}
                  className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  繼續購物
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage 