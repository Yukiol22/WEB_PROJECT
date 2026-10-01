import pool from '../config/database.js';

export async function getAllOrders(req, res){
  let conn;
  try {
    conn = await pool.getConnection();

    const orders = await conn.query(`
      SELECT 
        o.id AS order_id,
        o.total_amount,
        o.status,
        o.created_at,
        u.id AS user_id,
        u.name AS customer_name,
        u.email AS customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
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
      'UPDATE orders SET status = ? WHERE id = ?',
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
  const { name, description, price, category, image_url, is_available } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Name and price are required fields',
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(
      `INSERT INTO menu_items (name, description, price, category, image_url, is_available) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        category || 'General',
        image_url || null,
        is_available ?? true,
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
        category,
        image_url,
        is_available: is_available ?? true,
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
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields provided for update',
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();


    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(id);

    const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`;
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

    const result = await conn.query('DELETE FROM menu_items WHERE id = ?', [id]);

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