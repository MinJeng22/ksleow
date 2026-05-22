import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const YOUTUBE_ID = 'ztmg4hvro6U';

/**
 * Lusion-style scroll-driven video reveal.
 * Uses pure CSS transforms + GSAP (no WebGL) for maximum compatibility.
 *
 * Flow:
 *  1. Initial: small rounded video card on the left, text on the right.
 *  2. On scroll: text fades out, video card stretches to fill the viewport
 *     with a 3D perspective warp (CSS perspective + rotateY).
 *  3. Final: video fills screen, "PLAY" / "REEL" overlay fades in with a
 *     centered play button. Clicking plays the YouTube video inline.
 */
export default function AutoCountTrainingWebGL() {
  const sectionRef = useRef(null);
  const videoCardRef = useRef(null);
  const rightTextRef = useRef(null);
  const playWordRef = useRef(null);
  const reelWordRef = useRef(null);
  const playCircleRef = useRef(null);
  const iframeWrapRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const videoCard = videoCardRef.current;
    const rightText = rightTextRef.current;
    const playWord = playWordRef.current;
    const reelWord = reelWordRef.current;
    const playCircle = playCircleRef.current;
    const iframeWrap = iframeWrapRef.current;
    if (!section || !videoCard || !rightText) return;

    // Set initial states for overlay elements
    gsap.set([playWord, reelWord], { opacity: 0, y: 40 });
    gsap.set(playCircle, { opacity: 0, scale: 0 });
    gsap.set(iframeWrap, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
      },
    });

    // ─── Phase 1 (0 → 0.4): Fade out text, begin video card growth ───
    tl.to(rightText, {
      opacity: 0,
      x: 60,
      duration: 0.35,
      ease: 'power1.in',
    }, 0);

    // Video card: grow from initial size to full viewport
    // Initial state is set via CSS; we animate to the final state.
    tl.to(videoCard, {
      width: '96vw',
      height: '92vh',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      borderRadius: '24px',
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // 3D warp effect during the middle of the transition
    tl.fromTo(videoCard, {
      rotateY: 0,
      rotateX: 0,
    }, {
      rotateY: -12,
      rotateX: 3,
      duration: 0.5,
      ease: 'power2.in',
    }, 0);

    tl.to(videoCard, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.5);

    // ─── Phase 2 (0.5 → 1.0): Show overlay text ───
    tl.to(playWord, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.55);

    tl.to(reelWord, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.6);

    tl.to(playCircle, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
    }, 0.65);

    // Fade in the iframe overlay (hidden behind play button until clicked)
    tl.to(iframeWrap, {
      opacity: 1,
      duration: 0.3,
    }, 0.7);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#f8f9fc',
          perspective: '1200px',
        }}
      >
        {/* ── Video Card (CSS-animated) ── */}
        <div
          ref={videoCardRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '12vw',
            transform: 'translateY(-50%)',
            width: '38vw',
            height: '55vh',
            borderRadius: '18px',
            overflow: 'hidden',
            background: '#0f1128',
            boxShadow: '0 30px 80px rgba(15,17,40,0.25)',
            zIndex: 2,
            transformStyle: 'preserve-3d',
            willChange: 'transform, width, height, left, top, border-radius',
          }}
        >
          {/* YouTube embed — always loaded, plays inline */}
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
            title="Learn AutoCount Accounting in 60 Minutes"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
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

        {/* ── Overlay: PLAY ● REEL ── */}
        <div
          ref={iframeWrapRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3vw',
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          <div
            ref={playWordRef}
            style={{
              fontSize: 'clamp(4rem, 12vw, 14rem)',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              userSelect: 'none',
            }}
          >
            PLAY
          </div>

          <button
            ref={playCircleRef}
            onClick={handlePlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'clamp(60px, 10vw, 140px)',
              height: 'clamp(60px, 10vw, 140px)',
              borderRadius: '50%',
              background: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              flexShrink: 0,
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
              transition: 'transform 0.25s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <svg
              width="28%"
              height="28%"
              viewBox="0 0 24 24"
              fill="#111"
              style={{ marginLeft: '4%' }}
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>

          <div
            ref={reelWordRef}
            style={{
              fontSize: 'clamp(4rem, 12vw, 14rem)',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              userSelect: 'none',
            }}
          >
            REEL
          </div>
        </div>
      </section>

      {/* ── Fullscreen Video Modal ── */}
      {isPlaying && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(15,17,40,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              zIndex: 100000,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            ✕
          </button>
          <div
            style={{
              width: '90vw',
              maxWidth: 1200,
              aspectRatio: '16/9',
              background: '#000',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
              title="AutoCount Training"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
