import pool from '../config/database.js';

export async function submitFeedback(req, res, next) {
  const rating = Number(req.body?.rating);
  const comment = typeof req.body?.comment === 'string' ? req.body.comment.trim() : '';

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Choose a rating from 1 to 5 stars' });
  }
  if (!comment || comment.length > 2000) {
    return res.status(400).json({ error: 'Feedback must be between 1 and 2000 characters' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(
      `INSERT INTO customer_feedback (customer_id, rating, comment)
       VALUES (?, ?, ?)`,
      [req.user.userId, rating, comment]
    );
    return res.status(201).json({
      message: 'Thank you for your feedback',
      feedbackId: Number(result.insertId),
    });
  } catch (error) {
    return next(error);
  } finally {
    if (connection) connection.release();
  }
}

export async function getCustomerFeedback(req, res, next) {
  let connection;
  try {
    connection = await pool.getConnection();
    const rows = await connection.query(
      `SELECT f.feedback_id, f.customer_id, u.name AS customer_name, u.email,
              f.rating, f.comment, f.created_at
       FROM customer_feedback f
       LEFT JOIN users u ON u.user_id = f.customer_id
       ORDER BY f.created_at DESC, f.feedback_id DESC`
    );
    return res.json(rows.map((row) => ({
      feedbackId: Number(row.feedback_id),
      customerId: Number(row.customer_id),
      customerName: row.customer_name || 'Customer',
      email: row.email,
      rating: Number(row.rating),
      comment: row.comment,
      createdAt: row.created_at,
    })));
  } catch (error) {
    return next(error);
  } finally {
    if (connection) connection.release();
  }
}
