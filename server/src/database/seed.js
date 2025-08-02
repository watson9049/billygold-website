const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function seedCustomers() {
  try {
    console.log('🌱 開始插入測試客戶數據...');
    
    const testCustomers = [
      {
        id: uuidv4(),
        name: '張小明',
        email: 'zhang@example.com',
        phone: '0912-345-678',
        address: '台北市信義區信義路五段7號',
        preferences: JSON.stringify(['戒指', '項鍊']),
        status: 'active'
      },
      {
        id: uuidv4(),
        name: '李小華',
        email: 'li@example.com',
        phone: '0923-456-789',
        address: '台北市大安區忠孝東路四段1號',
        preferences: JSON.stringify(['手鍊', '耳環']),
        status: 'active'
      },
      {
        id: uuidv4(),
        name: '王小美',
        email: 'wang@example.com',
        phone: '0934-567-890',
        address: '台北市中山區中山北路二段1號',
        preferences: JSON.stringify(['項鍊']),
        status: 'inactive'
      },
      {
        id: uuidv4(),
        name: '陳小強',
        email: 'chen@example.com',
        phone: '0945-678-901',
        address: '台北市松山區松山路1號',
        preferences: JSON.stringify(['戒指', '手鍊', '項鍊']),
        status: 'active'
      },
      {
        id: uuidv4(),
        name: '林小芳',
        email: 'lin@example.com',
        phone: '0956-789-012',
        address: '台北市萬華區西門町1號',
        preferences: JSON.stringify(['耳環', '手鍊']),
        status: 'active'
      }
    ];
    
    for (const customer of testCustomers) {
      // 檢查是否已存在
      const existing = await query(
        'SELECT id FROM customers WHERE email = ?',
        [customer.email]
      );
      
      if (existing.rows.length === 0) {
        await query(`
          INSERT INTO customers (id, name, email, phone, address, preferences, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          customer.id,
          customer.name,
          customer.email,
          customer.phone,
          customer.address,
          customer.preferences,
          customer.status
        ]);
        
        console.log(`✅ 插入客戶: ${customer.name}`);
      } else {
        console.log(`⏭️ 客戶已存在: ${customer.name}`);
      }
    }
    
    console.log('🎉 客戶數據插入完成！');
  } catch (error) {
    console.error('❌ 插入客戶數據失敗:', error);
  }
}

async function seedOrders() {
  try {
    console.log('🌱 開始插入測試訂單數據...');
    
    // 獲取客戶列表
    const customers = await query('SELECT id FROM customers LIMIT 3');
    
    if (customers.rows.length === 0) {
      console.log('⚠️ 沒有客戶數據，跳過訂單插入');
      return;
    }
    
    const testOrders = [
      {
        customerId: customers.rows[0].id,
        totalAmount: 125000,
        status: 'delivered',
        notes: '客戶很滿意商品品質'
      },
      {
        customerId: customers.rows[0].id,
        totalAmount: 89000,
        status: 'confirmed',
        notes: '等待客戶確認'
      },
      {
        customerId: customers.rows[1].id,
        totalAmount: 210000,
        status: 'delivered',
        notes: '高價值客戶'
      },
      {
        customerId: customers.rows[2].id,
        totalAmount: 45000,
        status: 'pending',
        notes: '新客戶首購'
      }
    ];
    
    for (const order of testOrders) {
      const orderId = uuidv4();
      
      await query(`
        INSERT INTO orders (id, customer_id, total_amount, status, notes)
        VALUES (?, ?, ?, ?, ?)
      `, [
        orderId,
        order.customerId,
        order.totalAmount,
        order.status,
        order.notes
      ]);
      
      console.log(`✅ 插入訂單: ${orderId} - NT$ ${order.totalAmount.toLocaleString()}`);
    }
    
    console.log('🎉 訂單數據插入完成！');
  } catch (error) {
    console.error('❌ 插入訂單數據失敗:', error);
  }
}

async function runSeed() {
  try {
    console.log('🚀 開始執行資料庫種子程序...');
    
    await seedCustomers();
    await seedOrders();
    
    console.log('🎉 所有種子數據插入完成！');
  } catch (error) {
    console.error('❌ 種子程序失敗:', error);
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed, seedCustomers, seedOrders }; 