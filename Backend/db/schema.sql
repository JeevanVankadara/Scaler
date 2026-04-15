-- ╔══════════════════════════════════════════════════════════════╗
-- ║  FLIPKART CLONE — POSTGRESQL SCHEMA                         ║
-- ║  Orders handled in frontend localStorage — NOT stored here  ║
-- ╚══════════════════════════════════════════════════════════════╝

DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS home_sections CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;

-- ══════════════════════════════════════
-- 1. CATEGORIES (alphabetical by name)
-- ══════════════════════════════════════
CREATE TABLE categories (
    id          VARCHAR(50) PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    image       TEXT DEFAULT '',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 2. PRODUCTS (price ASC per category)
-- ══════════════════════════════════════
CREATE TABLE products (
    id              VARCHAR(50) PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    brand           VARCHAR(100) NOT NULL DEFAULT '',
    category        VARCHAR(100) NOT NULL DEFAULT '',
    subcategory     VARCHAR(100) NOT NULL DEFAULT '',
    category_id     VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price  NUMERIC(10,2) DEFAULT 0,
    discount        INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    rating          NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    rating_count    INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    images          TEXT[] DEFAULT '{}',
    highlights      TEXT[] DEFAULT '{}',
    specifications  JSONB DEFAULT '{}',
    description     TEXT DEFAULT '',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 3. BANNERS
-- ══════════════════════════════════════
CREATE TABLE banners (
    id          SERIAL PRIMARY KEY,
    image       TEXT NOT NULL DEFAULT '',
    link        TEXT DEFAULT '',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 4. HOME SECTIONS
-- ══════════════════════════════════════
CREATE TABLE home_sections (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    type        VARCHAR(50) DEFAULT 'product',
    product_ids TEXT[] DEFAULT '{}',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 5. CART ITEMS
-- ══════════════════════════════════════
CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     VARCHAR(100) NOT NULL DEFAULT 'default-user',
    product_id  VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ══════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════

-- ★ Category page: products sorted by price — single index scan
CREATE INDEX idx_products_category_price ON products(category_id, price ASC);

CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_subcategory ON products(subcategory);

-- Full-text search GIN index
CREATE INDEX idx_products_search ON products
    USING GIN(to_tsvector('english', title || ' ' || brand || ' ' || category || ' ' || subcategory));

-- Cart per user
CREATE INDEX idx_cart_user ON cart_items(user_id);

-- ══════════════════════════════════════
-- AUTO-UPDATE TRIGGER
-- ══════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS 
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_cart_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();