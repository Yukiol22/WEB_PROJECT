import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import pool from './config/database.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to MariaDB database successfully!');
    conn.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MariaDB database:', error.message);
    process.exit(1);
  }
}

startServer();