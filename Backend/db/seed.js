const fs = require('fs');
const path = require('path');
const pool = require('./index');

const dataPath = path.join(__dirname, '..', 'data', 'data.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

async function seed() {
    const client = await pool.connect();

    try {
        // ── Run schema.sql ──
        console.log('🔄 Running schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        await client.query(schema);
        console.log('✅ Schema created\n');

        // ── 1. Categories (alphabetically sorted) ──
        const categories = (data.categories || []).sort((a, b) =>
            (a.name || '').localeCompare(b.name || '')
        );

        for (const cat of categories) {
            await client.query(
                'INSERT INTO categories (id, name, image) VALUES (\$1, \$2, \$3)',
                [cat.id, cat.name || '', cat.image || '']
            );
        }
        console.log(`✅ ${categories.length} categories seeded (alphabetical order)`);

        // ── 2. Products (sorted by category → then price ASC) ──
        const products = (data.products || []).sort((a, b) => {
            const catCmp = (a.categoryId || '').localeCompare(b.categoryId || '');
            if (catCmp !== 0) return catCmp;
            return (a.price || 0) - (b.price || 0);
        });

        for (const p of products) {
            await client.query(
                `INSERT INTO products
         (id, title, brand, category, subcategory, category_id,
          price, original_price, discount, rating, rating_count,
          stock, images, highlights, specifications, description)
         VALUES (\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9,\$10,\$11,\$12,\$13,\$14,\$15,\$16)`,
                [
                    String(p.id),
                    p.title || '',
                    p.brand || '',
                    p.category || '',
                    p.subcategory || '',
                    p.categoryId || null,
                    p.price || 0,
                    p.originalPrice || p.price || 0,
                    p.discount || 0,
                    p.rating || 0,
                    p.ratingCount || p.reviewCount || 0,
                    p.stock != null ? p.stock : 10,
                    p.images || [],
                    p.highlights || [],
                    JSON.stringify(p.specifications || {}),
                    p.description || '',
                ]
            );
        }
        console.log(`✅ ${products.length} products seeded (price ASC per category)`);

        // ── 3. Banners ──
        const banners = data.banners || [];
        for (const b of banners) {
            // data.json banners are plain strings; DB banners are objects
            const image = typeof b === 'string' ? b : (b.image || '');
            const link = typeof b === 'string' ? '' : (b.link || b.url || '');
            await client.query(
                'INSERT INTO banners (image, link) VALUES ($1, $2)',
                [image, link]
            );
        }
        console.log(`✅ ${banners.length} banners seeded`);

        // ── 4. Home Sections ──
        const sections = data.homeSections || [];
        for (const s of sections) {
            await client.query(
                'INSERT INTO home_sections (title, type, product_ids) VALUES (\$1, \$2, \$3)',
                [s.title || '', s.type || 'product', s.productIds || []]
            );
        }
        console.log(`✅ ${sections.length} home sections seeded`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('   Run "npm run dev" to start the server');

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();