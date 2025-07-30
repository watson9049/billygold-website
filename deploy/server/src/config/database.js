const { Pool } = require('pg');

// 資料庫連接池設定 - 優化版本
const pool = new Pool({
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
  console.log('✅ 資料庫連接成功');
  
  // 設定客戶端參數
  client.query('SET application_name = $1', ['silver-jewelry-brain']);
});

pool.on('acquire', (client) => {
  console.log('📊 資料庫連接已獲取');
});

pool.on('release', (client) => {
  console.log('🔄 資料庫連接已釋放');
});

pool.on('error', (err, client) => {
  console.error('❌ 資料庫連接錯誤:', err);
  
  // 記錄詳細錯誤資訊
  console.error('錯誤詳情:', {
    message: err.message,
    code: err.code,
    detail: err.detail,
    hint: err.hint,
    position: err.position,
    internalPosition: err.internalPosition,
    internalQuery: err.internalQuery,
    where: err.where,
    schema: err.schema,
    table: err.table,
    column: err.column,
    dataType: err.dataType,
    constraint: err.constraint,
    file: err.file,
    line: err.line,
    routine: err.routine
  });
});

// 執行查詢的通用函數 - 優化版本
const query = async (text, params) => {
  const start = Date.now();
  const client = await pool.connect();
  
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    
    // 效能監控
    if (duration > 1000) {
      console.warn(`⚠️ 慢查詢警告: ${duration}ms - ${text.substring(0, 100)}...`);
    } else {
      console.log(`📊 查詢執行時間: ${duration}ms`);
    }
    
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ 查詢錯誤 (${duration}ms):`, error);
    throw error;
  } finally {
    client.release();
  }
};

// 批量查詢函數
const batchQuery = async (queries) => {
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
};

// 健康檢查函數
const healthCheck = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      version: result.rows[0].db_version,
      poolSize: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
};

// 獲取客戶端連接
const getClient = () => {
  return pool.connect();
};

// 關閉連接池
const closePool = async () => {
  await pool.end();
  console.log('🔒 資料庫連接池已關閉');
};

module.exports = {
  query,
  batchQuery,
  getClient,
  healthCheck,
  closePool,
  pool
}; 