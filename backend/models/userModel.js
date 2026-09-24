const db = require("../config/db");

const getAll = async () => {

    const [rows] = await db.query(`
        SELECT
            u.id,
            u.nama,
            u.email,
            u.no_hp,
            u.created_at,
            r.id AS role_id,
            r.nama_role
        FROM users u
        JOIN roles r ON r.id = u.role_id
        ORDER BY u.id ASC
    `);

    return rows;

};

const getById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            u.id,
            u.nama,
            u.email,
            u.no_hp,
            u.created_at,
            r.id AS role_id,
            r.nama_role
        FROM users u
        JOIN roles r ON r.id = u.role_id
        WHERE u.id = ?
        `,
        [id]
    );

    return rows[0];

};

const getByEmail = async (email) => {

    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];

};

const create = async (data) => {

    const [result] = await db.query(
        `
        INSERT INTO users
        (
            role_id,
            nama,
            email,
            password,
            no_hp
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            data.role_id,
            data.nama,
            data.email,
            data.password,
            data.no_hp
        ]
    );

    return result.insertId;

};

const update = async (id, data) => {

    await db.query(
        `
        UPDATE users
        SET
            role_id = ?,
            nama = ?,
            email = ?,
            no_hp = ?
        WHERE id = ?
        `,
        [
            data.role_id,
            data.nama,
            data.email,
            data.no_hp,
            id
        ]
    );

    return getById(id);

};

const updatePassword = async (id, password) => {

    await db.query(
        `
        UPDATE users
        SET password = ?
        WHERE id = ?
        `,
        [
            password,
            id
        ]
    );

};

const remove = async (id) => {

    await db.query(
        "DELETE FROM users WHERE id = ?",
        [id]
    );

};

module.exports = {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    updatePassword,
    remove
};