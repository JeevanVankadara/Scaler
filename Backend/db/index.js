const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.query('SELECT NOW()')
    .then(() => console.log('✅ Connected to Neon PostgreSQL'))
    .catch((err) => console.error('❌ DB connection error:', err.message));

module.exports = pool;