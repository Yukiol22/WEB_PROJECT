import pool from '../config/database.js';

export async function createOrder(req, res, next) {
  let connection;

  try {
    const {
      items,
      orderType = 'pickup',
      pickupTime,
      customerNote,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Order must contain at least one item',
      });
    }

    if (!['pickup', 'delivery'].includes(orderType)) {
      return res.status(400).json({
        error: 'Invalid order type',
      });
    }

    connection = await pool.getConnection();

    await connection.beginTransaction();

    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {
      const itemId = Number(item.itemId);
      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(itemId) ||
        itemId <= 0 ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        await connection.rollback();

        return res.status(400).json({
          error: 'Invalid order item',
        });
      }

      const rows = await connection.query(
        `
        SELECT
          item_id,
          name,
          price,
          is_available
        FROM menu_items
        WHERE item_id = ?
        LIMIT 1
        `,
        [itemId]
      );

      if (rows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          error: `Menu item ${itemId} was not found`,
        });
      }

      const menuItem = rows[0];

      if (!menuItem.is_available) {
        await connection.rollback();

        return res.status(400).json({
          error: `${menuItem.name} is not available`,
        });
      }

      const unitPrice = Number(menuItem.price);

      totalAmount += unitPrice * quantity;

      orderItems.push({
        itemId,
        name: menuItem.name,
        quantity,
        unitPrice,
        specialInstructions:
          item.specialInstructions || null,
      });
    }

    const orderResult = await connection.query(
      `
      INSERT INTO orders (
        customer_id,
        status,
        order_type,
        pickup_time,
        customer_note,
        total_amount
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.userId,
        'pending',
        orderType,
        pickupTime || null,
        customerNote || null,
        totalAmount,
      ]
    );

    const orderId = Number(orderResult.insertId);

    for (const item of orderItems) {
      await connection.query(
        `
        INSERT INTO order_items (
          order_id,
          item_id,
          quantity,
          unit_price,
          item_name,
          special_instructions
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.itemId,
          item.quantity,
          item.unitPrice,
          item.name,
          item.specialInstructions,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        orderId,
        status: 'pending',
        orderType,
        pickupTime: pickupTime || null,
        totalAmount,
        items: orderItems,
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }

    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function getMyOrders(req, res, next) {
  let connection;

  try {
    connection = await pool.getConnection();

    const orders = await connection.query(
      `
      SELECT
        order_id,
        status,
        order_type,
        pickup_time,
        customer_note,
        total_amount,
        created_at,
        updated_at
      FROM orders
      WHERE customer_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.userId]
    );

    res.json(
      orders.map((order) => ({
        orderId: Number(order.order_id),
        status: order.status,
        orderType: order.order_type,
        pickupTime: order.pickup_time,
        customerNote: order.customer_note,
        totalAmount: Number(order.total_amount),
        createdAt: order.created_at,
        updatedAt: order.updated_at,
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

export async function getOrder(req, res, next) {
  let connection;

  try {
    const orderId = Number(req.params.id);

    connection = await pool.getConnection();

    const orders = await connection.query(
      `
      SELECT
        order_id,
        customer_id,
        status,
        order_type,
        pickup_time,
        customer_note,
        total_amount,
        created_at,
        updated_at
      FROM orders
      WHERE order_id = ?
        AND customer_id = ?
      LIMIT 1
      `,
      [orderId, req.user.userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    const order = orders[0];

    const items = await connection.query(
      `
      SELECT
        order_item_id,
        item_id,
        item_name,
        quantity,
        unit_price,
        special_instructions
      FROM order_items
      WHERE order_id = ?
      ORDER BY order_item_id ASC
      `,
      [orderId]
    );

    res.json({
      orderId: Number(order.order_id),
      status: order.status,
      orderType: order.order_type,
      pickupTime: order.pickup_time,
      customerNote: order.customer_note,
      totalAmount: Number(order.total_amount),
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: items.map((item) => ({
        orderItemId: Number(item.order_item_id),
        itemId: Number(item.item_id),
        name: item.item_name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unit_price),
        specialInstructions: item.special_instructions,
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