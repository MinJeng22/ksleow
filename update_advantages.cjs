const fs = require('fs');
let code = fs.readFileSync('src/pages/products/FeedMePOS.jsx', 'utf-8');

// 1. Add Advantages to FEEDME_SECTIONS
code = code.replace(
  'const FEEDME_SECTIONS = [',
  'const FEEDME_SECTIONS = [\n  { id: "advantages", label: "Advantages", icon: IconStar, color: FEEDME_ORANGE },'
);

// 2. Add FEATURE_CARDS array
const featureCardsStr = `
const FEATURE_CARDS = [
  {
    title: "Point of Sales",
    tone: "orange",
    text: "A fast tablet POS for dine-in, takeaway, table service, discounts, payments, invoices, and cashier flow.",
    tags: ["POS", "Table", "Invoice"],
  },
  {
    title: "AI Recommendations",
    tone: "plum",
    text: "Use smarter prompts for upselling and menu decisions, helping teams lift average order value without slowing service.",
    tags: ["AI", "Upsell", "Menu"],
  },
  {
    title: "QR Code Ordering",
    tone: "mint",
    text: "Guests can browse menus and place table orders from their own phone while staff keep control from the POS.",
    tags: ["QR", "Dine-in", "Self-order"],
  },
  {
    title: "Kitchen Display System",
    tone: "blue",
    text: "Route orders to kitchen stations, reduce paper chits, and keep preparation status visible to the front team.",
    tags: ["KDS", "Station", "Ready"],
  },
  {
    title: "Delivery & Mall Integration",
    tone: "salmon",
    text: "Connect sales channels and outlet environments without splitting restaurant operations across separate tools.",
    tags: ["Delivery", "Mall", "Outlet"],
  },
  {
    title: "Preset Reports",
    tone: "truffle",
    text: "Track sales, payments, menu performance, and outlet activity with owner-friendly operational reports.",
    tags: ["Report", "Sales", "Outlet"],
  },
];
`;
code = code.replace(
  'const FEEDME_PLAN_COLUMNS =',
  featureCardsStr + '\nconst FEEDME_PLAN_COLUMNS ='
);

// 3. Add FeatureCard component
const featureCardComponentStr = `
function FeatureCard({ item }) {
  return (
    <article className={\`feedme-feature-card tone-\${item.tone}\`}>
      <div className="feedme-feature-orb" aria-hidden="true" />
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <div>
        {item.tags.map((tag) => <b key={tag}>{tag}</b>)}
      </div>
    </article>
  );
}
`;
code = code.replace(
  'function PremiumToolCard',
  featureCardComponentStr + '\nfunction PremiumToolCard'
);

// 4. Add advantages HTML section
const advantagesHTML = `
        <div className="product-app-divider" style={{ "--section-from": "#fffdf8", "--section-to": "#fff4e8" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="advantages" />
        </div>

        <section id="advantages" className="product-app-section feedme-section-oat">
          <div className="content-wrap">
            <SectionTitle
              eyebrow="AI-driven restaurant growth"
              title={<><span className="feedme-gradient-word">No restaurant</span> is difficult to run.</>}
              body="FeedMe's official platform language is built around making advanced restaurant technology accessible. This page groups that into the modules a local F&B owner actually needs to compare."
              centered
            />

            <div className="feedme-feature-grid">
              {FEATURE_CARDS.map((item) => <FeatureCard key={item.title} item={item} />)}
            </div>
          </div>
        </section>
`;

// Insert the HTML before the 'plans' divider
const plansDividerSearch = '<div className="product-app-divider" style={{ "--section-from": "#fef6ed", "--section-to": "#fff4e8" }}>\n          <PageSectionDivider sections={FEEDME_SECTIONS} id="plans" />';
code = code.replace(
  plansDividerSearch,
  advantagesHTML + '\n        ' + plansDividerSearch
);

// 5. Update logo sizes for Trust section
code = code.replace(
  'max-width: 1120px;',
  'max-width: 1400px;'
);
code = code.replace(
  'min-height: 104px;',
  'min-height: 150px;'
);
code = code.replace(
  'max-height: 104px;',
  'max-height: 150px;'
);
code = code.replace(
  'max-width: 210px;',
  'max-width: 280px;'
);

// And update the mobile values too (they are inside a media query usually)
// The script above will replace the FIRST occurrences (which are the desktop ones).
// Let's also do a blanket replace for the mobile ones if needed.
code = code.replace(
  'min-height: 82px;',
  'min-height: 120px;'
);
code = code.replace(
  'max-height: 78px;',
  'max-height: 110px;'
);
code = code.replace(
  'max-width: 170px;',
  'max-width: 200px;'
);

fs.writeFileSync('src/pages/products/FeedMePOS.jsx', code);
console.log("FeedMePOS.jsx updated successfully.");
