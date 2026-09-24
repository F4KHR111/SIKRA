import axios from "axios";

// Default ke backend live Vercel
const baseURL = import.meta.env.VITE_API_URL || "https://backend-pi-nine-25.vercel.app/api";

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