const express = require('express');
const router = express.Router();
const store = require('../utils/store-db');
const { sendOrderConfirmationEmail } = require('../utils/mailer');

// POST /api/orders — validates stock, decrements, returns order for localStorage
router.post('/', async (req, res) => {
    try {
        const { shippingAddress, cartItems, email } = req.body;
        if (!shippingAddress || !cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'shippingAddress and cartItems required',
            });
        }
        const order = await store.createOrder(shippingAddress, cartItems);

        // Fire-and-forget: send order confirmation email
        // Uses 'email' from request body (sourced from localStorage on frontend)
        // Falls back to default email inside mailer if not provided
        sendOrderConfirmationEmail(email, order).catch((err) =>
            console.error('Email sending failed:', err.message)
        );

        res.status(201).json({ success: true, order });
    } catch (err) {
        if (err.message === 'STOCK_EXCEEDED') {
            return res.status(400).json({
                success: false,
                message: 'Some items exceed available stock',
                outOfStockItems: err.outOfStockItems,
            });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;