import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { preloadRouteAssets } from "../utils/routeTransitions.js";

const MIN_VISIBLE_MS = 360;
const HIDE_DELAY_MS = 180;

export default function RouteProgressBar() {
  const location = useLocation();
  const routeKey = `${location.pathname}${location.search}`;
  const firstRender = useRef(true);
  const timers = useRef([]);
  const startedAt = useRef(0);
  const visibleRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const beginProgress = () => {
    clearTimers();
    startedAt.current = performance.now();
    visibleRef.current = true;
    setFinishing(false);
    setVisible(true);
    setProgress(8);

    window.requestAnimationFrame(() => setProgress(64));
    timers.current.push(
      window.setTimeout(() => setProgress(82), 180),
      window.setTimeout(() => setProgress(90), 520)
    );
  };

  const completeProgress = () => {
    const elapsed = performance.now() - startedAt.current;
    const wait = Math.max(80, MIN_VISIBLE_MS - elapsed);

    timers.current.push(
      window.setTimeout(() => {
        setFinishing(true);
        setProgress(100);
      }, wait),
      window.setTimeout(() => {
        visibleRef.current = false;
        setVisible(false);
        setProgress(0);
        setFinishing(false);
      }, wait + HIDE_DELAY_MS)
    );
  };

  useEffect(() => {
    const handleStart = (event) => {
      preloadRouteAssets(event.detail?.to, "high");
      beginProgress();
    };

    window.addEventListener("ks-route-progress:start", handleStart);
    return () => {
      window.removeEventListener("ks-route-progress:start", handleStart);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    preloadRouteAssets(location.pathname, "high");

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!visibleRef.current) {
      beginProgress();
    }

    clearTimers();
    completeProgress();
  }, [routeKey, location.pathname]);

  return (
    <div
      className={`route-progress-shell${visible ? " is-visible" : ""}${finishing ? " is-finishing" : ""}`}
      aria-hidden="true"
    >
      <div
        className="route-progress-bar"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
