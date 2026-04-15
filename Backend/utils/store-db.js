const pool = require('../db/index');

// ══════════════════════════════════════
// IN-MEMORY CACHE (TTL = 5 minutes)
// ══════════════════════════════════════
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setCache(key, data) {
    cache.set(key, { data, ts: Date.now() });
}

function invalidateCache() {
    cache.clear();
}

// ══════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════

async function getProducts() {
    const cached = getCached('all_products');
    if (cached) return cached;
    const { rows } = await pool.query(
        'SELECT * FROM products ORDER BY category, price ASC'
    );
    const products = rows.map(formatProduct);
    setCache('all_products', products);
    return products;
}

async function getProductById(id) {
    const cacheKey = `product_${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    const { rows } = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [String(id)]
    );
    const product = rows[0] ? formatProduct(rows[0]) : null;
    if (product) setCache(cacheKey, product);
    return product;
}

async function getProductsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const cacheKey = `batch_${ids.sort().join(',')}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const { rows } = await pool.query(
        `SELECT * FROM products WHERE id IN (${placeholders}) ORDER BY price ASC`,
        ids.map(String)
    );
    const products = rows.map(formatProduct);
    setCache(cacheKey, products);
    return products;
}

async function searchProducts({ q, category, minPrice, maxPrice, brand, sort }) {
    // Build a cache key from all filter params
    const cacheKey = `search_${q || ''}_${category || ''}_${minPrice || ''}_${maxPrice || ''}_${brand || ''}_${sort || ''}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let idx = 1;

    if (q) {
        query += ` AND (
      to_tsvector('english', title || ' ' || brand || ' ' || category)
      @@ plainto_tsquery('english', $${idx})
      OR title ILIKE $${idx + 1}
      OR brand ILIKE $${idx + 1}
      OR category ILIKE $${idx + 1}
    )`;
        params.push(q, `%${q}%`);
        idx += 2;
    }

    if (category) {
        query += ` AND (LOWER(category) = LOWER($${idx}) OR category_id = $${idx})`;
        params.push(category);
        idx++;
    }

    if (brand) {
        const brands = brand.split(',').map((b) => b.trim().toLowerCase());
        const ph = brands.map((_, i) => `$${idx + i}`).join(',');
        query += ` AND LOWER(brand) IN (${ph})`;
        params.push(...brands);
        idx += brands.length;
    }

    if (minPrice !== undefined) {
        query += ` AND price >= $${idx}`;
        params.push(Number(minPrice));
        idx++;
    }

    if (maxPrice !== undefined) {
        query += ` AND price <= $${idx}`;
        params.push(Number(maxPrice));
        idx++;
    }

    if (sort === 'high-low') query += ' ORDER BY price DESC';
    else query += ' ORDER BY price ASC';

    const { rows } = await pool.query(query, params);
    const products = rows.map(formatProduct);
    setCache(cacheKey, products);
    return products;
}

async function getSimilarProducts(productId) {
    const cacheKey = `similar_${productId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const product = await getProductById(productId);
    if (!product) return [];

    const { rows } = await pool.query(
        `SELECT * FROM products
     WHERE id != $1 AND category = $2
     ORDER BY price ASC LIMIT 8`,
        [String(productId), product.category]
    );
    const products = rows.map(formatProduct);
    setCache(cacheKey, products);
    return products;
}

// ★ Uses idx_products_category_price — single index scan
async function getProductsByCategory(categoryId) {
    const cacheKey = `cat_${categoryId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;
    const { rows } = await pool.query(
        'SELECT * FROM products WHERE category_id = $1 ORDER BY price ASC',
        [categoryId]
    );
    const products = rows.map(formatProduct);
    setCache(cacheKey, products);
    return products;
}

async function getSuggestions(query, limit = 8) {
    if (!query) return [];
    const cacheKey = `suggest_${query}_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const { rows } = await pool.query(
        `SELECT id, title, category, images[1] AS image
     FROM products
     WHERE title ILIKE $1 OR brand ILIKE $1 OR category ILIKE $1
     ORDER BY price ASC LIMIT $2`,
        [`%${query}%`, limit]
    );
    const suggestions = rows.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        image: r.image || '',
    }));
    setCache(cacheKey, suggestions);
    return suggestions;
}

// ══════════════════════════════════════
// CATEGORIES / HOME
// ══════════════════════════════════════

async function getCategories() {
    const cached = getCached('categories');
    if (cached) return cached;
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY label ASC');
    setCache('categories', rows);
    return rows;
}

async function getBanners() {
    const cached = getCached('banners');
    if (cached) return cached;
    const { rows } = await pool.query('SELECT * FROM banners ORDER BY id ASC');
    const banners = rows.map((r) => r.image);
    setCache('banners', banners);
    return banners;
}

