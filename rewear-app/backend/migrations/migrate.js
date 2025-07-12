const pool = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        points INTEGER DEFAULT 0,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        type VARCHAR(100),
        size VARCHAR(50),
        condition VARCHAR(100),
        point_value INTEGER NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        is_approved BOOLEAN DEFAULT FALSE,
        images TEXT[], -- Array of image filenames
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create redemptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS redemptions (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        redeemer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        points_used INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default categories
    await client.query(`
      INSERT INTO categories (name) VALUES 
        ('Tops'), ('Bottoms'), ('Dresses'), ('Outerwear'), 
        ('Shoes'), ('Accessories'), ('Activewear'), ('Formal')
      ON CONFLICT (name) DO NOTHING
    `);

    // Create admin user if it doesn't exist
    const bcrypt = require('bcryptjs');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rewear.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, is_admin, points)
      VALUES ($1, $2, 'Admin', 'User', TRUE, 1000)
      ON CONFLICT (email) DO NOTHING
    `, [adminEmail, hashedPassword]);

    console.log('Database tables created successfully!');
    console.log(`Admin user created with email: ${adminEmail}`);
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  createTables().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = createTables;
