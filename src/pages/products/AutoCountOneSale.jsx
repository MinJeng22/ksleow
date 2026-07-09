import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";
import SharedEditionsTable from "../../components/SharedEditionsTable";
import useFavicon from "../../hooks/useFavicon.js";

const ONESALE_EDITIONS = ["M1000", "M3000", "M6000", "M10000"];
const ONESALE_EDITION_TABLE = {
  monthlyPrices: ["RM 159 /mo", "RM 209 /mo", "RM 309 /mo", "RM 509 /mo"],
  annualPrices: ["RM 2067 /yr", "RM 2717 /yr", "RM 4017 /yr", "RM 6617 /yr"],
  topRows: [
    ["Orders per month", ["1,000", "3,000", "6,000", "10,000"]],
    ["No. of Product", ["Unlimited", "Unlimited", "Unlimited", "Unlimited"]],
    ["No. of Marketplace Store", ["2", "3", "4", "5"]],
    ["Additional Store", ["Not Applicable", "Not Applicable", "Not Applicable", "RM20 per store/ month"]],
    ["No. of OneSales User", ["1 User (Additional OneSales User RM20/ user/ month)", "1 User (Additional OneSales User RM20/ user/ month)", "1 User (Additional OneSales User RM20/ user/ month)", "1 User (Additional OneSales User RM20/ user/ month)"]],
    ["Supported Marketplace", ["Shopee & Lazada", "Shopee & Lazada", "Shopee & Lazada", "Shopee & Lazada"]],
    ["Warehouse", ["*Single Warehouse (RM80 upgrade to Unlimited Warehouses)", "*Single Warehouse (RM80 upgrade to Unlimited Warehouses)", "*Single Warehouse (RM80 upgrade to Unlimited Warehouses)", "*Single Warehouse (RM80 upgrade to Unlimited Warehouses)"]],
    ["Product Variant", ["Included", "Included", "Included", "Included"]],
    ["Purchase Module, Inventory Control, Sales Module", ["Excluded", "Excluded", "Excluded", "Excluded"]]
  ],
  sections: [
    {
      name: "SUPPORT",
      rows: [
        ["Ticket", ["+", "+", "+", "+"]],
        ["Live Chat", ["+", "+", "+", "+"]],
        ["Phone Support", ["A fee is chargeable for Phone Support", "A fee is chargeable for Phone Support", "A fee is chargeable for Phone Support", "A fee is chargeable for Phone Support"]]
      ]
    }
  ]
};

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent("Hi KS Support Team, I would like to learn more about AutoCount OneSale. Thank you.")}`;

export default function AutoCountOneSalePage({ onContact }) {
  useFavicon("/images/products/onesales-icon.webp");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const [billing, setBilling] = useState("monthly");
  const prices = billing === "monthly" ? ONESALE_EDITION_TABLE.monthlyPrices : ONESALE_EDITION_TABLE.annualPrices;
  const topRows = [
    ["Price", prices],
    ...ONESALE_EDITION_TABLE.topRows
  ];

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Omnichannel Sales"
          title="AutoCount OneSale"
          body="Omnichannel sales management seamlessly integrated with AutoCount."
          iconSrc="/images/products/onesales-icon.webp"
          backgroundImage="/images/products/autocount-onesale.webp"
          primaryCta={{ label: "Start Free Trial", onClick: onContact, className: "ks-btn-onesale" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <div id="compare" className="product-app-section product-app-section-paper">
          <div className="content-wrap">
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 className="ks-section-title">OneSales Marketplace Solution Pricing</h2>
            </div>
            
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
              <span style={{ fontWeight: 600, fontSize: "1.1rem", color: billing === "monthly" ? "#ff5a3b" : "#d1d1db", transition: "color 0.3s" }}>Monthly</span>
              <div 
                onClick={() => setBilling(b => b === "monthly" ? "annual" : "monthly")}
                style={{ width: 56, height: 30, background: "#ff5a3b", borderRadius: 15, position: "relative", cursor: "pointer", display: "flex", alignItems: "center", padding: "0 3px", transition: "all 0.3s" }}
              >
                <div style={{ width: 24, height: 24, background: "#fff", borderRadius: "50%", transform: `translateX(${billing === "annual" ? 26 : 0}px)`, transition: "transform 0.3s, box-shadow 0.3s", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: "1.1rem", color: billing === "annual" ? "#ff5a3b" : "#d1d1db", transition: "color 0.3s" }}>Annual</span>
            </div>

            <SharedEditionsTable 
              editions={ONESALE_EDITIONS} 
              topRows={topRows} 
              sections={ONESALE_EDITION_TABLE.sections} 
              thColor="#ff5a3b"
            />
            
            <div className="ks-note-text" style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#6b6f91" }}>
              <div style={{ marginBottom: "0.5rem" }}>Free trial for up to three months with unlimited order downloads</div>
              <div>** Free Trial is subject to terms and conditions.</div>
            </div>
          </div>
        </div>
        <ProductPlaceholder title="AutoCount OneSale" />
        <Footer />
      </main>
    </div>
  );
}
