const fs = require('fs');
let code = fs.readFileSync('src/components/WhyChooseUs.jsx', 'utf-8');

const oldCss = `          .ac-retail-proof-copy {
            margin: 0 auto clamp(1rem, 2vw, 1.4rem);
            max-width: 860px;
            text-align: center;
          }
          .ac-retail-proof-copy h3 {
            color: #2f315a;
            font-size: clamp(1.55rem, 2.8vw, 2.3rem);
            font-weight: 900;
            letter-spacing: 0;
            line-height: 1.05;
            margin: 0;
            text-wrap: balance;
          }
          .ac-retail-proof-copy p {
            color: rgba(47, 49, 90, 0.76);
            font-size: 1rem;
            font-weight: 650;
            line-height: 1.65;
            margin: 0.85rem 0 0;
          }`;

const newCss = `          .ac-retail-proof-copy {
            margin: 0 0 clamp(1.5rem, 2vw, 2rem);
            max-width: 1000px;
            text-align: left;
          }
          .ac-retail-proof-copy h3 {
            color: #2f315a;
            font-size: clamp(1.55rem, 2.8vw, 2.3rem);
            font-weight: 900;
            letter-spacing: 0;
            line-height: 1.05;
            margin: 0;
            text-wrap: balance;
          }
          .ac-retail-proof-copy p {
            color: #6b6f91;
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            line-height: 1.6;
            margin: 0.85rem 0 0;
          }`;

code = code.replace(oldCss, newCss);

fs.writeFileSync('src/components/WhyChooseUs.jsx', code);
console.log("Updated WhyChooseUs.jsx");
