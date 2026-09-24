import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import itemService from "../../services/itemService";
import kategoriService from "../../services/kategoriService";

function Item() {

    const [items, setItems] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [search, setSearch] = useState("");
    const [filterKategori, setFilterKategori] = useState("");
    const [loading, setLoading] = useState(false);

    // State modal tambah / edit
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form state
    const [form, setForm] = useState({
        nama_item: "",
        kategori_id: "",
        urutan: "",
        is_tahun_ganti: 0
    });

    const resetForm = () => {

        setForm({
            nama_item: "",
            kategori_id: "",
            urutan: "",
            is_tahun_ganti: 0
        });

        setIsEdit(false);
        setEditId(null);

    };

    // ==================== LOAD DATA ====================

    const loadItems = async () => {

        try {

            setLoading(true);

            // Karena endpoint '/item' (getAll) sudah diperbaiki di backend, kita bisa memakainya langsung
            const data = await itemService.getAll();

            setItems(data);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat data item pemeriksaan");

        } finally {

            setLoading(false);

        }

    };

    const loadKategoris = async () => {

        try {

            const data = await kategoriService.getAll();

            setKategoris(data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadItems();
        loadKategoris();

    }, []);

    // ==================== FILTER / SEARCH ====================

    const filteredData = items.filter((item) => {

        const q = search.toLowerCase();

        const cocokSearch =
            item.nama_item?.toLowerCase().includes(q) ||
            item.nama_kategori?.toLowerCase().includes(q);

        const cocokKategori =
            filterKategori === "" ||
            String(item.kategori_id) === String(filterKategori);

        return cocokSearch && cocokKategori;

    });

    // ==================== HANDLE FORM CHANGE ====================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "is_tahun_ganti" || name === "kategori_id" || name === "urutan"
                ? parseInt(value)
                : value
        });

    };

    // ==================== OPEN MODAL TAMBAH ====================

    const handleOpenTambah = () => {

        resetForm();

        // Cari urutan terbesar otomatis untuk memudahkan
        const maxUrutan = items.length > 0
            ? Math.max(...items.map(i => i.urutan || 0)) + 1
            : 1;

        setForm(prev => ({
            ...prev,
            urutan: maxUrutan
        }));

        setShowModal(true);

    };

    // ==================== OPEN MODAL EDIT ====================

    const handleOpenEdit = async (id) => {

        try {

            const data = await itemService.getById(id);

            setForm({
                nama_item: data.nama_item || "",
                kategori_id: data.kategori_id || "",
                urutan: data.urutan || 1,
                is_tahun_ganti: data.is_tahun_ganti || 0
            });

            setIsEdit(true);
            setEditId(id);
            setShowModal(true);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat detail item");

        }

    };

    // ==================== HANDLE SUBMIT (CREATE / UPDATE) ====================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (isEdit) {

                await itemService.update(editId, form);

                toast.success("Item pemeriksaan berhasil diperbarui");

            } else {

                await itemService.create(form);

                toast.success("Item pemeriksaan berhasil ditambahkan");

            }

            setShowModal(false);

            resetForm();

            loadItems();

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
            text: "Item pemeriksaan ini akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        });

        if (result.isConfirmed) {

            try {

                await itemService.remove(id);

                toast.success("Item pemeriksaan berhasil dihapus");

                loadItems();

            } catch (err) {

                console.log(err);

                const msg =
                    err.response?.data?.message || "Gagal menghapus data";

                toast.error(msg);

            }

        }

    };

    return (

        <div className="container-fluid">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Komponen Item Pemeriksaan
                    </h2>

                    <p className="text-muted mb-0">
                        Kelola item-item yang akan dicek pada inspeksi kendaraan
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleOpenTambah}
                >

                    + Tambah Item

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
                                placeholder="Cari nama komponen..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                        <div className="col-md-4">

                            <select
                                className="form-select"
                                value={filterKategori}
                                onChange={(e) => setFilterKategori(e.target.value)}
                            >

                                <option value="">Semua Kategori</option>

                                {kategoris.map((k) => (

                                    <option key={k.id} value={k.id}>
                                        {k.nama_kategori}
                                    </option>

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

                                        <th>Nama Item Komponen</th>

                                        <th>Kategori</th>

                                        <th width="100">Urutan</th>

                                        <th width="180">Wajib Tahun Ganti</th>

                                        <th width="180">Aksi</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredData.length > 0 ? (

                                        filteredData.map((item, index) => (

                                            <tr key={item.id}>

                                                <td>

                                                    {index + 1}

                                                </td>

                                                <td className="fw-semibold">

                                                    {item.nama_item}

                                                </td>

                                                <td>

                                                    <span className="badge bg-secondary text-uppercase">
                                                        {item.nama_kategori}
                                                    </span>

                                                </td>

                                                <td>

                                                    {item.urutan}

                                                </td>

                                                <td>

                                                    {item.is_tahun_ganti === 1 ? (

                                                        <span className="badge bg-info">Wajib</span>

                                                    ) : (

                                                        <span className="badge bg-light text-muted">Tidak</span>

                                                    )}

                                                </td>

                                                <td>

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
                                                colSpan="6"
                                                className="text-center py-4 text-muted"
                                            >

                                                Tidak ada data komponen item.

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

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title fw-bold">

                                    {isEdit ? "Edit Komponen Item" : "Tambah Komponen Item"}

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

                                    {/* Nama Item */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Nama Item Komponen
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nama_item"
                                            value={form.nama_item}
                                            onChange={handleChange}
                                            required
                                            placeholder="Contoh: Oli Mesin, Kampas Rem"
                                        />

                                    </div>

                                    {/* Kategori */}
                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Kategori Pemeriksaan
                                        </label>

                                        <select
                                            className="form-select"
                                            name="kategori_id"
                                            value={form.kategori_id}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">-- Pilih Kategori --</option>

                                            {kategoris.map((k) => (

                                                <option key={k.id} value={k.id}>
                                                    {k.nama_kategori}
                                                </option>

                                            ))}

                                        </select>

                                    </div>

                                    {/* Urutan & Wajib Tahun Ganti */}
                                    <div className="row">

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">
                                                Urutan Tampil
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                name="urutan"
                                                value={form.urutan}
                                                onChange={handleChange}
                                                required
                                                min="1"
                                            />

                                        </div>

                                        <div className="col-md-6 mb-3">

                                            <label className="form-label fw-semibold">
                                                Wajib Tahun Ganti?
                                            </label>

                                            <select
                                                className="form-select"
                                                name="is_tahun_ganti"
                                                value={form.is_tahun_ganti}
                                                onChange={handleChange}
                                                required
                                            >

                                                <option value={0}>Tidak Wajib</option>
                                                <option value={1}>Wajib</option>

                                            </select>

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

        </div>

    );

}

export default Item;
