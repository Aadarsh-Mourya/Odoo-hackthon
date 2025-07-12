const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all pending items for approval
router.get('/pending-items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, u.first_name, u.last_name, u.email, c.name as category_name
      FROM items i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.is_approved = FALSE
      ORDER BY i.created_at ASC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching pending items:', error);
    res.status(500).json({ error: 'Server error fetching pending items' });
  }
});

// Approve item
router.post('/approve-item/:id', authenticateToken, requireAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Get item details
    const itemResult = await client.query('SELECT * FROM items WHERE id = $1', [id]);
    
    if (itemResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = itemResult.rows[0];

    if (item.is_approved) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Item is already approved' });
    }

    // Approve the item
    await client.query('UPDATE items SET is_approved = TRUE WHERE id = $1', [id]);

    // Award points to the item owner
    await client.query(
      'UPDATE users SET points = points + $1 WHERE id = $2',
      [item.point_value, item.user_id]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Item approved successfully',
      pointsAwarded: item.point_value
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving item:', error);
    res.status(500).json({ error: 'Server error approving item' });
  } finally {
    client.release();
  }
});

// Reject item
router.post('/reject-item/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Delete the rejected item
    await pool.query('DELETE FROM items WHERE id = $1', [id]);

    res.json({ message: 'Item rejected and removed successfully' });

  } catch (error) {
    console.error('Error rejecting item:', error);
    res.status(500).json({ error: 'Server error rejecting item' });
  }
});

// Get platform statistics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [usersResult, itemsResult, redemptionsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total_users FROM users WHERE is_admin = FALSE'),
      pool.query('SELECT COUNT(*) as total_items, COUNT(*) FILTER (WHERE is_approved = TRUE) as approved_items, COUNT(*) FILTER (WHERE is_available = FALSE) as redeemed_items FROM items'),
      pool.query('SELECT COUNT(*) as total_redemptions, SUM(points_used) as total_points_used FROM redemptions')
    ]);

    const stats = {
      totalUsers: parseInt(usersResult.rows[0].total_users),
      totalItems: parseInt(itemsResult.rows[0].total_items),
      approvedItems: parseInt(itemsResult.rows[0].approved_items),
      redeemedItems: parseInt(itemsResult.rows[0].redeemed_items),
      totalRedemptions: parseInt(redemptionsResult.rows[0].total_redemptions),
      totalPointsCirculated: parseInt(redemptionsResult.rows[0].total_points_used) || 0
    };

    res.json(stats);

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error fetching statistics' });
  }
});

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, first_name, last_name, points, is_admin, created_at,
             (SELECT COUNT(*) FROM items WHERE user_id = users.id) as items_listed,
             (SELECT COUNT(*) FROM redemptions WHERE redeemer_id = users.id) as items_redeemed
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Remove user (and all their items)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user (cascade will handle items and redemptions)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'User removed successfully' });

  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ error: 'Server error removing user' });
  }
});

module.exports = router;
