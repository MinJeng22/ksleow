import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero.jsx";
import { PinnedHeroStage } from "../../components/PinnedHeroPage.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { PageSectionDivider, getSection } from "../../components/PageSections.jsx";
import WhyChooseUs from "../../components/WhyChooseUs.jsx";
import {
  IconDollar,
  IconGrid,
  IconLedger,
  IconStar,
  IconTrophy,
  IconVideo,
  IconDatabase,
  IconRegister,
  IconRocket,
} from "../../components/SectionDivider.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import HexFeatures from "../../components/HexFeatures.jsx";
import ProductPromotionBento from "../../components/ProductPromotionBento.jsx";
const POS_PROMOTIONS = [
  { image: "/images/promotions/autocount-pos-promo.webp" },
  {
    title: "Earn rewards when you refer AutoCount users",
    image: "/images/promotions/ksl-referral-program.webp",
    cta: { href: `https://wa.me/60179052323?text=${encodeURIComponent("Hi, I'm interested in AutoCount POS. Can you share more details?")}`, target: "_blank", label: "WhatsApp Us" },
  },
  { image: "/images/promotions/pos-promo-temp.webp" },
];
import { CompareFeatureCell } from "../../components/CompareTable.jsx";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import AutoCountTrainingWebGL from "../../components/AutoCountTrainingWebGL.jsx";
import useFavicon from "../../hooks/useFavicon.js";
import { formatSST } from "../../utils/formatSST.jsx";
import { runWithProgressFeedback } from "../../utils/routeTransitions.js";
import posReleases from "../../content/autocountPosReleases.json";
import { CopyReleaseButton, HighlightText, ReleaseNumber, ShareLinkButton, writeClipboard } from "../../components/ReleaseTools.jsx";

