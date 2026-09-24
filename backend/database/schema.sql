-- =======================================================
-- Database Schema: Sistem Inspeksi Kendaraan
-- =======================================================

CREATE DATABASE IF NOT EXISTS `inspeksi_kendaraan`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `inspeksi_kendaraan`;

-- -------------------------------------------------------
-- 1. Tabel Roles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_role` VARCHAR(50) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 2. Tabel Users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_id` INT NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `no_hp` VARCHAR(20) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 3. Tabel Kendaraan
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kendaraan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `jenis_kendaraan` VARCHAR(100) NOT NULL,
    `tipe` VARCHAR(100) NOT NULL,
    `asal_kendaraan` VARCHAR(100) NOT NULL,
    `jenis_roda` VARCHAR(50) NOT NULL,
    `tahun_kendaraan` VARCHAR(10) NOT NULL,
    `plat_merah` VARCHAR(50) DEFAULT NULL,
    `plat_hitam` VARCHAR(50) DEFAULT NULL,
    `nomor_rangka` VARCHAR(100) DEFAULT NULL,
    `nomor_mesin` VARCHAR(100) DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 4. Tabel Kategori Pemeriksaan
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kategori_pemeriksaan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_kategori` VARCHAR(100) NOT NULL,
    `urutan` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 5. Tabel Item Pemeriksaan
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `item_pemeriksaan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kategori_id` INT NOT NULL,
    `nama_item` VARCHAR(150) NOT NULL,
    `urutan` INT NOT NULL DEFAULT 0,
    `is_tahun_ganti` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_item_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_pemeriksaan` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 6. Tabel Status Pemeriksaan
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `status_pemeriksaan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_status` VARCHAR(50) NOT NULL,
    `warna` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 7. Tabel Pemeriksaan
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pemeriksaan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kendaraan_id` INT NOT NULL,
    `inspektor_id` INT NOT NULL,
    `tanggal` DATE NOT NULL,
    `catatan_umum` TEXT DEFAULT NULL,
    `odometer` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pemeriksaan_kendaraan` FOREIGN KEY (`kendaraan_id`) REFERENCES `kendaraan` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_pemeriksaan_inspektor` FOREIGN KEY (`inspektor_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- 8. Tabel Hasil Pemeriksaan
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hasil_pemeriksaan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `pemeriksaan_id` INT NOT NULL,
    `item_id` INT NOT NULL,
    `status_id` INT NOT NULL,
    `tahun_ganti` VARCHAR(20) DEFAULT NULL,
    `catatan` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_hasil_pemeriksaan` FOREIGN KEY (`pemeriksaan_id`) REFERENCES `pemeriksaan` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_hasil_item` FOREIGN KEY (`item_id`) REFERENCES `item_pemeriksaan` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_hasil_status` FOREIGN KEY (`status_id`) REFERENCES `status_pemeriksaan` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- INDEXES TAMBAHAN UNTUK PERFORMA QUERY
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS `idx_users_role` ON `users` (`role_id`);
CREATE INDEX IF NOT EXISTS `idx_item_kategori` ON `item_pemeriksaan` (`kategori_id`);
CREATE INDEX IF NOT EXISTS `idx_pemeriksaan_kendaraan` ON `pemeriksaan` (`kendaraan_id`);
CREATE INDEX IF NOT EXISTS `idx_pemeriksaan_inspektor` ON `pemeriksaan` (`inspektor_id`);
CREATE INDEX IF NOT EXISTS `idx_hasil_pemeriksaan` ON `hasil_pemeriksaan` (`pemeriksaan_id`);
CREATE INDEX IF NOT EXISTS `idx_hasil_item` ON `hasil_pemeriksaan` (`item_id`);
CREATE INDEX IF NOT EXISTS `idx_hasil_status` ON `hasil_pemeriksaan` (`status_id`);

-- -------------------------------------------------------
-- SEED DATA AWAL
-- -------------------------------------------------------

-- Roles
INSERT INTO `roles` (`id`, `nama_role`) VALUES
(1, 'Admin'),
(2, 'Inspektor'),
(3, 'Pimpinan')
ON DUPLICATE KEY UPDATE `nama_role` = VALUES(`nama_role`);

-- Status Pemeriksaan
INSERT INTO `status_pemeriksaan` (`id`, `nama_status`, `warna`) VALUES
(1, 'Aman', '#10B981'),
(2, 'Perlu Perhatian', '#F59E0B'),
(3, 'Perlu Penggantian', '#EF4444')
ON DUPLICATE KEY UPDATE `nama_status` = VALUES(`nama_status`), `warna` = VALUES(`warna`);

-- Default Administrator User (Password: admin123)
-- Hash bcrypt '$2b$10$OQ.H7k8jWkJWbvK9fW6Y7uAflN0dC1b3d7wQZtFjX5G8/5oU0E7I2' / generate via node
INSERT INTO `users` (`id`, `role_id`, `nama`, `email`, `password`, `no_hp`) VALUES
(1, 1, 'Administrator', 'admin@gmail.com', '$2b$10$95b2l0eC8x695JgOqVzU4u2R.l1P.8lS5tB7VbZtzH0gYgJ7B/fCe', '081234567890')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

-- Kategori Pemeriksaan Awal
INSERT INTO `kategori_pemeriksaan` (`id`, `nama_kategori`, `urutan`) VALUES
(1, 'Eksterior & Bodi', 1),
(2, 'Interior & Kabin', 2),
(3, 'Ruang Mesin & Pelumasan', 3),
(4, 'Sistem Rem & Kaki-kaki', 4),
(5, 'Kelistrikan & Penerangan', 5)
ON DUPLICATE KEY UPDATE `nama_kategori` = VALUES(`nama_kategori`), `urutan` = VALUES(`urutan`);

-- Item Pemeriksaan Awal
INSERT INTO `item_pemeriksaan` (`id`, `kategori_id`, `nama_item`, `urutan`, `is_tahun_ganti`) VALUES
-- Eksterior & Bodi
(1, 1, 'Kondisi Bodi & Cat', 1, 0),
(2, 1, 'Kaca Depan / Belakang / Samping', 2, 0),
(3, 1, 'Spion Kanan & Kiri', 3, 0),
(4, 1, 'Wiper & Air Wiper', 4, 0),
(5, 1, 'Kondisi Ban & Velg', 5, 1),
-- Interior & Kabin
(6, 2, 'Sistem AC & Pendingin', 1, 0),
(7, 2, 'Sabuk Pengaman (Seatbelt)', 2, 0),
(8, 2, 'Klakson & Indikator Dashboard', 3, 0),
(9, 2, 'Kunci Pintu & Power Window', 4, 0),
-- Ruang Mesin & Pelumasan
(10, 3, 'Oli Mesin', 1, 1),
(11, 3, 'Air Radiator (Coolant)', 2, 0),
(12, 3, 'Minyak Rem & Kopling', 3, 1),
(13, 3, 'Aki (Baterai)', 4, 1),
(14, 3, 'Sabuk Mesin (Fanbelt)', 5, 1),
-- Sistem Rem & Kaki-kaki
(15, 4, 'Ketebalan Kampas Rem', 1, 1),
(16, 4, 'Fungsi Rem Tangan', 2, 0),
(17, 4, 'Shock Absorber & Suspensi', 3, 0),
(18, 4, 'Kemudi (Steering)', 4, 0),
-- Kelistrikan & Penerangan
(19, 5, 'Lampu Utama (Jauh / Dekat)', 1, 0),
(20, 5, 'Lampu Rem & Lampu Mundur', 2, 0),
(21, 5, 'Lampu Sein & Lampu Hazard', 3, 0),
(22, 5, 'Lampu Kabut (Fog Lamp)', 4, 0)
ON DUPLICATE KEY UPDATE `nama_item` = VALUES(`nama_item`), `urutan` = VALUES(`urutan`), `is_tahun_ganti` = VALUES(`is_tahun_ganti`);
