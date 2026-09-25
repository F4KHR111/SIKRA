import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCar, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import logoSikra from "../../assets/logo/logo_sikra.png";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            const response = await authService.login(email, password);

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            toast.success("Login berhasil! Selamat datang.");
            navigate("/dashboard");

        } catch (error) {
            const msg = error.response?.data?.message || "Email atau password tidak sesuai.";
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const fillDemoAdmin = () => {
        setEmail("admin@gmail.com");
        setPassword("admin123");
        setErrorMessage("");
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e3a8a 100%)",
                padding: "24px"
            }}
        >
            <div
                className="w-100"
                style={{
                    maxWidth: "460px",
                    position: "relative"
                }}
            >
                {/* Brand Header */}
                <div className="text-center mb-4">
                    <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-white shadow-lg"
                        style={{
                            maxWidth: "200px",
                            height: "76px",
                            borderRadius: "16px",
                            padding: "8px 16px"
                        }}
                    >
                        <img
                            src={logoSikra}
                            alt="Logo SIKRA - Gedung Agung Istana Kepresidenan Yogyakarta"
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        />
                    </div>
                    <h3 className="fw-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
                        SIKRA
                    </h3>
                    <p className="text-light opacity-75 mb-0" style={{ fontSize: "14px" }}>
                        Sistem Inspeksi Kendaraan Rekapitulasi Armada
                    </p>
                </div>

                {/* Login Card */}
                <div
                    className="card border-0 shadow-lg"
                    style={{
                        borderRadius: "16px",
                        backgroundColor: "#ffffff"
                    }}
                >
                    <div className="card-body p-4 p-md-5">

                        <div className="mb-4">
                            <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "1.25rem" }}>
                                Masuk ke Portal
                            </h4>
                            <p className="text-muted small mb-0">
                                Masukkan kredensial akun Anda untuk melanjutkan
                            </p>
                        </div>

                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="alert alert-danger py-2 px-3 mb-4 d-flex align-items-center gap-2" style={{ fontSize: "13px", borderRadius: "8px" }}>
                                <span>⚠️</span>
                                <div>{errorMessage}</div>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="form-label text-dark">
                                    Email Pengguna
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "8px 0 0 8px" }}>
                                        <FaEnvelope size={14} />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control border-start-0"
                                        style={{ borderRadius: "0 8px 8px 0" }}
                                        placeholder="nama@instansi.go.id"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label className="form-label text-dark mb-0">
                                        Kata Sandi
                                    </label>
                                </div>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: "8px 0 0 8px" }}>
                                        <FaLock size={14} />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control border-start-0 border-end-0"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="input-group-text bg-light border-start-0 text-muted"
                                        style={{ borderRadius: "0 8px 8px 0", cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Tombol Submit */}
                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                                style={{ borderRadius: "8px", fontWeight: "600", fontSize: "14px" }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke Sistem</span>
                                        <FaArrowRight size={13} />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Petunjuk Akun Demo */}
                        <div
                            className="mt-4 p-3 rounded text-center border"
                            style={{
                                backgroundColor: "#f8fafc",
                                borderColor: "#e2e8f0"
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="text-start">
                                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase" }}>
                                        Akun Demo Administrator
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                                        admin@gmail.com / admin123
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={fillDemoAdmin}
                                    className="btn btn-outline-primary btn-sm py-1 px-2"
                                    style={{ fontSize: "11px" }}
                                >
                                    Isi Cepat
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Copy */}
                <div className="text-center mt-4 text-white-50 small">
                    © {new Date().getFullYear()} SIKRA • Istana Kepresidenan Yogyakarta
                </div>

            </div>
        </div>
    );

}

export default Login;