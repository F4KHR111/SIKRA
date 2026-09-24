const db = require("../config/db");

const getAll = async () => {

    const [rows] = await db.query(`
        SELECT
            hp.id,
            hp.pemeriksaan_id,
            hp.item_id,
            hp.status_id,
            hp.tahun_ganti,
            hp.catatan,
            hp.created_at,
            hp.updated_at,

            ip.nama_item,
            kp.nama_kategori,

            sp.nama_status,
            sp.warna,

            p.tanggal,

            k.jenis_kendaraan,
            k.plat_merah,

            u.nama AS nama_inspektor

        FROM hasil_pemeriksaan hp

        INNER JOIN pemeriksaan p
            ON hp.pemeriksaan_id = p.id

        INNER JOIN kendaraan k
            ON p.kendaraan_id = k.id

        INNER JOIN users u
            ON p.inspektor_id = u.id

        INNER JOIN item_pemeriksaan ip
            ON hp.item_id = ip.id

        INNER JOIN kategori_pemeriksaan kp
            ON ip.kategori_id = kp.id

        INNER JOIN status_pemeriksaan sp
            ON hp.status_id = sp.id

        ORDER BY hp.id DESC
    `);

    return rows;

};

const getById = async (id) => {

    const [rows] = await db.query(`
        SELECT
            hp.id,
            hp.pemeriksaan_id,
            hp.item_id,
            hp.status_id,
            hp.tahun_ganti,
            hp.catatan,
            hp.created_at,
            hp.updated_at,

            ip.nama_item,
            kp.nama_kategori,

            sp.nama_status,
            sp.warna,

            p.tanggal,

            k.jenis_kendaraan,
            k.plat_merah,

            u.nama AS nama_inspektor

        FROM hasil_pemeriksaan hp

        INNER JOIN pemeriksaan p
            ON hp.pemeriksaan_id = p.id

        INNER JOIN kendaraan k
            ON p.kendaraan_id = k.id

        INNER JOIN users u
            ON p.inspektor_id = u.id

        INNER JOIN item_pemeriksaan ip
            ON hp.item_id = ip.id

        INNER JOIN kategori_pemeriksaan kp
            ON ip.kategori_id = kp.id

        INNER JOIN status_pemeriksaan sp
            ON hp.status_id = sp.id

        WHERE hp.id = ?
    `, [id]);

    return rows[0];

};

const create = async (data) => {

    const [result] = await db.query(`
        INSERT INTO hasil_pemeriksaan
        (
            pemeriksaan_id,
            item_id,
            status_id,
            tahun_ganti,
            catatan
        )
        VALUES (?, ?, ?, ?, ?)
    `, [
        data.pemeriksaan_id,
        data.item_id,
        data.status_id,
        data.tahun_ganti,
        data.catatan
    ]);

    return result.insertId;

};

const update = async (id, data) => {

    await db.query(`
        UPDATE hasil_pemeriksaan
        SET
            pemeriksaan_id = ?,
            item_id = ?,
            status_id = ?,
            tahun_ganti = ?,
            catatan = ?
        WHERE id = ?
    `, [
        data.pemeriksaan_id,
        data.item_id,
        data.status_id,
        data.tahun_ganti,
        data.catatan,
        id
    ]);

};

const remove = async (id) => {

    await db.query(
        "DELETE FROM hasil_pemeriksaan WHERE id = ?",
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