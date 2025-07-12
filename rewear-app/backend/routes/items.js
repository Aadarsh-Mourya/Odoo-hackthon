const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for item creation
const createItemLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 item creations per windowMs
  message: 'Too many items created, please try again later.'
});

// Get all approved items with filters
router.get('/', async (req, res) => {
  try {
    const { category, size, condition, minPoints, maxPoints, search, page = 1, limit = 12 } = req.query;
    
    let query = `
      SELECT i.*, u.first_name, u.last_name, c.name as category_name
      FROM items i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.is_available = TRUE AND i.is_approved = TRUE
    `;
    
    const queryParams = [];
    let paramCount = 0;

    // Add filters
    if (category) {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      queryParams.push(category);
    }

    if (size) {
      paramCount++;
      query += ` AND i.size = $${paramCount}`;
      queryParams.push(size);
    }

    if (condition) {
      paramCount++;
      query += ` AND i.condition = $${paramCount}`;
      queryParams.push(condition);
    }

    if (minPoints) {
      paramCount++;
      query += ` AND i.point_value >= $${paramCount}`;
      queryParams.push(parseInt(minPoints));
    }

    if (maxPoints) {
      paramCount++;
      query += ` AND i.point_value <= $${paramCount}`;
      queryParams.push(parseInt(maxPoints));
    }

    if (search) {
      paramCount++;
      query += ` AND (i.title ILIKE $${paramCount} OR i.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add pagination
    query += ` ORDER BY i.created_at DESC`;
    
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    queryParams.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM items i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.is_available = TRUE AND i.is_approved = TRUE
    `;
    
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      items: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error fetching items' });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT i.*, u.first_name, u.last_name, u.email, c.name as category_name
      FROM items i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error fetching item' });
  }
});

// Create new item
router.post('/', authenticateToken, createItemLimit, upload.array('images', 5), [
  body('title').notEmpty().trim().isLength({ max: 255 }),
  body('description').optional().trim(),
  body('categoryId').isInt(),
  body('type').optional().trim(),
  body('size').notEmpty().trim(),
  body('condition').notEmpty().trim(),
  body('pointValue').isInt({ min: 1 }),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, categoryId, type, size, condition, pointValue, tags } = req.body;
    
    // Process uploaded images
    const images = req.files ? req.files.map(file => file.filename) : [];
    
    if (images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // Verify category exists
    const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const result = await pool.query(`
      INSERT INTO items (user_id, title, description, category_id, type, size, condition, point_value, images, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [req.user.id, title, description, categoryId, type, size, condition, pointValue, images, tags || []]);

    const item = result.rows[0];

    res.status(201).json({
      message: 'Item created successfully and pending approval',
      item
    });

  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Server error creating item' });
  }
});

// Get user's items
router.get('/user/my-items', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, c.name as category_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ error: 'Server error fetching user items' });
  }
});

// Update item
router.put('/:id', authenticateToken, [
  body('title').optional().notEmpty().trim().isLength({ max: 255 }),
  body('description').optional().trim(),
  body('type').optional().trim(),
  body('condition').optional().notEmpty().trim(),
  body('pointValue').optional().isInt({ min: 1 }),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, type, condition, pointValue, tags } = req.body;

    // Check if item belongs to user
    const itemCheck = await pool.query('SELECT user_id FROM items WHERE id = $1', [id]);
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own items' });
    }

    const result = await pool.query(`
      UPDATE items 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          type = COALESCE($3, type),
          condition = COALESCE($4, condition),
          point_value = COALESCE($5, point_value),
          tags = COALESCE($6, tags),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [title, description, type, condition, pointValue, tags, id]);

    res.json({
      message: 'Item updated successfully',
      item: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Server error updating item' });
  }
});

// Delete item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item belongs to user
    const itemCheck = await pool.query('SELECT user_id, is_available FROM items WHERE id = $1', [id]);
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own items' });
    }

    if (!itemCheck.rows[0].is_available) {
      return res.status(400).json({ error: 'Cannot delete item that has been redeemed' });
    }

    await pool.query('DELETE FROM items WHERE id = $1', [id]);

    res.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Server error deleting item' });
  }
});

// Redeem item with points
router.post('/:id/redeem', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Get item details
    const itemResult = await client.query(`
      SELECT * FROM items WHERE id = $1 AND is_available = TRUE AND is_approved = TRUE
    `, [id]);

    if (itemResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Item not found or not available' });
    }

    const item = itemResult.rows[0];

    // Check if user is trying to redeem their own item
    if (item.user_id === req.user.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot redeem your own item' });
    }

    // Check if user has enough points
    if (req.user.points < item.point_value) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Deduct points from redeemer
    await client.query(
      'UPDATE users SET points = points - $1 WHERE id = $2',
      [item.point_value, req.user.id]
    );

    // Mark item as unavailable
    await client.query(
      'UPDATE items SET is_available = FALSE WHERE id = $1',
      [id]
    );

    // Create redemption record
    await client.query(`
      INSERT INTO redemptions (item_id, redeemer_id, owner_id, points_used, status)
      VALUES ($1, $2, $3, $4, 'completed')
    `, [id, req.user.id, item.user_id, item.point_value]);

    await client.query('COMMIT');

    res.json({
      message: 'Item redeemed successfully',
      pointsUsed: item.point_value,
      remainingPoints: req.user.points - item.point_value
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error redeeming item:', error);
    res.status(500).json({ error: 'Server error redeeming item' });
  } finally {
    client.release();
  }
});

module.exports = router;