const POS_ACCENT = "#e49e25";
const POS_NAVY = "#2f315a";
const POS_HERO = "/images/products/autocount-pos-showcase.webp";
const POS_ICON = "/images/products/autocount-pos.webp";
const POS_BACKEND_IMAGE = "/images/products/autocount-pos-backend.webp";
const POS_BACKEND_IMAGE_BLACK = "/images/products/autocount-pos-backend-black.webp";
const POS_BACKEND_UI = "/images/products/autocount-pos-backend-ui.webp";
const POS_FRONTEND_IMAGE = "/images/products/autocount-pos-frontend.webp";
const POS_FRONTEND_IMAGE_BLACK = "/images/products/autocount-pos-frontend-black.webp";
const POS_FRONTEND_UI = "/images/products/autocount-pos-frontend-ui.webp";
const FREE_TRIAL_URL = "https://auth.autocountcloud.com/identity/account/register/accounting?dealerCode=SYNS6037";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "Hi KS Support Team, I am interested in AutoCount POS. I would like to arrange a demo or get a quotation. Thank you."
)}`;

const POS_SECTIONS = [
  { id: "features", label: "Advantages", icon: IconStar, color: POS_ACCENT },
  { id: "promotions", label: "Promotions", icon: IconRocket, color: POS_ACCENT },
  { id: "system", label: "POS System", icon: IconGrid, color: POS_ACCENT },
  { id: "training", label: "Tutorial Guide", icon: IconVideo, color: POS_ACCENT },
  { id: "editions", label: "Backend", icon: IconDatabase, color: POS_NAVY },
  { id: "frontend", label: "Front End", icon: IconRegister, color: POS_NAVY },
  { id: "releases", label: "Release Notes", icon: IconLedger, color: "#b97812" },
  { id: "why-ksl", label: "Why Choose Us", icon: IconTrophy, color: POS_ACCENT },
];

const POS_RELEASES = posReleases;

const POS_TUTORIAL_VIDEOS = [
  {
    id: "YGjATcKe_A0",
    playlistId: "PLY0HF8flL30zq_OkKerTe_D6q-E5KV911",
    label: "POS Tutorial",
    description: "Follow AutoCount POS training videos for front-end cashier flow, backend setup, item and stock handling, and the practical steps your outlet team needs before going live.",
    note: "POS Guide",
    customThumbnail: "/images/products/pos-tutorial-thumb.webp",
    thumbnailCropScale: 1.0,
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2.5" /><path d="M8 20v2h8v-2" /><path d="M10 9l6 3-6 3V9z" fill="currentColor" stroke="none" /></svg>,
  },
];

const HEX_FEATURES = [
  {
    title: "SST-Compliant POS",
    desc: "Fully SST-ready with tax-inclusive pricing, GST migration support, and government-compliant receipt formatting built into every transaction.",
    color: "#a8cd2b",
  },
  {
    title: "Integrated with Accounting",
    desc: "POS sales, stock movements, payment collections, and daily reports sync directly to AutoCount Accounting — no duplicate data entry required.",
    color: "#f7a600",
  },
  {
    title: "Real-Time Control",
    desc: "Monitor live sales, track stock levels, manage cash flow, and view outlet performance from anywhere with real-time dashboard and reporting.",
    color: "#079c8a",
  },
  {
    title: "Scalable for Any Size",
    desc: "From a single counter to multi-branch outlets — add counters, branches, and users as your business grows without replacing your system.",
    color: "#234990",
  },
  {
    title: "LHDN e-Invoice Ready",
    desc: "Submit, validate, and manage LHDN-compliant e-Invoices directly from the POS counter — integrated with MyInvois for seamless compliance.",
    color: "#7f3b77",
  },
  {
    title: "Built for Your Business",
    desc: "Built-in report designer, plugin support, customisable grid layout, user-defined fields, scripting, and Web API for software integration.",
    color: "#e0222a",
  },
];


const EDITION_COLUMNS = ["POS Basic", "POS Standard"];
const EDITION_ROWS = [
  { label: "One-Time Payment", values: ["RM 2,300 + 8%SST", "RM 3,100 + 8%SST"], type: "price" },
  { label: "POS Counter A", values: ["1", "1"] },
  { label: "Default Account Book", values: ["3", "3"] },
  { label: "Default E-Invoice Account Book", values: ["1", "1"] },
  { label: "No. of Concurrent Network User", values: ["1", "1"] },
];


const ACCOUNTING_MODULE_SECTIONS = [
  {
    name: "Accounting Modules",
    rows: [
      ["SST, Project, Multi-Currency", "-", "-", "-"],
      ["GL, AR, AP, Recurrence GL", "-", "-", "-"],
      ["Simple Purchase", "-", "-", "-"],
      ["Simple Stock", "-", "-", "-"],
      ["Simple Sales", "RM 400 + 8%SST", "+", "+"],
      ["Complete Sales", "RM 600 + 8%SST", "+", "+"],
      ["Complete Purchase", "RM 600 + 8%SST", "+", "+"],
      ["Complete Stock", "RM 600 + 8%SST", "+", "+"],
      ["UDF/Formula", "RM 400 + 8%SST", "Included", "Included"],
      ["Basic Multi-UOM", "RM 600 + 8%SST", "+", "+"],
      ["Budget/Advanced Financial Report", "RM 600 + 8%SST", "+", "+"],
      ["Activity Stream", "RM 800 + 8%SST", "+", "+"],
      ["Advanced Multi-UOM", "RM 1,200 + 8%SST", "+", "+"],
      ["Advanced Quotation", "RM 1,200 + 8%SST", "+", "+"],
      ["Consignment", "RM 600 + 8%SST", "+", "+"],
      ["FOC Quantity", "RM 600 + 8%SST", "+", "+"],
      ["Landing Cost", "RM 600 + 8%SST", "+", "+"],
      ["Multi-Location", "RM 600 + 8%SST", "+", "+"],
      ["Recurrence (Sales and Purchase)", "RM 1,200 + 8%SST", "+", "+"],
      ["Scripting", "RM 600 + 8%SST", "+", "+"],
      ["Filter by salesman", "RM 1,200 + 8%SST", "+", "+"],
      ["Advanced Item", "RM 1,200 + 8%SST", "+", "+"],
      ["Item Batch", "RM 1,200 + 8%SST", "+", "+"],
      ["Item Package / Item Template", "RM 1,200 + 8%SST", "+", "+"],
      ["Multi-Dimensional Analysis", "RM 1,600 + 8%SST", "+", "+"],
      ["Remote Credit Control", "RM 1,200 + 8%SST", "+", "+"],
      ["Stock Assembly", "RM 1,200 + 8%SST", "+", "+"],
    ],
  },
  {
    name: "Optional Modules",
    rows: [
      ["Advanced Multi-Currency", "RM 1,600 + 8%SST", "+", "+"],
      ["API", "RM 400 + 8%SST", "+", "+"],
      ["Bonus Point", "RM 2,000 + 8%SST", "+", "+"],
      ["Consolidated Financial Report", "RM 4,000 + 8%SST", "+", "+"],
      ["Department", "RM 1,200 + 8%SST", "+", "+"],
      ["Export Account", "RM 400 + 8%SST", "+", "+"],
      ["Export Stock", "RM 800 + 8%SST", "+", "+"],
      ["Filter by account", "RM 1,600 + 8%SST", "+", "+"],
      ["Import Third Party Xml", "RM 1,600 + 8%SST", "+", "+"],
      ["Multi-Dimensional Price Book", "RM 1,600 + 8%SST", "+", "+"],
      ["Multi-Level Assembly", "RM 2,000 + 8%SST", "+", "+"],
      ["Serial Number", "RM 2,000 + 8%SST", "+", "+"],
      ["Stock Disassembly", "RM 1,600 + 8%SST", "+", "+"],
      ["Unrealized Gain/Loss", "RM 800 + 8%SST", "+", "+"],
      ["Sales Order Processing", "RM 6,000 + 8%SST", "-", "-"],
      ["Assembly Order Processing", "RM 6,000 + 8%SST", "-", "-"],
      ["Intelligent Costing", "RM 3,000 + 8%SST", "-", "+"],
    ],
  },
];

const POS_MODULE_SECTIONS = [
  {
    name: "POS Modules",
    rows: [
      ["POS Stock", "RM 800 + 8%SST", "+", "Included"],
      ["POS Account", "RM 1,200 + 8%SST", "+", "+"],
      ["POS Serial Number", "RM 1,000 + 8%SST", "+", "+"],
      ["POS Item Batch", "RM 600 + 8%SST", "+", "+"],
      ["POS Item Package", "RM 600 + 8%SST", "+", "+"],
    ],
  },
];

 

const COUNTER_COLUMNS = ["A", "B", "Branch"];
const COUNTER_ROWS = [
  { label: "Software", values: ["RM 2,300 + 8%SST", "RM 1,300 + 8%SST", "RM 2,900 + 8%SST"], type: "price" },
  { label: "Local Database", values: ["Included", "-", "Included"] },
];

const FRONTEND_MODULE_SECTIONS = [
  {
    name: "POS Frontend Module",
    rows: [
      ["Branch Sync", "RM 600 + 8%SST", "+", "-", "Included"],
      ["RemoteHQ / GIT / AR Payment", "RM 500 + 8%SST", "+", "+", "+"],
      ["POS Sales Order", "RM 600 + 8%SST", "+", "+", "+"],
      ["Mall Submission", "RM 600 + 8%SST", "+", "+", "+"],
    ],
  },
  {
    name: "Standalone Application",
    rows: [
      ["Price Checker (Per Device)", "RM 500 + 8%SST", "+", "-", "+"],
      ["eWaiter Apps (Per User)", "RM 700 + 8%SST", "+", "-", "+"],
    ],
  },
  {
    name: "Dongle",
    rows: [["POS Dongle", "RM 200 + 8%SST", "+", "+", "+"]],
  },
];

 

function POSMarker({ value, price = false }) {
  if (price) {
    return <span className="pos-price-value">{formatSST(value)}</span>;
  }
  if (value === "+") {
    return <span className="pos-marker pos-marker-plus">+</span>;
  }
  if (value === "Included") {
    return <span className="pos-marker pos-marker-included">Included</span>;
  }
  if (value === "●") {
    return (
      <span className="pos-marker pos-marker-circle" />
    );
  }
  if (!value || value === "-") {
    return <span className="pos-marker pos-marker-muted">-</span>;
  }
  return <span>{formatSST(value)}</span>;
}

function POSCompareTable({
  columns,
  leftLabel,
  rows,
  sections,
  accent = POS_ACCENT,
  inlinePrice = false,
  mobileWidth = 760,
}) {
  const columnCount = columns.length;
  const renderRow = (row) => {
    const priceRow = row.type === "price";
    return (
      <tr key={row.label} className={priceRow ? "ks-compare-tr-book" : "ks-compare-tr-data"}>
        <CompareFeatureCell className={priceRow ? "ks-compare-td-book" : "ks-compare-td-data"} style={{ fontWeight: 600 }} meta={row.meta}>
          {row.label}
        </CompareFeatureCell>
        {row.values.map((value, index) => (
          <td key={`${row.label}-${index}`} className={priceRow ? "ks-compare-td-book" : "ks-compare-td-data"}>
            <POSMarker value={value} price={priceRow} />
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="ks-compare-panel pos-compare-panel">
      <div className="ks-compare-wrap">
        <table
          className="ks-compare-table"
          style={{
            "--edition-count": columnCount,
            "--mobile-table-width": `${mobileWidth}px`,
          }}
        >
          <colgroup>
            <col className="ks-compare-col-feature" width={columnCount > 2 ? "32%" : "38%"} />
            {columns.map((column) => (
              <col key={column} className="ks-compare-col-edition" width={`${(columnCount > 2 ? 68 : 62) / columnCount}%`} />
            ))}
          </colgroup>
          <thead className="ks-compare-thead">
            <tr style={{ "--th-bg": accent }}>
              <th className="ks-compare-th ks-compare-th-left">{leftLabel}</th>
              {columns.map((column) => (
                <th key={column} className="ks-compare-th">
                  <span className="ks-compare-edition-name">{column}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="ks-compare-tbody">
            {rows?.map(renderRow)}
            {sections?.map((section) => (
              <React.Fragment key={section.name}>
                <tr className="ks-compare-tr-section">
                  <td colSpan={columnCount + 1} className="ks-compare-td-section">
                    {section.name}
                  </td>
                </tr>
                {section.rows.map(([label, ...values]) =>
                  renderRow({
                    label,
                    meta: inlinePrice ? values[0] : null,
                    values: values.slice(1),
                    type: label === "Software" ? "price" : undefined,
                  })
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function SectionIntro({ title, text, shareHash, onClick }) {
  return (
    <div className="pos-section-intro">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', userSelect: onClick ? 'none' : 'auto' }} onClick={onClick}>
        <span className="ks-section-title ks-section-title-inherit">{title}</span>
        {shareHash && <ShareLinkButton variant="icon" hash={shareHash} />}
      </h2>
      {text && <p>{text}</p>}
    </div>
  );
}



function NotesPanel({ title, items }) {
  return (
    <aside className="pos-note-panel">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

function POSSystemExplainer() {
  const backendRef = useRef(null);
  const frontendRef = useRef(null);
  const [isBackendLit, setIsBackendLit] = useState(false);
  const [isFrontendLit, setIsFrontendLit] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    if (lightboxImage) {
      document.body.classList.add("partner-modal-open");
    } else {
      document.body.classList.remove("partner-modal-open");
    }
    return () => document.body.classList.remove("partner-modal-open");
  }, [lightboxImage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === backendRef.current) setIsBackendLit(entry.isIntersecting);
          if (entry.target === frontendRef.current) setIsFrontendLit(entry.isIntersecting);
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -12% 0px" }
    );

    if (backendRef.current) observer.observe(backendRef.current);
    if (frontendRef.current) observer.observe(frontendRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="content-wrap pos-system-wrap">
      <SectionIntro
        title="Understand AutoCount POS Backend and Frontend"
      />

      <div className="pos-system-layout">
        <article ref={backendRef} className={`pos-system-card ${isBackendLit ? "is-lit" : ""}`}>
          <div className="pos-system-visual pos-system-visual-backend" style={{ cursor: "zoom-in" }} onClick={() => setLightboxImage(POS_BACKEND_UI)}>
            <img src={POS_BACKEND_IMAGE_BLACK} alt="AutoCount POS backend management screen" loading="lazy" className="pos-img-base" />
            <img src={POS_BACKEND_IMAGE} alt="" aria-hidden="true" className="pos-img-overlay" />
          </div>
          <div className="pos-system-copy">
            <span>Backend Management System</span>
            <h3>For Owners and Management</h3>
            <p>
              Manage POS operations, products, pricing, cashier access rights, outlets, stock, and reports from one central system.
            </p>
            <p>
              With selected modules, AutoCount POS Backend can also support cash sales, accounting, e-Invoices, customer and supplier transactions, and financial reporting.
            </p>
            <ul>
              <li>Manage products, pricing, customers, users, outlets, and cashier access rights.</li>
              <li>Set prices, discounts, and promotions.</li>
              <li>Review sales, stock, closing reports, audit trails, and sync status.</li>
              <li>Handle cash sales, accounting, and e-Invoices with selected modules.</li>
              <li>Centralize POS and accounting data in one system.</li>
            </ul>
          </div>
        </article>

        <div className="pos-system-divider" aria-hidden="true">
          <div className="pos-system-divider-chip">
            <svg className="pos-sync-icon-desktop" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 5 12 3 3 12 12 21 12 19" /></svg>
            <svg className="pos-sync-icon-mobile" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 3 12 12 3 21 12 19 12" /></svg>
            <span>sync</span>
            <svg className="pos-sync-icon-mobile" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="19 12 21 12 12 21 3 12 5 12" /></svg>
            <svg className="pos-sync-icon-desktop" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 5 12 3 21 12 12 21 12 19" /></svg>
          </div>
        </div>

        <article ref={frontendRef} className={`pos-system-card ${isFrontendLit ? "is-lit" : ""}`}>
          <div className="pos-system-visual pos-system-visual-frontend" style={{ cursor: "zoom-in" }} onClick={() => setLightboxImage(POS_FRONTEND_UI)}>
            <img src={POS_FRONTEND_IMAGE_BLACK} alt="AutoCount POS frontend cashier terminal" loading="lazy" className="pos-img-base" />
            <img src={POS_FRONTEND_IMAGE} alt="" aria-hidden="true" className="pos-img-overlay" />
          </div>
          <div className="pos-system-copy">
            <span>Frontend Register Counter</span>
            <h3>For Cashiers</h3>
            <p>
              Manage daily sales, returns, payments, receipts, and e-Invoice submissions through a fast and user-friendly checkout system.
            </p>
            <p>
              Add more register counters anytime as your business grows. Each counter can operate without an internet connection and supports customizable receipt and report designs to meet different business requirements.
            </p>
            <ul>
              <li>Scan items and process sales, returns, and payments.</li>
              <li>Print receipts and customize receipt formats.</li>
              <li>Submit e-Invoices directly from the counter.</li>
              <li>Connect with barcode scanners, receipt printers, cash drawers, and payment devices.</li>
              <li>Sync sales and stock movements with the backend.</li>
            </ul>
          </div>
        </article>
      </div>

      <aside className="pos-system-callout">
        <div className="pos-system-callout-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        </div>
        <div className="pos-system-callout-body">
          <strong>Single-PC setup is possible.</strong>
          <span>
            Backend and Frontend can run on the same computer — but the PC should have stronger specs for smooth cashier, sync, reporting, and backup performance.
          </span>
        </div>
      </aside>

      <aside className="pos-system-callout" style={{ marginTop: "1rem" }}>
        <div className="pos-system-callout-icon" aria-hidden="true" style={{ background: "rgba(128, 195, 30, 0.15)", color: "#669c1a" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div className="pos-system-callout-body">
          <strong>Already using AutoCount Accounting?</strong>
          <span>
            You can seamlessly add AutoCount POS Frontend registers to your existing accounting system.
          </span>
        </div>
      </aside>

      {lightboxImage && typeof document !== "undefined" && createPortal(
        <div 
          className="partner-modal-backdrop" 
          onClick={() => setLightboxImage(null)} 
          style={{ zIndex: 99999, animation: "promo-lightbox-fade 0.2s ease forwards", cursor: "zoom-out" }}
        >
          <div className="promo-lightbox-frame" onClick={(e) => e.stopPropagation()} style={{ cursor: "default", maxWidth: "80vw", maxHeight: "85vh" }}>
            <button className="partner-modal-close" onClick={() => setLightboxImage(null)} aria-label="Close" style={{ top: 16, right: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img src={lightboxImage} alt="Fullscreen UI" className="promo-lightbox-img" style={{ maxWidth: "100%", maxHeight: "85vh" }} loading="eager" decoding="async" fetchpriority="high" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const posReleaseCode = (release) => String(release.version || "").replace(/\./g, "-");

function copyPosRelease(release, type) {
  const label = type === "fixes" ? "Bug Fixes" : "Enhancements";
  const items = release[type] || [];
  const text = [
    `AutoCount POS ${release.version} - ${label}`,
    release.date ? `Release Date: ${release.date}` : "",
    "",
    ...items.map((item, index) => `${index + 1}. ${item}`),
    "",
    release.releasePdfUrl ? `Official PDF: ${release.releasePdfUrl}` : "",
  ].filter(Boolean).join("\n");
  writeClipboard(text);
}

function POSReleaseList({ title, items, type, release, search }) {
  const isFix = type === "fixes";
  return (
    <div className="pos-release-list">
      <div className="pos-release-list-head">
        <h4>{title}</h4>
        {items.length > 0 && (
          <CopyReleaseButton variant="button" gold={isFix} onClick={() => copyPosRelease(release, type)} />
        )}
      </div>
      {items.length === 0 ? (
        <p className="pos-release-empty">No items listed in this official note.</p>
      ) : (
        <div className="pos-release-items">
          {items.map((item, index) => (
            <div key={`${release.version}-${type}-${index}`} className="pos-release-item">
              <ReleaseNumber number={index + 1} type={isFix ? "fix" : "feature"} fixColor={POS_ACCENT} fixBg="rgba(228, 158, 37, 0.13)" />
              <span className="ks-list-text"><HighlightText text={item} search={search} /></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function POSReleaseCard({ release, expanded, onToggle, search }) {
  const isLatest = release === POS_RELEASES[0];
  const releaseId = `pos-release-${posReleaseCode(release)}`;
  const hasHighlights = !!release.highlightsUrl;
  const meta = [
    release.dbVer && `Backend DB ${release.dbVer.replace(/\.$/, "")}`,
    release.posDbVer && `POS DB ${release.posDbVer.replace(/\.$/, "")}`,
    release.frontendDbVer && `Frontend DB ${release.frontendDbVer.replace(/\.$/, "")}`,
    release.server && `Server ${release.server.replace(/\.$/, "")}`,
  ].filter(Boolean);

  return (
    <article id={releaseId} className={`pos-release-card${expanded ? " is-expanded" : ""}`}>
      <button type="button" className="pos-release-card-head" onClick={onToggle}>
        <span className="pos-release-main">
          <span className="pos-release-title-row">
            <strong>{release.version}</strong>
            <em>{release.rev}</em>
            {isLatest && <i>Latest</i>}
            {hasHighlights && <i className="is-highlight">Highlights</i>}
          </span>
          <span className="pos-release-meta">
            Released {release.date || "from official release note"}
            {release.lastModified ? ` - Updated ${release.lastModified}` : ""}
          </span>
        </span>
        <span className="pos-release-counts" aria-label="Release note item counts">
          <b>{release.features.length} Enhancements</b>
          <b>{release.fixes.length} Fixes</b>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="pos-release-detail">
          <div className="pos-release-actions">
            {release.releasePdfUrl && <a href={release.releasePdfUrl} target="_blank" rel="noreferrer">Official PDF</a>}
            {hasHighlights && <a href={release.highlightsUrl} target="_blank" rel="noreferrer">Highlight PDF</a>}
            <ShareLinkButton variant="button" compact hash={`#${releaseId}`} params={{ pr: posReleaseCode(release) }} title="Copy a shareable link to this POS release note" />
          </div>

          {meta.length > 0 && (
            <div className="pos-release-meta-grid">
              {meta.map((item) => <span key={item}>{item}</span>)}
            </div>
          )}

          <div className="pos-release-detail-grid">
            <POSReleaseList title="Enhancements" items={release.features} type="features" release={release} search={search} />
            <POSReleaseList title="Bug Fixes" items={release.fixes} type="fixes" release={release} search={search} />
          </div>
        </div>
      )}
    </article>
  );
}

