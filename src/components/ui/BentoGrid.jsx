import { useEffect, useRef } from "react";
import { Img } from "../Media.jsx";

const LAYOUT_CLASSES = [
  "ks-bento-layout-1",
  "ks-bento-layout-2",
  "ks-bento-layout-3",
  "ks-bento-layout-4",
  "ks-bento-layout-5",
  "ks-bento-layout-6",
];

const BENTO_CAROUSEL_STYLES = `
.ks-bento-carousel {
  position: relative;
}
.ks-bento-carousel-viewport {
}
.ks-bento-carousel-track {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: 1.5rem 0.5rem;
  margin: -1.5rem -0.5rem;
  scroll-behavior: auto;
  scroll-padding-left: 0;
  scrollbar-width: none;
  will-change: scroll-position;
}
.ks-bento-carousel-track::-webkit-scrollbar {
  display: none;
}
.ks-bento-carousel-slide {
  flex: 0 0 calc(100% + min(18vw, 180px));
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 1401px) {
  .other-services-carousel .ks-bento-carousel-slide {
    flex: 0 0 max(100%, 1920px);
  }
}
.ks-bento-carousel-slide .ks-bento-card {
}
.other-services-carousel .ks-bento-carousel-slide.ks-bento {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) minmax(0, 0.9fr) minmax(0, 0.9fr) !important;
}
.other-services-carousel .ks-bento-layout-1 { grid-column: 1 !important; grid-row: 1 / span 2 !important; }
.other-services-carousel .ks-bento-layout-2 { grid-column: 2 !important; grid-row: 1 !important; }
.other-services-carousel .ks-bento-layout-3 { grid-column: 2 !important; grid-row: 2 !important; }
.other-services-carousel .ks-bento-layout-4 { grid-column: 3 !important; grid-row: 1 !important; }
.other-services-carousel .ks-bento-layout-5 { grid-column: 4 !important; grid-row: 1 !important; }
.other-services-carousel .ks-bento-layout-6 { grid-column: 3 / span 2 !important; grid-row: 2 !important; }
.other-services-carousel .ks-bento-card {
  border-color: rgba(47,49,90,0.1);
  box-shadow: none;
}
.other-services-carousel .ks-bento-card.is-empty {
  /* User wants empty cards to be visible as filled shapes to fill negative space */
  border-color: rgba(47,49,90,0.1);
}
.other-services-carousel .ks-bento-card.is-clickable:hover {
  background: #ffffff;
  box-shadow: none !important;
}
.ks-bento-carousel-controls {
  bottom: 1.5rem;
  display: flex;
  gap: 0.65rem;
  justify-content: flex-end;
  position: absolute;
  right: 1.5rem;
  z-index: 10;
}
@media (max-width: 1400px) {
    .other-services-carousel .ks-bento-carousel-track {
      gap: 1rem;
      scroll-snap-type: x mandatory;
      scroll-padding-left: max(0px, calc((100vw - min(85vw, 340px)) / 2));
      touch-action: pan-y;
      cursor: grab;
    }
    .other-services-carousel .ks-bento-carousel-slide {
      display: contents;
    }
    .other-services-carousel .ks-bento-card {
      flex: 0 0 85vw;
      max-width: 340px;
      scroll-snap-align: center;
      scroll-snap-stop: always;
      display: flex !important;
      flex-direction: column !important;
      min-height: 380px !important;
    }
    .other-services-carousel .ks-bento-card .ks-bento-media {
      flex: 1 1 50% !important;
      min-height: 180px !important;
      width: 100% !important;
    }
    .other-services-carousel .ks-bento-card .ks-bento-body {
      flex: 0 0 auto !important;
      padding: 1.25rem !important;
      width: 100% !important;
    }
    .ks-bento-carousel-track:not(.other-services-carousel *) {
      gap: 1rem;
    }
    .ks-bento-carousel-slide:not(.other-services-carousel *) {
      flex-basis: 350%;
    }
  }
`;

