const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
require('dotenv').config();

async function forceVips() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log("1. Fixing VIP table in Neon Database...");
    await sql`DROP TABLE IF EXISTS "VipPass"`;
    await sql`CREATE TABLE "VipPass" (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, code TEXT UNIQUE NOT NULL, "isUsed" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP DEFAULT NOW())`;
    
    console.log("2. Generating 50 secure codes...");
    for (let i = 0; i < 50; i++) {
      const code = `MK26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      await sql`INSERT INTO "VipPass" (code, "isUsed") VALUES (${code}, false)`;
    }

    console.log("3. Exporting to CSV...");
    const codes = await sql`SELECT code FROM "VipPass" ORDER BY "createdAt" DESC LIMIT 50`;
    const csvContent = "VIP_CODE\n" + codes.map(row => row.code).join("\n");
    fs.writeFileSync('vip_codes.csv', csvContent);
    
    console.log("\n====================================");
    console.log("SUCCESS! VIP codes generated and saved to vip_codes.csv ✅");
    console.log("Run 'cat vip_codes.csv' to see them!");
    console.log("====================================\n");
  } catch (err) {
    console.error("Database Error:", err.message);
  }
}
forceVips();
