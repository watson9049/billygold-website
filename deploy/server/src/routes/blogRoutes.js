const express = require('express')
const router = express.Router()
const path = require('path')
const Database = require('better-sqlite3')

// 資料庫路徑與 Python 端一致
const dbPath = path.resolve(__dirname, '../../../data/blog.db')
const db = new Database(dbPath)

// 取得所有文章
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = 'published' } = req.query
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum
    let sql = 'SELECT * FROM blog_posts WHERE 1=1'
    const params = []
    if (status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }
    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limitNum, offset)
    const posts = db.prepare(sql).all(...params)
    const total = db.prepare('SELECT COUNT(*) as count FROM blog_posts WHERE 1=1' + (status !== 'all' ? ' AND status = ?' : '') + (category ? ' AND category = ?' : '')).get(...(status !== 'all' && category ? [status, category] : status !== 'all' ? [status] : category ? [category] : [])).count
    const totalPages = Math.ceil(total / limitNum)
    res.json({
      success: true,
      data: {
        posts: posts.map(rowToPost),
        pagination: { page: pageNum, limit: limitNum, total, totalPages }
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 取得單篇文章
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id)
    if (!post) return res.status(404).json({ success: false, message: '文章不存在' })
    // 增加瀏覽次數
    db.prepare('UPDATE blog_posts SET views = views + 1 WHERE id = ?').run(id)
    res.json({ success: true, data: rowToPost(post) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 搜尋文章
router.get('/search/:keyword', (req, res) => {
  try {
    const { keyword } = req.params
    const { limit = 10 } = req.query
    const posts = db.prepare('SELECT * FROM blog_posts WHERE (title LIKE ? OR content LIKE ? OR tags LIKE ?) AND status = ? ORDER BY created_at DESC LIMIT ?')
      .all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, 'published', parseInt(limit))
    res.json({
      success: true,
      data: { keyword, results: posts.map(rowToPost), total: posts.length }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 取得分類
router.get('/categories/all', (req, res) => {
  try {
    const rows = db.prepare('SELECT name, description, count FROM categories ORDER BY count DESC').all()
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 取得熱門標籤
router.get('/tags/popular', (req, res) => {
  try {
    const { limit = 20 } = req.query
    const tagRows = db.prepare('SELECT name, count FROM tags ORDER BY count DESC LIMIT ?').all(parseInt(limit))
    res.json({ success: true, data: tagRows })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// 新增：將資料庫 row 轉換為前端需要的格式
function rowToPost(row) {
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    seo_keywords: row.seo_keywords ? JSON.parse(row.seo_keywords) : [],
    views: row.views || 0,
    likes: row.likes || 0
  }
}

module.exports = router 