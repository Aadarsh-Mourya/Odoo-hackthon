const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
});

// Get featured items (latest approved items for homepage)
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, u.first_name, u.last_name, c.name as category_name
      FROM items i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.is_available = TRUE AND i.is_approved = TRUE
      ORDER BY i.created_at DESC
      LIMIT 8
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    res.status(500).json({ error: 'Server error fetching featured items' });
  }
});

// Get platform statistics for public view
router.get('/stats', async (req, res) => {
  try {
    const [itemsResult, usersResult, redemptionsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total_items FROM items WHERE is_approved = TRUE'),
      pool.query('SELECT COUNT(*) as total_users FROM users WHERE is_admin = FALSE'),
      pool.query('SELECT COUNT(*) as total_exchanges FROM redemptions WHERE status = \'completed\'')
    ]);

    const stats = {
      totalItems: parseInt(itemsResult.rows[0].total_items),
      totalUsers: parseInt(usersResult.rows[0].total_users),
      totalExchanges: parseInt(redemptionsResult.rows[0].total_exchanges)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({ error: 'Server error fetching statistics' });
  }
});

module.exports = router;
