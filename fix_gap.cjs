const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

code = code.replace(
  /#page-feedme-pos \.feedme-brand-panel \{[\s\S]*?padding: 0;[\s\S]*?\}/,
  `#page-feedme-pos .feedme-brand-panel {
          background: #ffffff;
          border: 1px solid rgba(85, 82, 74, 0.06);
          border-radius: 22px;
          box-shadow: none;
          max-width: 1600px;
          overflow: hidden;
          padding: clamp(1rem, 2.5vw, 2rem);
          margin-bottom: clamp(3rem, 6vw, 5rem);
          width: 100%;
        }`
);

code = code.replace(
  /#page-feedme-pos \.feedme-brand-grid \{[\s\S]*?gap: 0;[\s\S]*?\}/,
  `#page-feedme-pos .feedme-brand-grid {
          align-items: center;
          display: grid;
          gap: clamp(0.75rem, 1.5vw, 1.25rem);
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }`
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("FeedMe brand CSS spacing restored slightly.");