function POSReleaseNotesSection({ search, setSearch, expanded, setExpanded, visibleLimit, setVisibleLimit }) {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? POS_RELEASES.filter((release) => {
        const haystack = [
          release.version,
          release.rev,
          release.date,
          release.lastModified,
          release.dbVer,
          release.posDbVer,
          release.frontendDbVer,
          release.server,
          ...(release.features || []),
          ...(release.fixes || []),
        ].join(" ").toLowerCase();
        return haystack.includes(query);
      })
    : POS_RELEASES;
  const shown = filtered.slice(0, visibleLimit);
  const latest = POS_RELEASES[0];
  const highlightCount = POS_RELEASES.filter((release) => release.highlightsUrl).length;

  return (
    <section id="releases" className="ac-section-tight product-app-section product-app-section-cloud product-app-section-to-warm">
      <div className="content-wrap">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          <div>
            <h2 className="ks-section-title ks-section-title-inherit" style={{ fontSize: "clamp(1.45rem, 2.7vw, 2.15rem)", fontWeight: 780, color: "var(--pos-navy)", margin: 0 }}>
              Official Release Notes
            </h2>
            <p style={{ fontSize: "0.86rem", color: "#6b6f91", margin: "0.45rem 0 0" }}>
              {POS_RELEASES.length} revisions • {highlightCount} highlights • Rev {latest.rev} • Newest first
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2"
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search POS release notes..."
              value={search} onChange={(event) => { setSearch(event.target.value); setVisibleLimit(5); }}
              style={{ width: "100%", paddingLeft: 42, paddingRight: 16, height: 46, borderRadius: 50, border: "1px solid rgba(47,49,90,0.13)", fontSize: "0.9rem", fontFamily: "inherit", color: "var(--pos-navy)", outline: "none", background: "#ffffff" }}
            />
          </div>
          <button onClick={() => setExpanded(null)}
            style={{ fontSize: "0.86rem", color: "#6b6f91", background: "transparent", border: "1px solid rgba(47,49,90,0.15)", borderRadius: 50, padding: "0.45rem 1.1rem", cursor: "pointer", fontFamily: "inherit" }}>
            Collapse all
          </button>
        </div>

        <div className="pos-release-source">
          Source: <a href="https://wiki.autocountsoft.com/wiki/Category:AutoCount_Pos_5.2:_Release_Note" target="_blank" rel="noreferrer">AutoCount POS 5.2 official release note category</a>
        </div>

        {shown.length === 0 ? (
          <div className="pos-release-empty-panel">No POS releases match "{search}".</div>
        ) : (
          <div className="pos-release-stack">
            {shown.map((release) => (
              <POSReleaseCard
                key={release.version}
                release={release}
                expanded={expanded === release.version || search.trim() !== ""}
                onToggle={() => setExpanded(expanded === release.version ? null : release.version)}
                search={search}
              />
            ))}
          </div>
        )}

        {filtered.length > visibleLimit && (
          <button type="button" className="ks-btn ks-btn-muted pos-release-more" onClick={() => setVisibleLimit((limit) => limit + 5)}>
            View more releases
          </button>
        )}
      </div>
    </section>
  );
}


