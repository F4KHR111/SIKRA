import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://81a997ea46f0f8.lhr.life/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;