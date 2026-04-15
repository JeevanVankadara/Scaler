const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '..', 'data', 'data.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

const products = data.products || [];
const categories = data.categories || [];
const banners = data.banners || [];
const homeSections = data.homeSections || [];

// ── Products ──

function getProducts() {
    return products;
}

function getProductById(id) {
    return products.find((p) => String(p.id) === String(id)) || null;
}

function getProductsByIds(ids) {
    const idSet = new Set(ids.map(String));
    return products.filter((p) => idSet.has(String(p.id)));
}

function searchProducts({ q, category, minPrice, maxPrice, brand, sort }) {
    let results = [...products];

    if (q) {
        const query = q.toLowerCase();
        results = results.filter(
            (p) =>
                p.title.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.subcategory.toLowerCase().includes(query)
        );
    }

    if (category) {
        const cat = category.toLowerCase();
        results = results.filter(
            (p) =>
                p.category.toLowerCase() === cat ||
                p.categoryId === category
        );
    }

    if (brand) {
        const brands = brand.split(',').map((b) => b.toLowerCase().trim());
        results = results.filter((p) => brands.includes(p.brand.toLowerCase()));
    }

    if (minPrice !== undefined) {
        results = results.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined) {
        results = results.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === 'low-high') results.sort((a, b) => a.price - b.price);
    else if (sort === 'high-low') results.sort((a, b) => b.price - a.price);

    return results;
}

function getSimilarProducts(productId) {
    const product = getProductById(productId);
    if (!product) return [];
    return products
        .filter(
            (p) =>
                String(p.id) !== String(productId) &&
                (p.category === product.category || p.subcategory === product.subcategory)
        )
        .slice(0, 8);
}

function getProductsByCategory(categoryId) {
    return products.filter((p) => p.categoryId === categoryId);
}

function getSuggestions(query, limit = 8) {
    if (!query) return [];
    const q = query.toLowerCase();
    return products
        .filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.subcategory.toLowerCase().includes(q)
        )
        .slice(0, limit)
        .map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            image: p.images?.[0] || '',
        }));
}

// ── Categories / Home ──

function getCategories() {
    return categories;
}

function getBanners() {
    return banners;
}

function getHomeSections() {
    return homeSections.map((section) => {
        const sectionProducts = (section.productIds || [])
            .map((id) => getProductById(id))
            .filter(Boolean);
        return { ...section, products: sectionProducts };
    });
}

// ── Cart (in-memory, single user) ──

const cart = [];

function getCart() {
    return cart.map((item) => {
        const product = getProductById(item.productId);
        return { ...item, product };
    });
}

function addToCart(productId, quantity = 1) {
    const existing = cart.find((i) => String(i.productId) === String(productId));
    if (existing) {
        existing.quantity += quantity;
        return existing;
    }
    const newItem = { cartItemId: uuidv4(), productId: String(productId), quantity };
    cart.push(newItem);
    return newItem;
}

function updateCartItem(cartItemId, quantity) {
    const item = cart.find((i) => i.cartItemId === cartItemId);
    if (!item) return null;
    if (quantity <= 0) return removeFromCart(cartItemId);
    item.quantity = quantity;
    return item;
}

function removeFromCart(cartItemId) {
    const idx = cart.findIndex((i) => i.cartItemId === cartItemId);
    if (idx === -1) return null;
    return cart.splice(idx, 1)[0];
}

function clearCart() {
    cart.length = 0;
}

// ── Orders (in-memory) ──

const orders = [];

function getOrders() {
    return orders;
}

function getOrderById(orderId) {
    return orders.find((o) => o.orderId === orderId) || null;
}

function createOrder(shippingAddress, cartItems) {
    // ── Stock validation ──
    const outOfStockItems = [];
    for (const item of cartItems) {
        const product = getProductById(item.productId);
        if (!product) {
            outOfStockItems.push({
                productId: item.productId,
                title: 'Unknown Product',
                requested: item.quantity,
                available: 0,
            });
            continue;
        }
        if (item.quantity > product.stock) {
            outOfStockItems.push({
                productId: item.productId,
                title: product.title,
                requested: item.quantity,
                available: product.stock,
            });
        }
    }

    if (outOfStockItems.length > 0) {
        const err = new Error('STOCK_EXCEEDED');
        err.outOfStockItems = outOfStockItems;
        throw err;
    }

    // ── Build order ──
    const orderItems = cartItems.map((item) => {
        const product = getProductById(item.productId);
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: product ? product.price : 0,
            title: product ? product.title : 'Unknown Product',
            image: product && product.images ? product.images[0] : '',
            brand: product ? product.brand : '',
        };
    });

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = Math.round(subtotal * 0.1);
    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const total = subtotal - discount + deliveryCharge;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const order = {
        orderId: 'OD' + Date.now() + Math.floor(Math.random() * 1000),
        items: orderItems,
        shippingAddress,
        subtotal,
        discount,
        deliveryCharge,
        total,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            weekday: 'short',
        }),
    };

    // ── Decrement stock ──
    for (const item of cartItems) {
        const product = getProductById(item.productId);
        if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
        }
    }

    orders.unshift(order);
    clearCart();
    return order;
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
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getOrders,
    getOrderById,
    createOrder,
};