const db = require("../config/db");

const getUserByEmail = async (email) => {

    const [rows] = await db.query(
        `
        SELECT
            u.id,
            u.nama,
            u.email,
            u.password,
            u.role_id,
            r.nama_role
        FROM users u
        JOIN roles r
            ON u.role_id = r.id
        WHERE u.email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0];
};

module.exports = {
    getUserByEmail
};