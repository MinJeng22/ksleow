import { useEffect, useRef, useState } from "react";

/**
 * HexFeatures — 6-segment hexagonal ring with overlapping parallelogram
 * segments, matching the "6 Market Phases" infographic style.
 *
 * Each segment is a rounded parallelogram that overlaps its neighbour,
 * creating a woven windmill effect. Icons sit inside each segment;
 * text labels are positioned in columns flanking the ring.
 */

/* ── SVG geometry ──────────────────────────────────────────── */

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 178;
const INNER_R = 98;
const OVERLAP = 12;   // degrees each segment extends past its vertex
const CORNER_R = 14;  // rounded corner radius (SVG units)
const ICON_R = (OUTER_R + INNER_R) / 2;

function pt(r, deg) {
  const rad = (Math.PI / 180) * deg;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function norm(v) {
  const l = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  return l ? [v[0] / l, v[1] / l] : [0, 0];
}

/** Build a closed path with rounded corners from an array of [x,y] points */
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

/**
 * Segment k spans from vertex k to vertex k+1 of the hexagon,
 * but extends OVERLAP degrees past each vertex to create overlap
 * with the neighbouring segments.
 */
function segmentPath(k) {
  const s = -90 + k * 60 - OVERLAP;
  const e = -90 + (k + 1) * 60 + OVERLAP;
  const corners = [pt(OUTER_R, s), pt(OUTER_R, e), pt(INNER_R, e), pt(INNER_R, s)];
  return roundedPath(corners, CORNER_R);
}

/**
 * Data-to-segment mapping.
 *
 * Features are read in Z-pattern order (top-left → top-right → …),
 * but segments are numbered clockwise from the top vertex.
 *
 *   data[0] → top-left    → segment 5   (upper-left edge)
 *   data[1] → top-right   → segment 0   (upper-right edge)
 *   data[2] → mid-left    → segment 4   (left edge)
 *   data[3] → mid-right   → segment 1   (right edge)
 *   data[4] → bot-left    → segment 3   (lower-left edge)
 *   data[5] → bot-right   → segment 2   (lower-right edge)
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

  /* Pre-compute segment paths */
  const segments = Array.from({ length: 6 }, (_, k) => ({
    path: segmentPath(k),
    iconAngle: -90 + k * 60 + 30,
    dataIdx: SEG_TO_DATA[k],
  }));

  return (
    <div className="content-wrap">
      <div ref={ref} className={`hex-features${inView ? " in-view" : ""}`}>
        {/* Heading */}
        <div className="hex-features-head">
          <h2 className="ks-section-title" style={{ textAlign: "center" }}>{title}</h2>
          {subtitle && (
            <p className="ks-body-text" style={{ textAlign: "center", maxWidth: 600, margin: "0.5rem auto 0" }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="hex-features-layout">
          {/* Left column: data items 0, 2, 4 (top-left, mid-left, bot-left) */}
          <div className="hex-features-text-col hex-features-text-left">
            {[0, 2, 4].map((i) => (
              <div key={i} className="hex-features-item" style={{ transitionDelay: inView ? `${i * 80 + 60}ms` : "0ms" }}>
                <div className="hex-features-item-dot" style={{ background: items[i].color }} />
                <h3 className="hex-features-item-title">{items[i].title}</h3>
                <p className="hex-features-item-desc">{items[i].desc}</p>
              </div>
            ))}
          </div>

          {/* Hexagonal ring SVG */}
          <div className="hex-features-ring">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="hex-features-svg" aria-hidden="true">
              {/*
                Draw segments 0→5 in order. Each later segment overlaps
                the previous one at the shared vertex, creating a
                windmill/cascade overlap effect.
              */}
              {segments.map((seg, segIdx) => {
                const item = items[seg.dataIdx];
                const [ix, iy] = pt(ICON_R, seg.iconAngle);
                return (
                  <g key={segIdx} className="hex-wedge" style={{ transitionDelay: inView ? `${segIdx * 80 + 120}ms` : "0ms" }}>
                    <path d={seg.path} fill={item.color} className="hex-wedge-path" />
                    <g transform={`translate(${ix - 14}, ${iy - 14})`} className="hex-wedge-icon">
                      {item.icon}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right column: data items 1, 3, 5 (top-right, mid-right, bot-right) */}
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
