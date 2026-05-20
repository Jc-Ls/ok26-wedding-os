require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function syncNewFields() {
  try {
    await client.connect();
    await client.query(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "souvenirNudge" BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "nudgeCount" INTEGER DEFAULT 0;`);
    await client.query(`ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'Pending';`);
    console.log("SUCCESS: Database synced with Wow Factors! ✅");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}
syncNewFields();
