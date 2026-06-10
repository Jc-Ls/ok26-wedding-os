const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
require('dotenv').config();

async function forceVips() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log("1. Fixing VIP table in Neon Database...");
    await sql`DROP TABLE IF EXISTS "VipPass"`;
    await sql`CREATE TABLE "VipPass" (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, code TEXT UNIQUE NOT NULL, "isUsed" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP DEFAULT NOW())`;
    
    console.log("2. Generating 300 secure codes...");
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ123456789';
    for (let i = 0; i < 300; i++) {
      let randomPart = '';
      for (let j = 0; j < 5; j++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const code = `OK26-${randomPart}`;
      await sql`INSERT INTO "VipPass" (code, "isUsed") VALUES (${code}, false)`;
    }

    console.log("3. Exporting to CSV...");
    const codes = await sql`SELECT code FROM "VipPass" ORDER BY "createdAt" DESC LIMIT 300`;
    const csvContent = "VIP_CODE\n" + codes.map(row => row.code).join("\n");
    fs.writeFileSync('vip_codes.csv', csvContent);
    
    console.log("\n====================================");
    console.log("SUCCESS! 300 Reservation codes generated and saved to vip_codes.csv ✅");
    console.log("Total codes: " + codes.length);
    console.log("Run 'cat vip_codes.csv' to see them!");
    console.log("====================================\n");
  } catch (err) {
    console.error("Database Error:", err.message);
  }
}
forceVips();
