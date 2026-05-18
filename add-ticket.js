require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function syncTicket() {
  try {
    await client.connect();
    await client.query(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "ticketId" TEXT;`);
    console.log("SUCCESS: Ticket ID added to Orders! ✅");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}
syncTicket();
