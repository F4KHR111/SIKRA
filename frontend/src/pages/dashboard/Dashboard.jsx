import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaCar,
    FaUsers,
    FaClipboardCheck,
    FaPlus,
    FaArrowRight,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaFileAlt,
    FaIdCard,
    FaExclamationTriangle,
    FaShieldAlt,
    FaSearch
} from "react-icons/fa";

import dashboardService from "../../services/dashboardService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stnkFilter, setStnkFilter] = useState("perlu_tindakan"); // 'semua' | 'perlu_tindakan' | 'expired' | 'tahunan' | 'lima_tahunan'
    const [stnkSearch, setStnkSearch] = useState("");

    const getUser = () => {
        try {
            const data = localStorage.getItem("user");
            if (data) return JSON.parse(data);
        } catch (e) {
            console.error(e);
        }
        return null;
    };

    const user = getUser();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getDashboard();
            setDashboard(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";
        const d = new Date(tanggal);
        return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    const renderStnkBadge = (alertInfo) => {
        if (!alertInfo) {
            return (
                <span className="badge bg-light text-muted border" style={{ fontSize: "11px", fontWeight: "500" }}>
                    Belum Diisi
                </span>
            );
        }

        const { status, statusLabel, tanggal } = alertInfo;
        const formatted = formatTanggal(tanggal);

        if (status === "expired") {
            return (
                <div className="d-flex flex-column gap-1">
                    <span className="badge bg-danger py-1 px-2" style={{ fontSize: "11px" }}>
                        <FaExclamationTriangle className="me-1" size={10} /> {statusLabel}
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>{formatted}</span>
                </div>
            );
        } else if (status === "kritis") {
            return (
                <div className="d-flex flex-column gap-1">
                    <span className="badge bg-warning text-dark py-1 px-2" style={{ fontSize: "11px" }}>
                        <FaClock className="me-1" size={10} /> {statusLabel}
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>{formatted}</span>
                </div>
            );
        } else if (status === "peringatan") {
            return (
                <div className="d-flex flex-column gap-1">
                    <span className="badge py-1 px-2" style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", fontSize: "11px" }}>
                        {statusLabel}
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>{formatted}</span>
                </div>
            );
        } else {
            return (
                <div className="d-flex flex-column gap-1">
                    <span className="badge bg-success-subtle text-success border border-success-subtle py-1 px-2" style={{ fontSize: "11px" }}>
                        <FaCheckCircle className="me-1" size={10} /> {statusLabel}
                    </span>
                    <span className="text-muted" style={{ fontSize: "11px" }}>{formatted}</span>
                </div>
            );
        }
    };

    const filterStnkList = (list) => {
        if (!list) return [];
        return list.filter((item) => {
            const matchesSearch =
                stnkSearch === "" ||
                item.jenis_kendaraan?.toLowerCase().includes(stnkSearch.toLowerCase()) ||
                item.tipe?.toLowerCase().includes(stnkSearch.toLowerCase()) ||
                item.plat_merah?.toLowerCase().includes(stnkSearch.toLowerCase()) ||
                item.plat_hitam?.toLowerCase().includes(stnkSearch.toLowerCase()) ||
                item.asal_kendaraan?.toLowerCase().includes(stnkSearch.toLowerCase());

            if (!matchesSearch) return false;

            if (stnkFilter === "perlu_tindakan") {
                return item.worstStatus === "expired" || item.worstStatus === "kritis" || item.worstStatus === "peringatan";
            }
            if (stnkFilter === "expired") {
                return item.worstStatus === "expired";
            }
            if (stnkFilter === "tahunan") {
                return item.alertTahunan && (item.alertTahunan.status === "expired" || item.alertTahunan.status === "kritis" || item.alertTahunan.status === "peringatan");
            }
            if (stnkFilter === "lima_tahunan") {
                return item.alertLimaTahunan && (item.alertLimaTahunan.status === "expired" || item.alertLimaTahunan.status === "kritis" || item.alertLimaTahunan.status === "peringatan");
            }

            return true;
        });
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Memuat data...</span>
                </div>
                <div className="text-muted fw-semibold">Memuat Data Dashboard Eksekutif...</div>
            </div>
        );
    }

    const stnkSummary = dashboard?.stnkSummary || {
        totalExpired: 0,
        totalSegera: 0,
        totalPerhatian: 0,
        totalAman: 0,
        totalNeedAction: 0
    };

    const filteredStnk = filterStnkList(dashboard?.stnkAlerts || []);

    return (
        <div className="container-fluid p-0">

            {/* Banner Eksekutif */}
            <div className="executive-banner mb-4">
                <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="col-lg-8">
                        <span className="badge badge-corporate-blue mb-2" style={{ fontSize: "11px", textTransform: "uppercase" }}>
                            Sistem Operasional Inspeksi
                        </span>
                        <h2 className="text-white fw-bold mb-2">
                            {getGreeting()}, {user?.nama || "Petugas Operasional"}!
                        </h2>
                        <p className="text-white-50 mb-0" style={{ maxWidth: "600px", fontSize: "14px" }}>
                            Pantau kelayakan fisik serta kepatuhan masa berlaku dokumen STNK seluruh armada kendaraan dinas.
                        </p>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <Link to="/pemeriksaan" className="btn btn-light fw-bold py-2 px-3 shadow-sm" style={{ color: "#0f172a" }}>
                            <FaPlus className="text-primary me-1" size={13} />
                            Mulai Inspeksi Baru
                        </Link>
                    </div>
                </div>
            </div>

            {/* Alert Banner Jika Ada STNK Mendekati Habis / Kedaluwarsa */}
            {stnkSummary.totalNeedAction > 0 && (
                <div
                    className="alert d-flex align-items-center justify-content-between p-3 mb-4 rounded-3 shadow-sm border-0"
                    style={{
                        background: stnkSummary.totalExpired > 0
                            ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"
                            : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                        borderLeft: `5px solid ${stnkSummary.totalExpired > 0 ? "#ef4444" : "#f59e0b"}`
                    }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "10px",
                                background: stnkSummary.totalExpired > 0 ? "#fee2e2" : "#fef3c7",
                                color: stnkSummary.totalExpired > 0 ? "#b91c1c" : "#b45309",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px"
                            }}
                        >
                            <FaExclamationTriangle />
                        </div>
                        <div>
                            <div className="fw-bold" style={{ color: stnkSummary.totalExpired > 0 ? "#991b1b" : "#92400e", fontSize: "14px" }}>
                                Peringatan Masa Berlaku Dokumen STNK ({stnkSummary.totalNeedAction} Unit Armada)
                            </div>
                            <small style={{ color: stnkSummary.totalExpired > 0 ? "#b91c1c" : "#78350f" }}>
                                {stnkSummary.totalExpired > 0 && (
                                    <span className="me-2">⚠️ <strong>{stnkSummary.totalExpired} unit</strong> telah kedaluwarsa.</span>
                                )}
                                <span>Terdapat <strong>{stnkSummary.totalSegera + stnkSummary.totalPerhatian} unit</strong> mendekati masa jatuh tempo (kurang dari 1 tahun). Segera rencanakan perpanjangan pajak / plat nomor.</span>
                            </small>
                        </div>
                    </div>
                    <a
                        href="#stnk-monitoring-section"
                        className="btn btn-sm fw-bold shadow-sm"
                        style={{
                            backgroundColor: stnkSummary.totalExpired > 0 ? "#ef4444" : "#f59e0b",
                            color: "#ffffff"
                        }}
                    >
                        Lihat Rincian STNK ↓
                    </a>
                </div>
            )}

            {/* Statistik Kartu KPI (4 Kolom) */}
            <div className="row g-4 mb-4">

                {/* Total Kendaraan */}
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                                    Total Armada
                                </div>
                                <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2rem", color: "#0f172a" }}>
                                    {dashboard?.totalKendaraan || 0}
                                </h2>
                            </div>
                            <div className="stat-icon-wrapper stat-icon-blue">
                                <FaCar />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                            <span style={{ fontSize: "12px", color: "#64748b" }}>Kendaraan Operasional</span>
                            <Link to="/kendaraan" className="text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#1d4ed8" }}>
                                Kelola <FaArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Peringatan STNK */}
                <div className="col-xl-3 col-md-6">
                    <div
                        className="stat-card h-100"
                        style={{
                            border: stnkSummary.totalNeedAction > 0
                                ? (stnkSummary.totalExpired > 0 ? "1px solid #fecaca" : "1px solid #fde68a")
                                : "1px solid #e2e8f0"
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: stnkSummary.totalNeedAction > 0 ? "#b45309" : "#64748b" }}>
                                    Peringatan STNK
                                </div>
                                <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2rem", color: stnkSummary.totalExpired > 0 ? "#dc2626" : (stnkSummary.totalNeedAction > 0 ? "#d97706" : "#059669") }}>
                                    {stnkSummary.totalNeedAction}
                                </h2>
                            </div>
                            <div
                                className="stat-icon-wrapper"
                                style={{
                                    backgroundColor: stnkSummary.totalExpired > 0 ? "#fee2e2" : (stnkSummary.totalNeedAction > 0 ? "#fef3c7" : "#ecfdf5"),
                                    color: stnkSummary.totalExpired > 0 ? "#dc2626" : (stnkSummary.totalNeedAction > 0 ? "#d97706" : "#059669")
                                }}
                            >
                                <FaIdCard />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                            <span style={{ fontSize: "11px", color: "#64748b" }}>
                                {stnkSummary.totalExpired > 0
                                    ? `${stnkSummary.totalExpired} Lewat / ${stnkSummary.totalPerhatian} < 1 Thn`
                                    : (stnkSummary.totalNeedAction > 0 ? `${stnkSummary.totalNeedAction} Butuh Perpanjangan` : "Semua STNK Tertib")
                                }
                            </span>
                            <a href="#stnk-monitoring-section" className="text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#d97706" }}>
                                Rincian <FaArrowRight size={10} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Total Pemeriksaan */}
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                                    Total Pemeriksaan
                                </div>
                                <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2rem", color: "#0f172a" }}>
                                    {dashboard?.totalPemeriksaan || 0}
                                </h2>
                            </div>
                            <div className="stat-icon-wrapper stat-icon-amber">
                                <FaClipboardCheck />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                            <span style={{ fontSize: "12px", color: "#64748b" }}>Riwayat Sesi Cek</span>
                            <Link to="/pemeriksaan" className="text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#d97706" }}>
                                Lihat <FaArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Total Pengguna */}
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                                    Pengguna Sistem
                                </div>
                                <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2rem", color: "#0f172a" }}>
                                    {dashboard?.totalUser || 0}
                                </h2>
                            </div>
                            <div className="stat-icon-wrapper stat-icon-emerald">
                                <FaUsers />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                            <span style={{ fontSize: "12px", color: "#64748b" }}>Inspektor & Admin</span>
                            <Link to="/user" className="text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#059669" }}>
                                Info <FaArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

            {/* ========================================================
                SECTION: MONITORING MASA BERLAKU STNK (REQUEST KHUSUS)
            ======================================================== */}
            <div className="card mb-4 shadow-sm" id="stnk-monitoring-section">
                <div className="card-header bg-white py-3">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "8px",
                                        backgroundColor: "#eff6ff",
                                        color: "#1e40af",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "15px"
                                    }}
                                >
                                    <FaIdCard />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold" style={{ color: "#0f172a" }}>
                                        Monitoring Masa Berlaku STNK & Pajak Kendaraan
                                    </h6>
                                    <small className="text-muted" style={{ fontSize: "12px" }}>
                                        Peringatan otomatis saat masa berlaku tinggal ≤ 1 tahun atau mendekati jatuh tempo
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="d-flex align-items-center gap-2">
                            <div className="input-group input-group-sm" style={{ maxWidth: "240px" }}>
                                <span className="input-group-text bg-light border-end-0">
                                    <FaSearch className="text-muted" size={11} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Cari plat / unit..."
                                    value={stnkSearch}
                                    onChange={(e) => setStnkSearch(e.target.value)}
                                />
                            </div>
                            <Link to="/kendaraan" className="btn btn-outline-primary btn-sm fw-semibold">
                                + Kelola di Armada
                            </Link>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
                        <button
                            type="button"
                            className={`btn btn-sm ${stnkFilter === "perlu_tindakan" ? "btn-warning text-dark fw-bold" : "btn-light text-muted"}`}
                            onClick={() => setStnkFilter("perlu_tindakan")}
                            style={{ fontSize: "12px" }}
                        >
                            Perlu Tindakan (≤ 1 Tahun / Lewat)
                            <span className="badge bg-danger ms-2">{stnkSummary.totalNeedAction}</span>
                        </button>

                        <button
                            type="button"
                            className={`btn btn-sm ${stnkFilter === "expired" ? "btn-danger fw-bold" : "btn-light text-muted"}`}
                            onClick={() => setStnkFilter("expired")}
                            style={{ fontSize: "12px" }}
                        >
                            Kedaluwarsa
                            {stnkSummary.totalExpired > 0 && (
                                <span className="badge bg-white text-danger ms-2">{stnkSummary.totalExpired}</span>
                            )}
                        </button>

                        <button
                            type="button"
                            className={`btn btn-sm ${stnkFilter === "tahunan" ? "btn-primary fw-bold" : "btn-light text-muted"}`}
                            onClick={() => setStnkFilter("tahunan")}
                            style={{ fontSize: "12px" }}
                        >
                            Pajak 1 Tahunan
                        </button>

                        <button
                            type="button"
                            className={`btn btn-sm ${stnkFilter === "lima_tahunan" ? "btn-primary fw-bold" : "btn-light text-muted"}`}
                            onClick={() => setStnkFilter("lima_tahunan")}
                            style={{ fontSize: "12px" }}
                        >
                            STNK 5 Tahunan (Ganti Plat)
                        </button>

                        <button
                            type="button"
                            className={`btn btn-sm ${stnkFilter === "semua" ? "btn-secondary fw-bold" : "btn-light text-muted"}`}
                            onClick={() => setStnkFilter("semua")}
                            style={{ fontSize: "12px" }}
                        >
                            Semua Kendaraan ({dashboard?.stnkAlerts?.length || 0})
                        </button>
                    </div>
                </div>

                <div className="card-body p-0">
                    {filteredStnk.length > 0 ? (
                        <div className="table-responsive border-0">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th width="50" className="text-center">No</th>
                                        <th>Kendaraan</th>
                                        <th>Plat Nomor</th>
                                        <th>Asal Unit</th>
                                        <th>Pajak 1 Tahunan</th>
                                        <th>STNK 5 Tahunan</th>
                                        <th className="text-center" width="120">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStnk.map((k, idx) => (
                                        <tr key={k.id || idx}>
                                            <td className="text-center fw-semibold text-muted" style={{ fontSize: "12px" }}>
                                                {idx + 1}
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">{k.jenis_kendaraan || "Kendaraan"}</div>
                                                <div className="text-muted" style={{ fontSize: "12px" }}>{k.tipe || "-"}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-bold" style={{ fontSize: "12px" }}>
                                                        {k.plat_merah}
                                                    </span>
                                                    {k.plat_hitam && (
                                                        <span className="text-muted" style={{ fontSize: "11px" }}>
                                                            Hitam: {k.plat_hitam}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border" style={{ fontSize: "11px" }}>
                                                    {k.asal_kendaraan || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                {renderStnkBadge(k.alertTahunan)}
                                            </td>
                                            <td>
                                                {renderStnkBadge(k.alertLimaTahunan)}
                                            </td>
                                            <td className="text-center">
                                                <Link
                                                    to="/kendaraan"
                                                    className="btn btn-outline-primary btn-sm py-1 px-2"
                                                    style={{ fontSize: "11px" }}
                                                    title="Perbarui tanggal STNK di halaman Kendaraan"
                                                >
                                                    Update STNK
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <FaShieldAlt size={38} className="text-success opacity-50 mb-2" />
                            <div className="fw-semibold text-dark">Tidak Ada Peringatan STNK pada Filter Ini</div>
                            <small className="text-muted">
                                {stnkFilter === "perlu_tindakan"
                                    ? "Semua armada kendaraan memiliki masa berlaku STNK yang tertib dan masih panjang (> 1 tahun)."
                                    : "Tidak ada data kendaraan yang cocok dengan kriteria filter."
                                }
                            </small>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Konten Bawah: Pemeriksaan Terkini & Pintasan Cepat */}
            <div className="row g-4">

                {/* Kolom Kiri: Tabel Pemeriksaan Terkini */}
                <div className="col-lg-8">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
                            <div className="d-flex align-items-center gap-2">
                                <FaClock className="text-primary" />
                                <h6 className="mb-0 fw-bold">Aktivitas Pemeriksaan Terkini</h6>
                            </div>
                            <Link to="/pemeriksaan" className="btn btn-outline-primary btn-sm">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="card-body p-0">
                            {dashboard?.recent && dashboard.recent.length > 0 ? (
                                <div className="table-responsive border-0">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Kendaraan</th>
                                                <th>Plat Merah</th>
                                                <th>Petugas Inspektor</th>
                                                <th className="text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboard.recent.map((item, idx) => (
                                                <tr key={item.id || idx}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FaCalendarAlt className="text-muted" size={13} />
                                                            <span className="fw-medium">{formatTanggal(item.tanggal)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="fw-semibold text-dark">{item.jenis_kendaraan || "Kendaraan Operasional"}</div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold">
                                                            {item.plat_merah || "-"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div
                                                                style={{
                                                                    width: "26px",
                                                                    height: "26px",
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#e2e8f0",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontSize: "11px",
                                                                    fontWeight: "700",
                                                                    color: "#334155"
                                                                }}
                                                            >
                                                                {(item.inspektor || "I").charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-muted" style={{ fontSize: "13px" }}>
                                                                {item.inspektor || "-"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <Link
                                                            to="/laporan"
                                                            className="btn btn-outline-secondary btn-sm py-1 px-2"
                                                            style={{ fontSize: "11px" }}
                                                        >
                                                            Lihat Laporan
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <FaClipboardCheck size={36} className="text-secondary opacity-50 mb-2" />
                                    <div>Belum ada riwayat pemeriksaan terbaru.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Pintasan Aksi & SOP Ringkas */}
                <div className="col-lg-4">

                    {/* Pintasan Aksi Cepat */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold">Pintasan Cepat Operasional</h6>
                        </div>
                        <div className="card-body d-flex flex-column gap-2">

                            <Link
                                to="/kendaraan"
                                className="p-3 rounded text-decoration-none border d-flex align-items-center justify-content-between transition-all"
                                style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="stat-icon-wrapper stat-icon-blue" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
                                        <FaIdCard />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Pembaruan STNK & Unit</div>
                                        <small className="text-muted">Cek masa berlaku pajak armada</small>
                                    </div>
                                </div>
                                <FaArrowRight size={12} className="text-muted" />
                            </Link>

                            <Link
                                to="/pemeriksaan"
                                className="p-3 rounded text-decoration-none border d-flex align-items-center justify-content-between transition-all"
                                style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="stat-icon-wrapper stat-icon-amber" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
                                        <FaClipboardCheck />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Input Sesi Pemeriksaan</div>
                                        <small className="text-muted">Cek kondisi item armada</small>
                                    </div>
                                </div>
                                <FaArrowRight size={12} className="text-muted" />
                            </Link>

                            <Link
                                to="/laporan"
                                className="p-3 rounded text-decoration-none border d-flex align-items-center justify-content-between transition-all"
                                style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="stat-icon-wrapper stat-icon-emerald" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
                                        <FaFileAlt />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Rekapitulasi Laporan</div>
                                        <small className="text-muted">Cetak & analisa berkala</small>
                                    </div>
                                </div>
                                <FaArrowRight size={12} className="text-muted" />
                            </Link>

                        </div>
                    </div>

                    {/* Pedoman Standar Operasional */}
                    <div className="card shadow-sm" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1px solid #bfdbfe" }}>
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaCheckCircle className="text-primary" />
                                <span className="fw-bold" style={{ fontSize: "13px", color: "#1e3a8a" }}>Standar Kelayakan & Legalitas</span>
                            </div>
                            <p style={{ fontSize: "12px", color: "#1e40af", marginBottom: "0", lineHeight: "1.5" }}>
                                Pastikan legalitas dokumen STNK (Pajak Tahunan & Plat 5 Tahunan) serta kelaikan fisik armada diperiksa secara proaktif sebelum masa berlaku habis.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );

}

export default Dashboard;