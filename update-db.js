require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateSync() {
  try {
    console.log("Connecting directly to Neon Database...");
    await client.connect();
    
    await client.query(`
      ALTER TABLE "Order" 
      ADD COLUMN IF NOT EXISTS "deliveredBy" TEXT;
    `);
    
    console.log("SUCCESS: Analytics column added to Orders! ✅");
  } catch (err) {
    console.error("Database Bypass Error:", err.message);
  } finally {
    await client.end();
    process.exit(0); // <--- This prevents the terminal from hanging!
  }
}

updateSync();
