import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Img } from "./Media.jsx";
import { CASE_IMAGES } from "../assets/assets.js";
import caseStudiesContent from "../content/caseStudies.json";

const CASES = caseStudiesContent.items || [];
const SUPAPRINTZ_PARTNER = {
  name: "Supaprintz.my",
  category: "Printing / Advertising / Design",
  address: "No. 8, Ground Floor, Jalan Dagang Utama, Dynaton Bukit Angin, 28000",
  phone: "011-5585 9576",
  email: "suparintz.my@gmail.com",
};

/* accent colours and placeholder icons for each card */
const CARD_META = [
  { accent: "rgba(201,168,76,0.14)", iconColor: "#c9a84c" },
  { accent: "rgba(47,49,90,0.30)",   iconColor: "#7b7fb8" },
  { accent: "rgba(25,80,60,0.28)",   iconColor: "#4caf8a" },
  { accent: "rgba(120,50,20,0.28)",  iconColor: "#c9813e" },
];

const ICONS = [
  /* network */
  <svg key="net" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/>
    <rect x="9" y="16" width="6" height="6" rx="1"/>
    <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M12 13v3"/>
  </svg>,
  /* code */
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2"/>
  </svg>,
  /* erp */
  <svg key="erp" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 9h6M9 12h6M9 15h4"/>
  </svg>,
  /* warehouse */
  <svg key="wh" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" width="46" height="46">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>,
];

function SupaprintzPartnerModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="supaprintz-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(20,22,40,0.58)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          borderRadius: 22,
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 28px 90px rgba(15,18,40,0.35)",
          border: "1px solid rgba(255,255,255,0.65)",
        }}
      >
        <div style={{
          position: "relative",
          background: "#2f315a",
          color: "#ffffff",
          padding: "2rem 2rem 1.75rem",
        }}>
          <button
            type="button"
            aria-label="Close Supaprintz partner details"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.24)",
              background: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            border: "1px solid rgba(201,168,76,0.45)",
            background: "rgba(201,168,76,0.14)",
            color: "#e9cf77",
            borderRadius: 50,
            padding: "0.28rem 0.75rem",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            Our Partner
          </div>
          <h3 id="supaprintz-modal-title" style={{
            fontSize: "clamp(1.8rem, 5vw, 2.55rem)",
            lineHeight: 1.05,
            fontWeight: 750,
            marginBottom: "0.55rem",
          }}>
            {SUPAPRINTZ_PARTNER.name}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1rem", lineHeight: 1.65 }}>
            {SUPAPRINTZ_PARTNER.category}
          </p>
        </div>

        <div style={{ padding: "1.6rem 2rem 2rem" }}>
          {[
            ["Address", SUPAPRINTZ_PARTNER.address],
            ["Phone", SUPAPRINTZ_PARTNER.phone],
            ["Email", SUPAPRINTZ_PARTNER.email],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: "grid",
              gridTemplateColumns: "88px 1fr",
              gap: "1rem",
              padding: "0.95rem 0",
              borderBottom: "1px solid rgba(47,49,90,0.08)",
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {label}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#2f315a", lineHeight: 1.55, fontWeight: 600 }}>
                {value}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <a
              href="tel:+601155859576"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                flex: "1 1 150px",
                minHeight: 44,
                borderRadius: 50,
                background: "#2f315a",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.86rem",
                fontWeight: 700,
              }}
            >
              Call Partner
            </a>
            <a
              href={`mailto:${SUPAPRINTZ_PARTNER.email}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                flex: "1 1 150px",
                minHeight: 44,
                borderRadius: 50,
                border: "1px solid rgba(47,49,90,0.16)",
                color: "#2f315a",
                textDecoration: "none",
                fontSize: "0.86rem",
                fontWeight: 700,
              }}
            >
              Email Partner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudies({ onContact }) {
  const navigate = useNavigate();

  /* One-shot stagger when the grid scrolls into view. */
  const [revealed, setRevealed] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const gridRef = useRef(null);
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") { setRevealed(true); return; }
    /* Replayable: toggle both ways so the card stagger plays every
     * time the grid scrolls back into view. */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setRevealed(e.isIntersecting)),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!partnerOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setPartnerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [partnerOpen]);

  return (
    <>
    <section className="home-section" style={{ background: "#f5f5f8", padding: "6rem 0" }}>
    <div className="content-wrap">
      {/* header */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{
          fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.75rem",
        }}>
          {caseStudiesContent.eyebrow}
        </div>
        <h2 style={{
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700,
          color: "#2f315a", lineHeight: 1.2, marginBottom: "0.75rem",
        }}>
          {caseStudiesContent.heading}
        </h2>
        <p style={{ fontSize: "1rem", color: "#6b6f91", lineHeight: 1.78 }}>
          {caseStudiesContent.intro}
        </p>
      </div>

      {/* 4-col desktop → 2-col tablet → 1-col mobile (matches Products grid) */}
      <div
        ref={gridRef}
        className="cases-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem",
        }}
      >
        {CASES.map((c, i) => {
          const imgSrc = c.image || CASE_IMAGES[c.key];
          const meta   = CARD_META[i] || CARD_META[CARD_META.length - 1];
          /* Last 2 cards are empty placeholders */
          const isEmpty = i >= 2;
          const opensPartnerModal = c.modal === "supaprintz";
          const clickable = !isEmpty && (!!c.route || opensPartnerModal);
          return (
            <div
              key={c.key || i}
              onClick={clickable ? () => {
                if (opensPartnerModal) setPartnerOpen(true);
                else navigate(c.route);
              } : undefined}
              style={{
                borderRadius: 16, overflow: "hidden",
                background: isEmpty ? "rgba(47,49,90,0.02)" : "#ffffff",
                border: `1px solid ${isEmpty ? "rgba(47,49,90,0.04)" : "rgba(47,49,90,0.1)"}`,
                cursor: clickable ? "pointer" : "default",
                /* Slide-up + fade, staggered left → right (150ms apart). */
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.65s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s, border-color 0.2s`,
                minHeight: isEmpty ? 200 : "auto",
              }}
              onMouseEnter={clickable ? e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)" : undefined}
              onMouseLeave={clickable ? e => e.currentTarget.style.borderColor = "rgba(47,49,90,0.1)" : undefined}
            >
              {!isEmpty && (
                <>
                  {/* image / placeholder */}
                  <div style={{ position: "relative", paddingBottom: "48%", background: meta.accent }}>
                    {imgSrc ? (
                      <Img src={imgSrc} alt={c.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: meta.iconColor, opacity: 0.5 }}>
                        {ICONS[i] || ICONS[ICONS.length - 1]}
                      </div>
                    )}
                  </div>
                  {/* body */}
                  <div style={{ padding: "1.4rem" }}>
                    <div style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.1em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      {c.tag}
                    </div>
                    <h3 style={{ fontSize: "0.93rem", fontWeight: 600, color: "#2f315a", lineHeight: 1.45, marginBottom: "0.55rem" }}>
                      {c.title}
                    </h3>
                    <p style={{ fontSize: "0.81rem", color: "#6b6f91", lineHeight: 1.72 }}>
                      {c.desc}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {caseStudiesContent.ctaLabel && (
        <button
          onClick={onContact}
          style={{
            marginTop: "2.5rem",
            border: "1.5px solid rgba(47,49,90,0.28)", color: "rgba(47,49,90,0.7)",
            padding: "0.72rem 1.9rem", borderRadius: 50,
            fontSize: "0.85rem", fontWeight: 500,
            background: "transparent", cursor: "pointer", fontFamily: "inherit",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "#2f315a"; e.currentTarget.style.color = "#2f315a"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(47,49,90,0.28)"; e.currentTarget.style.color = "rgba(47,49,90,0.7)"; }}
        >
          {caseStudiesContent.ctaLabel}
        </button>
      )}
    </div>
    </section>
    <SupaprintzPartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </>
  );
}
