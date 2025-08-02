import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// 創建 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API 請求: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API 請求錯誤:', error);
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API 響應: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API 響應錯誤:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// CRM API 服務
export const crmService = {
  // 獲取客戶列表
  async getCustomers(params = {}) {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '獲取客戶列表失敗');
    }
  },

  // 獲取客戶詳情
  async getCustomer(id) {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '獲取客戶詳情失敗');
    }
  },

  // 創建新客戶
  async createCustomer(customerData) {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '創建客戶失敗');
    }
  },

  // 更新客戶資料
  async updateCustomer(id, customerData) {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '更新客戶資料失敗');
    }
  },

  // 刪除客戶
  async deleteCustomer(id) {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '刪除客戶失敗');
    }
  },

  // 獲取客戶統計概覽
  async getCustomerStats() {
    try {
      const response = await api.get('/customers/stats/overview');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '獲取客戶統計失敗');
    }
  },

  // 搜尋客戶
  async searchCustomers(query) {
    try {
      const response = await api.get('/customers', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '搜尋客戶失敗');
    }
  }
};

export default crmService; 