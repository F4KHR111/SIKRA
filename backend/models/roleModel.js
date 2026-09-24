const db = require("../config/db");

const getAll = async () => {

    const [rows] = await db.query(`
        SELECT *
        FROM roles
        ORDER BY id ASC
    `);

    return rows;

};

const getById = async (id) => {

    const [rows] = await db.query(
        "SELECT * FROM roles WHERE id = ?",
        [id]
    );

    return rows[0];

};

const create = async (nama_role) => {

    const [result] = await db.query(
        "INSERT INTO roles (nama_role) VALUES (?)",
        [nama_role]
    );

    return result.insertId;

};

const update = async (id, nama_role) => {

    await db.query(
        "UPDATE roles SET nama_role=? WHERE id=?",
        [nama_role, id]
    );

    return getById(id);

};

const remove = async (id) => {

    await db.query(
        "DELETE FROM roles WHERE id=?",
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