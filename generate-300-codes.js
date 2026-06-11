const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
require('dotenv').config();

async function generate300Codes() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log("🔧 Generating 300 reservation codes...\n");
    
    // Clear existing data
    console.log("🧹 Clearing old VipPass data...");
    await sql`DELETE FROM "VipPass"`;
    
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ123456789';
    const newCodes = [];
    
    // Generate 300 unique codes
    console.log("📝 Creating code batch...");
    for (let i = 0; i < 300; i++) {
      let randomPart = '';
      for (let j = 0; j < 5; j++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      newCodes.push(`MK26-${randomPart}`);
    }
    
    // Insert all codes
    console.log("💾 Inserting 300 codes into database...");
    for (let i = 0; i < newCodes.length; i++) {
      await sql`INSERT INTO "VipPass" (code, "isUsed") VALUES (${newCodes[i]}, false)`;
      if ((i + 1) % 50 === 0) {
        console.log(`   ✓ ${i + 1}/300 codes inserted`);
      }
    }
    console.log(`✅ All 300 codes inserted!\n`);
    
    // Export to CSV
    console.log("📊 Exporting to CSV...");
    const csvContent = "RESERVATION_CODE\n" + newCodes.join("\n");
    fs.writeFileSync('vip_codes.csv', csvContent);
    
    console.log("\n====================================");
    console.log("✅ SUCCESS! 300 codes generated");
    console.log("📁 Saved to: vip_codes.csv");
    console.log("📊 Total codes: " + newCodes.length);
    console.log("====================================\n");
    
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

generate300Codes();
