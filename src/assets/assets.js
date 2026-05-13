/**
 * assets.js — Centralized asset registry
 * =========================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  HOW TO SWAP A LOGO                                         │
 * │                                                             │
 * │  Each logo slot uses its own independent file.              │
 * │  To replace one, simply drop your new PNG/SVG into:         │
 * │    src/assets/logos/                                        │
 * │  and rename it to match the filename in the import below.   │
 * │                                                             │
 * │  ● Hero logo  (animated background)  → logo-hero.png        │
 * │  ● Nav logo   (top navigation bar)   → logo-nav.png         │
 * │  ● Footer logo (page footer)         → logo-footer.png      │
 * │                                                             │
 * │  All three currently point to the same KSL logo image.      │
 * │  Replace any one independently without affecting the others. │
 * └─────────────────────────────────────────────────────────────┘
 */

/* ── LOGO FALLBACKS ──
 * Brand logos now live in /public/uploads/branding/ (managed via Decap
 * CMS → Brand Logos). The constants below are the *fallback* values
 * Nav / Hero / Footer use when branding.json is empty for a given slot.
 * They're plain URL strings, not Vite imports, so swapping a file in
 * public/uploads/branding/ instantly takes effect without a rebuild. */
export const LOGO_HERO   = "/uploads/branding/ksleow-white.webp";
export const LOGO_NAV    = "/uploads/branding/ksleow-original.webp";
export const LOGO_FOOTER = "/uploads/branding/ksleow-gold.webp";

/* ── PARTNER LOGOS ──
 * Partner images now come from CMS-uploaded files referenced in
 * partners.json. Keep the slot keys here as null placeholders for
 * Partners.jsx's structural fallback. */
export const PARTNER_LOGOS = {
  partner1: null, partner2: null, partner3: null,
  partner4: null, partner5: null, partner6: null,
};

/* ── CASE STUDY IMAGES  (src/assets/images/) ── */
import caseNetworking from "./images/case-networking.jpg";
import casePlugin from "./images/case-plugin.jpg";
import caseErp from "./images/case-erp.jpg";
import caseWarehouse from "./images/case-warehouse.jpg";

export const CASE_IMAGES = {
  networking: caseNetworking,
  plugin: casePlugin,
  erp: caseErp,
  warehouse: caseWarehouse,
};

/* ══════════════════════════════════════════════════════════════
 * PRODUCT LOGOS / ICONS  (src/assets/images/products/)
 * ──────────────────────────────────────────────────────────────
 * Steps to add a real product image:
 *   1. Drop your PNG/SVG into  src/assets/images/products/
 *   2. Name it to match the filename in the import below
 *   3. Uncomment the import line
 *   4. Replace  null  with the imported variable
 *
 * AutoCount Accounting 2.2 icon slot:
 *   → Recommended file:  autocount-accounting-icon.png
 *   → Used in:  src/pages/products/AutoCountAccounting.jsx  (hero icon)
 *               src/components/Products.jsx  (product card)
 * ══════════════════════════════════════════════════════════════ */

import autocountAccountingIcon from "./images/products/autocount-accounting-icon.png";
import autocountInterface       from "./images/products/autocount-interface.png";
// import autocountAccounting     from "./images/products/autocount-accounting.png";
// import autocountPos            from "./images/products/autocount-pos.png";
// import autocountPayroll        from "./images/products/autocount-payroll.png";
// import feedmePOS               from "./images/products/feedme-pos.png";

export const PRODUCT_IMAGES = {
  autocountAccountingIcon: autocountAccountingIcon,   /* ← AutoCount Accounting 2.2 icon (hero page) */
  autocountInterface:       autocountInterface,       /* ← AutoCount UI screenshot (hero right side, desktop only) */
  autocountAccounting: null,   /* ← product card image */
  autocountPos: null,
  autocountPayroll: null,
  feedmePOS: null,
};
