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

// 請求攔截器 - 添加 JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器 - 處理認證錯誤
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除本地存儲
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 認證服務
export const authService = {
  // 用戶註冊
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        // 保存 token 和用戶資訊
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '註冊失敗');
    }
  },

  // 用戶登入
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        // 保存 token 和用戶資訊
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '登入失敗');
    }
  },

  // 登出
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // 獲取當前用戶資訊
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取用戶資訊失敗');
    }
  },

  // 更新用戶資料
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      
      if (response.data.success) {
        // 更新本地存儲的用戶資訊
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新資料失敗');
    }
  },

  // 更改密碼
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更改密碼失敗');
    }
  },

  // 忘記密碼
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '忘記密碼請求失敗');
    }
  },

  // 重置密碼
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '重置密碼失敗');
    }
  },

  // 忘記帳號
  async forgotUsername(email) {
    try {
      const response = await api.post('/auth/forgot-username', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '忘記帳號請求失敗');
    }
  },

  // 驗證 Email
  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Email 驗證失敗');
    }
  },

  // 發送手機驗證碼
  async sendPhoneVerification(phone) {
    try {
      const response = await api.post('/auth/send-phone-verification', { phone });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '發送手機驗證碼失敗');
    }
  },

  // 驗證手機驗證碼
  async verifyPhoneCode(code) {
    try {
      const response = await api.post('/auth/verify-phone', { code });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '手機驗證失敗');
    }
  },

  // 檢查帳戶狀態
  async checkAccountStatus() {
    try {
      const response = await api.get('/auth/account-status');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '檢查帳戶狀態失敗');
    }
  },

  // 重新發送 Email 驗證
  async resendEmailVerification(email) {
    try {
      const response = await api.post('/auth/resend-email-verification', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '重新發送驗證郵件失敗');
    }
  },

  // 檢查是否已登入
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // 獲取當前用戶
  getCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // 獲取 token
  getToken() {
    return localStorage.getItem('token');
  }
};

export default authService; 