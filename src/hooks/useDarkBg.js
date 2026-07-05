import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DARK_SELECTORS = [
  "#hero",
  ".home-why-section",
  ".product-hero",
  ".products-section",
  "footer",
];

const LIGHT_SELECTORS = [
  "#services",
  "#other-services",
  ".home-section:not(.products-section)",
  ".site-card",
  ".site-card-bg"
];

function getLuminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function toneToLuminance(tone) {
  if (tone === "dark") return 0.14;
  if (tone === "light") return 0.92;
  return null;
}

function parseRgbValues(value) {
  if (!value || value === "none" || value === "transparent") return [];
  return [...value.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/g)]
    .map((match) => ({
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    }))
    .filter((color) => color.a > 0.18);
}

function backgroundLuminanceFromElement(element) {
  let current = element;

  while (current && current !== document.documentElement) {
    const explicitTone = current.dataset?.glassTone || current.closest?.("[data-glass-tone]")?.dataset?.glassTone;
    const explicitLuminance = toneToLuminance(explicitTone);
    if (explicitLuminance !== null) return explicitLuminance;

    if (current.matches && current.matches(DARK_SELECTORS.join(","))) return 0.12;
    if (current.matches && current.matches(LIGHT_SELECTORS.join(","))) return 0.92;

    const style = window.getComputedStyle(current);
    const colors = [
      ...parseRgbValues(style.backgroundColor),
      ...parseRgbValues(style.backgroundImage),
    ];

    if (colors.length > 0) {
      const total = colors.reduce((sum, color) => sum + getLuminance(color.r, color.g, color.b), 0);
      return total / colors.length;
    }

    current = current.parentElement;
  }

  return 0.92;
}

function getUnderlyingElementAtPoint(node, x, y) {
  const elements = document.elementsFromPoint(x, y);
  return elements.find((element) => {
    if (!element || element === node || node.contains(element)) return false;
    if (element.closest?.(".top-right-controls, .top-left-controls, .mobile-float-bar, .back-to-top-glass, .ac-sidebar")) return false;
    if (element.classList?.contains("lg-glass")) return false;
    return true;
  });
}

export default function useDarkBg(ref) {
  const [isDark, setIsDark] = useState(true);
  const lastValueRef = useRef(true);
  const location = useLocation();
  const locationKey = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    let ticking = false;
    let lastCheck = 0;
    const timers = [];

    const checkBg = () => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const insetX = Math.min(10, rect.width / 4);
      const insetY = Math.min(10, rect.height / 4);
      const points = [
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + insetX, rect.top + rect.height / 2],
        [rect.right - insetX, rect.top + rect.height / 2],
        [rect.left + rect.width / 2, rect.top + insetY],
        [rect.left + rect.width / 2, rect.bottom - insetY],
      ];

      const luminanceSamples = points
        .map(([x, y]) => {
          const underlying = getUnderlyingElementAtPoint(node, x, y);
          return underlying ? backgroundLuminanceFromElement(underlying) : null;
        })
        .filter((value) => typeof value === "number");

      if (luminanceSamples.length === 0) return;

      const average = luminanceSamples.reduce((sum, value) => sum + value, 0) / luminanceSamples.length;
      const darkVotes = luminanceSamples.filter((value) => value < 0.5).length;
      const lightVotes = luminanceSamples.filter((value) => value > 0.62).length;
      const nextValue = darkVotes > lightVotes || average < 0.48;
      if (nextValue !== lastValueRef.current) {
        lastValueRef.current = nextValue;
        setIsDark(nextValue);
      }
    };

    const scheduleCheck = (force = false) => {
      const now = performance.now();
      if (!force && now - lastCheck < 80) return;
      if (ticking) return;
      window.requestAnimationFrame(() => {
        lastCheck = performance.now();
        checkBg();
        ticking = false;
      });
      ticking = true;
    };

    const scheduleFromEvent = () => scheduleCheck(false);
    const forceRefresh = () => scheduleCheck(true);

    window.addEventListener("scroll", scheduleFromEvent, { passive: true });
    window.addEventListener("resize", scheduleFromEvent, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleFromEvent, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleFromEvent, { passive: true });
    window.addEventListener("ks-glass-tone:refresh", forceRefresh, { passive: true });
    document.fonts?.ready?.then(() => scheduleCheck(true));

    const imageLoadHandler = () => scheduleCheck(true);
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", imageLoadHandler, { once: true });
    });

    const mutationObserver = new MutationObserver(() => scheduleCheck(true));
    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "style", "data-glass-tone"],
    });

    scheduleCheck(true);
    timers.push(
      window.setTimeout(() => scheduleCheck(true), 0),
      window.setTimeout(() => scheduleCheck(true), 120),
      window.setTimeout(() => scheduleCheck(true), 320),
      window.setTimeout(() => scheduleCheck(true), 720),
      window.setTimeout(() => scheduleCheck(true), 1200)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", scheduleFromEvent);
      window.removeEventListener("resize", scheduleFromEvent);
      window.visualViewport?.removeEventListener("resize", scheduleFromEvent);
      window.visualViewport?.removeEventListener("scroll", scheduleFromEvent);
      window.removeEventListener("ks-glass-tone:refresh", forceRefresh);
      mutationObserver.disconnect();
      document.querySelectorAll("img").forEach((img) => {
        img.removeEventListener("load", imageLoadHandler);
      });
    };
  }, [ref, locationKey]);

  return isDark;
}
