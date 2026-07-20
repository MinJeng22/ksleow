const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

code = code.replace(
  /#page-feedme-pos \.feedme-brand-panel \{[\s\S]*?padding: clamp\(1\.6rem, 3\.8vw, 3\.35rem\);\s*width: 100%;\s*\}/,
  `#page-feedme-pos .feedme-brand-panel {
          background: #ffffff;
          border: 1px solid rgba(85, 82, 74, 0.06);
          border-radius: 22px;
          box-shadow: none;
          max-width: 1600px;
          overflow: hidden;
          padding: 0;
          margin-bottom: clamp(3rem, 6vw, 5rem);
          width: 100%;
        }`
);

code = code.replace(
  /#page-feedme-pos \.feedme-brand-grid \{[\s\S]*?gap: 1\.5rem;[\s\S]*?grid-template-columns: repeat\(5, minmax\(0, 1fr\)\);\s*\}/,
  `#page-feedme-pos .feedme-brand-grid {
          align-items: center;
          display: grid;
          gap: 0;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }`
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("Updated FeedMePOS.jsx CSS");
