const QRCode = require('qrcode');
const fs = require('fs');

const LIVE_URL = 'https://ok26-wedding-os.vercel.app/menu';
const START_TABLE = 1;
const END_TABLE = 50;

// Switched to Pure Black for maximum camera contrast speed
const QR_COLORS = { dark: '#000000', light: '#ffffff' };

const generateCodes = async () => {
  console.log("--- GENERATING HIGH-SPEED QR CODES ---");
  if (!fs.existsSync('./codes')) fs.mkdirSync('./codes');
  
  for (let i = START_TABLE; i <= END_TABLE; i++) {
    try {
      // Changed errorCorrectionLevel to 'M' to make the dots larger and faster to scan
      await QRCode.toFile(`./codes/table-${i}.png`, `${LIVE_URL}?table=${i}`, { color: QR_COLORS, errorCorrectionLevel: 'M', scale: 10, margin: 3 });
      console.log(`⚡ Fast Code Generated: Table ${i}`);
    } catch (err) {
      console.error(`❌ FAILED: Table ${i}`, err);
    }
  }
  console.log("--- FINISHED ---");
};

generateCodes();