export function BentoGrid({ items = [], minItems = 4, imageFor, onOpen, onPreload, className = "" }) {
  const displayItems = normalizeBentoItems(items, minItems);

  return (
    <div className={`ks-bento${className ? ` ${className}` : ""}`}>
      {displayItems.slice(0, minItems).map((item, index) => (
        <BentoCard
          key={item.key || index}
          item={item}
          index={index}
          layoutClass={LAYOUT_CLASSES[index] || ""}
          image={imageFor ? imageFor(item) : item?.image}
          onOpen={onOpen}
          onPreload={onPreload}
          variant="grid"
        />
      ))}
    </div>
  );
}

export function BentoCarousel({
  items = [],
  minItems = 4,
  imageFor,
  onOpen,
  onPreload,
  className = "",
  controlsLabel = "Browse items",
}) {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, startScroll: 0, active: false, dragging: false, locked: null });
  const suppressClickRef = useRef(0);
  const displayItems = normalizeBentoItems(items, minItems);
  const slides = chunkBentoItems(displayItems, minItems);
  const isOtherServices = className.split(/\s+/).includes("other-services-carousel");

  useEffect(() => () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

  const getMobileCardStep = (track) => {
    const card = track.querySelector(".ks-bento-card");
    if (!card) return track.clientWidth * 0.85;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const animateTrackTo = (track, end, duration) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const start = track.scrollLeft;
    const target = Math.max(0, Math.min(max, end));
    const delta = target - start;
    if (Math.abs(delta) < 1) return;

    const startTime = performance.now();
    const easeInOutCubic = (t) => (
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    );

    const tick = (currentTime) => {
      const progress = Math.min(1, (currentTime - startTime) / duration);
      track.scrollLeft = start + delta * easeInOutCubic(progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        track.scrollLeft = target;
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(tick);
  };

  const scrollByBento = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    
    let distance;
    if (window.innerWidth <= 1400) {
      distance = getMobileCardStep(track);
    } else {
      const slide = track.querySelector(".ks-bento-carousel-slide");
      const slideWidth = slide?.getBoundingClientRect().width || track.clientWidth;
      distance = Math.min(track.clientWidth * 0.72, slideWidth * 0.34);
    }
    
    const duration = window.innerWidth <= 1400 ? 420 : 680;
    animateTrackTo(track, track.scrollLeft + direction * distance, duration);
  };

  const handleTouchStart = (event) => {
    if (!isOtherServices || window.innerWidth > 1400) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    touchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      startScroll: trackRef.current?.scrollLeft || 0,
      active: true,
      dragging: false,
      locked: null,
    };
  };

  const handleTouchMove = (event) => {
    if (!isOtherServices || window.innerWidth > 1400 || !touchRef.current.active) return;
    const track = trackRef.current;
    const touch = event.touches?.[0];
    if (!track || !touch) return;
    const dx = touch.clientX - touchRef.current.x;
    const dy = touch.clientY - touchRef.current.y;

    if (!touchRef.current.locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      touchRef.current.locked = Math.abs(dx) > Math.abs(dy) * 1.12 ? "x" : "y";
    }
    if (touchRef.current.locked !== "x") return;

    touchRef.current.dragging = true;
    event.preventDefault();
    track.scrollLeft = touchRef.current.startScroll - dx;
  };

  const handleTouchEnd = (event) => {
    if (!isOtherServices || window.innerWidth > 1400 || !touchRef.current.active) return;
    const track = trackRef.current;
    const touch = event.changedTouches?.[0];
    const wasDragging = touchRef.current.dragging;
    touchRef.current.active = false;
    if (!track || !touch) return;
    const dx = touch.clientX - touchRef.current.x;
    const dy = touch.clientY - touchRef.current.y;
    if (!wasDragging || Math.abs(dx) < 24 || Math.abs(dx) < Math.abs(dy) * 1.05) return;
    suppressClickRef.current = Date.now() + 420;
    event.preventDefault();

    const step = getMobileCardStep(track);
    const direction = dx < 0 ? 1 : -1;
    const target = touchRef.current.startScroll + direction * step;
    animateTrackTo(track, target, 360);
  };

  const handleClickCapture = (event) => {
    if (Date.now() <= suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div
      className={`ks-bento-carousel${className ? ` ${className}` : ""}`}
      onClickCapture={handleClickCapture}
    >
      <style>{BENTO_CAROUSEL_STYLES}</style>
      <div className="ks-bento-carousel-viewport">
        <div
          className="ks-bento-carousel-track"
          ref={trackRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slideItems, slideIndex) => (
            <div className="ks-bento-carousel-slide ks-bento" key={`bento-slide-${slideIndex}`}>
              {slideItems.map((item, index) => (
                <BentoCard
                  key={item.key || `${slideIndex}-${index}`}
                  item={item}
                  index={index}
                  layoutClass={LAYOUT_CLASSES[index] || ""}
                  image={imageFor ? imageFor(item) : item?.image}
                  onOpen={onOpen}
                  onPreload={onPreload}
                  variant="grid"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="ks-bento-carousel-controls" aria-label={controlsLabel}>
        <button type="button" className="ks-carousel-btn" onClick={() => scrollByBento(-1)} aria-label="Previous item">
          <ArrowIcon direction="left" />
        </button>
        <button type="button" className="ks-carousel-btn" onClick={() => scrollByBento(1)} aria-label="Next item">
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
}

function normalizeBentoItems(items, minItems) {
  const displayItems = [...items];
  while (displayItems.length < minItems) {
    displayItems.push({ isEmpty: true, key: `empty-${displayItems.length}` });
  }
  return displayItems;
}

function chunkBentoItems(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(normalizeBentoItems(items.slice(i, i + size), size).slice(0, size));
  }
  return chunks;
}

function ArrowIcon({ direction }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

export function BentoCard({ item, index, layoutClass = "", image, onOpen, onPreload, variant = "grid" }) {
  const isEmpty = item?.isEmpty;
  const linkHref = item?.href || item?.cta?.href;
  const linkTarget = item?.target || item?.cta?.target || "_self";
  const clickable = !isEmpty && !!(item?.route || item?.modal || linkHref);
  const shapeClass = index === 0 || index === 3 ? " is-tall" : " is-wide";

  const handleOpen = (e) => {
    if (clickable && onOpen) {
      handlePreload("high");
      if (linkHref && linkTarget !== "_blank") {
        e?.preventDefault();
        onOpen(item, index);
      } else if (!linkHref) {
        onOpen(item, index);
      }
    }
  };

  const handlePreload = (priority = "low") => {
    if (clickable && onPreload) {
      onPreload(item, index, priority);
    }
  };

  const CardTag = linkHref ? "a" : "article";
  const cardProps = linkHref ? {
    href: linkHref,
    target: linkTarget,
    rel: linkTarget === "_blank" ? "noreferrer" : undefined,
  } : {};

  return (
    <CardTag
      id={item?.modal ? `${item.modal}-card` : undefined}
      className={`ks-bento-card ${layoutClass}${shapeClass}${clickable ? " is-clickable" : ""}${isEmpty ? " is-empty" : ""}`}
      onClick={clickable ? handleOpen : undefined}
      onPointerEnter={clickable ? () => handlePreload("low") : undefined}
      onPointerDown={clickable ? () => handlePreload("high") : undefined}
      onFocus={clickable ? () => handlePreload("low") : undefined}
      onKeyDown={clickable ? (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (!linkHref) {
          event.preventDefault();
          handleOpen(event);
        }
      } : undefined}
      role={clickable && !linkHref ? "button" : undefined}
      tabIndex={clickable && !linkHref ? 0 : undefined}
      aria-hidden={isEmpty ? "true" : undefined}
      {...cardProps}
    >
      <div className="ks-bento-media">
        {image && !isEmpty ? (
          <Img
            src={image}
            alt={item.title}
            className="ks-bento-img"
            protect={false}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="ks-bento-placeholder" />
        )}
      </div>
      <div className="ks-bento-body">
        {!isEmpty && (
          <>
            {item.badge && <span className="ks-bento-badge" style={{ marginBottom: "0.5rem", display: "inline-block", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#80c31e" }}>{item.badge}</span>}
            <h3 className="site-card-title ks-bento-title">{item.title}</h3>
            <p className="site-card-copy ks-bento-copy">{item.desc || item.description}</p>
            {clickable && (
              <span className="ks-learn-more ks-bento-link">
                {item?.cta?.label || "Learn more"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            )}
          </>
        )}
      </div>
    </CardTag>
  );
}

