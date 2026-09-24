const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const isFresh = process.argv.includes("--fresh");

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "inspeksi_kendaraan";

async function runMigration() {
    console.log("==================================================");
    console.log("🚀 Memulai Migrasi Database Sistem Inspeksi Kendaraan");
    console.log(`📡 Host: ${DB_HOST}:${DB_PORT} | Database: ${DB_NAME}`);
    console.log("==================================================");

    let connection;

    try {
        // 1. Koneksi ke MySQL server (tanpa database dulu)
        connection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD
        });

        console.log("✅ Terhubung ke MySQL Server.");

        // 2. Buat database jika belum ada
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        console.log(`✅ Database \`${DB_NAME}\` siap digunakan.`);

        // 3. Gunakan database
        await connection.changeUser({ database: DB_NAME });

        // 4. Jika opsi --fresh diaktifkan, drop tabel lama
        if (isFresh) {
            console.log("\n⚠️  Mode --fresh aktif: Menghapus semua tabel lama...");
            await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
            const tables = [
                "hasil_pemeriksaan",
                "pemeriksaan",
                "item_pemeriksaan",
                "kategori_pemeriksaan",
                "status_pemeriksaan",
                "kendaraan",
                "users",
                "roles"
            ];
            for (const table of tables) {
                await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
                console.log(`   - Tabel \`${table}\` dihapus.`);
            }
            await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
            console.log("✅ Drop tabel selesai.");
        }

        console.log("\n🔨 Membuat tabel-tabel...");

        // 5. Tabel Roles
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`roles\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`nama_role\` VARCHAR(50) NOT NULL UNIQUE,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [1/8] Tabel `roles` siap.");

        // 6. Tabel Users
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`users\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`role_id\` INT NOT NULL,
                \`nama\` VARCHAR(100) NOT NULL,
                \`email\` VARCHAR(100) NOT NULL UNIQUE,
                \`password\` VARCHAR(255) NOT NULL,
                \`no_hp\` VARCHAR(20) DEFAULT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`fk_users_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON UPDATE CASCADE ON DELETE RESTRICT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [2/8] Tabel `users` siap.");

        // 7. Tabel Kendaraan
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`kendaraan\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`jenis_kendaraan\` VARCHAR(100) NOT NULL,
                \`tipe\` VARCHAR(100) NOT NULL,
                \`asal_kendaraan\` VARCHAR(100) NOT NULL,
                \`jenis_roda\` VARCHAR(50) NOT NULL,
                \`tahun_kendaraan\` VARCHAR(10) NOT NULL,
                \`plat_merah\` VARCHAR(50) DEFAULT NULL,
                \`plat_hitam\` VARCHAR(50) DEFAULT NULL,
                \`nomor_rangka\` VARCHAR(100) DEFAULT NULL,
                \`nomor_mesin\` VARCHAR(100) DEFAULT NULL,
                \`foto\` VARCHAR(255) DEFAULT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [3/8] Tabel `kendaraan` siap.");

        // 8. Tabel Kategori Pemeriksaan
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`kategori_pemeriksaan\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`nama_kategori\` VARCHAR(100) NOT NULL,
                \`urutan\` INT NOT NULL DEFAULT 0,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [4/8] Tabel `kategori_pemeriksaan` siap.");

        // 9. Tabel Item Pemeriksaan
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`item_pemeriksaan\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`kategori_id\` INT NOT NULL,
                \`nama_item\` VARCHAR(150) NOT NULL,
                \`urutan\` INT NOT NULL DEFAULT 0,
                \`is_tahun_ganti\` TINYINT(1) NOT NULL DEFAULT 0,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT \`fk_item_kategori\` FOREIGN KEY (\`kategori_id\`) REFERENCES \`kategori_pemeriksaan\` (\`id\`) ON UPDATE CASCADE ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [5/8] Tabel `item_pemeriksaan` siap.");

        // 10. Tabel Status Pemeriksaan
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`status_pemeriksaan\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`nama_status\` VARCHAR(50) NOT NULL,
                \`warna\` VARCHAR(20) NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [6/8] Tabel `status_pemeriksaan` siap.");

        // 11. Tabel Pemeriksaan
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`pemeriksaan\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`kendaraan_id\` INT NOT NULL,
                \`inspektor_id\` INT NOT NULL,
                \`tanggal\` DATE NOT NULL,
                \`catatan_umum\` TEXT DEFAULT NULL,
                \`odometer\` INT DEFAULT 0,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`fk_pemeriksaan_kendaraan\` FOREIGN KEY (\`kendaraan_id\`) REFERENCES \`kendaraan\` (\`id\`) ON UPDATE CASCADE ON DELETE CASCADE,
                CONSTRAINT \`fk_pemeriksaan_inspektor\` FOREIGN KEY (\`inspektor_id\`) REFERENCES \`users\` (\`id\`) ON UPDATE CASCADE ON DELETE RESTRICT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [7/8] Tabel `pemeriksaan` siap.");

        // 12. Tabel Hasil Pemeriksaan
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`hasil_pemeriksaan\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`pemeriksaan_id\` INT NOT NULL,
                \`item_id\` INT NOT NULL,
                \`status_id\` INT NOT NULL,
                \`tahun_ganti\` VARCHAR(20) DEFAULT NULL,
                \`catatan\` TEXT DEFAULT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT \`fk_hasil_pemeriksaan\` FOREIGN KEY (\`pemeriksaan_id\`) REFERENCES \`pemeriksaan\` (\`id\`) ON UPDATE CASCADE ON DELETE CASCADE,
                CONSTRAINT \`fk_hasil_item\` FOREIGN KEY (\`item_id\`) REFERENCES \`item_pemeriksaan\` (\`id\`) ON UPDATE CASCADE ON DELETE CASCADE,
                CONSTRAINT \`fk_hasil_status\` FOREIGN KEY (\`status_id\`) REFERENCES \`status_pemeriksaan\` (\`id\`) ON UPDATE CASCADE ON DELETE RESTRICT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("  [8/8] Tabel `hasil_pemeriksaan` siap.");

        // 13. SEEDING DATA
        console.log("\n🌱 Memasukkan Seed Data Awal...");

        // A. Seed Roles
        const roles = [
            [1, "Admin"],
            [2, "Inspektor"],
            [3, "Pimpinan"]
        ];
        for (const [id, nama] of roles) {
            await connection.query(
                "INSERT INTO `roles` (`id`, `nama_role`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `nama_role` = VALUES(`nama_role`)",
                [id, nama]
            );
        }
        console.log("  ✅ Roles berhasil disemai (Admin, Inspektor, Pimpinan).");

        // B. Seed Status Pemeriksaan
        const statuses = [
            [1, "Aman", "#10B981"],
            [2, "Perlu Perhatian", "#F59E0B"],
            [3, "Perlu Penggantian", "#EF4444"]
        ];
        for (const [id, nama, warna] of statuses) {
            await connection.query(
                "INSERT INTO `status_pemeriksaan` (`id`, `nama_status`, `warna`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `nama_status` = VALUES(`nama_status`), `warna` = VALUES(`warna`)",
                [id, nama, warna]
            );
        }
        console.log("  ✅ Status pemeriksaan berhasil disemai (Aman, Perlu Perhatian, Perlu Penggantian).");

        // C. Seed Default Admin User
        const [existingAdmin] = await connection.query("SELECT id FROM `users` WHERE `email` = 'admin@gmail.com'");
        if (existingAdmin.length === 0) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await connection.query(
                `INSERT INTO \`users\` (\`role_id\`, \`nama\`, \`email\`, \`password\`, \`no_hp\`)
                 VALUES (?, ?, ?, ?, ?)`,
                [1, "Administrator", "admin@gmail.com", hashedPassword, "081234567890"]
            );
            console.log("  ✅ Akun Administrator default berhasil dibuat:");
            console.log("     📧 Email: admin@gmail.com | 🔑 Password: admin123");
        } else {
            console.log("  ℹ️  Akun Administrator (admin@gmail.com) sudah ada.");
        }

        // D. Seed Kategori Pemeriksaan
        const kategoris = [
            [1, "Eksterior & Bodi", 1],
            [2, "Interior & Kabin", 2],
            [3, "Ruang Mesin & Pelumasan", 3],
            [4, "Sistem Rem & Kaki-kaki", 4],
            [5, "Kelistrikan & Penerangan", 5]
        ];
        for (const [id, nama, urutan] of kategoris) {
            await connection.query(
                "INSERT INTO `kategori_pemeriksaan` (`id`, `nama_kategori`, `urutan`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `nama_kategori` = VALUES(`nama_kategori`), `urutan` = VALUES(`urutan`)",
                [id, nama, urutan]
            );
        }
        console.log("  ✅ 5 Kategori pemeriksaan berhasil disemai.");

        // E. Seed Item Pemeriksaan
        const items = [
            // Eksterior & Bodi
            [1, 1, "Kondisi Bodi & Cat", 1, 0],
            [2, 1, "Kaca Depan / Belakang / Samping", 2, 0],
            [3, 1, "Spion Kanan & Kiri", 3, 0],
            [4, 1, "Wiper & Air Wiper", 4, 0],
            [5, 1, "Kondisi Ban & Velg", 5, 1],
            // Interior & Kabin
            [6, 2, "Sistem AC & Pendingin", 1, 0],
            [7, 2, "Sabuk Pengaman (Seatbelt)", 2, 0],
            [8, 2, "Klakson & Indikator Dashboard", 3, 0],
            [9, 2, "Kunci Pintu & Power Window", 4, 0],
            // Ruang Mesin & Pelumasan
            [10, 3, "Oli Mesin", 1, 1],
            [11, 3, "Air Radiator (Coolant)", 2, 0],
            [12, 3, "Minyak Rem & Kopling", 3, 1],
            [13, 3, "Aki (Baterai)", 4, 1],
            [14, 3, "Sabuk Mesin (Fanbelt)", 5, 1],
            // Sistem Rem & Kaki-kaki
            [15, 4, "Ketebalan Kampas Rem", 1, 1],
            [16, 4, "Fungsi Rem Tangan", 2, 0],
            [17, 4, "Shock Absorber & Suspensi", 3, 0],
            [18, 4, "Kemudi (Steering)", 4, 0],
            // Kelistrikan & Penerangan
            [19, 5, "Lampu Utama (Jauh / Dekat)", 1, 0],
            [20, 5, "Lampu Rem & Lampu Mundur", 2, 0],
            [21, 5, "Lampu Sein & Lampu Hazard", 3, 0],
            [22, 5, "Lampu Kabut (Fog Lamp)", 4, 0]
        ];
        for (const [id, katId, nama, urutan, isGanti] of items) {
            await connection.query(
                "INSERT INTO `item_pemeriksaan` (`id`, `kategori_id`, `nama_item`, `urutan`, `is_tahun_ganti`) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `nama_item` = VALUES(`nama_item`), `urutan` = VALUES(`urutan`), `is_tahun_ganti` = VALUES(`is_tahun_ganti`)",
                [id, katId, nama, urutan, isGanti]
            );
        }
        console.log(`  ✅ ${items.length} Item pemeriksaan awal berhasil disemai.`);

        console.log("\n==================================================");
        console.log("🎉 MIGRASI DAN SEED DATABASE SELESAI DENGAN SUKSES!");
        console.log("==================================================");
        process.exit(0);

    } catch (err) {
        console.error("\n❌ GAGAL MENJALANKAN MIGRASI:");
        console.error(err);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runMigration();
