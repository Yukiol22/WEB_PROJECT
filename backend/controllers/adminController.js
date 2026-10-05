import pool from '../config/database.js';

export async function getAllOrders(req, res, next){
  let conn;
  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
      SELECT o.order_id, o.total_amount, o.status, o.created_at, o.pickup_time,
             o.customer_id AS user_id, u.name AS customer_name, u.email AS customer_email,
             oi.item_id, oi.quantity, mi.name AS item_name
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      LEFT JOIN menu_items mi ON mi.item_id = oi.item_id
      ORDER BY o.created_at DESC, o.order_id DESC, oi.order_item_id ASC
    `);

    const ordersById = new Map();
    for (const row of rows) {
      let order = ordersById.get(row.order_id);
      if (!order) {
        order = {
          order_id: Number(row.order_id),
          total_amount: Number(row.total_amount),
          status: row.status,
          created_at: row.created_at,
          pickup_time: row.pickup_time,
          user_id: Number(row.user_id),
          customer_name: row.customer_name || "Customer",
          customer_email: row.customer_email,
          items: [],
        };
        ordersById.set(row.order_id, order);
      }
      if (row.item_id !== null) {
        order.items.push({ item_id: Number(row.item_id), name: row.item_name || "Menu item", quantity: Number(row.quantity) });
      }
    }
    const orders = [...ordersById.values()];

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return next(error);
  } finally {
    if (conn) conn.release();
  }
};

export async function getReports(req, res, next) {
  const timeframe = String(req.query.timeframe || 'all').toLowerCase();
  const dateConditions = {
    today: 'created_at >= CURDATE()',
    week: 'created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)',
    month: 'created_at >= DATE_FORMAT(CURDATE(), \'%Y-%m-01\')',
    year: 'created_at >= MAKEDATE(YEAR(CURDATE()), 1)',
    all: null,
  };
  if (!Object.hasOwn(dateConditions, timeframe)) {
    return res.status(400).json({ error: 'Invalid report timeframe' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const dateFilter = dateConditions[timeframe];
    const where = dateFilter ? `AND o.${dateFilter}` : '';
    const summaryRows = await conn.query(`
      SELECT COUNT(*) AS completed_orders, COALESCE(SUM(o.total_amount), 0) AS revenue,
             COALESCE(AVG(o.total_amount), 0) AS average_order_value
      FROM orders o
      WHERE LOWER(o.status) = 'completed' ${where}
    `);
    const popularItems = await conn.query(`
      SELECT mi.name AS item_name, COALESCE(c.name, 'Uncategorized') AS category_name,
             SUM(oi.quantity) AS quantity_sold
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.order_id
      JOIN menu_items mi ON mi.item_id = oi.item_id
      LEFT JOIN categories c ON c.category_id = mi.category_id
      WHERE LOWER(o.status) = 'completed' ${where}
      GROUP BY mi.item_id, mi.name, c.name
      ORDER BY quantity_sold DESC, mi.name ASC
      LIMIT 10
    `);
    const statusRows = await conn.query(`
      SELECT status, COUNT(*) AS order_count
      FROM orders o
      WHERE 1 = 1 ${dateFilter ? `AND o.${dateFilter}` : ''}
      GROUP BY status
      ORDER BY order_count DESC
    `);
    const summary = summaryRows[0] || {};
    return res.json({
      timeframe,
      totalRevenue: Number(summary.revenue || 0),
      completedOrders: Number(summary.completed_orders || 0),
      averageOrderValue: Number(summary.average_order_value || 0),
      topItem: popularItems[0] ? {
        name: popularItems[0].item_name,
        category: popularItems[0].category_name,
        quantitySold: Number(popularItems[0].quantity_sold),
      } : null,
      popularItems: popularItems.map((item) => ({
        name: item.item_name,
        category: item.category_name,
        quantitySold: Number(item.quantity_sold),
      })),
      statuses: statusRows.map((row) => ({ status: row.status, count: Number(row.order_count) })),
    });
  } catch (error) {
    return next(error);
  } finally {
    if (conn) conn.release();
  }
}

export async function updateOrderStatus(req, res){

  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Order status is required',
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Order #${id} status updated to '${status}'`,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};

export async function createMenuItem(req, res){
  const { name, description, price, category_id: categoryId, image_url } = req.body;

  if (
    !name ||
    price === undefined ||
    !Number.isInteger(Number(categoryId)) ||
    Number(categoryId) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Name, price, and a valid category are required',
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(
      `INSERT INTO menu_items (category_id, name, description, price, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        Number(categoryId),
        name,
        description || null,
        price,
        image_url || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: {
        id: Number(result.insertId),
        name,
        description,
        price,
        category_id: Number(categoryId),
        image_url,
      },
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};

export async function updateMenuItem(req, res) {
  const { id } = req.params;
  const updates = req.body || {};
  const allowedFields = new Set(['category_id', 'name', 'description', 'price', 'image_url', 'tags']);

  if (
    updates.category_id !== undefined &&
    (!Number.isInteger(Number(updates.category_id)) || Number(updates.category_id) <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: 'A valid category_id is required',
    });
  }

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (!allowedFields.has(key)) continue;
    fields.push(`${key} = ?`);
    values.push(key === 'category_id' ? Number(value) : value);
  }

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid menu fields provided for update',
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();


    values.push(id);

    const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE item_id = ?`;
    const result = await conn.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Menu item #${id} updated successfully`,
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};
export async function deleteMenuItem(req, res){
  const { id } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query('DELETE FROM menu_items WHERE item_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Menu item #${id} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};
