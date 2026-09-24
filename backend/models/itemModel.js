const db = require("../config/db");

const getAll = async () => {

    const [rows] = await db.query(`
        SELECT
            i.id,
            i.kategori_id,
            k.nama_kategori,
            i.nama_item,
            i.urutan,
            i.is_tahun_ganti
        FROM item_pemeriksaan i
        INNER JOIN kategori_pemeriksaan k
            ON i.kategori_id = k.id
        ORDER BY
            k.urutan ASC,
            i.urutan ASC
    `);

    return rows;

};

const getById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            i.id,
            i.kategori_id,
            k.nama_kategori,
            i.nama_item,
            i.urutan,
            i.is_tahun_ganti
        FROM item_pemeriksaan i
        INNER JOIN kategori_pemeriksaan k
            ON i.kategori_id = k.id
        WHERE i.id = ?
        `,
        [id]
    );

    return rows[0];

};

const getByKategori = async (kategoriId) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            kategori_id,
            nama_item,
            urutan,
            is_tahun_ganti
        FROM item_pemeriksaan
        WHERE kategori_id = ?
        ORDER BY urutan ASC
        `,
        [kategoriId]
    );

    return rows;

};

const getByNama = async (kategoriId, namaItem) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM item_pemeriksaan
        WHERE kategori_id = ?
        AND nama_item = ?
        `,
        [
            kategoriId,
            namaItem
        ]
    );

    return rows[0];

};

const create = async (data) => {

    const [result] = await db.query(
        `
        INSERT INTO item_pemeriksaan
        (
            kategori_id,
            nama_item,
            urutan,
            is_tahun_ganti
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            data.kategori_id,
            data.nama_item,
            data.urutan,
            data.is_tahun_ganti
        ]
    );

    return result.insertId;

};

const update = async (id, data) => {

    await db.query(
        `
        UPDATE item_pemeriksaan
        SET
            kategori_id = ?,
            nama_item = ?,
            urutan = ?,
            is_tahun_ganti = ?
        WHERE id = ?
        `,
        [
            data.kategori_id,
            data.nama_item,
            data.urutan,
            data.is_tahun_ganti,
            id
        ]
    );

    return getById(id);

};

const remove = async (id) => {

    await db.query(
        `
        DELETE FROM item_pemeriksaan
        WHERE id = ?
        `,
        [id]
    );

};

module.exports = {
    getAll,
    getById,
    getByKategori,
    getByNama,
    create,
    update,
    remove
};