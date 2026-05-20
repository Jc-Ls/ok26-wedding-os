const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
require('dotenv').config();

async function exportVips() {
  const sql = neon(process.env.DATABASE_URL);
  const codes = await sql`SELECT code FROM "VipPass" ORDER BY "createdAt" DESC`;
  
  const csvContent = "VIP_CODE\n" + codes.map(row => row.code).join("\n");
  fs.writeFileSync('vip_codes.csv', csvContent);
  
  console.log("\n====================================");
  console.log("SUCCESS: vip_codes.csv created! ✅");
  console.log("To download this file, use a file manager app to find it in: ");
  console.log("/data/data/com.termux/files/home/ok26-wedding-os/vip_codes.csv");
  console.log("====================================\n");
}
exportVips();
