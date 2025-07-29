const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

async function runMigrations() {
  try {
    console.log('🔄 開始執行資料庫遷移...');
    
    // 讀取遷移檔案
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // 確保按順序執行
    
    console.log(`📁 找到 ${migrationFiles.length} 個遷移檔案`);
    
    for (const file of migrationFiles) {
      console.log(`📄 執行遷移: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      // 分割SQL語句並執行
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await query(statement);
        }
      }
      
      console.log(`✅ 完成遷移: ${file}`);
    }
    
    console.log('🎉 所有遷移執行完成！');
    
  } catch (error) {
    console.error('❌ 遷移失敗:', error);
    process.exit(1);
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations }; 