# DreamHost部署指南 - billygold.com

## 🚀 部署步驟

### 第一步：準備檔案
✅ 部署檔案已準備完成：
- `billygold-deploy.tar.gz` (447KB)
- 包含完整的網站檔案

### 第二步：DreamHost控制台操作

#### 1. 登入DreamHost控制台
- 前往：https://panel.dreamhost.com
- 使用您的帳號登入

#### 2. 設定域名
- 前往 "Domains" → "Manage Domains"
- 確保 `billygold.com` 已設定並指向正確的目錄

#### 3. 創建資料庫
- 前往 "Databases" → "MySQL Databases"
- 創建新資料庫：
  - **資料庫名稱**: `billygold_db`
  - **用戶名**: `billygold_user`
  - **密碼**: 設定一個強密碼

### 第三步：上傳檔案

#### 方法A：使用File Manager
1. 前往 "Files" → "File Manager"
2. 導航到您的網站根目錄
3. 上傳 `billygold-deploy.tar.gz`
4. 解壓縮檔案

#### 方法B：使用FTP
1. 使用FTP客戶端連接到您的DreamHost伺服器
2. 上傳 `billygold-deploy.tar.gz` 到網站根目錄
3. 解壓縮檔案

### 第四步：設定環境變數

1. 在網站根目錄創建 `.env` 檔案
2. 複製 `env.example` 的內容到 `.env`
3. 填入實際的資料庫資訊和API金鑰

### 第五步：安裝依賴

在SSH終端機中執行：
```bash
cd server
npm install
```

### 第六步：啟動服務

```bash
cd server
npm start
```

## 📋 需要設定的環境變數

### 資料庫設定
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billygold_db
DB_USER=billygold_user
DB_PASSWORD=您的資料庫密碼
```

### API金鑰
```bash
OPENAI_API_KEY=您的OpenAI API金鑰
```

### 網站設定
```bash
SITE_URL=https://billygold.com
CLIENT_URL=https://billygold.com
```

## 🔧 故障排除

### 常見問題：
1. **資料庫連線失敗**
   - 檢查資料庫設定是否正確
   - 確認資料庫用戶權限

2. **API錯誤**
   - 檢查OpenAI API金鑰是否有效
   - 確認網路連線

3. **靜態檔案無法載入**
   - 檢查檔案權限
   - 確認路徑設定

## 📞 支援

如果遇到問題，請檢查：
1. DreamHost錯誤日誌
2. 應用程式日誌
3. 資料庫連線狀態

## 🎯 完成後測試

部署完成後，請測試：
- ✅ 網站首頁載入
- ✅ 金價資訊顯示
- ✅ AI聊天功能
- ✅ 響應式設計 