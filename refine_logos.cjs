const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

code = code.replace(
  /#page-feedme-pos \.feedme-brand-item \{[\s\S]*?min-height: 180px;[\s\S]*?\}/,
  `#page-feedme-pos .feedme-brand-item {
          align-items: center;
          display: flex;
          justify-content: center;
          min-height: 130px;
          padding: clamp(0.5rem, 1.5vw, 1.5rem);
        }`
);

code = code.replace(
  /#page-feedme-pos \.feedme-brand-item img \{[\s\S]*?max-height: 140px;[\s\S]*?\}/,
  `#page-feedme-pos .feedme-brand-item img {
          display: block;
          height: auto;
          max-height: 110px;
          max-width: 100%;
          object-fit: contain;
          width: 100%;
          mix-blend-mode: multiply;
        }`
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("Refined FeedMe brand logo spacing further for natural look.");
