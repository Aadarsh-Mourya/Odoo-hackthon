const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's redemption history
router.get('/my-redemptions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, i.title as item_title, i.images, 
             u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM redemptions r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON r.owner_id = u.id
      WHERE r.redeemer_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ error: 'Server error fetching redemptions' });
  }
});

// Get items the user has had redeemed by others
router.get('/my-items-redeemed', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, i.title as item_title, i.images,
             u.first_name as redeemer_first_name, u.last_name as redeemer_last_name
      FROM redemptions r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON r.redeemer_id = u.id
      WHERE r.owner_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching item redemptions:', error);
    res.status(500).json({ error: 'Server error fetching item redemptions' });
  }
});

module.exports = router;
