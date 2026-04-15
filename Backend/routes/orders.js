const express = require('express');
const router = express.Router();
const store = require('../utils/store');

// GET /api/orders
router.get('/', (_req, res) => {
    try {
        const orders = store.getOrders();
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/orders/:orderId
router.get('/:orderId', (req, res) => {
    try {
        const order = store.getOrderById(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/orders
router.post('/', (req, res) => {
    try {
        const { shippingAddress, cartItems } = req.body;
        if (!shippingAddress || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'shippingAddress and cartItems required' });
        }
        const order = store.createOrder(shippingAddress, cartItems);
        res.status(201).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;