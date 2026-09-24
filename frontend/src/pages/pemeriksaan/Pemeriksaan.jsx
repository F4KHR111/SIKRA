import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import pemeriksaanService from "../../services/pemeriksaanService";
import {
    FaChevronDown,
    FaChevronUp,
    FaCalendarAlt,
    FaCar,
    FaClipboardCheck,
    FaFolder,
    FaFolderOpen,
    FaCheck,
    FaInfoCircle
} from "react-icons/fa";
import kendaraanService from "../../services/kendaraanService";
import userService from "../../services/userService";
import kategoriService from "../../services/kategoriService";
import itemService from "../../services/itemService";
import statusService from "../../services/statusService";
import hasilService from "../../services/hasilService";

function Pemeriksaan() {

    const [pemeriksaan, setPemeriksaan] = useState([]);
    const [kendaraanList, setKendaraanList] = useState([]);
    const [inspektorList, setInspektorList] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [items, setItems] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [search, setSearch] = useState("");
    const [filterRoda, setFilterRoda] = useState("");
    const [loading, setLoading] = useState(false);

    // State modal tambah / edit
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // State modal detail
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);

    // Form state utama (induk)
    const [form, setForm] = useState({
        kendaraan_id: "",
        inspektor_id: "",
        nama_inspektor: "",
        tanggal: new Date().toISOString().substring(0, 10),
        catatan_umum: "",
        odometer: ""
    });

    // State untuk input detail hasil pemeriksaan
    // key: item_id, value: { status_id, tahun_ganti, catatan, hasil_id }
    const [inputHasil, setInputHasil] = useState({});

    // State untuk collapsible accordion kategori di form dan detail
    const [openFormCategories, setOpenFormCategories] = useState({});
    const [openDetailCategories, setOpenDetailCategories] = useState({});

    const toggleFormCategory = (id) => {
        setOpenFormCategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleDetailCategory = (id) => {
        setOpenDetailCategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Dapatkan data user yang login saat ini
    const getCurrentUser = () => {
        try {
            const u = localStorage.getItem("user");
            return u ? JSON.parse(u) : null;
        } catch {
            return null;
        }
    };

    const getRoleFromToken = () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                return payload.role || "";
            }
        } catch (err) {
            console.log(err);
        }
        return "";
    };

    const currentUser = getCurrentUser();
    const currentRole = getRoleFromToken();

    const resetForm = () => {
        setForm({
            kendaraan_id: "",
            inspektor_id: currentUser?.id || "",
            nama_inspektor: currentUser?.nama || "",
            tanggal: new Date().toISOString().substring(0, 10),
            catatan_umum: "",
            odometer: ""
        });

        // Reset inputHasil ke kosong/default
        const initial = {};
        items.forEach(item => {
            initial[item.id] = {
                status_id: statuses[0]?.id || "",
                tahun_ganti: "",
                catatan: "",
                hasil_id: null
            };
        });
        setInputHasil(initial);

        setIsEdit(false);
        setEditId(null);
    };

    // ==================== LOAD DATA ====================

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await pemeriksaanService.getAll();
            setPemeriksaan(data);
        } catch (err) {
            console.log(err);
            toast.error("Gagal memuat data pemeriksaan");
        } finally {
            setLoading(false);
        }
    };

    const loadKendaraan = async () => {
        try {
            const data = await kendaraanService.getAll();
            setKendaraanList(data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadInspektor = async () => {
        try {
            const data = await userService.getAll();
            setInspektorList(data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadMetadata = async () => {
        try {
            // Load Kategori
            const kData = await kategoriService.getAll();
            setKategoris(kData);

            // Load Status
            const sData = await statusService.getAll();
            setStatuses(sData);

            // Load Items per Kategori secara paralel untuk menghindari error 500 pada endpoint '/item'
            const allItems = [];
            for (const kat of kData) {
                try {
                    const itemsPerKat = await itemService.getByKategori(kat.id);
                    allItems.push(...itemsPerKat);
                } catch (errItem) {
                    console.error(`Gagal memuat item untuk kategori ${kat.id}:`, errItem);
                }
            }
            setItems(allItems);

        } catch (err) {
            console.log("Gagal memuat data metadata:", err);
        }
    };

    useEffect(() => {
        loadData();
        loadKendaraan();
        loadInspektor();
        loadMetadata();
    }, []);

    // ==================== FILTER / SEARCH ====================

    const filteredData = pemeriksaan.filter((item) => {
        const q = search.toLowerCase();

        const cocokSearch =
            item.jenis_kendaraan?.toLowerCase().includes(q) ||
            item.tipe?.toLowerCase().includes(q) ||
            item.plat_merah?.toLowerCase().includes(q) ||
            item.nama_inspektor?.toLowerCase().includes(q);

        const cocokRoda =
            filterRoda === "" || item.jenis_roda === filterRoda;

        return cocokSearch && cocokRoda;
    });

    // ==================== HANDLE FORM CHANGE ====================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleHasilChange = (itemId, field, value) => {
        setInputHasil(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    const setSemuaStatusBaik = (kategoriId = null) => {
        const statusBaikId = statuses[0]?.id || "";
        if (!statusBaikId) return;

        setInputHasil(prev => {
            const updated = { ...prev };
            items.forEach(item => {
                if (!kategoriId || item.kategori_id === kategoriId) {
                    updated[item.id] = {
                        ...updated[item.id],
                        status_id: statusBaikId
                    };
                }
            });
            return updated;
        });
    };

    // ==================== OPEN MODAL TAMBAH ====================

    const handleOpenTambah = () => {
        resetForm();
        // Inisialisasi inputHasil
        const initial = {};
        items.forEach(item => {
            initial[item.id] = {
                status_id: statuses[0]?.id || "",
                tahun_ganti: "",
                catatan: "",
                hasil_id: null
            };
        });
        setInputHasil(initial);
        setShowModal(true);
    };

    // ==================== OPEN MODAL EDIT ====================

    const handleOpenEdit = async (id) => {
        try {
            const data = await pemeriksaanService.getById(id);
            setForm({
                kendaraan_id: data.kendaraan_id || "",
                inspektor_id: data.inspektor_id || "",
                nama_inspektor: data.nama_inspektor || "",
                tanggal: data.tanggal ? data.tanggal.substring(0, 10) : "",
                catatan_umum: data.catatan_umum || "",
                odometer: data.odometer ?? ""
            });

            // Ambil semua detail hasil pemeriksaan dari backend yang terkait pemeriksaan ini
            const allHasil = await hasilService.getAll();
            const hasilPemeriksaanIni = allHasil.filter(h => h.pemeriksaan_id === id);

            // Inisialisasi state input hasil berdasarkan item list
            const initial = {};
            items.forEach(item => {
                const found = hasilPemeriksaanIni.find(h => h.item_id === item.id);
                initial[item.id] = {
                    status_id: found ? found.status_id : (statuses[0]?.id || ""),
                    tahun_ganti: found && found.tahun_ganti ? found.tahun_ganti : "",
                    catatan: found ? found.catatan : "",
                    hasil_id: found ? found.id : null
                };
            });
            setInputHasil(initial);

            setIsEdit(true);
            setEditId(id);
            setShowModal(true);
        } catch (err) {
            console.log(err);
            toast.error("Gagal memuat data pemeriksaan");
        }
    };

    // ==================== HANDLE SUBMIT (CREATE / UPDATE) ====================

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { nama_inspektor, ...payload } = form;
            payload.odometer = payload.odometer ? parseInt(payload.odometer) : null;
            let pemeriksaanId = editId;

            if (isEdit) {
                await pemeriksaanService.update(editId, payload);
            } else {
                const res = await pemeriksaanService.create(payload);
                pemeriksaanId = res.data.id;
            }

            // Simpan detail hasil pemeriksaan satu per satu
            for (const itemId of Object.keys(inputHasil)) {
                const itemData = inputHasil[itemId];

                const payloadHasil = {
                    pemeriksaan_id: pemeriksaanId,
                    item_id: parseInt(itemId),
                    status_id: parseInt(itemData.status_id) || null,
                    tahun_ganti: itemData.tahun_ganti ? parseInt(itemData.tahun_ganti) : null,
                    catatan: itemData.catatan || ""
                };

                if (itemData.hasil_id) {
                    // Update data hasil pemeriksaan yang sudah ada
                    await hasilService.update(itemData.hasil_id, payloadHasil);
                } else {
                    // Simpan data hasil pemeriksaan baru
                    await hasilService.create(payloadHasil);
                }
            }

            toast.success(isEdit ? "Pemeriksaan berhasil diperbarui" : "Pemeriksaan berhasil ditambahkan");
            setShowModal(false);
            resetForm();
            loadData();
        } catch (err) {
            console.log(err);
            const msg = err.response?.data?.message || "Gagal menyimpan data";
            toast.error(msg);
        }
    };

    // ==================== HANDLE DELETE ====================

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Seluruh data pemeriksaan beserta detail hasil pemeriksaannya akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        });

        if (result.isConfirmed) {
            try {
                // Di backend, relasi tabel mungkin butuh penghapusan detail dulu
                // atau cascade delete otomatis di level database.
                // Jika DB tidak diset CASCADE, kita hapus detailnya dulu di frontend secara manual
                const allHasil = await hasilService.getAll();
                const hasilPemeriksaanIni = allHasil.filter(h => h.pemeriksaan_id === id);

                for (const h of hasilPemeriksaanIni) {
                    await hasilService.remove(h.id);
                }

                // Setelah detail terhapus, hapus data induknya
                await pemeriksaanService.remove(id);
                toast.success("Data pemeriksaan berhasil dihapus");
                loadData();
            } catch (err) {
                console.log(err);
                const msg = err.response?.data?.message || "Gagal menghapus data pemeriksaan";
                toast.error(msg);
            }
        }
    };

    // ==================== HANDLE DETAIL ====================

    const handleDetail = async (id) => {
        try {
            const data = await pemeriksaanService.getById(id);
            const allHasil = await hasilService.getAll();
            const hasilPemeriksaanIni = allHasil.filter(h => h.pemeriksaan_id === id);

            setDetailData({
                ...data,
                hasil: hasilPemeriksaanIni
            });
            setShowDetail(true);
        } catch (err) {
            console.log(err);
            toast.error("Gagal memuat detail pemeriksaan");
        }
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

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Data Pemeriksaan</h2>
                    <p className="text-muted mb-0">Kelola Pemeriksaan Kendaraan</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenTambah}>
                    + Tambah Pemeriksaan
                </button>
            </div>

            {/* Search & Filter */}
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari kendaraan, inspektor, atau plat..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={filterRoda}
                                onChange={(e) => setFilterRoda(e.target.value)}
                            >
                                <option value="">Semua Jenis Roda</option>
                                {[...new Set(kendaraanList.map(k => k.jenis_roda).filter(Boolean))].map(roda => (
                                    <option key={roda} value={roda}>{roda}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabel Utama */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th width="60">No</th>
                                        <th>Kendaraan</th>
                                        <th>Plat Merah</th>
                                        <th>Odometer</th>
                                        <th>Inspektor</th>
                                        <th>Tanggal Cek</th>
                                        <th width="220">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.jenis_kendaraan} - {item.tipe}</td>
                                                <td>{item.plat_merah}</td>
                                                <td>{item.odometer ? `${item.odometer.toLocaleString("id-ID")} Km` : "-"}</td>
                                                <td>{item.nama_inspektor}</td>
                                                <td>{formatTanggal(item.tanggal)}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-info btn-sm me-2 text-white"
                                                        onClick={() => handleDetail(item.id)}
                                                    >
                                                        Detail
                                                    </button>
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => handleOpenEdit(item.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                Tidak ada data pemeriksaan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ==================== MODAL TAMBAH / EDIT ==================== */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    {isEdit ? "Edit Pemeriksaan" : "Tambah Pemeriksaan"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {/* Bagian Induk Pemeriksaan */}
                                    <div className="card bg-light border-0 mb-4">
                                        <div className="card-body">
                                            <h6 className="fw-bold mb-3 text-primary">Informasi Utama</h6>
                                            <div className="row">
                                                {/* Kendaraan */}
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label fw-semibold">Kendaraan</label>
                                                    <select
                                                        className="form-select"
                                                        name="kendaraan_id"
                                                        value={form.kendaraan_id}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">-- Pilih Kendaraan --</option>
                                                        {kendaraanList.map((k) => (
                                                            <option key={k.id} value={k.id}>
                                                                {k.jenis_kendaraan} - {k.tipe} ({k.plat_merah})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Inspektor */}
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label fw-semibold">Inspektor</label>
                                                    {currentRole === "Admin" ? (
                                                        <select
                                                            className="form-select"
                                                            name="inspektor_id"
                                                            value={form.inspektor_id}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="">-- Pilih Inspektor --</option>
                                                            {inspektorList.map((u) => (
                                                                <option key={u.id} value={u.id}>
                                                                    {u.nama} ({u.nama_role})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="form-control bg-white"
                                                            value={form.nama_inspektor}
                                                            readOnly
                                                            disabled
                                                        />
                                                    )}
                                                </div>

                                                {/* Tanggal */}
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label fw-semibold">Tanggal</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="tanggal"
                                                        value={form.tanggal}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Odometer */}
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label fw-semibold">Odometer (Km)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="odometer"
                                                        value={form.odometer}
                                                        onChange={handleChange}
                                                        placeholder="Contoh: 125000"
                                                        required
                                                    />
                                                </div>

                                                {/* Catatan Umum */}
                                                <div className="col-md-12 mb-2">
                                                    <label className="form-label fw-semibold">Catatan Umum</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="catatan_umum"
                                                        rows="2"
                                                        value={form.catatan_umum}
                                                        onChange={handleChange}
                                                        placeholder="Tulis catatan umum pemeriksaan kendaraan..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                     {/* Bagian Detail Item Pemeriksaan Per Kategori */}
                                     <div className="card border-0 shadow-sm">
                                         <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                                             <div className="d-flex align-items-center gap-2">
                                                 <div className="stat-icon-wrapper stat-icon-blue" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                                                     <FaClipboardCheck />
                                                 </div>
                                                 <div>
                                                     <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "14px" }}>Daftar Parameter Item Pemeriksaan</h6>
                                                     <small className="text-muted" style={{ fontSize: "12px" }}>Input dan verifikasi kondisi setiap komponen armada</small>
                                                 </div>
                                             </div>
                                             <div className="d-flex gap-2">
                                                 <button
                                                     type="button"
                                                     className="btn btn-outline-secondary btn-sm"
                                                     onClick={() => {
                                                         const openAll = {};
                                                         kategoris.forEach(k => { openAll[k.id] = true; });
                                                         setOpenFormCategories(openAll);
                                                     }}
                                                 >
                                                     <FaFolderOpen className="me-1" size={13} /> Buka Semua
                                                 </button>
                                                 <button
                                                     type="button"
                                                     className="btn btn-outline-secondary btn-sm"
                                                     onClick={() => setOpenFormCategories({})}
                                                 >
                                                     <FaFolder className="me-1" size={13} /> Tutup Semua
                                                 </button>
                                             </div>
                                         </div>
                                         <div className="card-body p-3 bg-light">
                                             {kategoris.map((kat) => {
                                                 const itemKategori = items.filter(item => item.kategori_id === kat.id);
                                                 if (itemKategori.length === 0) return null;
                                                 const isOpen = !!openFormCategories[kat.id];

                                                 return (
                                                     <div className="card border shadow-sm mb-3" key={kat.id}>
                                                         <div
                                                             className="corporate-accordion-header d-flex justify-content-between align-items-center"
                                                             onClick={() => toggleFormCategory(kat.id)}
                                                         >
                                                             <div className="d-flex align-items-center gap-2">
                                                                 <span className="text-secondary">
                                                                     {isOpen ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
                                                                 </span>
                                                                 <FaFolderOpen className="text-primary ms-1" size={14} />
                                                                 <span className="fw-bold text-uppercase text-dark" style={{ fontSize: "13px", letterSpacing: "0.02em" }}>
                                                                     {kat.nama_kategori}
                                                                 </span>
                                                                 <span className="badge badge-corporate-neutral rounded-pill small ms-1">
                                                                     {itemKategori.length} Item
                                                                 </span>
                                                             </div>
                                                             <div className="d-flex align-items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                                 <button
                                                                     type="button"
                                                                     className="btn btn-outline-success btn-xs py-1 px-2 fw-bold text-xs"
                                                                     style={{ fontSize: "11px" }}
                                                                     onClick={() => setSemuaStatusBaik(kat.id)}
                                                                 >
                                                                     <FaCheck className="me-1" size={11} /> Set Kategori Ini Baik
                                                                 </button>
                                                             </div>
                                                         </div>

                                                         {isOpen && (
                                                             <div className="card-body p-0 border-top">
                                                                 <div className="table-responsive">
                                                                     <table className="table table-hover align-middle mb-0">
                                                                         <thead className="table-light">
                                                                             <tr>
                                                                                 <th className="ps-3">Item Pemeriksaan</th>
                                                                                 <th width="200">Status</th>
                                                                                 <th width="150">Tahun Ganti</th>
                                                                                 <th className="pe-3">Catatan Detail</th>
                                                                             </tr>
                                                                         </thead>
                                                                         <tbody>
                                                                             {itemKategori.map((item) => {
                                                                                 const val = inputHasil[item.id] || {
                                                                                     status_id: "",
                                                                                     tahun_ganti: "",
                                                                                     catatan: ""
                                                                                 };

                                                                                 return (
                                                                                     <tr key={item.id}>
                                                                                         <td className="ps-3 fw-semibold text-muted">
                                                                                             {item.nama_item}
                                                                                         </td>
                                                                                         <td>
                                                                                             <select
                                                                                                 className="form-select form-select-sm fw-bold"
                                                                                                 name={`status_${item.id}`}
                                                                                                 value={val.status_id}
                                                                                                 onChange={(e) => handleHasilChange(item.id, "status_id", e.target.value)}
                                                                                                 style={{ color: statuses.find(s => String(s.id) === String(val.status_id))?.warna || "#000" }}
                                                                                                 required
                                                                                             >
                                                                                                 <option value="">-- Pilih --</option>
                                                                                                 {statuses.map((s) => (
                                                                                                     <option key={s.id} value={s.id} style={{ color: s.warna }} className="fw-bold">
                                                                                                         ● {s.nama_status}
                                                                                                     </option>
                                                                                                 ))}
                                                                                             </select>
                                                                                         </td>
                                                                                         <td>
                                                                                             {item.is_tahun_ganti === 1 ? (
                                                                                                 <input
                                                                                                     type="number"
                                                                                                     className="form-control form-control-sm"
                                                                                                     placeholder="Tahun"
                                                                                                     value={val.tahun_ganti}
                                                                                                     onChange={(e) => handleHasilChange(item.id, "tahun_ganti", e.target.value)}
                                                                                                 />
                                                                                             ) : (
                                                                                                 <span className="text-muted small">-</span>
                                                                                             )}
                                                                                         </td>
                                                                                         <td className="pe-3">
                                                                                             <input
                                                                                                 type="text"
                                                                                                 className="form-control form-control-sm"
                                                                                                 placeholder="Catatan untuk item ini..."
                                                                                                 value={val.catatan}
                                                                                                 onChange={(e) => handleHasilChange(item.id, "catatan", e.target.value)}
                                                                                             />
                                                                                         </td>
                                                                                     </tr>
                                                                                 );
                                                                             })}
                                                                         </tbody>
                                                                     </table>
                                                                 </div>
                                                             </div>
                                                         )}
                                                                                    </div>
                                                  );
                                              })}
                                          </div>
                                      </div>
                                  </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                    >
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEdit ? "Update Pemeriksaan" : "Simpan Pemeriksaan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL DETAIL ==================== */}
            {showDetail && detailData && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Detail Pemeriksaan Lengkap</h5>
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
                                {/* Info Sesi Pemeriksaan & Identitas Armada Side-by-Side */}
                                <div className="row g-3 mb-4">
                                    {/* Info Sesi Pemeriksaan */}
                                    <div className="col-md-6">
                                        <div className="corporate-meta-card h-100">
                                            <div className="corporate-meta-header">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="stat-icon-wrapper stat-icon-blue" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                                                        <FaCalendarAlt />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Informasi Sesi Pemeriksaan</div>
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
                                                    <div className="corporate-meta-label">Odometer (Jarak)</div>
                                                    <div className="corporate-meta-value">
                                                        {detailData.odometer ? (
                                                            <span className="fw-bold text-dark">
                                                                {detailData.odometer.toLocaleString("id-ID")} <span className="text-muted fw-normal small">Km</span>
                                                            </span>
                                                        ) : "-"}
                                                    </div>
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

                                    {/* Info Identitas Kendaraan */}
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
                                                    <div className="corporate-meta-label">Plat Operasional (Hitam)</div>
                                                    <div className="corporate-meta-value" style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                                                        {detailData.plat_hitam || "-"}
                                                    </div>
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

                                {/* Hasil Detail Pemeriksaan per Kategori */}
                                <div className="card border shadow-sm">
                                    <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="stat-icon-wrapper stat-icon-blue" style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                                                <FaClipboardCheck />
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "14px" }}>Hasil Kondisi Item Pemeriksaan</h6>
                                                <small className="text-muted" style={{ fontSize: "12px" }}>{detailData.hasil?.length || 0} parameter komponen tercatat</small>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => {
                                                    const openAll = {};
                                                    kategoris.forEach(k => { openAll[k.id] = true; });
                                                    setOpenDetailCategories(openAll);
                                                }}
                                            >
                                                <FaFolderOpen className="me-1" size={13} /> Buka Semua
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => setOpenDetailCategories({})}
                                            >
                                                <FaFolder className="me-1" size={13} /> Tutup Semua
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body p-3 bg-light">
                                        {kategoris.map((kat) => {
                                            const detailKategori = detailData.hasil?.filter(h => h.nama_kategori === kat.nama_kategori) || [];
                                            if (detailKategori.length === 0) return null;
                                            const isOpen = !!openDetailCategories[kat.id];

                                            return (
                                                <div className="card border shadow-sm mb-3" key={kat.id}>
                                                    <div
                                                        className="corporate-accordion-header d-flex justify-content-between align-items-center"
                                                        onClick={() => toggleDetailCategory(kat.id)}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="text-secondary">
                                                                {isOpen ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
                                                            </span>
                                                            <FaFolderOpen className="text-primary ms-1" size={14} />
                                                            <span className="fw-bold text-uppercase text-dark" style={{ fontSize: "13px", letterSpacing: "0.02em" }}>
                                                                {kat.nama_kategori}
                                                            </span>
                                                            <span className="badge badge-corporate-neutral rounded-pill small ms-1">
                                                                {detailKategori.length} Item
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {isOpen && (
                                                        <div className="card-body p-0 border-top">
                                                            <div className="table-responsive border-0">
                                                                <table className="table table-hover align-middle mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="ps-3">Item Pemeriksaan</th>
                                                                            <th width="190">Status Kondisi</th>
                                                                            <th width="160">Tahun Ganti</th>
                                                                            <th className="pe-3">Catatan Petugas</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {detailKategori.map((hasil) => (
                                                                            <tr key={hasil.id}>
                                                                                <td className="ps-3 fw-semibold text-dark">
                                                                                    {hasil.nama_item}
                                                                                </td>
                                                                                <td>
                                                                                    <span
                                                                                        className="badge px-3 py-2 text-uppercase d-inline-flex align-items-center gap-1"
                                                                                        style={{
                                                                                            backgroundColor: hasil.warna || "#6c757d",
                                                                                            color: "#ffffff",
                                                                                            fontSize: "11px",
                                                                                            letterSpacing: "0.03em"
                                                                                        }}
                                                                                    >
                                                                                        ● {hasil.nama_status}
                                                                                    </span>
                                                                                </td>
                                                                                <td>
                                                                                    {hasil.tahun_ganti ? (
                                                                                        <span className="badge badge-corporate-blue">{hasil.tahun_ganti}</span>
                                                                                    ) : (
                                                                                        <span className="text-muted small">-</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="pe-3 text-secondary" style={{ fontSize: "13px" }}>
                                                                                    {hasil.catatan || <span className="text-muted small">-</span>}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="text-muted small mt-4">
                                    Dibuat pada: {formatTanggal(detailData.created_at)}
                                    {" | "}
                                    Terakhir diubah: {formatTanggal(detailData.updated_at)}
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

export default Pemeriksaan;
