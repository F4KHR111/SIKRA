import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import userService from "../../services/userService";
import roleService from "../../services/roleService";

function User() {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // State modal tambah / edit
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // State modal detail
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);

    // State modal ganti password
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordUserId, setPasswordUserId] = useState(null);
    const [passwordUserName, setPasswordUserName] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Form state
    const [form, setForm] = useState({
        role_id: "",
        nama: "",
        email: "",
        password: "",
        no_hp: ""
    });

    const resetForm = () => {

        setForm({
            role_id: "",
            nama: "",
            email: "",
            password: "",
            no_hp: ""
        });

        setIsEdit(false);
        setEditId(null);

    };

    // ==================== LOAD DATA ====================

    const loadData = async () => {

        try {

            setLoading(true);

            const data = await userService.getAll();

            setUsers(data);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat data user");

        } finally {

            setLoading(false);

        }

    };

    const loadRoles = async () => {

        try {

            const data = await roleService.getAll();

            setRoles(data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadData();
        loadRoles();

    }, []);

    // ==================== FILTER / SEARCH ====================

    const filteredData = users.filter((item) => {

        return (

            item.nama
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            item.email
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            item.nama_role
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            item.no_hp
                ?.toLowerCase()
                .includes(search.toLowerCase())

        );

    });

    // ==================== HANDLE FORM CHANGE ====================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };

    // ==================== OPEN MODAL TAMBAH ====================

    const handleOpenTambah = () => {

        resetForm();
        setShowModal(true);

    };

    // ==================== OPEN MODAL EDIT ====================

    const handleOpenEdit = async (id) => {

        try {

            const data = await userService.getById(id);

            setForm({
                role_id: data.role_id || "",
                nama: data.nama || "",
                email: data.email || "",
                password: "",
                no_hp: data.no_hp || ""
            });

            setIsEdit(true);
            setEditId(id);
            setShowModal(true);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat data user");

        }

    };

    // ==================== HANDLE SUBMIT (CREATE / UPDATE) ====================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (isEdit) {

                // Saat edit, kirim tanpa password
                const { password, ...dataUpdate } = form;

                await userService.update(editId, dataUpdate);

                toast.success("Data user berhasil diupdate");

            } else {

                await userService.create(form);

                toast.success("Data user berhasil ditambahkan");

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
            text: "Data user akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        });

        if (result.isConfirmed) {

            try {

                await userService.remove(id);

                toast.success("Data user berhasil dihapus");

                loadData();

            } catch (err) {

                console.log(err);

                toast.error("Gagal menghapus data user");

            }

        }

    };

    // ==================== HANDLE DETAIL ====================

    const handleDetail = async (id) => {

        try {

            const data = await userService.getById(id);

            setDetailData(data);
            setShowDetail(true);

        } catch (err) {

            console.log(err);

            toast.error("Gagal memuat detail user");

        }

    };

    // ==================== HANDLE GANTI PASSWORD ====================

    const handleOpenPassword = (id, nama) => {

        setPasswordUserId(id);
        setPasswordUserName(nama);
        setNewPassword("");
        setShowPasswordModal(true);

    };

    const handleSubmitPassword = async (e) => {

        e.preventDefault();

        try {

            await userService.changePassword(passwordUserId, newPassword);

            toast.success("Password berhasil diubah");

            setShowPasswordModal(false);
            setNewPassword("");

        } catch (err) {

            console.log(err);

            const msg =
                err.response?.data?.message || "Gagal mengubah password";

            toast.error(msg);

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
                        Data User
                    </h2>

                    <p className="text-muted mb-0">
                        Kelola Pengguna Sistem
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleOpenTambah}
                >

                    + Tambah User

                </button>

            </div>

            {/* Search */}

            <div className="card border-0 shadow-sm mb-3">

                <div className="card-body">

                    <input

                        type="text"

                        className="form-control"

                        placeholder="Cari nama, email, role, atau no. HP..."

                        value={search}

                        onChange={(e) => setSearch(e.target.value)}

                    />

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

                                        <th>Nama</th>

                                        <th>Email</th>

                                        <th>No. HP</th>

                                        <th>Role</th>

                                        <th width="300">Aksi</th>

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

                                                    {item.nama}

                                                </td>

                                                <td>

                                                    {item.email}

                                                </td>

                                                <td>

                                                    {item.no_hp || "-"}

                                                </td>

                                                <td>

                                                    <span className="badge bg-primary">
                                                        {item.nama_role}
                                                    </span>

                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-info btn-sm me-1 text-white"
                                                        onClick={() => handleDetail(item.id)}
                                                    >

                                                        Detail

                                                    </button>

                                                    <button
                                                        className="btn btn-warning btn-sm me-1"
                                                        onClick={() => handleOpenEdit(item.id)}
                                                    >

                                                        Edit

                                                    </button>

                                                    <button
                                                        className="btn btn-secondary btn-sm me-1"
                                                        onClick={() => handleOpenPassword(item.id, item.nama)}
                                                    >

                                                        Password

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
                                                colSpan="7"
                                                className="text-center py-4"
                                            >

                                                Tidak ada data user.

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
                                        ? "Edit User"
                                        : "Tambah User"
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

                                        {/* Nama */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Nama
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nama"
                                                value={form.nama}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Email
                                            </label>

                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                        {/* Password (hanya saat tambah) */}
                                        {!isEdit && (

                                            <div className="col-md-6 mb-3">

                                                <label className="form-label">
                                                    Password
                                                </label>

                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    required
                                                />

                                            </div>

                                        )}

                                        {/* No. HP */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                No. HP
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                name="no_hp"
                                                value={form.no_hp}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        {/* Role */}
                                        <div className="col-md-6 mb-3">

                                            <label className="form-label">
                                                Role
                                            </label>

                                            <select
                                                className="form-select"
                                                name="role_id"
                                                value={form.role_id}
                                                onChange={handleChange}
                                                required
                                            >

                                                <option value="">
                                                    -- Pilih Role --
                                                </option>

                                                {roles.map((role) => (

                                                    <option
                                                        key={role.id}
                                                        value={role.id}
                                                    >

                                                        {role.nama_role}

                                                    </option>

                                                ))}

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
                                    Detail User
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
                                            <th width="200">Nama</th>
                                            <td>{detailData.nama}</td>
                                        </tr>

                                        <tr>
                                            <th>Email</th>
                                            <td>{detailData.email}</td>
                                        </tr>

                                        <tr>
                                            <th>No. HP</th>
                                            <td>{detailData.no_hp || "-"}</td>
                                        </tr>

                                        <tr>
                                            <th>Role</th>
                                            <td>
                                                <span className="badge bg-primary">
                                                    {detailData.nama_role}
                                                </span>
                                            </td>
                                        </tr>

                                        <tr>
                                        </tr>

                                        <tr>
                                            <th>Dibuat</th>
                                            <td>{formatTanggal(detailData.created_at)}</td>
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

            {/* ==================== MODAL GANTI PASSWORD ==================== */}

            {showPasswordModal && (

                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Ganti Password
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setNewPassword("");
                                    }}
                                ></button>

                            </div>

                            <form onSubmit={handleSubmitPassword}>

                                <div className="modal-body">

                                    <p className="text-muted mb-3">
                                        Ganti password untuk user: <strong>{passwordUserName}</strong>
                                    </p>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Password Baru
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setNewPassword("");
                                        }}
                                    >

                                        Batal

                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >

                                        Simpan Password

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

export default User;
