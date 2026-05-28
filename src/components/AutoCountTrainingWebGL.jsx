import React, { useEffect, useRef, useState } from 'react';

const VIDEOS = [
  {
    id: 'ztmg4hvro6U',
    playlistId: 'PLuc8uVTiaUHO9pW9dW0vUgHDZOtzXuB2E',
    label: 'General Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'dA9fzUg6OYU',
    playlistId: 'PLuc8uVTiaUHMTeJC2qWOJHE7QIxBmDSTx',
    label: 'e-Invoice Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  {
    id: 'vFu1AgUT5rg',
    playlistId: 'PLuc8uVTiaUHO_rwRqZJPDmE7lRhwx_MS0',
    label: 'SST Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="17" r="1"/><line x1="14" y1="13" x2="10" y2="17"/></svg>
  }
];

const MORPH_OPEN_MS = 2400;
const MORPH_CLOSE_MS = 1900;
const APPLE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const getThumbnailUrl = (videoId) => `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

function preloadImage(src) {
  if (typeof window === 'undefined') return;
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.src = src;
}

function toPlainRect(rect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function constrain(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getExpandedRect(sourceRect, contentWrap) {
  const isMobile = window.innerWidth <= 760;
  const margin = isMobile ? 8 : 28;
  const wrapRect = contentWrap?.getBoundingClientRect();
  const maxWidth = isMobile
    ? window.innerWidth - margin * 2
    : Math.min(
      wrapRect?.width || window.innerWidth - margin * 2,
      window.innerWidth - margin * 2
    );
  const maxHeight = window.innerHeight - margin * 2;
  let width = Math.max(280, maxWidth);
  let height = width * 9 / 16;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * 16 / 9;
  }

  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const left = constrain(sourceCenterX - width / 2, margin, window.innerWidth - width - margin);
  const top = constrain(sourceCenterY - height / 2, margin, window.innerHeight - height - margin);

  return { left, top, width, height };
}

function MorphingTutorialPreview({ direction, videoId, startRect, endRect, onComplete }) {
  const [active, setActive] = useState(false);
  const duration = direction === 'open' ? MORPH_OPEN_MS : MORPH_CLOSE_MS;
  const startCenterX = startRect.left + startRect.width / 2;
  const startCenterY = startRect.top + startRect.height / 2;
  const endCenterX = endRect.left + endRect.width / 2;
  const endCenterY = endRect.top + endRect.height / 2;
  const initialTransform = `translate3d(${startCenterX - endCenterX}px, ${startCenterY - endCenterY}px, 0) scale(${startRect.width / endRect.width}, ${startRect.height / endRect.height})`;
  const borderRadius = direction === 'open'
    ? (active ? 18 : 30)
    : (active ? 30 : 18);
  const screenInset = direction === 'open'
    ? (active ? '0%' : '3.5%')
    : (active ? '3.5%' : '0%');
  const screenRadius = direction === 'open'
    ? (active ? 18 : 12)
    : (active ? 12 : 18);
  const shellTransform = direction === 'open'
    ? (active
      ? 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)'
      : `${initialTransform} perspective(1200px) rotateX(7deg) rotateY(-6deg)`)
    : (active
      ? 'translate3d(0, 0, 0) scale(1, 1) perspective(1200px) rotateX(7deg) rotateY(-6deg)'
      : initialTransform);

  useEffect(() => {
    let rafOne = 0;
    let rafTwo = 0;
    const timer = window.setTimeout(onComplete, duration + 120);

    rafOne = window.requestAnimationFrame(() => {
      rafTwo = window.requestAnimationFrame(() => setActive(true));
    });

    return () => {
      window.cancelAnimationFrame(rafOne);
      window.cancelAnimationFrame(rafTwo);
      window.clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className="tutorial-morph-overlay"
      aria-hidden="true"
    >
      <div
        className="tutorial-morph-shell"
        data-direction={direction}
        data-active={active ? 'true' : 'false'}
        style={{
          left: `${endRect.left}px`,
          top: `${endRect.top}px`,
          width: `${endRect.width}px`,
          height: `${endRect.height}px`,
          borderRadius: `${borderRadius}px`,
          transform: shellTransform,
          '--morph-duration': `${duration}ms`,
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: APPLE_EASE,
        }}
      >
        <div
          className="tutorial-morph-screen"
          style={{
            inset: screenInset,
            borderRadius: `${screenRadius}px`,
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: APPLE_EASE,
          }}
        >
          <img
            className="tutorial-morph-image"
            src={getThumbnailUrl(videoId)}
            alt=""
            decoding="async"
            crossOrigin="anonymous"
          />
          <div className="tutorial-morph-dim" />
          <div className="tutorial-morph-play">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#2f315a">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AutoCountTrainingWebGL() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0].id);
  const [showIframe, setShowIframe] = useState(false);
  const [morph, setMorph] = useState(null);
  const tabletRef = useRef(null);
  const videoRef = useRef(null);
  const videoFrameRef = useRef(null);
  const sectionRef = useRef(null);
  const contentWrapRef = useRef(null);
  const lastTabletRectRef = useRef(null);

  useEffect(() => {
    preloadImage(getThumbnailUrl(activeVideo));
  }, [activeVideo]);

  const completeMorph = () => {
    const currentMorph = morph;
    if (!currentMorph) return;

    setMorph(null);

    if (currentMorph.direction === 'open') {
      setShowIframe(true);
      window.requestAnimationFrame(() => {
        if (videoRef.current) {
          const y = videoRef.current.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
      return;
    }

    setShowIframe(false);
    window.requestAnimationFrame(() => {
      if (sectionRef.current) {
        const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  const handlePlay = () => {
    if (morph) return;
    const tabletRect = tabletRef.current?.getBoundingClientRect();
    if (!tabletRect) {
      setShowIframe(true);
      return;
    }

    const startRect = toPlainRect(tabletRect);
    const endRect = getExpandedRect(startRect, contentWrapRef.current);
    lastTabletRectRef.current = startRect;
    preloadImage(getThumbnailUrl(activeVideo));
    setShowIframe(false);
    setMorph({ direction: 'open', videoId: activeVideo, startRect, endRect });
  };

  const handleClose = () => {
    if (morph) return;
    const startSource = videoFrameRef.current || videoRef.current;
    const startDomRect = startSource?.getBoundingClientRect();
    if (!startDomRect) {
      setShowIframe(false);
      return;
    }

    const startRect = toPlainRect(startDomRect);
    const fallbackWidth = Math.min(startRect.width * 0.42, 560);
    const fallbackHeight = fallbackWidth * 3 / 4;
    const endRect = lastTabletRectRef.current || {
      left: startRect.left + startRect.width / 2 - fallbackWidth / 2,
      top: startRect.top + startRect.height / 2 - fallbackHeight / 2,
      width: fallbackWidth,
      height: fallbackHeight,
    };

    setMorph({ direction: 'close', videoId: activeVideo, startRect, endRect });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        background: 'transparent',
        padding: 'var(--section-py) 0',
      }}
    >
      <style>{`
        .training-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: center; }
        @media (max-width: 760px) { .training-grid { grid-template-columns: 1fr; gap: 1.5rem; } }
        @keyframes videoExpand {
          from { opacity: 0; transform: scale(0.985) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ipad-frame {
          aspect-ratio: 4/3;
          border-radius: 28px;
          background: #111;
          box-sizing: border-box;
          padding: 3.5%;
          box-shadow: 0 24px 60px rgba(15,17,40,0.2), inset 0 0 0 2px #2a2a2a, inset 0 0 12px rgba(0,0,0,1);
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: stretch;
          transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ipad-frame:hover {
          transform: scale(1.018);
        }
        .tutorial-morph-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: auto;
          contain: layout style paint;
        }
        .tutorial-morph-shell {
          position: fixed;
          overflow: hidden;
          background: #0f1128;
          box-shadow:
            0 34px 90px rgba(15,17,40,0.32),
            0 12px 28px rgba(15,17,40,0.18),
            inset 0 0 0 1px rgba(255,255,255,0.08);
          transform-origin: center;
          backface-visibility: hidden;
          will-change: border-radius, transform, box-shadow, filter;
          transition-property: border-radius, transform, box-shadow, filter;
        }
        .tutorial-morph-shell[data-active="true"] {
          box-shadow:
            0 42px 110px rgba(15,17,40,0.22),
            0 12px 34px rgba(15,17,40,0.16),
            inset 0 0 0 1px rgba(255,255,255,0.04);
        }
        .tutorial-morph-shell::before {
          content: "";
          position: absolute;
          inset: -30%;
          z-index: 3;
          background:
            linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.2) 42%, transparent 58%),
            radial-gradient(circle at 28% 18%, rgba(255,255,255,0.2), transparent 24%);
          opacity: 0.8;
          transform: translateX(-30%) rotate(2deg);
          transition: transform var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease;
          pointer-events: none;
        }
        .tutorial-morph-shell[data-active="true"]::before {
          opacity: 0.3;
          transform: translateX(26%) rotate(2deg);
        }
        .tutorial-morph-screen {
          position: absolute;
          overflow: hidden;
          background: #0f1128;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
          transition-property: inset, border-radius, box-shadow;
        }
        .tutorial-morph-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.045);
          transition: transform var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1), filter var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1);
          filter: saturate(0.95) contrast(0.98);
        }
        .tutorial-morph-shell[data-active="true"] .tutorial-morph-image {
          transform: scale(1);
          filter: saturate(1) contrast(1);
        }
        .tutorial-morph-dim {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.28);
          transition: background var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tutorial-morph-shell[data-active="true"] .tutorial-morph-dim {
          background: rgba(0,0,0,0.12);
        }
        .tutorial-morph-play {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          padding-left: 4px;
          border-radius: 50%;
          background: #e8c97a;
          box-shadow: 0 12px 30px rgba(232,201,122,0.32);
          transform: translate(-50%, -50%) scale(0.92);
          opacity: 0.92;
          transition: transform var(--morph-duration, 4200ms) cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease;
        }
        .tutorial-morph-shell[data-active="true"] .tutorial-morph-play {
          transform: translate(-50%, -50%) scale(0.74);
          opacity: 0;
        }
        @media (max-width: 760px) {
          .ipad-frame {
            aspect-ratio: 16/9;
            padding: 0;
            background: transparent;
            box-shadow: 0 10px 30px rgba(15,17,40,0.1);
            border-radius: 12px;
          }
          .ipad-frame:hover { transform: none; }
          .tutorial-morph-play {
            width: 54px;
            height: 54px;
          }
        }
      `}</style>
      <div className="content-wrap" ref={contentWrapRef}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: '#2f315a', lineHeight: 1.2, margin: 0,
          }}>
            Learn AutoCount Accounting in Just 60 Minutes
          </h2>
        </div>

        {showIframe ? (
          <div
            ref={videoRef}
            style={{
              width: '100%',
              opacity: morph?.direction === 'close' ? 0 : 1,
              animation: 'videoExpand 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={handleClose}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(47, 49, 90, 0.08)', color: '#2f315a', padding: '0.45rem 1.1rem',
                  borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(47, 49, 90, 0.15)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(47, 49, 90, 0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                Minimize
              </button>
            </div>

            <div
              ref={videoFrameRef}
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '18px',
                overflow: 'hidden',
                background: '#0f1128',
                boxShadow: '0 20px 60px rgba(15,17,40,0.12)',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1${VIDEOS.find(v => v.id === activeVideo)?.playlistId ? '&list=' + VIDEOS.find(v => v.id === activeVideo).playlistId : ''}`}
                title="AutoCount Training Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="training-grid">
              <div>
                <div
                  ref={tabletRef}
                  className="ipad-frame"
                  onClick={handlePlay}
                  style={{ opacity: morph?.direction === 'open' ? 0 : 1 }}
                >
                  <div style={{
                    flex: 1,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#0f1128',
                    position: 'relative',
                  }}>
                    <img
                      src={getThumbnailUrl(activeVideo)}
                      alt="AutoCount Tutorial"
                      loading="lazy"
                      crossOrigin="anonymous"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'grid', placeItems: 'center' }}>
                      <div style={{
                        width: 64, height: 64, background: '#e8c97a', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(232,201,122,0.4)',
                        paddingLeft: 4
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#2f315a">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '1.25rem',
                  background: '#2f315a',
                  borderRadius: '20px',
                  padding: '6px',
                  display: 'flex',
                  gap: '6px'
                }}>
                  {VIDEOS.map(v => {
                    const isActive = activeVideo === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setActiveVideo(v.id)}
                        style={{
                          flex: 1,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                          padding: '12px 4px',
                          background: isActive ? '#f5f5f8' : 'transparent',
                          color: isActive ? '#1c1e36' : 'rgba(255,255,255,0.7)',
                          border: 'none', borderRadius: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {v.icon}
                        <span style={{ fontSize: '0.72rem', fontWeight: isActive ? 700 : 500, textAlign: 'center', lineHeight: 1.1 }}>
                          {v.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ transform: 'translateY(-1rem)' }}>
                <p style={{
                  fontSize: '0.95rem', color: '#6b6f91', lineHeight: 1.8,
                  maxWidth: 480, marginBottom: '1.5rem', marginTop: 0,
                }}>
                  Skip the long manuals. AutoCount's 60-minute guide covers
                  everything you need to know to navigate AutoCount Accounting
                  with confidence - from basic setup to daily transactions.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handlePlay}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      background: '#2f315a', color: '#fff', padding: '0.75rem 1.75rem',
                      borderRadius: 50, fontSize: '0.88rem', fontWeight: 600,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'background 0.2s, transform 0.2s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#3e4175'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#2f315a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Watch on Youtube
                  </button>
                  <span style={{ fontSize: '0.82rem', color: '#a8abcc', fontWeight: 500 }}>
                    Free - 60 minutes
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {morph && (
        <MorphingTutorialPreview
          key={`${morph.direction}-${morph.videoId}`}
          direction={morph.direction}
          videoId={morph.videoId}
          startRect={morph.startRect}
          endRect={morph.endRect}
          onComplete={completeMorph}
        />
      )}
    </section>
  );
}
