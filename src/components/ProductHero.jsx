import { Img } from "./Media.jsx";
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════════
 * ProductHero — shared hero band used by every product / app page
 *
 * Composition (matches the AutoCount Accounting design):
 *   1. Full-bleed lifestyle photo (background-image, cover, centered)
 *   2. Semi-transparent black overlay so white copy reads cleanly
 *   3. Centered content column: Back button, logo chip, eyebrow,
 *      title, body, primary + secondary CTA buttons
 *
 * Props:
 *   eyebrow         small uppercase line above title           (string)
 *   title           main heading                               (string)
 *   body            description paragraph                      (string)
 *   iconSrc         logo chip image, omit for no chip          (string?)
 *   iconAlt         alt text for the logo chip                 (string?)
 *   backgroundImage hero photo URL                             (string?)
 *   overlayOpacity  0–1, defaults to 0.6                       (number?)
 *   primaryCta      { label, href?, onClick?, disabled?, download?, icon? }
import { Img } from "./Media.jsx";

/* ══════════════════════════════════════════════════════════════
 * ProductHero — shared hero band used by every product / app page
 *
 * Composition (matches the AutoCount Accounting design):
 *   1. Full-bleed lifestyle photo (background-image, cover, centered)
 *   2. Semi-transparent black overlay so white copy reads cleanly
 *   3. Centered content column: Back button, logo chip, eyebrow,
 *      title, body, primary + secondary CTA buttons
 *
 * Props:
 *   eyebrow         small uppercase line above title           (string)
 *   title           main heading                               (string)
 *   body            description paragraph                      (string)
 *   iconSrc         logo chip image, omit for no chip          (string?)
 *   iconAlt         alt text for the logo chip                 (string?)
 *   backgroundImage hero photo URL                             (string?)
 *   backgroundVideo hero video URL (takes precedence)          (string?)
 *   overlayOpacity  0–1, defaults to 0.6                       (number?)
 *   primaryCta      { label, href?, onClick?, disabled?, download?, icon? }
 *   secondaryCta    { label, href, target? }
 *   tertiaryCta     { label, href, target? }
 * ══════════════════════════════════════════════════════════════ */

const DEFAULT_BG = "/images/products/autocount-accounting-hero.webp";

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginTop: "-2px" }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

function LogoChip({ iconSrc, iconAlt, className = "" }) {
  if (!iconSrc) return null;
  return (
    <div className={`product-hero-icon ${className}`} style={{
      width: "var(--icon-lg)", height: "var(--icon-lg)", borderRadius: "var(--media-radius)",
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
    }}>
      <Img src={iconSrc} alt={iconAlt} priority
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
    </div>
  );
}

