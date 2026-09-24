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
    FaFileAlt
} from "react-icons/fa";

import dashboardService from "../../services/dashboardService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="container-fluid p-0">

            {/* Banner Eksekutif */}
            <div className="executive-banner">
                <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
                    <div className="col-lg-8">
                        <span className="badge badge-corporate-blue mb-2" style={{ fontSize: "11px", textTransform: "uppercase" }}>
                            Sistem Operasional Inspeksi
                        </span>
                        <h2 className="text-white fw-bold mb-2">
                            {getGreeting()}, {user?.nama || "Petugas Operasional"}!
                        </h2>
                        <p className="text-white-50 mb-0" style={{ maxWidth: "600px", fontSize: "14px" }}>
                            Pantau kondisi kelayakan seluruh armada kendaraan operasional dinas secara berkala, akurat, dan terstandarisasi.
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

            {/* Statistik Kartu KPI */}
            <div className="row g-4 mb-4">

                {/* Total Kendaraan */}
                <div className="col-md-4">
                    <div className="stat-card">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                                    Total Armada
                                </div>
                                <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2.2rem", color: "#0f172a" }}>
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

                {/* Total Pemeriksaan */}
                <div className="col-md-4">
                    <div className="stat-card">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                                    Total Pemeriksaan
                                </div>
                                <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2.2rem", color: "#0f172a" }}>
                                    {dashboard?.totalPemeriksaan || 0}
                                </h2>
                            </div>
                            <div className="stat-icon-wrapper stat-icon-amber">
                                <FaClipboardCheck />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                            <span style={{ fontSize: "12px", color: "#64748b" }}>Riwayat Inspeksi</span>
                            <Link to="/pemeriksaan" className="text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#d97706" }}>
                                Lihat <FaArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Total Pengguna */}
                <div className="col-md-4">
                    <div className="stat-card">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                                    Pengguna Sistem
                                </div>
                                <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2.2rem", color: "#0f172a" }}>
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

            {/* Grid Konten: Pemeriksaan Terkini & Pintasan Cepat */}
            <div className="row g-4">

                {/* Kolom Kiri: Tabel Pemeriksaan Terkini */}
                <div className="col-lg-8">
                    <div className="card h-100">
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
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Kendaraan</th>
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
                    <div className="card mb-4">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold">Pintasan Cepat Operasional</h6>
                        </div>
                        <div className="card-body d-flex flex-column gap-2">

                            <Link
                                to="/pemeriksaan"
                                className="p-3 rounded text-decoration-none border d-flex align-items-center justify-content-between transition-all"
                                style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="stat-icon-wrapper stat-icon-blue" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
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
                                to="/kendaraan"
                                className="p-3 rounded text-decoration-none border d-flex align-items-center justify-content-between transition-all"
                                style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="stat-icon-wrapper stat-icon-emerald" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
                                        <FaCar />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Kelola Data Armada</div>
                                        <small className="text-muted">Tambah & perbarui unit</small>
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
                                    <div className="stat-icon-wrapper stat-icon-amber" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
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
                    <div className="card" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1px solid #bfdbfe" }}>
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaCheckCircle className="text-primary" />
                                <span className="fw-bold" style={{ fontSize: "13px", color: "#1e3a8a" }}>Standar Kelayakan Armada</span>
                            </div>
                            <p style={{ fontSize: "12px", color: "#1e40af", marginBottom: "0", lineHeight: "1.4" }}>
                                Pastikan pemeriksaan fisik ban, pengereman, oli mesin, dan kelistrikan dicatat secara objektif sebelum armada dinas beroperasi di jalan raya.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );

}

export default Dashboard;