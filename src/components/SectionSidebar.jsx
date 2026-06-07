import React, { useState, useEffect, useRef } from "react";
import useDarkBg from "../hooks/useDarkBg";
import { getSectionNavItems } from "./PageSections.jsx";

/**
 * SectionSidebar — floating right-rail anchor nav for long product pages.
 *
 * Props:
 *   items: [{ id, label }]   anchor IDs and visible labels
 *
 * Behaviour:
 *   • Scroll listener picks the section closest to the top of the viewport
 *     and marks it active. (Uses scroll position rather than IntersectionObserver
 *     because the latter fires multiple times during smooth-scroll, causing
 *     the active highlight to flicker.)
 *   • Clicking a button locks the active state to the clicked id for 900ms,
 *     so the smooth-scroll doesn't briefly re-highlight intermediate sections.
 *   • Visual styling never changes font-weight on active — only colour and
 *     background — so the row width stays constant and the panel doesn't jump.
 *
 * Hidden on screens < 1280px via the .ac-sidebar media query in global.css.
 */
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;
  const number = Number.parseInt(value, 16);
  if (Number.isNaN(number)) return "201,168,76";
  return `${(number >> 16) & 255},${(number >> 8) & 255},${number & 255}`;
}

export default function SectionSidebar({ items, sections, theme = "gold", themeColor }) {
  const navItems = React.useMemo(
    () => items || getSectionNavItems(sections || []),
    [items, sections]
  );
  const activeColor = themeColor || (theme === "green" ? "#16a14b" : "#c9a84c");
  const activeRgb = hexToRgb(activeColor);
  const [active, setActive] = useState(navItems[0]?.id || "");
  const [expanded, setExpanded] = useState(false);
  const lockedRef = useRef(false);
  const navRef = useRef(null);
  const isDark = useDarkBg(navRef);
  const lockTimerRef = useRef(null);

  useEffect(() => {
    function update() {
      if (lockedRef.current) return;
      // Find the section whose top is closest to (but above) the viewport
      // top + 55% buffer. That section is the one the user is "in".
      const probe = window.innerHeight * 0.55;
      let bestId = navItems[0]?.id;
      let bestTop = -Infinity;
      for (const s of navItems) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - probe <= 0 && top > bestTop) {
          bestTop = top;
          bestId = s.id;
        }
      }
      setActive(prev => {
        if (prev !== bestId) {
          window.dispatchEvent(new CustomEvent("sectionChange", { detail: bestId }));
        }
        return bestId;
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [navItems]);

  function go(id) {
    setActive(prev => {
      if (prev !== id) {
        window.dispatchEvent(new CustomEvent("sectionChange", { detail: id }));
      }
      return id;
    });
    lockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => { lockedRef.current = false; }, 900);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 100, behavior: "smooth" });
    }
  }

  return (
    <nav
      ref={navRef}
      className={`ac-sidebar lg-glass${expanded ? " is-expanded" : ""}`}
      aria-label="Product page sections"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
      }}
      style={{
      position: "fixed",
      top: "50%", right: 28,
      transform: "translateY(-50%)",
      zIndex: 150,
      display: "flex", flexDirection: "column", gap: 4,
      alignItems: "stretch",
      borderRadius: 18,
      padding: "0.55rem",
      width: expanded ? 178 : 48,
      overflow: "hidden",
      transition: "width 0.28s cubic-bezier(0.16, 1, 0.3, 1), padding 0.22s ease, border-radius 0.22s ease",
      willChange: "width",
    }}>
      {navItems.map(s => {
        const isActive = active === s.id;
        const activeBg = `rgba(${activeRgb}, ${isDark ? 0.25 : 0.15})`;
        const hoverBg = `rgba(${activeRgb}, ${isDark ? 0.18 : 0.1})`;
        return (
          <button key={s.id} onClick={() => go(s.id)}
            aria-label={s.label}
            title={expanded ? undefined : s.label}
            style={{
              display: "flex", alignItems: "center", gap: expanded ? 8 : 0,
              justifyContent: expanded ? "flex-start" : "center",
              minWidth: 0,
              width: "100%",
              height: 38,
              padding: expanded ? "0.5rem 0.75rem" : "0.5rem",
              border: "none",
              background: isActive ? activeBg : "transparent",
              color: isActive ? activeColor : (isDark ? "#ffffff" : "#6b6f91"),
              /* Constant font-weight prevents layout shift between states */
              fontWeight: 600,
              fontSize: "0.78rem",
              borderRadius: 8, cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              whiteSpace: "nowrap",
              transition: "background 0.18s, color 0.18s, gap 0.22s ease, padding 0.22s ease",
            }}
            onMouseOver={e => {
              if (!isActive) {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.color = activeColor;
                const iconEl = e.currentTarget.querySelector("svg");
                if (iconEl) iconEl.style.color = activeColor;
              }
            }}
            onMouseOut={e => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = isDark ? "#ffffff" : "#6b6f91";
                const iconEl = e.currentTarget.querySelector("svg");
                if (iconEl) iconEl.style.color = isDark ? "rgba(255,255,255,0.6)" : "#cfd0e0";
              }
            }}
          >
            {s.icon ? (
              React.cloneElement(s.icon, {
                width: 16, height: 16,
                style: {
                  flexShrink: 0,
                  color: isActive ? activeColor : (isDark ? "rgba(255,255,255,0.6)" : "#cfd0e0"),
                  transition: "color 0.18s, transform 0.18s",
                  transform: isActive ? "translateX(2px)" : "translateX(0)",
                }
              })
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
                flexShrink: 0,
                color: isActive ? activeColor : (isDark ? "rgba(255,255,255,0.6)" : "#cfd0e0"),
                transition: "color 0.18s, transform 0.18s",
                transform: isActive ? "translateX(2px)" : "translateX(0)",
              }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            <span style={{
              display: "inline-block",
              maxWidth: expanded ? 118 : 0,
              opacity: expanded ? 1 : 0,
              overflow: "hidden",
              transform: expanded ? "translateX(0)" : "translateX(-4px)",
              transition: "max-width 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease, transform 0.22s ease",
            }}>
              {s.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
