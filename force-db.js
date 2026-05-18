require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function forceSync() {
  try {
    console.log("Connecting directly to Neon Database...");
    await client.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS "MenuItem" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "imageUrl" TEXT,
          "isAvailable" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log("SUCCESS: MenuItem table created manually! ✅");
  } catch (err) {
    console.error("Database Bypass Error:", err.message);
  } finally {
    await client.end();
  }
}

forceSync();
