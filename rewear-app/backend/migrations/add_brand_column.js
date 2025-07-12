const pool = require('../config/database');

async function addBrandColumn() {
  const client = await pool.connect();
  try {
    console.log('Starting migration: Adding brand column to items table');
    
    // Check if the column already exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'items' AND column_name = 'brand'
    `);
    
    if (checkResult.rows.length === 0) {
      // Column doesn't exist, add it
      await client.query(`
        ALTER TABLE items 
        ADD COLUMN brand VARCHAR(255)
      `);
      console.log('Successfully added brand column to items table');
    } else {
      console.log('Brand column already exists in items table');
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.release();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addBrandColumn()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}

module.exports = { addBrandColumn };
