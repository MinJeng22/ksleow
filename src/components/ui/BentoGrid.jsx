import { useRef } from "react";
import { Img } from "../Media.jsx";

const LAYOUT_CLASSES = [
  "ks-bento-left",
  "ks-bento-mid-top",
  "ks-bento-mid-bottom",
  "ks-bento-right",
];

const BENTO_CAROUSEL_STYLES = `
.ks-bento-carousel {
  position: relative;
  padding-bottom: 4.25rem;
}
.ks-bento-carousel-viewport {
  margin-right: calc(-1 * min(4vw, 3rem));
  overflow: hidden;
}
.ks-bento-carousel-track {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding: 0 min(4vw, 3rem) 1rem 0;
  scroll-behavior: smooth;
  scroll-padding-left: 0;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.ks-bento-carousel-track::-webkit-scrollbar {
  display: none;
}
.ks-bento-card.is-carousel {
  display: grid;
  flex: 0 0 calc((100% - 2.5rem) / 3.18);
  grid-template-rows: 56% 44%;
  min-height: 520px;
  scroll-snap-align: start;
}
.ks-bento-carousel-controls {
  bottom: 0;
  display: flex;
  gap: 0.65rem;
  justify-content: flex-end;
  position: absolute;
  right: 0;
}
.ks-bento-carousel-btn {
  align-items: center;
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(47,49,90,0.14);
  border-radius: 999px;
  box-shadow: 0 16px 38px rgba(47,49,90,0.1);
  color: #2f315a;
  cursor: pointer;
  display: inline-flex;
  height: 46px;
  justify-content: center;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
  width: 46px;
}
.ks-bento-carousel-btn:hover {
  border-color: rgba(201,168,76,0.55);
  box-shadow: 0 20px 44px rgba(47,49,90,0.14);
  transform: translateY(-2px);
}
.ks-bento-carousel-btn:focus-visible {
  outline: 2px solid rgba(201,168,76,0.72);
  outline-offset: 4px;
}
@media (max-width: 1180px) {
  .ks-bento-card.is-carousel {
    flex-basis: calc((100% - 1.25rem) / 2.18);
    min-height: 430px;
  }
}
@media (max-width: 640px) {
  .ks-bento-carousel {
    padding-bottom: 3.75rem;
  }
  .ks-bento-carousel-viewport {
    margin-right: -1rem;
  }
  .ks-bento-carousel-track {
    gap: 1rem;
    padding-right: 1rem;
  }
  .ks-bento-card.is-carousel {
    flex-basis: 84%;
    min-height: 360px;
  }
  .ks-bento-carousel-btn {
    height: 42px;
    width: 42px;
  }
}
`;

export function BentoGrid({ items = [], minItems = 4, imageFor, onOpen, className = "" }) {
  const displayItems = normalizeBentoItems(items, minItems);

  return (
    <div className={`ks-bento${className ? ` ${className}` : ""}`}>
      {displayItems.slice(0, minItems).map((item, index) => (
        <BentoCard
          key={item.key || index}
          item={item}
          index={index}
          layoutClass={LAYOUT_CLASSES[index] || ""}
          image={imageFor?.(item)}
          onOpen={onOpen}
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
  className = "",
  controlsLabel = "Browse items",
}) {
  const trackRef = useRef(null);
  const displayItems = normalizeBentoItems(items, minItems);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".ks-bento-card");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.72;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <div className={`ks-bento-carousel${className ? ` ${className}` : ""}`}>
      <style>{BENTO_CAROUSEL_STYLES}</style>
      <div className="ks-bento-carousel-viewport">
        <div className="ks-bento-carousel-track" ref={trackRef}>
          {displayItems.map((item, index) => (
            <BentoCard
              key={item.key || index}
              item={item}
              index={index}
              image={imageFor?.(item)}
              onOpen={onOpen}
              variant="carousel"
            />
          ))}
        </div>
      </div>
      <div className="ks-bento-carousel-controls" aria-label={controlsLabel}>
        <button type="button" className="ks-bento-carousel-btn" onClick={() => scrollByCard(-1)} aria-label="Previous item">
          <ArrowIcon direction="left" />
        </button>
        <button type="button" className="ks-bento-carousel-btn" onClick={() => scrollByCard(1)} aria-label="Next item">
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

function ArrowIcon({ direction }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

export function BentoCard({ item, index, layoutClass = "", image, onOpen, variant = "grid" }) {
  const isEmpty = item?.isEmpty;
  const clickable = !isEmpty && !!(item?.route || item?.modal || item?.href);
  const shapeClass = variant === "carousel"
    ? " is-carousel"
    : (index === 0 || index === 3 ? " is-tall" : " is-wide");

  const handleOpen = () => {
    if (clickable) onOpen?.(item, index);
  };

  return (
    <article
      id={item?.modal ? `${item.modal}-card` : undefined}
      className={`ks-bento-card ${layoutClass}${shapeClass}${clickable ? " is-clickable" : ""}${isEmpty ? " is-empty" : ""}`}
      onClick={clickable ? handleOpen : undefined}
      onKeyDown={clickable ? (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleOpen();
      } : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-hidden={isEmpty ? "true" : undefined}
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
            <h3 className="site-card-title ks-bento-title">{item.title}</h3>
            <p className="site-card-copy ks-bento-copy">{item.desc}</p>
            {clickable && (
              <span className="ks-learn-more ks-bento-link">
                Learn more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            )}
          </>
        )}
      </div>
    </article>
  );
}
