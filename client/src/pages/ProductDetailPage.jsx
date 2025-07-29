import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Crown, ShoppingBag, Heart, Share2, Star } from 'lucide-react'

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // 模擬商品資料
  const mockProduct = {
    id: '1',
    name: '永恆愛戀戒指',
    description: '經典六爪鑲嵌設計，完美展現鑽石光芒。採用18K黃金製作，搭配精選鑽石，是求婚、結婚紀念日的完美選擇。',
    weight: 3.5,
    material: '18K黃金',
    category: '戒指',
    price: 45000,
    originalPrice: 52000,
    image: '/api/placeholder/600/600',
    specifications: {
      '材質': '18K黃金',
      '重量': '3.5台錢',
      '鑽石': '0.5克拉',
      '淨度': 'VS1',
      '顏色': 'F',
      '切工': 'Excellent'
    },
    features: [
      '經典六爪鑲嵌設計',
      '完美鑽石切工',
      '18K黃金材質',
      '附贈精美包裝盒',
      '終身保固服務'
    ]
  }

  useEffect(() => {
    // 模擬API調用
    setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入商品詳情中...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">商品不存在</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="card">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg">
              <div className="w-full h-96 bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                <Crown className="w-32 h-32 text-gold-600" />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="p-2 rounded-lg border border-gray-200 hover:border-primary-500 transition-colors">
                <Heart className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-lg border border-gray-200 hover:border-primary-500 transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8/5)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="price-tag">NT$ {product.price.toLocaleString()}</span>
                <span className="text-lg text-gray-500 line-through">
                  NT$ {product.originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  限時優惠
                </span>
              </div>
              <p className="text-sm text-gray-600">
                價格已包含工錢，實際價格以當日金價為準
              </p>
            </div>

            {/* Specifications */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">商品規格</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">商品特色</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-4">
                <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>立即購買</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 px-6">
                  <Heart className="w-5 h-5" />
                  <span>收藏</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage 