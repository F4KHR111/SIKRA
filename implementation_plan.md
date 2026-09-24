# Audit & Refactor Frontend: Hapus Hardcode + Rapikan Struktur

## Hasil Audit Hardcode

Berikut temuan hardcode yang perlu diperbaiki:

### 🔴 HARDCODED ditemukan

| No | File | Masalah | Perbaikan |
|---|---|---|---|
| 1 | [Kendaraan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/kendaraan/Kendaraan.jsx) L362-366 | Asal Kendaraan dropdown hardcoded: "Sekretariat Negara", "Sekretariat Presiden", "Istana Yogyakarta" | Ambil `asal_kendaraan` unik dari `kendaraanList` backend + opsi "Lainnya" |
| 2 | [Kendaraan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/kendaraan/Kendaraan.jsx) L182 | Validasi asal preset juga hardcoded | Sesuaikan dgn daftar preset yang sama |
| 3 | [Kendaraan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/kendaraan/Kendaraan.jsx) L708-712 | Jenis Roda dropdown hardcoded: "Roda 2", "Roda 3", "Roda 4", "Roda 6" | Ini **OK** karena ini form input dan opsi roda memang fixed (2/3/4/6) — bukan data dari backend |
| 4 | [Laporan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/laporan/Laporan.jsx) L363-366 | Filter Asal Kendaraan hardcoded: sama persis dgn Kendaraan.jsx | Dinamis dari `kendaraanList` |
| 5 | [Laporan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/laporan/Laporan.jsx) L106 | Filter "Lainnya" logic hardcoded preset names | Dinamis dari `kendaraanList` |
| 6 | [Laporan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/laporan/Laporan.jsx) L150-154 | `getRingkasanStatus` hardcoded status_id (1=Aman, 2=Perhatian, 3=Penggantian) | Gunakan `nama_status` dari data `hasilList` yang sudah JOIN dari backend |
| 7 | [Laporan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/laporan/Laporan.jsx) L549-558 | Label "Aman", "Perlu Perhatian", "Perlu Penggantian" hardcoded | Dinamis dari status list |

### ✅ TIDAK HARDCODED (sudah benar)

| File | Komponen |
|---|---|
| [Dashboard.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/dashboard/Dashboard.jsx) | Semua data dari `dashboardService` ✅ |
| [Item.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/item/Item.jsx) | Kategori dari backend ✅, CRUD via service ✅ |
| [Pemeriksaan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/pemeriksaan/Pemeriksaan.jsx) | Jenis roda filter dinamis dari kendaraanList ✅, status dari backend ✅ |
| [User.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/user/User.jsx) | Roles dari `roleService` ✅ |

---

## Proposed Changes

### 1. Kendaraan — Asal Kendaraan Dropdown Dinamis

> [!IMPORTANT]
> Opsi dropdown "Sekretariat Negara", "Sekretariat Presiden", "Istana Yogyakarta" **tetap ada sebagai preset** karena ini memang opsi standar yang diminta user sebelumnya. Tapi kita buat sebagai **konstanta** di satu tempat supaya tidak tersebar di banyak file.

#### [MODIFY] [Kendaraan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/kendaraan/Kendaraan.jsx)
- Pindahkan daftar preset asal ke **konstanta** di atas komponen
- Gunakan konstanta itu untuk dropdown dan validasi `isPreset`

### 2. Laporan — Dinamis dari Backend

#### [MODIFY] [Laporan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/laporan/Laporan.jsx)
- Import `statusService` dan load daftar status dari backend
- `getRingkasanStatus` → gunakan `nama_status` dari data hasil, bukan hardcoded ID
- Filter asal kendaraan → pakai **konstanta yang sama** dengan Kendaraan.jsx
- Label ringkasan → dinamis berdasarkan data status dari backend

### 3. Konstanta Shared

#### [NEW] [constants.js](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/utils/constants.js)
- Buat file konstanta bersama untuk:
  - `PRESET_ASAL_KENDARAAN` — daftar preset asal kendaraan

### 4. Laporan Detail — Tambah Jenis Roda

#### [MODIFY] [Laporan.jsx](file:///c:/MAGANG/InspeksiKendaraan/frontend/src/pages/laporan/Laporan.jsx)
- Tampilkan `jenis_roda` di info kendaraan per-mobil dan di detail modal

---

## Open Questions

> [!IMPORTANT]
> **Soal "pisah penulisan kode"**: Struktur pages sudah rapi — setiap halaman ada di folder sendiri:
> - `pages/item/Item.jsx`
> - `pages/laporan/Laporan.jsx`
> - `pages/kendaraan/Kendaraan.jsx`
> - `pages/pemeriksaan/Pemeriksaan.jsx`
> - `pages/dashboard/Dashboard.jsx`
> - `pages/user/User.jsx`
>
> Folder `pages/hasil`, `pages/kategori`, `pages/role`, `pages/status` kosong — ini OK karena mereka tidak punya halaman sendiri (dikelola dari halaman lain).
>
> Apakah yang dimaksud "pisah" adalah memecah komponen besar (misal modal) jadi file terpisah? Atau struktur saat ini sudah cukup?

## Verification Plan

### Manual Verification
- Test CRUD Kendaraan dengan asal kendaraan preset dan lainnya
- Test filter Laporan asal kendaraan
- Test ringkasan status di Laporan menggunakan nama status dari backend
- Pastikan jenis_roda muncul di Laporan detail
