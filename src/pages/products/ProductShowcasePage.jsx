import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import OptimizedImage from "../../components/OptimizedImage.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";

const SALES_WHATSAPP = "60169902279";

function whatsappLink(productName) {
  return `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(
    `Hi Elise, I would like to learn more about ${productName}. Thank you.`
  )}`;
}

const S = {
  label: { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" },
  h2: { fontSize: "clamp(1.45rem, 2.6vw, 2.1rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "0.9rem" },
  h3: { fontSize: "1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.55rem", lineHeight: 1.35 },
  body: { fontSize: "0.92rem", color: "#555", lineHeight: 1.82 },
  section: { padding: "4rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)" },
};

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CardGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="product-detail-grid">
      {items.map(item => (
        <div key={item.title} style={{ background: "#ffffff", border: "1px solid rgba(47,49,90,0.09)", borderRadius: 16, padding: "1.25rem", boxShadow: "0 4px 18px rgba(47,49,90,0.04)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(201,168,76,0.12)", color: "#a17f1e", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
            <CheckIcon />
          </div>
          <h3 style={S.h3}>{item.title}</h3>
          <p style={{ ...S.body, fontSize: "0.84rem", margin: 0 }}>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function BulletPanel({ title, bullets }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(47,49,90,0.09)", borderRadius: 16, padding: "1.3rem" }}>
      <h3 style={S.h3}>{title}</h3>
      <ul style={{ listStyle: "none", display: "grid", gap: "0.75rem", marginTop: "0.8rem" }}>
        {bullets.map(item => (
          <li key={item} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start", ...S.body, fontSize: "0.84rem" }}>
            <span style={{ color: "#c9a84c", marginTop: 4, flexShrink: 0 }}><CheckIcon /></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TwoColumnSection({ kicker, title, body, points, image, imageAlt, reverse = false }) {
  return (
    <section id={kicker.id} className="ac-section-tight" style={{ background: reverse ? "#f5f5f8" : "#ffffff", ...S.section, scrollMarginTop: 24 }}>
      <div className="content-wrap">
        <div className="product-page-split" style={{ display: "grid", gridTemplateColumns: "1fr 46%", gap: "2.5rem", alignItems: "center" }}>
          <div style={{ order: reverse ? 2 : 1 }}>
            <div style={S.label}>{kicker.label}</div>
            <h2 style={S.h2}>{title}</h2>
            <p style={{ ...S.body, marginBottom: "1.3rem" }}>{body}</p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {points.map(point => (
                <div key={point} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 8, background: "rgba(201,168,76,0.12)", color: "#a17f1e", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <CheckIcon />
                  </span>
                  <p style={{ ...S.body, fontSize: "0.86rem", margin: 0 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ order: reverse ? 1 : 2 }}>
            <div style={{ borderRadius: 18, overflow: "hidden", background: "#e8e8f0", border: "1px solid rgba(47,49,90,0.08)", boxShadow: "0 14px 36px rgba(47,49,90,0.1)" }}>
              <OptimizedImage src={image} alt={imageAlt} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductShowcasePage({ data, onContact }) {
  const navigate = useNavigate();
  const waLink = whatsappLink(data.name);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 900px) {
          .product-page-split { grid-template-columns: 1fr !important; }
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <SectionSidebar items={data.sidebar} />

      <section id="overview" className="product-hero" style={{ background: "#2f315a", paddingTop: "3rem", paddingBottom: "3.2rem", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <button className="product-hero-back" onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", transition: "background 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            Back
          </button>

          <div className="product-hero-row" style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            <div className="product-hero-textgroup" style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flex: 1, minWidth: 280 }}>
              <div className="product-hero-icon" style={{ width: 82, height: 82, borderRadius: 18, background: data.iconBg || "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", padding: "0.75rem" }}>
                <OptimizedImage src={data.logo} alt={data.name} loading="eager" decoding="async" fetchPriority="high" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div className="product-hero-eyebrow" style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                  {data.eyebrow}
                </div>
                <h1 className="product-hero-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, marginBottom: "1rem" }}>
                  {data.name}
                </h1>
                <p className="product-hero-body" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.66)", lineHeight: 1.78, maxWidth: 640, marginBottom: "1.5rem" }}>
                  {data.hero}
                </p>
                <div className="product-hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button onClick={onContact} style={{ background: "#c9a84c", color: "#1e2040", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    Request a Demo
                  </button>
                  <a href={waLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none" }}>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
            <div className="product-hero-image" style={{ flex: "0 1 460px", maxWidth: 500 }}>
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 48px rgba(0,0,0,0.24)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <OptimizedImage src={data.heroImage} alt={data.heroImageAlt} loading="eager" decoding="async" fetchPriority="high" style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fit" style={{ background: "#ffffff", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>{data.fitLabel}</div>
          <h2 style={S.h2}>{data.fitTitle}</h2>
          <p style={{ ...S.body, maxWidth: 760, marginBottom: "1.7rem" }}>{data.fitBody}</p>
          <CardGrid items={data.fitCards} />
        </div>
      </section>

      {data.sections.map((section, index) => (
        <TwoColumnSection key={section.title} {...section} image={section.image || data.heroImage} imageAlt={section.imageAlt || data.heroImageAlt} reverse={index % 2 === 1} />
      ))}

      <section id="implementation" style={{ background: "#ffffff", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Implementation</div>
          <h2 style={S.h2}>{data.implementationTitle}</h2>
          <p style={{ ...S.body, maxWidth: 780, marginBottom: "1.7rem" }}>{data.implementationBody}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="product-detail-grid">
            {data.implementationPanels.map(panel => <BulletPanel key={panel.title} {...panel} />)}
          </div>
        </div>
      </section>

      <section style={{ background: "#2f315a", padding: "3.5rem 0" }}>
        <div className="content-wrap" style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ ...S.label, marginBottom: "0.45rem" }}>{data.ctaKicker}</div>
            <h2 style={{ ...S.h2, color: "#ffffff", marginBottom: "0.4rem" }}>{data.ctaTitle}</h2>
            <p style={{ ...S.body, color: "rgba(255,255,255,0.65)", maxWidth: 660 }}>{data.ctaBody}</p>
          </div>
          <a href={waLink} target="_blank" rel="noreferrer" style={{ background: "#c9a84c", color: "#1e2040", padding: "0.8rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
            Talk to Sales
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
