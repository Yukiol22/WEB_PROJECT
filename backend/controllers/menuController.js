import pool from '../config/database.js';

export async function getMenu(req, res, next) {
  let connection;

  try {
    connection = await pool.getConnection();

    const rows = await connection.query(`
      SELECT
        m.item_id,
        m.category_id,
        c.name AS category_name,
        m.name,
        m.price,
        m.description,
        m.image_url,
        m.tags
      FROM menu_items m
      LEFT JOIN categories c ON c.category_id = m.category_id
      ORDER BY m.item_id
    `);

    const menu = rows.map((row) => ({
      id: Number(row.item_id),
      category_id: row.category_id === null ? null : Number(row.category_id),
      title: row.name,
      price: Number(row.price),
      description: row.description,
      image: row.image_url,
      tags: row.tags ? row.tags.split(',') : [],
      category_name: row.category_name,
    }));

    res.json(menu);
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function getMenuItem(req, res, next) {
  let connection;

  try {
    const itemId = Number(req.params.id);

    connection = await pool.getConnection();

    const rows = await connection.query(
      `
      SELECT
        m.item_id,
        m.category_id,
        c.name AS category_name,
        m.name,
        m.price,
        m.description,
        m.image_url,
        m.tags
      FROM menu_items m
      LEFT JOIN categories c ON c.category_id = m.category_id
      WHERE m.item_id = ?
      LIMIT 1
      `,
      [itemId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Menu item not found',
      });
    }

    const row = rows[0];

    res.json({
      id: Number(row.item_id),
      category_id: row.category_id === null ? null : Number(row.category_id),
      title: row.name,
      price: Number(row.price),
      description: row.description,
      image: row.image_url,
      tags: row.tags ? row.tags.split(',') : [],
      category_name: row.category_name,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
