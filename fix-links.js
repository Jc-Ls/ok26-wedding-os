const fs = require('fs');
const path = './src/app/page.tsx';

try {
  let content = fs.readFileSync(path, 'utf8');
  
  // Add the import tag at the top if it's missing
  if (!content.includes("import Link from 'next/link'")) {
    content = "import Link from 'next/link';\n" + content;
  }
  
  // Swap standard anchor tags with Next.js Link tags
  content = content.replace(/<a /g, '<Link ').replace(/<\/a>/g, '</Link>');
  
  fs.writeFileSync(path, content);
  console.log("\n====================================");
  console.log("SUCCESS: Safely injected fast <Link> tags into your Homepage! 🚀");
  console.log("====================================\n");
} catch (err) {
  console.error("Error updating file:", err.message);
}
