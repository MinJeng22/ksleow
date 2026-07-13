import { useEffect, useRef, useState } from "react";

/**
 * HexFeatures — a 6-segment hexagonal ring layout.
 *
 * Each segment is a coloured wedge of the ring. An icon sits inside
 * the wedge; the title + description text sits outside the ring,
 * positioned near its segment.
 *
 * Props:
 *   title       — section heading (centred above the hex)
 *   subtitle    — optional sub-heading
 *   features    — array of 6 objects: { icon, title, desc, color }
 *   accentColor — fallback accent colour
 */

const HEX_COLORS = [
  "#e74c3c", // top-left      — red
  "#f39c12", // top-right     — amber
  "#2ecc71", // right         — green
  "#3498db", // bottom-right  — blue
  "#9b59b6", // bottom-left   — purple
  "#1abc9c", // left          — teal
];

/* ── SVG hexagon ring wedges ─────────────────────────────────── */

/**
 * Build a single 60° arc wedge of a hexagonal ring.
 *
 * The ring sits between an inner and outer hexagon.
 * We compute 4 corner points (2 on outer hex, 2 on inner hex)
 * then build a closed path: outer-arc → line → inner-arc → line.
 */
function hexPoint(cx, cy, r, angleDeg) {
  const rad = (Math.PI / 180) * angleDeg;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function wedgePath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const [ox1, oy1] = hexPoint(cx, cy, outerR, startAngle);
  const [ox2, oy2] = hexPoint(cx, cy, outerR, endAngle);
  const [ix2, iy2] = hexPoint(cx, cy, innerR, endAngle);
  const [ix1, iy1] = hexPoint(cx, cy, innerR, startAngle);
  return [
    `M ${ox1} ${oy1}`,
    `L ${ox2} ${oy2}`,
    `L ${ix2} ${iy2}`,
    `L ${ix1} ${iy1}`,
    `Z`,
  ].join(" ");
}

/* Icon center position (midpoint of the wedge, midpoint of inner/outer) */
function iconCenter(cx, cy, outerR, innerR, startAngle, endAngle) {
  const midAngle = (startAngle + endAngle) / 2;
  const midR = (outerR + innerR) / 2;
  return hexPoint(cx, cy, midR, midAngle);
}

/* ── Component ───────────────────────────────────────────────── */

export default function HexFeatures({
  title = "Key Features",
  subtitle,
  features = [],
  accentColor = "#e49e25",
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const items = features.slice(0, 6);
  while (items.length < 6) items.push({ title: "", desc: "", color: "#999" });

  /* SVG geometry */
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 195;
  const innerR = 110;
  const gap = 2.5; // degrees of gap between wedges

  /* Text anchor positions (outside the ring) */
  const textPositions = [
    // index 0 — top-left
    { side: "left", top: "2%",  align: "right" },
    // index 1 — top-right
    { side: "right", top: "2%",  align: "left" },
    // index 2 — right
    { side: "right", top: "40%",  align: "left" },
    // index 3 — bottom-right
    { side: "right", top: "78%", align: "left" },
    // index 4 — bottom-left
    { side: "left", top: "78%", align: "right" },
    // index 5 — left
    { side: "left", top: "40%",  align: "right" },
  ];

  return (
    <div className="content-wrap">
      <div ref={ref} className={`hex-features${inView ? " in-view" : ""}`}>
        {/* Section heading */}
        <div className="hex-features-head">
          <h2 className="ks-section-title" style={{ textAlign: "center" }}>{title}</h2>
          {subtitle && <p className="ks-body-text" style={{ textAlign: "center", maxWidth: 600, margin: "0.5rem auto 0" }}>{subtitle}</p>}
        </div>

        {/* Layout wrapper */}
        <div className="hex-features-layout">
          {/* Left text blocks */}
          <div className="hex-features-text-col hex-features-text-left">
            {[0, 5, 4].map((i, idx) => (
              <div
                key={i}
                className="hex-features-item"
                style={{
                  transitionDelay: inView ? `${i * 100}ms` : "0ms",
                }}
              >
                <div className="hex-features-item-dot" style={{ background: items[i].color || HEX_COLORS[i] }} />
                <h3 className="hex-features-item-title">{items[i].title}</h3>
                <p className="hex-features-item-desc">{items[i].desc}</p>
              </div>
            ))}
          </div>

          {/* Centre hex SVG */}
          <div className="hex-features-ring">
            <svg viewBox={`0 0 ${size} ${size}`} className="hex-features-svg" aria-hidden="true">
              {items.map((item, i) => {
                const startAngle = -90 + i * 60 + gap / 2;
                const endAngle = -90 + (i + 1) * 60 - gap / 2;
                const d = wedgePath(cx, cy, outerR, innerR, startAngle, endAngle);
                const [icx, icy] = iconCenter(cx, cy, outerR, innerR, startAngle, endAngle);
                const color = item.color || HEX_COLORS[i];

                return (
                  <g key={i} className="hex-wedge" style={{ transitionDelay: inView ? `${i * 80 + 120}ms` : "0ms" }}>
                    <path d={d} fill={color} className="hex-wedge-path" />
                    <g transform={`translate(${icx - 14}, ${icy - 14})`} className="hex-wedge-icon">
                      {item.icon || (
                        <circle r="14" fill="rgba(255,255,255,0.3)" />
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right text blocks */}
          <div className="hex-features-text-col hex-features-text-right">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="hex-features-item"
                style={{
                  transitionDelay: inView ? `${i * 100}ms` : "0ms",
                }}
              >
                <div className="hex-features-item-dot" style={{ background: items[i].color || HEX_COLORS[i] }} />
                <h3 className="hex-features-item-title">{items[i].title}</h3>
                <p className="hex-features-item-desc">{items[i].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
