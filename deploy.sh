#!/bin/bash

# 部署腳本 - 打包並準備上傳到DreamHost
echo "🚀 開始部署流程..."

# 1. 安裝依賴
echo "📦 安裝依賴..."
npm run install:all

# 2. 構建前端
echo "🔨 構建前端..."
cd client
npm run build
cd ..

# 3. 創建部署目錄
echo "📁 創建部署目錄..."
rm -rf deploy
mkdir deploy
mkdir deploy/client
mkdir deploy/server

# 4. 複製前端構建檔案
echo "📋 複製前端檔案..."
cp -r client/dist/* deploy/client/

# 5. 複製後端檔案
echo "📋 複製後端檔案..."
cp -r server/src deploy/server/
cp server/package.json deploy/server/
cp server/package-lock.json deploy/server/

# 6. 複製環境設定
echo "⚙️ 複製環境設定..."
cp .env.example deploy/.env.example
cp README.md deploy/

# 7. 創建部署說明
echo "📝 創建部署說明..."
cat > deploy/DEPLOYMENT.md << 'EOF'
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
EOF

# 8. 創建壓縮檔
echo "🗜️ 創建壓縮檔..."
tar -czf billygold-deploy.tar.gz deploy/

echo "✅ 部署準備完成！"
echo "📦 壓縮檔: billygold-deploy.tar.gz"
echo "📁 部署目錄: deploy/"
echo ""
echo "🎯 下一步："
echo "1. 將 billygold-deploy.tar.gz 上傳到DreamHost"
echo "2. 解壓縮到網站根目錄"
echo "3. 按照 DEPLOYMENT.md 的說明進行設定" 