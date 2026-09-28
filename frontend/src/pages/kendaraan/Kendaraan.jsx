import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaIdCard, FaExclamationTriangle, FaCalendarAlt, FaCheckCircle, FaCar, FaEye, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import kendaraanService from "../../services/kendaraanService";
import { PRESET_ASAL_KENDARAAN } from "../../utils/constants";

const BACKEND_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const getPhotoUrl = (foto) => {
    if (!foto) return "";
    if (foto.startsWith("http://") || foto.startsWith("https://") || foto.startsWith("data:")) {
        return foto;
    }
    return `${BACKEND_URL}${foto}`;
};

function Kendaraan() {

    const [kendaraan, setKendaraan] = useState([]);
    const [search, setSearch] = useState("");
    const [filterAsal, setFilterAsal] = useState("");
    const [loading, setLoading] = useState(false);

    // State modal tambah / edit
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // State modal detail
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);

    // Form state
    const [form, setForm] = useState({
        jenis_kendaraan: "",
        tipe: "",
        asal_kendaraan: "",
        jenis_roda: "",
        tahun_kendaraan: "",
        plat_merah: "",
        plat_hitam: "",
        nomor_rangka: "",
        nomor_mesin: "",
        foto: "",
        stnk_tahunan: "",
        stnk_lima_tahunan: ""
    });

    const [asalDropdown, setAsalDropdown] = useState("");
    const [customAsalInput, setCustomAsalInput] = useState("");

    const resetForm = () => {

        setForm({
            jenis_kendaraan: "",
            tipe: "",
            asal_kendaraan: "",
            jenis_roda: "",
            tahun_kendaraan: "",
            plat_merah: "",
            plat_hitam: "",
            nomor_rangka: "",
            nomor_mesin: "",
            foto: "",
            stnk_tahunan: "",
            stnk_lima_tahunan: ""
        });

        setAsalDropdown("");
        setCustomAsalInput("");
        setIsEdit(false);
        setEditId(null);

    };

    // ==================== LOAD DATA ====================

    const loadData = async () => {

        try {

            setLoading(true);

            const data = await kendaraanService.getAll();

            setKendaraan(data);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat data kendaraan");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    // ==================== FILTER / SEARCH ====================

    const filteredData = kendaraan.filter((item) => {
        const matchesSearch =
            item.jenis_kendaraan?.toLowerCase().includes(search.toLowerCase()) ||
            item.tipe?.toLowerCase().includes(search.toLowerCase()) ||
            item.plat_merah?.toLowerCase().includes(search.toLowerCase()) ||
            item.plat_hitam?.toLowerCase().includes(search.toLowerCase());

        const matchesAsal =
            filterAsal === "" || item.asal_kendaraan === filterAsal;

        return matchesSearch && matchesAsal;
    });

    // ==================== HANDLE FORM CHANGE ====================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({
                ...prev,
                foto: file
            }));
        }
    };

    const handleAsalDropdownChange = (e) => {
        const val = e.target.value;
        setAsalDropdown(val);

        if (val === "Lainnya") {
            setForm(prev => ({
                ...prev,
                asal_kendaraan: customAsalInput
            }));
        } else {
            setForm(prev => ({
                ...prev,
                asal_kendaraan: val
            }));
        }
    };

    const handleCustomAsalChange = (e) => {
        const val = e.target.value;
        setCustomAsalInput(val);
        setForm(prev => ({
            ...prev,
            asal_kendaraan: val
        }));
    };

    // ==================== OPEN MODAL TAMBAH ====================

    const handleOpenTambah = () => {

        resetForm();
        setShowModal(true);

    };

    // ==================== OPEN MODAL EDIT ====================

    const handleOpenEdit = async (id) => {

        try {

            const data = await kendaraanService.getById(id);

            const isPreset = PRESET_ASAL_KENDARAAN.includes(data.asal_kendaraan);

            setForm({
                jenis_kendaraan: data.jenis_kendaraan || "",
                tipe: data.tipe || "",
                asal_kendaraan: data.asal_kendaraan || "",
                jenis_roda: data.jenis_roda || "",
                tahun_kendaraan: data.tahun_kendaraan || "",
                plat_merah: data.plat_merah || "",
                plat_hitam: data.plat_hitam || "",
                nomor_rangka: data.nomor_rangka || "",
                nomor_mesin: data.nomor_mesin || "",
                foto: data.foto || "",
                stnk_tahunan: data.stnk_tahunan ? data.stnk_tahunan.split("T")[0] : "",
                stnk_lima_tahunan: data.stnk_lima_tahunan ? data.stnk_lima_tahunan.split("T")[0] : ""
            });

            if (data.asal_kendaraan) {
                if (isPreset) {
                    setAsalDropdown(data.asal_kendaraan);
                    setCustomAsalInput("");
                } else {
                    setAsalDropdown("Lainnya");
                    setCustomAsalInput(data.asal_kendaraan);
                }
            } else {
                setAsalDropdown("");
                setCustomAsalInput("");
            }

            setIsEdit(true);
            setEditId(id);
            setShowModal(true);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat data kendaraan");

        }

    };

    // ==================== HANDLE SUBMIT (CREATE / UPDATE) ====================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("jenis_kendaraan", form.jenis_kendaraan);
            formData.append("tipe", form.tipe);
            formData.append("asal_kendaraan", form.asal_kendaraan);
            formData.append("jenis_roda", form.jenis_roda);
            formData.append("tahun_kendaraan", form.tahun_kendaraan);
            formData.append("plat_merah", form.plat_merah);
            formData.append("plat_hitam", form.plat_hitam);
            formData.append("nomor_rangka", form.nomor_rangka);
            formData.append("nomor_mesin", form.nomor_mesin);
            formData.append("stnk_tahunan", form.stnk_tahunan || "");
            formData.append("stnk_lima_tahunan", form.stnk_lima_tahunan || "");
            
            if (form.foto instanceof File) {
                formData.append("foto", form.foto);
            } else {
                formData.append("foto", form.foto || "");
            }

            if (isEdit) {

                await kendaraanService.update(editId, formData);

                toast.success("Data kendaraan berhasil diupdate");

            } else {

                await kendaraanService.create(formData);

                toast.success("Data kendaraan berhasil ditambahkan");

            }

            setShowModal(false);

            resetForm();

            loadData();

        } catch (err) {

            console.log(err);

            const msg =
                err.response?.data?.message || "Gagal menyimpan data";

            toast.error(msg);

        }

    };

    // ==================== HANDLE DELETE ====================

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data kendaraan akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        });

        if (result.isConfirmed) {

            try {

                await kendaraanService.remove(id);

                toast.success("Data kendaraan berhasil dihapus");

                loadData();

            } catch (err) {

                console.log(err);

                toast.error("Gagal menghapus data kendaraan");

            }

        }

    };

    // ==================== HANDLE DETAIL ====================

    const handleDetail = async (id) => {

        try {

            const data = await kendaraanService.getById(id);

            setDetailData(data);
            setShowDetail(true);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat detail kendaraan");

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

    const getStnkBadge = (dateStr) => {
        if (!dateStr) {
            return (
                <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: "11px", fontWeight: "normal" }}>
                    Belum Diisi
                </span>
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

        const formatted = target.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        if (diffDays < 0) {
            return (
                <span
                    className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1 shadow-xs"
                    style={{ backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", fontSize: "11px" }}
                    title={`Kedaluwarsa ${Math.abs(diffDays)} hari yang lalu`}
                >
                    <FaExclamationTriangle size={10} />
                    <span>Lewat {Math.abs(diffDays)} hr</span>
                    <span className="opacity-75">({formatted})</span>
                </span>
            );
        } else if (diffDays <= 30) {
            return (
                <span
                    className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1 shadow-xs"
                    style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", fontSize: "11px" }}
                    title={`Jatuh tempo dalam ${diffDays} hari`}
                >
                    <FaClock size={10} />
                    <span>Sisa {diffDays} hr</span>
                    <span className="opacity-75">({formatted})</span>
                </span>
            );
        } else if (diffDays <= 365) {
            const months = Math.ceil(diffDays / 30);
            return (
                <span
                    className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1 shadow-xs"
                    style={{ backgroundColor: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe", fontSize: "11px" }}
                    title={`Jatuh tempo dalam ${diffDays} hari (sisa ~${months} bulan)`}
                >
                    <FaClock size={10} />
                    <span>Sisa {months} bln</span>
                    <span className="opacity-75">({formatted})</span>
                </span>
            );
        } else {
            return (
                <span
                    className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1 d-inline-flex align-items-center gap-1 shadow-xs"
                    title={`Masa berlaku aktif (${formatted})`}
                    style={{ fontSize: "11px" }}
                >
                    <FaCheckCircle size={10} />
                    <span>{formatted}</span>
                </span>
            );
        }
    };

    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Data Kendaraan
                    </h2>

                    <p className="text-muted mb-0">
                        Daftar Kendaraan Operasional
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleOpenTambah}
                >

                    + Tambah Kendaraan

                </button>

            </div>

            {/* Search */}

            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari jenis kendaraan, tipe, atau plat..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={filterAsal}
                                onChange={(e) => setFilterAsal(e.target.value)}
                            >
                                <option value="">Semua Asal Kendaraan</option>
                                {[...new Set(kendaraan.map(k => k.asal_kendaraan).filter(Boolean))].map(asal => (
                                    <option key={asal} value={asal}>{asal}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabel */}

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

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>

                                    <tr>

                                        <th width="50" className="text-center py-3">No</th>

                                        <th width="110" className="py-3">Jenis</th>

                                        <th className="py-3">Tipe Kendaraan</th>

                                        <th width="75" className="text-center py-3">Tahun</th>

                                        <th width="85" className="text-center py-3">Roda</th>

                                        <th width="130" className="text-center py-3">Plat Merah</th>

                                        <th width="130" className="text-center py-3">Plat Hitam</th>

                                        <th width="270" className="py-3">Masa Berlaku STNK</th>

                                        <th width="190" className="text-center py-3">Aksi</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredData.length > 0 ? (

                                        filteredData.map((item, index) => (

                                            <tr key={item.id} style={{ transition: "background-color 0.15s ease" }}>

                                                <td className="text-center text-muted fw-semibold">
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <span className="fw-medium text-dark">{item.jenis_kendaraan}</span>
                                                </td>

                                                <td>
                                                    <div className="fw-bold text-dark" style={{ letterSpacing: "-0.01em" }}>
                                                        {item.tipe}
                                                    </div>
                                                    <div className="small text-muted" style={{ fontSize: "11px" }}>
                                                        Asal: {item.asal_kendaraan || "-"}
                                                    </div>
                                                </td>

                                                <td className="text-center">
                                                    <span className="fw-semibold text-secondary">{item.tahun_kendaraan}</span>
                                                </td>

                                                <td className="text-center">
                                                    <span className="badge rounded-pill bg-light text-secondary border px-2 py-1 small">
                                                        {item.jenis_roda || "-"}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    <span
                                                        className="badge font-monospace fw-bold px-2 py-1 shadow-xs"
                                                        style={{
                                                            backgroundColor: "#fee2e2",
                                                            color: "#991b1b",
                                                            border: "1px solid #f87171",
                                                            fontSize: "12px",
                                                            letterSpacing: "0.5px"
                                                        }}
                                                    >
                                                        {item.plat_merah}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    {item.plat_hitam ? (
                                                        <span
                                                            className="badge font-monospace fw-bold px-2 py-1 shadow-xs"
                                                            style={{
                                                                backgroundColor: "#1e293b",
                                                                color: "#ffffff",
                                                                border: "1px solid #0f172a",
                                                                fontSize: "12px",
                                                                letterSpacing: "0.5px"
                                                            }}
                                                        >
                                                            {item.plat_hitam}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted small fst-italic">-</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="d-flex flex-column gap-1 py-1" style={{ minWidth: "250px" }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="badge bg-light text-secondary border text-nowrap" style={{ minWidth: "58px", fontSize: "10px" }}>
                                                                Tahunan
                                                            </span>
                                                            <div className="flex-grow-1 text-nowrap">
                                                                {getStnkBadge(item.stnk_tahunan)}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="badge bg-light text-secondary border text-nowrap" style={{ minWidth: "58px", fontSize: "10px" }}>
                                                                5 Tahun
                                                            </span>
                                                            <div className="flex-grow-1 text-nowrap">
                                                                {getStnkBadge(item.stnk_lima_tahunan)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-1 text-nowrap">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 px-2 py-1 shadow-xs"
                                                            onClick={() => handleDetail(item.id)}
                                                            title="Lihat Detail Kendaraan"
                                                        >
                                                            <FaEye size={11} />
                                                            <span>Detail</span>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1 px-2 py-1 shadow-xs"
                                                            onClick={() => handleOpenEdit(item.id)}
                                                            title="Edit Kendaraan"
                                                        >
                                                            <FaEdit size={11} />
                                                            <span>Edit</span>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 px-2 py-1 shadow-xs"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Hapus Kendaraan"
                                                        >
                                                            <FaTrash size={11} />
                                                            <span>Hapus</span>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                className="text-center py-4 text-muted"
                                            >
                                                Tidak ada data kendaraan.
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
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >

                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">

                                    {isEdit
                                        ? "Edit Kendaraan"
                                        : "Tambah Kendaraan"
                                    }

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

                                    <div className="row">

                                        {/* Jenis Kendaraan */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Jenis Kendaraan
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="jenis_kendaraan"
                                                value={form.jenis_kendaraan}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Tipe */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Tipe
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="tipe"
                                                value={form.tipe}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Asal Kendaraan */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Asal Kendaraan
                                            </label>

                                            <select
                                                className="form-select"
                                                value={asalDropdown}
                                                onChange={handleAsalDropdownChange}
                                                required
                                            >
                                                <option value="">-- Pilih Asal Kendaraan --</option>
                                                {PRESET_ASAL_KENDARAAN.map((asal) => (
                                                    <option key={asal} value={asal}>{asal}</option>
                                                ))}
                                                <option value="Lainnya">Lainnya</option>
                                            </select>

                                            {asalDropdown === "Lainnya" && (
                                                <input
                                                    type="text"
                                                    className="form-control mt-2"
                                                    placeholder="Ketik asal kendaraan..."
                                                    value={customAsalInput}
                                                    onChange={handleCustomAsalChange}
                                                    required
                                                />
                                            )}

                                        </div>

                                        {/* Tahun Kendaraan */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Tahun Kendaraan
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                name="tahun_kendaraan"
                                                value={form.tahun_kendaraan}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Jenis Roda */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Jenis Roda
                                            </label>

                                            <select
                                                className="form-select"
                                                name="jenis_roda"
                                                value={form.jenis_roda}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Pilih Jenis Roda --</option>
                                                <option value="Roda 2">Roda 2</option>
                                                <option value="Roda 3">Roda 3</option>
                                                <option value="Roda 4">Roda 4</option>
                                                <option value="Roda 6">Roda 6</option>
                                            </select>

                                        </div>

                                        {/* Plat Merah */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">
                                                Plat Merah <span className="text-danger">* (Wajib)</span>
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="plat_merah"
                                                value={form.plat_merah}
                                                onChange={handleChange}
                                                placeholder="Contoh: AB 1234 XY"
                                                required
                                            />

                                        </div>

                                        {/* Plat Hitam */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">
                                                Plat Hitam <span className="badge bg-secondary-subtle text-secondary small ms-1">Opsional</span>
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="plat_hitam"
                                                value={form.plat_hitam}
                                                onChange={handleChange}
                                                placeholder="Kosongkan jika tidak ada plat hitam"
                                            />
                                            <div className="form-text text-muted" style={{ fontSize: "11px" }}>
                                                Opsional: Khusus kendaraan dinas yang memiliki plat hitam ganda / rahasia.
                                            </div>

                                        </div>

                                        {/* Nomor Rangka */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Nomor Rangka
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nomor_rangka"
                                                value={form.nomor_rangka}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        {/* Nomor Mesin */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Nomor Mesin
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nomor_mesin"
                                                value={form.nomor_mesin}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        {/* Section Masa Berlaku Dokumen STNK */}
                                        <div className="col-12 mb-3">
                                            <div className="p-3 rounded-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <FaIdCard className="text-primary" />
                                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14px" }}>
                                                        Masa Berlaku Dokumen STNK
                                                    </h6>
                                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: "10px" }}>
                                                        Peringatan Otomatis
                                                    </span>
                                                </div>
                                                <p className="text-muted mb-3" style={{ fontSize: "12px" }}>
                                                    Sistem otomatis memicu peringatan di Dashboard jika masa berlaku tinggal ≤ 1 tahun atau mendekati jatuh tempo.
                                                </p>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-semibold text-dark" style={{ fontSize: "13px" }}>
                                                            Pajak 1 Tahunan (PKB)
                                                        </label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="stnk_tahunan"
                                                            value={form.stnk_tahunan}
                                                            onChange={handleChange}
                                                        />
                                                        <small className="text-muted" style={{ fontSize: "11px" }}>
                                                            Jatuh tempo pembayaran pajak tahunan
                                                        </small>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-semibold text-dark" style={{ fontSize: "13px" }}>
                                                            STNK 5 Tahunan (Ganti Plat)
                                                        </label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="stnk_lima_tahunan"
                                                            value={form.stnk_lima_tahunan}
                                                            onChange={handleChange}
                                                        />
                                                        <small className="text-muted" style={{ fontSize: "11px" }}>
                                                            Jatuh tempo pergantian plat nomor & STNK 5 tahunan
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Foto */}
                                        <div className="col-md-12 mb-3">

                                            <label className="form-label">
                                                Foto Kendaraan (JPG/PNG)
                                            </label>

                                            <input
                                                type="file"
                                                className="form-control"
                                                name="foto"
                                                accept="image/png, image/jpeg, image/jpg"
                                                onChange={handleFileChange}
                                            />

                                            {form.foto && (
                                                <div className="mt-2 border rounded p-2 bg-light d-inline-block">
                                                    <span className="small text-muted d-block mb-1">Preview Foto:</span>
                                                    <img
                                                        src={form.foto instanceof File ? URL.createObjectURL(form.foto) : getPhotoUrl(form.foto)}
                                                        alt="Preview Foto"
                                                        className="img-thumbnail"
                                                        style={{ maxHeight: "120px", objectFit: "cover" }}
                                                    />
                                                </div>
                                            )}

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

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >

                                        {isEdit ? "Update" : "Simpan"}

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
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >

                    <div className="modal-dialog modal-lg">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Detail Kendaraan
                                </h5>

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

                                <table className="table table-bordered">

                                    <tbody>

                                        <tr>
                                            <th width="200">Jenis Kendaraan</th>
                                            <td>{detailData.jenis_kendaraan}</td>
                                        </tr>

                                        <tr>
                                            <th>Tipe</th>
                                            <td>{detailData.tipe}</td>
                                        </tr>

                                        <tr>
                                            <th>Asal Kendaraan</th>
                                            <td>{detailData.asal_kendaraan}</td>
                                        </tr>

                                        <tr>
                                            <th>Tahun Kendaraan</th>
                                            <td>{detailData.tahun_kendaraan}</td>
                                        </tr>

                                        <tr>
                                            <th>Jenis Roda</th>
                                            <td>{detailData.jenis_roda || "-"}</td>
                                        </tr>

                                        <tr>
                                            <th>Plat Merah</th>
                                            <td>{detailData.plat_merah}</td>
                                        </tr>

                                        <tr>
                                            <th>Plat Hitam</th>
                                            <td>{detailData.plat_hitam ? detailData.plat_hitam : <span className="text-muted fst-italic">Tidak Ada (Hanya Plat Merah)</span>}</td>
                                        </tr>

                                        <tr>
                                            <th>Nomor Rangka</th>
                                            <td>{detailData.nomor_rangka || "-"}</td>
                                        </tr>

                                        <tr>
                                            <th>Nomor Mesin</th>
                                            <td>{detailData.nomor_mesin || "-"}</td>
                                        </tr>

                                        <tr>
                                            <th>Masa Berlaku Pajak 1 Tahun</th>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {getStnkBadge(detailData.stnk_tahunan)}
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Masa Berlaku STNK 5 Tahun</th>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {getStnkBadge(detailData.stnk_lima_tahunan)}
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Foto</th>
                                            <td>
                                                {detailData.foto ? (
                                                    <img
                                                        src={getPhotoUrl(detailData.foto)}
                                                        alt="Foto Kendaraan"
                                                        className="img-thumbnail rounded shadow-sm"
                                                        style={{ maxWidth: "240px", maxHeight: "180px", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Dibuat</th>
                                            <td>{formatTanggal(detailData.created_at)}</td>
                                        </tr>

                                        <tr>
                                            <th>Diupdate</th>
                                            <td>{formatTanggal(detailData.updated_at)}</td>
                                        </tr>

                                    </tbody>

                                </table>

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

export default Kendaraan;