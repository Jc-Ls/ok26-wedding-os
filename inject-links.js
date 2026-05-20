const fs = require('fs');
const files = [
  'src/app/admin/page.tsx',
  'src/app/admin/kitchen/page.tsx',
  'src/app/admin/vip/page.tsx',
  'src/app/admin/reservations/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Add import if missing
    if (!content.includes("import Link from 'next/link'")) {
      content = "import Link from 'next/link';\n" + content;
    }
    // Swap <a> for <Link> (Handles standard and className/style attributes)
    content = content.replace(/<a /g, '<Link ').replace(/<\/a>/g, '</Link>');
    fs.writeFileSync(file, content);
    console.log(`Patched: ${file}`);
  }
});
