import { useEffect, useRef, useState } from "react";

/**
 * HexFeatures — hexagonal feature showcase using a static image
 * for the centre hexagon ring, with text labels flanking each side.
 */

export default function HexFeatures({ title, subtitle, features = [] }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const items = features.slice(0, 6);
  while (items.length < 6) items.push({ title: "", desc: "", color: "#ccc" });

  return (
    <div className="content-wrap">
      <div ref={ref} className={`hex-features${inView ? " in-view" : ""}`}>
        {/* Heading */}
        <div className="hex-features-head">
          <h2 className="ks-section-title" style={{ textAlign: "center" }}>{title}</h2>
          {subtitle && (
            <p className="ks-body-text" style={{ textAlign: "center", maxWidth: 1000, margin: "0.5rem auto 0" }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="hex-features-layout">
          {/* Left column: data items 0, 2, 4 */}
          <div className="hex-features-text-col hex-features-text-left">
            {[0, 2, 4].map((i) => (
              <div key={i} className="hex-features-item" style={{ transitionDelay: inView ? `${i * 80 + 60}ms` : "0ms" }}>
                <h3 className="hex-features-item-title" >
                  {items[i].title}
                  <span className="hex-features-item-dot" style={{ background: items[i].color, margin: 0, flexShrink: 0 }} />
                </h3>
                <p className="hex-features-item-desc">{items[i].desc}</p>
              </div>
            ))}
          </div>

          {/* Centre hexagon image */}
          <div className="hex-features-ring">
            <img
              src="/images/products/pos-hex-features.png"
              alt="AutoCount POS 6 key features hexagon"
              className="hex-features-img"
              width="420"
              height="420"
              loading="lazy"
            />
          </div>

          {/* Right column: data items 1, 3, 5 */}
          <div className="hex-features-text-col hex-features-text-right">
            {[1, 3, 5].map((i) => (
              <div key={i} className="hex-features-item" style={{ transitionDelay: inView ? `${i * 80 + 60}ms` : "0ms" }}>
                <h3 className="hex-features-item-title" >
                  <span className="hex-features-item-dot" style={{ background: items[i].color, margin: 0, flexShrink: 0 }} />
                  {items[i].title}
                </h3>
                <p className="hex-features-item-desc">{items[i].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
