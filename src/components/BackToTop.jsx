import { useState, useEffect, useRef } from "react";
import useDarkBg from "../hooks/useDarkBg";

/**
 * BackToTop — Apple Liquid Glass style.
 * On desktop/tablet: fixed bottom-right circle.
 * On mobile: rendered inside the FloatingBar, so this component hides itself.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef(null);
  const isDark = useDarkBg(btnRef);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .back-to-top-glass {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 500;
          --lg-size: 40px;
          transition:
            opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.46s cubic-bezier(0.2, 1.18, 0.36, 1),
            box-shadow 0.25s ease,
            background 0.25s ease,
            color 0.35s ease;
        }
        .back-to-top-glass.is-visible {
          animation: backTopFriendlyDock 0.62s cubic-bezier(0.18, 1.28, 0.36, 1) both;
        }
        @keyframes backTopFriendlyDock {
          0% { transform: translateY(14px) scale(0.84); opacity: 0; }
          54% { transform: translateY(-5px) scale(1.06); opacity: 1; }
          78% { transform: translateY(2px) scale(0.98); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        /* Mobile sizing */
        @media (max-width: 767px) {
          .back-to-top-glass {
            bottom: calc(20px + env(safe-area-inset-bottom, 0px));
            right: 14px;
            --lg-size: 44px;
            z-index: 1001;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .back-to-top-glass.is-visible {
            animation: none !important;
          }
          .back-to-top-glass {
            transition: opacity 0.2s ease !important;
          }
        }
      `}</style>
      <button
        ref={btnRef}
        className={`back-to-top-glass lg-glass lg-glass-btn lg-glass-circle${visible ? " is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
        style={{
          opacity: visible ? 1 : 0,
          "--lg-rest-transform": visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.85)",
          "--lg-hover-transform": "translateY(-2px) scale(1.04)",
          "--lg-active-transform": "translateY(0) scale(0.94)",
          pointerEvents: visible ? "auto" : "none",
          color: isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.55)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
