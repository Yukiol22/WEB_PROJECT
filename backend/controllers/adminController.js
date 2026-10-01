import pool from '../config/database.js';

export async function getAllOrders(req, res){
  let conn;
  try {
    conn = await pool.getConnection();

    const orders = await conn.query(`
      SELECT 
        o.order_id,
        o.total_amount,
        o.status,
        o.pickup_time AS created_at,
        o.customer_id AS user_id,
        u.name AS customer_name,
        u.email AS customer_email
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
      ORDER BY o.pickup_time DESC, o.order_id DESC
    `);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};

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
