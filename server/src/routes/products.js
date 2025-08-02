const express = require('express');
const router = express.Router();

// 模擬商品資料庫
const mockProducts = [
  {
    id: '1',
    name: '永恆愛戀戒指',
    description: '經典六爪鑲嵌設計，完美展現鑽石光芒。採用18K黃金製作，搭配精選鑽石，是求婚、結婚紀念日的完美選擇。',
    weight: 3.5,
    material: '18K黃金',
    category: '戒指',
    craftsmanship_fee: 500,
    design_style: '經典',
    suitable_occasion: '婚禮',
    is_active: true,
    images: ['/api/placeholder/600/600'],
    specifications: {
      '材質': '18K黃金',
      '重量': '3.5台錢',
      '鑽石': '0.5克拉',
      '淨度': 'VS1',
      '顏色': 'F',
      '切工': 'Excellent'
    },
    features: [
      '經典六爪鑲嵌設計',
      '完美鑽石切工',
      '18K黃金材質',
      '附贈精美包裝盒',
      '終身保固服務'
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: '優雅珍珠項鍊',
    description: '精緻珍珠搭配黃金鍊條，展現優雅氣質。適合各種正式場合配戴，是送禮自用的絕佳選擇。',
    weight: 2.8,
    material: '14K黃金',
    category: '項鍊',
    craftsmanship_fee: 400,
    design_style: '優雅',
    suitable_occasion: '正式場合',
    is_active: true,
    images: ['/api/placeholder/600/600'],
    specifications: {
      '材質': '14K黃金',
      '重量': '2.8台錢',
      '珍珠': '天然海水珍珠',
      '珍珠尺寸': '8-9mm',
      '鍊長': '18吋'
    },
    features: [
      '天然海水珍珠',
      '14K黃金鍊條',
      '可調節鍊長',
      '優雅設計',
      '適合各種場合'
    ],
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  },
  {
    id: '3',
    name: '時尚手鍊',
    description: '現代簡約設計，適合日常配戴。採用18K玫瑰金製作，展現時尚品味。',
    weight: 4.2,
    material: '18K玫瑰金',
    category: '手鍊',
    craftsmanship_fee: 600,
    design_style: '現代',
    suitable_occasion: '日常',
    is_active: true,
    images: ['/api/placeholder/600/600'],
    specifications: {
      '材質': '18K玫瑰金',
      '重量': '4.2台錢',
      '設計': '簡約現代',
      '可調節': '是',
      '適合': '日常配戴'
    },
    features: [
      '18K玫瑰金材質',
      '現代簡約設計',
      '可調節長度',
      '適合日常配戴',
      '時尚百搭'
    ],
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    name: '經典耳環',
    description: '傳統工藝製作，展現東方美學。採用24K黃金製作，是收藏投資的絕佳選擇。',
    weight: 1.8,
    material: '24K黃金',
    category: '耳環',
    craftsmanship_fee: 300,
    design_style: '傳統',
    suitable_occasion: '收藏',
    is_active: true,
    images: ['/api/placeholder/600/600'],
    specifications: {
      '材質': '24K黃金',
      '重量': '1.8台錢',
      '純度': '99.9%',
      '設計': '傳統工藝',
      '用途': '收藏投資'
    },
    features: [
      '24K純金製作',
      '傳統工藝設計',
      '高純度黃金',
      '收藏投資價值',
      '東方美學'
    ],
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z'
  }
];

/**
 * GET /api/products
 * 獲取商品列表
 */
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      material, 
      search, 
      page = 1, 
      limit = 10,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    let filteredProducts = [...mockProducts];

    // 分類篩選
    if (category && category !== '全部') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // 材質篩選
    if (material && material !== '全部') {
      filteredProducts = filteredProducts.filter(p => p.material === material);
    }

    // 搜尋篩選
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // 排序
    filteredProducts.sort((a, b) => {
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
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // 獲取分類和材質選項
    const categories = [...new Set(mockProducts.map(p => p.category))];
    const materials = [...new Set(mockProducts.map(p => p.material))];

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit)
        },
        filters: {
          categories,
          materials
        }
      }
    });
  } catch (error) {
    console.error('獲取商品列表失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取商品列表失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/products/categories
 * 獲取商品分類
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(mockProducts.map(p => p.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('獲取商品分類失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取商品分類失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/products/materials
 * 獲取商品材質
 */
router.get('/materials', async (req, res) => {
  try {
    const materials = [...new Set(mockProducts.map(p => p.material))];
    
    res.json({
      success: true,
      data: materials
    });
  } catch (error) {
    console.error('獲取商品材質失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取商品材質失敗',
      message: error.message
    });
  }
});

/**
 * GET /api/products/:id
 * 獲取商品詳情
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: '商品不存在'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('獲取商品詳情失敗:', error);
    res.status(500).json({
      success: false,
      error: '獲取商品詳情失敗',
      message: error.message
    });
  }
});

/**
 * POST /api/products
 * 新增商品
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      weight,
      material,
      category,
      design_style,
      suitable_occasion,
      craftsmanship_fee,
      specifications,
      features,
      images
    } = req.body;

    // 驗證必填欄位
    if (!name || !description || !weight || !material || !category) {
      return res.status(400).json({
        success: false,
        error: '缺少必填欄位',
        message: '請填寫商品名稱、描述、重量、材質和分類'
      });
    }

    // 驗證重量
    if (parseFloat(weight) <= 0) {
      return res.status(400).json({
        success: false,
        error: '重量必須大於0',
        message: '請輸入有效的重量'
      });
    }

    // 生成新商品ID
    const newId = (mockProducts.length + 1).toString();
    
    // 創建新商品
    const newProduct = {
      id: newId,
      name,
      description,
      weight: parseFloat(weight),
      material,
      category,
      design_style: design_style || '',
      suitable_occasion: suitable_occasion || '',
      craftsmanship_fee: parseFloat(craftsmanship_fee) || 0,
      specifications: specifications || {},
      features: features || [],
      images: images || [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 添加到模擬數據庫
    mockProducts.push(newProduct);

    console.log('新增商品成功:', newProduct);

    res.status(201).json({
      success: true,
      message: '商品新增成功',
      data: newProduct
    });
  } catch (error) {
    console.error('新增商品失敗:', error);
    res.status(500).json({
      success: false,
      error: '新增商品失敗',
      message: error.message
    });
  }
});

/**
 * PUT /api/products/:id
 * 更新商品
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '商品不存在'
      });
    }

    // 更新商品
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      message: '商品更新成功',
      data: mockProducts[productIndex]
    });
  } catch (error) {
    console.error('更新商品失敗:', error);
    res.status(500).json({
      success: false,
      error: '更新商品失敗',
      message: error.message
    });
  }
});

/**
 * DELETE /api/products/:id
 * 刪除商品
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '商品不存在'
      });
    }

    // 軟刪除 - 設置為非活躍
    mockProducts[productIndex].is_active = false;
    mockProducts[productIndex].updated_at = new Date().toISOString();

    res.json({
      success: true,
      message: '商品已下架'
    });
  } catch (error) {
    console.error('刪除商品失敗:', error);
    res.status(500).json({
      success: false,
      error: '刪除商品失敗',
      message: error.message
    });
  }
});

module.exports = router; 