const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
require("dotenv").config();
const { Pool } = require("pg");

const postgresUrl = process.env.POSTGRES_URL || 
                    process.env.POSTGRES_DATABASE_URL || 
                    process.env.POSTGRES_PRISMA_DATABASE_URL;

// Pool PostgreSQL
const pool = new Pool({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000
});

// Helper wrapper to make PostgreSQL compatible with mysql2 syntax:
// 1. Converts "?" placeholders to "$1, $2, $3..."
// 2. Removes backticks `` `table` ``
// 3. Appends RETURNING id for INSERT queries
// 4. Returns [rows, fields] format matching mysql2
const query = async (sqlText, params = []) => {
    let cleanSql = sqlText.replace(/`/g, "");

    // Convert ? to $1, $2, $3...
    let paramIndex = 1;
    cleanSql = cleanSql.replace(/\?/g, () => `$${paramIndex++}`);

    const isInsert = /^\s*INSERT\s+INTO/i.test(cleanSql);
    const hasReturning = /RETURNING/i.test(cleanSql);

    if (isInsert && !hasReturning) {
        cleanSql += " RETURNING id";
    }

    const res = await pool.query(cleanSql, params);

    if (isInsert) {
        const insertId = res.rows[0]?.id || 0;
        const resultObj = {
            insertId,
            affectedRows: res.rowCount,
            rows: res.rows
        };
        return [resultObj, null];
    }

    const isUpdateOrDelete = /^\s*(UPDATE|DELETE)\s+/i.test(cleanSql);
    if (isUpdateOrDelete) {
        const resultObj = {
            affectedRows: res.rowCount,
            rows: res.rows
        };
        return [resultObj, null];
    }

    // Normal SELECT query -> returns [rows, fields]
    return [res.rows, null];
};

module.exports = {
    query,
    pool
};