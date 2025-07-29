const express = require('express');
const router = express.Router();

// 模擬部落格文章資料庫
const mockPosts = [
  {
    id: '1',
    title: '如何挑選適合的結婚戒指？專業指南',
    excerpt: '結婚戒指是人生中最重要的珠寶之一，本文將從材質、設計、預算等多個角度，為您提供專業的挑選建議。',
    content: `
      <h2>結婚戒指的重要性</h2>
      <p>結婚戒指不僅是愛情的象徵，更是人生中最重要的珠寶之一。選擇一枚完美的結婚戒指，需要考慮多個因素。</p>
      
      <h2>材質選擇</h2>
      <h3>黃金</h3>
      <p>黃金是最傳統的選擇，具有以下優點：</p>
      <ul>
        <li>保值性強，具有投資價值</li>
        <li>色澤溫暖，適合亞洲人膚色</li>
        <li>硬度適中，不易變形</li>
      </ul>
      
      <h3>白金</h3>
      <p>白金是現代人的熱門選擇：</p>
      <ul>
        <li>色澤純淨，搭配鑽石效果佳</li>
        <li>不易過敏，適合敏感肌膚</li>
        <li>現代感強，時尚百搭</li>
      </ul>
      
      <h2>設計考量</h2>
      <p>結婚戒指的設計應該考慮以下因素：</p>
      <ul>
        <li>日常配戴的舒適度</li>
        <li>與其他飾品的搭配性</li>
        <li>個人風格和喜好</li>
        <li>預算限制</li>
      </ul>
      
      <h2>預算規劃</h2>
      <p>建議將結婚戒指的預算控制在月薪的1-2倍，這樣既能買到品質不錯的戒指，又不會造成經濟負擔。</p>
      
      <h2>購買建議</h2>
      <p>購買結婚戒指時，建議：</p>
      <ol>
        <li>提前3-6個月開始挑選</li>
        <li>多比較不同品牌和款式</li>
        <li>注意售後服務和保固</li>
        <li>保留購買憑證</li>
      </ol>
    `,
    author: '黃金比例專家',
    author_id: '1',
    published_at: '2024-01-15T10:00:00Z',
    category: '選購指南',
    tags: ['結婚戒指', '選購指南', '黃金'],
    cover_image: '/api/placeholder/800/400',
    read_time: '5分鐘',
    view_count: 1250,
    is_published: true,
    seo_title: '結婚戒指選購指南 - 專業建議與推薦',
    seo_description: '專業的結婚戒指選購指南，包含材質、設計、預算等全方位建議，助您選擇完美的結婚戒指。',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: '2024年金價走勢分析與投資建議',
    excerpt: '隨著全球經濟環境的變化，黃金作為避險資產的重要性日益提升。本文將分析2024年金價的走勢，並提供投資建議。',
    content: `
      <h2>2024年金價市場概況</h2>
      <p>2024年，黃金市場面臨多重挑戰和機遇。全球經濟不確定性、地緣政治風險、通貨膨脹壓力等因素，都對金價產生重要影響。</p>
      
      <h2>影響金價的主要因素</h2>
      <h3>1. 美元指數</h3>
      <p>美元指數與金價通常呈負相關關係。當美元走強時，金價往往承壓；當美元走弱時，金價通常上漲。</p>
      
      <h3>2. 通貨膨脹</h3>
      <p>通貨膨脹是黃金的重要支撐因素。當通貨膨脹上升時，投資者傾向於購買黃金作為保值工具。</p>
      
      <h3>3. 地緣政治風險</h3>
      <p>地緣政治不穩定會增加避險需求，推動金價上漲。</p>
      
      <h2>2024年金價預測</h2>
      <p>根據多家機構的預測，2024年金價可能呈現以下走勢：</p>
      <ul>
        <li>上半年：震盪上行，主要受通貨膨脹和避險需求支撐</li>
        <li>下半年：可能面臨調整，但整體趨勢向上</li>
        <li>全年目標價：$2,200-2,400/盎司</li>
      </ul>
      
      <h2>投資建議</h2>
      <h3>短期投資者</h3>
      <p>建議關注技術面分析，在支撐位附近買入，阻力位附近賣出。</p>
      
      <h3>長期投資者</h3>
      <p>建議採用定投策略，分批買入，降低風險。</p>
      
      <h3>實物黃金投資</h3>
      <p>對於實物黃金投資，建議：</p>
      <ul>
        <li>選擇信譽良好的商家</li>
        <li>注意黃金的純度和重量</li>
        <li>考慮儲存和保險成本</li>
      </ul>
    `,
    author: '黃金比例專家',
    author_id: '1',
    published_at: '2024-01-12T14:30:00Z',
    category: '市場分析',
    tags: ['金價', '投資', '市場分析'],
    cover_image: '/api/placeholder/800/400',
    read_time: '8分鐘',
    view_count: 2100,
    is_published: true,
    seo_title: '2024年金價走勢分析 - 投資建議與預測',
    seo_description: '深入分析2024年金價走勢，提供專業的投資建議和市場預測，助您做出明智的投資決策。',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    title: '黃金保養的五大秘訣',
    excerpt: '正確的保養方式能讓您的黃金飾品保持光澤如新。本文將分享專業的黃金保養技巧，讓您的黃金飾品永保美麗。',
    content: `
      <h2>黃金保養的重要性</h2>
      <p>黃金雖然是貴重金屬，但也需要適當的保養才能保持其美麗的光澤。正確的保養方式不僅能延長飾品的使用壽命，還能保持其投資價值。</p>
      
      <h2>日常保養秘訣</h2>
      <h3>1. 正確配戴</h3>
      <p>配戴黃金飾品時應注意：</p>
      <ul>
        <li>避免與化妝品、香水直接接觸</li>
        <li>運動時應取下飾品</li>
        <li>避免與其他金屬飾品摩擦</li>
      </ul>
      
      <h3>2. 定期清潔</h3>
      <p>建議每週清潔一次：</p>
      <ol>
        <li>使用溫水和中性清潔劑</li>
        <li>用軟毛刷輕輕刷洗</li>
        <li>用清水沖洗乾淨</li>
        <li>用軟布擦乾</li>
      </ol>
      
      <h3>3. 適當儲存</h3>
      <p>儲存黃金飾品時：</p>
      <ul>
        <li>使用專用首飾盒</li>
        <li>避免陽光直射</li>
        <li>保持乾燥環境</li>
        <li>不同飾品分開存放</li>
      </ul>
      
      <h3>4. 專業保養</h3>
      <p>建議每年進行一次專業保養：</p>
      <ul>
        <li>到專業珠寶店檢查</li>
        <li>進行深度清潔</li>
        <li>檢查鑲嵌是否牢固</li>
        <li>必要時進行拋光</li>
      </ul>
      
      <h3>5. 避免損害</h3>
      <p>避免以下情況：</p>
      <ul>
        <li>接觸化學物質</li>
        <li>高溫環境</li>
        <li>劇烈碰撞</li>
        <li>長時間浸泡在水中</li>
      </ul>
      
      <h2>常見問題處理</h2>
      <h3>失去光澤</h3>
      <p>可以使用專業的黃金清潔劑，或到珠寶店進行拋光處理。</p>
      
      <h3>變色</h3>
      <p>可能是接觸了化學物質，建議到專業珠寶店處理。</p>
      
      <h3>變形</h3>
      <p>輕微變形可以到珠寶店修復，嚴重變形可能需要重新製作。</p>
    `,
    author: '黃金比例專家',
    author_id: '1',
    published_at: '2024-01-10T09:15:00Z',
    category: '保養知識',
    tags: ['保養', '黃金', '清潔'],
    cover_image: '/api/placeholder/800/400',
    read_time: '4分鐘',
    view_count: 1800,
    is_published: true,
    seo_title: '黃金保養秘訣 - 專業保養指南',
    seo_description: '專業的黃金保養指南，包含日常保養、清潔技巧、儲存方法等，讓您的黃金飾品永保美麗。',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-10T09:15:00Z'
  },
  {
    id: '4',
    title: '不同場合的黃金飾品搭配技巧',
    excerpt: '從日常配戴到重要場合，如何選擇合適的黃金飾品？本文將為您提供實用的搭配建議，讓您在不同場合都能展現最佳風采。',
    content: `
      <h2>黃金飾品搭配的重要性</h2>
      <p>黃金飾品不僅是裝飾品，更是展現個人品味和身份的重要元素。正確的搭配能讓您在不同場合都散發迷人魅力。</p>
      
      <h2>日常配戴</h2>
      <h3>上班場合</h3>
      <p>建議選擇簡約設計的飾品：</p>
      <ul>
        <li>細緻的項鍊或手鍊</li>
        <li>小巧的耳環</li>
        <li>避免過於華麗的設計</li>
        <li>顏色搭配要協調</li>
      </ul>
      
      <h3>休閒場合</h3>
      <p>可以選擇較為活潑的設計：</p>
      <ul>
        <li>有特色的手鍊</li>
        <li>個性化的項鍊</li>
        <li>可以搭配多層次配戴</li>
        <li>顏色可以更加豐富</li>
      </ul>
      
      <h2>正式場合</h2>
      <h3>婚禮場合</h3>
      <p>婚禮是最重要的場合之一：</p>
      <ul>
        <li>選擇經典設計的飾品</li>
        <li>可以搭配鑽石或其他寶石</li>
        <li>注意與禮服的搭配</li>
        <li>避免過於搶眼的設計</li>
      </ul>
      
      <h3>商務場合</h3>
      <p>商務場合需要展現專業形象：</p>
      <ul>
        <li>選擇低調優雅的設計</li>
        <li>避免過於華麗的裝飾</li>
        <li>注意與服裝的協調性</li>
        <li>可以選擇套裝飾品</li>
      </ul>
      
      <h2>搭配技巧</h2>
      <h3>顏色搭配</h3>
      <p>黃金飾品的顏色搭配原則：</p>
      <ul>
        <li>與膚色相協調</li>
        <li>與服裝顏色搭配</li>
        <li>避免過多顏色混搭</li>
        <li>注意整體和諧性</li>
      </ul>
      
      <h3>款式搭配</h3>
      <p>款式搭配的注意事項：</p>
      <ul>
        <li>避免過於複雜的設計</li>
        <li>注意飾品之間的協調</li>
        <li>可以選擇套裝設計</li>
        <li>根據場合選擇合適的款式</li>
      </ul>
      
      <h2>季節搭配</h2>
      <h3>春夏搭配</h3>
      <p>春夏適合較為輕盈的設計：</p>
      <ul>
        <li>細緻的鍊條設計</li>
        <li>清新的顏色搭配</li>
        <li>可以選擇較為活潑的款式</li>
      </ul>
      
      <h3>秋冬搭配</h3>
      <p>秋冬適合較為厚重的設計：</p>
      <ul>
        <li>較粗的鍊條設計</li>
        <li>溫暖的顏色搭配</li>
        <li>可以選擇較為穩重的款式</li>
      </ul>
    `,
    author: '黃金比例專家',
    author_id: '1',
    published_at: '2024-01-08T16:45:00Z',
    category: '搭配技巧',
    tags: ['搭配', '時尚', '場合'],
    cover_image: '/api/placeholder/800/400',
    read_time: '6分鐘',
    view_count: 1650,
    is_published: true,
    seo_title: '黃金飾品搭配技巧 - 場合搭配指南',
    seo_description: '專業的黃金飾品搭配指南，包含不同場合的搭配技巧、顏色搭配、款式選擇等，讓您展現最佳風采。',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-08T16:45:00Z'
  }
];

