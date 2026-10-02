import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
    });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const existingUser = await conn.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customerRole = await conn.query(
      'SELECT role_id, role_name FROM roles WHERE role_name = ? LIMIT 1',
      ['customer']
    );

    if (customerRole.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Customer role not found',
      });
    }

    const roleId = customerRole[0].role_id;
    const roleName = customerRole[0].role_name;

    const result = await conn.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role_id
      )
      VALUES (?, ?, ?, ?)
      `,
      [name, email, hashedPassword, roleId]
    );

    const userId = Number(result.insertId);

    const token = jwt.sign(
      {
        userId,
        role: roleName,
      },
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        role: roleName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const users = await conn.query(
      `
      SELECT
        u.user_id,
        u.name,
        u.email,
        u.password_hash,
        r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = ?
      LIMIT 1
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const userId = Number(user.user_id);

    const token = jwt.sign(
      {
        userId,
        role: user.role_name,
      },
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
}

export async function getProfile(req, res) {
  let conn;

  try {
    const userId = req.user.userId;

    conn = await pool.getConnection();

    const users = await conn.query(
      `
      SELECT
        u.user_id,
        u.name,
        u.email,
        r.role_name,
        u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      data: {
        id: Number(user.user_id),
        name: user.name,
        email: user.email,
        role: user.role_name,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
}
