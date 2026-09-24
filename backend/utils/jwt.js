const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sikra_inspeksi_super_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            nama: user.nama,
            role: user.nama_role
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
};

module.exports = {
    generateToken
};