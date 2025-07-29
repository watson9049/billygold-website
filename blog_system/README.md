# AI 黃金知識部落格系統

這是一個結合 AI 自動生成和人工編輯的黃金投資知識部落格系統，能夠每天自動產生高品質的黃金投資文章。

## 🚀 系統特色

### AI 智慧生成
- **自動文章生成**：使用 OpenAI GPT 模型自動生成專業的黃金投資文章
- **SEO 優化**：自動生成 SEO 友善的標題和關鍵字
- **內容分類**：支援多種文章分類（投資策略、市場分析、實用知識等）
- **市場資料整合**：結合即時市場資料生成相關性高的內容

### 內容管理
- **文章管理**：完整的 CRUD 操作
- **分類管理**：支援文章分類和標籤
- **搜尋功能**：全文搜尋和標籤搜尋
- **統計分析**：瀏覽次數、點讚數等統計

### 前端展示
- **響應式設計**：支援各種裝置
- **美觀介面**：現代化的 UI/UX 設計
- **SEO 優化**：搜尋引擎友善的頁面結構
- **社交分享**：支援文章分享功能

## 📁 專案結構

```
blog_system/
├── blog_generator.py      # AI 文章生成器
├── blog_manager.py        # 部落格管理系統
├── requirements.txt       # Python 依賴
├── README.md             # 說明文件
└── data/                 # 資料儲存目錄
    ├── blog.db           # SQLite 資料庫
    └── articles/         # 文章檔案
```

## 🛠️ 安裝與設定

### 1. 安裝 Python 依賴

```bash
cd blog_system
pip install -r requirements.txt
```

### 2. 設定環境變數

創建 `.env` 檔案：

```env
OPENAI_API_KEY=your-openai-api-key-here
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=your-pinecone-environment
```

### 3. 初始化資料庫

```bash
python blog_manager.py
```

## 🎯 使用方式

### 生成每日文章

```python
from blog_generator import BlogGenerator

# 初始化生成器
generator = BlogGenerator(openai_api_key="your-key")

# 生成每日文章
article = generator.generate_daily_article()

# 儲存文章
generator.save_article(article)
```

### 管理文章

```python
from blog_manager import BlogManager

# 初始化管理器
manager = BlogManager()

# 獲取所有文章
articles = manager.get_articles()

# 發布文章
manager.publish_article("article_id")

# 搜尋文章
results = manager.search_articles("黃金投資")
```

## 📊 文章分類

系統支援以下文章分類：

1. **投資策略** - 黃金投資策略與方法
2. **市場分析** - 市場趨勢與技術分析
3. **實用知識** - 實用的投資知識與技巧
4. **歷史文化** - 黃金的歷史與文化價值
5. **時事評論** - 最新市場動態與評論

## 🔧 API 端點

### 文章管理
- `GET /api/blog` - 獲取文章列表
- `GET /api/blog/:id` - 獲取單篇文章
- `POST /api/blog/generate` - 生成新文章
- `PUT /api/blog/:id` - 更新文章
- `DELETE /api/blog/:id` - 刪除文章

### 分類和標籤
- `GET /api/blog/categories/all` - 獲取所有分類
- `GET /api/blog/tags/popular` - 獲取熱門標籤

### 搜尋
- `GET /api/blog/search/:keyword` - 搜尋文章

## 🤖 AI 生成流程

1. **主題選擇**：系統隨機選擇文章主題和分類
2. **大綱生成**：使用 GPT 生成文章大綱
3. **內容生成**：根據大綱生成完整文章內容
4. **SEO 優化**：生成 SEO 友善的標題和關鍵字
5. **摘要生成**：自動生成文章摘要
6. **品質檢查**：檢查文章品質和完整性

## 📈 未來規劃

### 短期目標
- [ ] 整合 Pinecone 向量資料庫
- [ ] 實現更精準的內容推薦
- [ ] 加入圖片生成功能
- [ ] 實現自動發布排程

### 長期目標
- [ ] 多語言支援
- [ ] 語音文章功能
- [ ] 互動式內容
- [ ] 社群功能

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 發起 Pull Request

## 📄 授權

本專案採用 MIT 授權條款。

## 📞 聯絡資訊

如有問題或建議，請聯絡開發團隊。

---

**注意**：使用本系統時請遵守相關法律法規，確保內容的合法性和準確性。 