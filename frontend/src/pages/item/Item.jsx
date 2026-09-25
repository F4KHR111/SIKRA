import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
    FaPlus,
    FaFolder,
    FaLayerGroup,
    FaChevronDown,
    FaChevronUp,
    FaEdit,
    FaTrash,
    FaSearch,
    FaCheckCircle,
    FaEye,
    FaEyeSlash,
    FaClipboardList
} from "react-icons/fa";
import itemService from "../../services/itemService";
import kategoriService from "../../services/kategoriService";

function Item() {
    const [items, setItems] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [search, setSearch] = useState("");
    const [filterKategori, setFilterKategori] = useState("");
    const [loading, setLoading] = useState(false);

    // State accordion buka / tutup per kategori ID
    const [expandedCategories, setExpandedCategories] = useState({});

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
            const data = await itemService.getAll();
            setItems(data || []);
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat data item pemeriksaan");
        } finally {
            setLoading(false);
        }
    };

    const loadKategoris = async () => {
        try {
            const data = await kategoriService.getAll();
            setKategoris(data || []);

            // Inisialisasi: semua kategori terbuka secara default
            const initialExpanded = {};
            (data || []).forEach((k) => {
                initialExpanded[k.id] = true;
            });
            initialExpanded["unassigned"] = true;
            setExpandedCategories(initialExpanded);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadItems();
        loadKategoris();
    }, []);

    // ==================== TOGGLE ACCORDION ====================

    const toggleCategory = (catId) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    const handleExpandAll = () => {
        const allOpen = {};
        kategoris.forEach((k) => {
            allOpen[k.id] = true;
        });
        allOpen["unassigned"] = true;
        setExpandedCategories(allOpen);
    };

    const handleCollapseAll = () => {
        setExpandedCategories({});
    };

    // ==================== FILTER / SEARCH & GROUPING ====================

    const filteredData = useMemo(() => {
        const q = search.toLowerCase().trim();
        return items.filter((item) => {
            const cocokSearch =
                !q ||
                item.nama_item?.toLowerCase().includes(q) ||
                item.nama_kategori?.toLowerCase().includes(q);

            const cocokKategori =
                filterKategori === "" ||
                String(item.kategori_id) === String(filterKategori);

            return cocokSearch && cocokKategori;
        });
    }, [items, search, filterKategori]);

    // Grouping berdasarkan kategori
    const groupedCategories = useMemo(() => {
        const groups = kategoris.map((kat) => {
            const catItems = filteredData
                .filter((item) => String(item.kategori_id) === String(kat.id))
                .sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

            const totalAllInCat = items.filter(
                (item) => String(item.kategori_id) === String(kat.id)
            ).length;

            const wajibGantiCount = catItems.filter(
                (item) => item.is_tahun_ganti === 1
            ).length;

            return {
                ...kat,
                items: catItems,
                totalAllInCat,
                wajibGantiCount
            };
        });

        // Cek jika ada item yang kategorinya tidak terdaftar
        const assignedIds = new Set(kategoris.map((k) => String(k.id)));
        const unassignedItems = filteredData.filter(
            (item) => !assignedIds.has(String(item.kategori_id))
        );

        if (unassignedItems.length > 0) {
            groups.push({
                id: "unassigned",
                nama_kategori: "Lainnya / Tanpa Kategori",
                urutan: 9999,
                items: unassignedItems,
                totalAllInCat: items.filter(
                    (item) => !assignedIds.has(String(item.kategori_id))
                ).length,
                wajibGantiCount: unassignedItems.filter(
                    (item) => item.is_tahun_ganti === 1
                ).length
            });
        }

        // Jika filter kategori aktif dari dropdown
        if (filterKategori !== "") {
            return groups.filter((g) => String(g.id) === String(filterKategori));
        }

        // Jika user sedang mencari teks, hanya tampilkan kategori yang memiliki item cocok
        if (search.trim() !== "") {
            return groups.filter((g) => g.items.length > 0);
        }

        return groups;
    }, [kategoris, filteredData, items, filterKategori, search]);

    // ==================== FORM & MODAL ACTIONS ====================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]:
                name === "is_tahun_ganti" || name === "kategori_id" || name === "urutan"
                    ? parseInt(value) || ""
                    : value
        });
    };

    const handleOpenTambah = (kategoriId = "") => {
        resetForm();

        // Hitung urutan berikutnya berdasarkan kategori yang dipilih atau total item
        const relevantItems = kategoriId
            ? items.filter((i) => String(i.kategori_id) === String(kategoriId))
            : items;

        const maxUrutan =
            relevantItems.length > 0
                ? Math.max(...relevantItems.map((i) => i.urutan || 0)) + 1
                : 1;

        setForm({
            nama_item: "",
            kategori_id: kategoriId || "",
            urutan: maxUrutan,
            is_tahun_ganti: 0
        });

        setShowModal(true);
    };

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
            console.error(err);
            toast.error("Gagal memuat detail item");
        }
    };

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
            console.error(err);
            const msg = err.response?.data?.message || "Gagal menyimpan data";
            toast.error(msg);
        }
    };

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
                console.error(err);
                const msg = err.response?.data?.message || "Gagal menghapus data";
                toast.error(msg);
            }
        }
    };

    // Total counts
    const totalVisibleItems = filteredData.length;
    const totalCategories = groupedCategories.length;

    return (
        <div className="container-fluid pb-5">
            {/* Header Page */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <FaClipboardList className="text-primary" />
                        Komponen Item Pemeriksaan
                    </h2>
                    <p className="text-muted mb-0">
                        Kelola item-item yang diperiksa pada inspeksi kendaraan, dikelompokkan berdasarkan kategori
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={handleExpandAll}
                        title="Buka semua kategori"
                    >
                        <FaEye size={13} />
                        <span className="d-none d-sm-inline">Buka Semua</span>
                    </button>

                    <button
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={handleCollapseAll}
                        title="Tutup semua kategori"
                    >
                        <FaEyeSlash size={13} />
                        <span className="d-none d-sm-inline">Tutup Semua</span>
                    </button>

                    <button
                        className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                        onClick={() => handleOpenTambah("")}
                    >
                        <FaPlus size={13} />
                        <span>Tambah Item</span>
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="card border-0 shadow-sm mb-4 rounded-3">
                <div className="card-body p-3">
                    <div className="row g-2 align-items-center">
                        <div className="col-md-7">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <FaSearch size={14} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Cari nama komponen pemeriksaan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        className="btn btn-outline-secondary border-start-0"
                                        type="button"
                                        onClick={() => setSearch("")}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="col-md-5">
                            <select
                                className="form-select"
                                value={filterKategori}
                                onChange={(e) => setFilterKategori(e.target.value)}
                            >
                                <option value="">Semua Kategori ({kategoris.length})</option>
                                {kategoris.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.nama_kategori}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Info bar */}
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small text-muted">
                        <div>
                            Menampilkan <strong>{totalCategories}</strong> Kategori (Total: <strong>{totalVisibleItems}</strong> Komponen)
                        </div>
                        {search && (
                            <span className="badge bg-primary-subtle text-primary">
                                Hasil pencarian: "{search}"
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* List of Category Cards */}
            {loading ? (
                <div className="card border-0 shadow-sm text-center py-5">
                    <div className="spinner-border text-primary mx-auto mb-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-muted">Memuat data komponen pemeriksaan...</span>
                </div>
            ) : groupedCategories.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                    {groupedCategories.map((group) => {
                        // Jika sedang mencari, auto-expand agar hasil pencarian langsung terlihat
                        const isExpanded =
                            search.trim() !== "" || !!expandedCategories[group.id];

                        return (
                            <div
                                key={group.id}
                                className="card border-0 shadow-sm rounded-3 overflow-hidden"
                                style={{ transition: "all 0.2s ease" }}
                            >
                                {/* Card Header / Dropdown Trigger */}
                                <div
                                    className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center user-select-none"
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: isExpanded ? "#ffffff" : "#fcfdfe",
                                        borderBottom: isExpanded ? "1px solid #edf2f7" : "none"
                                    }}
                                    onClick={() => toggleCategory(group.id)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-3 shadow-xs"
                                            style={{
                                                width: "44px",
                                                height: "44px",
                                                backgroundColor: isExpanded ? "rgba(30, 64, 175, 0.08)" : "rgba(100, 116, 139, 0.08)",
                                                color: isExpanded ? "var(--corporate-blue, #1e40af)" : "#64748b",
                                                fontSize: "1.2rem",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            {isExpanded ? <FaFolder /> : <FaLayerGroup />}
                                        </div>

                                        <div>
                                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                <h5
                                                    className="mb-0 fw-bold text-dark"
                                                    style={{ letterSpacing: "-0.01em" }}
                                                >
                                                    {group.nama_kategori}
                                                </h5>

                                                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small fw-semibold">
                                                    {group.items.length} Komponen
                                                </span>

                                                {group.wajibGantiCount > 0 && (
                                                    <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 small fw-semibold">
                                                        {group.wajibGantiCount} Wajib Tahun Ganti
                                                    </span>
                                                )}
                                            </div>

                                            <div className="small text-muted d-flex align-items-center gap-2">
                                                <span>Urutan Kategori: #{group.urutan || "-"}</span>
                                                <span>•</span>
                                                <span className="text-primary-emphasis">
                                                    {isExpanded ? "Klik untuk menutup list item" : "Klik dropdown untuk melihat detail item"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons in Header */}
                                    <div
                                        className="d-flex align-items-center gap-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 shadow-xs"
                                            onClick={() =>
                                                handleOpenTambah(
                                                    group.id === "unassigned" ? "" : group.id
                                                )
                                            }
                                            title="Tambah komponen ke kategori ini"
                                        >
                                            <FaPlus size={11} />
                                            <span className="d-none d-sm-inline">Tambah Item</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light border d-flex align-items-center justify-content-center shadow-xs"
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "8px"
                                            }}
                                            onClick={() => toggleCategory(group.id)}
                                            aria-label={isExpanded ? "Tutup detail" : "Buka detail"}
                                        >
                                            {isExpanded ? (
                                                <FaChevronUp className="text-primary" size={13} />
                                            ) : (
                                                <FaChevronDown className="text-muted" size={13} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Collapsible Card Body (Dropdown content) */}
                                {isExpanded && (
                                    <div className="card-body p-0">
                                        {group.items.length > 0 ? (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead
                                                        className="table-light"
                                                        style={{
                                                            fontSize: "0.8rem",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.03em"
                                                        }}
                                                    >
                                                        <tr>
                                                            <th width="65" className="text-center py-3">
                                                                No
                                                            </th>
                                                            <th className="py-3">
                                                                Nama Item Komponen
                                                            </th>
                                                            <th width="110" className="text-center py-3">
                                                                Urutan
                                                            </th>
                                                            <th width="180" className="text-center py-3">
                                                                Wajib Tahun Ganti
                                                            </th>
                                                            <th width="160" className="text-center py-3">
                                                                Aksi
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {group.items.map((item, idx) => (
                                                            <tr key={item.id}>
                                                                <td className="text-center text-muted fw-medium">
                                                                    {idx + 1}
                                                                </td>
                                                                <td>
                                                                    <div className="fw-semibold text-dark">
                                                                        {item.nama_item}
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span className="badge bg-light text-secondary border px-2 py-1">
                                                                        #{item.urutan}
                                                                    </span>
                                                                </td>
                                                                <td className="text-center">
                                                                    {item.is_tahun_ganti === 1 ? (
                                                                        <span className="badge rounded-pill bg-info-subtle text-info-emphasis border border-info-subtle px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                                                                            <FaCheckCircle size={11} /> Wajib
                                                                        </span>
                                                                    ) : (
                                                                        <span className="badge rounded-pill bg-light text-muted border px-3 py-1">
                                                                            Tidak
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="d-flex justify-content-center gap-1">
                                                                        <button
                                                                            className="btn btn-warning btn-sm d-inline-flex align-items-center gap-1 px-2 py-1"
                                                                            onClick={() => handleOpenEdit(item.id)}
                                                                            title="Edit item"
                                                                        >
                                                                            <FaEdit size={12} />
                                                                            <span>Edit</span>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-danger btn-sm d-inline-flex align-items-center gap-1 px-2 py-1"
                                                                            onClick={() => handleDelete(item.id)}
                                                                            title="Hapus item"
                                                                        >
                                                                            <FaTrash size={12} />
                                                                            <span>Hapus</span>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 px-3 bg-light-subtle">
                                                <p className="text-muted mb-2 small">
                                                    Belum ada item komponen di kategori ini.
                                                </p>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        handleOpenTambah(
                                                            group.id === "unassigned" ? "" : group.id
                                                        )
                                                    }
                                                >
                                                    <FaPlus size={11} className="me-1" /> Tambah Item ke Kategori Ini
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="card border-0 shadow-sm text-center py-5">
                    <p className="text-muted mb-0">
                        {search
                            ? `Tidak ada komponen item yang cocok dengan "${search}".`
                            : "Belum ada data komponen item."}
                    </p>
                </div>
            )}

            {/* ==================== MODAL TAMBAH / EDIT ==================== */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-3">
                            <div className="modal-header border-bottom">
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
                                <div className="modal-body p-4">
                                    {/* Nama Item */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Nama Item Komponen <span className="text-danger">*</span>
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
                                            Kategori Pemeriksaan <span className="text-danger">*</span>
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
                                                Urutan Tampil <span className="text-danger">*</span>
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
                                                Wajib Tahun Ganti? <span className="text-danger">*</span>
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

                                <div className="modal-footer border-top bg-light-subtle">
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
                                    <button type="submit" className="btn btn-primary px-4">
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
