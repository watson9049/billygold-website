const { Pool } = require('pg');
const sqlite3 = require('better-sqlite3');
const path = require('path');

// 檢查是否使用 SQLite (開發環境)
const useSQLite = process.env.DB_TYPE === 'sqlite' || !process.env.DB_HOST;

let db = null;
let pool = null;

if (useSQLite) {
  // SQLite 配置 (開發環境)
  const dbPath = path.join(__dirname, '../../data/silver_jewelry_brain.db');
  db = new sqlite3(dbPath);
  
  console.log('📁 使用 SQLite 資料庫:', dbPath);
  
  // 初始化 SQLite 表格
  initSQLiteTables();
} else {
  // PostgreSQL 配置 (生產環境)
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'silver_jewelry_brain',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    
    // 連接池優化設定
    max: 20, // 最大連接數
    min: 2,  // 最小連接數
    idleTimeoutMillis: 30000, // 閒置連接超時 (30秒)
    connectionTimeoutMillis: 2000, // 連接超時 (2秒)
    
    // 查詢超時設定
    statement_timeout: 30000, // 查詢超時 (30秒)
    query_timeout: 30000,     // 查詢超時 (30秒)
    
    // SSL 設定 (生產環境)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    
    // 應用名稱 (用於監控)
    application_name: 'silver-jewelry-brain'
  });

  // 連接池事件監聽
  pool.on('connect', (client) => {
    console.log('✅ PostgreSQL 資料庫連接成功');
    client.query('SET application_name = $1', ['silver-jewelry-brain']);
  });

  pool.on('acquire', (client) => {
    console.log('📊 PostgreSQL 資料庫連接已獲取');
  });

  pool.on('release', (client) => {
    console.log('🔄 PostgreSQL 資料庫連接已釋放');
  });

  pool.on('error', (err, client) => {
    console.error('❌ PostgreSQL 資料庫連接錯誤:', err);
  });
}

// SQLite 表格初始化
function initSQLiteTables() {
  try {
    // 創建必要的目錄
    const fs = require('fs');
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 創建表格
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        weight REAL NOT NULL,
        material TEXT,
        category TEXT,
        design_style TEXT,
        suitable_occasion TEXT,
        craftsmanship_fee REAL DEFAULT 500,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS price_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        update_interval INTEGER DEFAULT 900000,
        min_update_interval INTEGER DEFAULT 900000,
        max_update_interval INTEGER DEFAULT 86400000,
        default_exchange_rate REAL DEFAULT 31.5,
        default_workmanship_fee REAL DEFAULT 500,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS price_history (
        id TEXT PRIMARY KEY,
        product_id TEXT,
        gold_price_usd REAL,
        exchange_rate REAL,
        final_price_twd REAL,
        craftsmanship_fee REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'pending',
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT,
        verification_token_expiry TEXT,
        reset_token TEXT,
        reset_token_expiry TEXT,
        google_id TEXT,
        line_id TEXT,
        apple_id TEXT,
        avatar_url TEXT,
        last_login TEXT,
        login_attempts INTEGER DEFAULT 0,
        locked_until TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS verification_codes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        code TEXT NOT NULL,
        type TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS login_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        session_token TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS security_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        details TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        preferences TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_id TEXT,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT,
        product_id TEXT,
        quantity INTEGER DEFAULT 1,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, product_id)
      );
    `);

    console.log('✅ SQLite 表格初始化完成');
  } catch (error) {
    console.error('❌ SQLite 表格初始化失敗:', error);
  }
}

// 執行查詢的通用函數 - 支援 SQLite 和 PostgreSQL
const query = async (text, params = []) => {
  const start = Date.now();
  
  try {
    if (useSQLite) {
      // SQLite 查詢
      const stmt = db.prepare(text);
      let result;
      
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        result = stmt.all(params);
      } else {
        stmt.run(params);
        result = [];
      }
      
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        console.warn(`⚠️ 慢查詢警告: ${duration}ms - ${text.substring(0, 100)}...`);
      } else {
        console.log(`📊 SQLite 查詢執行時間: ${duration}ms`);
      }
      
      return { rows: result, rowCount: result.length };
    } else {
      // PostgreSQL 查詢
      const client = await pool.connect();
      
      try {
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        
        if (duration > 1000) {
          console.warn(`⚠️ 慢查詢警告: ${duration}ms - ${text.substring(0, 100)}...`);
        } else {
          console.log(`📊 PostgreSQL 查詢執行時間: ${duration}ms`);
        }
        
        return res;
      } finally {
        client.release();
      }
    }
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ 查詢錯誤 (${duration}ms):`, error);
    throw error;
  }
};

// 批量查詢函數
const batchQuery = async (queries) => {
  if (useSQLite) {
    // SQLite 批量查詢
    const results = [];
    const transaction = db.transaction(() => {
      for (const { text, params } of queries) {
        const stmt = db.prepare(text);
        const result = stmt.all(params);
        results.push({ rows: result, rowCount: result.length });
      }
    });
    transaction();
    return results;
  } else {
    // PostgreSQL 批量查詢
    const client = await pool.connect();
    const results = [];
    
    try {
      await client.query('BEGIN');
      
      for (const { text, params } of queries) {
        const result = await client.query(text, params);
        results.push(result);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

// 健康檢查函數
const healthCheck = async () => {
  try {
    if (useSQLite) {
      const result = await query('SELECT datetime(\'now\') as current_time, \'SQLite\' as db_version');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        version: result.rows[0].db_version,
        type: 'SQLite'
      };
    } else {
      const result = await query('SELECT NOW() as current_time, version() as db_version');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        version: result.rows[0].db_version,
        poolSize: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
        type: 'PostgreSQL'
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date(),
      type: useSQLite ? 'SQLite' : 'PostgreSQL'
    };
  }
};

// 獲取客戶端連接
const getClient = () => {
  if (useSQLite) {
    return db;
  } else {
    return pool.connect();
  }
};

// 關閉連接池
const closePool = async () => {
  if (useSQLite) {
    db.close();
    console.log('🔒 SQLite 資料庫連接已關閉');
  } else {
    await pool.end();
    console.log('🔒 PostgreSQL 資料庫連接池已關閉');
  }
};

module.exports = {
  query,
  batchQuery,
  getClient,
  healthCheck,
  closePool,
  pool: useSQLite ? null : pool,
  db: useSQLite ? db : null
}; 