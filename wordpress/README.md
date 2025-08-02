# 黃金比例 WordPress 電商系統

這是黃金比例貴金屬彈性報價電商系統的 WordPress 版本，整合了實時金價計算功能。

## 🎯 特色功能

- **實時金價計算** - 整合現有的 Node.js 金價引擎
- **WooCommerce 深度整合** - 動態價格顯示
- **貴金屬專用** - 支援黃金、白銀、鉑金、銅
- **響應式設計** - 完美支援行動裝置
- **多語言支援** - 繁體中文界面

## 📋 系統需求

- PHP 7.4+
- MySQL 5.7+ 或 MariaDB 10.3+
- WordPress 6.0+
- WooCommerce 7.0+

## 🚀 安裝步驟

### 1. 本地開發環境

```bash
# 1. 安裝 WordPress
# 已包含在此目錄中

# 2. 設定資料庫
# 建立 MySQL 資料庫: gold_ratio_wp

# 3. 配置 wp-config.php
# 修改資料庫連線設定

# 4. 啟動 Web 服務器
php -S localhost:8080

# 5. 完成 WordPress 安裝
# 瀏覽器開啟: http://localhost:8080
```

### 2. 安裝 WooCommerce

```bash
# 方法 1: 透過 WordPress 管理介面
# 插件 → 安裝插件 → 搜尋 "WooCommerce"

# 方法 2: 使用 WP-CLI
wp plugin install woocommerce --activate
```

### 3. 啟用金價計算器插件

```bash
# 插件已預裝在 wp-content/plugins/gold-price-calculator/
# 在 WordPress 管理介面中啟用即可
```

## 🔧 配置說明

### 金價 API 設定

編輯 `wp-config.php` 中的 API 設定：

```php
/** 金價引擎 API 設定 */
define('GOLD_PRICE_API_URL', 'http://localhost:3001');
define('GOLD_PRICE_API_TIMEOUT', 15);
```

### 商品設定

1. 新增商品時，勾選「貴金屬商品」
2. 選擇材質（黃金、白銀、鉑金、銅）
3. 設定重量（克）
4. 輸入工錢費用

### 價格顯示

- 價格會自動根據實時金價計算
- 每 15 分鐘自動更新
- 顯示價格分解（金料 + 工錢）

## 🌐 DreamHost 部署

### 1. 準備檔案

```bash
# 打包 WordPress 檔案
tar -czf wordpress-production.tar.gz wordpress/

# 上傳到 DreamHost
# 使用 FTP 或 cPanel 檔案管理器
```

### 2. 資料庫設定

```sql
-- 在 DreamHost MySQL 中建立資料庫
CREATE DATABASE your_db_name;
CREATE USER 'your_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_user'@'%';
```

### 3. 修改配置

更新 `wp-config.php` 生產環境設定：

```php
// 資料庫設定
define('DB_NAME', 'your_dreamhost_db');
define('DB_USER', 'your_dreamhost_user');
define('DB_PASSWORD', 'your_dreamhost_password');
define('DB_HOST', 'mysql.dreamhost.com');

// API 設定 (指向 DreamHost 上的 Node.js API)
define('GOLD_PRICE_API_URL', 'https://yourdomain.com/api');
```

### 4. SSL 和安全設定

```php
// 強制 HTTPS
define('FORCE_SSL_ADMIN', true);

// 安全密鑰 (從 https://api.wordpress.org/secret-key/1.1/salt/ 產生)
define('AUTH_KEY', 'your-unique-key');
// ... 其他密鑰
```

## 🔌 API 整合

### 金價計算 API

```javascript
// 呼叫範例
fetch('/wp-json/gold-calculator/v1/price/123')
  .then(response => response.json())
  .then(data => {
    console.log('價格資料:', data);
  });
```

### 可用端點

- `GET /wp-json/gold-calculator/v1/price/{product_id}` - 獲取商品價格
- `GET /wp-json/gold-calculator/v1/rates` - 獲取當前匯率

## 🎨 主題客製化

### 覆寫價格顯示

在主題的 `functions.php` 中：

```php
// 客製化價格顯示位置
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_price', 10);
add_action('woocommerce_single_product_summary', 'custom_gold_price_display', 10);

function custom_gold_price_display() {
    // 你的客製化價格顯示邏輯
}
```

### CSS 客製化

```css
/* 覆寫插件樣式 */
.gold-price-container {
    /* 你的客製化樣式 */
}
```

## 🚨 疑難排解

### 常見問題

1. **API 連線失敗**
   - 檢查 `GOLD_PRICE_API_URL` 設定
   - 確認 Node.js 服務正常運行
   - 檢查防火牆設定

2. **價格不更新**
   - 清除 WordPress 快取
   - 檢查瀏覽器控制台錯誤
   - 驗證 API 回應

3. **樣式問題**
   - 清除瀏覽器快取
   - 檢查主題衝突
   - 使用開發者工具除錯

### 除錯模式

啟用 WordPress 除錯：

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

查看錯誤日誌：`wp-content/debug.log`

## 📞 技術支援

- **文件**: [查看完整文件](../PROJECT_SUMMARY.md)
- **問題回報**: 請在 GitHub Issues 中回報
- **版本更新**: 關注 GitHub Releases

## 📄 授權

MIT License - 詳見 LICENSE 檔案