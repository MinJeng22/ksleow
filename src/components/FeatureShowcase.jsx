import { useEffect, useRef, useState } from "react";

export default function FeatureShowcase({
  features,
  id = "features",
  className = "",
  sectionStyle,
  cardDelayMs = 90,
  brandLogos,
  brandText,
  wrapper = false,
  wrapperStyle,
}) {
  const gridRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.24 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const content = (
    <div
      id={id}
      className={`ac-section-tight ac-features-showcase${className ? ` ${className}` : ""}`}
      style={{ scrollMarginTop: 24, position: "relative", zIndex: 1, ...sectionStyle }}
    >
      <div className="content-wrap">
        <div ref={gridRef} className={`ac-features-grid${inView ? " is-in-view" : ""}`}>
          {(features || []).map((feature, index) => (
            <article
              key={feature.title}
              className="ac-feature-card"
              style={{ "--feature-delay": `${index * cardDelayMs}ms` }}
            >
              <span className="ac-feature-copy" style={{ position: "relative", zIndex: 2 }}>
                <span className="ac-feature-title" style={feature.icon ? { display: "flex", alignItems: "center", gap: "0.5rem" } : undefined}>
                  {feature.icon && (
                    <img src={feature.icon} alt="" style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0 }} />
                  )}
                  {feature.title}
                </span>
                <span className="ac-feature-desc">{feature.desc}</span>
              </span>
            </article>
          ))}
        </div>

        {brandLogos?.length > 0 && (
          <div style={{ marginTop: "2rem", position: "relative" }}>
            {brandText && (
              <p style={{
                textAlign: "center",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#6b6f91",
                textTransform: "uppercase",
                marginBottom: "2.5rem",
              }}>
                {brandText}
              </p>
            )}
            <div
              className="ac-brand-marquee-container"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                cursor: "pointer",
              }}
              onClick={() => setIsMarqueePaused((paused) => !paused)}
            >
              <div className="ac-brand-marquee" style={{ animationPlayState: isMarqueePaused ? "paused" : "running" }}>
                {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((src, index) => (
                  <div key={`${src}-${index}`} className="ac-brand-item">
                    <img src={src} alt="Brand logo" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!wrapper) return content;

  return (
    <div className="ac-section-wrapper" style={{ background: "#ffffff", ...wrapperStyle }}>
      <div className="ac-container">
        {content}
      </div>
    </div>
  );
}
