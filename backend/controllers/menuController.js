import pool from '../config/database.js';

export async function getMenu(req, res, next) {
  let connection;

  try {
    connection = await pool.getConnection();

    const rows = await connection.query(`
      SELECT
        item_id,
        name,
        price,
        description,
        image_url,
        tags
      FROM menu_items
      ORDER BY item_id
    `);

    const menu = rows.map((row) => ({
      id: Number(row.item_id),
      title: row.name,
      price: Number(row.price),
      description: row.description,
      image: row.image_url,
      tags: row.tags ? row.tags.split(',') : [],
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
        item_id,
        name,
        price,
        description,
        image_url,
        tags
      FROM menu_items
      WHERE item_id = ?
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
      title: row.name,
      price: Number(row.price),
      description: row.description,
      image: row.image_url,
      tags: row.tags ? row.tags.split(',') : [],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}