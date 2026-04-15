const express = require('express');
const router = express.Router();
const store = require('../utils/store');

// GET /api/cart
router.get('/', (_req, res) => {
    try {
        const cart = store.getCart();
        res.json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/cart
router.post('/', (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) return res.status(400).json({ success: false, message: 'productId required' });
        const product = store.getProductById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        const item = store.addToCart(productId, quantity || 1);
        res.json({ success: true, item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/cart/:cartItemId
router.put('/:cartItemId', (req, res) => {
    try {
        const { quantity } = req.body;
        const item = store.updateCartItem(req.params.cartItemId, quantity);
        if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
        res.json({ success: true, item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/cart/:cartItemId
router.delete('/:cartItemId', (req, res) => {
    try {
        const removed = store.removeFromCart(req.params.cartItemId);
        if (!removed) return res.status(404).json({ success: false, message: 'Cart item not found' });
        res.json({ success: true, removed });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;