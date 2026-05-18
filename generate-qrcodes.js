const QRCode = require('qrcode');
const fs = require('fs');

// 🚨 UPDATE THIS LINK BEFORE RUNNING THE SCRIPT! 🚨
// Ensure it ends with /menu?table=
const BASE_URL = 'https://ok26-wedding-os.vercel.app/menu?table=';
const TOTAL_TABLES = 50;

if (!fs.existsSync('./qrcodes')) {
  fs.mkdirSync('./qrcodes');
}

async function generateCodes() {
  console.log("Starting M'K26 Direct Menu QR Code Generation...");
  
  for (let i = 1; i <= TOTAL_TABLES; i++) {
    const url = `${BASE_URL}${i}`;
    const filename = `./qrcodes/Table_${i}.png`;
    
    await QRCode.toFile(filename, url, {
      color: { dark: '#06140F', light: '#FDFBF7' },
      width: 800,
      margin: 2
    });
    console.log(`✅ Generated: Table ${i}`);
  }
  console.log("🎉 SUCCESS: Your direct Menu QR codes are ready for the printer!");
}
generateCodes();
