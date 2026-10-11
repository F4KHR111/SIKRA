# 📘 PANDUAN PENGGUNAAN SISTEM (USER MANUAL)
# SIKRA - Sistem Inspeksi Kendaraan Rekapitulasi Armada
**Istana Kepresidenan Yogyakarta (Gedung Agung)**

---

## 📌 Daftar Isi
1. [Tentang Sistem SIKRA](#1-tentang-sistem-sikra)
2. [Hak Akses Pengguna (Role Matrix)](#2-hak-akses-pengguna-role-matrix)
3. [Panduan Akses & Login](#3-panduan-akses--login)
4. [Panduan Modul Aplikasi](#4-panduan-modul-aplikasi)
   - [4.1. Dashboard Eksekutif](#41-dashboard-eksekutif)
   - [4.2. Manajemen Data Kendaraan](#42-manajemen-data-kendaraan)
   - [4.3. Modul Pemeriksaan (Inspeksi Armada)](#43-modul-pemeriksaan-inspeksi-armada)
   - [4.4. Laporan & Rekapitulasi](#44-laporan--rekapitulasi)
   - [4.5. Manajemen Komponen & Item (Khusus Admin)](#45-manajemen-komponen--item-khusus-admin)
   - [4.6. Manajemen Pengguna (Khusus Admin)](#46-manajemen-pengguna-khusus-admin)
5. [Standar Operasional Prosedur (SOP) Pemeriksaan](#5-standar-operasional-prosedur-sop-pemeriksaan)
6. [Pertanyaan Umum (FAQ) & Penyelesaian Kendala](#6-pertanyaan-umum-faq--penyelesaian-kendala)

---

## 1. Tentang Sistem SIKRA
**SIKRA (Sistem Inspeksi Kendaraan Rekapitulasi Armada)** adalah aplikasi web terintegrasi yang dirancang khusus untuk mempermudah monitoring, pencatatan inspeksi fisik dan mekanikal, serta rekapitulasi kelayakan operasional armada kendaraan dinas di lingkungan **Istana Kepresidenan Yogyakarta (Gedung Agung)**.

### ✨ Tujuan & Manfaat Utama:
- **Digitalisasi Checklist**: Menggantikan formulir kertas manual menjadi checklist digital terstandarisasi.
- **Peringatan Dini Masa Berlaku STNK**: Memantau jatuh tempo STNK tahunan dan STNK 5 tahunan (memberikan peringatan visual otomatis jika masa berlaku tersisa kurang dari 1 tahun atau telah kedaluwarsa).
- **Transparansi Kondisi Armada**: Memberikan data real-time terkait status armada: *Layak Jalan*, *Perlu Perhatian*, atau *Perlu Penggantian*.
- **Pencetakan Dokumen Resmi**: Menghasilkan berkas rekapitulasi laporan dan lembar riwayat inspeksi kendaraan berformat resmi dengan Kop Surat Gedung Agung.

---

## 2. Hak Akses Pengguna (Role Matrix)

Sistem SIKRA membagi pengguna ke dalam dua tingkatan hak akses:

| Fitur / Modul | Administrator (`Admin`) | Inspektor / Petugas (`User`) |
| :--- | :---: | :---: |
| **Login & Logout** | ✅ | ✅ |
| **Dashboard Eksekutif & Monitoring STNK** | ✅ | ✅ |
| **Melihat Daftar Kendaraan** | ✅ | ✅ |
| **Tambah, Ubah, Hapus Data Kendaraan** | ✅ | ✅ |
| **Input & Edit Pemeriksaan (Inspeksi)** | ✅ | ✅ |
| **Melihat & Cetak Laporan Rekapitulasi** | ✅ | ✅ |
| **Cetak Lembar Checklist Single Kendaraan** | ✅ | ✅ |
| **Manajemen Item & Kategori Komponen** | ✅ *(Penuh)* | ❌ *(Terbatas/Hanya Baca)* |
| **Manajemen Pengguna (User Management)** | ✅ *(Penuh)* | ❌ *(Tidak Ada Akses)* |

---

## 3. Panduan Akses & Login

### 3.1. Membuka Aplikasi
1. Buka peramban web (*Google Chrome, Microsoft Edge, atau Mozilla Firefox*).
2. Kunjungi alamat URL portal SIKRA yang telah disediakan oleh tim IT.

### 3.2. Masuk ke Akun (Login)
1. Pada halaman **Login**, masukkan **Email** dan **Kata Sandi** terdaftar Anda.
2. Klik tombol **Masuk ke Sistem**.
3. Sistem akan memverifikasi kredensial dan mengarahkan Anda langsung ke halaman **Dashboard**.

> **💡 Catatan Keamanan**: 
> - Jangan memberitahukan kata sandi Anda kepada orang lain.
> - Setelah selesai bertugas, selalu klik tombol **Logout** di pojok kanan atas untuk keluar demi menjaga integritas data kedinasan.

---

## 4. Panduan Modul Aplikasi

### 4.1. Dashboard Eksekutif
Dashboard menyajikan ringkasan cepat kondisi seluruh armada operasional:
- **Kartu Statistik**: Menampilkan jumlah total armada, kendaraan siap jalan, unit yang memerlukan perhatian/perawatan, dan unit yang butuh penggantian suku cadang mendesak.
- **Monitoring Masa Berlaku STNK**:
  - **Merah (Expired)**: STNK sudah melewati tanggal jatuh tempo dan harus segera diperpanjang.
  - **Kuning (Kritis / Perlu Tindakan)**: STNK akan habis dalam waktu kurang dari 1 tahun (< 365 hari).
  - **Hijau (Aman)**: Masa berlaku STNK masih panjang (> 1 tahun).
- **Tab Filter STNK**: Anda dapat menyaring data berdasarkan *Semua*, *Perlu Tindakan*, *Kedaluwarsa*, *Pajak Tahunan*, atau *Ganti Plat 5 Tahunan*.
- **Pencarian Cepat**: Kolom pencarian untuk mencari unit berdasarkan nomor plat merah atau tipe mobil.

---

### 4.2. Manajemen Data Kendaraan
Menu ini digunakan untuk mendata seluruh armada mobil dinas yang terdaftar di lingkungan Istana Kepresidenan Yogyakarta.

#### A. Menambahkan Kendaraan Baru:
1. Klik menu **Data Kendaraan** pada navigasi atas.
2. Klik tombol **+ Tambah Kendaraan**.
3. Lengkapi formulir pendaftaran kendaraan:
   - **Jenis Kendaraan**: Pilih jenis (misal: *Mobil Penumpang, Minibus, SUV, Sedan*).
   - **Tipe / Model**: Masukkan merk dan tipe (misal: *Toyota Innova Zenix, Nissan X-Trail*).
   - **Nomor Plat Merah**: **WAJIB diisi** (misal: `AB 1234 PA` atau `B 1610 PQO`).
   - **Nomor Plat Hitam**: **Opsional** (kosongkan jika kendaraan tidak memiliki plat hitam dinas).
   - **Asal Kendaraan**: Pilih dari daftar (*Sekretariat Negara, Istana Kepresidenan Yogyakarta, dll.*) atau pilih **Lainnya** lalu ketikkan asal instansi secara kustom.
   - **Jenis Roda**: Pilih jumlah roda (misal: *Roda 4*).
   - **Tahun Kendaraan**: Tahun perakitan kendaraan.
   - **Nomor Rangka & Nomor Mesin**: Masukkan nomor identifikasi kendaraan resmi.
   - **Masa Berlaku STNK Tahunan**: Tanggal jatuh tempo pajak tahunan.
   - **Masa Berlaku STNK 5 Tahunan**: Tanggal pergantian kaleng plat / STNK 5 tahunan.
   - **Foto Kendaraan**: Unggah foto fisik tampak depan atau serong kendaraan.
4. Klik tombol **Simpan Kendaraan**.

#### B. Mengubah & Menghapus Data:
- Klik tombol **Edit (Ikon Pensil)** pada baris kendaraan untuk memperbarui informasi atau memperbarui tanggal STNK setelah selesai perpanjangan samsat.
- Klik tombol **Hapus (Ikon Tong Sampah)** jika unit kendaraan sudah dialihkan/dihapuskan dari daftar inventaris dinas (memerlukan konfirmasi keamanan).

---

### 4.3. Modul Pemeriksaan (Inspeksi Armada)
Menu ini merupakan inti dari operasional lapangan untuk mencatat hasil pengecekan fisik dan mekanikal kendaraan berkala.

#### A. Langkah Melakukan Pemeriksaan Baru:
1. Klik menu **Pemeriksaan**.
2. Klik tombol **+ Tambah Pemeriksaan**.
3. **Bagian Informasi Dasar**:
   - Pilih **Kendaraan** yang diperiksa dari dropdown.
   - Pilih **Inspektor / Petugas Lapangan** yang bertanggung jawab.
   - Tentukan **Tanggal Pemeriksaan**.
   - Masukkan angka **Odometer (Kilometer)** terkini pada speedometer kendaraan.
4. **Bagian Checklist Komponen (Per Kategori)**:
   - Klik kartu kategori komponen (misal: *Ruang Mesin, Sistem Rem, Kelistrikan, Kaki-kaki & Roda, Bodi & Eksterior, Interior*) untuk membuka daftar item.
   - Untuk setiap item komponen, tentukan status kondisinya:
     - 🟢 **Baik**: Komponen berfungsi normal tanpa kendala.
     - 🟡 **Perlu Perhatian**: Komponen mulai aus/bunyi/kurang optimal, perlu pemantauan berkala.
     - 🔴 **Perlu Penggantian / Rusak**: Komponen rusak/tidak berfungsi, berbahaya jika tidak segera diganti.
   - Jika item memerlukan pencatatan tahun penggantian (seperti aki atau ban), isikan **Tahun Ganti**.
   - Berikan **Catatan Tambahan** jika ditemukan kejanggalan spesifik.
5. **Bagian Kesimpulan**:
   - Tuliskan **Catatan Umum / Rekomendasi Petugas** (misal: *"Kendaraan siap jalan dinas, oli mesin perlu diganti 2.000 km lagi"*).
6. Klik tombol **Simpan Pemeriksaan**.

#### B. Melihat Detail Hasil Pemeriksaan:
- Klik tombol **Detail** pada tabel riwayat pemeriksaan untuk meninjau kembali seluruh rincian status per kategori yang telah diinput sebelumnya.

---

### 4.4. Laporan & Rekapitulasi
Modul ini digunakan untuk menganalisis data, menyaring riwayat inspeksi, dan mencetak berkas resmi untuk pimpinan atau pengarsipan.

#### A. Menggunakan Filter Laporan:
- **Tipe Laporan**:
  - **Semua Mobil**: Merekap seluruh armada dinas dalam satu tabel laporan gabungan.
  - **Per Mobil (Kendaraan)**: Memilih satu unit kendaraan tertentu secara spesifik untuk melihat riwayat perawatan dan spesifikasinya.
- **Asal Kendaraan**: Menyaring unit berdasarkan kepemilikan/asal instansi.
- **Tanggal Mulai & Tanggal Selesai**: Menyaring rentang periode waktu inspeksi.
- *Filter akan langsung memperbarui tampilan secara otomatis tanpa jeda.*

#### B. Mencetak Dokumen Laporan:
1. **Cetak Rekapitulasi Kolektif (`Cetak Laporan`)**:
   - Klik tombol **🖨️ Cetak Laporan** di kanan atas.
   - Sistem akan menyusun dokumen rapi lengkap dengan Kop Resmi Gedung Agung, spesifikasi armada terpilih, periode laporan, dan tabel status rekapitulasi.
2. **Cetak Lembar Checklist Single Mobil**:
   - Pada baris pemeriksaan tertentu di tabel, klik tombol hijau **🖨️ Cetak**.
   - Sistem akan memuat lembar hasil inspeksi komprehensif berisi foto unit, detail checklist per kategori komponen, odometer, serta kolom tanda tangan inspektor pemeriksa.
3. **Tips Saat Kotak Dialog Cetak Terbuka**:
   - **Tujuan / Destination**: Pilih printer fisik Anda, atau pilih **Save as PDF** untuk menyimpan sebagai berkas PDF digital.
   - **Tata Letak / Layout**: Pilih *Portrait* (untuk lembar checklist mobil) atau *Landscape* (untuk tabel rekapitulasi lebar).
   - **Opsi Lain**: Centang opsi **Background graphics (Grafik latar belakang)** agar warna status badge (Hijau, Kuning, Merah) tercetak dengan jelas.

---

### 4.5. Manajemen Komponen & Item (Khusus Admin)
Digunakan oleh administrator untuk membakukan standar pemeriksaan armada.
- **Tampilan Berbasis Kategori**: Komponen dikelompokkan ke dalam kartu kategori masing-masing dengan dropdown accordion yang rapi.
- **Tambah Item Baru**: Klik tombol **+ Tambah Item**, pilih kategori, masukkan nama komponen (misal: *Minyak Rem, Filter Udara, Wiper Depan*), dan centang jika membutuhkan isian tahun ganti.
- **Ubah / Hapus Item**: Menyesuaikan kebutuhan pengecekan armada sesuai SOP terbaru.

---

### 4.6. Manajemen Pengguna (Khusus Admin)
Digunakan oleh administrator untuk mengelola akun petugas:
- **Tambah Pengguna**: Menambahkan akun baru dengan menentukan nama lengkap, email kedinasan, nomor HP, peran (*Admin* atau *Petugas*), dan kata sandi awal.
- **Ganti Password**: Membantu inspektor yang lupa kata sandi dengan mengatur ulang kata sandi secara langsung.
- **Manajemen Akses**: Menghapus atau menonaktifkan akun petugas yang sudah tidak bertugas di bagian armada.

---

## 5. Standar Operasional Prosedur (SOP) Pemeriksaan

Untuk memastikan keandalan dan keselamatan armada kepresidenan, ikuti tahapan SOP berikut:

```
[1. Persiapan]       Petugas login ke SIKRA, pilih unit kendaraan yang akan diuji.
        ↓
[2. Pengecekan Fisik] Periksa kondisi eksterior, bodi, lampu, kaca, dan tekanan roda.
        ↓
[3. Pengecekan Mesin] Buka kap mesin, periksa oli mesin, air radiator, aki, minyak rem.
        ↓
[4. Uji Fungsi]       Nyalakan mesin, periksa fungsi AC, rem tangan, wiper, dan indikator dasbor.
        ↓
[5. Input SIKRA]      Centang checklist pada sistem SIKRA secara real-time via tablet/laptop.
        ↓
[6. Finalisasi]       Isi angka odometer dan catatan umum, lalu simpan hasil inspeksi.
        ↓
[7. Tindak Lanjut]    Jika ada komponen berstatus "Perlu Penggantian", cetak laporan untuk diajukan perbaikan ke bengkel rekanan.
```

---

## 6. Pertanyaan Umum (FAQ) & Penyelesaian Kendala

#### Q1: Mengapa plat hitam tidak wajib diisi saat menambah mobil?
> **Jawaban**: Beberapa kendaraan dinas operasional hanya menggunakan plat merah dan tidak memiliki alokasi plat hitam rahasia/khusus. Oleh karena itu, sistem hanya mewajibkan **Plat Merah**, sedangkan Plat Hitam bersifat opsional.

#### Q2: Apa yang harus dilakukan jika muncul peringatan STNK warna kuning pada Dashboard?
> **Jawaban**: Peringatan kuning menandakan masa berlaku STNK kurang dari 1 tahun. Segera koordinasikan dengan bagian tata usaha/rumah tangga untuk penjadwalan pembayaran pajak tahunan atau pengurusan perpanjangan STNK di Samsat.

#### Q3: Setelah STNK diperpanjang, bagaimana cara memperbarui datanya?
> **Jawaban**: Buka menu **Data Kendaraan**, klik ikon **Edit (Pensil)** pada mobil yang bersangkutan, ubah tanggal pada kolom **Masa Berlaku STNK Tahunan / 5 Tahunan** menjadi tanggal jatuh tempo yang baru, lalu klik **Simpan Kendaraan**. Status di dashboard akan otomatis kembali menjadi hijau (Aman).

#### Q4: Mengapa warna tanda status tidak muncul saat dicetak ke PDF/kertas?
> **Jawaban**: Pada jendela cetak peramban (*Print Preview*), klik menu **More settings (Setelan lainnya)**, lalu beri tanda centang pada opsi **Background graphics (Grafik latar belakang)**.

#### Q5: Siapa yang harus dihubungi jika mengalami kendala sistem?
> **Jawaban**: Silakan hubungi Administrator Sistem SIKRA atau Bagian Pengelola Teknologi Informasi Istana Kepresidenan Yogyakarta.

---

*Dokumen ini diterbitkan sebagai panduan resmi operasional Sistem Informasi SIKRA.*  
*Hak Cipta © 2026 - Istana Kepresidenan Yogyakarta (Gedung Agung).*
