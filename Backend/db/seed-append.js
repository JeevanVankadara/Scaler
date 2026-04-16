const fs = require('fs');
const path = require('path');
const pool = require('./index');

// ── Configuration ──
const ID_OFFSET = 28;  // data.json ends at id "28", so data2 starts at "29"

const dataPath = path.join(__dirname, '..', 'data', 'data2.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

async function seedAppend() {
    const client = await pool.connect();

    try {
        // ── 1. Products (offset IDs to avoid conflicts) ──
        const products = (data.products || []).sort((a, b) => {
            const catCmp = (a.categoryId || '').localeCompare(b.categoryId || '');
            if (catCmp !== 0) return catCmp;
            return (a.price || 0) - (b.price || 0);
        });

        for (const p of products) {
            const newId = String(Number(p.id) + ID_OFFSET);
            await client.query(
                `INSERT INTO products
         (id, title, brand, category, category_id,
          price, original_price, discount_label, rating, review_count, reviews, f_assured,
          stock, images, highlights, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (id) DO NOTHING`,
                [
                    newId,
                    p.title || '',
                    p.brand || '',
                    p.category || '',
                    p.categoryId || null,
                    p.price || 0,
                    p.originalPrice || p.price || 0,
                    p.discountLabel || '',
                    p.rating || 0,
                    p.reviewCount || 0,
                    p.reviews || '',
                    p.fAssured || false,
                    p.stock != null ? p.stock : 10,
                    p.images || [],
                    p.highlights || [],
                    p.description || [],
                ]
            );
        }
        console.log(`✅ ${products.length} products appended (IDs offset by ${ID_OFFSET})`);

        // ── 2. Home Sections (offset productIds) ──
        const sections = data.homeSections || [];
        for (const s of sections) {
            const offsetIds = (s.productIds || []).map(
                (pid) => String(Number(pid) + ID_OFFSET)
            );
            await client.query(
                'INSERT INTO home_sections (title, type, bg_color, category_id, product_ids) VALUES ($1, $2, $3, $4, $5)',
                [
                    s.title || '',
                    s.type || 'product',
                    s.bgColor || '#f5f5f5',
                    s.categoryId || '',
                    offsetIds,
                ]
            );
        }
        console.log(`✅ ${sections.length} home sections appended`);

        // Categories and banners are SKIPPED — they already exist from data.json

        console.log('\n🎉 data2.json appended successfully!');
    } catch (err) {
        console.error('❌ Append failed:', err.message);
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedAppend();
