import pool from '../config/database.js';

export async function getMenu(req, res, next) {
  let connection;

  try {
    connection = await pool.getConnection();

    const rows = await connection.query(`
      SELECT
        mi.item_id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.highlighted,
        mi.badge_text,
        mi.is_available,
        mi.sort_order,
        c.category_id,
        c.name AS category_name
      FROM menu_items mi
      LEFT JOIN categories c
        ON c.category_id = mi.category_id
      WHERE mi.is_available = TRUE
      ORDER BY
        c.sort_order ASC,
        mi.sort_order ASC,
        mi.name ASC
    `);

    const menu = [];

    for (const row of rows) {
      const tags = await connection.query(
        `
        SELECT
          dt.code,
          dt.name
        FROM menu_item_tags mit
        JOIN dietary_tags dt
          ON dt.tag_id = mit.tag_id
        WHERE mit.item_id = ?
        ORDER BY dt.code
        `,
        [row.item_id]
      );

      menu.push({
        itemId: Number(row.item_id),
        name: row.name,
        description: row.description,
        price: Number(row.price),
        imageUrl: row.image_url,
        highlighted: Boolean(row.highlighted),
        badgeText: row.badge_text,
        available: Boolean(row.is_available),
        category: row.category_id
          ? {
              categoryId: Number(row.category_id),
              name: row.category_name,
            }
          : null,
        tags: tags.map((tag) => ({
          code: tag.code,
          name: tag.name,
        })),
      });
    }

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
        mi.item_id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.highlighted,
        mi.badge_text,
        mi.is_available,
        c.category_id,
        c.name AS category_name
      FROM menu_items mi
      LEFT JOIN categories c
        ON c.category_id = mi.category_id
      WHERE mi.item_id = ?
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

    const tags = await connection.query(
      `
      SELECT
        dt.code,
        dt.name
      FROM menu_item_tags mit
      JOIN dietary_tags dt
        ON dt.tag_id = mit.tag_id
      WHERE mit.item_id = ?
      ORDER BY dt.code
      `,
      [itemId]
    );

    res.json({
      itemId: Number(row.item_id),
      name: row.name,
      description: row.description,
      price: Number(row.price),
      imageUrl: row.image_url,
      highlighted: Boolean(row.highlighted),
      badgeText: row.badge_text,
      available: Boolean(row.is_available),
      category: row.category_id
        ? {
            categoryId: Number(row.category_id),
            name: row.category_name,
          }
        : null,
      tags: tags.map((tag) => ({
        code: tag.code,
        name: tag.name,
      })),
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}