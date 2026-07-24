import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { PinnedHeroStage } from "../../components/PinnedHeroPage.jsx";
import ProductHero from "../../components/ProductHero.jsx";
import { PageSectionDivider } from "../../components/PageSections.jsx";
import { IconLink, IconHandshake, IconVideo, IconRocket, IconStar } from "../../components/SectionDivider.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import useFavicon from "../../hooks/useFavicon.js";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import AutoCountTrainingWebGL from "../../components/AutoCountTrainingWebGL.jsx";
import { runWithProgressFeedback } from "../../utils/routeTransitions.js";
import { CompareFeatureCell } from "../../components/CompareTable.jsx";

const FEEDME_ORANGE = "#ff7823";
const FEEDME_TRUFFLE = "#55524a";
const FEEDME_OAT = "#fef6ed";
const FEEDME_OATS = "#fbe5cb";
const FEEDME_BLUE = "#3131fc";
const FEEDME_MINT = "#8ce6d7";

const WA_LINK = `https://wa.me/60169902279?text=${encodeURIComponent(
  "Hi Elise, I would like to learn more about FeedMe POS. Thank you."
)}`;

const HERO_PHOTO = "/images/products/feedme-pos-showcase.webp";
const FEEDME_LOGO = "/images/products/feedme-icon.webp";

const FEEDME_BRANDS = [
  "/images/feedme-brands/brand-1.webp",
  "/images/feedme-brands/brand-2.webp",
  "/images/feedme-brands/brand-3.webp",
  "/images/feedme-brands/brand-4.webp",
  "/images/feedme-brands/brand-5.webp",
  "/images/feedme-brands/brand-6.webp",
  "/images/feedme-brands/brand-7.webp",
  "/images/feedme-brands/brand-8.webp",
  "/images/feedme-brands/brand-9.webp",
  "/images/feedme-brands/brand-10.png",
];

const FEEDME_VIDEOS = [
  {
    id: "aVx2GRICw8g",
    label: "Introduction",
    description: "Get to know FeedMe POS and how it helps restaurants run orders, tables, menu setup, and outlet operations from a tablet-friendly system.",
    note: "Overview",
    thumbnailCropScale: 1.0,
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="currentColor" stroke="none" /></svg>,
  },
  {
    id: "qt79qLkmLII",
    playlistId: "PLxvuFLfmabG32EDSIPfhlhDzxzpcHNWvg",
    label: "POS Tutorial",
    description: "Follow FeedMe's training series for setup, menu configuration, table service, ordering flow, and day-to-day POS operation.",
    note: "Training Series",
    thumbnailCropScale: 1.0,
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2.5" /><path d="M8 20v2h8v-2" /><path d="M10 9l6 3-6 3V9z" fill="currentColor" stroke="none" /></svg>,
  },
];

const FEEDME_SECTIONS = [
  { id: "training", label: "Tutorial Guide", icon: IconVideo, color: FEEDME_ORANGE },
  { id: "plans", label: "Plan Compare", icon: IconRocket, color: FEEDME_ORANGE },
  { id: "why-ksl", label: "Why Choose Us", icon: IconHandshake, color: FEEDME_ORANGE },
];

const FEEDME_PRICING_CARDS = [
  {
    name: "Lite",
    subtitle: "Basic entry for single outlets",
    price: "RM 0",
    period: "per month",
    features: [
      "Menu Management",
      "Table Management",
      "Invoice Management",
      "1 Printer & 1 Location"
    ]
  },
  {
    name: "Standard",
    subtitle: "Most popular for growing outlets",
    price: "RM 90",
    period: "per month",
    features: [
      "Mobile Ordering (QR, Pickup)",
      "2 Sub POS",
      "Accounting Integration",
      "Unlimited Printers & Locations"
    ]
  },
  {
    name: "Premium",
    subtitle: "Complete control for large operations",
    price: "RM 129",
    period: "per month",
    features: [
      "KDS + ODS",
      "Mall Integration",
      "Unlimited Sub POS",
      "Queue Management"
    ]
  }
];


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

const FEEDME_PLAN_COLUMNS = ["Lite", "Standard", "Premium"];

const FEEDME_PRICING_ROWS = [
  { label: "Price", values: ["RM0 per month", "RM90 per month", "RM129 per month"], type: "price" },
  { label: "Menu Management", values: ["yes", "yes", "yes"] },
  { label: "Table Management", values: ["yes", "yes", "yes"] },
  { label: "Invoice Management (e-Invoice, Feedback)", values: ["yes", "yes", "yes"] },
  {
    label: "Payment Type",
    values: [
      "Cash only. Integrate e-payment to enable other payment methods",
      "Cash, default payment types and custom payment type",
      "Cash, default payment types and custom payment type",
    ],
  },
  { label: "Payment Integration (E-Payment, SoftPos, Terminal)", values: ["Offline", "Online & Offline", "Online & Offline"] },
  { label: "Printer", values: ["1", "Unlimited", "Unlimited"] },
  { label: "Mobile Ordering (Table QR, Pickup, In-house Delivery, FeedMe Express)", values: ["no", "yes", "yes"] },
  { label: "Sub POS", values: ["0", "2", "Unlimited"] },
  { label: "Location", values: ["1", "Unlimited", "Unlimited"] },
  { label: "KDS + ODS", values: ["no", "no", "yes"] },
  { label: "Mall Integration", values: ["no", "no", "yes"] },
  { label: "Delivery Integration (Grab Food, foodpanda, ShopeeFood)", values: ["no", "no", "DPI fees apply on foodpanda"], markPremium: true },
  { label: "Queue", values: ["no", "no", "yes"] },
  { label: "Link to Food Court", values: ["yes", "yes", "yes"] },
  { label: "Kiosk", values: ["no", "Add-on charges apply", "Add-on charges apply"] },
  { label: "Mobile Ordering AI (Beta)", values: ["no", "yes", "yes"] },
  { label: "Connect", values: ["no", "Eligible for Connect Standard Plan", "Eligible for Connect Standard Plan"] },
  { label: "Inventory", values: ["no", "Eligible for Inventory Standard Plan", "Eligible for Inventory Standard Plan"] },
  { label: "Mini Program", values: ["no", "Eligible for Mini Program Standard Plan", "Eligible for Mini Program Standard Plan"] },
  { label: "Preset Report", values: ["yes", "yes", "yes"] },
  { label: "Custom Report", values: ["no", "yes", "yes"] },
  { label: "Accounting Integration", values: ["no", "yes", "yes"] },
  { label: "Team - Authentication", values: ["yes", "yes", "yes"] },
  { label: "Team - Role", values: ["1", "yes", "yes"] },
  { label: "Team - Timesheet", values: ["1", "yes", "yes"] },
];