export default function ProductHero({
  eyebrow,
  title,
  body,
  iconSrc,
  iconAlt = "",
  backgroundImage = DEFAULT_BG,
  backgroundVideo,
  overlayOpacity = 0.6,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  className = "",
}) {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current && backgroundVideo) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.warn("Autoplay prevented:", e));
    }
  }, [backgroundVideo]);

  return (
    <div className={`product-hero ${className}`.trim()} data-glass-tone="dark" style={{
      position: "sticky",
      top: 0,
      zIndex: 0,
      paddingTop: "7rem", paddingBottom: "5rem",
      display: "flex", alignItems: "center",
      overflow: "hidden",
      background: "#1f2142",
    }}>
      {/* 
        Using an actual <img> tag instead of CSS backgroundImage ensures the browser's
        preload scanner discovers and downloads the LCP image immediately during HTML parsing.
      */}
      {backgroundVideo ? (
        <>
          <img
            className="product-hero-bg"
            src={backgroundImage}
            alt=""
            loading="eager"
            decoding="sync"
            fetchpriority="high"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              zIndex: 0,
              opacity: isVideoPlaying ? 0 : 1,
              transition: "opacity 0.7s ease-in-out",
            }}
          />
          <video
            ref={videoRef}
            className="product-hero-bg"
            autoPlay
            loop
            muted
            playsInline
            onPlaying={() => setIsVideoPlaying(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              zIndex: 1,
              opacity: isVideoPlaying ? 1 : 0,
              transition: "opacity 0.7s ease-in-out",
            }}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </>
      ) : (
        <img
          className="product-hero-bg"
          src={backgroundImage}
          alt=""
          loading="eager"
          decoding="sync"
          fetchpriority="high"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            zIndex: 0,
          }}
        />
      )}

      {/* Mobile-only bump: shift the hero photo to the right so the
       * laptop / monitor scene stays in frame at narrow widths. Desktop
       * keeps the inline "center center" above. */}
      <style>{`
        @media (max-width: 760px) {
          .product-hero-bg { object-position: 78% center !important; }
        }
      `}</style>

      {/* Dark overlay — keeps white copy legible against the photo */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${overlayOpacity})`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div className="content-wrap" style={{ position: "relative", zIndex: 1 }}>

        <div className="product-hero-row" style={{
          display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap",
        }}>
          <div className="product-hero-textgroup" style={{
            display: "flex", alignItems: "flex-start", gap: "2rem",
            flex: 1, minWidth: 280,
          }}>
            <div className="product-hero-mobile-topline">
              <LogoChip iconSrc={iconSrc} iconAlt={iconAlt} className="product-hero-icon-mobile" />
            </div>
            {/* Logo chip (optional) */}
            <LogoChip iconSrc={iconSrc} iconAlt={iconAlt} className="product-hero-icon-desktop" />

            <div style={{ flex: 1, minWidth: 240 }}>
              {eyebrow && (
                <div className="product-hero-eyebrow ks-eyebrow">
                  {eyebrow}
                </div>
              )}

              <h1 className="product-hero-title ks-hero-title" style={{ marginBottom: "1rem" }}>
                {title}
              </h1>

              {body && (
                <p className="product-hero-body ks-body-text ks-body-light" style={{ maxWidth: 600, marginBottom: "1.5rem" }}>
                  {body}
                </p>
              )}

              <div className="product-hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {primaryCta && <PrimaryButton cta={primaryCta} />}
                {secondaryCta && <SecondaryButton cta={secondaryCta} />}
                {tertiaryCta && <SecondaryButton cta={tertiaryCta} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Primary CTA — gold pill ──
 *   If cta.href → renders as <a> (with optional download attribute)
 *   If cta.onClick → renders as <button>
 *   If cta.disabled → renders as inert button (no handler, default cursor) */
function PrimaryButton({ cta }) {
  let defaultIcon = null;
  const isWhatsApp = cta.href?.includes("wa.me") || cta.label?.includes("WhatsApp");
  if (cta.download) defaultIcon = <DownloadIcon />;
  else if (isWhatsApp) defaultIcon = <WhatsAppIcon />;
  
  const icon = cta.icon ?? defaultIcon;

  if (cta.disabled) {
    return (
      <button type="button" aria-disabled="true"
        className={"ks-btn ks-btn-primary " + (cta.className || "")}
        style={{ cursor: "default", opacity: 0.72 }}
      >
        {icon}
        {cta.label}
      </button>
    );
  }
  if (cta.href) {
    return (
      <a href={cta.href}
        download={cta.download || undefined}
        target={cta.target}
        rel={cta.target === "_blank" ? "noreferrer" : undefined}
        className={"ks-btn ks-btn-primary " + (cta.className || "")}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        {icon}
        {cta.label}
        {(!cta.href.startsWith("/") && !cta.href.startsWith("#") && !isWhatsApp) && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
        )}
      </a>
    );
  }
  return (
    <button type="button" onClick={cta.onClick}
      className={"ks-btn ks-btn-primary " + (cta.className || "")}
    >
      {icon}
      {cta.label}
    </button>
  );
}

/* ── Secondary CTA — ghost outline ── */
function SecondaryButton({ cta }) {
  const isWhatsApp = cta.href?.includes("wa.me") || cta.label?.includes("WhatsApp");
  const icon = cta.icon ?? (isWhatsApp ? <WhatsAppIcon /> : null);
  
  return (
    <a href={cta.href}
      className="btn-ghost-base btn-ghost-light"
      target={cta.target}
      rel={cta.target === "_blank" ? "noreferrer" : undefined}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
    >
      {icon}
      {cta.label}
      {(!cta.href.startsWith("/") && !cta.href.startsWith("#") && !isWhatsApp) && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
      )}
    </a>
  );
}
