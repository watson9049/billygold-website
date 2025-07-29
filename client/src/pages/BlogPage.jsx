import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Clock, Eye, Heart, Tag, Calendar, BookOpen, TrendingUp, Sparkles, Home } from 'lucide-react'
import axios from 'axios'

function BlogPage() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [popularTags, setPopularTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 獲取文章列表
  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 9,
        status: 'published'
      }
      
      if (selectedCategory) {
        params.category = selectedCategory
      }
      
      const response = await axios.get('http://localhost:3001/api/blog', { params })
      
      if (response.data.success) {
        setArticles(response.data.data.posts)
        setTotalPages(response.data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('獲取文章失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  // 獲取分類
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/blog/categories/all')
      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error('獲取分類失敗:', error)
    }
  }

  // 獲取熱門標籤
  const fetchPopularTags = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/blog/tags/popular?limit=15')
      if (response.data.success) {
        setPopularTags(response.data.data)
      }
    } catch (error) {
      console.error('獲取熱門標籤失敗:', error)
    }
  }

  // 搜尋文章
  const searchArticles = async () => {
    if (!searchKeyword.trim()) {
      fetchArticles()
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:3001/api/blog/search/${encodeURIComponent(searchKeyword)}`)
      
      if (response.data.success) {
        setArticles(response.data.data.results)
        setTotalPages(1)
      }
    } catch (error) {
      console.error('搜尋文章失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 處理搜尋
  const handleSearch = (e) => {
    e.preventDefault()
    searchArticles()
  }

  // 處理分類篩選
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
    setCurrentPage(1)
  }

  // 處理分頁
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    fetchArticles()
  }, [currentPage, selectedCategory])

  useEffect(() => {
    fetchCategories()
    fetchPopularTags()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white">
        <div className="container mx-auto px-4 py-16 relative">
          {/* 回首頁按鈕 */}
          <Link
            to="/"
            className="absolute left-4 top-4 inline-flex items-center px-4 py-2 bg-white text-yellow-700 font-semibold rounded-lg shadow hover:bg-yellow-100 transition-colors z-10"
          >
            <Home className="w-5 h-5 mr-2" />
            回首頁
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <BookOpen className="inline-block w-12 h-12 mr-3" />
              黃金投資知識庫
            </h1>
            <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
              專業的黃金投資分析、市場趨勢、實用知識，助您成為黃金投資專家
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 側邊欄 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 搜尋框 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                搜尋文章
              </h3>
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="輸入關鍵字搜尋..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 text-gray-400 hover:text-yellow-600"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* 分類篩選 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                文章分類
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  全部文章
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryFilter(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === category.name 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 熱門標籤 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                熱門標籤
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <span
                    key={tag.name}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.name}
                    <span className="ml-1 text-xs bg-yellow-200 px-1.5 py-0.5 rounded-full">
                      {tag.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* AI 生成文章 */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI 智慧生成
              </h3>
              <p className="text-yellow-100 mb-4">
                我們的 AI 系統每天自動生成專業的黃金投資文章，結合最新市場資料和專業分析。
              </p>
              <button className="w-full bg-white text-yellow-600 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-50 transition-colors">
                生成新文章
              </button>
            </div>
          </div>

          {/* 主要內容區 */}
          <div className="lg:col-span-3">
            {/* 文章列表 */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      {/* 文章標題和分類 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                          {article.category}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.read_time} 分鐘
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {article.likes}
                          </span>
                        </div>
                      </div>

                      {/* 文章標題 */}
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-yellow-600 transition-colors">
                        <Link to={`/blog/${article.id}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {/* 文章摘要 */}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.summary}
                      </p>

                      {/* 標籤 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{article.tags.length - 3} 更多
                          </span>
                        )}
                      </div>

                      {/* 文章資訊 */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publish_date)}
                          </span>
                          <span>作者：{article.author}</span>
                        </div>
                        <Link
                          to={`/blog/${article.id}`}
                          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          閱讀全文
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}

                {/* 分頁 */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-yellow-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">沒有找到文章</h3>
                <p className="text-gray-600">
                  {searchKeyword ? `沒有找到包含「${searchKeyword}」的文章` : '目前沒有文章'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage 