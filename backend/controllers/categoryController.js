import pool from '../config/database.js';

export async function getCategories(req, res, next) {
  let connection;

  try {
    connection = await pool.getConnection();

    const rows = await connection.query(`
      SELECT
        category_id,
        name,
        description,
        sort_order,
        is_active
      FROM categories
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `);

    res.json(
      rows.map((category) => ({
        categoryId: Number(category.category_id),
        name: category.name,
        description: category.description,
        sortOrder: category.sort_order,
      }))
    );
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function getCategory(req, res, next) {
  let connection;

  try {
    const categoryId = Number(req.params.id);

    connection = await pool.getConnection();

    const rows = await connection.query(
      `
      SELECT
        category_id,
        name,
        description,
        sort_order,
        is_active
      FROM categories
      WHERE category_id = ?
      LIMIT 1
      `,
      [categoryId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }

    const category = rows[0];

    res.json({
      categoryId: Number(category.category_id),
      name: category.name,
      description: category.description,
      sortOrder: category.sort_order,
      active: Boolean(category.is_active),
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}