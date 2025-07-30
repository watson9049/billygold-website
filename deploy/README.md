# 銀樓智慧大腦 (彈性報價版)

## 專案概述

為台灣傳統銀樓打造的智慧電商系統，整合動態價格引擎、AI推薦系統和客戶管理功能。

## 核心功能

### 1. 動態價格引擎 (The Live Price Engine)
- 自動抓取國際金價
- 彈性報價機制 (15分鐘-24小時可調)
- 在地化價格換算 (新台幣/台錢)
- 工錢自動計算

### 2. AI 智慧客服 (The AI Brain)
- 向量資料庫商品搜尋
- 智能推薦系統
- 自然語言對話介面

### 3. 整合式客戶管理 (Simple CRM)
- 客戶資料管理
- 訂單追蹤
- 銷售分析

## 技術架構

### 後端 (Backend)
- **框架**: Node.js + Express.js
- **資料庫**: PostgreSQL
- **API**: RESTful API
- **價格更新**: 排程任務

### 前端 (Frontend)
- **框架**: React + Vite
- **樣式**: Tailwind CSS
- **狀態管理**: React Context
- **路由**: React Router

## 專案結構

```
silver-jewelry-ai-brain/
├── server/                 # 後端 API
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 資料模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 業務邏輯
│   │   ├── utils/          # 工具函數
│   │   └── middleware/     # 中間件
│   └── package.json
├── client/                 # 前端應用
│   ├── src/
│   │   ├── components/     # React 組件
│   │   ├── pages/          # 頁面
│   │   ├── hooks/          # 自定義 Hooks
│   │   ├── services/       # API 服務
│   │   └── utils/          # 工具函數
│   └── package.json
└── docs/                   # 文件
```

## 快速開始

1. 安裝依賴
```bash
npm run install:all
```

2. 設定環境變數
```bash
cp .env.example .env
# 編輯 .env 檔案
```

3. 啟動開發伺服器
```bash
npm run dev
```

## 開發階段

- [x] 專案架構設計
- [ ] 後端基礎架構
- [ ] 資料庫設計
- [ ] 動態價格引擎
- [ ] 前端基礎架構
- [ ] AI 推薦系統
- [ ] CRM 功能
- [ ] 整合測試

## 貢獻指南

請參考 `CONTRIBUTING.md` 了解如何參與專案開發。

## 授權

MIT License 