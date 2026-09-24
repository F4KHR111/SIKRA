const db = require("../config/db");

const getDashboard = async () => {

    const [[kendaraan]] = await db.query(
        "SELECT COUNT(*) AS total FROM kendaraan"
    );

    const [[users]] = await db.query(
        "SELECT COUNT(*) AS total FROM users"
    );

    const [[pemeriksaan]] = await db.query(
        "SELECT COUNT(*) AS total FROM pemeriksaan"
    );

    const [recent] = await db.query(`
        SELECT
            p.id,
            p.tanggal,
            k.jenis_kendaraan,
            u.nama AS inspektor
        FROM pemeriksaan p
        JOIN kendaraan k
            ON p.kendaraan_id = k.id
        JOIN users u
            ON p.inspektor_id = u.id
        ORDER BY p.tanggal DESC
        LIMIT 5
    `);

    return {
        totalKendaraan: kendaraan.total,
        totalUser: users.total,
        totalPemeriksaan: pemeriksaan.total,
        recent
    };

};

module.exports = {
    getDashboard
};