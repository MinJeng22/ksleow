import { useEffect, useRef, useState } from "react";
import { CONTACT } from "../constants/contact.js";
import ParticleBackground from "./ParticleBackground";
import { CTA_PARTICLE_PROPS } from "./ctaParticleConfig.js";
import careers from "../content/careers.json";

function parseQuote(raw) {
  if (!raw) return ["", ""];
  let txt = String(raw).trim();
  txt = txt.replace(/^["'`]/, "").replace(/["'`]$/, "");
  txt = txt.replace(/\.$/, "");
  const commaIndex = txt.indexOf(",");
  if (commaIndex === -1) return [txt, ""];
  return [txt.slice(0, commaIndex).trim(), txt.slice(commaIndex + 1).trim()];
}

function AnimatedWords({ text, startDelay = 0, stepMs = 60, visible }) {
  if (!text) return null;
  const words = text.split(" ");

  return words.map((word, index) => (
    <span
      key={index}
      style={{
        display: "inline-block",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        transitionDelay: visible ? `${startDelay + index * stepMs}ms` : "0ms",
        marginRight: index < words.length - 1 ? "0.28em" : 0,
        whiteSpace: "pre",
      }}
    >
      {word}
    </span>
  ));
}

export default function Careers() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [buttonsClickable, setButtonsClickable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      }),
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [line1, line2] = parseQuote(careers.heading);
  const LINE_FADE_MS = 550;
  const line1Start = 0;
  const line2Start = line1Start + LINE_FADE_MS + 250;
  const bodyStart = line2Start + LINE_FADE_MS + 350;
  const BODY_STEP = 26;
  const bodyDuration = (careers.body || "").split(" ").length * BODY_STEP;
  const buttonsStart = bodyStart + bodyDuration + 200;

  useEffect(() => {
    if (!visible) return undefined;

    const timer = setTimeout(() => {
      setButtonsClickable(true);
    }, buttonsStart + 500);

    return () => clearTimeout(timer);
  }, [visible, buttonsStart]);

  return (
    <div
      className="home-section"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#f4f6fb",
        padding: "var(--section-py) 0",
        borderTop: "0.5px solid rgba(47,49,90,0.1)",
      }}
    >
      <ParticleBackground
        {...CTA_PARTICLE_PROPS}
        active={visible}
        paused={false}
      />

      <div
        className="content-wrap"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {/* Left Column: Text & Buttons */}
        <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: "1.1rem",
            }}
          >
            {careers.eyebrow}
          </div>

          <h2
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
              fontWeight: 700,
              color: "#2f315a",
              lineHeight: 1.4,
              marginBottom: "0.9rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: `opacity ${LINE_FADE_MS}ms ease, transform ${LINE_FADE_MS}ms ease`,
                transitionDelay: visible ? `${line1Start}ms` : "0ms",
              }}
            >
              <span aria-hidden="true">"</span>
              {line1}
            </span>
            <br />
            <span
              className="careers-line2"
              style={{
                display: "inline-block",
                marginLeft: "clamp(1.5rem, 6vw, 4rem)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: `opacity ${LINE_FADE_MS}ms ease, transform ${LINE_FADE_MS}ms ease`,
                transitionDelay: visible ? `${line2Start}ms` : "0ms",
              }}
            >
              {line2}
              <span aria-hidden="true">"</span>
            </span>
          </h2>

          <p style={{ color: "#6b6f91", fontSize: "0.95rem", lineHeight: 1.75, maxWidth: "540px" }}>
            <AnimatedWords
              text={careers.body}
              startDelay={bodyStart}
              stepMs={BODY_STEP}
              visible={visible}
            />
          </p>

          <div
            className="careers-btns"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.85rem",
              flexWrap: "wrap",
              marginTop: "2.2rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              transitionDelay: visible ? `${buttonsStart}ms` : "0ms",
              pointerEvents: buttonsClickable ? undefined : "none",
            }}
          >
            <a
              href={`mailto:${CONTACT.email}?subject=Career Enquiry`}
              style={{
                background: "#2f315a",
                color: "#ffffff",
                padding: "0.82rem 2.2rem",
                borderRadius: 50,
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
              onMouseOver={(event) => { event.currentTarget.style.background = "#3d4075"; }}
              onMouseOut={(event) => { event.currentTarget.style.background = "#2f315a"; }}
            >
              {careers.careerButtonLabel || careers.buttonLabel || "Join Our Team"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7" />
                <path d="M9 7h8v8" />
              </svg>
            </a>

            <a
              href={`mailto:${careers.partnerEmail || CONTACT.email}?subject=Partnership Enquiry`}
              className="btn-ghost-base btn-ghost-dark"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              {careers.partnerButtonLabel || "Partner with Us"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7" />
                <path d="M9 7h8v8" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: Video Placeholder */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            background: "rgba(47, 49, 90, 0.04)",
            border: "1px dashed rgba(47, 49, 90, 0.2)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            transitionDelay: visible ? `${buttonsStart + 200}ms` : "0ms",
          }}
        >
          <span style={{ color: "rgba(47, 49, 90, 0.4)", fontSize: "0.9rem", fontWeight: 600 }}>
            Video Placeholder
          </span>
        </div>
      </div>
    </div>
  );
}
