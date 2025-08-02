<?php
/**
 * Plugin Name: 黃金比例價格計算器
 * Plugin URI: https://github.com/yourusername/gold-ratio-ecommerce
 * Description: 整合實時金價計算到 WooCommerce，支援黃金、白銀、鉑金等貴金屬動態定價
 * Version: 1.0.0
 * Author: 黃金比例團隊
 * License: GPL v2 or later
 * Text Domain: gold-price-calculator
 * Domain Path: /languages
 */

// 防止直接存取
if (!defined('ABSPATH')) {
    exit;
}

// 定義插件常數
define('GPC_PLUGIN_URL', plugin_dir_url(__FILE__));
define('GPC_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('GPC_PLUGIN_VERSION', '1.0.0');

class GoldPriceCalculator {
    
    private $api_base_url;
    
    public function __construct() {
        $this->api_base_url = defined('GOLD_PRICE_API_URL') ? GOLD_PRICE_API_URL : 'http://localhost:3001';
        add_action('init', [$this, 'init']);
        add_action('plugins_loaded', [$this, 'load_textdomain']);
        
        // 檢查 WooCommerce 是否啟用
        add_action('admin_init', [$this, 'check_woocommerce']);
    }
    
    public function init() {
        if (!$this->is_woocommerce_active()) {
            return;
        }
        
        // 管理後台功能
        add_action('woocommerce_product_options_general_product_data', [$this, 'add_custom_fields']);
        add_action('woocommerce_process_product_meta', [$this, 'save_custom_fields']);
        
        // 價格計算 Hooks
        add_filter('woocommerce_product_get_price', [$this, 'calculate_real_time_price'], 10, 2);
        add_filter('woocommerce_product_variation_get_price', [$this, 'calculate_real_time_price'], 10, 2);
        
        // 前端顯示
        add_action('woocommerce_single_product_summary', [$this, 'display_price_breakdown'], 25);
        
        // REST API
        add_action('rest_api_init', [$this, 'register_api_routes']);
        
        // 前端腳本
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        
        // 管理員設定頁面
        add_action('admin_menu', [$this, 'add_admin_menu']);
    }
    
    public function load_textdomain() {
        load_plugin_textdomain('gold-price-calculator', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function check_woocommerce() {
        if (!$this->is_woocommerce_active()) {
            add_action('admin_notices', [$this, 'woocommerce_missing_notice']);
        }
    }
    
    private function is_woocommerce_active() {
        return class_exists('WooCommerce');
    }
    
    public function woocommerce_missing_notice() {
        echo '<div class="notice notice-error"><p>';
        echo __('黃金比例價格計算器需要 WooCommerce 插件才能運作。', 'gold-price-calculator');
        echo '</p></div>';
    }
    
    /**
     * 添加商品自訂欄位
     */
    public function add_custom_fields() {
        echo '<div class="options_group">';
        echo '<h3>' . __('貴金屬設定', 'gold-price-calculator') . '</h3>';
        
        woocommerce_wp_checkbox([
            'id' => '_is_precious_metal',
            'label' => __('貴金屬商品', 'gold-price-calculator'),
            'description' => __('啟用實時金價計算', 'gold-price-calculator')
        ]);
        
        woocommerce_wp_select([
            'id' => '_material',
            'label' => __('材質', 'gold-price-calculator'),
            'options' => [
                '' => __('選擇材質...', 'gold-price-calculator'),
                'gold' => __('黃金', 'gold-price-calculator'),
                'silver' => __('白銀', 'gold-price-calculator'),
                'platinum' => __('鉑金', 'gold-price-calculator'),
                'copper' => __('銅', 'gold-price-calculator')
            ]
        ]);
        
        woocommerce_wp_text_input([
            'id' => '_workmanship_fee',
            'label' => __('工錢 (NT$)', 'gold-price-calculator'),
            'type' => 'number',
            'custom_attributes' => ['step' => '1', 'min' => '0'],
            'description' => __('固定工錢費用', 'gold-price-calculator')
        ]);
        
        echo '</div>';
    }
    
    /**
     * 儲存商品自訂欄位
     */
    public function save_custom_fields($post_id) {
        $is_precious_metal = isset($_POST['_is_precious_metal']) ? 'yes' : 'no';
        update_post_meta($post_id, '_is_precious_metal', $is_precious_metal);
        
        $material = sanitize_text_field($_POST['_material'] ?? '');
        update_post_meta($post_id, '_material', $material);
        
        $workmanship_fee = floatval($_POST['_workmanship_fee'] ?? 0);
        update_post_meta($post_id, '_workmanship_fee', $workmanship_fee);
    }
    
    /**
     * 計算實時價格
     */
    public function calculate_real_time_price($price, $product) {
        if ($product->get_meta('_is_precious_metal') !== 'yes') {
            return $price;
        }
        
        $weight = $product->get_weight();
        $material = $product->get_meta('_material');
        $workmanship = $product->get_meta('_workmanship_fee');
        
        if (!$weight || !$material) {
            return $price;
        }
        
        $calculated_price = $this->call_price_api($weight, $material, $workmanship);
        
        return $calculated_price ?: $price;
    }
    
    /**
     * 呼叫金價 API
     */
    private function call_price_api($weight, $material, $workmanship) {
        $endpoint = $this->api_base_url . '/api/prices/calculate';
        
        $response = wp_remote_post($endpoint, [
            'headers' => ['Content-Type' => 'application/json'],
            'body' => json_encode([
                'weight' => (float)$weight,
                'material' => $material,
                'workmanshipFee' => (float)$workmanship
            ]),
            'timeout' => defined('GOLD_PRICE_API_TIMEOUT') ? GOLD_PRICE_API_TIMEOUT : 15
        ]);
        
        if (is_wp_error($response)) {
            error_log('金價 API 呼叫失敗: ' . $response->get_error_message());
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if ($data && isset($data['totalPrice'])) {
            // 快取結果 15 分鐘
            $cache_key = "gold_price_{$weight}_{$material}_{$workmanship}";
            set_transient($cache_key, $data['totalPrice'], 15 * MINUTE_IN_SECONDS);
            
            return $data['totalPrice'];
        }
        
        return false;
    }
    
    /**
     * 顯示價格分解資訊
     */
    public function display_price_breakdown() {
        global $product;
        
        if ($product->get_meta('_is_precious_metal') !== 'yes') {
            return;
        }
        
        echo '<div id="gold-price-breakdown" class="gold-price-container" data-product-id="' . $product->get_id() . '">';
        echo '<div class="price-loading">' . __('計算實時金價中...', 'gold-price-calculator') . '</div>';
        echo '</div>';
    }
    
    /**
     * 註冊 REST API 路由
     */
    public function register_api_routes() {
        register_rest_route('gold-calculator/v1', '/price/(?P<product_id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_product_price'],
            'permission_callback' => '__return_true'
        ]);
        
        register_rest_route('gold-calculator/v1', '/rates', [
            'methods' => 'GET',
            'callback' => [$this, 'get_current_rates'],
            'permission_callback' => '__return_true'
        ]);
    }
    
    /**
     * API: 獲取商品價格
     */
    public function get_product_price($request) {
        $product_id = $request['product_id'];
        $product = wc_get_product($product_id);
        
        if (!$product || $product->get_meta('_is_precious_metal') !== 'yes') {
            return new WP_REST_Response(['error' => 'Product not found or not a precious metal'], 404);
        }
        
        $weight = $product->get_weight();
        $material = $product->get_meta('_material');
        $workmanship = $product->get_meta('_workmanship_fee');
        
        $price_data = $this->get_detailed_price($weight, $material, $workmanship);
        
        if ($price_data) {
            return new WP_REST_Response([
                'success' => true,
                'data' => $price_data
            ], 200);
        }
        
        return new WP_REST_Response(['error' => 'Unable to calculate price'], 500);
    }
    
    /**
     * 獲取詳細價格資訊
     */
    private function get_detailed_price($weight, $material, $workmanship) {
        $endpoint = $this->api_base_url . '/api/prices/calculate';
        
        $response = wp_remote_post($endpoint, [
            'headers' => ['Content-Type' => 'application/json'],
            'body' => json_encode([
                'weight' => (float)$weight,
                'material' => $material,
                'workmanshipFee' => (float)$workmanship
            ]),
            'timeout' => 15
        ]);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        return json_decode($body, true);
    }
    
    /**
     * 載入前端腳本
     */
    public function enqueue_scripts() {
        if (is_product()) {
            wp_enqueue_script(
                'gold-price-calculator',
                GPC_PLUGIN_URL . 'assets/js/gold-price-calculator.js',
                ['jquery'],
                GPC_PLUGIN_VERSION,
                true
            );
            
            wp_localize_script('gold-price-calculator', 'goldPriceAjax', [
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('gold_price_nonce'),
                'api_base' => home_url('/wp-json/gold-calculator/v1/')
            ]);
            
            wp_enqueue_style(
                'gold-price-calculator',
                GPC_PLUGIN_URL . 'assets/css/gold-price-calculator.css',
                [],
                GPC_PLUGIN_VERSION
            );
        }
    }
    
    /**
     * 添加管理員選單
     */
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            __('黃金比例設定', 'gold-price-calculator'),
            __('金價設定', 'gold-price-calculator'),
            'manage_woocommerce',
            'gold-price-settings',
            [$this, 'admin_page']
        );
    }
    
    /**
     * 管理員設定頁面
     */
    public function admin_page() {
        echo '<div class="wrap">';
        echo '<h1>' . __('黃金比例價格計算器設定', 'gold-price-calculator') . '</h1>';
        echo '<p>' . __('配置貴金屬實時價格計算設定', 'gold-price-calculator') . '</p>';
        echo '</div>';
    }
}

// 啟動插件
new GoldPriceCalculator();