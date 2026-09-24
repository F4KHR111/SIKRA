require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files (only works on local; on Vercel use external storage)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend Inspeksi Kendaraan berjalan...",
        environment: process.env.NODE_ENV || "production"
    });
});

// Routes
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");
const kendaraanRoutes = require("./routes/kendaraanRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const itemRoutes = require("./routes/itemRoutes");
const statusRoutes = require("./routes/statusRoutes");
const pemeriksaanRoutes = require("./routes/pemeriksaanRoutes");
const hasilPemeriksaanRoutes = require("./routes/hasilPemeriksaanRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/kendaraan", kendaraanRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/pemeriksaan", pemeriksaanRoutes);
app.use("/api/hasil-pemeriksaan", hasilPemeriksaanRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

module.exports = app;