const PREMIUM_TOOLS = [
  {
    title: "Connect Premium",
    text: "Marketing, CRM, Feedback all in one!",
    color: "#ff5d53",
    background: "#fde8e5",
    price: "RM 90",
    period: "per month",
    buttonLabel: "Get Started",
  },
  {
    title: "Mini Program Premium",
    text: "Choose between individual or business level plan.",
    color: "#e5933d",
    background: "#fef3e2",
    buttonLabel: "Learn More",
  },
  {
    title: "Inventory Premium",
    text: "Real-time stock tracking, automated replenishment, discount tips & more beyond counting! Contact us for pricing.",
    color: "#3cae89",
    background: "#dff5ee",
    buttonLabel: "Contact Sales",
  },
  {
    title: "Warehouse Premium",
    text: "Need more than one? Create multiple warehouses for inventory across outlets. Contact us for pricing!",
    color: "#3cae89",
    background: "#dff5ee",
    buttonLabel: "Learn More",
  },
  {
    title: "AI Report Premium",
    text: "Transform your restaurant with data-driven growth. Coming soon!",
    color: "#007ba7",
    background: "#dceef5",
    buttonLabel: "Learn More",
  },
  {
    title: "Payment Premium",
    text: "Terminal available for a one-time price, supporting versatile payment options. Contact us for pricing.",
    color: "#8358d4",
    background: "#e8ddf6",
    buttonLabel: "Contact Sales",
  },
  {
    title: "HRM Premium",
    text: "Comprehensive Human Resource Management System improve workforce productivity. Coming soon!",
    color: "#706b65",
    background: "#eae6e1",
    buttonLabel: "Learn More",
  },
  {
    title: "Food Court Management",
    text: "Effortlessly manage all stalls from a single platform! Contact us for pricing.",
    color: "#ff5d53",
    background: "#ffffff",
    buttonLabel: "Learn More",
  },
];

const WORKFLOW_STEPS = [
  { label: "Guest orders", text: "Table, cashier, QR, or takeaway order enters the same POS flow." },
  { label: "Kitchen prepares", text: "Items route to kitchen or order display screens by station." },
  { label: "Payment closes", text: "Cashier takes payment, issues invoice, and keeps the shift clean." },
  { label: "Owner reviews", text: "Sales and reports stay ready for branch managers and accountants." },
];

