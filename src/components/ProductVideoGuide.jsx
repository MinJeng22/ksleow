import React, { useEffect, useMemo, useRef, useState } from "react";
import CarouselProgress from "./CarouselProgress.jsx";
import StepRow from "./StepRow.jsx";
import { Vid } from "./Media.jsx";

export default function ProductVideoGuide({
  segments,
  accentColor = "#c9a84c",
  darkColor = "#2f315a",
  bodyColor = "#6b6f91",
  loadingLabel = "Loading Video...",
  autoAdvanceMs = 0,
}) {
  const videoSegments = segments || [];
  const groups = useMemo(() => {
    const items = [];
    videoSegments.forEach((segment, index) => {
      const label = segment.group || segment.title;
      const last = items[items.length - 1];
      if (last?.label === label) {
        last.range[1] = index;
        return;
      }
      items.push({ label, start: index, range: [index, index] });
    });
    return items;
  }, [videoSegments]);

  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState("a");
  const [paused, setPaused] = useState(false);
  const [videoRemaining, setVideoRemaining] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const aRef = useRef(null);
  const bRef = useRef(null);
  const containerRef = useRef(null);
  const guideRef = useRef(null);
  const idxRef = useRef(0);
  const activeRef = useRef("a");
  const busyRef = useRef(false);
  const videoRemainingRef = useRef(1);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const autoStartRef = useRef(0);
  const hasEnteredViewRef = useRef(false);

  idxRef.current = idx;
  activeRef.current = active;

  const ensureSrc = (vid, src) => {
    if (!vid || !src) return;
    const want = new URL(src, window.location.href).href;
    if (vid.src !== want) {
      vid.src = src;
      vid.preload = "auto";
      vid.load();
    }
  };

  const transitionTo = (rawIdx) => {
    const total = videoSegments.length;
    if (!total) return;

    const toIdx = ((rawIdx % total) + total) % total;
    if (toIdx === idxRef.current || busyRef.current) return;
    busyRef.current = true;

    const fromSlot = activeRef.current;
    const toSlot = fromSlot === "a" ? "b" : "a";
    const fromVid = fromSlot === "a" ? aRef.current : bRef.current;
    const toVid = toSlot === "a" ? aRef.current : bRef.current;
    if (!fromVid || !toVid) {
      busyRef.current = false;
      return;
    }

    const targetSrc = videoSegments[toIdx]?.src;

    const playAndSwap = () => {
      try { toVid.currentTime = 0; } catch { /* ignore */ }
      const playPromise = toVid.play();

      const fireSwap = () => {
        setActive(toSlot);
        setIdx(toIdx);
        autoStartRef.current = performance.now();
        videoRemainingRef.current = 1;
        setVideoRemaining(1);
        setPaused(false);

        requestAnimationFrame(() => {
          try { fromVid.pause(); } catch { /* ignore */ }
          const nextNext = (toIdx + 1) % total;
          ensureSrc(fromVid, videoSegments[nextNext]?.src);
          busyRef.current = false;
        });
      };

      if (typeof toVid.requestVideoFrameCallback === "function") {
        toVid.requestVideoFrameCallback(() => requestAnimationFrame(fireSwap));
      } else if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => requestAnimationFrame(fireSwap)).catch(() => fireSwap());
      } else {
        setTimeout(fireSwap, 80);
      }
    };

    const wantHref = new URL(targetSrc, window.location.href).href;
    if (toVid.src === wantHref && toVid.readyState >= 2) {
      playAndSwap();
    } else {
      const onLoaded = () => {
        toVid.removeEventListener("loadeddata", onLoaded);
        playAndSwap();
      };
      toVid.addEventListener("loadeddata", onLoaded);
      ensureSrc(toVid, targetSrc);
      setTimeout(() => {
        toVid.removeEventListener("loadeddata", onLoaded);
        if (busyRef.current) playAndSwap();
      }, 1500);
    }
  };

  const goTo = (i) => transitionTo(i);
  const goPrev = () => transitionTo(idxRef.current - 1);
  const goNext = () => transitionTo(idxRef.current + 1);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (a && videoSegments[0]) {
      a.muted = true;
      a.playsInline = true;
      ensureSrc(a, videoSegments[0].src);
      a.play().catch(() => {});
    }
    if (b && videoSegments.length > 1) {
      b.muted = true;
      b.playsInline = true;
      ensureSrc(b, videoSegments[1].src);
    }
    autoStartRef.current = performance.now();
  }, [videoSegments]);

  useEffect(() => {
    const node = guideRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          autoStartRef.current = performance.now();
          const vid = activeRef.current === "a" ? aRef.current : bRef.current;
          if (vid && !hasEnteredViewRef.current) {
            hasEnteredViewRef.current = true;
            try { vid.currentTime = 0; } catch { /* ignore */ }
            vid.play().catch(() => {});
            setPaused(false);
          } else if (vid?.ended) {
            try { vid.currentTime = 0; } catch { /* ignore */ }
            vid.play().catch(() => {});
            setPaused(false);
          }
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frameId;
    const updateRemaining = () => {
      if (autoAdvanceMs > 0 && !paused && isInView) {
        const elapsed = performance.now() - autoStartRef.current;
        const remaining = Math.max(0, Math.min(1, 1 - (elapsed / autoAdvanceMs)));
        if (Math.abs(videoRemainingRef.current - remaining) > 0.004) {
          videoRemainingRef.current = remaining;
          setVideoRemaining(remaining);
        }
      } else {
        const vid = activeRef.current === "a" ? aRef.current : bRef.current;
        if (vid && Number.isFinite(vid.duration) && vid.duration > 0) {
          const remaining = Math.max(0, Math.min(1, 1 - (vid.currentTime / vid.duration)));
          if (Math.abs(videoRemainingRef.current - remaining) > 0.004) {
            videoRemainingRef.current = remaining;
            setVideoRemaining(remaining);
          }
        } else if (videoRemainingRef.current !== 1) {
          videoRemainingRef.current = 1;
          setVideoRemaining(1);
        }
      }
      frameId = requestAnimationFrame(updateRemaining);
    };
    updateRemaining();
    return () => cancelAnimationFrame(frameId);
  }, [autoAdvanceMs, isInView, paused]);

  useEffect(() => {
    if (!autoAdvanceMs || paused || !isInView || videoSegments.length <= 1) return undefined;
    const timer = window.setTimeout(() => transitionTo(idxRef.current + 1), autoAdvanceMs);
    return () => window.clearTimeout(timer);
  }, [autoAdvanceMs, idx, isInView, paused, videoSegments.length]);

  useEffect(() => {
    const onChange = () => {
      const el = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(Boolean(el && el === containerRef.current));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    const inFS = document.fullscreenElement || document.webkitFullscreenElement;
    if (inFS) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    } else {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    }
  };

  const togglePlay = () => {
    const vid = activeRef.current === "a" ? aRef.current : bRef.current;
    if (!vid) return;
    if (vid.paused) {
      autoStartRef.current = performance.now();
      vid.play().catch(() => {});
      setPaused(false);
    } else {
      vid.pause();
      setPaused(true);
    }
  };

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) goPrev(); else goNext();
  };

  const onEndedA = () => { if (activeRef.current === "a" && (!autoAdvanceMs || isInView)) transitionTo(idxRef.current + 1); };
  const onEndedB = () => { if (activeRef.current === "b" && (!autoAdvanceMs || isInView)) transitionTo(idxRef.current + 1); };

  const seg = videoSegments[idx] || videoSegments[0];
  if (!seg) return null;

  return (
    <div ref={guideRef}>
      <style>{`
        .vg-grid { display: grid; grid-template-columns: 1fr 58%; gap: 2.5rem; align-items: start; }
        @media (max-width: 760px) { .vg-grid { grid-template-columns: 1fr; gap: 1.25rem; } }
        .vg-text-wrap { min-height: 360px; }
        @media (max-width: 760px) {
          .vg-text-wrap { min-height: 0; order: 1; }
          .vg-video-col { order: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {groups.length > 1 && (
        <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {groups.map(({ label, start, range }) => {
            const isActive = idx >= range[0] && idx <= range[1];
            return (
              <button key={label} onClick={() => goTo(start)} style={{
                padding: "0.45rem 1.2rem", borderRadius: 50, border: "none",
                background: isActive ? darkColor : "rgba(47,49,90,0.08)",
                color: isActive ? "#fff" : bodyColor,
                fontSize: "0.82rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.2s, color 0.2s",
              }}>{label}</button>
            );
          })}
        </div>
      )}

      <div className="vg-grid">
        <div className="vg-text-wrap" style={{ paddingTop: "0.25rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor, marginBottom: "0.35rem" }}>{seg.group}</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: darkColor, lineHeight: 1.3, marginBottom: "0.6rem" }}>{seg.title}</h3>
          {seg.desc && <p className="ks-body-text" style={{ color: bodyColor, fontStyle: "italic", marginBottom: "1.1rem" }}>{seg.desc}</p>}
          {(seg.steps || []).map((step, i) => (
            <StepRow key={i} n={i + 1} color={accentColor} className="step-row-compact">
              {step}
            </StepRow>
          ))}
          <div style={{ marginTop: "1.25rem", fontSize: "0.7rem", color: "#a8abcc", fontWeight: 500 }}>
            {idx + 1} / {videoSegments.length}
            {idx < videoSegments.length - 1
              ? <span style={{ marginLeft: 6 }}>- Next: {videoSegments[idx + 1].title}</span>
              : <span style={{ marginLeft: 6 }}>- End of guide</span>
            }
          </div>
        </div>

        <div className="vg-video-col">
          <div
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position: "relative", width: "100%", paddingBottom: isFullscreen ? 0 : "56.25%", height: isFullscreen ? "100%" : 0, background: "#000", borderRadius: isFullscreen ? 0 : 14, overflow: "hidden", boxShadow: "0 12px 36px rgba(47,49,90,0.18)", touchAction: "pan-y" }}
          >
            <div style={{
              position: "absolute", inset: 0, zIndex: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: "1rem"
            }}>
              <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: accentColor, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.05em" }}>{loadingLabel}</div>
            </div>

            <Vid
              ref={aRef}
              muted
              onEnded={onEndedA}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
                visibility: active === "a" ? "visible" : "hidden",
                zIndex: active === "a" ? 2 : 1,
              }}
            />
            <Vid
              ref={bRef}
              muted
              onEnded={onEndedB}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
                visibility: active === "b" ? "visible" : "hidden",
                zIndex: active === "b" ? 2 : 1,
              }}
            />

            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              style={{
                position: "absolute", bottom: 12, left: 12, zIndex: 4,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(0,0,0,0.6)",
                color: "#ffffff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
            >
              {isFullscreen ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3v3a2 2 0 0 1-2 2H4M15 3v3a2 2 0 0 0 2 2h3M9 21v-3a2 2 0 0 0-2-2H4M15 21v-3a2 2 0 0 1 2-2h3"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"/>
                </svg>
              )}
            </button>

            <button
              onClick={togglePlay}
              title={paused ? "Play" : "Pause"}
              aria-label={paused ? "Play video" : "Pause video"}
              style={{
                position: "absolute", bottom: 12, right: 12, zIndex: 4,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(0,0,0,0.6)",
                color: "#ffffff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
            >
              {paused
                ? <svg width="11" height="13" viewBox="0 0 12 14" fill="white"><polygon points="0,0 12,7 0,14"/></svg>
                : <svg width="11" height="13" viewBox="0 0 12 14" fill="white"><rect x="0" y="0" width="4" height="14"/><rect x="8" y="0" width="4" height="14"/></svg>
              }
            </button>
          </div>

          <CarouselProgress
            className="sales2do-video-progress"
            count={videoSegments.length}
            activeIndex={idx}
            fillProgress={videoRemaining}
            tone="light"
            onSelect={goTo}
            getTitle={(i) => videoSegments[i]?.title}
          />
        </div>
      </div>
    </div>
  );
}
