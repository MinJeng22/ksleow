const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

code = code.replace(
  /`\}\s*\.feedme-ecosystem-section \{([\s\S]*?)\}\s*<\/style>/,
  `.feedme-ecosystem-section {$1}\n      \`}</style>`
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("Fixed JSX CSS");