function SectionTitle({ eyebrow, title, body, centered = false }) {
  return (
    <div className={`feedme-section-title${centered ? " is-centered" : ""}`}>
      {eyebrow && <span className="ks-eyebrow">{eyebrow}</span>}
      <h2 className="ks-section-title">{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function PlanCard({ plan }) {
  return (
    <article className={`feedme-plan-card${plan.popular ? " is-popular" : ""}`}>
      {plan.popular && <div className="feedme-plan-ribbon">Most Popular</div>}
      <div className="feedme-plan-top">
        <h3>{plan.name}</h3>
        <p>{plan.subtitle}</p>
      </div>
      <div className="feedme-price">
        <strong>{plan.price}</strong>
        <span>per month</span>
      </div>
      <a href={WA_LINK} target="_blank" rel="noreferrer" className="feedme-plan-button">
        Get Started
      </a>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <span aria-hidden="true">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

function FeedMePlanValue({ value, price = false, marked = false }) {
  if (price) {
    return <span className="feedme-compare-price">{value}</span>;
  }
  if (value === "yes") {
    return <span className="feedme-compare-mark is-yes" aria-label="Included" />;
  }
  if (value === "no") {
    return <span className="feedme-compare-mark is-no" aria-label="Not included" />;
  }
  if (marked) {
    return (
      <span className="feedme-compare-note is-marked">
        <span className="feedme-compare-mark is-yes" aria-hidden="true" />
        <span>{value}</span>
      </span>
    );
  }
  return <span className="feedme-compare-note">{value}</span>;
}

function FeedMePricingCards({ cards }) {
  return (
    <div className="pos-pricing-cards">
      {cards.map((card) => (
        <div key={card.name} className="pos-pricing-card">
          <div className="pos-pricing-card-inner">
            <h3 className="pos-pricing-name">{card.name}</h3>
            {card.subtitle && <p className="pos-pricing-desc">{card.subtitle}</p>}
            <div className="pos-pricing-price">
              <span className="pos-pricing-amount">{card.price}</span>
              <span className="pos-pricing-suffix">{card.period}</span>
            </div>
            <div className="pos-pricing-features-title">Key Features:</div>
            <ul className="pos-pricing-features">
              {card.features.map((f) => (
                <li key={f}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedMePricingTable() {
  return (
    <div className="ks-compare-panel feedme-pricing-panel">
      <div className="ks-compare-wrap">
        <table
          className="ks-compare-table feedme-pricing-table"
          style={{
            "--edition-count": FEEDME_PLAN_COLUMNS.length,
            "--mobile-table-width": "100%",
          }}
        >
          <colgroup>
            <col className="ks-compare-col-feature" width="40%" />
            {FEEDME_PLAN_COLUMNS.map((column) => (
              <col key={column} className="ks-compare-col-edition" width="20%" />
            ))}
          </colgroup>
          <thead className="ks-compare-thead">
            <tr>
              <th className="ks-compare-th ks-compare-th-left">POS Plan</th>
              {FEEDME_PLAN_COLUMNS.map((column) => (
                <th key={column} className="ks-compare-th">
                  <span className="ks-compare-edition-name">{column}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="ks-compare-tbody">
            {FEEDME_PRICING_ROWS.map((row) => {
              const priceRow = row.type === "price";
              return (
                <tr key={row.label} className={priceRow ? "ks-compare-tr-book" : "ks-compare-tr-data"}>
                  <CompareFeatureCell
                    className={priceRow ? "ks-compare-td-book" : "ks-compare-td-data"}
                    style={{ fontWeight: priceRow ? 800 : 650 }}
                  >
                    {row.label}
                  </CompareFeatureCell>
                  {row.values.map((value, index) => (
                    <td
                      key={`${row.label}-${FEEDME_PLAN_COLUMNS[index]}`}
                      className={priceRow ? "ks-compare-td-book" : "ks-compare-td-data"}
                    >
                      <FeedMePlanValue value={value} price={priceRow} marked={row.markPremium && index === 2} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function FeatureCard({ item }) {
  return (
    <article className={`feedme-feature-card tone-${item.tone}`}>
      <div className="feedme-feature-orb" aria-hidden="true" />
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <div>
        {item.tags.map((tag) => <b key={tag}>{tag}</b>)}
      </div>
    </article>
  );
}

function PremiumToolCard({ tool, onOpenMiniProgram }) {
  const isMiniProgram = tool.title === "Mini Program Premium";
  const waMsg = encodeURIComponent(`Hi KS Support Team, I am interested in ${tool.title} for FeedMe POS. Can you share more details?`);
  const waUrl = `https://wa.me/60179052323?text=${waMsg}`;

  const handleClick = (e) => {
    if (isMiniProgram) {
      e.preventDefault();
      onOpenMiniProgram?.();
    }
  };

  return (
    <article
      className="feedme-tool-card"
      style={{ "--tool-color": tool.color, "--tool-bg": tool.background, cursor: isMiniProgram ? "pointer" : "default" }}
      onClick={isMiniProgram ? handleClick : undefined}
    >
      <h3>{tool.title}</h3>
      <p>{tool.text}</p>
      {tool.price && (
        <div className="feedme-tool-price">
          <strong>{tool.price}</strong>
          <span>{tool.period}</span>
        </div>
      )}
      <a
        href={isMiniProgram ? "#" : waUrl}
        target={isMiniProgram ? undefined : "_blank"}
        rel={isMiniProgram ? undefined : "noreferrer"}
        onClick={handleClick}
        className="feedme-tool-btn"
      >
        {isMiniProgram ? "View Comparison" : (tool.buttonLabel || "Learn More")}
      </a>
    </article>
  );
}

function PremiumToolsPanel({ onOpenMiniProgram }) {
  return (
    <div className="feedme-tools-section" style={{ marginTop: "3.5rem" }}>
      <SectionTitle
        title="Premium Tools"
        centered
      />
      <div className="feedme-tools-grid">
        {PREMIUM_TOOLS.map((tool) => (
          <PremiumToolCard key={tool.title} tool={tool} onOpenMiniProgram={onOpenMiniProgram} />
        ))}
      </div>
    </div>
  );
}

function MiniProgramModal({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("has-active-modal");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("has-active-modal");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("has-active-modal");
    };
  }, [open]);

  if (!open) return null;

  const waMsg = encodeURIComponent("Hi KS Support Team, I am interested in FeedMe Mini Program Premium Plans. Could you provide more details?");
  const waUrl = `https://wa.me/60179052323?text=${waMsg}`;

  return (
    <div
      className="partner-modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(10,11,24,0.68)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="partner-modal-shell"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(880px, 96vw)",
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: 26,
          background: "#fffdf8",
          boxShadow: "0 36px 100px rgba(10,11,24,0.36)",
          padding: "clamp(1.5rem, 3.5vw, 2.5rem)",
          animation: "modalIn 0.26s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#ffffff",
            border: "1px solid rgba(85,82,74,0.15)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "var(--feedme-truffle)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            zIndex: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.3rem)", fontWeight: 900, color: "var(--feedme-truffle)", margin: "0 0 0.4rem", letterSpacing: "-0.01em" }}>
            <span style={{ color: "var(--feedme-orange)" }}>Mini Program</span> Pricing Plans
          </h2>
          <p style={{ fontSize: "0.95rem", fontWeight: 650, color: "rgba(85, 82, 74, 0.72)", margin: 0 }}>
            Empowering Restaurant Growth
          </p>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid rgba(85, 82, 74, 0.08)", boxShadow: "0 10px 30px rgba(47, 49, 90, 0.05)", overflowX: "auto", marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "620px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(85, 82, 74, 0.08)", background: "#faf7f2" }}>
                <th style={{ padding: "1rem 1.25rem", fontSize: "0.88rem", fontWeight: 800, color: "#2c2a25" }}>Plan</th>
                <th style={{ padding: "1rem 1.25rem", fontSize: "0.88rem", fontWeight: 800, color: "#6b6f91", textAlign: "center" }}>Lite</th>
                <th style={{ padding: "1rem 1.25rem", fontSize: "0.88rem", fontWeight: 800, color: "#6b6f91", textAlign: "center" }}>Standard</th>
                <th style={{ padding: "1rem 1.25rem", fontSize: "0.88rem", fontWeight: 800, color: "var(--feedme-orange)", textAlign: "center" }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(85, 82, 74, 0.06)" }}>
                <td style={{ padding: "0.9rem 1.25rem", fontWeight: 800, color: "#2c2a25", fontSize: "0.88rem" }}>Price</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "rgba(85, 82, 74, 0.8)" }}>Not Available</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "rgba(85, 82, 74, 0.85)" }}>Available for POS User (Standard & Premium)</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 800, color: "#2c2a25" }}>Start from RM249 per month</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(85, 82, 74, 0.06)", background: "rgba(254, 246, 237, 0.35)" }}>
                <td style={{ padding: "0.9rem 1.25rem", fontWeight: 700, color: "#2c2a25", fontSize: "0.88rem" }}>Built-in Template</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#ef4e23", fontWeight: 900 }}>✕</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#22c55e", fontWeight: 900 }}>✓</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#22c55e", fontWeight: 900 }}>✓</span></td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(85, 82, 74, 0.06)" }}>
                <td style={{ padding: "0.9rem 1.25rem", fontWeight: 700, color: "#2c2a25", fontSize: "0.88rem" }}>Add to Home Screen</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#ef4e23", fontWeight: 900 }}>✕</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "0.85rem", color: "rgba(85, 82, 74, 0.85)", fontWeight: 650 }}>with FeedMe Logo</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 750, color: "#2c2a25" }}>without FeedMe Logo</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(85, 82, 74, 0.06)", background: "rgba(254, 246, 237, 0.35)" }}>
                <td style={{ padding: "0.9rem 1.25rem", fontWeight: 700, color: "#2c2a25", fontSize: "0.88rem" }}>Link to Order and Member</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#ef4e23", fontWeight: 900 }}>✕</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#22c55e", fontWeight: 900 }}>✓</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#22c55e", fontWeight: 900 }}>✓</span></td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(85, 82, 74, 0.06)" }}>
                <td style={{ padding: "0.9rem 1.25rem", fontWeight: 700, color: "#2c2a25", fontSize: "0.88rem" }}>Custom Template Builder</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#ef4e23", fontWeight: 900 }}>✕</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#ef4e23", fontWeight: 900 }}>✕</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#22c55e", fontWeight: 900 }}>✓</span></td>
              </tr>
              <tr>
                <td style={{ padding: "0.9rem 1.25rem", fontWeight: 700, color: "#2c2a25", fontSize: "0.88rem" }}>Additional Custom Page</td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#ef4e23", fontWeight: 900 }}>✕</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#ef4e23", fontWeight: 900 }}>✕</span></td>
                <td style={{ padding: "0.9rem 1.25rem", textAlign: "center", fontSize: "1.1rem" }}><span style={{ color: "#22c55e", fontWeight: 900 }}>✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="ks-btn"
            style={{
              background: "var(--feedme-orange)",
              color: "#ffffff",
              borderRadius: 50,
              padding: "0.75rem 2rem",
              fontSize: "0.9rem",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 10px 25px rgba(255, 101, 25, 0.28)",
            }}
          >
            Enquire Mini Program Plans
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FeedMePOSPage() {
  const [trialOpen, setTrialOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [miniProgramOpen, setMiniProgramOpen] = useState(false);
  useFavicon(FEEDME_LOGO);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div id="page-feedme-pos" className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <style>{`
        #page-feedme-pos {
          --feedme-orange: ${FEEDME_ORANGE};
          --feedme-truffle: ${FEEDME_TRUFFLE};
          --feedme-oat: ${FEEDME_OAT};
          --feedme-oats: ${FEEDME_OATS};
          --feedme-blue: ${FEEDME_BLUE};
          --feedme-mint: ${FEEDME_MINT};
          --ks-page-paper: #fffdf8;
          --ks-page-mist: #fef6ed;
          --ks-page-ice: #fff4e8;
          --ks-page-cloud: #f7fbf3;
          --ks-page-warm: #fbe5cb;
          background: linear-gradient(180deg, #fef6ed 0%, #fffdf8 46%, #fbe5cb 100%);
          color: var(--feedme-truffle);
        }
        #page-feedme-pos .product-hero {
          --product-hero-overlay: linear-gradient(90deg, rgba(31, 27, 23, 0.78), rgba(31, 27, 23, 0.44), rgba(31, 27, 23, 0.18));
        }
        #page-feedme-pos .product-app-section {
          --product-section-start: 14%;
          --product-section-end: 86%;
          --product-section-glow: 0.72;
        }
        #page-feedme-pos .product-app-section::before {
          background:
            radial-gradient(circle at 12% 12%, rgba(255, 120, 35, 0.12), transparent 30%),
            radial-gradient(circle at 88% 16%, rgba(49, 49, 252, 0.075), transparent 34%),
            radial-gradient(circle at 64% 92%, rgba(140, 230, 215, 0.11), transparent 32%);
        }
        #page-feedme-pos .feedme-section-oat {
          --product-section-from: #fffdf8;
          --product-section-bg: #fef6ed;
          --product-section-to: #fff4e8;
        }
        #page-feedme-pos .feedme-section-plans {
          --product-section-from: #fffdf8;
          --product-section-bg: #fffdf8;
          --product-section-to: #fffdf8;
        }
        #page-feedme-pos .feedme-section-integration {
          --product-section-from: #fef6ed;
          --product-section-bg: #fff4e8;
          --product-section-to: #fef6ed;
        }
        #page-feedme-pos .feedme-section-title {
          margin: 0 0 clamp(1.8rem, 3vw, 2.7rem);
          max-width: 820px;
        }
        #page-feedme-pos .feedme-section-title.is-centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
        #page-feedme-pos .feedme-section-title .ks-eyebrow {
          display: inline-flex;
          color: var(--feedme-orange);
          margin-bottom: 0.7rem;
        }
        #page-feedme-pos .feedme-section-title .ks-section-title {
          color: var(--feedme-truffle);
          margin: 0;
          text-wrap: balance;
        }
        #page-feedme-pos .feedme-section-title p,
        #page-feedme-pos .feedme-card-text {
          color: rgba(85, 82, 74, 0.78);
          font-size: 0.98rem;
          line-height: 1.75;
          margin: 0.85rem 0 0;
        }
        #page-feedme-pos .feedme-gradient-word {
          background: linear-gradient(110deg, #ff7823 0%, #8358d4 45%, #f09bbe 72%, #ff5d53 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        #page-feedme-pos .feedme-trust-strip {
          display: grid;
          gap: clamp(1.4rem, 2.4vw, 2rem);
          justify-items: center;
          text-align: center;
        }
        #page-feedme-pos .feedme-trust-copy {
          color: var(--feedme-truffle);
          display: grid;
          gap: 0.65rem;
          justify-items: center;
        }
        #page-feedme-pos .feedme-trust-title {
          color: var(--feedme-truffle);
          margin: 0;
          max-width: 960px;
          text-align: center;
        }
        #page-feedme-pos .feedme-trust-title span {
          color: var(--feedme-orange);
        }
        #page-feedme-pos .feedme-trust-copy p {
          color: rgba(85, 82, 74, 0.86);
          font-size: clamp(1rem, 1.8vw, 1.3rem);
          font-weight: 700;
          line-height: 1.45;
          margin: 0;
        }
        #page-feedme-pos .feedme-brand-panel {
          background: #ffffff;
          border: 1px solid rgba(85, 82, 74, 0.06);
          border-radius: 22px;
          box-shadow: none;
          max-width: 1600px;
          overflow: hidden;
          padding: clamp(1rem, 2.5vw, 2rem);
          margin-bottom: clamp(3rem, 6vw, 5rem);
          width: 100%;
        }
        #page-feedme-pos .feedme-brand-grid {
          align-items: center;
          display: grid;
          gap: clamp(1rem, 2.5vw, 2rem);
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        #page-feedme-pos .feedme-brand-item {
          align-items: center;
          display: flex;
          justify-content: center;
          min-height: 130px;
          padding: clamp(0.5rem, 1.5vw, 1.5rem);
        }
        #page-feedme-pos .feedme-brand-item img {
          display: block;
          height: auto;
          max-height: 110px;
          max-width: 100%;
          object-fit: contain;
          width: 100%;
          mix-blend-mode: multiply;
        }
        #page-feedme-pos .feedme-feature-grid,
        #page-feedme-pos .feedme-plans-grid,
        #page-feedme-pos .feedme-tools-grid {
          display: grid;
          gap: 1rem;
        }
        #page-feedme-pos .feedme-feature-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        #page-feedme-pos .feedme-feature-card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(85, 82, 74, 0.09);
          border-radius: 28px;
          box-shadow: 0 24px 70px rgba(85, 82, 74, 0.08);
          min-height: 240px;
          overflow: hidden;
          padding: 1.45rem;
          position: relative;
        }
        #page-feedme-pos .feedme-feature-orb {
          border-radius: 999px;
          height: 54px;
          margin-bottom: 1.15rem;
          width: 54px;
        }
        #page-feedme-pos .tone-orange .feedme-feature-orb { background: linear-gradient(135deg, #ff7823, #ffd232); }
        #page-feedme-pos .tone-plum .feedme-feature-orb { background: linear-gradient(135deg, #8358d4, #f09bbe); }
        #page-feedme-pos .tone-mint .feedme-feature-orb { background: linear-gradient(135deg, #50be9b, #8ce6d7); }
        #page-feedme-pos .tone-blue .feedme-feature-orb { background: linear-gradient(135deg, #3131fc, #73c8e6); }
        #page-feedme-pos .tone-salmon .feedme-feature-orb { background: linear-gradient(135deg, #ff5d53, #ff7823); }
        #page-feedme-pos .tone-truffle .feedme-feature-orb { background: linear-gradient(135deg, #55524a, #989791); }
        #page-feedme-pos .feedme-feature-card h3,
        #page-feedme-pos .feedme-plan-card h3,
        #page-feedme-pos .feedme-tool-card h3,
        #page-feedme-pos .feedme-workflow-card h3 {
          color: var(--feedme-truffle);
          font-size: 1.22rem;
          font-weight: 850;
          line-height: 1.18;
          margin: 0 0 0.65rem;
        }
        #page-feedme-pos .feedme-feature-card p,
        #page-feedme-pos .feedme-plan-card p,
        #page-feedme-pos .feedme-tool-card p,
        #page-feedme-pos .feedme-workflow-card p {
          color: rgba(85, 82, 74, 0.75);
          font-size: 0.92rem;
          line-height: 1.68;
          margin: 0;
        }
        #page-feedme-pos .feedme-feature-card div:last-child {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-top: 1.2rem;
        }
        #page-feedme-pos .feedme-feature-card b {
          background: rgba(255, 120, 35, 0.09);
          border-radius: 999px;
          color: var(--feedme-truffle);
          font-size: 0.7rem;
          padding: 0.28rem 0.62rem;
        }
        #page-feedme-pos .feedme-plans-grid {
          align-items: stretch;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        #page-feedme-pos .feedme-plan-card {
          background: #fff;
          border: 1px solid rgba(85, 82, 74, 0.11);
          border-radius: 30px;
          box-shadow: 0 22px 80px rgba(85, 82, 74, 0.1);
          display: flex;
          flex-direction: column;
          min-height: 100%;
          overflow: hidden;
          padding: 1.35rem;
          position: relative;
        }
        #page-feedme-pos .feedme-plan-card.is-popular {
          background:
            radial-gradient(circle at 8% 0%, rgba(240, 155, 190, 0.28), transparent 32%),
            radial-gradient(circle at 90% 0%, rgba(115, 200, 230, 0.24), transparent 34%),
            var(--feedme-truffle);
          border-color: rgba(255, 255, 255, 0.22);
          color: #fff;
          transform: translateY(-0.6rem);
        }
        #page-feedme-pos .feedme-plan-card.is-popular h3,
        #page-feedme-pos .feedme-plan-card.is-popular p,
        #page-feedme-pos .feedme-plan-card.is-popular li,
        #page-feedme-pos .feedme-plan-card.is-popular .feedme-price span {
          color: rgba(255, 255, 255, 0.82);
        }
        #page-feedme-pos .feedme-plan-card.is-popular h3,
        #page-feedme-pos .feedme-plan-card.is-popular .feedme-price strong {
          color: #fff;
        }
        #page-feedme-pos .feedme-plan-ribbon {
          align-self: flex-start;
          background: linear-gradient(110deg, #f09bbe, #fef6ed, #73c8e6);
          border-radius: 999px;
          color: var(--feedme-truffle);
          font-size: 0.72rem;
          font-weight: 850;
          margin-bottom: 1rem;
          padding: 0.35rem 0.8rem;
        }
        #page-feedme-pos .feedme-plan-top {
          min-height: 112px;
        }
        #page-feedme-pos .feedme-price {
          align-items: flex-end;
          display: flex;
          gap: 0.45rem;
          margin: 1.2rem 0 1rem;
        }
        #page-feedme-pos .feedme-price strong {
          color: var(--feedme-orange);
          font-size: clamp(2.1rem, 4vw, 3rem);
          line-height: 0.95;
        }
        #page-feedme-pos .feedme-price span {
          color: rgba(85, 82, 74, 0.62);
          font-size: 0.8rem;
          font-weight: 800;
          padding-bottom: 0.26rem;
        }
        #page-feedme-pos .feedme-plan-button {
          align-items: center;
          background: var(--feedme-orange);
          border-radius: 999px;
          color: #fff;
          display: inline-flex;
          font-size: 0.92rem;
          font-weight: 850;
          justify-content: center;
          margin: 0 0 1.25rem;
          min-height: 44px;
          text-decoration: none;
        }
        #page-feedme-pos .feedme-plan-card.is-popular .feedme-plan-button {
          background: #fff;
          color: var(--feedme-truffle);
        }
        #page-feedme-pos .feedme-plan-card ul {
          display: grid;
          gap: 0.72rem;
          list-style: none;
          margin: auto 0 0;
          padding: 0;
        }
        #page-feedme-pos .feedme-plan-card li {
          align-items: flex-start;
          color: rgba(85, 82, 74, 0.78);
          display: flex;
          font-size: 0.9rem;
          gap: 0.55rem;
          line-height: 1.45;
        }
        #page-feedme-pos .feedme-plan-card li span {
          color: var(--feedme-orange);
          font-weight: 900;
        }
        #page-feedme-pos .feedme-pricing-panel {
          border-color: rgba(85, 82, 74, 0.08);
          border-radius: 22px;
          box-shadow: 0 18px 55px rgba(85, 82, 74, 0.08);
          overflow: hidden;
        }
        #page-feedme-pos .feedme-pricing-table {
          font-size: 0.94rem;
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-th {
          background: #ffffff;
          border-bottom: 1px solid rgba(85, 82, 74, 0.08);
          color: var(--feedme-truffle);
          font-size: 0.88rem;
          padding: 1rem 1.4rem;
          text-transform: uppercase;
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-th-left {
          color: var(--feedme-truffle);
          font-size: 1rem;
          font-weight: 850;
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-edition-name {
          min-height: auto;
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-tr-book {
          background: rgba(254, 246, 237, 0.7);
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-tr-data:nth-child(even),
        #page-feedme-pos .feedme-pricing-table .ks-compare-tr-data:nth-child(odd) {
          background: #ffffff;
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-tr-data,
        #page-feedme-pos .feedme-pricing-table .ks-compare-tr-book {
          border-bottom: 1px solid rgba(85, 82, 74, 0.055);
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-td-data,
        #page-feedme-pos .feedme-pricing-table .ks-compare-td-book {
          color: var(--feedme-truffle);
          padding: 1.05rem 1.4rem;
          vertical-align: middle;
        }
        #page-feedme-pos .feedme-pricing-table .ks-compare-td-left {
          color: var(--feedme-truffle);
          font-size: 1rem;
          line-height: 1.35;
        }
        #page-feedme-pos .feedme-compare-price {
          color: var(--feedme-truffle);
          font-weight: 850;
          white-space: nowrap;
        }
        #page-feedme-pos .feedme-compare-mark {
          align-items: center;
          display: inline-flex;
          font-size: 1.35rem;
          font-weight: 900;
          justify-content: center;
          line-height: 1;
          min-height: 1.35rem;
          min-width: 1.35rem;
        }
        #page-feedme-pos .feedme-compare-mark.is-yes {
          color: #48c983;
        }
        #page-feedme-pos .feedme-compare-mark.is-yes::before {
          content: "\\2713";
        }
        #page-feedme-pos .feedme-compare-mark.is-no {
          color: #f25578;
        }
        #page-feedme-pos .feedme-compare-mark.is-no::before {
          content: "\\00d7";
        }
        #page-feedme-pos .feedme-compare-note {
          color: rgba(85, 82, 74, 0.92);
          display: inline-flex;
          font-size: 0.92rem;
          font-weight: 650;
          justify-content: center;
          line-height: 1.32;
          max-width: 220px;
          text-align: center;
        }
        #page-feedme-pos .feedme-compare-note.is-marked {
          align-items: center;
          gap: 0.45rem;
        }
        #page-feedme-pos .feedme-tools-section {
          margin-top: clamp(3rem, 5vw, 4.5rem);
        }
        #page-feedme-pos .feedme-tools-grid {
          display: grid;
          gap: clamp(0.75rem, 1.5vw, 1.25rem);
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: clamp(1.5rem, 3vw, 2.5rem);
          width: 100%;
        }
        #page-feedme-pos .feedme-tool-card {
          align-items: center;
          background: var(--tool-bg);
          border: 0;
          border-radius: 24px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 250px;
          overflow: hidden;
          padding: 1.75rem 1.15rem;
          position: relative;
          text-align: center;
          box-sizing: border-box;
          width: 100%;
        }
        #page-feedme-pos .feedme-tool-card h3 {
          color: var(--tool-color);
          font-size: clamp(1.35rem, 2vw, 1.65rem);
          font-weight: 850;
          letter-spacing: -0.01em;
          line-height: 1.15;
          margin: 0 0 0.65rem;
          max-width: 14rem;
        }
        #page-feedme-pos .feedme-tool-card p {
          color: rgba(44, 42, 37, 0.82);
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0 0 1rem;
          max-width: 16rem;
        }
        #page-feedme-pos .feedme-tool-price {
          align-items: center;
          display: flex;
          flex-direction: column;
          margin-bottom: 0.75rem;
        }
        #page-feedme-pos .feedme-tool-price strong {
          color: #2c2a25;
          font-size: 1.6rem;
          font-weight: 900;
          line-height: 1;
        }
        #page-feedme-pos .feedme-tool-price span {
          color: rgba(61, 58, 52, 0.75);
          font-size: 0.78rem;
          font-weight: 700;
          margin-top: 0.2rem;
        }
        #page-feedme-pos .feedme-tool-btn {
          align-items: center;
          background: #ff6519;
          border-radius: 50px;
          color: #ffffff;
          display: inline-flex;
          font-size: 0.88rem;
          font-weight: 800;
          justify-content: center;
          margin-top: auto;
          padding: 0.55rem 1.6rem;
          text-decoration: none;
          transition: transform 0.2s, background-color 0.2s;
        }
        #page-feedme-pos .feedme-tool-btn:hover {
          background: #e55309;
          transform: translateY(-1px);
        }
        #page-feedme-pos .feedme-workflow {
          display: grid;
          gap: 1rem;
          grid-template-columns: 0.92fr 1.08fr;
          align-items: stretch;
        }
        #page-feedme-pos .feedme-workflow-panel {
          background: var(--feedme-truffle);
          border-radius: 34px;
          color: #fff;
          padding: clamp(1.4rem, 3vw, 2.4rem);
        }
        #page-feedme-pos .feedme-workflow-panel .ks-section-title {
          color: #fff;
          margin: 0;
        }
        #page-feedme-pos .feedme-workflow-panel p {
          color: rgba(255, 255, 255, 0.76);
          line-height: 1.75;
          margin: 1rem 0 0;
        }
        #page-feedme-pos .feedme-workflow-list {
          display: grid;
          gap: 0.8rem;
        }
        #page-feedme-pos .feedme-workflow-card {
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(85, 82, 74, 0.1);
          border-radius: 24px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1rem;
          padding: 1rem;
        }
        #page-feedme-pos .feedme-workflow-card b {
          align-items: center;
          background: var(--feedme-orange);
          border-radius: 18px;
          color: #fff;
          display: inline-flex;
          font-size: 1rem;
          font-weight: 900;
          height: 44px;
          justify-content: center;
          width: 44px;
        }
        #page-feedme-pos .feedme-support-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        #page-feedme-pos .feedme-support-card {
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(85, 82, 74, 0.1);
          border-radius: 26px;
          padding: 1.2rem;
        }
        #page-feedme-pos .feedme-support-card h3 {
          color: var(--feedme-truffle);
          font-size: 1rem;
          font-weight: 850;
          margin: 0 0 0.5rem;
        }
        #page-feedme-pos .feedme-support-card p {
          color: rgba(85, 82, 74, 0.74);
          font-size: 0.88rem;
          line-height: 1.62;
          margin: 0;
        }
        #page-feedme-pos .ks-btn-feedme {
          background: var(--feedme-orange);
          border-color: var(--feedme-orange);
          color: #ffffff;
        }
        #page-feedme-pos .ks-btn-feedme:hover {
          background: #e66518;
          border-color: #e66518;
          color: #ffffff;
        }
        @media (max-width: 980px) {
          #page-feedme-pos .feedme-feature-grid,
          #page-feedme-pos .feedme-plans-grid,
          #page-feedme-pos .feedme-support-grid,
          #page-feedme-pos .feedme-trust-strip,
          #page-feedme-pos .feedme-workflow {
            grid-template-columns: 1fr;
          }
          #page-feedme-pos .feedme-tools-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #page-feedme-pos .feedme-plan-card.is-popular {
            transform: none;
          }
          #page-feedme-pos .feedme-brand-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          #page-feedme-pos .feedme-feature-card,
          #page-feedme-pos .feedme-plan-card,
          #page-feedme-pos .feedme-tool-card,
          #page-feedme-pos .feedme-workflow-panel {
            border-radius: 22px;
          }
          #page-feedme-pos .feedme-section-title.is-centered {
            text-align: left;
          }
          #page-feedme-pos .feedme-brand-panel {
            border-radius: 16px;
            padding: 1.35rem;
          }
          #page-feedme-pos .feedme-brand-grid {
            gap: 1.1rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #page-feedme-pos .feedme-brand-item {
            min-height: 120px;
          }
          #page-feedme-pos .feedme-brand-item img {
            max-height: 110px;
            max-width: 200px;
          }
          #page-feedme-pos .feedme-tools-grid {
            grid-template-columns: 1fr;
          }
          #page-feedme-pos .feedme-pricing-table .ks-compare-th:not(.ks-compare-th-left) {
            color: var(--feedme-truffle);
            font-size: 0.74rem;
            padding: 0.65rem 0.25rem;
          }
          #page-feedme-pos .feedme-pricing-table .ks-compare-td-left {
            background: rgba(254, 246, 237, 0.92) !important;
            font-size: 0.95rem;
            padding: 0.8rem 0.9rem;
          }
          #page-feedme-pos .feedme-pricing-table .ks-compare-td-data:not(.ks-compare-td-left),
          #page-feedme-pos .feedme-pricing-table .ks-compare-td-book:not(.ks-compare-td-left) {
            min-height: 58px;
            padding: 0.7rem 0.45rem;
          }
          #page-feedme-pos .feedme-compare-note {
            font-size: 0.78rem;
            max-width: 128px;
          }
          #page-feedme-pos .feedme-compare-price {
            font-size: 0.8rem;
            white-space: normal;
          }
        }
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
      `}</style>

      <SectionSidebar sections={FEEDME_SECTIONS} themeColor={FEEDME_ORANGE} />

      <PinnedHeroStage>
        <ProductHero
          className="feedme-hero"
          eyebrow="Software We Specialize In"
          title="FeedMe POS"
          body="AI-driven restaurant POS for dine-in, takeaway, QR ordering, kitchen screens, delivery, reports, and multi-outlet control. Built for restaurants that want one connected system instead of scattered daily tools."
          iconSrc={FEEDME_LOGO}
          iconAlt="FeedMe POS"
          backgroundImage={HERO_PHOTO}
          backgroundVideo="/videos/feedme-hero.mp4"
          showVideoFallback={false}
          overlayOpacity={0.5}
          primaryCta={{ label: "Start Free Trial", onClick: () => runWithProgressFeedback(() => setTrialOpen(true), { assets: [FEEDME_LOGO] }), className: "ks-btn-feedme" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </PinnedHeroStage>

      <main className="pinned-page-content product-app-content">
        <section className="product-app-section feedme-section-oat product-app-section-clean">
          <div className="content-wrap feedme-trust-strip">
            <div className="feedme-trust-copy">
              <h2 className="ks-section-title feedme-trust-title">Trusted by <span>10,000++ Merchants</span></h2>
              <p style={{
                fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em",
                color: "#6b6f91", textTransform: "uppercase", lineHeight: 1.6
              }}>
                Ideal match for every type of restaurant.
              </p>
            </div>

            <div className="feedme-brand-panel">
              <div className="feedme-brand-grid">
                {FEEDME_BRANDS.slice(0, 10).map((src, index) => (
                  <div key={`brand-${src}-${index}`} className="feedme-brand-item">
                    <img src={src} alt="FeedMe merchant brand" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "#fef6ed", "--section-to": "var(--ks-page-mist)" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="training" />
        </div>

        <section className="product-app-section product-app-section-mist product-app-section-from-ice product-app-section-to-paper">
          <div id="training">
            <AutoCountTrainingWebGL
              customVideos={FEEDME_VIDEOS}
              title="FeedMe POS Tutorial Guide"
              themeColor={FEEDME_ORANGE}
              themeHoverColor="#e66518"
              activeTabBg={FEEDME_TRUFFLE}
              playIconColor="#ffffff"
              playBtnBg={FEEDME_ORANGE}
            />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "#fff4e8" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="plans" />
        </div>

        <section id="plans" className="product-app-section feedme-section-plans">
          <div className="content-wrap">
            <SectionTitle
              title="Plan Compare"
              centered
            />

            <FeedMePricingCards cards={FEEDME_PRICING_CARDS} />

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button
                type="button"
                className="ks-btn ks-btn-muted pos-release-more"
                onClick={() => setTableOpen(prev => !prev)}
              >
                {tableOpen ? "Collapse Comparison" : "Open Full Edition Comparison"}
              </button>
            </div>

            {tableOpen && (
              <div className="pos-edition-table-expandable" style={{ marginTop: "2rem" }}>
                <FeedMePricingTable />

                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <button
                    type="button"
                    className="ks-btn ks-btn-muted pos-release-more"
                    onClick={() => {
                      setTableOpen(false);
                      const section = document.getElementById("plans");
                      if (section) {
                        const y = section.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }}
                  >
                    Collapse Comparison
                  </button>
                </div>
              </div>
            )}

            <PremiumToolsPanel onOpenMiniProgram={() => setMiniProgramOpen(true)} />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "#fffdf8", "--section-to": "var(--ks-page-warm)" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="why-ksl" />
        </div>

        <section id="why-ksl" className="product-app-section product-app-section-warm">
          <div className="content-wrap">
            <SectionTitle
              eyebrow="Local rollout"
              title="Why Choose Us"
              body="KSL helps translate the official FeedMe platform into a working restaurant setup: outlet planning, menu setup, hardware, training, and support after go-live."
            />

            <div className="feedme-support-grid">
              {[
                { title: "Outlet Setup", body: "POS devices, printers, network checks, and cashier flow prepared before your team starts serving." },
                { title: "Menu Build", body: "Menu items, modifiers, table layout, and ordering flow configured around the way your restaurant works." },
                { title: "Team Training", body: "Practical training for cashiers, waiters, supervisors, and owners, without burying your team in software jargon." },
                { title: "Ongoing Support", body: "Local follow-up for questions, reporting, integrations, hardware changes, and day-to-day operational issues." },
              ].map((card) => (
                <article key={card.title} className="feedme-support-card">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <EnquireNowCTA
          heading="Get in Touch for a 30-Days Free Trial"
          body="Talk to KSL for plan advice, pricing, hardware bundles, installation, and training for your outlet."
          buttons={[{ label: "Enquire Now", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
        />

        <Footer />
      </main>

      <AutoCountTrialModal
        open={trialOpen}
        onClose={() => setTrialOpen(false)}
        productName="FeedMe POS"
        supportMessage="Hi KS Support Team, I would like to start the FeedMe POS Free Trial and schedule an installation session. I can prepare AnyDesk / UltraViewer."
        checklist={[
          <>Confirm your F&B <strong>business requirements</strong> and number of outlets.</>,
          <>Install or prepare <strong>AnyDesk</strong> / <strong>UltraViewer</strong> for remote setup.</>,
          <>Reserve around <strong>30 minutes</strong> for basic setup and menu configuration.</>,
          <>Message our Support Team to arrange a suitable installation time.</>
        ]}
      />

      <MiniProgramModal
        open={miniProgramOpen}
        onClose={() => setMiniProgramOpen(false)}
      />
    </div>
  );
}
