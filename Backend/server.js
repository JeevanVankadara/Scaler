const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config();

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const categoriesRouter = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Gzip compression — reduces response sizes ~70%
app.use(compression());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/categories', categoriesRouter);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Flipkart Clone API running' });
});

app.listen(PORT, () => {
    console.log(`Backend running → http://localhost:${PORT}`);
});