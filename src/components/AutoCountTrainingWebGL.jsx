import React, { useState } from 'react';

const YOUTUBE_ID = 'ztmg4hvro6U';

export default function AutoCountTrainingWebGL() {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        background: '#f8f9fc',
        padding: '5rem 0',
      }}
    >
      <div className="content-wrap">
        {showIframe ? (
          // Layout 2: Active Video
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.6rem',
              }}>
                Free Training
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
                color: '#2f315a', lineHeight: 1.2,
              }}>
                Learn AutoCount Accounting in Just 60 Minutes
              </h2>
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
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Learn AutoCount Accounting in 60 Minutes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        ) : (
          // Layout 1: Idle state
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3rem', 
              flexWrap: 'wrap',
            }}
          >
            {/* Video Card (Left) */}
            <div
              style={{
                flex: '1 1 500px',
                aspectRatio: '16/9',
                borderRadius: '18px',
                overflow: 'hidden',
                background: '#0f1128',
                boxShadow: '0 20px 60px rgba(15,17,40,0.12)',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => setShowIframe(true)}
            >
              <img
                src={`https://i.ytimg.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
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

            {/* Right Side Text */}
            <div style={{ flex: '1 1 360px', minWidth: 0 }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.6rem',
              }}>
                Free Training
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
                color: '#2f315a', lineHeight: 1.2, marginBottom: '1rem',
              }}>
                Learn AutoCount Accounting in Just 60 Minutes
              </h2>
              <p style={{
                fontSize: '0.95rem', color: '#6b6f91', lineHeight: 1.8,
                maxWidth: 480, marginBottom: '1.5rem',
              }}>
                Skip the long manuals. AutoCount's 60-minute guide covers
                everything you need to know to navigate AutoCount Accounting
                with confidence — from basic setup to daily transactions.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowIframe(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: '#2f315a', color: '#fff', padding: '0.75rem 1.75rem',
                    borderRadius: 50, fontSize: '0.88rem', fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                  }}
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
        )}
      </div>
    </section>
  );
}