/**
 * GET /api/blog
 * 獲取部落格文章列表
 */
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      page = 1, 
      limit = 10,
      sort = 'published_at',
      order = 'desc'
    } = req.query;

    let filteredPosts = mockPosts.filter(post => post.is_published);

    // 分類篩選
    if (category && category !== '全部') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // 搜尋篩選
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 排序
    filteredPosts.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 分頁
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // 獲取分類選項
    const categories = [...new Set(mockPosts.map(post => post.category))];

    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredPosts.length,
          totalPages: Math.ceil(filteredPosts.length / limit)
        },
        filters: {
          categories
        }
      }
    });
  } catch (error) {
    console.error('獲取部落格文章列表失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取部落格文章列表失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/blog/:id
 * 獲取部落格文章詳情
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = mockPosts.find(p => p.id === id && p.is_published);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: '文章不存在或未發布'
      });
    }

    // 增加瀏覽次數
    post.view_count += 1;

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('獲取部落格文章詳情失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取部落格文章詳情失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/blog/categories
 * 獲取部落格分類
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(mockPosts.map(post => post.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('獲取部落格分類失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取部落格分類失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/blog/tags
 * 獲取部落格標籤
 */
router.get('/tags', async (req, res) => {
  try {
    const allTags = mockPosts.flatMap(post => post.tags);
    const tags = [...new Set(allTags)];
    
    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('獲取部落格標籤失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取部落格標籤失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/blog/featured
 * 獲取精選文章
 */
router.get('/featured', async (req, res) => {
  try {
    const featuredPosts = mockPosts
      .filter(post => post.is_published)
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 3);
    
    res.json({
      success: true,
      data: featuredPosts
    });
  } catch (error) {
    console.error('獲取精選文章失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取精選文章失敗',
      message: error.message
    });
  }
});

module.exports = router; 