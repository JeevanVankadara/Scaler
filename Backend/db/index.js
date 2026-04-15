const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
});

// Prevent crashes from idle connection resets (common with Supabase pooler)
pool.on('error', (err) => {
    console.warn('⚠️  Idle DB client error (non-fatal):', err.message);
});

pool.query('SELECT NOW()')
    .then(() => console.log('✅ Connected to Neon PostgreSQL'))
    .catch((err) => console.error('❌ DB connection error:', err.message));

module.exports = pool;