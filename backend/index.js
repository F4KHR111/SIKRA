require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");


const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");


const kendaraanRoutes = require("./routes/kendaraanRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const itemRoutes = require("./routes/itemRoutes");
const statusRoutes = require("./routes/statusRoutes");
const pemeriksaanRoutes = require("./routes/pemeriksaanRoutes");

const hasilPemeriksaanRoutes = require("./routes/hasilPemeriksaanRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");






app.use(cors());

app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend Inspeksi Kendaraan berjalan..."
    });
});

const PORT = process.env.PORT || 3000;



app.use(errorHandler); 

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


app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});