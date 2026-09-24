import { useState } from "react";
import {
    Outlet,
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";
import Swal from "sweetalert2";

import {
    FaHome,
    FaCar,
    FaUsers,
    FaClipboardCheck,
    FaFileAlt,
    FaSignOutAlt,
    FaTools,
    FaShieldAlt,
    FaCalendarAlt,
    FaBars,
    FaTimes
} from "react-icons/fa";

function MainLayout() {

    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Ambil data user dari localStorage
    const getUserData = () => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) {
                return JSON.parse(userData);
            }
        } catch (err) {
            console.log(err);
        }
        return null;
    };

    // Decode JWT untuk ambil role
    const getRoleFromToken = () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(
                    atob(token.split(".")[1])
                );
                return payload.role || "";
            }
        } catch (err) {
            console.log(err);
        }
        return "";
    };

    const user = getUserData();
    const role = getRoleFromToken();

    // Judul & subjudul dinamis berdasarkan rute
    const getPageMeta = () => {
        const path = location.pathname;
        if (path === "/dashboard") return { title: "Dashboard Eksekutif", subtitle: "Monitoring data operasional dan performa armada dinas secara terpusat" };
        if (path === "/kendaraan") return { title: "Data Armada Kendaraan", subtitle: "Daftar inventaris dan status kelayakan operasional armada dinas" };
        if (path === "/user") return { title: "Manajemen Pengguna", subtitle: "Kelola akun inspektor lapangan, pimpinan, dan administrator sistem" };
        if (path === "/item") return { title: "Komponen & Parameter Item", subtitle: "Standarisasi daftar item pengecekan fisik dan mekanikal kendaraan" };
        if (path === "/pemeriksaan") return { title: "Pemeriksaan Kendaraan", subtitle: "Formulir pencatatan dan riwayat sesi inspeksi berkala" };
        if (path === "/laporan") return { title: "Laporan & Rekapitulasi", subtitle: "Pusat analisa data kelayakan, ringkasan status, dan cetak dokumen resmi" };

        return { title: "Sistem Inspeksi Kendaraan", subtitle: "Portal Manajemen Operasional Armada Kendaraan" };
    };

    const pageMeta = getPageMeta();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Konfirmasi Logout",
            text: "Apakah Anda yakin ingin keluar dari sistem?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#1e3a8a",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Keluar",
            cancelButtonText: "Batal"
        });

        if (result.isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
        }
    };

    // Format tanggal hari ini
    const todayFormatted = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const getUserInitial = (nama) => {
        if (!nama) return "U";
        return nama.charAt(0).toUpperCase();
    };

    const navLinks = [
        { path: "/dashboard", label: "Dashboard", icon: <FaHome size={15} />, adminOnly: false },
        { path: "/kendaraan", label: "Data Kendaraan", icon: <FaCar size={15} />, adminOnly: false },
        { path: "/pemeriksaan", label: "Pemeriksaan", icon: <FaClipboardCheck size={15} />, adminOnly: false },
        { path: "/laporan", label: "Laporan Rekap", icon: <FaFileAlt size={15} />, adminOnly: false },
        { path: "/user", label: "Manajemen User", icon: <FaUsers size={15} />, adminOnly: true },
        { path: "/item", label: "Komponen Item", icon: <FaTools size={15} />, adminOnly: true }
    ];

    const visibleNavLinks = navLinks.filter(item => !item.adminOnly || role === "Admin");

    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>

            {/* 1. TOP HEADER KORPORAT (Brand & Identity Bar) */}
            <header className="corporate-top-header">
                <div className="container-fluid px-3 px-lg-5">
                    <div className="d-flex align-items-center justify-content-between">

                        {/* Brand Logo & Title */}
                        <Link to="/dashboard" className="d-flex align-items-center gap-3 text-decoration-none">
                            <div className="corporate-logo-icon">
                                <FaShieldAlt />
                            </div>
                            <div>
                                <div className="fw-bold text-white" style={{ fontSize: "17px", letterSpacing: "-0.02em", lineHeight: "1.2" }}>
                                    SIK KENDARAAN
                                </div>
                                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500", letterSpacing: "0.02em" }}>
                                    Sistem Inspeksi Kendaraan Operasional
                                </div>
                            </div>
                        </Link>

                        {/* Right Utilities: Status, Date, User Info, Logout */}
                        <div className="d-flex align-items-center gap-3">

                            {/* Tanggal & Hari */}
                            <div className="d-none d-md-flex align-items-center gap-2 text-light pe-3 border-end border-secondary border-opacity-50">
                                <FaCalendarAlt size={13} className="text-primary opacity-75" />
                                <span style={{ fontSize: "12px", fontWeight: "500" }}>{todayFormatted}</span>
                            </div>

                            {/* Status Mode Badge */}
                            <div className="d-none d-sm-inline-flex">
                                <span className="system-status-indicator" style={{ fontSize: "11px", padding: "3px 10px" }}>
                                    <span className="system-status-dot"></span>
                                    Sistem Online
                                </span>
                            </div>

                            {/* User Profile Info */}
                            <div className="d-flex align-items-center gap-2 ps-2">
                                <div className="topbar-avatar" style={{ width: "34px", height: "34px", fontSize: "13px" }}>
                                    {getUserInitial(user?.nama)}
                                </div>
                                <div className="d-none d-lg-block text-start">
                                    <div className="fw-bold text-white" style={{ fontSize: "13px", lineHeight: "1.2" }}>
                                        {user?.nama || "Petugas"}
                                    </div>
                                    <span
                                        className="badge"
                                        style={{
                                            fontSize: "9px",
                                            padding: "2px 6px",
                                            backgroundColor: role === "Admin" ? "rgba(37, 99, 235, 0.3)" : "rgba(255, 255, 255, 0.15)",
                                            color: role === "Admin" ? "#93c5fd" : "#e2e8f0",
                                            border: "1px solid rgba(255, 255, 255, 0.1)"
                                        }}
                                    >
                                        {role || "Staff"}
                                    </span>
                                </div>
                            </div>

                            {/* Tombol Logout */}
                            <button
                                className="btn btn-outline-danger btn-sm px-3"
                                onClick={handleLogout}
                                title="Keluar dari Sistem"
                                style={{ fontSize: "12px" }}
                            >
                                <FaSignOutAlt className="me-1" size={12} />
                                <span className="d-none d-sm-inline">Logout</span>
                            </button>

                            {/* Mobile Menu Toggle Button */}
                            <button
                                className="btn btn-outline-secondary d-md-none text-white border-secondary p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle navigation"
                            >
                                {mobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                            </button>

                        </div>

                    </div>
                </div>
            </header>

            {/* 2. HORIZONTAL NAVIGATION BAR (Sticky Navbar) */}
            <nav className="corporate-nav-bar">
                <div className="container-fluid px-3 px-lg-5">
                    <div className="d-none d-md-flex align-items-center gap-1">
                        {visibleNavLinks.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`corporate-nav-link ${isActive ? "active" : ""}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {mobileMenuOpen && (
                        <div className="d-md-none py-2 border-top">
                            {visibleNavLinks.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`d-flex align-items-center gap-2 px-3 py-2 text-decoration-none ${
                                            isActive
                                                ? "bg-light text-primary fw-bold"
                                                : "text-secondary"
                                        }`}
                                        style={{ fontSize: "14px" }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* 3. PAGE CONTEXT SUB-HEADER (Breadcrumb & Subtitle) */}
            <div className="corporate-page-header">
                <div className="container-fluid px-3 px-lg-5">
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
                        <div>
                            <h4 className="fw-bold mb-1" style={{ color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                                {pageMeta.title}
                            </h4>
                            <p className="text-muted small mb-0">
                                {pageMeta.subtitle}
                            </p>
                        </div>
                        <div className="d-none d-sm-block">
                            <span className="badge badge-corporate-neutral" style={{ fontSize: "11px", fontWeight: "500" }}>
                                SIK Portal / {pageMeta.title}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. MAIN CONTENT CONTAINER */}
            <main className="container-fluid px-3 px-lg-5 pb-5 flex-grow-1">
                <Outlet />
            </main>

            {/* 5. CORPORATE FOOTER */}
            <footer className="corporate-footer">
                <div className="container-fluid px-3 px-lg-5">
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
                        <div>
                            <strong>SIK Kendaraan</strong> • Sistem Informasi Inspeksi Kelayakan Armada Operasional
                        </div>
                        <div className="text-muted">
                            © {new Date().getFullYear()} Kementerian / Instansi Pemerintah • Hak Cipta Dilindungi
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );

}

export default MainLayout;