const db = require("../config/db");

const getAll = async () => {

    const [rows] = await db.query(`
        SELECT
            p.id,
            p.kendaraan_id,
            p.inspektor_id,
            p.tanggal,
            p.catatan_umum,
            p.odometer,
            p.created_at,
            p.updated_at,

            k.jenis_kendaraan,
            k.tipe,
            k.asal_kendaraan,
            k.jenis_roda,
            k.plat_merah,
            k.plat_hitam,
            k.foto,

            u.nama AS nama_inspektor

        FROM pemeriksaan p

        INNER JOIN kendaraan k
            ON p.kendaraan_id = k.id

        INNER JOIN users u
            ON p.inspektor_id = u.id

        ORDER BY p.id DESC
    `);

    return rows;

};

const getById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            p.id,
            p.kendaraan_id,
            p.inspektor_id,
            p.tanggal,
            p.catatan_umum,
            p.odometer,
            p.created_at,
            p.updated_at,

            k.jenis_kendaraan,
            k.tipe,
            k.asal_kendaraan,
            k.jenis_roda,
            k.plat_merah,
            k.plat_hitam,
            k.foto,

            u.nama AS nama_inspektor

        FROM pemeriksaan p

        INNER JOIN kendaraan k
            ON p.kendaraan_id = k.id

        INNER JOIN users u
            ON p.inspektor_id = u.id

        WHERE p.id = ?
        `,
        [id]
    );

    return rows[0];

};

const create = async (data) => {

    const [result] = await db.query(
        `
        INSERT INTO pemeriksaan
        (
            kendaraan_id,
            inspektor_id,
            tanggal,
            catatan_umum,
            odometer
        )
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
            data.kendaraan_id,
            data.inspektor_id,
            data.tanggal,
            data.catatan_umum,
            data.odometer
        ]
    );

    return result.insertId;

};

const update = async (id, data) => {

    await db.query(
        `
        UPDATE pemeriksaan
        SET
            kendaraan_id = ?,
            inspektor_id = ?,
            tanggal = ?,
            catatan_umum = ?,
            odometer = ?
        WHERE id = ?
        `,
        [
            data.kendaraan_id,
            data.inspektor_id,
            data.tanggal,
            data.catatan_umum,
            data.odometer,
            id
        ]
    );

};

const remove = async (id) => {

    await db.query(
        "DELETE FROM pemeriksaan WHERE id = ?",
        [id]
    );

};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};