async function getHomeSections() {
    // Check cache first
    const cached = getCached('homeSections');
    if (cached) return cached;

    const { rows: sections } = await pool.query(
        'SELECT * FROM home_sections ORDER BY id ASC'
    );

    // ── Batch: collect ALL product IDs across all sections into one query ──
    const allIds = new Set();
    for (const section of sections) {
        for (const pid of (section.product_ids || [])) {
            allIds.add(pid);
        }
    }

    const productMap = {};
    if (allIds.size > 0) {
        const idArr = [...allIds];
        const ph = idArr.map((_, i) => `$${i + 1}`).join(',');
        const { rows } = await pool.query(
            `SELECT * FROM products WHERE id IN (${ph})`,
            idArr
        );
        for (const row of rows) {
            productMap[String(row.id)] = formatProduct(row);
        }
    }

    // ── Assemble sections using the pre-fetched product map ──
    const results = sections.map((section) => {
        const pIds = section.product_ids || [];
        const products = pIds
            .map((pid) => productMap[String(pid)])
            .filter(Boolean)
            .sort((a, b) => a.price - b.price);

        return {
            id: section.id,
            title: section.title,
            type: section.type,
            productIds: pIds,
            categoryId: section.category_id || '',
            bgColor: section.bg_color || '#f5f5f5',
            products,
        };
    });

    setCache('homeSections', results);
    return results;
}

// ══════════════════════════════════════════════════════════════
// ORDER PLACEMENT — Stock locking only, NO DB storage
// Cart comes from frontend localStorage
// Order returned to frontend → stored in localStorage
// ══════════════════════════════════════════════════════════════

async function createOrder(shippingAddress, cartItems) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // ── Step 1: Lock rows with SELECT FOR UPDATE ──
        const outOfStockItems = [];
        const lockedProducts = [];

        for (const item of cartItems) {
            const { rows } = await client.query(
                'SELECT * FROM products WHERE id = $1 FOR UPDATE',
                [String(item.productId)]
            );

            if (rows.length === 0) {
                outOfStockItems.push({
                    productId: item.productId,
                    title: 'Unknown Product',
                    requested: item.quantity,
                    available: 0,
                });
                continue;
            }

            const product = rows[0];

            if (item.quantity > product.stock) {
                outOfStockItems.push({
                    productId: item.productId,
                    title: product.title,
                    requested: item.quantity,
                    available: product.stock,
                });
            } else {
                lockedProducts.push({ ...product, requestedQty: item.quantity });
            }
        }

        // ── Step 2: Reject if anything out of stock ──
        if (outOfStockItems.length > 0) {
            await client.query('ROLLBACK');
            const err = new Error('STOCK_EXCEEDED');
            err.outOfStockItems = outOfStockItems;
            throw err;
        }

        // ── Step 3: Build order object (for frontend localStorage) ──
        const orderItems = lockedProducts.map((p) => ({
            productId: String(p.id),
            quantity: p.requestedQty,
            price: parseFloat(p.price),
            title: p.title,
            image: p.images && p.images[0] ? p.images[0] : '',
            brand: p.brand || '',
        }));

        const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const discount = Math.round(subtotal * 0.1);
        const deliveryCharge = subtotal > 500 ? 0 : 40;
        const total = subtotal - discount + deliveryCharge;

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            weekday: 'short',
        });

        const orderId = 'OD' + Date.now() + Math.floor(Math.random() * 1000);

        // ── Step 4: Decrement stock (still inside lock) ──
        for (const p of lockedProducts) {
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [p.requestedQty, String(p.id)]
            );
        }

        // ── Step 5: COMMIT — releases all locks ──
        await client.query('COMMIT');

        // Stock changed — clear cached data
        invalidateCache();

        // ── Return to frontend → stored in localStorage ──
        return {
            orderId,
            items: orderItems,
            shippingAddress,
            subtotal,
            discount,
            deliveryCharge,
            total,
            status: 'confirmed',
            orderDate: new Date().toISOString(),
            estimatedDelivery,
        };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

// ══════════════════════════════════════
// FORMAT HELPERS
// ══════════════════════════════════════

function formatProduct(row) {
    const price = parseFloat(row.price);
    const originalPrice = parseFloat(row.original_price) || price;

    return {
        id: row.id,
        title: row.title,
        brand: row.brand,
        category: row.category,
        categoryId: row.category_id,
        price,
        originalPrice,
        discountLabel: row.discount_label || '',
        rating: parseFloat(row.rating) || 0,
        reviewCount: row.review_count || 0,
        reviews: row.reviews || '',
        stock: row.stock || 0,
        images: row.images || [],
        highlights: row.highlights || [],
        description: row.description || [],
        fAssured: row.f_assured || false,
    };
}

module.exports = {
    getProducts,
    getProductById,
    getProductsByIds,
    searchProducts,
    getSimilarProducts,
    getSuggestions,
    getCategories,
    getBanners,
    getHomeSections,
    getProductsByCategory,
    createOrder,
};