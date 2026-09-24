import axios from "axios";

// Di Vercel: API tersedia di /api (same domain, no CORS issue)
// Di lokal (npm run dev): gunakan VITE_API_URL dari .env  
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Otomatis sertakan token JWT pada setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;