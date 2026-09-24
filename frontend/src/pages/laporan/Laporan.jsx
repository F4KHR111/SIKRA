import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaCar, FaClipboardCheck, FaFolderOpen } from "react-icons/fa";
import pemeriksaanService from "../../services/pemeriksaanService";
import kendaraanService from "../../services/kendaraanService";
import hasilService from "../../services/hasilService";
import kategoriService from "../../services/kategoriService";
import itemService from "../../services/itemService";
import statusService from "../../services/statusService";
import { PRESET_ASAL_KENDARAAN } from "../../utils/constants";
import logoKemensetneg from "../../assets/logo/logokemensetneg.png";

const BACKEND_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const getPhotoUrl = (foto) => {
    if (!foto) return "";
    if (foto.startsWith("http://") || foto.startsWith("https://") || foto.startsWith("data:")) {
        return foto;
    }
    return `${BACKEND_URL}${foto}`;
};

function Laporan() {

    const [pemeriksaan, setPemeriksaan] = useState([]);
    const [kendaraanList, setKendaraanList] = useState([]);
    const [hasilList, setHasilList] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [items, setItems] = useState([]);
    const [statusList, setStatusList] = useState([]);

    // Filter states
    const [tipeLaporan, setTipeLaporan] = useState("semua"); // "semua" atau "per_mobil"
    const [selectedKendaraan, setSelectedKendaraan] = useState("");
    const [tglMulai, setTglMulai] = useState("");
    const [tglSelesai, setTglSelesai] = useState("");
    const [asalDropdown, setAsalDropdown] = useState("");
    const [customAsalInput, setCustomAsalInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [filteredPemeriksaan, setFilteredPemeriksaan] = useState([]);

    // State detail modal (untuk melihat hasil detail per item)
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);

    // State untuk print single kendaraan
    const [activePrintData, setActivePrintData] = useState(null);

    // Reset print state setelah dialog cetak tertutup
    useEffect(() => {
        const handleAfterPrint = () => {
            setActivePrintData(null);
        };
        window.addEventListener("afterprint", handleAfterPrint);
        return () => {
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    // ==================== LOAD DATA ====================

    const loadData = async () => {

        try {

            setLoading(true);

            const pData = await pemeriksaanService.getAll();
            setPemeriksaan(pData);

            const kData = await kendaraanService.getAll();
            setKendaraanList(kData);

            const hData = await hasilService.getAll();
            setHasilList(hData);

            const katData = await kategoriService.getAll();
            setKategoris(katData);

            const sData = await statusService.getAll();
            setStatusList(sData);

            // Load Items per Kategori secara paralel untuk menghindari error 500
            const allItems = [];
            for (const kat of katData) {
                try {
                    const itemsPerKat = await itemService.getByKategori(kat.id);
                    allItems.push(...itemsPerKat);
                } catch (errItem) {
                    console.error(`Gagal memuat item untuk kategori ${kat.id}:`, errItem);
                }
            }
            setItems(allItems);

            // Default filter awal (tampilkan semua data)
            setFilteredPemeriksaan(pData);

        } catch (err) {

            console.error(err);

            toast.error("Gagal memuat data laporan");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    // ==================== PROSES FILTER ====================

    const handleFilter = (e) => {

        if (e) e.preventDefault();

        let data = [...pemeriksaan];

        // 1. Filter Tipe Laporan & Kendaraan
        if (tipeLaporan === "per_mobil" && selectedKendaraan !== "") {
            data = data.filter(item => String(item.kendaraan_id) === String(selectedKendaraan));
        }

        // 2. Filter Asal Kendaraan
        if (asalDropdown !== "") {
            if (asalDropdown === "Lainnya") {
                if (customAsalInput !== "") {
                    data = data.filter(item => item.asal_kendaraan?.toLowerCase().includes(customAsalInput.toLowerCase()));
                } else {
                    data = data.filter(item => !PRESET_ASAL_KENDARAAN.includes(item.asal_kendaraan));
                }
            } else {
                data = data.filter(item => item.asal_kendaraan === asalDropdown);
            }
        }

        // 3. Filter Periode Tanggal
        if (tglMulai !== "") {
            data = data.filter(item => item.tanggal >= tglMulai);
        }

        if (tglSelesai !== "") {
            // Ditambahkan '23:59:59' agar include seluruh hari tersebut
            data = data.filter(item => item.tanggal <= tglSelesai + "T23:59:59");
        }

        setFilteredPemeriksaan(data);

    };

    // Reset Filter
    const handleReset = () => {

        setTipeLaporan("semua");
        setSelectedKendaraan("");
        setTglMulai("");
        setTglSelesai("");
        setAsalDropdown("");
        setCustomAsalInput("");
        setFilteredPemeriksaan(pemeriksaan);

    };

    // ==================== HITUNG RINGKASAN STATUS ====================

    const getRingkasanStatus = (pemeriksaanId) => {

        const list = hasilList.filter(h => h.pemeriksaan_id === pemeriksaanId);

        // Hitung jumlah per status berdasarkan nama_status dari data hasil (bukan hardcoded ID)
        const counts = {};
        list.forEach(h => {
            const namaStatus = h.nama_status || "Unknown";
            counts[namaStatus] = (counts[namaStatus] || 0) + 1;
        });

        return { counts, total: list.length };

    };

    // ==================== DETAIL MODAL ====================

    const handleDetail = async (id) => {

        try {

            const data = await pemeriksaanService.getById(id);
            const detailHasil = hasilList.filter(h => h.pemeriksaan_id === id);

            setDetailData({
                ...data,
                hasil: detailHasil
            });

            setShowDetail(true);

        } catch (err) {

            console.error(err);

            toast.error("Gagal memuat detail pemeriksaan");

        }

    };

    // ==================== CETAK PER-MOBIL (SINGLE) ====================

    const handlePrintSingle = async (id) => {
        try {
            setLoading(true);
            const data = await pemeriksaanService.getById(id);
            const detailHasil = hasilList.filter(h => h.pemeriksaan_id === id);

            setActivePrintData({
                ...data,
                hasil: detailHasil
            });

            // Siapkan daftar gambar yang harus di-preload (Logo Kemensetneg & Foto Kendaraan)
            const imagesToLoad = [logoKemensetneg];
            if (data.foto) {
                imagesToLoad.push(getPhotoUrl(data.foto));
            }

            let loadedCount = 0;
            const checkAllLoaded = () => {
                loadedCount++;
                if (loadedCount === imagesToLoad.length) {
                    window.print();
                }
            };

            imagesToLoad.forEach((src) => {
                const img = new Image();
                img.src = src;
                img.onload = checkAllLoaded;
                img.onerror = checkAllLoaded; // Tetap lanjut buka dialog print jika salah satu gagal dimuat
            });

        } catch (err) {
            console.error(err);
            toast.error("Gagal memproses cetak mobil");
        } finally {
            setLoading(false);
        }
    };

    // ==================== CETAK HALAMAN ====================

    const handlePrint = () => {

        window.print();

    };

    // ==================== FORMAT TANGGAL ====================

    const formatTanggal = (tanggal) => {

        if (!tanggal) return "-";

        const date = new Date(tanggal);

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    };

    // Info kendaraan untuk laporan per mobil
    const infoMobilSelected = kendaraanList.find(k => String(k.id) === String(selectedKendaraan));

    return (

        <div className={`container-fluid ${activePrintData ? "print-single-active" : "print-all-active"}`}>

            {/* Bagian Khusus Cetak CSS */}

            <style>{`
                /* Tampilan layar */
                @media screen {
                    .print-single-area {
                        display: none !important;
                    }
                }

                /* Tampilan cetak printer */
                @media print {
                    body {
                        background-color: #fff !important;
                        color: #000 !important;
                    }
                    .no-print, .navbar, .bg-dark, .sidebar, button, .card-header button, .modal, .modal-backdrop {
                        display: none !important;
                    }
                    .flex-grow-1, .p-4, .container-fluid {
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                    }
                    .card {
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .table-responsive {
                        overflow: visible !important;
                    }
                    
                    /* Tabel Jelas dan Tegas (Tebal Hitam) */
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        border: 2px solid #000 !important;
                    }
                    th, td {
                        border: 2px solid #000 !important;
                        padding: 8px !important;
                        color: #000 !important;
                        font-weight: bold !important;
                    }
                    .table-light {
                        background-color: #e9ecef !important;
                    }

                    /* Kontrol layout cetak single vs cetak all */
                    .print-all-active .print-single-area {
                        display: none !important;
                    }
                    .print-single-active .print-all-area {
                        display: none !important;
                    }
                    .print-single-active .print-single-area {
                        display: block !important;
                        width: 100% !important;
                    }
                }

                /* Style template cetak single per-mobil (sesuai gambar template) */
                .print-single-container {
                    font-family: "Arial", sans-serif;
                    color: #000;
                    max-width: 850px;
                    margin: 0 auto;
                    padding: 10px;
                }
                .print-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 3px double #000;
                    padding-bottom: 12px;
                    margin-bottom: 20px;
                }
                .print-logo {
                    width: 90px;
                    height: 90px;
                    margin-right: 20px;
                    object-fit: contain;
                }
                .print-header-text {
                    text-align: center;
                }
                .print-header-text h5 {
                    font-size: 15px;
                    margin: 0;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                }
                .print-header-text h4 {
                    font-size: 18px;
                    margin: 2px 0;
                    font-weight: bold;
                }
                .print-header-text p {
                    font-size: 11px;
                    margin: 1px 0;
                }
                .print-title {
                    text-align: center;
                    margin-bottom: 25px;
                }
                .print-title h4 {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0;
                    text-transform: uppercase;
                }
                .print-title h5 {
                    font-size: 16px;
                    font-weight: bold;
                    margin: 5px 0 0 0;
                }
                .print-info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .print-info-table th {
                    background-color: #808080 !important;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    font-weight: bold;
                    font-size: 12px;
                    text-transform: uppercase;
                    text-align: center;
                    padding: 6px;
                    border: 1px solid #000;
                }
                .print-info-table td {
                    border: 1px solid #000;
                    padding: 10px;
                    font-size: 12px;
                    vertical-align: top;
                    width: 33.33%;
                }
                .print-section-header {
                    background-color: #808080 !important;
                    color: #fff !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    font-weight: bold;
                    font-size: 12px;
                    text-transform: uppercase;
                    text-align: center;
                    padding: 6px;
                    border: 1px solid #000;
                    margin-top: 15px;
                }
                .print-section-body {
                    border: 1px solid #000;
                    border-top: none;
                    padding: 12px;
                    font-size: 12px;
                    background-color: #fff;
                }
                .print-section-body .row {
                    display: flex;
                    flex-wrap: wrap;
                }
                .print-section-body .col-6 {
                    width: 50%;
                    box-sizing: border-box;
                    padding-right: 15px;
                }
                .print-item-row {
                    margin-bottom: 6px;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px dashed #ccc;
                    padding-bottom: 4px;
                }
                .print-item-name {
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .print-item-status {
                    font-weight: bold;
                }
            `}</style>

            {/* Wrapper untuk print semua data (sembunyi jika print-single-active) */}
            <div className="print-all-area">

                {/* Header */}

                <div className="d-flex justify-content-between align-items-center mb-4 no-print">

                    <div>

                        <h2 className="fw-bold mb-1">
                            Laporan Inspeksi Kendaraan
                        </h2>

                        <p className="text-muted mb-0">
                            Cetak dan analisis riwayat hasil pemeriksaan kendaraan
                        </p>

                    </div>

                    <div className="d-flex gap-2">

                        <button
                            className="btn btn-outline-secondary"
                            onClick={handleReset}
                        >
                            Reset Filter
                        </button>

                        <button
                            className="btn btn-success"
                            onClick={handlePrint}
                            disabled={filteredPemeriksaan.length === 0}
                        >
                            🖨️ Cetak Laporan
                        </button>

                    </div>

                </div>

                {/* Filter Area (no-print) */}

                <div className="card border-0 shadow-sm mb-4 no-print">

                    <div className="card-body">

                        <form onSubmit={handleFilter}>

                            <div className="row g-3">

                                {/* Tipe Laporan */}
                                <div className="col-md-2">

                                    <label className="form-label fw-semibold">Tipe Laporan</label>

                                    <select
                                        className="form-select"
                                        value={tipeLaporan}
                                        onChange={(e) => {
                                            setTipeLaporan(e.target.value);
                                            setSelectedKendaraan(""); // reset mobil pilihan
                                        }}
                                    >

                                        <option value="semua">Semua Mobil</option>
                                        <option value="per_mobil">Per Mobil (Kendaraan)</option>

                                    </select>

                                </div>

                                {/* Pilihan Mobil (Muncul jika tipe == per_mobil) */}
                                <div className="col-md-3">

                                    <label className="form-label fw-semibold">Pilih Kendaraan</label>

                                    <select
                                        className="form-select"
                                        value={selectedKendaraan}
                                        onChange={(e) => setSelectedKendaraan(e.target.value)}
                                        disabled={tipeLaporan === "semua"}
                                        required={tipeLaporan === "per_mobil"}
                                    >

                                        <option value="">-- Pilih Kendaraan --</option>

                                        {kendaraanList.map((k) => (

                                            <option key={k.id} value={k.id}>
                                                {k.jenis_kendaraan} - {k.tipe} ({k.plat_merah})
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                {/* Asal Kendaraan */}
                                <div className="col-md-3">

                                    <label className="form-label fw-semibold">Asal Kendaraan</label>

                                    <select
                                        className="form-select"
                                        value={asalDropdown}
                                        onChange={(e) => {
                                            setAsalDropdown(e.target.value);
                                            if (e.target.value !== "Lainnya") {
                                                setCustomAsalInput("");
                                            }
                                        }}
                                    >
                                        <option value="">Semua Asal</option>
                                        {PRESET_ASAL_KENDARAAN.map((asal) => (
                                            <option key={asal} value={asal}>{asal}</option>
                                        ))}
                                        <option value="Lainnya">Lainnya</option>
                                    </select>

                                    {asalDropdown === "Lainnya" && (
                                        <input
                                            type="text"
                                            className="form-control mt-2"
                                            placeholder="Ketik asal..."
                                            value={customAsalInput}
                                            onChange={(e) => setCustomAsalInput(e.target.value)}
                                        />
                                    )}

                                </div>

                                {/* Tanggal Mulai */}
                                <div className="col-md-2">

                                    <label className="form-label fw-semibold">Tanggal Mulai</label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={tglMulai}
                                        onChange={(e) => setTglMulai(e.target.value)}
                                    />

                                </div>

                                {/* Tanggal Selesai */}
                                <div className="col-md-2">

                                    <label className="form-label fw-semibold">Tanggal Selesai</label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={tglSelesai}
                                        onChange={(e) => setTglSelesai(e.target.value)}
                                    />

                                </div>

                                {/* Submit Filter Button */}
                                <div className="col-12 text-end">

                                    <button type="submit" className="btn btn-primary px-4">
                                        Terapkan Filter
                                    </button>

                                </div>

                            </div>

                        </form>

                    </div>

                </div>

                {/* AREA DOKUMEN / LAPORAN YANG DI-PRINT */}

                <div className="card border-0 shadow-sm p-4">

                    {/* Kop Laporan / Header Cetak */}

                    <div className="text-center mb-4">

                        <h3 className="fw-bold mb-0">LAPORAN INSPEKSI KENDARAAN</h3>

                        <h5 className="text-dark fw-bold mt-1">
                            Sistem Informasi Inspeksi Kendaraan Operasional
                        </h5>

                        <hr className="border border-dark opacity-100 mt-3" />

                    </div>

                    {/* Info Laporan Per Mobil */}

                    {tipeLaporan === "per_mobil" && infoMobilSelected && (

                        <div className="card bg-light border-0 mb-4">

                            <div className="card-body">

                                <h6 className="fw-bold text-primary mb-3">Spesifikasi Kendaraan</h6>

                                <div className="row">

                                    <div className="col-md-4">
                                        <div className="small fw-bold text-dark">Jenis Kendaraan</div>
                                        <div className="fw-bold text-primary">{infoMobilSelected.jenis_kendaraan}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="small fw-bold text-dark">Tipe / Model</div>
                                        <div className="fw-bold text-primary">{infoMobilSelected.tipe}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="small fw-bold text-dark">Nomor Plat Merah</div>
                                        <div className="fw-bold text-danger">{infoMobilSelected.plat_merah}</div>
                                    </div>

                                    <div className="col-md-4 mt-2">
                                        <div className="small fw-bold text-dark">Asal Kendaraan</div>
                                        <div className="fw-bold text-dark">{infoMobilSelected.asal_kendaraan}</div>
                                    </div>

                                    <div className="col-md-4 mt-2">
                                        <div className="small fw-bold text-dark">Jenis Roda</div>
                                        <div className="fw-bold text-dark">{infoMobilSelected.jenis_roda || "-"}</div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* Info Periode */}

                    <div className="mb-3 small fw-bold text-dark">
                        Periode Laporan: {" "}
                        <span className="fw-bold text-primary">
                            {tglMulai ? formatTanggal(tglMulai) : "Awal"} s.d. {tglSelesai ? formatTanggal(tglSelesai) : "Sekarang"}
                        </span>
                    </div>

                    {/* Tabel Laporan */}

                    <div className="table-responsive">

                        <table className="table table-bordered align-middle">

                            <thead className="table-light">

                                <tr>

                                    <th width="50" className="text-center">No</th>

                                    <th>Tanggal</th>

                                    <th>Kendaraan</th>

                                    <th>Plat Merah</th>

                                    <th>Inspektor</th>

                                    <th width="260">Kondisi Hasil Pemeriksaan</th>

                                    <th>Catatan Umum</th>

                                    <th className="no-print" width="100">Aksi</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredPemeriksaan.length > 0 ? (

                                    filteredPemeriksaan.map((item, index) => {

                                        const ringkasan = getRingkasanStatus(item.id);

                                        return (

                                            <tr key={item.id}>

                                                <td className="text-center">{index + 1}</td>

                                                <td>{formatTanggal(item.tanggal)}</td>

                                                <td>{item.jenis_kendaraan} - {item.tipe}</td>

                                                <td className="fw-bold">{item.plat_merah}</td>

                                                <td>{item.nama_inspektor}</td>

                                                <td>

                                                    <div className="d-flex flex-column gap-1 small">

                                                        {statusList.length > 0 ? (
                                                            statusList.map((s) => {
                                                                const count = ringkasan.counts[s.nama_status] || 0;
                                                                return (
                                                                    <span
                                                                        key={s.id}
                                                                        className="badge text-start"
                                                                        style={{
                                                                            backgroundColor: s.warna || "#6c757d",
                                                                            color: "#fff"
                                                                        }}
                                                                    >
                                                                        {s.nama_status}: {count} item
                                                                    </span>
                                                                );
                                                            })
                                                        ) : (
                                                            <>
                                                                <span className="badge bg-success text-start">
                                                                    Aman: {ringkasan.counts["Aman"] || 0} item
                                                                </span>
                                                                <span className="badge bg-warning text-dark text-start">
                                                                    Perlu Perhatian: {ringkasan.counts["Perlu Perhatian"] || 0} item
                                                                </span>
                                                                <span className="badge bg-danger text-start">
                                                                    Perlu Penggantian: {ringkasan.counts["Perlu Penggantian"] || 0} item
                                                                </span>
                                                            </>
                                                        )}

                                                    </div>

                                                </td>

                                                <td className="fw-bold text-dark">{item.catatan_umum || "-"}</td>

                                                <td className="no-print text-center">
                                                    <div className="d-flex gap-1 justify-content-center">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm px-2 text-nowrap"
                                                            onClick={() => handleDetail(item.id)}
                                                        >
                                                            Detail
                                                        </button>
                                                        <button
                                                            className="btn btn-success btn-sm px-2 text-nowrap"
                                                            onClick={() => handlePrintSingle(item.id)}
                                                        >
                                                            🖨️ Cetak
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>

                                        );

                                    })

                                ) : (

                                    <tr>

                                        <td colSpan="8" className="text-center py-4 text-muted">
                                            Tidak ada data pemeriksaan dalam filter yang dipilih.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* ==================== SINGLE PRINT TEMPLATE (KOP INSTANSI) ==================== */}
            {activePrintData && (
                <div className="print-single-area">
                    <div className="print-single-container">
                        {/* Kop Surat Instansi */}
                        <div className="print-header">
                            <img src={logoKemensetneg} alt="Logo" className="print-logo" />
                            <div className="print-header-text">
                                <h5>KEMENTERIAN SEKRETARIAT NEGARA RI</h5>
                                <h4>SEKRETARIAT PRESIDEN</h4>
                                <h4>ISTANA KEPRESIDENAN YOGYAKARTA</h4>
                                <p>Jalan Jenderal Ahmad Yani No. 3, Yogyakarta, 55122</p>
                                <p>Telepon (0274) 512005, Faksimile (0274) 561369</p>
                            </div>
                        </div>

                        {/* Judul Laporan */}
                        <div className="print-title">
                            <h4>DATA PEMERIKSAAN KENDARAAN</h4>
                            <h5>NO. POL: {activePrintData.plat_merah}</h5>
                        </div>

                        {/* Tabel 3 Kolom Ringkasan */}
                        <table className="print-info-table">
                            <thead>
                                <tr>
                                    <th>DATA KENDARAAN</th>
                                    <th>INSPEKTOR</th>
                                    <th>FOTO KENDARAAN</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="mb-2"><strong>NAMA PEMILIK:</strong> Istana Kepresidenan Yogyakarta</div>
                                        <div className="mb-2"><strong>JENIS/MERK:</strong> {activePrintData.jenis_kendaraan} / {activePrintData.tipe}</div>
                                        <div><strong>ASAL:</strong> {activePrintData.asal_kendaraan}</div>
                                    </td>
                                    <td>
                                        <div className="mb-2"><strong>NAMA INSPEKTOR:</strong> {activePrintData.nama_inspektor}</div>
                                        <div><strong>TANGGAL CEK KENDARAAN:</strong> {formatTanggal(activePrintData.tanggal)}</div>
                                    </td>
                                    <td className="text-center" style={{ verticalAlign: "middle" }}>
                                        {activePrintData.foto ? (
                                            <img src={getPhotoUrl(activePrintData.foto)} alt="Foto" style={{ maxWidth: "100%", maxHeight: "85px", objectFit: "cover", borderRadius: "4px" }} />
                                        ) : (
                                            <div style={{ border: "2px dashed #ccc", padding: "10px", color: "#666", fontSize: "11px", fontWeight: "bold" }}>
                                                FOTO KENDARAAN
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Roda Section */}
                        <div className="print-section-header">JENIS KENDARAAN RODA</div>
                        <div className="print-section-body">
                            <strong>JENIS KENDARAAN RODA:</strong> {activePrintData.jenis_roda || "-"}
                        </div>

                        {/* Kategori Items */}
                        {kategoris.map((kat) => {
                            const itemKategori = items.filter(item => item.kategori_id === kat.id);
                            if (itemKategori.length === 0) return null;

                            return (
                                <React.Fragment key={kat.id}>
                                    <div className="print-section-header">{kat.nama_kategori}</div>
                                    <div className="print-section-body">
                                        <div className="row">
                                            {itemKategori.map((item) => {
                                                const found = activePrintData.hasil?.find(h => h.item_id === item.id);
                                                return (
                                                    <div key={item.id} className="col-6 mb-2">
                                                        <div className="print-item-row">
                                                            <span className="print-item-name">{item.nama_item}</span>
                                                            <span className="print-item-status" style={{ color: found?.warna || "#000" }}>
                                                                {found ? found.nama_status : "Belum Dicek"} {found?.tahun_ganti ? `(${found.tahun_ganti})` : ""}
                                                            </span>
                                                        </div>
                                                        {found?.catatan && (
                                                            <div className="small text-muted ps-2" style={{ fontStyle: "italic" }}>
                                                                * Catatan: {found.catatan}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}

                        {/* Catatan Umum */}
                        <div className="print-section-header">CATATAN UMUM</div>
                        <div className="print-section-body fw-bold text-dark">
                            {activePrintData.catatan_umum || "-"}
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL DETAIL ==================== */}
            {showDetail && detailData && (

                <div
                    className="modal fade show d-block no-print"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}
                >

                    <div className="modal-dialog modal-xl">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title fw-bold">Detail Laporan Pemeriksaan</h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDetail(false);
                                        setDetailData(null);
                                    }}
                                ></button>

                            </div>

                            <div className="modal-body">

                                {/* Header Ringkasan Info */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="corporate-meta-card h-100">
                                            <div className="corporate-meta-header">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="stat-icon-wrapper stat-icon-blue" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                                                        <FaCalendarAlt />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Informasi Sesi Inspeksi</div>
                                                        <small className="text-muted" style={{ fontSize: "11px" }}>Data pencatatan inspeksi berkala</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="corporate-meta-row">
                                                    <div className="corporate-meta-label">Tanggal Pelaksanaan</div>
                                                    <div className="corporate-meta-value">{formatTanggal(detailData.tanggal)}</div>
                                                </div>
                                                <div className="corporate-meta-row">
                                                    <div className="corporate-meta-label">Petugas Inspektor</div>
                                                    <div className="corporate-meta-value d-flex align-items-center gap-2">
                                                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#e2e8f0", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>
                                                            {(detailData.nama_inspektor || "I").charAt(0).toUpperCase()}
                                                        </div>
                                                        <span>{detailData.nama_inspektor}</span>
                                                    </div>
                                                </div>
                                                <div className="corporate-meta-row">
                                                    <div className="corporate-meta-label">Catatan Umum</div>
                                                    <div className="corporate-meta-value text-secondary fw-normal">
                                                        {detailData.catatan_umum || <span className="text-muted fst-italic">Tidak ada catatan khusus</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="corporate-meta-card h-100">
                                            <div className="corporate-meta-header">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="stat-icon-wrapper stat-icon-emerald" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                                                        <FaCar />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Identitas Armada Kendaraan</div>
                                                        <small className="text-muted" style={{ fontSize: "11px" }}>Spesifikasi unit yang diperiksa</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="corporate-meta-row">
                                                    <div className="corporate-meta-label">Jenis & Tipe Unit</div>
                                                    <div className="corporate-meta-value">
                                                        {detailData.jenis_kendaraan} — {detailData.tipe}
                                                    </div>
                                                </div>
                                                <div className="corporate-meta-row">
                                                    <div className="corporate-meta-label">Plat Dinas (Merah)</div>
                                                    <div className="corporate-meta-value">
                                                        <span className="badge" style={{ backgroundColor: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca", padding: "4px 8px", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                                                            {detailData.plat_merah}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="corporate-meta-row">
                                                    <div className="corporate-meta-label">Asal Kendaraan</div>
                                                    <div className="corporate-meta-value">{detailData.asal_kendaraan}</div>
                                                </div>
                                                <div className="corporate-meta-row">
                                                    <div className="corporate-meta-label">Konfigurasi Roda</div>
                                                    <div className="corporate-meta-value">
                                                        <span className="badge badge-corporate-blue">
                                                            {detailData.jenis_roda || "Roda Standar"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabel Lengkap Semua Item Pemeriksaan */}
                                <div className="card border shadow-sm">
                                    <div className="card-header bg-white border-bottom d-flex align-items-center gap-2 py-3">
                                        <div className="stat-icon-wrapper stat-icon-blue" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                                            <FaClipboardCheck />
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "14px" }}>Hasil Kondisi Semua Item Komponen</h6>
                                            <small className="text-muted" style={{ fontSize: "12px" }}>Rekapitulasi lengkap parameter inspeksi unit kendaraan</small>
                                        </div>
                                    </div>

                                    <div className="card-body p-0">
                                        <div className="table-responsive border-0">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Item Pemeriksaan</th>
                                                        <th width="200">Status Kondisi</th>
                                                        <th width="180">Tahun Ganti</th>
                                                        <th>Catatan Detail</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {kategoris.map(kat => {
                                                        const itemKategori = items.filter(item => item.kategori_id === kat.id);
                                                        if (itemKategori.length === 0) return null;

                                                        return (
                                                            <React.Fragment key={kat.id}>
                                                                {/* Header Kategori */}
                                                                <tr style={{ backgroundColor: "#f8fafc" }}>
                                                                    <td colSpan="4" className="fw-bold text-uppercase text-dark small py-2 px-3">
                                                                        <FaFolderOpen className="text-primary me-2" size={13} />
                                                                        {kat.nama_kategori}
                                                                    </td>
                                                                </tr>

                                                                {/* Row List Item Komponen Lengkap */}
                                                                {itemKategori.map(item => {

                                                                    // Cocokkan item_id di hasil pemeriksaan yang di-load
                                                                    const found = detailData.hasil?.find(h => h.item_id === item.id);

                                                                    return (

                                                                        <tr key={item.id}>

                                                                            <td className="ps-4 fw-bold text-dark">
                                                                                {item.nama_item}
                                                                            </td>

                                                                            <td>

                                                                                {found ? (

                                                                                    <span
                                                                                        className="badge px-3 py-2 text-uppercase"
                                                                                        style={{
                                                                                            backgroundColor: found.warna || "#6c757d",
                                                                                            color: "#fff"
                                                                                        }}
                                                                                    >
                                                                                        {found.nama_status}
                                                                                    </span>

                                                                                ) : (

                                                                                    <span className="badge bg-light text-muted border px-3 py-2">
                                                                                        Belum Dicek
                                                                                    </span>

                                                                                )}

                                                                            </td>

                                                                            <td>

                                                                                {found && found.tahun_ganti ? (

                                                                                    <span className="fw-bold text-primary">{found.tahun_ganti}</span>

                                                                                ) : (

                                                                                    <span className="fw-bold text-dark">-</span>

                                                                                )}

                                                                            </td>

                                                                            <td>

                                                                                {found ? (
                                                                                    <span className="fw-semibold text-dark">{found.catatan}</span>
                                                                                ) : (
                                                                                    <span className="fw-bold text-dark">-</span>
                                                                                )}

                                                                            </td>

                                                                        </tr>

                                                                    );

                                                                })}

                                                            </React.Fragment>

                                                        );

                                                    })}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowDetail(false);
                                        setDetailData(null);
                                    }}
                                >
                                    Tutup
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Laporan;
