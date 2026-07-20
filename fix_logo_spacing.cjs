const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

code = code.replace(
  /#page-feedme-pos \.feedme-brand-grid \{[\s\S]*?gap: clamp[\s\S]*?\}/,
  `#page-feedme-pos .feedme-brand-grid {
          align-items: center;
          display: grid;
          gap: clamp(1.5rem, 4vw, 3.5rem);
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }`
);

code = code.replace(
  /#page-feedme-pos \.feedme-brand-item \{[\s\S]*?min-height: 180px;\s*\}/,
  `#page-feedme-pos .feedme-brand-item {
          align-items: center;
          display: flex;
          justify-content: center;
          min-height: 180px;
          padding: clamp(0.5rem, 1.5vw, 1.5rem);
        }`
);

code = code.replace(
  /#page-feedme-pos \.feedme-brand-item img \{[\s\S]*?max-height: 160px;\s*max-width: 320px;\s*object-fit: contain;\s*width: 100%;\s*\}/,
  `#page-feedme-pos .feedme-brand-item img {
          display: block;
          height: auto;
          max-height: 140px;
          max-width: 100%;
          object-fit: contain;
          width: 100%;
        }`
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("Improved logo spacing for a natural look.");
