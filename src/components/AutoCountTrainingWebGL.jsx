import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = 'ztmg4hvro6U';
const THUMB_URL = `https://i.ytimg.com/vi/${YOUTUBE_ID}/sddefault.jpg`;

/**
 * Lusion-inspired scroll-driven video reveal.
 *
 * Performance strategy:
 *  - During scroll animation, a lightweight thumbnail <div> is transformed
 *    (GPU-composited: only transform + opacity, no layout properties).
 *  - The heavy YouTube <iframe> is hidden during animation and only revealed
 *    once the card is mostly expanded (progress > 0.85).
 *  - This avoids compositing an iframe on every scroll frame.
 *
 * Visual effect:
 *  - Dramatic 3D perspective warp (rotateY up to -30°, rotateX, skewY)
 *    peaking at ~40% scroll progress, then flattening out.
 *  - Scale-based sizing (no width/height/left/top animation = no layout thrash).
 */
export default function AutoCountTrainingWebGL() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const thumbRef = useRef(null);
  const iframeWrapRef = useRef(null);
  const rightTextRef = useRef(null);
  const gradientRef = useRef(null);
  const progressRef = useRef(0);

  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const thumb = thumbRef.current;
    const iframeWrap = iframeWrapRef.current;
    const rightText = rightTextRef.current;
    const gradient = gradientRef.current;
    if (!section || !card || !thumb || !rightText) return;

    /* ── Calculate scale factor ─────────────────────────────
     *  Initial card: 38vw wide, 16:9 aspect, positioned at left: 12vw
     *  Final card:   85vw wide, 16:9 aspect, centered
     *  Scale factor = 85 / 38 ≈ 2.237
     *
     *  Initial center X = 12vw + 19vw = 31vw   (left + half-width)
     *  Final center X   = 50vw
     *  Translation X    = 19vw
     *
     *  Initial center Y = 50vh (already centered)
     *  Final center Y   = 50vh (stays centered)
     */
    const scaleFactor = 85 / 38; // ~2.237
    const translateXvw = 50 - (12 + 38 / 2); // 50 - 31 = 19vw

    // Initial states
    gsap.set(gradient, { opacity: 0 });
    gsap.set(iframeWrap, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=180%',
        scrub: 0.8,
        pin: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          // Show iframe only when animation is nearly done (perf)
          if (self.progress > 0.85 && !iframeReady) {
            setIframeReady(true);
          }
          // Show iframe wrap
          if (iframeWrap) {
            iframeWrap.style.opacity = self.progress > 0.82 ? '1' : '0';
          }
        },
      },
    });

    // ── Phase 1: Fade out right text ──
    tl.to(rightText, {
      opacity: 0,
      x: 50,
      duration: 0.25,
      ease: 'power1.in',
    }, 0);

    // ── Phase 2: Scale + translate card to center ──
    // Using ONLY transform properties (GPU-composited, no layout reflow)
    tl.to(card, {
      scale: scaleFactor,
      x: `${translateXvw}vw`,
      borderRadius: '10px',
      duration: 1,
      ease: 'power2.inOut',
      force3D: true,
    }, 0);

    // ── Phase 3: 3D warp — dramatic bend peaking at ~35-40% ──
    // Ramp up
    tl.to(card, {
      rotateY: -28,
      rotateX: 4,
      skewY: 3,
      duration: 0.4,
      ease: 'power2.in',
      force3D: true,
    }, 0);
    // Hold briefly then flatten
    tl.to(card, {
      rotateY: 0,
      rotateX: 0,
      skewY: 0,
      duration: 0.6,
      ease: 'power3.out',
      force3D: true,
    }, 0.4);

    // ── Phase 4: Gradient overlay (sells the depth during warp) ──
    tl.to(gradient, {
      opacity: 0.6,
      duration: 0.35,
      ease: 'power1.in',
    }, 0.05);
    tl.to(gradient, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
    }, 0.45);

    // ── Phase 5: Shadow intensity ──
    tl.to(card, {
      boxShadow: '0 60px 120px rgba(15,17,40,0.35)',
      duration: 0.5,
    }, 0);
    tl.to(card, {
      boxShadow: '0 30px 80px rgba(15,17,40,0.2)',
      duration: 0.5,
    }, 0.5);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, [iframeReady]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#f8f9fc',
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* ── Video Card ── */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '12vw',
          width: '38vw',
          aspectRatio: '16/9',
          borderRadius: '18px',
          overflow: 'hidden',
          background: '#0f1128',
          boxShadow: '0 30px 80px rgba(15,17,40,0.25)',
          zIndex: 2,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          transform: 'translateY(-50%)',
          willChange: 'transform',
        }}
      >
        {/* Thumbnail — lightweight, always visible, used during animation */}
        <div
          ref={thumbRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${THUMB_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0f1128',
            zIndex: 1,
          }}
        />

        {/* Gradient overlay for warp depth effect */}
        <div
          ref={gradientRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(115deg, rgba(100,50,220,0.7) 0%, rgba(200,60,120,0.5) 50%, rgba(60,40,180,0.7) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: 0,
          }}
        />

        {/* YouTube iframe — only mounted when animation is nearly done */}
        <div
          ref={iframeWrapRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {iframeReady && (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
              title="Learn AutoCount Accounting in 60 Minutes"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          )}
        </div>
      </div>

      {/* ── Right Side Text ── */}
      <div
        ref={rightTextRef}
        style={{
          position: 'absolute',
          top: '50%',
          right: '5vw',
          width: '38vw',
          transform: 'translateY(-50%)',
          zIndex: 3,
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#c9a84c',
            marginBottom: '0.6rem',
          }}
        >
          Free Training
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
            fontWeight: 700,
            color: '#2f315a',
            lineHeight: 1.2,
            marginBottom: '0.9rem',
          }}
        >
          Learn AutoCount Accounting in Just 60 Minutes
        </h2>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#6b6f91',
            lineHeight: 1.8,
            maxWidth: 480,
            marginBottom: '1.5rem',
          }}
        >
          Skip the long manuals. AutoCount's 60-minute guide covers
          everything you need to know to navigate AutoCount Accounting
          with confidence — from basic setup to daily transactions.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href={`https://youtu.be/${YOUTUBE_ID}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#2f315a',
              color: '#ffffff',
              padding: '0.75rem 1.75rem',
              borderRadius: 50,
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#3d4075')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#2f315a')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Watch on YouTube
          </a>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.82rem',
              color: '#a8abcc',
              fontWeight: 500,
            }}
          >
            Free · 60 min
          </span>
        </div>
      </div>
    </section>
  );
}
