# 部署說明

## DreamHost部署步驟

### 1. 上傳檔案
將整個deploy目錄上傳到您的DreamHost網站根目錄

### 2. 設定環境變數
- 複製 .env.example 為 .env
- 修改資料庫連線設定
- 設定API金鑰

### 3. 安裝依賴
```bash
cd server
npm install
```

### 4. 啟動服務
```bash
cd server
npm start
```

### 5. 設定域名
在DreamHost控制台設定您的域名指向此目錄

## 檔案結構
```
deploy/
├── client/          # 前端靜態檔案
├── server/          # 後端Node.js應用
├── .env.example     # 環境變數範例
├── README.md        # 專案說明
└── DEPLOYMENT.md    # 部署說明
```
