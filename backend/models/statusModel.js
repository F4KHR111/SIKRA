const db = require("../config/db");

const getAll = async () => {

    const [rows] = await db.query(`
        SELECT
            id,
            nama_status,
            warna
        FROM status_pemeriksaan
        ORDER BY id ASC
    `);

    return rows;

};

const getById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            nama_status,
            warna
        FROM status_pemeriksaan
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];

};

module.exports = {
    getAll,
    getById
};