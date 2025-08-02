#!/bin/bash

# 黃金比例 WordPress 部署腳本
# 用於自動化部署到 DreamHost

set -e  # 遇到錯誤時停止

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置變數
PROJECT_NAME="gold-ratio-wordpress"
BUILD_DIR="./build"
WORDPRESS_DIR="./wordpress"
DEPLOYMENT_PACKAGE="wordpress-production.tar.gz"

# 函數：輸出彩色訊息
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函數：檢查必要工具
check_requirements() {
    print_status "檢查系統需求..."
    
    # 檢查 tar
    if ! command -v tar &> /dev/null; then
        print_error "tar 未安裝"
        exit 1
    fi
    
    # 檢查 git
    if ! command -v git &> /dev/null; then
        print_warning "git 未安裝，將跳過版本控制操作"
    fi
    
    print_success "系統需求檢查完成"
}

# 函數：清理建置目錄
clean_build() {
    print_status "清理建置目錄..."
    
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
    fi
    
    mkdir -p "$BUILD_DIR"
    print_success "建置目錄已清理"
}

# 函數：複製 WordPress 檔案
copy_wordpress() {
    print_status "複製 WordPress 檔案..."
    
    if [ ! -d "$WORDPRESS_DIR" ]; then
        print_error "WordPress 目錄不存在: $WORDPRESS_DIR"
        exit 1
    fi
    
    cp -r "$WORDPRESS_DIR"/* "$BUILD_DIR"/
    
    # 移除開發用檔案
    rm -f "$BUILD_DIR"/wp-config.php
    rm -f "$BUILD_DIR"/README.md
    
    print_success "WordPress 檔案複製完成"
}

# 函數：生成生產環境配置
generate_production_config() {
    print_status "生成生產環境配置..."
    
    cat > "$BUILD_DIR/wp-config.php" << 'EOF'
<?php
/**
 * WordPress 生產環境配置檔案
 * 黃金比例 - 貴金屬彈性報價電商系統
 */

// ** MySQL 設定 - 請根據 DreamHost 設定修改 ** //
/** 資料庫名稱 */
define('DB_NAME', 'YOUR_DREAMHOST_DB_NAME');

/** MySQL 資料庫使用者名稱 */
define('DB_USER', 'YOUR_DREAMHOST_DB_USER');

/** MySQL 資料庫密碼 */
define('DB_PASSWORD', 'YOUR_DREAMHOST_DB_PASSWORD');

/** MySQL 主機位址 */
define('DB_HOST', 'mysql.dreamhost.com');

/** 建立資料表時預設的文字編碼 */
define('DB_CHARSET', 'utf8mb4');

/** 資料庫對照表型態。請勿更改！ */
define('DB_COLLATE', '');

/** WordPress 資料表前綴字元 */
$table_prefix = 'wp_';

/** 生產環境設定 */
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

/** SSL 設定 */
define('FORCE_SSL_ADMIN', true);

/** 記憶體限制 */
define('WP_MEMORY_LIMIT', '512M');

/** 檔案上傳大小限制 */
define('WP_MAX_UPLOAD_SIZE', '128M');

/** 自動更新設定 */
define('WP_AUTO_UPDATE_CORE', true);

/** 檔案權限設定 */
define('FS_METHOD', 'direct');

/**
 * 認證用密鑰與加密用隨機字串
 * 請到 https://api.wordpress.org/secret-key/1.1/salt/ 產生新的密鑰
 */
define('AUTH_KEY',         'PUT_YOUR_UNIQUE_PHRASE_HERE');
define('SECURE_AUTH_KEY',  'PUT_YOUR_UNIQUE_PHRASE_HERE');
define('LOGGED_IN_KEY',    'PUT_YOUR_UNIQUE_PHRASE_HERE');
define('NONCE_KEY',        'PUT_YOUR_UNIQUE_PHRASE_HERE');
define('AUTH_SALT',        'PUT_YOUR_UNIQUE_PHRASE_HERE');
define('SECURE_AUTH_SALT', 'PUT_YOUR_UNIQUE_PHRASE_HERE');
define('LOGGED_IN_SALT',   'PUT_YOUR_UNIQUE_PHRASE_HERE');
define('NONCE_SALT',       'PUT_YOUR_UNIQUE_PHRASE_HERE');

/** 金價引擎 API 設定 */
define('GOLD_PRICE_API_URL', 'https://YOUR_DOMAIN.com/api');
define('GOLD_PRICE_API_TIMEOUT', 15);

/** 語言設定 */
define('WPLANG', 'zh_TW');

/** 絕對路徑設定 */
if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');

/** 載入 WordPress 設定與函式庫 */
require_once(ABSPATH . 'wp-settings.php');
EOF

    print_success "生產環境配置已生成"
}