export default function AutoCountPOSPage({ onContact }) {
  useFavicon(POS_ICON);
  const [trialOpen, setTrialOpen] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);
  const [releaseSearch, setReleaseSearch] = useState("");
  const [expandedRelease, setExpandedRelease] = useState(null);
  const [releaseVisibleLimit, setReleaseVisibleLimit] = useState(5);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedRelease = POS_RELEASES.find((release) => posReleaseCode(release) === params.get("pr"));
    if (sharedRelease) {
      setExpandedRelease(sharedRelease.version);
    }

    const scrollTarget = window.location.hash || (sharedRelease ? `#pos-release-${posReleaseCode(sharedRelease)}` : "");
    if (scrollTarget) {
      const timer = window.setTimeout(() => {
        const el = document.querySelector(scrollTarget);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 90);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    return undefined;
  }, []);

  const handleContact = () => {
    if (onContact) onContact();
  };

  return (
    <div id="page-autocount-pos" className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <style>{`
        #page-autocount-pos {
          --pos-accent: ${POS_ACCENT};
          --pos-navy: ${POS_NAVY};
          --ks-page-paper: #fbfaf7;
          --ks-page-mist: #f6f5f0;
          --ks-page-ice: #f8fafb;
          --ks-page-cloud: #eef3f6;
          --ks-page-warm: #fff6e7;
          background:
            linear-gradient(180deg, var(--ks-page-mist) 0%, var(--ks-page-paper) 36%, var(--ks-page-cloud) 100%);
        }
        #page-autocount-pos .product-app-section {
          --product-section-start: 16%;
          --product-section-end: 84%;
          --product-section-glow: 0.48;
        }
        #page-autocount-pos .product-app-section::before {
          background:
            radial-gradient(circle at 12% 8%, rgba(228, 158, 37, 0.055), transparent 34%),
            radial-gradient(circle at 86% 12%, rgba(47, 49, 90, 0.038), transparent 38%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0));
        }
        #page-autocount-pos .ks-btn-primary {
          background: var(--pos-accent) !important;
          border-color: var(--pos-accent) !important;
          color: #ffffff !important;
        }
        #page-autocount-pos .ks-btn-primary:hover {
          background: #f0ad32 !important;
          border-color: #f0ad32 !important;
        }
        #page-autocount-pos .product-hero {
          --product-hero-overlay: linear-gradient(90deg, rgba(22, 24, 38, 0.8), rgba(22, 24, 38, 0.46), rgba(22, 24, 38, 0.28));
        }
        #page-autocount-pos .pos-section-intro {
          max-width: 780px;
          margin: 0 auto 2.5rem;
          text-align: center;
        }
        #page-autocount-pos .pos-section-intro h2 {
          margin: 0.55rem 0 0;
          color: var(--pos-navy);
          font-size: clamp(1.55rem, 3vw, 2.35rem);
          line-height: 1.15;
          font-weight: 760;
        }
        #page-autocount-pos .pos-section-intro p {
          margin: 0.9rem auto 0;
          max-width: none;
          color: #6b6f91;
          font-size: 0.98rem;
          line-height: 1.75;
        }

        #page-autocount-pos .pos-system-wrap {
          max-width: 1380px;
        }
        #page-autocount-pos .pos-system-wrap .pos-section-intro {
          margin-bottom: clamp(2rem, 4vw, 3.1rem);
        }
        #page-autocount-pos .pos-system-wrap .pos-section-intro h2 {
          justify-content: flex-start !important;
        }
        #page-autocount-pos .pos-system-wrap .pos-section-intro p {
          margin-left: 0;
          margin-right: 0;
        }
        #page-autocount-pos .pos-system-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(3rem, 6vw) minmax(0, 1fr);
          gap: clamp(1.35rem, 3.2vw, 2.6rem);
          align-items: stretch;
        }
        #page-autocount-pos .pos-system-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        #page-autocount-pos .pos-system-visual {
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #page-autocount-pos .pos-system-visual img {
          width: 100%;
          height: auto;
          display: block;
        }
        #page-autocount-pos .pos-system-visual-backend img {
          width: 78%;
        }
        #page-autocount-pos .pos-img-base {
          position: relative;
          z-index: 1;
        }
        #page-autocount-pos .pos-img-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          opacity: 0;
          pointer-events: none;
          transition: opacity 2800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms;
        }
        #page-autocount-pos .pos-system-card.is-lit .pos-img-overlay {
          opacity: 1;
        }
        #page-autocount-pos .pos-system-copy {
          padding: clamp(1.35rem, 2.4vw, 1.75rem) 0 0;
        }
        #page-autocount-pos .pos-system-copy > span {
          color: var(--pos-accent);
          font-size: 0.7rem;
          font-weight: 760;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }
        #page-autocount-pos .pos-system-copy h3 {
          margin: 0.8rem 0 0;
          font-size: clamp(1.25rem, 2vw, 1.7rem);
          font-weight: 640;
          line-height: 1.18;
          letter-spacing: -0.015em;
        }
        #page-autocount-pos .pos-system-copy p {
          margin: 0.8rem 0 0;
          font-size: 0.9rem;
          line-height: 1.8;
          opacity: 0.8;
        }
        #page-autocount-pos .pos-system-copy ul {
          display: grid;
          gap: 0.78rem;
          margin: 1.45rem 0 0;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          padding: 1.2rem 0 0;
          list-style: none;
        }
        #page-autocount-pos .pos-system-copy li {
          position: relative;
          padding-left: 1.45rem;
          font-size: 0.86rem;
          line-height: 1.58;
          opacity: 0.85;
        }
        #page-autocount-pos .pos-system-copy li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.75em;
          width: 0.58rem;
          height: 1px;
          background: var(--pos-accent);
          box-shadow: none;
        }
        /* Divider column: full-height dashed line, Sync chip floated at image midpoint */
        #page-autocount-pos .pos-system-divider {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-width: clamp(3rem, 5vw, 5rem);
        }
        #page-autocount-pos .pos-system-divider::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          background: repeating-linear-gradient(
            to bottom,
            rgba(228, 158, 37, 0.18) 0px,
            rgba(228, 158, 37, 0.18) 5px,
            transparent 5px,
            transparent 10px
          );
          transition: background 900ms ease;
          z-index: 0;
        }
        #page-autocount-pos .pos-system-wrap.is-lit .pos-system-divider::before {
          background: repeating-linear-gradient(
            to bottom,
            rgba(228, 158, 37, 0.52) 0px,
            rgba(228, 158, 37, 0.52) 5px,
            transparent 5px,
            transparent 10px
          );
        }
        #page-autocount-pos .pos-system-divider-chip {
          position: absolute;
          top: 22%;
          transform: translateY(-50%);
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.52rem 0.88rem;
          border: 1.5px dashed rgba(228, 158, 37, 0.55);
          border-radius: 999px;
          background: #fff;
          color: var(--pos-accent);
          font-size: 0.63rem;
          font-weight: 880;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          white-space: nowrap;
          box-shadow: 0 2px 14px rgba(228, 158, 37, 0.08);
          transition: border-color 900ms ease, box-shadow 900ms ease;
        }
        #page-autocount-pos .pos-system-wrap.is-lit .pos-system-divider-chip {
          border-color: rgba(228, 158, 37, 0.72);
          box-shadow: 0 4px 20px rgba(228, 158, 37, 0.15);
        }
        #page-autocount-pos .pos-sync-icon-mobile {
          display: none;
        }
        #page-autocount-pos .pos-system-callout {
          display: flex;
          align-items: center;
          gap: clamp(1rem, 2.5vw, 1.5rem);
          margin: clamp(2rem, 4vw, 3rem) 0 0;
          border: 1.5px solid rgba(228, 158, 37, 0.28);
          padding: clamp(1rem, 2.2vw, 1.4rem) clamp(1.1rem, 2.5vw, 1.6rem);
          background: linear-gradient(135deg, rgba(255, 248, 230, 0.9), #fff 60%);
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(228, 158, 37, 0.07);
        }
        #page-autocount-pos .pos-system-callout-icon {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(228, 158, 37, 0.1);
          color: var(--pos-accent);
        }
        #page-autocount-pos .pos-system-callout-body {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        #page-autocount-pos .pos-system-callout strong {
          color: var(--pos-navy);
          font-size: 0.95rem;
          font-weight: 760;
          line-height: 1.3;
        }
        #page-autocount-pos .pos-system-callout span {
          color: #626783;
          font-size: 0.88rem;
          line-height: 1.7;
        }
        #page-autocount-pos .pos-seo-content {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
          gap: clamp(1rem, 2.5vw, 1.5rem);
          align-items: stretch;
          margin-bottom: clamp(2.2rem, 5vw, 4rem);
        }
        #page-autocount-pos .pos-seo-copy,
        #page-autocount-pos .pos-seo-panel,
        #page-autocount-pos .pos-faq-card {
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 18px 45px rgba(47, 49, 90, 0.06);
        }
        #page-autocount-pos .pos-seo-copy {
          padding: clamp(1.35rem, 3vw, 2.1rem);
        }
        #page-autocount-pos .pos-seo-copy h2 {
          margin: 0.45rem 0 0;
          color: var(--pos-navy);
          font-size: clamp(1.5rem, 2.8vw, 2.25rem);
          line-height: 1.12;
          font-weight: 780;
        }
        #page-autocount-pos .pos-seo-copy p {
          margin: 1rem 0 0;
          color: #626789;
          font-size: 0.98rem;
          line-height: 1.78;
        }
        #page-autocount-pos .pos-seo-panel {
          padding: clamp(1.2rem, 2.6vw, 1.7rem);
          background:
            radial-gradient(circle at 20% 12%, rgba(240, 173, 50, 0.18), transparent 42%),
            rgba(255, 255, 255, 0.9);
        }
        #page-autocount-pos .pos-seo-panel h3,
        #page-autocount-pos .pos-faq-card h3 {
          margin: 0;
          color: var(--pos-navy);
          font-size: 1rem;
          line-height: 1.35;
          font-weight: 780;
        }
        #page-autocount-pos .pos-seo-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-top: 1.1rem;
        }
        #page-autocount-pos .pos-seo-chips span {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          border: 1px solid rgba(240, 173, 50, 0.28);
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          background: rgba(240, 173, 50, 0.1);
          color: #7f5b12;
          font-size: 0.82rem;
          font-weight: 760;
        }
        #page-autocount-pos .pos-faq-grid {
          display: grid;
          grid-column: 1 / -1;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }
        #page-autocount-pos .pos-faq-card {
          padding: 1.15rem;
        }
        #page-autocount-pos .pos-faq-card p {
          margin: 0.65rem 0 0;
          color: #686d91;
          font-size: 0.9rem;
          line-height: 1.65;
        }
        #page-autocount-pos .pos-workflow-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }
        #page-autocount-pos .pos-addon-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        #page-autocount-pos .pos-addon-grid > .pos-addon-card {
          flex: 1 1 300px;
          max-width: 380px;
        }
        #page-autocount-pos .pos-workflow-card,
        #page-autocount-pos .pos-addon-card,
        #page-autocount-pos .pos-note-panel {
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 18px 45px rgba(47, 49, 90, 0.07);
        }
        #page-autocount-pos .pos-workflow-card {
          padding: 1.25rem;
        }
        #page-autocount-pos .pos-workflow-card span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 999px;
          background: rgba(228, 158, 37, 0.13);
          color: var(--pos-accent);
          font-size: 0.82rem;
          font-weight: 800;
        }
        #page-autocount-pos .pos-workflow-card h3,
        #page-autocount-pos .pos-addon-card h3,
        #page-autocount-pos .pos-note-panel h3 {
          margin: 1rem 0 0.55rem;
          color: var(--pos-navy);
          font-size: 1rem;
          line-height: 1.3;
        }
        #page-autocount-pos .pos-workflow-card p,
        #page-autocount-pos .pos-addon-card p,
        #page-autocount-pos .pos-note-panel li {
          color: #6b6f91;
          font-size: 0.9rem;
          line-height: 1.65;
        }
        #page-autocount-pos .pos-addon-card {
          padding: 1.15rem;
        }
        #page-autocount-pos .pos-addon-card h3 {
          margin-top: 0;
          color: var(--pos-accent);
        }
        #page-autocount-pos .pos-addon-rows {
          display: grid;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-addon-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid rgba(47, 49, 90, 0.08);
          padding-top: 0.55rem;
          color: #4f536f;
          font-size: 0.9rem;
        }
        #page-autocount-pos .pos-addon-row strong,
        #page-autocount-pos .pos-price-value {
          color: #2f315a;
          font-weight: 780;
          white-space: nowrap;
        }
        #page-autocount-pos .pos-compare-panel {
          max-width: 1180px;
          margin: 0 auto;
        }
        #page-autocount-pos .pos-marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.5rem;
          min-height: 1.5rem;
          border-radius: 999px;
          font-weight: 780;
          line-height: 1;
        }
        #page-autocount-pos .pos-marker-plus {
          color: var(--pos-accent);
          background: rgba(228, 158, 37, 0.11);
        }
        #page-autocount-pos .pos-marker-included {
          min-width: auto;
          min-height: 0;
          padding: 0.38rem 0.65rem;
          background: rgba(22, 161, 75, 0.11);
          color: #14823c;
          font-size: 0.74rem;
          letter-spacing: 0;
        }
        #page-autocount-pos .pos-marker-muted {
          color: #a2a6b8;
          background: rgba(47, 49, 90, 0.04);
        }
        #page-autocount-pos .pos-note-panel {
          max-width: 1180px;
          margin: 1rem auto 0;
          padding: 1rem 1.15rem;
        }
        #page-autocount-pos .pos-note-panel h3 {
          margin-top: 0;
        }
        #page-autocount-pos .pos-note-panel ul {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.45rem 1rem;
          margin: 0;
          padding-left: 1.1rem;
        }
        #page-autocount-pos .pos-legend {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          color: #6b6f91;
          font-size: 0.82rem;
          margin: -0.75rem 0 1.5rem;
        }
        #page-autocount-pos .pos-release-toolbar {
          align-items: flex-end;
          display: flex;
          gap: 1.25rem;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        #page-autocount-pos .pos-release-toolbar h2 {
          color: var(--pos-navy);
          font-size: clamp(1.45rem, 2.7vw, 2.15rem);
          font-weight: 780;
          line-height: 1.18;
          margin: 0.45rem 0 0.45rem;
        }
        #page-autocount-pos .pos-release-toolbar p,
        #page-autocount-pos .pos-release-source {
          color: #6b6f91;
          font-size: 0.86rem;
          line-height: 1.6;
          margin: 0;
        }
        #page-autocount-pos .pos-release-source {
          margin-bottom: 1.25rem;
        }
        #page-autocount-pos .pos-release-source a,
        #page-autocount-pos .pos-release-actions a {
          color: var(--pos-accent);
          font-weight: 780;
          text-decoration: none;
        }
        #page-autocount-pos .pos-release-search {
          flex: 0 1 360px;
        }
        #page-autocount-pos .pos-release-search input {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.13);
          border-radius: 999px;
          color: var(--pos-navy);
          font: inherit;
          min-height: 46px;
          outline: none;
          padding: 0 1rem;
          width: 100%;
        }
        #page-autocount-pos .pos-release-search input:focus {
          border-color: rgba(228, 158, 37, 0.65);
          box-shadow: 0 0 0 4px rgba(228, 158, 37, 0.12);
        }
        #page-autocount-pos .pos-release-stack {
          display: grid;
          gap: 0.85rem;
        }
        #page-autocount-pos .pos-release-card {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 14px;
          box-shadow: 0 18px 45px rgba(47, 49, 90, 0.06);
          overflow: hidden;
          scroll-margin-top: 28px;
        }
        #page-autocount-pos .pos-release-card.is-expanded {
          border-color: rgba(228, 158, 37, 0.42);
        }
        #page-autocount-pos .pos-release-card-head {
          align-items: center;
          background: transparent;
          border: 0;
          color: inherit;
          cursor: pointer;
          display: flex;
          font: inherit;
          gap: 1rem;
          padding: 1.05rem 1.25rem;
          text-align: left;
          width: 100%;
        }
        #page-autocount-pos .pos-release-card.is-expanded .pos-release-card-head {
          background: #fffaf0;
        }
        #page-autocount-pos .pos-release-card-head svg {
          color: #a8abcc;
          flex-shrink: 0;
          transform: rotate(0);
          transition: transform 0.2s ease;
        }
        #page-autocount-pos .pos-release-card.is-expanded .pos-release-card-head svg {
          transform: rotate(180deg);
        }
        #page-autocount-pos .pos-release-main {
          flex: 1 1 auto;
          min-width: 0;
        }
        #page-autocount-pos .pos-release-title-row,
        #page-autocount-pos .pos-release-actions,
        #page-autocount-pos .pos-release-meta-grid {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-release-title-row strong {
          color: var(--pos-navy);
          font-size: 0.98rem;
          font-weight: 850;
        }
        #page-autocount-pos .pos-release-title-row em {
          color: #a8abcc;
          font-size: 0.72rem;
          font-style: normal;
          font-weight: 780;
        }
        #page-autocount-pos .pos-release-title-row i {
          background: var(--pos-navy);
          border-radius: 999px;
          color: #ffffff;
          font-size: 0.6rem;
          font-style: normal;
          font-weight: 850;
          letter-spacing: 0.08em;
          padding: 0.18rem 0.58rem;
          text-transform: uppercase;
        }
        #page-autocount-pos .pos-release-title-row i.is-highlight {
          background: rgba(228, 158, 37, 0.15);
          color: #b97812;
        }
        #page-autocount-pos .pos-release-meta {
          color: #8b8fa7;
          display: block;
          font-size: 0.78rem;
          margin-top: 0.25rem;
        }
        #page-autocount-pos .pos-release-counts {
          display: flex;
          flex-shrink: 0;
          gap: 0.65rem;
        }
        #page-autocount-pos .pos-release-counts b {
          color: var(--pos-navy);
          font-size: 0.72rem;
          font-weight: 780;
          white-space: nowrap;
        }
        #page-autocount-pos .pos-release-detail {
          border-top: 1px solid rgba(47, 49, 90, 0.08);
          padding: 1rem 1.25rem 1.3rem;
        }
        #page-autocount-pos .pos-release-actions {
          margin-bottom: 0.9rem;
        }
        #page-autocount-pos .pos-release-actions a {
          background: rgba(228, 158, 37, 0.1);
          border-radius: 999px;
          font-size: 0.74rem;
          padding: 0.45rem 0.75rem;
        }
        #page-autocount-pos .pos-release-meta-grid {
          margin-bottom: 1rem;
        }
        #page-autocount-pos .pos-release-meta-grid span {
          background: rgba(47, 49, 90, 0.055);
          border-radius: 999px;
          color: #5f647d;
          font-size: 0.72rem;
          font-weight: 760;
          padding: 0.36rem 0.68rem;
        }
        #page-autocount-pos .pos-release-detail-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #page-autocount-pos .pos-release-list-head {
          align-items: center;
          display: flex;
          gap: 0.75rem;
          justify-content: space-between;
          margin-bottom: 0.8rem;
        }
        #page-autocount-pos .pos-release-list-head h4 {
          color: var(--pos-navy);
          font-size: 0.82rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          margin: 0;
          text-transform: uppercase;
        }
        #page-autocount-pos .pos-release-items {
          display: grid;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-release-item {
          align-items: flex-start;
          display: flex;
          gap: 0.55rem;
        }
        #page-autocount-pos .pos-release-empty,
        #page-autocount-pos .pos-release-empty-panel {
          color: #9a9eb5;
          font-size: 0.86rem;
          line-height: 1.6;
          margin: 0;
        }
        #page-autocount-pos .pos-release-empty-panel {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.08);
          border-radius: 12px;
          padding: 1rem;
        }
        #page-autocount-pos .pos-release-more {
          display: flex;
          margin: 1.35rem auto 0;
        }
        #page-autocount-pos .pos-why-ksl {
          background:
            radial-gradient(circle at 14% 20%, rgba(228, 158, 37, 0.1), transparent 36%),
            radial-gradient(circle at 86% 18%, rgba(47, 49, 90, 0.055), transparent 38%),
            linear-gradient(180deg, var(--ks-page-cloud) 0%, var(--ks-page-warm) 42%, #fffaf1 100%);
          overflow: hidden;
          padding: clamp(4rem, 7vw, 6.25rem) 0;
          position: relative;
        }
        #page-autocount-pos .pos-why-ksl::before {
          background:
            linear-gradient(120deg, rgba(228, 158, 37, 0.12), transparent 42%),
            repeating-linear-gradient(90deg, rgba(47, 49, 90, 0.045) 0 1px, transparent 1px 84px);
          content: "";
          inset: 0;
          opacity: 0.68;
          pointer-events: none;
          position: absolute;
        }
        #page-autocount-pos .pos-why-layout {
          align-items: stretch;
          display: grid;
          gap: clamp(1.35rem, 3vw, 3rem);
          grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
          position: relative;
          z-index: 1;
        }
        #page-autocount-pos .pos-why-copy {
          align-self: center;
        }
        #page-autocount-pos .pos-why-copy h2 {
          color: var(--pos-navy);
          font-size: clamp(1.85rem, 3.6vw, 3.15rem);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.08;
          margin: 0.65rem 0 1rem;
          max-width: 620px;
        }
        #page-autocount-pos .pos-why-copy p {
          color: #626783;
          font-size: clamp(0.98rem, 1.25vw, 1.08rem);
          line-height: 1.75;
          margin: 0;
          max-width: 600px;
        }
        #page-autocount-pos .pos-why-stats {
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin: 1.65rem 0;
        }
        #page-autocount-pos .pos-why-stats span {
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(228, 158, 37, 0.18);
          border-radius: 8px;
          color: #747891;
          display: grid;
          gap: 0.18rem;
          padding: 0.9rem;
        }
        #page-autocount-pos .pos-why-stats strong {
          color: var(--pos-navy);
          font-size: 0.98rem;
        }
        #page-autocount-pos .pos-why-cta {
          min-width: 190px;
        }
        #page-autocount-pos .pos-why-board {
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(47, 49, 90, 0.1);
          border-radius: 18px;
          box-shadow: 0 28px 76px rgba(47, 49, 90, 0.11);
          display: grid;
          gap: 1rem;
          padding: clamp(1rem, 2vw, 1.45rem);
        }
        #page-autocount-pos .pos-why-flow {
          background: #2f315a;
          border-radius: 14px;
          color: #fff;
          display: grid;
          gap: 0.35rem;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          padding: 0.65rem;
        }
        #page-autocount-pos .pos-why-flow span {
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          font-size: 0.78rem;
          font-weight: 800;
          gap: 0.3rem;
          justify-content: center;
          min-height: 82px;
          text-align: center;
        }
        #page-autocount-pos .pos-why-flow i {
          color: #f0c36f;
          font-size: 0.68rem;
          font-style: normal;
          letter-spacing: 0.12em;
        }
        #page-autocount-pos .pos-why-cards {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        #page-autocount-pos .pos-why-card {
          background: #ffffff;
          border: 1px solid rgba(47, 49, 90, 0.09);
          border-radius: 14px;
          min-height: 240px;
          padding: 1.1rem;
        }
        #page-autocount-pos .pos-why-card span {
          color: var(--pos-accent);
          display: block;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.12em;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        #page-autocount-pos .pos-why-card h3 {
          color: var(--pos-navy);
          font-size: 1.05rem;
          line-height: 1.3;
          margin: 0 0 0.65rem;
        }
        #page-autocount-pos .pos-why-card p {
          color: #6b6f91;
          font-size: 0.9rem;
          line-height: 1.65;
          margin: 0;
        }
        @media (max-width: 980px) {
          #page-autocount-pos .pos-system-layout {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-system-divider {
            min-height: 4.25rem;
            min-width: 0;
            padding-top: 0;
            align-items: center;
          }
          #page-autocount-pos .pos-system-divider::before {
            top: 50%;
            right: 0;
            bottom: auto;
            left: 0;
            border-top: 1px dashed rgba(247, 244, 235, 0.24);
            border-left: 0;
            width: 100%;
            height: 1px;
          }
          #page-autocount-pos .pos-system-divider-chip {
            position: static;
            transform: none;
          }
          #page-autocount-pos .pos-sync-icon-desktop {
            display: none;
          }
          #page-autocount-pos .pos-sync-icon-mobile {
            display: block;
          }
          #page-autocount-pos .pos-system-callout {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-seo-content,
          #page-autocount-pos .pos-faq-grid {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-workflow-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #page-autocount-pos .pos-note-panel ul {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-release-toolbar,
          #page-autocount-pos .pos-release-card-head,
          #page-autocount-pos .pos-release-detail-grid {
            align-items: stretch;
            flex-direction: column;
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-release-search {
            flex-basis: auto;
            width: 100%;
          }
          #page-autocount-pos .pos-release-counts {
            flex-wrap: wrap;
          }
          #page-autocount-pos .pos-why-layout,
          #page-autocount-pos .pos-why-cards {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-why-card {
            min-height: auto;
          }
        }
        @media (max-width: 640px) {
          #page-autocount-pos .pos-system-power {
            right: 0.75rem;
            bottom: 0.75rem;
            font-size: 0.64rem;
          }
          #page-autocount-pos .pos-system-callout {
            flex-direction: column;
          }
          #page-autocount-pos .pos-workflow-grid {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-section-intro {
            text-align: left;
          }
          #page-autocount-pos .pos-why-ksl {
            padding: 3.5rem 0;
          }
          #page-autocount-pos .pos-why-stats,
          #page-autocount-pos .pos-why-flow {
            grid-template-columns: 1fr;
          }
          #page-autocount-pos .pos-why-flow span {
            align-items: center;
            flex-direction: row;
            justify-content: flex-start;
            min-height: 52px;
            padding: 0 0.8rem;
          }
        }
      `}</style>

      <SectionSidebar sections={POS_SECTIONS} themeColor={POS_ACCENT} />

      <PinnedHeroStage>
        <ProductHero
          eyebrow="Software We Specialize In"
          title="AutoCount POS"
          body="AutoCount POS Malaysia for retail counters, F&B outlets, and branch operations. KS Support Team helps you connect cashier work with AutoCount Accounting, inventory, e-invoice, barcode scanners, receipt printers, and practical outlet reporting."
          iconSrc={POS_ICON}
          iconAlt="AutoCount POS"
          backgroundImage={POS_HERO}
          primaryCta={{ label: "Start Free Trial", onClick: () => runWithProgressFeedback(() => setTrialOpen(true), { assets: ["/images/branding/ksleow-gold.webp"] }) }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </PinnedHeroStage>

      <main className="pinned-page-content product-app-content">
        <div
          id="features"
          className="product-app-section product-app-section-paper product-app-section-clean"
          style={{ paddingTop: "2rem" }}
        >
          <HexFeatures
            title="It's Not Just a POS"
            subtitle="AutoCount POS goes beyond a cashier counter — it's a fully integrated retail and F&B management system."
            features={HEX_FEATURES}
          />
        </div>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-paper)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="promotions" />
        </div>

        <div className="product-app-section product-app-section-paper product-app-section-clean">
          <ProductPromotionBento
            title="Current AutoCount POS Offers"
            accent="#80c31e"
            items={POS_PROMOTIONS}
          />
        </div>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="system" />
        </div>

        <section id="system" className="product-app-section product-app-section-mist product-app-section-from-paper product-app-section-to-ice pos-system-section">

          <POSSystemExplainer />
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)", marginTop: "-1.5rem", marginBottom: "-1.5rem" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="training" />
        </div>

        <section className="product-app-section product-app-section-ice product-app-section-from-mist product-app-section-to-cloud">
          <div id="training">
            <AutoCountTrainingWebGL
              customVideos={POS_TUTORIAL_VIDEOS}
              title="AutoCount POS Tutorial Guide"
              themeColor={POS_ACCENT}
              themeHoverColor="#f0ad32"
              activeTabBg={POS_NAVY}
              playIconColor={POS_NAVY}
              playBtnBg="#f0c36f"
            />
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="editions" />
        </div>

        <section id="editions" className="ac-section-tight product-app-section product-app-section-cloud product-app-section-from-ice product-app-section-to-warm" style={{ overflow: "visible" }}>
          <div className="content-wrap">
            <SectionIntro
              title="POS Backend Editions"
              shareHash="#editions"
              onClick={() => setTitleClicks(prev => prev + 1)}
            />
            
            <div className="pos-legend">
              <span><POSMarker value="+" /> optional add-on</span>
              <span><POSMarker value="-" /> not available</span>
            </div>
            
            <POSCompareTable
              columns={EDITION_COLUMNS}
              leftLabel="Module"
              rows={EDITION_ROWS}
              sections={[...POS_MODULE_SECTIONS, ...ACCOUNTING_MODULE_SECTIONS]}
              accent={POS_ACCENT}
              inlinePrice={titleClicks >= 5}
              mobileWidth={760}
            />
            <p className="ks-card-text" style={{ maxWidth: 1180, margin: "1rem auto 0", fontWeight: 700 }}>
              *Prices exclude 8% SST.
            </p>
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-cloud)", "--section-to": "var(--ks-page-warm)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="frontend" />
        </div>

        <section id="frontend" className="ac-section-tight product-app-section product-app-section-warm product-app-section-from-cloud product-app-section-to-cloud" style={{ overflow: "visible" }}>
          <div className="content-wrap">
            <SectionIntro
              title="POS Front End Editions"
              shareHash="#frontend"
              onClick={() => setTitleClicks(prev => prev + 1)}
            />

            <div style={{ height: "2.5rem" }} />

            <POSCompareTable
              columns={COUNTER_COLUMNS}
              leftLabel="POS Counter & Add-ons"
              rows={COUNTER_ROWS}
              sections={FRONTEND_MODULE_SECTIONS}
              accent={POS_NAVY}
              inlinePrice={titleClicks >= 5}
              mobileWidth={820}
            />
            <p className="ks-card-text" style={{ maxWidth: 1180, margin: "1rem auto 0", fontWeight: 700 }}>
              *Frontend requires a POS Backend or AutoCount Accounting.<br />
              *Prices exclude 8% SST.
            </p>
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-warm)", "--section-to": "var(--ks-page-cloud)" }}>
          <PageSectionDivider sections={POS_SECTIONS} id="releases" />
        </div>

        <POSReleaseNotesSection
          search={releaseSearch}
          setSearch={setReleaseSearch}
          expanded={expandedRelease}
          setExpanded={setExpandedRelease}
          visibleLimit={releaseVisibleLimit}
          setVisibleLimit={setReleaseVisibleLimit}
        />

        <WhyChooseUs section={getSection(POS_SECTIONS, "why-ksl")} sectionFrom="var(--ks-page-cloud)" sectionTo="var(--ks-page-warm)" />

        <EnquireNowCTA
          heading="Ready to build your POS setup?"
          body="Talk to KS Support Team for an AutoCount POS quotation, module advice, and counter implementation plan."
          buttons={[{ label: "Contact Sales", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
        />

        <Footer />
      </main>

      <AutoCountTrialModal
        open={trialOpen}
        onClose={() => setTrialOpen(false)}
        productName="AutoCount POS"
        supportMessage="HI KS Support Team, I would like to start the AutoCount POS Free Trial and schedule an installation session. I can prepare AnyDesk / UltraViewer."
        stats={[
          { label: "Trial Limit", value: "200 transactions limitation" },
          { label: "Setup Time", value: "~45 Minutes" },
          { label: "Support", value: "Remote Install" },
        ]}
        checklist={[
          <>Confirm whether you run a <strong>Retail</strong> or <strong>F&B</strong> business.</>,
          <>Install or prepare <strong>AnyDesk</strong> / <strong>UltraViewer</strong> for remote access.</>,
          <>Reserve around <strong>45 minutes</strong> for POS setup and basic checking.</>,
          <>Message our Support Team to arrange a suitable installation time.</>
        ]}
      />
    </div>
  );
}
