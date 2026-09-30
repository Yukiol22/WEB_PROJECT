import pool from "./backend/config/database.js";

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log(" Successfully connected to MariaDB!");

    const rows = await conn.query("SHOW TABLES;");
    console.log("Query result:", rows);
  } catch (err) {
    console.error("❌ Failed to connect to MariaDB:", err);
  } finally {

    if (conn) conn.release();

    await pool.end();
  }
}

testConnection();
