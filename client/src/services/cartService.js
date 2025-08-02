import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// 創建axios實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 請求攔截器：自動添加認證token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 響應攔截器：處理認證錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const cartService = {
  // 獲取購物車商品
  async getCartItems() {
    try {
      const response = await api.get('/api/cart')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取購物車失敗')
    }
  },

  // 添加商品到購物車
  async addToCart(productId, quantity = 1) {
    try {
      const response = await api.post('/api/cart', {
        product_id: productId,
        quantity
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '添加到購物車失敗')
    }
  },

  // 更新購物車商品數量
  async updateCartItem(itemId, quantity) {
    try {
      const response = await api.put(`/api/cart/${itemId}`, {
        quantity
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新購物車失敗')
    }
  },

  // 從購物車移除商品
  async removeFromCart(itemId) {
    try {
      const response = await api.delete(`/api/cart/${itemId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '移除商品失敗')
    }
  },

  // 清空購物車
  async clearCart() {
    try {
      const response = await api.delete('/api/cart')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || '清空購物車失敗')
    }
  }
} 