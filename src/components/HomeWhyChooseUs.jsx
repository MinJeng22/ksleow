import React, { useRef, useEffect, useState } from "react";

const STATS = [
  { number: "6", label: "Award-Winning Years" },
  { number: "500+", label: "Businesses Served" },
  { number: "15+", label: "Years of Experience" },
  { number: "24h", label: "Support Response" },
];

const PILLARS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: "Proven Expertise",
    desc: "Certified AutoCount specialists with over 15 years of hands-on accounting & IT experience.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Prompt On-Site Support",
    desc: "Fast, reliable on-site and remote support so your business never misses a beat.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Dedicated Training",
    desc: "Structured hands-on training that empowers your team to use software confidently from day one.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "#1 in Pahang",
    desc: "Top AutoCount Dealer in Pahang State — the most trusted local partner for your accounting software journey.",
  },
];

export default function HomeWhyChooseUs({ teamPhoto = "/images/team/group-photo-placeholder.jpg" }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-ksl"
      className="home-section"
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        scrollMarginTop: 24,
      }}
    >
      {/* ── Background photo ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${teamPhoto})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        transform: visible ? "scale(1)" : "scale(1.06)",
        transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
        willChange: "transform",
      }} />

      {/* ── Dark + brand gradient overlay ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(26,28,56,0.88) 0%, rgba(47,49,90,0.80) 45%, rgba(26,28,56,0.75) 100%)",
      }} />

      {/* ── Gold accent glow top-left ── */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: "45%", height: "70%",
        background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── Content ── */}
      <div className="content-wrap" style={{ position: "relative", zIndex: 2, width: "100%" }}>

        {/* Eye-brow */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.7rem",
          marginBottom: "1.2rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}>
          <div style={{ height: 2, width: 36, background: "#c9a84c", borderRadius: 2 }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", color: "#c9a84c", textTransform: "uppercase" }}>
            Why Choose Us
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
          fontWeight: 800,
          color: "#ffffff",
          lineHeight: 1.12,
          letterSpacing: "-0.025em",
          maxWidth: "820px",
          marginBottom: "1.1rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(22px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          Top AutoCount Dealer in{" "}
          <span style={{ color: "#c9a84c" }}>Pahang State</span>
          {" "}for{" "}
          <span style={{ color: "#c9a84c" }}>6 Award-Winning Years</span>
        </h2>

        {/* Sub-headline */}
        <p style={{
          fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
          color: "rgba(255,255,255,0.75)",
          maxWidth: "640px",
          lineHeight: 1.65,
          marginBottom: "clamp(2rem,4vw,3.2rem)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s",
        }}>
          Empowering your business with proven expertise, prompt on-site support &amp; dedicated training — right here in Pahang.
        </p>

        {/* Pillar cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "clamp(0.8rem,2vw,1.2rem)",
          marginBottom: "clamp(2rem,4vw,3rem)",
        }}>
          {PILLARS.map((p, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                padding: "clamp(1.1rem,2.5vw,1.6rem)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.65s ease ${0.38 + i * 0.1}s, transform 0.65s ease ${0.38 + i * 0.1}s`,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "rgba(201,168,76,0.15)",
                border: "1px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#c9a84c",
                flexShrink: 0,
              }}>
                {p.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.35rem" }}>{p.title}</div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(1.2rem,3vw,2.5rem)",
          paddingTop: "clamp(1.2rem,2.5vw,1.8rem)",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease 0.78s, transform 0.7s ease 0.78s",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <span style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "#c9a84c", lineHeight: 1 }}>{s.number}</span>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
