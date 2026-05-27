import React, { useState, useRef } from 'react';

const VIDEOS = [
  {
    id: 'ztmg4hvro6U',
    label: 'General Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'dA9fzUg6OYU',
    label: 'e-Invoice',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  {
    id: 'vFu1AgUT5rg',
    label: 'SST Tutorial',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="17" r="1"/><line x1="14" y1="13" x2="10" y2="17"/></svg>
  }
];

export default function AutoCountTrainingWebGL() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0].id);
  const [showIframe, setShowIframe] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const handlePlay = () => {
    setShowIframe(true);
    setTimeout(() => {
      if (videoRef.current) {
        const y = videoRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleClose = () => {
    setIsClosing(true);
    if (sectionRef.current) {
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setTimeout(() => {
      setShowIframe(false);
      setIsClosing(false);
    }, 400);
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
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes videoShrink {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(20px); }
        }
        .ipad-frame {
          aspect-ratio: 4/3;
          border-radius: 28px;
          background: #111;
          padding: 2.5% 3.5%;
          box-shadow: 0 24px 60px rgba(15,17,40,0.2), inset 0 0 0 2px #2a2a2a, inset 0 0 12px rgba(0,0,0,1);
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: stretch;
          transition: transform 0.3s ease;
        }
        .ipad-frame:hover {
          transform: scale(1.02);
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
        }
      `}</style>
      <div className="content-wrap">
        {/* ── Header — always visible, always centred ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>

          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: '#2f315a', lineHeight: 1.2, margin: 0,
          }}>
            Learn AutoCount Accounting in Just 60 Minutes
          </h2>
        </div>

        {showIframe ? (
          /* ── Layout 2: Full-width video after clicking play ── */
          <div
            ref={videoRef}
            style={{
              width: '100%',
              animation: isClosing 
                ? 'videoShrink 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                : 'videoExpand 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
                title="AutoCount Training Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        ) : (
          /* ── Layout 1: Video thumbnail (left) + description (right) ── */
          <>
            <div className="training-grid">
              {/* iPad Frame Wrapper */}
              <div>
                <div
                  className="ipad-frame"
                onClick={handlePlay}
              >
                {/* iPad Screen */}
                <div style={{
                  flex: 1,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#0f1128',
                  position: 'relative',
                }}>
                  <img
                    src={`https://i.ytimg.com/vi/${activeVideo}/maxresdefault.jpg`}
                    alt="AutoCount Tutorial"
                    loading="lazy"
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

              {/* Video Selector Buttons */}
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

              {/* Description text */}
              <div style={{ transform: 'translateY(-1rem)' }}>
                <p style={{
                  fontSize: '0.95rem', color: '#6b6f91', lineHeight: 1.8,
                  maxWidth: 480, marginBottom: '1.5rem', marginTop: 0,
                }}>
                  Skip the long manuals. AutoCount's 60-minute guide covers
                  everything you need to know to navigate AutoCount Accounting
                  with confidence — from basic setup to daily transactions.
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
                    Free · 60 minutes
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
