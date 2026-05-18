require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function masterSync() {
  try {
    console.log("Connecting directly to Neon Database...");
    await client.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL,
        "tableNumber" TEXT NOT NULL,
        "guestName" TEXT,
        "guestPhone" TEXT,
        "mealName" TEXT,
        "drinkName" TEXT,
        "withSalad" BOOLEAN NOT NULL DEFAULT false,
        "status" TEXT NOT NULL DEFAULT 'SENT',
        "deliveredBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "ConciergeRequest" (
        "id" TEXT NOT NULL,
        "tableNumber" TEXT NOT NULL,
        "guestName" TEXT NOT NULL,
        "requestType" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ConciergeRequest_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "VipPass" (
        "id" TEXT NOT NULL,
        "code" TEXT NOT NULL,
        "isUsed" BOOLEAN NOT NULL DEFAULT false,
        "usedBy" TEXT,
        "usedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "VipPass_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log("SUCCESS: All master tables (Order, VIP, Concierge) created! ✅");
  } catch (err) {
    console.error("Database Bypass Error:", err.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

masterSync();
