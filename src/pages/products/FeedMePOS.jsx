import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { PinnedHeroStage } from "../../components/PinnedHeroPage.jsx";
import ProductHero from "../../components/ProductHero.jsx";
import { PageSectionDivider } from "../../components/PageSections.jsx";
import { IconLayers, IconLink, IconHandshake, IconStar, IconVideo, IconRocket } from "../../components/SectionDivider.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import useFavicon from "../../hooks/useFavicon.js";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import AutoCountTrainingWebGL from "../../components/AutoCountTrainingWebGL.jsx";
import { runWithProgressFeedback } from "../../utils/routeTransitions.js";

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
  { id: "features", label: "Features", icon: IconStar, color: FEEDME_ORANGE },
  { id: "plans", label: "Plans", icon: IconRocket, color: FEEDME_ORANGE },
  { id: "tools", label: "Premium Tools", icon: IconLayers, color: FEEDME_BLUE },
  { id: "integration", label: "Integrations", icon: IconLink, color: FEEDME_ORANGE },
  { id: "training", label: "Quick-Start Guide", icon: IconVideo, color: FEEDME_ORANGE },
  { id: "why-ksl", label: "Why KSL", icon: IconHandshake, color: FEEDME_ORANGE },
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

const PLAN_CARDS = [
  {
    name: "Lite",
    price: "RM 0",
    subtitle: "Essential features for small businesses.",
    color: FEEDME_ORANGE,
    features: [
      "Point-of-Sales",
      "Menu Management",
      "Table Management",
      "Invoice Management",
      "Payment Integration (Offline)",
      "Preset Report",
    ],
  },
  {
    name: "Standard",
    price: "RM 90",
    subtitle: "Advanced tools for growing businesses.",
    color: FEEDME_ORANGE,
    features: [
      "Everything in Lite Plan",
      "QR Code Ordering",
      "Payment Integration (Online & Offline)",
      "Accounting Software Integration",
    ],
  },
  {
    name: "Premium",
    price: "RM 129",
    subtitle: "Comprehensive solutions for large-scale operations.",
    color: FEEDME_BLUE,
    popular: true,
    features: [
      "Everything in Standard Plan",
      "Sub POS (Unlimited)",
      "Delivery Integration",
      "Order Display System",
      "Kitchen Display System",
      "Mall Integration",
    ],
  },
];

