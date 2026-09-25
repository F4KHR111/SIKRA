const db = require("../config/db");

const getAll = async () => {
    const [rows] = await db.query(`
        SELECT
            id,
            jenis_kendaraan,
            tipe,
            asal_kendaraan,
            jenis_roda,
            tahun_kendaraan,
            plat_merah,
            plat_hitam,
            nomor_rangka,
            nomor_mesin,
            foto,
            stnk_tahunan,
            stnk_lima_tahunan,
            created_at,
            updated_at
        FROM kendaraan
        ORDER BY id DESC
    `);

    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            jenis_kendaraan,
            tipe,
            asal_kendaraan,
            jenis_roda,
            tahun_kendaraan,
            plat_merah,
            plat_hitam,
            nomor_rangka,
            nomor_mesin,
            foto,
            stnk_tahunan,
            stnk_lima_tahunan,
            created_at,
            updated_at
        FROM kendaraan
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};

const create = async (data) => {
    const [result] = await db.query(
        `
        INSERT INTO kendaraan
        (
            jenis_kendaraan,
            tipe,
            asal_kendaraan,
            jenis_roda,
            tahun_kendaraan,
            plat_merah,
            plat_hitam,
            nomor_rangka,
            nomor_mesin,
            foto,
            stnk_tahunan,
            stnk_lima_tahunan
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            data.jenis_kendaraan,
            data.tipe,
            data.asal_kendaraan,
            data.jenis_roda,
            data.tahun_kendaraan,
            data.plat_merah,
            data.plat_hitam,
            data.nomor_rangka,
            data.nomor_mesin,
            data.foto,
            data.stnk_tahunan || null,
            data.stnk_lima_tahunan || null
        ]
    );

    return result.insertId;
};

const getByPlatMerah = async (plat) => {
    const [rows] = await db.query(
        "SELECT id FROM kendaraan WHERE plat_merah = ?",
        [plat]
    );

    return rows[0];
};

const update = async (id, data) => {
    await db.query(
        `
        UPDATE kendaraan
        SET
            jenis_kendaraan = ?,
            tipe = ?,
            asal_kendaraan = ?,
            jenis_roda = ?,
            tahun_kendaraan = ?,
            plat_merah = ?,
            plat_hitam = ?,
            nomor_rangka = ?,
            nomor_mesin = ?,
            foto = ?,
            stnk_tahunan = ?,
            stnk_lima_tahunan = ?
        WHERE id = ?
        `,
        [
            data.jenis_kendaraan,
            data.tipe,
            data.asal_kendaraan,
            data.jenis_roda,
            data.tahun_kendaraan,
            data.plat_merah,
            data.plat_hitam,
            data.nomor_rangka,
            data.nomor_mesin,
            data.foto,
            data.stnk_tahunan || null,
            data.stnk_lima_tahunan || null,
            id
        ]
    );

    return await getById(id);
};

const remove = async (id) => {
    const [result] = await db.query(
        "DELETE FROM kendaraan WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    getAll,
    getById,
    create,
    getByPlatMerah,
    update,
    remove
};