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

async function testApi() {
    const token = generateToken();
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const resItem = await fetch("http://localhost:3000/api/item/kategori/1", { headers });
        const text = await resItem.text();
        console.log("STATUS KATEGORI 1:", resItem.status);
        console.log("RESPONSE BODY:", text);
    } catch (err) {
        console.error("API ERROR:", err.message);
    }
}

testApi();
