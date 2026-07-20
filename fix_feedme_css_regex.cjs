const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

// 1. Grid gap & columns
code = code.replace(
  /#page-feedme-pos \.feedme-brand-grid \{[\s\S]*?gap: clamp\(1\.7rem, 3vw, 3\.35rem\) clamp\(2\.2rem, 4vw, 4\.8rem\);\s*\}/,
  `#page-feedme-pos .feedme-brand-grid {
          align-items: center;
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }`
);

// 2. Item dimensions
code = code.replace(
  /#page-feedme-pos \.feedme-brand-item \{[\s\S]*?min-height: 200px;\s*\}/,
  `#page-feedme-pos .feedme-brand-item {
          align-items: center;
          display: flex;
          justify-content: center;
          min-height: 180px;
        }`
);

// 3. Img dimensions
code = code.replace(
  /#page-feedme-pos \.feedme-brand-item img \{[\s\S]*?max-width: 400px;[\s\S]*?width: 100%;\s*\}/,
  `#page-feedme-pos .feedme-brand-item img {
          display: block;
          height: auto;
          max-height: 160px;
          max-width: 320px;
          object-fit: contain;
          width: 100%;
        }`
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("CSS replaced with regex");
