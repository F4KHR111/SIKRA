# SIKRA (Sistem Inspeksi Kendaraan Rekapitulasi Armada)
### 🏛️ Istana Kepresidenan Yogyakarta (Gedung Agung)

[![SIKRA Portal](https://img.shields.io/badge/Status-Operasional-success.svg)](#)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg?logo=node.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](#)
[![Express](https://img.shields.io/badge/Backend-Express.js-000000.svg?logo=express&logoColor=white)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20Prisma-4169E1.svg?logo=postgresql&logoColor=white)](#)

---

## 📌 Ringkasan Proyek
**SIKRA** adalah platform digital manajemen armada dan inspeksi kelayakan kendaraan operasional dinas di lingkungan **Istana Kepresidenan Yogyakarta (Gedung Agung)**. Sistem ini menggantikan proses pencatatan fisik manual dengan formulir inspeksi digital, pemantauan masa berlaku STNK berkala, serta rekapitulasi pelaporan resmi siap cetak berstandar kepresidenan.

---

## 📖 Panduan Lengkap Pengguna (User Manual)
Untuk petunjuk langkah demi langkah pengoperasian aplikasi, alur kerja inspeksi lapangan, dan administrasi sistem, silakan baca:
👉 **[Buku Panduan Penggunaan Sistem (PANDUAN_PENGGUNA.md)](./PANDUAN_PENGGUNA.md)**

---

## 🚀 Fitur Unggulan
1. **Executive Dashboard**: Ringkasan armada, status kelayakan kendaraan, dan statistik inspeksi.
2. **Early Warning System STNK**:
   - Peringatan visual otomatis jika masa berlaku STNK tahunan atau 5 tahunan tersisa kurang dari 1 tahun (< 365 hari) atau telah kedaluwarsa.
3. **Master Data Armada Kendaraan**:
   - Pencatatan spesifikasi, nomor rangka/mesin, jenis roda, asal instansi, dan foto fisik.
   - Aturan plat nomor: **Plat Merah wajib**, **Plat Hitam opsional**.
4. **Inspeksi Fisik & Mekanikal Terstruktur**:
   - Pengecekan berbasis kategori komponen (Ruang Mesin, Rem, Kelistrikan, Kaki-kaki/Ban, Bodi/Eksterior, Interior).
   - Indikator status: *Baik (Hijau)*, *Perlu Perhatian (Kuning)*, *Perlu Penggantian (Merah)*.
   - Pencatatan tahun ganti suku cadang dan odometer terkini.
5. **Pusat Laporan & Cetak Dokumen Resmi**:
   - Filter reaktif dinamis (Per Mobil / Semua Armada, Asal Instansi, Periode Waktu).
   - Format cetak resmi ber-Kop Surat Gedung Agung Istana Kepresidenan Yogyakarta.
   - Cetak lembar checklist inspeksi per unit kendaraan (Single Inspection Sheet).
6. **Manajemen Pengguna & Standarisasi Komponen (Admin)**:
   - Pengelolaan hak akses berbasis peran (*Administrator* dan *Inspektor*).
   - Standarisasi parameter item checklist menggunakan layout card kategori accordion.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend**:
  - React 18 & Vite
  - Bootstrap 5 & Custom Corporate CSS
  - React Router DOM v6
  - SweetAlert2 & React Toastify
  - React Icons
- **Backend**:
  - Node.js & Express.js
  - RESTful API Architecture
  - JWT Authentication (JSON Web Token) & bcryptjs
  - Multer (Pengunggahan foto kendaraan & bukti inspeksi)
- **Database**:
  - PostgreSQL / Supabase / Prisma Postgres

---

## 💻 Panduan Instalasi Lokal (Development Setup)

### 1. Kloning Repositori
```bash
git clone https://github.com/F4KHR111/SIKRA.git
cd SIKRA
```

### 2. Instalasi Dependensi
```bash
# Instal seluruh dependensi backend dan frontend sekaligus
npm run install-all
```
*Atau instal manual pada masing-masing folder:*
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin atau buat file `.env` pada folder `backend`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="rahasia_jwt_sikra"
```
Dan pada folder `frontend`:
```env
VITE_API_URL="http://localhost:5000/api"
```

### 4. Menjalankan Aplikasi
Buka dua terminal terpisah:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server berjalan di http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Aplikasi web berjalan di http://localhost:5173
```

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 **Istana Kepresidenan Yogyakarta (Gedung Agung)**.  
Dikembangkan untuk keperluan operasional kedinasan armada kepresidenan.
