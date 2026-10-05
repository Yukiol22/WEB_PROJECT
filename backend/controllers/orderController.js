import pool from '../config/database.js';

export async function createOrder(req, res, next) {
  let connection;

  try {
    const { items, orderType = 'pickup', pickupTime } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!['pickup', 'delivery'].includes(orderType)) {
      return res.status(400).json({ error: 'Invalid order type' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const itemId = Number(item.itemId);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(itemId) || itemId <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
        await connection.rollback();
        return res.status(400).json({ error: 'Invalid order item' });
      }

      const rows = await connection.query(
        `SELECT item_id, name, price FROM menu_items WHERE item_id = ? LIMIT 1`,
        [itemId]
      );

      if (rows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: `Menu item ${itemId} was not found` });
      }

      const menuItem = rows[0];
      const unitPrice = Number(menuItem.price);
      totalAmount += unitPrice * quantity;
      orderItems.push({
        itemId,
        name: menuItem.name,
        quantity,
        unitPrice,
      });
    }

    const orderResult = await connection.query(
      `INSERT INTO orders (customer_id, status, pickup_time, total_amount, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [req.user.userId, 'pending', pickupTime || null, totalAmount]
    );

    const orderId = Number(orderResult.insertId);
    const createdRows = await connection.query(
      'SELECT created_at FROM orders WHERE order_id = ?',
      [orderId]
    );

    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)`,
        [orderId, item.itemId, item.quantity]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Order created successfully',
      order: {
        orderId,
        status: 'pending',
        orderType,
        pickupTime: pickupTime || null,
        createdAt: createdRows[0]?.created_at || null,
        totalAmount,
        items: orderItems,
      },
    });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch {}
    }
    return next(error);
  } finally {
    if (connection) connection.release();
  }
}

export async function getMyOrders(req, res, next) {
  let connection;

  try {
    connection = await pool.getConnection();
    const rows = await connection.query(
      `SELECT o.order_id, o.status, o.pickup_time, o.created_at, o.total_amount,
              oi.order_item_id, oi.item_id, mi.name, oi.quantity, mi.price
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.order_id
       LEFT JOIN menu_items mi ON mi.item_id = oi.item_id
       WHERE o.customer_id = ?
       ORDER BY o.order_id DESC, oi.order_item_id ASC`,
      [req.user.userId]
    );

    const ordersById = new Map();
    for (const row of rows) {
      let order = ordersById.get(row.order_id);
      if (!order) {
        order = {
          orderId: Number(row.order_id),
          status: row.status,
          pickupTime: row.pickup_time,
          createdAt: row.created_at,
          totalAmount: Number(row.total_amount),
          items: [],
        };
        ordersById.set(row.order_id, order);
      }

      if (row.item_id !== null) {
        order.items.push({
          itemId: Number(row.item_id),
          name: row.name || 'Menu item',
          quantity: Number(row.quantity),
          unitPrice: Number(row.price || 0),
        });
      }
    }

    return res.json([...ordersById.values()]);
  } catch (error) {
    return next(error);
  } finally {
    if (connection) connection.release();
  }
}

export async function getOrder(req, res, next) {
  let connection;

  try {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    connection = await pool.getConnection();
    const orders = await connection.query(
      `SELECT order_id, customer_id, status, pickup_time, created_at, total_amount FROM orders WHERE order_id = ? AND customer_id = ? LIMIT 1`,
      [orderId, req.user.userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];
    const items = await connection.query(
      `SELECT oi.order_item_id, oi.item_id, mi.name, oi.quantity, mi.price
       FROM order_items oi
       LEFT JOIN menu_items mi ON mi.item_id = oi.item_id
       WHERE oi.order_id = ?
       ORDER BY oi.order_item_id ASC`,
      [orderId]
    );

    return res.json({
      orderId: Number(order.order_id),
      status: order.status,
      pickupTime: order.pickup_time,
      createdAt: order.created_at,
      totalAmount: Number(order.total_amount),
      items: items.map((item) => ({
        orderItemId: Number(item.order_item_id),
        itemId: Number(item.item_id),
        name: item.name || 'Menu item',
        quantity: Number(item.quantity),
        unitPrice: Number(item.price || 0),
      })),
    });
  } catch (error) {
    return next(error);
  } finally {
    if (connection) connection.release();
  }
}

export async function getKitchenOrders(req, res, next) {
  let connection;

  try {
    connection = await pool.getConnection();
    const rows = await connection.query(
      `SELECT o.order_id, o.status, o.pickup_time, o.created_at, o.total_amount,
              u.name AS customer_name, oi.item_id, mi.name AS item_name, oi.quantity
       FROM orders o
       JOIN users u ON u.user_id = o.customer_id
       LEFT JOIN order_items oi ON oi.order_id = o.order_id
       LEFT JOIN menu_items mi ON mi.item_id = oi.item_id
       WHERE LOWER(o.status) NOT IN ('completed', 'cancelled')
       ORDER BY o.order_id ASC, oi.order_item_id ASC`
    );

    const ordersById = new Map();
    for (const row of rows) {
      let order = ordersById.get(row.order_id);
      if (!order) {
        order = {
          order_id: Number(row.order_id),
          customer_name: row.customer_name,
          status: row.status,
          pickup_time: row.pickup_time,
          created_at: row.created_at,
          total_amount: Number(row.total_amount),
          items: [],
        };
        ordersById.set(row.order_id, order);
      }

      if (row.item_id !== null) {
        order.items.push({
          name: row.item_name || 'Menu item',
          quantity: Number(row.quantity),
        });
      }
    }

    return res.json([...ordersById.values()]);
  } catch (error) {
    return next(error);
  } finally {
    if (connection) connection.release();
  }
}

export async function updateKitchenOrderStatus(req, res, next) {
  const orderId = Number(req.params.id);
  const status = String(req.body.status || '').toLowerCase();
  const allowedStatuses = ['pending', 'preparing', 'ready', 'completed'];

  if (!Number.isInteger(orderId) || orderId <= 0 || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order ID or status' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({ orderId, status });
  } catch (error) {
    return next(error);
  } finally {
    if (connection) connection.release();
  }
}
