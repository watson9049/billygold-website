# 黃金比例 - 貴金屬彈性報價電商系統

## 📋 專案概況
- **專案名稱**: 黃金比例 - 貴金屬彈性報價電商系統
- **開發期間**: 2025年第三季
- **技術棧**: React + Node.js + SQLite + Tailwind CSS

## 🎯 專案特色
- **貴金屬彈性報價**: 支援黃金、白銀、鉑金、銅等多種貴金屬實時計價
- **智慧價格引擎**: 整合 TradingView API 和 Exchange Rate API，自動計算台灣價格
- **黃金比例算法**: 精確計算重量、工錢、匯率的最佳比例組合
- **完整電商功能**: 商品管理、購物車、用戶認證、訂單處理
- **響應式設計**: 支援桌面和行動裝置的優質用戶體驗
- **專業後台系統**: 商品上架、編輯、價格設定、客戶管理

## ✅ 已完成功能

### 🏪 商品管理系統
- **商品上架頁面** (`/admin/product-upload`)
  - 完整表單驗證
  - 圖片上傳功能
  - 規格和特色動態管理
  
- **商品管理頁面** (`/admin/product-management`)
  - 商品列表展示
  - 搜尋和篩選功能
  - 上架/下架操作
  - 編輯和刪除功能
  
- **商品編輯頁面** (`/admin/product-edit/:id`)
  - 預載入現有數據
  - 完整編輯功能

### 💰 價格引擎
- 即時金價獲取 (TradingView API)
- 匯率轉換 (Exchange Rate API)
- 自動價格計算
- 15分鐘更新間隔

### 🔐 認證系統
- JWT Token 認證
- 用戶角色管理
- 中間件保護

### 🛒 購物車功能
- 添加/移除商品
- 數量管理
- 價格計算
- **Note**: 目前有小bug需修復

### 🤖 AI 聊天功能
- OpenAI 整合
- 智能客服

### 📝 部落格系統
- 文章管理
- 分類標籤

## 🗄️ 資料庫結構
- **SQLite** 作為開發資料庫
- 完整的表格結構：
  - users (用戶)
  - products (商品)
  - cart_items (購物車)
  - price_history (價格歷史)
  - customers (客戶)
  - orders (訂單)

## 🌐 API 端點

### 商品相關
- `GET /api/products` - 獲取商品列表
- `POST /api/products` - 新增商品
- `PUT /api/products/:id` - 更新商品
- `DELETE /api/products/:id` - 刪除商品
- `GET /api/products/categories` - 獲取分類
- `GET /api/products/materials` - 獲取材質

### 價格相關
- `GET /api/prices/status` - 價格狀態
- `GET /api/prices/all-metals` - 所有金屬價格

### 認證相關
- `POST /api/auth/login` - 登入
- `POST /api/auth/register` - 註冊

## 🚀 部署資訊
- **開發環境**: http://localhost:5173 (前端)
- **API 服務**: http://localhost:3001 (後端)
- **目標部署**: DreamHost

## 🎉 新增功能 - WordPress 整合

### 💎 WordPress 電商系統
- **WordPress 核心** - 繁體中文版，完整安裝
- **金價計算器插件** - 完全整合你的 Node.js 價格引擎
- **WooCommerce 支援** - 動態價格計算
- **響應式設計** - 完美的行動裝置支援
- **自動化部署** - 一鍵部署到 DreamHost

### 🔧 技術亮點
- **雙系統架構** - 保留 React 系統，新增 WordPress 選項
- **API 橋接** - WordPress 呼叫你的金價引擎 API
- **實時更新** - 15分鐘自動價格更新
- **專業插件** - 完整的 WooCommerce 整合

## 💡 下一步計劃
1. **測試 WordPress 環境**
   - 本地測試 WordPress + WooCommerce
   - 驗證金價 API 整合
   - 測試插件功能

2. **GitHub 版本控制**
   - 建立 GitHub 存儲庫
   - 推送完整專案代碼
   - 設定版本標籤

3. **DreamHost 部署**
   - 執行自動化部署腳本
   - 配置生產環境資料庫
   - 測試線上功能

4. **Envato 模板整合**
   - 選擇合適的珠寶電商模板
   - 整合到 WordPress 系統
   - 客製化主題設計

5. **功能增強**
   - 訂單管理系統
   - 客戶管理
   - 銷售報表
   - 購物車修復 (React 版本)

## 🔧 技術債務
- 購物車路由需要修復
- 可能需要資料庫遷移到 MySQL (DreamHost)
- 圖片上傳需要實作真實檔案上傳

## 📝 重要程式碼片段
```javascript
// 價格計算邏輯
const formatPrice = (weight, craftsmanshipFee = 0) => {
  const goldPrice = 3311.96; // 台錢價格
  const totalPrice = (weight * goldPrice) + craftsmanshipFee;
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD'
  }).format(totalPrice);
};
```

## 📞 聯絡資訊
- **開發環境路徑**: `/Users/tsff_27/2025Q3_2`
- **主要開發工具**: Cursor, Node.js, React