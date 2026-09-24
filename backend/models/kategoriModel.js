const db = require("../config/db");

const getAll = async () => {

    const [rows] = await db.query(`
        SELECT *
        FROM kategori_pemeriksaan
        ORDER BY urutan ASC
    `);

    return rows;

};

const getById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM kategori_pemeriksaan
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];

};

const getByNama = async (nama) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM kategori_pemeriksaan
        WHERE nama_kategori = ?
        `,
        [nama]
    );

    return rows[0];

};

const create = async (data) => {

    const [result] = await db.query(
        `
        INSERT INTO kategori_pemeriksaan
        (
            nama_kategori,
            urutan
        )
        VALUES (?, ?)
        `,
        [
            data.nama_kategori,
            data.urutan
        ]
    );

    return result.insertId;

};

const update = async (id, data) => {

    await db.query(
        `
        UPDATE kategori_pemeriksaan
        SET
            nama_kategori = ?,
            urutan = ?
        WHERE id = ?
        `,
        [
            data.nama_kategori,
            data.urutan,
            id
        ]
    );

    return getById(id);

};

const remove = async (id) => {

    await db.query(
        `
        DELETE FROM kategori_pemeriksaan
        WHERE id = ?
        `,
        [id]
    );

};

module.exports = {
    getAll,
    getById,
    getByNama,
    create,
    update,
    remove
};