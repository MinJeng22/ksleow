import { useEffect, useRef, useState } from "react";
import CarouselProgress from "./CarouselProgress.jsx";
import { Img } from "./Media.jsx";

export default function FeatureShowcase({
  features,
  id = "features",
  className = "",
  sectionStyle,
  cardDelayMs = 90,
  brandLogos,
  brandText,
  wrapper = false,
  wrapperStyle,
  promoSlides = [],
  carouselDurationMs = 5200,
  carouselTone = "light",
}) {
  const gridRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const slides = [{ type: "features", title: "Feature highlights" }, ...promoSlides.map((slide) => ({ type: "promo", ...slide }))];
  const hasCarousel = slides.length > 1;

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.24 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasCarousel || !isCarouselPlaying) return undefined;
    const timer = window.setTimeout(() => {
      setActiveSlide((index) => (index + 1) % slides.length);
    }, carouselDurationMs);
    return () => window.clearTimeout(timer);
  }, [activeSlide, carouselDurationMs, hasCarousel, isCarouselPlaying, slides.length]);

  const goToSlide = (index) => {
    setActiveSlide(((index % slides.length) + slides.length) % slides.length);
  };

  const content = (
    <div
      id={id}
      className={`ac-section-tight ac-features-showcase${className ? ` ${className}` : ""}`}
      style={{ scrollMarginTop: 24, position: "relative", zIndex: 1, ...sectionStyle }}
    >
      <div className="content-wrap">
        <div className={hasCarousel ? "feature-showcase-carousel" : ""}>
          <div
            className={hasCarousel ? "feature-showcase-track" : ""}
          >
            {slides.map((slide, slideIndex) => (
              <div
                key={slide.type === "features" ? "features" : slide.src}
                className={hasCarousel ? `feature-showcase-slide${slideIndex === activeSlide ? " is-active" : ""}` : ""}
                style={hasCarousel && slideIndex !== activeSlide ? { display: "none" } : undefined}
                aria-hidden={hasCarousel && slideIndex !== activeSlide}
              >
                {slide.type === "features" ? (
                  <div ref={gridRef} className={`ac-features-grid${inView ? " is-in-view" : ""}`}>
                    {(features || []).map((feature, index) => (
                      <article
                        key={feature.title}
                        className="ac-feature-card"
                        style={{ "--feature-delay": `${index * cardDelayMs}ms` }}
                      >
                        <span className="ac-feature-copy" style={{ position: "relative", zIndex: 2 }}>
                          <span className="ac-feature-title" style={feature.icon ? { display: "flex", alignItems: "center", gap: "0.5rem" } : undefined}>
                            {feature.icon && (
                              <img src={feature.icon} alt="" style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0 }} />
                            )}
                            {feature.title}
                          </span>
                          <span className="ac-feature-desc">{feature.desc}</span>
                        </span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <figure className="feature-showcase-promo">
                    <Img
                      src={slide.src}
                      alt={slide.alt || ""}
                      className="feature-showcase-promo-img"
                      priority={slideIndex === 1}
                      protect={false}
                    />
                    {(slide.title || slide.caption) && (
                      <figcaption className="feature-showcase-promo-caption">
                        {slide.title && <span className="feature-showcase-promo-title">{slide.title}</span>}
                        {slide.caption && <span className="feature-showcase-promo-copy">{slide.caption}</span>}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>
            ))}
          </div>

          {hasCarousel && (
            <>
              <button
                type="button"
                className="feature-showcase-nav feature-showcase-nav-prev"
                onClick={() => goToSlide(activeSlide - 1)}
                aria-label="Previous feature slide"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="feature-showcase-nav feature-showcase-nav-next"
                onClick={() => goToSlide(activeSlide + 1)}
                aria-label="Next feature slide"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {hasCarousel && (
          <CarouselProgress
            count={slides.length}
            activeIndex={activeSlide}
            visibleCount={1}
            isPlaying={isCarouselPlaying}
            durationMs={carouselDurationMs}
            tone={carouselTone}
            showPlayToggle
            onTogglePlay={() => setIsCarouselPlaying((playing) => !playing)}
            onSelect={goToSlide}
            getTitle={(index) => slides[index]?.title || `Feature slide ${index + 1}`}
            playLabel="Start feature carousel"
            pauseLabel="Pause feature carousel"
            className="feature-showcase-progress"
          />
        )}

        {brandLogos?.length > 0 && (
          <div style={{ marginTop: "2rem", position: "relative" }}>
            {brandText && (
              <p style={{
                textAlign: "center",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#6b6f91",
                textTransform: "uppercase",
                marginBottom: "2.5rem",
              }}>
                {brandText}
              </p>
            )}
            <div
              className="ac-brand-marquee-container"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                cursor: "pointer",
              }}
              onClick={() => setIsMarqueePaused((paused) => !paused)}
            >
              <div className="ac-brand-marquee" style={{ animationPlayState: isMarqueePaused ? "paused" : "running" }}>
                {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((src, index) => (
                  <div key={`${src}-${index}`} className="ac-brand-item">
                    <img src={src} alt="Brand logo" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!wrapper) return content;

  return (
    <div className="ac-section-wrapper" style={{ background: "#ffffff", ...wrapperStyle }}>
      <div className="ac-container">
        {content}
      </div>
    </div>
  );
}
