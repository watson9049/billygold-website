# API金鑰安全指南

## 🔒 安全問題處理

### 問題描述
您的OpenAI API金鑰已被檢測到洩露並被禁用。

### 立即處理步驟

#### 1. 創建新的OpenAI API金鑰
1. 前往：https://platform.openai.com/api-keys
2. 登入帳號：watson@piad.com.tw
3. 點擊 "Create new secret key"
4. 命名為 "billygold-website"
5. 複製新的API金鑰

#### 2. 更新本地環境變數
1. 在專案根目錄創建 `.env` 檔案
2. 填入新的API金鑰：
```bash
OPENAI_API_KEY=
```

#### 3. 測試API連線
```bash
# 測試本地開發環境
npm run dev
```

### 安全最佳實踐

#### ✅ 正確做法
- 使用 `.env` 檔案儲存敏感資訊
- 將 `.env` 加入 `.gitignore`
- 定期更換API金鑰
- 使用環境變數而非硬編碼

#### ❌ 避免做法
- 不要將API金鑰提交到GitHub
- 不要在程式碼中硬編碼金鑰
- 不要分享API金鑰
- 不要將金鑰儲存在公開位置

### 部署環境設定

#### 本地開發
```bash
# .env 檔案
OPENAI_API_KEY=
#### DreamHost部署
```bash
# 在伺服器上設定環境變數
OPENAI_API_KEY=

### 故障排除

#### 常見問題
1. **API金鑰無效**
   - 檢查金鑰是否正確複製
   - 確認金鑰沒有多餘的空格

2. **權限錯誤**
   - 確認API金鑰有足夠的權限
   - 檢查帳號餘額

3. **網路連線問題**
   - 檢查網路連線
   - 確認防火牆設定

### 監控和維護

#### 定期檢查
- 每月檢查API使用量
- 監控異常使用模式
- 定期更換API金鑰

#### 備份策略
- 保存多個API金鑰
- 準備緊急更換方案
- 記錄所有金鑰用途

## 🎯 完成檢查清單

- [ ] 創建新的OpenAI API金鑰
- [ ] 更新本地 `.env` 檔案
- [ ] 測試本地開發環境
- [ ] 更新部署環境變數
- [ ] 確認 `.gitignore` 包含 `.env`
- [ ] 測試AI聊天功能 