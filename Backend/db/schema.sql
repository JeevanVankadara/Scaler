-- ╔══════════════════════════════════════════════════════════════╗
-- ║  FLIPKART CLONE — POSTGRESQL SCHEMA                         ║
-- ║  Orders handled in frontend localStorage — NOT stored here  ║
-- ╚══════════════════════════════════════════════════════════════╝


DROP TABLE IF EXISTS home_sections CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;

-- ══════════════════════════════════════
-- 1. CATEGORIES (alphabetical by label)
-- ══════════════════════════════════════
CREATE TABLE categories (
    id          VARCHAR(50) PRIMARY KEY,
    label       VARCHAR(100) NOT NULL,
    icon        TEXT DEFAULT '',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ══════════════════════════════════════
-- 2. PRODUCTS
-- ══════════════════════════════════════
CREATE TABLE products (
    id              VARCHAR(50) PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    brand           VARCHAR(100) NOT NULL DEFAULT '',
    category        VARCHAR(100) NOT NULL DEFAULT '',
    category_id     VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price  NUMERIC(10,2) DEFAULT 0,
    discount_label  VARCHAR(50) DEFAULT '',
    rating          NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count    INTEGER DEFAULT 0 CHECK (review_count >= 0),
    reviews         VARCHAR(50) DEFAULT '',
    f_assured       BOOLEAN DEFAULT FALSE,
    stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    images          TEXT[] DEFAULT '{}',
    highlights      TEXT[] DEFAULT '{}',
    description     TEXT[] DEFAULT '{}',
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
    bg_color    VARCHAR(20) DEFAULT '#f5f5f5',
    category_id VARCHAR(50) DEFAULT '',
    product_ids TEXT[] DEFAULT '{}',
    created_at  TIMESTAMP DEFAULT NOW()
);



-- ══════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════

-- ★ Category page: products sorted by price — using id as tie-breaker
CREATE INDEX idx_products_category_price ON products(category_id, price ASC, id ASC);

-- ★ Category page: products sorted by rating — for "top rated" queries
CREATE INDEX idx_products_category_rating ON products(category_id, rating DESC);

CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);

-- ★ Partial index for Flipkart Assured products only
CREATE INDEX idx_products_assured ON products(id) WHERE f_assured = TRUE;

-- Full-text search GIN index
CREATE INDEX idx_products_search ON products
    USING GIN(to_tsvector('english', title || ' ' || brand || ' ' || category));



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
