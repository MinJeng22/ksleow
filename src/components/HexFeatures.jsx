import { cloneElement, useEffect, useRef, useState } from "react";

/**
 * HexFeatures — 6 overlapping rounded parallelogram segments
 * forming a hexagonal ring, inspired by the "6 Market Phases" style.
 */

/* ── Geometry constants ────────────────────────────────────── */

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 175;
const INNER_R = 88;
const OVERLAP = 8;       // degrees of overlap at each junction
const CORNER_R = 26;     // heavy rounding to smooth the overlap tips
const ICON_R = (OUTER_R + INNER_R) / 2;
const ICON_SIZE = 34;    // icon size in SVG viewBox units

/* ── Helpers ───────────────────────────────────────────────── */

function pt(r, deg) {
  const rad = (Math.PI / 180) * deg;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function norm(v) {
  const l = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  return l ? [v[0] / l, v[1] / l] : [0, 0];
}

/** Closed path with quadratic-bezier-rounded corners. */
function roundedPath(pts, r) {
  const n = pts.length;
  const d = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];
    const d1 = norm([prev[0] - curr[0], prev[1] - curr[1]]);
    const d2 = norm([next[0] - curr[0], next[1] - curr[1]]);
    const p1 = [curr[0] + d1[0] * r, curr[1] + d1[1] * r];
    const p2 = [curr[0] + d2[0] * r, curr[1] + d2[1] * r];
    d.push(i === 0 ? `M${p1[0]},${p1[1]}` : `L${p1[0]},${p1[1]}`);
    d.push(`Q${curr[0]},${curr[1]} ${p2[0]},${p2[1]}`);
  }
  d.push("Z");
  return d.join(" ");
}

/** Build segment k: a rounded parallelogram with overlap extensions. */
function segmentPath(k) {
  const s = -90 + k * 60 - OVERLAP;
  const e = -90 + (k + 1) * 60 + OVERLAP;
  const corners = [pt(OUTER_R, s), pt(OUTER_R, e), pt(INNER_R, e), pt(INNER_R, s)];
  return roundedPath(corners, CORNER_R);
}

/**
 * Z-pattern reading order:
 *   data[0] → top-left    → segment 5
 *   data[1] → top-right   → segment 0
 *   data[2] → mid-left    → segment 4
 *   data[3] → mid-right   → segment 1
 *   data[4] → bot-left    → segment 3
 *   data[5] → bot-right   → segment 2
 */
const SEG_TO_DATA = [1, 3, 5, 4, 2, 0];

/* ── Component ─────────────────────────────────────────────── */

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

  const segments = Array.from({ length: 6 }, (_, k) => ({
    path: segmentPath(k),
    iconAngle: -90 + k * 60 + 30,
    dataIdx: SEG_TO_DATA[k],
  }));

  return (
    <div className="content-wrap">
      <div ref={ref} className={`hex-features${inView ? " in-view" : ""}`}>
        <div className="hex-features-head">
          <h2 className="ks-section-title" style={{ textAlign: "center" }}>{title}</h2>
          {subtitle && (
            <p className="ks-body-text" style={{ textAlign: "center", maxWidth: 600, margin: "0.5rem auto 0" }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="hex-features-layout">
          {/* Left column: data items 0, 2, 4 */}
          <div className="hex-features-text-col hex-features-text-left">
            {[0, 2, 4].map((i) => (
              <div key={i} className="hex-features-item" style={{ transitionDelay: inView ? `${i * 80 + 60}ms` : "0ms" }}>
                <div className="hex-features-item-dot" style={{ background: items[i].color }} />
                <h3 className="hex-features-item-title">{items[i].title}</h3>
                <p className="hex-features-item-desc">{items[i].desc}</p>
              </div>
            ))}
          </div>

          {/* Hexagonal ring */}
          <div className="hex-features-ring">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="hex-features-svg" aria-hidden="true">
              {segments.map((seg, segIdx) => {
                const item = items[seg.dataIdx];
                const [ix, iy] = pt(ICON_R, seg.iconAngle);
                /* Clone the icon SVG element with proper size for this coordinate space */
                const iconEl = item.icon ? cloneElement(item.icon, { width: ICON_SIZE, height: ICON_SIZE }) : null;
                return (
                  <g key={segIdx} className="hex-wedge" style={{ transitionDelay: inView ? `${segIdx * 80 + 120}ms` : "0ms" }}>
                    <path d={seg.path} fill={item.color} className="hex-wedge-path" />
                    <g
                      transform={`translate(${ix - ICON_SIZE / 2}, ${iy - ICON_SIZE / 2})`}
                      className="hex-wedge-icon"
                    >
                      {iconEl}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right column: data items 1, 3, 5 */}
          <div className="hex-features-text-col hex-features-text-right">
            {[1, 3, 5].map((i) => (
              <div key={i} className="hex-features-item" style={{ transitionDelay: inView ? `${i * 80 + 60}ms` : "0ms" }}>
                <div className="hex-features-item-dot" style={{ background: items[i].color }} />
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
