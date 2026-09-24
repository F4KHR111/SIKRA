const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function seed() {
    try {
        const password = await bcrypt.hash("admin123", 10);

        await db.query(
            `INSERT INTO users
            (role_id, nama, email, password, no_hp)
            VALUES (?, ?, ?, ?, ?)`,
            [
                1,
                "Administrator",
                "admin@gmail.com",
                password,
                "081234567890"
            ]
        );

        console.log("Admin berhasil dibuat.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();