import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import useFavicon from "../../hooks/useFavicon.js";
import ProductHero from "../../components/ProductHero.jsx";
import { PinnedHeroStage } from "../../components/PinnedHeroPage.jsx";
import { PageSectionDivider } from "../../components/PageSections.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import StepRow from "../../components/StepRow.jsx";
import ProductVideoGuide from "../../components/ProductVideoGuide.jsx";
import { Img } from "../../components/Media.jsx";
/* Sales2DO-specific WhatsApp link — addressed to KS Support Team with a product-aware message */
const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I would like to learn more about AutoCount Plugin Sales2DO. Thank you."
)}`;
import sales2doContent from "../../content/sales2do.json";
import acPluginIcon     from "../../assets/images/apps/ac-plugin-icon.webp";
import { IconClipboard, IconSettings, IconStar, IconShield, IconVideo } from "../../components/SectionDivider.jsx";
import imgOutstanding   from "../../assets/images/apps/sales2do/outstanding.webp";
import imgPreset        from "../../assets/images/apps/sales2do/preset-delivery.webp";
import imgSettings      from "../../assets/images/apps/sales2do/settings.webp";
/* Online/Offline activation screenshots are swapped — the file named
 * `license-online.webp` was originally captured for the offline flow and
 * vice versa. Re-binding the imports is cheaper than renaming the files
 * on disk. */
import imgLicenseOnline  from "../../assets/images/apps/sales2do/license-offline.webp";
import imgLicenseOffline from "../../assets/images/apps/sales2do/license-online.webp";

/* Sales2DO sidebar anchor items */
const S2D_SECTIONS = [
  { id: "overview", label: "Overview", icon: IconVideo, color: "#c9a84c" },
  { id: "outstanding", label: "Outstanding DO", icon: IconClipboard, color: "#c9a84c" },
  { id: "preset", label: "Preset", icon: IconStar, color: "#c9a84c" },
  { id: "settings", label: "Settings", icon: IconSettings, color: "#c9a84c" },
  { id: "license", label: "License", icon: IconShield, color: "#c9a84c" },
];

/* ── Video segments ── */
const VIDEO_SEGMENTS = [
  {
    src: "/videos/sales2do/copy-to-do-method1.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: "Method 1 — Via Right-Click Menu",
    desc: "The fastest method for processing single documents.",
    steps: [
      <span key="a">Navigate to <strong>Sales → Invoice</strong> or <strong>Cash Sale</strong> to open the document listing.</span>,
      <span key="b">Right-click on the specific row you wish to copy and select <strong>"Copy to a new Delivery Order"</strong>.</span>,
      <span key="c"><em>Note: this option is only visible for <strong>Approved</strong> documents — not Draft or Voided entries.</em></span>,
      <span key="d">A new Delivery Order entry screen opens with all details pre-filled.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method2.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 2 — Via the "Copy To" Icon',
    desc: "Ideal when you are already reviewing a document.",
    steps: [
      <span key="a">Open any Invoice or Cash Sale in <strong>View Mode</strong>.</span>,
      <span key="b">On the top ribbon under the <strong>Home</strong> tab, click the <strong>"Copy to a new Delivery Order"</strong> button.</span>,
      <span key="c">A new Delivery Order will be generated based on the viewed document.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method3.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 3 — Via "Copy From" in DO Entry',
    desc: "The best way to combine multiple sales documents into a single Delivery Order.",
    steps: [
      <span key="a">Go to <strong>Sales → Delivery Order</strong> and create a <strong>New</strong> entry.</span>,
      <span key="b">On the top ribbon under the <strong>Home</strong> tab, click <strong>"Copy from Invoice"</strong> or <strong>"Copy from Cash Sale"</strong>.</span>,
      <span key="c">A search window will appear. Select the desired source document(s) and click <strong>OK</strong>. <em>(Search results only include Approved invoices by default.)</em></span>,
      <span key="d">All items from the selected documents will automatically populate the Delivery Order.</span>,
    ],
  },
  {
    src: "/videos/sales2do/smart-quantity-control.mp4",
    group: "Smart Quantity Control",
    title: "Smart Quantity Control — Partial Copy & Full Copy Warning",
    desc: "Prevents accidental over-delivery when copying partially or fully delivered documents.",
    steps: [
      <span key="a"><strong>Partial Copy:</strong> When copying a partially delivered document, the system calculates the remaining balance and only loads the <strong>Outstanding Quantity</strong>.</span>,
      <span key="b"><strong>Full Copy Warning:</strong> If a document is already fully delivered, the system will prompt a warning to prevent accidental over-delivery.</span>,
    ],
  },
  {
    src: "/videos/sales2do/ks-omni.mp4",
    group: "AI Assistant and Feedback",
    title: "KS-Omni — 24-Hour AI Support & Feedback",
    desc: "Access 24-hour AI support or send feedback directly to the KSL developer team.",
    steps: [
      <span key="a">Navigate to <strong>Sales2DO → AI Assistant and Feedback</strong>.</span>,
      <span key="b">The AI <strong>Chatbot</strong> will open.</span>,
      <span key="c"><strong>Support:</strong> Ask questions or upload images / screenshots for troubleshooting.</span>,
      <span key="d"><strong>Feedback:</strong> Submit bug reports or feature suggestions directly to the <strong>KSL Development Team</strong>.</span>,
    ],
  },
];

/* ── Shared styles ── */
const S = {
  label: { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" },
  h2:    { fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem" },
  h3:    { fontSize: "1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.6rem" },
  body:  { fontSize: "0.92rem", color: "#555", lineHeight: 1.82 },
  section: {},
};

/* ── Screenshot slot ── */
function ImgSlot({ src, alt, caption, maxWidth = 860, maxHeight = 480 }) {
  return (
    <div style={{ margin: "1.25rem 0 0.5rem" }}>
      <div style={{
        maxWidth, margin: "0 auto", borderRadius: 10,
        border: "1px solid rgba(47,49,90,0.1)", overflow: "hidden",
        background: src ? "transparent" : "#f0f0f5",
        minHeight: src ? "auto" : 140,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {src
          ? <Img src={src} alt={alt || ""} style={{ width: "100%", display: "block", maxHeight, objectFit: "contain", objectPosition: "top" }} />
          : <div style={{ padding: "1.75rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", opacity: 0.25, marginBottom: "0.4rem" }}>🖼️</div>
              <div style={{ fontSize: "0.72rem", color: "#a8abcc", fontWeight: 500 }}>{alt || "Screenshot"}</div>
            </div>
        }
      </div>
      {caption && <p style={{ fontSize: "0.75rem", color: "#a8abcc", textAlign: "center", fontStyle: "italic", marginTop: "0.35rem" }}>{caption}</p>}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: "1.1rem", margin: "0.5rem 0" }}>
      {items.map((item, i) => <li key={i} className="ks-body-text" style={{ marginBottom: "0.4rem" }}>{item}</li>)}
    </ul>
  );
}

function RichText({ children }) {
  return <span dangerouslySetInnerHTML={{ __html: children || "" }} />;
}

function richList(items = []) {
  return items.map((item, i) => <RichText key={i}>{item}</RichText>);
}

/* ── Two-column layout: image on the LEFT, text on the RIGHT ──
 * Used by Outstanding DO, Preset Delivery, and Plugin Settings sections.
 * Column proportions mirror the Video Tutorial grid (58% image, 42%
 * text) so screenshots and the video player feel like the same size.
 * Collapses to single column at <760px (image first, then text). */
function SectionRow({ image, alt, caption, children, sticky = true }) {
  return (
    <>
      <style>{`
        .sr-grid { display: grid; grid-template-columns: 58% 1fr; gap: 2.5rem; align-items: start; margin-top: 1.5rem; }
        @media (max-width: 760px) { .sr-grid { grid-template-columns: 1fr; gap: 1.25rem; } }
      `}</style>
      <div className="sr-grid">
        <div style={sticky ? { position: "sticky", top: 90 } : undefined}>
          <ImgSlot src={image} alt={alt} caption={caption} maxWidth={720} maxHeight={560} />
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
 * Page
 * ══════════════════════════════════════════════════════════════ */
export default function Sales2DOPage({ onContact }) {
  useFavicon(acPluginIcon);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [licenseTab, setLicenseTab] = useState("online");
  const {
    hero = {},
    overview = {},
    outstanding = {},
    preset = {},
    settings = {},
    license = {},
    cta = {},
  } = sales2doContent;

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>

      <SectionSidebar sections={S2D_SECTIONS} themeColor="#c9a84c" />

      {/* ── Hero banner — shared ProductHero component (same look as AutoCount) ── */}
      <PinnedHeroStage>
        <ProductHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          iconSrc={hero.iconSrc || acPluginIcon}
          iconAlt={hero.iconAlt}
          primaryCta={{ label: hero.primaryLabel, href: hero.primaryHref, download: hero.primaryHref?.split("/").pop() }}
          secondaryCta={{ label: hero.secondaryLabel, href: WA_LINK, target: "_blank" }}
        />
      </PinnedHeroStage>

      <main className="pinned-page-content product-app-content">

      {/* ── Overview + Video Guide ── */}
      <div id="overview" className="product-app-section product-app-section-paper product-app-section-to-mist">
        <div className="content-wrap">
          <div style={{ ...S.label, marginBottom: "0.5rem" }}>{overview.label}</div>
          <h2 className="ks-section-title" style={{ marginBottom: "1.5rem" }}>{overview.heading}</h2>
          <ProductVideoGuide segments={VIDEO_SEGMENTS} accentColor="#c9a84c" darkColor="#2f315a" />
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="outstanding" />
      </div>

      {/* ── Outstanding Delivery Order ── */}
      <div id="outstanding" className="product-app-section product-app-section-mist product-app-section-to-ice">
        <div className="content-wrap">
          <div className="ks-eyebrow">{outstanding.label}</div>
          <h2 className="ks-section-title">{outstanding.heading}</h2>

          <SectionRow image={outstanding.image || imgOutstanding} alt={outstanding.imageAlt} caption={outstanding.imageCaption}>
            <p className="ks-body-text" style={{ marginBottom: "1rem" }}><RichText>{outstanding.intro}</RichText></p>

            <h3 className="ks-card-title" style={{ marginTop: "1.5rem" }}>{outstanding.filterTitle}</h3>
            <BulletList items={richList(outstanding.filterItems)} />

            <h3 className="ks-card-title" style={{ marginTop: "1.75rem" }}>{outstanding.drillTitle}</h3>
            <p className="ks-body-text" style={{ marginBottom: "1rem" }}><RichText>{outstanding.drillIntro}</RichText></p>
            {(outstanding.tierCards || []).map(({ tier, title, color, items }) => (
              <div key={tier} style={{ background: "#f5f5f8", borderRadius: 14, padding: "1rem 1.2rem", marginBottom: "0.7rem", border: "1px solid rgba(47,49,90,0.09)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: color, color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>{tier}</span>
                  <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "0.95rem" }}>{title}</h3>
                </div>
                <BulletList items={richList(items)} />
              </div>
            ))}
          </SectionRow>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="preset" />
      </div>

      {/* ── Preset "Delivery?" in Stock Item Maintenance ── */}
      <div id="preset" className="product-app-section product-app-section-ice product-app-section-to-cloud">
        <div className="content-wrap">
          <div className="ks-eyebrow">{preset.label}</div>
          <h2 className="ks-section-title">{preset.heading}</h2>

          <SectionRow image={preset.image || imgPreset} alt={preset.imageAlt} caption={preset.imageCaption}>
            <p className="ks-body-text" style={{ marginBottom: "1rem" }}><RichText>{preset.intro}</RichText></p>
            {(preset.steps || []).map((step, i) => (
              <StepRow key={i} n={i + 1}><RichText>{step}</RichText></StepRow>
            ))}
            <BulletList items={richList(preset.bulletItems)} />
            <div style={{ marginTop: "1rem", padding: "0.85rem 1.1rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <p className="ks-list-text" style={{ margin: 0 }}>
                <RichText>{preset.note}</RichText>
              </p>
            </div>
          </SectionRow>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="settings" />
      </div>

      {/* ── Plugin Settings ── */}
      <div id="settings" className="product-app-section product-app-section-cloud product-app-section-to-warm">
        <div className="content-wrap">
          <div className="ks-eyebrow">{settings.label}</div>
          <h2 className="ks-section-title">{settings.heading}</h2>
          <p style={{ ...S.body }}><RichText>{settings.intro}</RichText></p>

          <SectionRow image={settings.image || imgSettings} alt={settings.imageAlt} caption={settings.imageCaption}>
            <h3 className="ks-card-title" style={{ marginBottom: "0.4rem" }}>{settings.transferTitle}</h3>
            <p className="ks-body-text" style={{ marginBottom: "0.9rem" }}><RichText>{settings.transferIntro}</RichText></p>
            <BulletList items={richList(settings.transferItems)} />
            <div style={{ marginTop: "0.5rem", marginBottom: "1.75rem", padding: "0.85rem 1.1rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <p className="ks-list-text" style={{ margin: 0 }}>
                <RichText>{settings.transferNote}</RichText>
              </p>
            </div>

            <h3 className="ks-card-title" style={{ marginBottom: "0.4rem" }}><RichText>{settings.deliveryTitle}</RichText></h3>
            <p className="ks-body-text" style={{ marginBottom: "0.9rem" }}><RichText>{settings.deliveryIntro}</RichText></p>
            <BulletList items={richList(settings.deliveryItems)} />
          </SectionRow>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-cloud)", "--section-to": "var(--ks-page-warm)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="license" />
      </div>

      {/* ── Activate Plugin License ── */}
      <div id="license" className="product-app-section product-app-section-warm">
        <div className="content-wrap">
          <div className="ks-eyebrow">{license.label}</div>
          <h2 className="ks-section-title">{license.heading}</h2>

          {/* ── General License Info (Pricing, Trial, Transfer) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3.5rem" }}>
            <div style={{ background: "#f5f5f8", borderRadius: 14, padding: "1.25rem 1.4rem", border: "1px solid rgba(47,49,90,0.09)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#2f315a", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>Pricing</span>
                <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "1.05rem" }}>{license.pricingTitle}</h3>
              </div>
              <BulletList items={richList(license.pricingInfo)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#f5f5f8", borderRadius: 14, padding: "1.25rem 1.4rem", border: "1px solid rgba(47,49,90,0.09)", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#4a5090", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>Trial</span>
                  <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "1.05rem" }}>{license.trialTitle}</h3>
                </div>
                <p className="ks-body-text" style={{ margin: 0 }}><RichText>{license.trialInfo}</RichText></p>
              </div>
              <div style={{ background: "#f5f5f8", borderRadius: 14, padding: "1.25rem 1.4rem", border: "1px solid rgba(47,49,90,0.09)", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#6b6f91", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>Transfer</span>
                  <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "1.05rem" }}>{license.transferTitle}</h3>
                </div>
                <p className="ks-body-text" style={{ margin: 0 }}><RichText>{license.transferInfo}</RichText></p>
              </div>
            </div>
          </div>

          <h3 className="ks-card-title" style={{ marginBottom: "1rem" }}>Activation Instructions</h3>

          {/* Tabs — only shown on tablet/mobile (hidden on desktop via CSS) */}
          <div className="license-tabs" style={{ display: "flex", background: "#e8e8f0", borderRadius: 50, padding: 4, gap: 2, marginBottom: "2rem", width: "fit-content" }}>
            {[["online", "Online Activation"], ["offline", "Offline Activation"]].map(([key, label]) => (
              <button key={key} onClick={() => setLicenseTab(key)} style={{
                fontSize: "0.82rem", fontWeight: 600, padding: "0.45rem 1.3rem", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: licenseTab === key ? "#2f315a" : "transparent",
                color: licenseTab === key ? "#fff" : "#6b6f91",
                transition: "background 0.2s, color 0.2s",
              }}>{label}</button>
            ))}
          </div>

          <style>{`
            /* Desktop: hide tabs; show both columns side-by-side. The
               !important here overrides the inline display set by the
               tab state, so both blocks render regardless of licenseTab. */
            @media (min-width: 1025px) {
              .license-tabs { display: none !important; }
              .license-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 2.5rem !important;
                align-items: start !important;
              }
              .license-block-online,
              .license-block-offline {
                display: block !important;
                max-width: none !important;
              }
              .license-col-title { display: block !important; }
            }
          `}</style>

          <div className="license-grid">
            {/* ── Online block ── */}
            <div className="license-block-online" style={{ maxWidth: 680, display: licenseTab === "online" ? "block" : "none" }}>
              <h3 className="license-col-title ks-card-title" style={{ fontSize: "1.1rem", color: "#2f315a", marginBottom: "0.85rem", display: "none" }}>{license.onlineTitle}</h3>
              <ImgSlot src={license.onlineImage || imgLicenseOnline} alt={license.onlineAlt} caption={license.onlineCaption} />
              <p className="ks-body-text" style={{ margin: "1.25rem 0 1rem" }}><RichText>{license.onlineIntro}</RichText></p>
              {(license.onlineSteps || []).map((step, i) => (
                <StepRow key={i} n={i + 1}><RichText>{step}</RichText></StepRow>
              ))}
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <p className="ks-list-text">
                  <RichText>{license.onlineNote}</RichText>
                </p>
              </div>
            </div>

            {/* ── Offline block ── */}
            <div className="license-block-offline" style={{ maxWidth: 680, display: licenseTab === "offline" ? "block" : "none" }}>
              <h3 className="license-col-title ks-card-title" style={{ fontSize: "1.1rem", color: "#2f315a", marginBottom: "0.85rem", display: "none" }}>{license.offlineTitle}</h3>
              <ImgSlot src={license.offlineImage || imgLicenseOffline} alt={license.offlineAlt} caption={license.offlineCaption} />
              <p className="ks-body-text" style={{ margin: "1.25rem 0 1rem" }}><RichText>{license.offlineIntro}</RichText></p>
              {(license.offlineSteps || []).map((step, i) => (
                <StepRow key={i} n={i + 1}><RichText>{step}</RichText></StepRow>
              ))}
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <p className="ks-list-text">
                  <RichText>{license.offlineNote}</RichText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── CTA ── */}
      <EnquireNowCTA
        heading={cta.heading}
        body={cta.body}
        buttons={[{ label: cta.buttonLabel, href: WA_LINK, className: "enquire-now-btn" }]}
      />

      <Footer />
      </main>
      {/* <AIChatbot app="Sales2DO" /> */}
    </div>
  );
}
