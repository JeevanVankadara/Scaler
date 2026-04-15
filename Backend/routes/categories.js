const express = require('express');
const router = express.Router();
const store = require('../utils/store');

// GET /api/categories
router.get('/', (_req, res) => {
    try {
        const categories = store.getCategories();
        res.json({ success: true, categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;