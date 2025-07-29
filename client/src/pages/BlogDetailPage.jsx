import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Eye, Heart, Tag, Calendar, User, Share2, BookOpen, TrendingUp } from 'lucide-react'
import axios from 'axios'

function BlogDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 獲取文章詳情
  const fetchArticle = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:3001/api/blog/${id}`)
      
      if (response.data.success) {
        setArticle(response.data.data)
        // 獲取相關文章
        fetchRelatedArticles(response.data.data.category, response.data.data.tags)
      }
    } catch (error) {
      console.error('獲取文章失敗:', error)
      setError('文章不存在或已被刪除')
    } finally {
      setLoading(false)
    }
  }

  // 獲取相關文章
  const fetchRelatedArticles = async (category, tags) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/blog?category=${category}&limit=3`)
      
      if (response.data.success) {
        // 過濾掉當前文章
        const filtered = response.data.data.posts.filter(post => post.id !== id)
        setRelatedArticles(filtered)
      }
    } catch (error) {
      console.error('獲取相關文章失敗:', error)
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 處理分享
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href
      })
    } else {
      // 複製連結到剪貼簿
      navigator.clipboard.writeText(window.location.href)
      alert('連結已複製到剪貼簿')
    }
  }

  // 處理點讚
  const handleLike = () => {
    // 這裡應該調用 API 來增加點讚數
    console.log('點讚功能')
  }

  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入文章中...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">文章不存在</h2>
          <p className="text-gray-600 mb-6">{error || '找不到指定的文章'}</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回部落格
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 返回按鈕 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回部落格
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主要內容 */}
          <div className="lg:col-span-3">
            {/* 文章標題區 */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              {/* 分類和標籤 */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  {article.category}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.read_time} 分鐘閱讀
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {article.views} 次瀏覽
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {article.likes} 個讚
                  </span>
                </div>
              </div>

              {/* 文章標題 */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {/* 文章摘要 */}
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {article.summary}
              </p>

              {/* 作者和發布資訊 */}
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(article.publish_date)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5 mr-1" />
                    讚
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5 mr-1" />
                    分享
                  </button>
                </div>
              </div>
            </div>

            {/* 文章內容 */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                {/* 將 Markdown 內容轉換為 HTML */}
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ 
                    __html: article.content
                      .replace(/#{1,6}\s+(.+)/g, '<h1>$1</h1>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.+?)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br>')
                      .replace(/### (.+)/g, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
                      .replace(/## (.+)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
                      .replace(/- (.+)/g, '<li class="ml-4 mb-2">$1</li>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
            </div>

            {/* 標籤 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">文章標籤</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 相關文章 */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">相關文章</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.id}`}
                      className="group block"
                    >
                      <article className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            {relatedArticle.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {relatedArticle.read_time} 分鐘
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedArticle.summary}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{relatedArticle.author}</span>
                          <span>{formatDate(relatedArticle.publish_date)}</span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 側邊欄 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 文章統計 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">文章統計</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">瀏覽次數</span>
                  <span className="font-semibold text-gray-900">{article.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">點讚數</span>
                  <span className="font-semibold text-gray-900">{article.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">閱讀時間</span>
                  <span className="font-semibold text-gray-900">{article.read_time} 分鐘</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">發布時間</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(article.publish_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* SEO 關鍵字 */}
            {article.seo_keywords && article.seo_keywords.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">關鍵字</h3>
                <div className="flex flex-wrap gap-2">
                  {article.seo_keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 快速導航 */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">快速導航</h3>
              <div className="space-y-3">
                <Link
                  to="/blog"
                  className="block text-yellow-100 hover:text-white transition-colors"
                >
                  ← 返回部落格
                </Link>
                <Link
                  to="/"
                  className="block text-yellow-100 hover:text-white transition-colors"
                >
                  🏠 回到首頁
                </Link>
                <Link
                  to="/products"
                  className="block text-yellow-100 hover:text-white transition-colors"
                >
                  💍 瀏覽商品
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage 