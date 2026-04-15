const express = require('express');
const router = express.Router();
const store = require('../utils/store');

// GET /api/products
router.get('/', (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, brand, sort } = req.query;
        const products = store.searchProducts({ q, category, minPrice, maxPrice, brand, sort });
        res.json({ success: true, count: products.length, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/home
router.get('/home', (_req, res) => {
    try {
        const banners = store.getBanners();
        const homeSections = store.getHomeSections();
        res.json({ success: true, banners, homeSections });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/products/batch — get multiple products by IDs
router.post('/batch', (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'ids array is required' });
        }
        const products = store.getProductsByIds(ids);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/category/:categoryId
router.get('/category/:categoryId', (req, res) => {
    try {
        const products = store.getProductsByCategory(req.params.categoryId);
        res.json({ success: true, count: products.length, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/similar/:id
router.get('/similar/:id', (req, res) => {
    try {
        const products = store.getSimilarProducts(req.params.id);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
    try {
        const product = store.getProductById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;