import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DARK_SELECTORS = [
  "#hero",
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

export default function useDarkBg(ref) {
  const [isDark, setIsDark] = useState(true);
  const lastValueRef = useRef(true);
  const location = useLocation();
  const locationKey = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    let ticking = false;
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
          const elements = document.elementsFromPoint(x, y);
          const underlying = elements.find((element) => !node.contains(element) && element !== node);
          return underlying ? backgroundLuminanceFromElement(underlying) : null;
        })
        .filter((value) => typeof value === "number");

      if (luminanceSamples.length === 0) return;

      const darkVotes = luminanceSamples.filter((value) => value < 0.54).length;
      const nextValue = darkVotes >= Math.ceil(luminanceSamples.length / 2);
      if (nextValue !== lastValueRef.current) {
        lastValueRef.current = nextValue;
        setIsDark(nextValue);
      }
    };

    const scheduleCheck = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        checkBg();
        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck, { passive: true });

    scheduleCheck();
    timers.push(
      window.setTimeout(scheduleCheck, 0),
      window.setTimeout(scheduleCheck, 120),
      window.setTimeout(scheduleCheck, 320)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
    };
  }, [ref, locationKey]);

  return isDark;
}
