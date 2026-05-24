import React, { useRef, useState, useEffect } from "react";

export default function SectionDivider({ iconSrc, iconAlt = "icon" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 var(--px)",
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "rgba(47,49,90,0.12)" }} />
      <div
        style={{
          padding: "0 1.5rem",
          filter: inView ? "grayscale(0) drop-shadow(0 4px 12px rgba(0,0,0,0.08))" : "grayscale(1) opacity(0.35)",
          transform: inView ? "scale(1)" : "scale(0.85)",
          transition: "filter 0.9s ease, opacity 0.9s ease, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={iconAlt}
            style={{ width: 42, height: 42, objectFit: "contain", display: "block" }}
          />
        ) : (
          <div style={{ width: 42, height: 42 }} />
        )}
      </div>
      <div style={{ flex: 1, height: 1, background: "rgba(47,49,90,0.12)" }} />
    </div>
  );
}
