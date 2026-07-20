const fs = require('fs');
let content = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

content = content.replace(
  '"/images/feedme-brands/brand-9.webp",',
  '"/images/feedme-brands/brand-9.webp",\n  "/images/feedme-brands/brand-10.png",'
);

content = content.replace(
  'max-height: 92px;',
  'max-height: 104px;'
);

content = content.replace(
  'max-width: 188px;',
  'max-width: 210px;'
);

content = content.replace(
  'min-height: 92px;',
  'min-height: 104px;'
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', content);
console.log("File updated!");
