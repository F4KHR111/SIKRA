const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = () => {
    return jwt.sign(
        {
            id: 1,
            nama: "Admin",
            role: "Admin"
        },
        process.env.JWT_SECRET || "inspeksi_kendaraan_rahasia",
        {
            expiresIn: "1d"
        }
    );
};

async function testPost() {
    const token = generateToken();
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const payload = {
        nama_item: "Item Test Baru",
        kategori_id: 1,
        urutan: 99,
        is_tahun_ganti: 0
    };

    try {
        const res = await fetch("http://localhost:3000/api/item", {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        console.log("POST STATUS:", res.status);
        console.log("RESPONSE BODY:", text);
    } catch (err) {
        console.error("API ERROR:", err.message);
    }
}

testPost();