const PREMIUM_TOOLS = [
  {
    title: "Connect Premium",
    text: "Marketing, CRM, feedback, loyalty, and customer engagement in one restaurant growth layer.",
    color: "#ff5d53",
  },
  {
    title: "Multi-Warehouse Premium",
    text: "Create multiple warehouses for inventory across outlets and keep stock operations easier to control.",
    color: "#50be9b",
  },
  {
    title: "AI Report Premium",
    text: "Automated business performance analysis designed to help owners make faster data-driven decisions.",
    color: "#007ba7",
  },
  {
    title: "Payment Premium",
    text: "Terminal-ready payment options for restaurants that need a more complete payment setup.",
    color: "#8358d4",
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
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      {body && <p>{body}</p>}
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

function PremiumToolCard({ tool }) {
  return (
    <article className="feedme-tool-card" style={{ "--tool-color": tool.color }}>
      <div className="feedme-tool-mark" aria-hidden="true" />
      <h3>{tool.title}</h3>
      <p>{tool.text}</p>
      <a href={WA_LINK} target="_blank" rel="noreferrer">Ask KSL</a>
    </article>
  );
}

export default function FeedMePOSPage() {
  const [trialOpen, setTrialOpen] = useState(false);
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
          --product-section-from: #fff4e8;
          --product-section-bg: #fffdf8;
          --product-section-to: #f7fbf3;
        }
        #page-feedme-pos .feedme-section-tools {
          --product-section-from: #f7fbf3;
          --product-section-bg: #fffdf8;
          --product-section-to: #fef6ed;
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
        #page-feedme-pos .feedme-section-title span {
          display: inline-flex;
          color: var(--feedme-orange);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.13em;
          margin-bottom: 0.7rem;
          text-transform: uppercase;
        }
        #page-feedme-pos .feedme-section-title h2 {
          color: var(--feedme-truffle);
          font-size: clamp(1.8rem, 4vw, 3.2rem);
          font-weight: 850;
          letter-spacing: 0;
          line-height: 1.04;
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
          align-items: center;
          display: grid;
          gap: clamp(1rem, 2vw, 1.7rem);
          grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.28fr);
        }
        #page-feedme-pos .feedme-trust-copy {
          background: var(--feedme-truffle);
          border-radius: 24px;
          box-shadow: 0 24px 70px rgba(85, 82, 74, 0.18);
          color: #fff;
          padding: clamp(1.4rem, 3vw, 2.2rem);
        }
        #page-feedme-pos .feedme-trust-copy strong {
          color: #fff;
          display: block;
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 0.95;
        }
        #page-feedme-pos .feedme-trust-copy span {
          color: rgba(255, 255, 255, 0.72);
          display: block;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-top: 0.75rem;
          text-transform: uppercase;
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
        #page-feedme-pos .feedme-tools-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        #page-feedme-pos .feedme-tool-card {
          background: #fff;
          border: 1px solid rgba(85, 82, 74, 0.1);
          border-radius: 28px;
          box-shadow: 0 18px 70px rgba(85, 82, 74, 0.08);
          overflow: hidden;
          padding: 1.2rem;
          position: relative;
        }
        #page-feedme-pos .feedme-tool-mark {
          background: linear-gradient(135deg, var(--tool-color), rgba(255, 255, 255, 0.4));
          border-radius: 22px;
          height: 84px;
          margin-bottom: 1rem;
          width: 100%;
        }
        #page-feedme-pos .feedme-tool-card a {
          color: var(--tool-color);
          display: inline-flex;
          font-size: 0.86rem;
          font-weight: 850;
          margin-top: 1rem;
          text-decoration: none;
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
        #page-feedme-pos .feedme-workflow-panel h2 {
          color: #fff;
          font-size: clamp(1.9rem, 4vw, 3.4rem);
          line-height: 1.02;
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
          #page-feedme-pos .feedme-tools-grid,
          #page-feedme-pos .feedme-support-grid,
          #page-feedme-pos .feedme-trust-strip,
          #page-feedme-pos .feedme-workflow {
            grid-template-columns: 1fr;
          }
          #page-feedme-pos .feedme-plan-card.is-popular {
            transform: none;
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
        <section className="product-app-section product-app-section-paper product-app-section-clean" style={{ paddingBottom: 0 }}>
          <div className="content-wrap feedme-trust-strip">
            <div className="feedme-trust-copy">
              <strong>10,000++</strong>
              <span>Merchants trust FeedMe</span>
              <p style={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.7, margin: "1rem 0 0" }}>
                Official FeedMe positions the platform for every type of restaurant. KSL brings the setup, training, and support closer to your outlet.
              </p>
            </div>

            <div
              className="ac-brand-marquee-container"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
              }}
            >
              <div className="ac-brand-marquee">
                {[...FEEDME_BRANDS, ...FEEDME_BRANDS, ...FEEDME_BRANDS, ...FEEDME_BRANDS].map((src, index) => (
                  <div key={`${src}-${index}`} className="ac-brand-item">
                    <img src={src} alt="FeedMe merchant logo" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="product-app-section feedme-section-oat">
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

        <div className="product-app-divider" style={{ "--section-from": "#fff4e8", "--section-to": "#fffdf8" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="plans" />
        </div>

        <section id="plans" className="product-app-section feedme-section-plans">
          <div className="content-wrap">
            <SectionTitle
              eyebrow="POS plans and software pricing"
              title="Choose your path to success with FeedMe."
              body="Official FeedMe pricing is organized into Lite, Standard, and Premium. KSL can advise which plan fits your outlet count, ordering channels, and hardware setup."
              centered
            />

            <div className="feedme-plans-grid">
              {PLAN_CARDS.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
            </div>

            <p className="feedme-card-text" style={{ textAlign: "center", marginTop: "1.25rem" }}>
              Pricing shown follows FeedMe's official monthly plan structure. Hardware, onboarding, payment terminals, and optional premium tools may be quoted separately.
            </p>
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "#f7fbf3", "--section-to": "#fffdf8" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="tools" />
        </div>

        <section id="tools" className="product-app-section feedme-section-tools">
          <div className="content-wrap">
            <SectionTitle
              eyebrow="Premium tools"
              title="Add restaurant growth tools when your operation is ready."
              body="FeedMe's official pricing page separates premium tools from the core POS plan. That makes it easier to start simple, then add CRM, warehouse, AI reporting, or payment capabilities later."
            />

            <div className="feedme-tools-grid">
              {PREMIUM_TOOLS.map((tool) => <PremiumToolCard key={tool.title} tool={tool} />)}
            </div>
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "#fef6ed", "--section-to": "#fff4e8" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="integration" />
        </div>

        <section id="integration" className="product-app-section feedme-section-integration">
          <div className="content-wrap feedme-workflow">
            <div className="feedme-workflow-panel">
              <h2>One order, connected from table to report.</h2>
              <p>
                FeedMe is not just a cashier screen. Orders can move from QR code to kitchen display, payment, invoice, reporting, and accounting integration without rebuilding the same data again.
              </p>
            </div>
            <div className="feedme-workflow-list">
              {WORKFLOW_STEPS.map((step, index) => (
                <article key={step.label} className="feedme-workflow-card">
                  <b>{index + 1}</b>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
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
              title="FeedMe POS Quick-Start Guide"
              themeColor={FEEDME_ORANGE}
              themeHoverColor="#e66518"
              activeTabBg={FEEDME_TRUFFLE}
              playIconColor="#ffffff"
              playBtnBg={FEEDME_ORANGE}
            />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-warm)" }}>
          <PageSectionDivider sections={FEEDME_SECTIONS} id="why-ksl" />
        </div>

        <section id="why-ksl" className="product-app-section product-app-section-warm">
          <div className="content-wrap">
            <SectionTitle
              eyebrow="Local rollout"
              title="FeedMe software, KSL hands-on support."
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
          heading="Ready to run your restaurant on FeedMe?"
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
    </div>
  );
}