# 函數：生成部署說明
generate_deployment_guide() {
    print_status "生成部署說明..."
    
    cat > "$BUILD_DIR/DEPLOYMENT_GUIDE.md" << 'EOF'
# DreamHost 部署指南

## 🚀 部署步驟

### 1. 上傳檔案
1. 解壓縮 `wordpress-production.tar.gz`
2. 上傳所有檔案到 DreamHost 網站根目錄

### 2. 設定資料庫
1. 登入 DreamHost 控制台
2. 建立 MySQL 資料庫
3. 記錄資料庫資訊：
   - 資料庫名稱
   - 使用者名稱
   - 密碼
   - 主機位址

### 3. 修改配置檔案
編輯 `wp-config.php`：
```php
define('DB_NAME', '你的資料庫名稱');
define('DB_USER', '你的使用者名稱');
define('DB_PASSWORD', '你的密碼');
define('DB_HOST', 'mysql.dreamhost.com');
```

### 4. 設定 SSL 證書
1. 在 DreamHost 控制台啟用 Let's Encrypt SSL
2. 確認 HTTPS 正常運作

### 5. 完成 WordPress 安裝
1. 瀏覽器開啟你的網域
2. 跟隨 WordPress 安裝精靈
3. 安裝 WooCommerce 插件
4. 啟用「黃金比例價格計算器」插件

### 6. 設定金價 API
確保 Node.js API 也部署到 DreamHost，並更新：
```php
define('GOLD_PRICE_API_URL', 'https://yourdomain.com/api');
```

## 🔧 測試清單
- [ ] 網站可正常存取
- [ ] WordPress 管理後台可登入
- [ ] WooCommerce 功能正常
- [ ] 金價計算器插件已啟用
- [ ] 實時價格計算正常運作
- [ ] SSL 證書有效
- [ ] 行動裝置顯示正常

## 📞 需要協助？
請參考專案文件或聯繫技術支援。
EOF

    print_success "部署說明已生成"
}

# 函數：建立壓縮檔
create_package() {
    print_status "建立部署壓縮檔..."
    
    cd "$BUILD_DIR"
    tar -czf "../$DEPLOYMENT_PACKAGE" .
    cd ..
    
    # 顯示檔案大小
    PACKAGE_SIZE=$(du -h "$DEPLOYMENT_PACKAGE" | cut -f1)
    print_success "部署檔案已建立: $DEPLOYMENT_PACKAGE ($PACKAGE_SIZE)"
}

# 函數：Git 操作
git_operations() {
    if command -v git &> /dev/null; then
        print_status "執行 Git 操作..."
        
        # 添加 WordPress 目錄到 Git
        git add wordpress/
        git add deploy-wordpress.sh
        
        # 檢查是否有變更
        if git diff --staged --quiet; then
            print_warning "沒有新的變更需要提交"
        else
            git commit -m "新增 WordPress 整合和部署腳本

- 新增完整的 WordPress 環境
- 整合金價計算器插件
- 新增 WooCommerce 支援
- 建立部署自動化腳本"
            print_success "Git 提交完成"
        fi
    fi
}

# 函數：顯示下一步指示
show_next_steps() {
    echo
    print_success "🎉 WordPress 部署檔案準備完成！"
    echo
    echo -e "${BLUE}下一步操作：${NC}"
    echo "1. 🌐 將 $DEPLOYMENT_PACKAGE 上傳到 DreamHost"
    echo "2. 🗄️ 在 DreamHost 建立 MySQL 資料庫"
    echo "3. ⚙️ 修改 wp-config.php 中的資料庫設定"
    echo "4. 🔒 設定 SSL 證書"
    echo "5. 🚀 完成 WordPress 安裝"
    echo "6. 🛒 安裝並設定 WooCommerce"
    echo "7. 💰 啟用金價計算器插件"
    echo
    echo -e "${YELLOW}重要提醒：${NC}"
    echo "- 記得更新 wp-config.php 中的資料庫設定"
    echo "- 確保 Node.js API 也部署到伺服器"
    echo "- 測試所有功能是否正常運作"
    echo
    echo -e "${GREEN}檔案位置：${NC} ./$DEPLOYMENT_PACKAGE"
    echo -e "${GREEN}部署指南：${NC} $BUILD_DIR/DEPLOYMENT_GUIDE.md"
}

# 主要執行流程
main() {
    echo -e "${GREEN}"
    echo "========================================"
    echo "    黃金比例 WordPress 部署工具"
    echo "========================================"
    echo -e "${NC}"
    
    check_requirements
    clean_build
    copy_wordpress
    generate_production_config
    generate_deployment_guide
    create_package
    git_operations
    show_next_steps
}

# 執行主程式
main "$@"