import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

const ALLOWED_STATUSES = new Set(['Active', 'On Break', 'Off Duty']);

export async function getStaff(req, res, next) {
  let conn;

  try {
    conn = await pool.getConnection();
    const staff = await conn.query(`
      SELECT
        u.user_id,
        u.name,
        u.email,
        u.role_id,
        r.role_name,
        u.status
      FROM users u
      JOIN roles r ON r.role_id = u.role_id
      WHERE r.role_name NOT IN ('customer', 'admin')
      ORDER BY u.user_id ASC
    `);

    res.json(staff);
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
}

export async function getStaffById(req, res, next) {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'A valid staff ID is required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const staff = await conn.query(`
      SELECT u.user_id, u.name, u.email, u.role_id, r.role_name, u.status
      FROM users u
      JOIN roles r ON r.role_id = u.role_id
      WHERE u.user_id = ? AND r.role_name NOT IN ('customer', 'admin')
      LIMIT 1
    `, [userId]);

    if (staff.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(staff[0]);
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
}

export async function createStaff(req, res, next) {
  const { name, email, password, role_id: roleId, status = 'Active' } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Name, email, and a password of at least 8 characters are required' });
  }
  if (!ALLOWED_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Status must be Active, On Break, or Off Duty' });
  }
  const parsedRoleId = Number(roleId);
  if (!Number.isInteger(parsedRoleId)) {
    return res.status(400).json({ error: 'A valid staff role is required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const roles = await conn.query(`
      SELECT role_id FROM roles
      WHERE role_id = ? AND role_name NOT IN ('customer', 'admin')
      LIMIT 1
    `, [parsedRoleId]);
    if (roles.length === 0) {
      return res.status(400).json({ error: 'Select a staff role' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await conn.query(
      'INSERT INTO users (name, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), passwordHash, parsedRoleId, status],
    );
    const staff = await conn.query(`
      SELECT u.user_id, u.name, u.email, u.role_id, r.role_name, u.status
      FROM users u JOIN roles r ON r.role_id = u.role_id WHERE u.user_id = ?
    `, [Number(result.insertId)]);
    res.status(201).json(staff[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    next(error);
  } finally {
    if (conn) conn.release();
  }
}

export async function updateStaff(req, res, next) {
  const userId = Number(req.params.id);
  const { name, role_id: roleId, status } = req.body || {};

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'A valid staff ID is required' });
  }

  const updates = [];
  const values = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }
    updates.push('name = ?');
    values.push(name.trim());
  }

  if (roleId !== undefined) {
    const parsedRoleId = Number(roleId);
    if (!Number.isInteger(parsedRoleId)) {
      return res.status(400).json({ error: 'A valid role_id is required' });
    }
    updates.push('role_id = ?');
    values.push(parsedRoleId);
  }

  if (status !== undefined) {
    if (!ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({
        error: 'Status must be Active, On Break, or Off Duty',
      });
    }
    updates.push('status = ?');
    values.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Provide name, role_id, or status to update' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const existing = await conn.query(`
      SELECT u.user_id
      FROM users u
      JOIN roles r ON r.role_id = u.role_id
      WHERE u.user_id = ?
        AND r.role_name NOT IN ('customer', 'admin')
      LIMIT 1
    `, [userId]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    if (roleId !== undefined) {
      const role = await conn.query(`
        SELECT role_id
        FROM roles
        WHERE role_id = ?
          AND role_name NOT IN ('customer', 'admin')
        LIMIT 1
      `, [Number(roleId)]);

      if (role.length === 0) {
        return res.status(400).json({ error: 'Select a staff role' });
      }
    }

    values.push(userId);
    await conn.query(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      values,
    );

    res.json({ message: 'Staff member updated successfully' });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteStaff(req, res, next) {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'A valid staff ID is required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(`
      DELETE u FROM users u
      JOIN roles r ON r.role_id = u.role_id
      WHERE u.user_id = ?
        AND r.role_name NOT IN ('customer', 'admin')
    `, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'This staff member is linked to existing orders and cannot be deleted',
      });
    }
    next(error);
  } finally {
    if (conn) conn.release();
  }
}
