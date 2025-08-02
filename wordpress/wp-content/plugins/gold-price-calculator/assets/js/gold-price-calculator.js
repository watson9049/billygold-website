/**
 * 黃金比例價格計算器 - 前端 JavaScript
 * Version: 1.0.0
 */

class WordPressGoldPriceCalculator {
    constructor() {
        this.apiBase = goldPriceAjax.api_base;
        this.updateInterval = 15 * 60 * 1000; // 15 分鐘
        this.init();
    }
    
    init() {
        // 頁面載入時計算價格
        jQuery(document).ready(() => {
            this.updateAllPrices();
        });
        
        // 定期更新價格 (配合後端更新頻率)
        setInterval(() => {
            this.updateAllPrices();
        }, this.updateInterval);
        
        // 監聽商品變化 (變體選擇等)
        jQuery('form.variations_form').on('found_variation', () => {
            setTimeout(() => this.updateAllPrices(), 500);
        });
    }
    
    async updateAllPrices() {
        const priceElements = document.querySelectorAll('[data-product-id]');
        
        for (const element of priceElements) {
            const productId = element.dataset.productId;
            await this.updateSinglePrice(productId, element);
        }
    }
    
    async updateSinglePrice(productId, element) {
        try {
            element.classList.add('price-updating');
            element.innerHTML = '<div class="calculating">⏳ 計算實時金價中...</div>';
            
            const response = await fetch(`${this.apiBase}price/${productId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.renderPrice(element, result.data);
            } else {
                throw new Error('價格計算失敗');
            }
        } catch (error) {
            console.error('金價更新失敗:', error);
            element.innerHTML = '<span class="price-error">⚠️ 價格暫時無法取得</span>';
        } finally {
            element.classList.remove('price-updating');
        }
    }
    
    renderPrice(element, priceData) {
        const lastUpdated = new Date(priceData.timestamp || Date.now()).toLocaleString('zh-TW');
        
        element.innerHTML = `
            <div class="gold-price-display">
                <div class="final-price">
                    <span class="currency">NT$</span>
                    <span class="amount">${this.formatNumber(priceData.totalPrice)}</span>
                </div>
                
                ${priceData.breakdown ? `
                <div class="price-breakdown">
                    <div class="breakdown-item">
                        <span class="label">💰 金料價值:</span>
                        <span class="value">NT$ ${this.formatNumber(priceData.breakdown.goldValue)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="label">🔨 工錢費用:</span>
                        <span class="value">NT$ ${this.formatNumber(priceData.breakdown.workmanship)}</span>
                    </div>
                </div>
                ` : ''}
                
                <div class="price-info">
                    <div class="real-time-badge">🔴 即時金價</div>
                    <div class="last-updated">更新時間: ${lastUpdated}</div>
                </div>
                
                ${priceData.internationalPrice ? `
                <div class="market-info">
                    <small>國際金價: $${priceData.internationalPrice}/oz | 匯率: ${priceData.exchangeRate}</small>
                </div>
                ` : ''}
            </div>
        `;
        
        // 添加動畫效果
        element.classList.add('price-updated');
        setTimeout(() => element.classList.remove('price-updated'), 1000);
    }
    
    formatNumber(number) {
        return new Intl.NumberFormat('zh-TW').format(Math.round(number));
    }
    
    // 手動刷新價格
    refreshPrice(productId) {
        const element = document.querySelector(`[data-product-id="${productId}"]`);
        if (element) {
            this.updateSinglePrice(productId, element);
        }
    }
}

// 價格趨勢顯示器
class PriceTrendDisplay {
    constructor() {
        this.previousPrices = new Map();
        this.init();
    }
    
    init() {
        // 監聽價格更新事件
        document.addEventListener('priceUpdated', (event) => {
            this.updateTrend(event.detail.productId, event.detail.price);
        });
    }
    
    updateTrend(productId, currentPrice) {
        const previousPrice = this.previousPrices.get(productId);
        
        if (previousPrice) {
            const change = currentPrice - previousPrice;
            const changePercent = (change / previousPrice) * 100;
            
            this.displayTrend(productId, change, changePercent);
        }
        
        this.previousPrices.set(productId, currentPrice);
    }
    
    displayTrend(productId, change, changePercent) {
        const element = document.querySelector(`[data-product-id="${productId}"]`);
        if (!element) return;
        
        const trendElement = element.querySelector('.price-trend') || this.createTrendElement(element);
        
        const isPositive = change > 0;
        const arrow = isPositive ? '📈' : change < 0 ? '📉' : '➡️';
        const className = isPositive ? 'trend-up' : change < 0 ? 'trend-down' : 'trend-neutral';
        
        trendElement.className = `price-trend ${className}`;
        trendElement.innerHTML = `
            ${arrow} ${Math.abs(change).toFixed(0)} (${Math.abs(changePercent).toFixed(2)}%)
        `;
    }
    
    createTrendElement(parentElement) {
        const trendElement = document.createElement('div');
        trendElement.className = 'price-trend';
        parentElement.querySelector('.price-info').appendChild(trendElement);
        return trendElement;
    }
}

// 匯率顯示器
class ExchangeRateDisplay {
    constructor() {
        this.init();
    }
    
    async init() {
        try {
            const response = await fetch(`${goldPriceAjax.api_base}rates`);
            const rates = await response.json();
            
            if (rates.success) {
                this.displayRates(rates.data);
            }
        } catch (error) {
            console.error('無法獲取匯率資訊:', error);
        }
    }
    
    displayRates(rates) {
        const rateContainer = document.getElementById('exchange-rates');
        if (rateContainer) {
            rateContainer.innerHTML = `
                <div class="rates-display">
                    <h4>💱 今日匯率</h4>
                    <div class="rate-item">USD/TWD: ${rates.exchangeRate}</div>
                    <div class="rate-item">金價: $${rates.goldPrice}/oz</div>
                </div>
            `;
        }
    }
}

// 初始化所有功能
jQuery(document).ready(function($) {
    // 確保在 WooCommerce 頁面上執行
    if (typeof goldPriceAjax !== 'undefined') {
        window.goldCalculator = new WordPressGoldPriceCalculator();
        window.priceTrend = new PriceTrendDisplay();
        window.exchangeRates = new ExchangeRateDisplay();
        
        // 全域重新整理函數
        window.refreshGoldPrices = function() {
            window.goldCalculator.updateAllPrices();
        };
        
        // 手動重新整理按鈕
        $(document).on('click', '.refresh-gold-price', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            window.goldCalculator.refreshPrice(productId);
        });
        
        console.log('🏆 黃金比例價格計算器已啟動');
    }
});