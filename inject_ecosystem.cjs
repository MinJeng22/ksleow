const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

const cssToInsert = `
        .feedme-ecosystem-section {
          background-color: var(--feedme-orange, #ff7823);
          padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 2rem);
          position: relative;
          z-index: 1;
        }
        .feedme-ecosystem-content {
          margin: 0 auto;
          max-width: 1280px;
          text-align: center;
        }
        .feedme-ecosystem-title {
          color: #ffffff;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin: 0 auto clamp(2rem, 4vw, 4rem) auto;
          max-width: 1000px;
        }
        .feedme-ecosystem-title .ai-remy-gradient {
          background: linear-gradient(45deg, #F09BBE 0.17%, #FEF6ED 30.5%, #FAF5ED 68.4%, #73C8E6 98.1%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .feedme-ecosystem-title .highlight-blue {
          color: #3131fc;
        }
        .feedme-ecosystem-img {
          display: block;
          height: auto;
          margin: 0 auto;
          max-width: 980px;
          width: 100%;
        }
`;

code = code.replace(
  /(\#page-feedme-pos \.feedme-trust-copy \{[\s\S]*?)(<\/style>)/,
  `$1${cssToInsert}      $2`
);

const jsxToInsert = `
        <section className="feedme-ecosystem-section">
          <div className="feedme-ecosystem-content">
            <h2 className="feedme-ecosystem-title">
              How FeedMe Ecosystem powered by <span className="ai-remy-gradient">AI-REMY</span> Cuts Menu Launch Time <br className="hidden md:block" />
              <span className="highlight-blue">from 20 Days to 5 Minutes</span>
            </h2>
            <img src="/images/products/feedme-ecosystem.png" alt="FeedMe Ecosystem flow" className="feedme-ecosystem-img" loading="lazy" decoding="async" />
          </div>
        </section>
`;

code = code.replace(
  /(<section className="product-app-section feedme-section-oat product-app-section-clean">[\s\S]*?<\/section>\s*)(<PageSectionDivider id="advantages")/,
  `$1${jsxToInsert}\n        $2`
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("FeedMe Ecosystem section injected");
