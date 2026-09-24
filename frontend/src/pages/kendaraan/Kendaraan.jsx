import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
        foto: ""
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
            foto: ""
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
                foto: data.foto || ""
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

                            <table className="table table-hover align-middle">

                                <thead className="table-light">

                                    <tr>

                                        <th width="60">No</th>

                                        <th>Jenis Kendaraan</th>

                                        <th>Tipe</th>

                                        <th>Tahun</th>

                                        <th>Roda</th>

                                        <th>Plat Merah</th>

                                        <th>Plat Hitam</th>

                                        <th width="220">Aksi</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredData.length > 0 ? (

                                        filteredData.map((item, index) => (

                                            <tr key={item.id}>

                                                <td>

                                                    {index + 1}

                                                </td>

                                                <td>

                                                    {item.jenis_kendaraan}

                                                </td>

                                                <td>

                                                    {item.tipe}

                                                </td>

                                                <td>

                                                    {item.tahun_kendaraan}

                                                </td>

                                                <td>

                                                    <span className="badge bg-secondary">{item.jenis_roda || "-"}</span>

                                                </td>

                                                <td>

                                                    {item.plat_merah}

                                                </td>

                                                <td>

                                                    {item.plat_hitam}

                                                </td>

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

                                            <td
                                                colSpan="8"
                                                className="text-center py-4"
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

                                            <label className="form-label">
                                                Plat Merah
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="plat_merah"
                                                value={form.plat_merah}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Plat Hitam */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Plat Hitam
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="plat_hitam"
                                                value={form.plat_hitam}
                                                onChange={handleChange}
                                            />

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
                                            <td>{detailData.plat_hitam || "-"}</td>
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