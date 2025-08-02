import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Crown, Search, Filter, Star, TrendingUp, Shield, ShoppingCart, Heart, User, ChevronDown, Menu, ArrowLeft, Award, Clock, Users } from 'lucide-react'
import { cartService } from '../services/cartService'
import { authService } from '../services/authService'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    material: '',
    search: ''
  })
  const [addingToCart, setAddingToCart] = useState({})

  // 模擬黃金條塊商品資料
  const mockProducts = [
    {
      id: '1',
      name: '1台錢黃金條塊',
      description: '精選99.9%純金，標準規格1台錢，適合小額投資或收藏。每塊均附帶國際認證保證書。',
      weight: 1,
      material: '24K黃金',
      category: '黃金條塊',
      purity: '99.9%',
      price: 12700,
      original_price: 13200,
      discount: 4,
      is_featured: true,
      stock: 50,
      images: ['/api/placeholder/600/600'],
      specifications: {
        '重量': '1台錢 (3.75公克)',
        '純度': '99.9%',
        '尺寸': '20mm × 10mm × 2mm',
        '認證': '國際認證',
        '包裝': '精美包裝盒'
      },
      features: [
        '99.9%純金製作',
        '國際認證保證',
        '精美包裝',
        '投資收藏兩相宜',
        '可回購'
      ],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: '5台錢黃金條塊',
      description: '5台錢黃金條塊，適合中等投資需求。高純度黃金，保值增值首選。',
      weight: 5,
      material: '24K黃金',
      category: '黃金條塊',
      purity: '99.9%',
      price: 63500,
      original_price: 66000,
      discount: 4,
      is_featured: true,
      stock: 30,
      images: ['/api/placeholder/600/600'],
      specifications: {
        '重量': '5台錢 (18.75公克)',
        '純度': '99.9%',
        '尺寸': '35mm × 15mm × 3mm',
        '認證': '國際認證',
        '包裝': '精美包裝盒'
      },
      features: [
        '99.9%純金製作',
        '國際認證保證',
        '精美包裝',
        '投資收藏兩相宜',
        '可回購'
      ],
      created_at: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: '10台錢黃金條塊',
      description: '10台錢黃金條塊，大規格投資選擇。高純度黃金，適合長期投資。',
      weight: 10,
      material: '24K黃金',
      category: '黃金條塊',
      purity: '99.9%',
      price: 127000,
      original_price: 132000,
      discount: 4,
      is_featured: false,
      stock: 20,
      images: ['/api/placeholder/600/600'],
      specifications: {
        '重量': '10台錢 (37.5公克)',
        '純度': '99.9%',
        '尺寸': '45mm × 20mm × 4mm',
        '認證': '國際認證',
        '包裝': '精美包裝盒'
      },
      features: [
        '99.9%純金製作',
        '國際認證保證',
        '精美包裝',
        '投資收藏兩相宜',
        '可回購'
      ],
      created_at: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      name: '1兩黃金條塊',
      description: '1兩黃金條塊，重量級投資選擇。高純度黃金，適合大額投資。',
      weight: 37.5,
      material: '24K黃金',
      category: '黃金條塊',
      purity: '99.9%',
      price: 476250,
      original_price: 495000,
      discount: 4,
      is_featured: true,
      stock: 15,
      images: ['/api/placeholder/600/600'],
      specifications: {
        '重量': '1兩 (37.5公克)',
        '純度': '99.9%',
        '尺寸': '60mm × 25mm × 5mm',
        '認證': '國際認證',
        '包裝': '精美包裝盒'
      },
      features: [
        '99.9%純金製作',
        '國際認證保證',
        '精美包裝',
        '投資收藏兩相宜',
        '可回購'
      ],
      created_at: '2024-01-04T00:00:00Z'
    },
    {
      id: '5',
      name: '5兩黃金條塊',
      description: '5兩黃金條塊，重量級投資選擇。高純度黃金，適合大額投資。',
      weight: 187.5,
      material: '24K黃金',
      category: '黃金條塊',
      purity: '99.9%',
      price: 2381250,
      original_price: 2475000,
      discount: 4,
      is_featured: false,
      stock: 10,
      images: ['/api/placeholder/600/600'],
      specifications: {
        '重量': '5兩 (187.5公克)',
        '純度': '99.9%',
        '尺寸': '80mm × 40mm × 8mm',
        '認證': '國際認證',
        '包裝': '精美包裝盒'
      },
      features: [
        '99.9%純金製作',
        '國際認證保證',
        '精美包裝',
        '投資收藏兩相宜',
        '可回購'
      ],
      created_at: '2024-01-05T00:00:00Z'
    },
    {
      id: '6',
      name: '10兩黃金條塊',
      description: '10兩黃金條塊，重量級投資選擇。高純度黃金，適合大額投資。',
      weight: 375,
      material: '24K黃金',
      category: '黃金條塊',
      purity: '99.9%',
      price: 4762500,
      original_price: 4950000,
      discount: 4,
      is_featured: true,
      stock: 5,
      images: ['/api/placeholder/600/600'],
      specifications: {
        '重量': '10兩 (375公克)',
        '純度': '99.9%',
        '尺寸': '100mm × 50mm × 10mm',
        '認證': '國際認證',
        '包裝': '精美包裝盒'
      },
      features: [
        '99.9%純金製作',
        '國際認證保證',
        '精美包裝',
        '投資收藏兩相宜',
        '可回購'
      ],
      created_at: '2024-01-06T00:00:00Z'
    }
  ]

  useEffect(() => {
    // 模擬API調用
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  // 篩選商品
  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.material && product.material !== filters.material) return false
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(price)
  }

  // 添加到購物車
  const handleAddToCart = async (productId) => {
    if (!authService.isAuthenticated()) {
      alert('請先登入會員')
      return
    }

    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }))
      await cartService.addToCart(productId, 1)
      alert('商品已添加到購物車！')
    } catch (error) {
      alert('添加失敗：' + error.message)
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首頁
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">黃金條塊</h1>
                <p className="text-gray-600">精選高純度黃金條塊，投資收藏兩相宜</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左側篩選欄 */}
          <div className="lg:w-64">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h3 className="text-lg font-bold text-gray-900 mb-4">篩選條件</h3>
              
              {/* 商品分類 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">商品分類</h4>
                <div className="space-y-2">
                  {['黃金條塊', '白銀條塊', '收藏幣', '飾品'].map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 材質 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">材質</h4>
                <div className="space-y-2">
                  {['24K黃金', '18K黃金', '白銀', '鉑金'].map((material) => (
                    <label key={material} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="material"
                        value={material}
                        checked={filters.material === material}
                        onChange={(e) => setFilters({...filters, material: e.target.value})}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 清除篩選 */}
              <button
                onClick={() => setFilters({category: '', material: '', search: ''})}
                className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                清除篩選
              </button>
            </div>
          </div>

          {/* 右側商品列表 */}
          <div className="flex-1">
            {/* 排序和結果統計 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                找到 {filteredProducts.length} 個商品
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">排序:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                  <option>價格由低到高</option>
                  <option>價格由高到低</option>
                  <option>最新上架</option>
                  <option>熱門程度</option>
                </select>
              </div>
            </div>

            {/* 商品網格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* 商品圖片 */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                      <div className="w-32 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg"></div>
                    </div>
                    
                    {/* 標籤 */}
                    <div className="absolute top-3 left-3">
                      {product.is_featured && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          精選
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{product.discount}%
                      </span>
                    </div>
                  </div>

                  {/* 商品資訊 */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    
                    {/* 規格 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">純度:</span>
                        <span className="font-medium">{product.purity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">重量:</span>
                        <span className="font-medium">{product.weight}台錢</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">庫存:</span>
                        <span className="font-medium">{product.stock}件</span>
                      </div>
                    </div>

                    {/* 價格 */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </div>
                    </div>

                    {/* 按鈕 */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart[product.id]}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                      >
                        {addingToCart[product.id] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        <span>{addingToCart[product.id] ? '添加中...' : '加入購物車'}</span>
                      </button>
                      <button className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 空狀態 */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">沒有找到符合條件的商品</h3>
                <p className="text-gray-600 mb-6">請嘗試調整篩選條件或搜尋關鍵字</p>
                <button
                  onClick={() => setFilters({category: '', material: '', search: ''})}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  清除篩選
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage 