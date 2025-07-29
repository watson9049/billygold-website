-- 銀樓智慧大腦資料庫初始結構
-- 建立時間: 2024-01-01

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 商品分類表
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 商品材質表
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    purity DECIMAL(5,2), -- 純度百分比
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 商品表
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    weight DECIMAL(10,3) NOT NULL, -- 重量 (台錢)
    material_id INTEGER REFERENCES materials(id),
    category_id INTEGER REFERENCES product_categories(id),
    design_style VARCHAR(100), -- 設計風格
    suitable_occasion VARCHAR(100), -- 適合場合
    craftsmanship_fee DECIMAL(10,2) DEFAULT 500, -- 工錢 (台幣)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 價格設定表
CREATE TABLE price_settings (
    id SERIAL PRIMARY KEY,
    update_interval INTEGER DEFAULT 900000, -- 更新間隔 (毫秒)
    min_update_interval INTEGER DEFAULT 900000, -- 最小更新間隔
    max_update_interval INTEGER DEFAULT 86400000, -- 最大更新間隔
    default_exchange_rate DECIMAL(10,4) DEFAULT 31.5, -- 預設匯率
    default_workmanship_fee DECIMAL(10,2) DEFAULT 500, -- 預設工錢
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 價格歷史表
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    gold_price_usd DECIMAL(10,2), -- 國際金價 (USD/oz)
    exchange_rate DECIMAL(10,4), -- 匯率
    final_price_twd DECIMAL(12,2), -- 最終售價 (台幣)
    craftsmanship_fee DECIMAL(10,2), -- 工錢
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 客戶表
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    preferences JSONB, -- 購買偏好
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 訂單表
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. 訂單明細表
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL, -- 購買時的單價
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立索引
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_material ON products(material_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_created ON price_history(created_at);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 建立更新時間觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為需要更新時間的表格建立觸發器
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_settings_updated_at BEFORE UPDATE ON price_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 