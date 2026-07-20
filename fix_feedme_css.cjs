const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

code = code.replace(
  '#page-feedme-pos .feedme-brand-grid {\n          align-items: center;\n          display: flex;\n          flex-wrap: wrap;\n          justify-content: center;\n          gap: clamp(1.7rem, 3vw, 3.35rem) clamp(2.2rem, 4vw, 4.8rem);\n        }',
  '#page-feedme-pos .feedme-brand-grid {\n          align-items: center;\n          display: grid;\n          gap: 1.5rem;\n          grid-template-columns: repeat(5, minmax(0, 1fr));\n        }'
);

code = code.replace(
  '#page-feedme-pos .feedme-brand-item {\n          align-items: center;\n          display: flex;\n          justify-content: center;\n          flex: 0 0 auto;\n          min-height: 200px;\n        }',
  '#page-feedme-pos .feedme-brand-item {\n          align-items: center;\n          display: flex;\n          justify-content: center;\n          min-height: 180px;\n        }'
);

code = code.replace(
  '#page-feedme-pos .feedme-brand-item img {\n          display: block;\n          height: auto;\n          max-height: 200px;\n          max-width: 400px;\n          object-fit: contain;\n          width: 100%;\n        }',
  '#page-feedme-pos .feedme-brand-item img {\n          display: block;\n          height: auto;\n          max-height: 160px;\n          max-width: 320px;\n          object-fit: contain;\n          width: 100%;\n        }'
);

code = code.replace(
  '<section className="product-app-section feedme-section-oat product-app-section-clean" style={{ paddingBottom: 0 }}>',
  '<section className="product-app-section feedme-section-oat product-app-section-clean">'
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("CSS replaced");
