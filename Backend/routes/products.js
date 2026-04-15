const express = require('express');
const router = express.Router();
const store = require('../utils/store-db');

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, brand, sort } = req.query;
        const products = await store.searchProducts({ q, category, minPrice, maxPrice, brand, sort });
        res.json({ success: true, count: products.length, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/suggestions
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        const suggestions = await store.getSuggestions(q);
        res.json({ success: true, suggestions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/home
router.get('/home', async (_req, res) => {
    try {
        const banners = await store.getBanners();
        const homeSections = await store.getHomeSections();
        res.json({ success: true, banners, homeSections });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/products/batch
router.post('/batch', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'ids array is required' });
        }
        const products = await store.getProductsByIds(ids);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/category/:categoryId
router.get('/category/:categoryId', async (req, res) => {
    try {
        const products = await store.getProductsByCategory(req.params.categoryId);
        res.json({ success: true, count: products.length, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/similar/:id
router.get('/similar/:id', async (req, res) => {
    try {
        const products = await store.getSimilarProducts(req.params.id);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await store.getProductById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;