const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');

async function seedProducts() {
  try {
    console.log('開始植入測試商品...');

    const products = [
      {
        id: '1',
        name: '永恆愛戀戒指',
        description: '經典六爪鑲嵌設計，完美展現鑽石光芒。採用18K黃金製作，搭配精選鑽石。',
        weight: 3.5,
        material: '18K黃金',
        category: '戒指',
        design_style: '經典',
        suitable_occasion: '求婚',
        craftsmanship_fee: 5000,
        is_active: 1
      },
      {
        id: '2',
        name: '1台錢黃金條塊',
        description: '1台錢黃金條塊，投資首選。高純度黃金，品質保證。',
        weight: 1,
        material: '24K黃金',
        category: '黃金條塊',
        design_style: '簡約',
        suitable_occasion: '投資',
        craftsmanship_fee: 500,
        is_active: 1
      },
      {
        id: '3',
        name: '5台錢黃金條塊',
        description: '5台錢黃金條塊，中等投資選擇。高純度黃金，適合中長期投資。',
        weight: 5,
        material: '24K黃金',
        category: '黃金條塊',
        design_style: '簡約',
        suitable_occasion: '投資',
        craftsmanship_fee: 800,
        is_active: 1
      },
      {
        id: '4',
        name: '精緻黃金項鍊',
        description: '手工打造的精緻黃金項鍊，適合日常佩戴。',
        weight: 2.8,
        material: '18K黃金',
        category: '項鍊',
        design_style: '精緻',
        suitable_occasion: '日常',
        craftsmanship_fee: 3500,
        is_active: 1
      },
      {
        id: '5',
        name: '典雅珍珠耳環',
        description: '典雅珍珠耳環，搭配18K白金。適合正式場合。',
        weight: 1.2,
        material: '18K白金',
        category: '耳環',
        design_style: '典雅',
        suitable_occasion: '正式',
        craftsmanship_fee: 2800,
        is_active: 1
      }
    ];

    for (const product of products) {
      // 檢查產品是否已存在
      const existing = await query('SELECT id FROM products WHERE id = ?', [product.id]);
      
      if (existing.length === 0) {
        await query(`
          INSERT INTO products (
            id, name, description, weight, material, category, 
            design_style, suitable_occasion, craftsmanship_fee, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product.id,
          product.name,
          product.description,
          product.weight,
          product.material,
          product.category,
          product.design_style,
          product.suitable_occasion,
          product.craftsmanship_fee,
          product.is_active
        ]);
        
        console.log(`✅ 已添加產品: ${product.name}`);
      } else {
        console.log(`⚠️ 產品已存在: ${product.name}`);
      }
    }

    console.log('✅ 測試商品植入完成');
  } catch (error) {
    console.error('❌ 植入測試商品失敗:', error);
  }
}

// 如果直接執行此文件
if (require.main === module) {
  seedProducts().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { seedProducts }; 