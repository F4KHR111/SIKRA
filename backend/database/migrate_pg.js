const { Client } = require("pg");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const connectionString = process.env.POSTGRES_URL || 
                         process.env.POSTGRES_DATABASE_URL || 
                         process.env.POSTGRES_PRISMA_DATABASE_URL;

async function runPostgresMigration() {
    console.log("==================================================");
    console.log("🚀 Menghubungkan ke Prisma Postgres...");
    console.log("==================================================");

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ Berhasil terhubung ke PostgreSQL cloud database!");

        console.log("\n🔨 Membuat tabel-tabel...");

        // 1. Roles
        await client.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                nama_role VARCHAR(50) NOT NULL UNIQUE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [1/8] Tabel roles siap.");

        // 2. Users
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                role_id INT NOT NULL REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT,
                nama VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                no_hp VARCHAR(20) DEFAULT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [2/8] Tabel users siap.");

        // 3. Kendaraan
        await client.query(`
            CREATE TABLE IF NOT EXISTS kendaraan (
                id SERIAL PRIMARY KEY,
                jenis_kendaraan VARCHAR(100) NOT NULL,
                tipe VARCHAR(100) NOT NULL,
                asal_kendaraan VARCHAR(100) NOT NULL,
                jenis_roda VARCHAR(50) NOT NULL,
                tahun_kendaraan VARCHAR(10) NOT NULL,
                plat_merah VARCHAR(50) DEFAULT NULL,
                plat_hitam VARCHAR(50) DEFAULT NULL,
                nomor_rangka VARCHAR(100) DEFAULT NULL,
                nomor_mesin VARCHAR(100) DEFAULT NULL,
                foto VARCHAR(255) DEFAULT NULL,
                stnk_tahunan DATE DEFAULT NULL,
                stnk_lima_tahunan DATE DEFAULT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [3/8] Tabel kendaraan siap.");

        // 4. Kategori Pemeriksaan
        await client.query(`
            CREATE TABLE IF NOT EXISTS kategori_pemeriksaan (
                id SERIAL PRIMARY KEY,
                nama_kategori VARCHAR(100) NOT NULL,
                urutan INT NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [4/8] Tabel kategori_pemeriksaan siap.");

        // 5. Item Pemeriksaan
        await client.query(`
            CREATE TABLE IF NOT EXISTS item_pemeriksaan (
                id SERIAL PRIMARY KEY,
                kategori_id INT NOT NULL REFERENCES kategori_pemeriksaan(id) ON UPDATE CASCADE ON DELETE CASCADE,
                nama_item VARCHAR(150) NOT NULL,
                urutan INT NOT NULL DEFAULT 0,
                is_tahun_ganti SMALLINT NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [5/8] Tabel item_pemeriksaan siap.");

        // 6. Status Pemeriksaan
        await client.query(`
            CREATE TABLE IF NOT EXISTS status_pemeriksaan (
                id SERIAL PRIMARY KEY,
                nama_status VARCHAR(50) NOT NULL,
                warna VARCHAR(20) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [6/8] Tabel status_pemeriksaan siap.");

        // 7. Pemeriksaan
        await client.query(`
            CREATE TABLE IF NOT EXISTS pemeriksaan (
                id SERIAL PRIMARY KEY,
                kendaraan_id INT NOT NULL REFERENCES kendaraan(id) ON UPDATE CASCADE ON DELETE CASCADE,
                inspektor_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
                tanggal DATE NOT NULL,
                catatan_umum TEXT DEFAULT NULL,
                odometer INT DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [7/8] Tabel pemeriksaan siap.");

        // 8. Hasil Pemeriksaan
        await client.query(`
            CREATE TABLE IF NOT EXISTS hasil_pemeriksaan (
                id SERIAL PRIMARY KEY,
                pemeriksaan_id INT NOT NULL REFERENCES pemeriksaan(id) ON UPDATE CASCADE ON DELETE CASCADE,
                item_id INT NOT NULL REFERENCES item_pemeriksaan(id) ON UPDATE CASCADE ON DELETE CASCADE,
                status_id INT NOT NULL REFERENCES status_pemeriksaan(id) ON UPDATE CASCADE ON DELETE RESTRICT,
                tahun_ganti VARCHAR(20) DEFAULT NULL,
                catatan TEXT DEFAULT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("  [8/8] Tabel hasil_pemeriksaan siap.");

        console.log("\n🌱 Memasukkan Seed Data Awal...");

        // A. Seed Roles
        await client.query(`
            INSERT INTO roles (id, nama_role) VALUES
            (1, 'Admin'),
            (2, 'Inspektor'),
            (3, 'Pimpinan')
            ON CONFLICT (id) DO UPDATE SET nama_role = EXCLUDED.nama_role;
        `);
        // update sequence so SERIAL doesn't collide
        await client.query(`SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));`);
        console.log("  ✅ Roles berhasil disemai.");

        // B. Seed Status Pemeriksaan
        await client.query(`
            INSERT INTO status_pemeriksaan (id, nama_status, warna) VALUES
            (1, 'Aman', '#10B981'),
            (2, 'Perlu Perhatian', '#F59E0B'),
            (3, 'Perlu Penggantian', '#EF4444')
            ON CONFLICT (id) DO UPDATE SET nama_status = EXCLUDED.nama_status, warna = EXCLUDED.warna;
        `);
        await client.query(`SELECT setval('status_pemeriksaan_id_seq', (SELECT MAX(id) FROM status_pemeriksaan));`);
        console.log("  ✅ Status pemeriksaan berhasil disemai.");

        // C. Seed Admin User
        const adminRes = await client.query("SELECT id FROM users WHERE email = 'admin@gmail.com'");
        if (adminRes.rows.length === 0) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await client.query(`
                INSERT INTO users (role_id, nama, email, password, no_hp)
                VALUES (1, 'Administrator', 'admin@gmail.com', $1, '081234567890');
            `, [hashedPassword]);
            console.log("  ✅ Akun Administrator default dibuat (admin@gmail.com / admin123)");
        } else {
            console.log("  ℹ️  Akun Administrator sudah ada.");
        }

        // D. Seed Kategori Pemeriksaan
        await client.query(`
            INSERT INTO kategori_pemeriksaan (id, nama_kategori, urutan) VALUES
            (1, 'Eksterior & Bodi', 1),
            (2, 'Interior & Kabin', 2),
            (3, 'Ruang Mesin & Pelumasan', 3),
            (4, 'Sistem Rem & Kaki-kaki', 4),
            (5, 'Kelistrikan & Penerangan', 5)
            ON CONFLICT (id) DO UPDATE SET nama_kategori = EXCLUDED.nama_kategori, urutan = EXCLUDED.urutan;
        `);
        await client.query(`SELECT setval('kategori_pemeriksaan_id_seq', (SELECT MAX(id) FROM kategori_pemeriksaan));`);
        console.log("  ✅ 5 Kategori pemeriksaan berhasil disemai.");

        // E. Seed Item Pemeriksaan
        const items = [
            [1, 1, 'Kondisi Bodi & Cat', 1, 0],
            [2, 1, 'Kaca Depan / Belakang / Samping', 2, 0],
            [3, 1, 'Spion Kanan & Kiri', 3, 0],
            [4, 1, 'Wiper & Air Wiper', 4, 0],
            [5, 1, 'Kondisi Ban & Velg', 5, 1],
            [6, 2, 'Sistem AC & Pendingin', 1, 0],
            [7, 2, 'Sabuk Pengaman (Seatbelt)', 2, 0],
            [8, 2, 'Klakson & Indikator Dashboard', 3, 0],
            [9, 2, 'Kunci Pintu & Power Window', 4, 0],
            [10, 3, 'Oli Mesin', 1, 1],
            [11, 3, 'Air Radiator (Coolant)', 2, 0],
            [12, 3, 'Minyak Rem & Kopling', 3, 1],
            [13, 3, 'Aki (Baterai)', 4, 1],
            [14, 3, 'Sabuk Mesin (Fanbelt)', 5, 1],
            [15, 4, 'Ketebalan Kampas Rem', 1, 1],
            [16, 4, 'Fungsi Rem Tangan', 2, 0],
            [17, 4, 'Shock Absorber & Suspensi', 3, 0],
            [18, 4, 'Kemudi (Steering)', 4, 0],
            [19, 5, 'Lampu Utama (Jauh / Dekat)', 1, 0],
            [20, 5, 'Lampu Rem & Lampu Mundur', 2, 0],
            [21, 5, 'Lampu Sein & Lampu Hazard', 3, 0],
            [22, 5, 'Lampu Kabut (Fog Lamp)', 4, 0]
        ];

        for (const [id, katId, nama, urutan, isGanti] of items) {
            await client.query(`
                INSERT INTO item_pemeriksaan (id, kategori_id, nama_item, urutan, is_tahun_ganti)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (id) DO UPDATE SET
                    nama_item = EXCLUDED.nama_item,
                    urutan = EXCLUDED.urutan,
                    is_tahun_ganti = EXCLUDED.is_tahun_ganti;
            `, [id, katId, nama, urutan, isGanti]);
        }
        await client.query(`SELECT setval('item_pemeriksaan_id_seq', (SELECT MAX(id) FROM item_pemeriksaan));`);
        console.log(`  ✅ 22 Item pemeriksaan berhasil disemai.`);

        console.log("\n==================================================");
        console.log("🎉 MIGRASI POSTGRES BERHASIL 100%!");
        console.log("==================================================");
    } catch (err) {
        console.error("❌ Error during migration:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runPostgresMigration();
