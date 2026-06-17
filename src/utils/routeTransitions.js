import branding from "../content/branding.json";
import otherServicesContent from "../content/otherServices.json";
import productsContent from "../content/products.json";
import servicesContent from "../content/services.json";
import { PRODUCT_IMAGES } from "../assets/assets.js";
import acPluginIcon from "../assets/images/apps/ac-plugin-icon.webp";

const DEFAULT_PRODUCT_HERO = "/images/products/autocount-accounting-hero.webp";
const TRANSITION_DELAY_MS = 500;
const CRITICAL_ASSET_TIMEOUT_MS = 2400;
const warmedImages = new Map();
const preloadLinks = new Set();
const imageReadyPromises = new Map();
let pendingNavigationTimer = null;
let pendingFeedbackTimer = null;
let pendingNavigationRun = 0;
let pendingFeedbackRun = 0;

const productAssetsByRoute = Object.fromEntries(
  (productsContent.items || [])
    .filter((item) => item.route)
    .map((item) => [item.route, [item.image, item.background]])
);

const homeAssets = [
  branding.heroLogo,
  branding.navLogo,
  branding.footerLogo,
  branding.serviceCardBack,
  ...(servicesContent.items || []).map((item) => item.backgroundImage),
  ...(servicesContent.items || []).flatMap((item) => (item.logos || []).flatMap((logo) => [logo.src, logo.hoverSrc])),
  ...(productsContent.items || []).flatMap((item) => [item.image, item.background]),
  ...(otherServicesContent.items || []).map((item) => item.image),
];

const routeAssets = {
  "/": homeAssets,
  "/products/autocount-accounting": [
    DEFAULT_PRODUCT_HERO,
    ...(productAssetsByRoute["/products/autocount-accounting"] || []),
    "/images/promotions/autocount-1accountplus-1.webp",
    "/images/promotions/ksl-referral-program.webp",
    "/images/promotions/autocountaccounting-free.webp",
    "/images/services/lhdn-logo.webp",
    "/images/icons/ac-plugin-icon.webp",
  ],
  "/products/autocount-cloud-accounting": [
    "/images/products/autocount-cloudaccounting-hero.webp",
    "/images/products/cloudaccounting-icon.webp",
    ...(productAssetsByRoute["/products/autocount-cloud-accounting"] || []),
    "/images/promotions/autocount-cloudaccounting-75-promo.webp",
    "/images/promotions/ksl-referral-program.webp",
    "/images/promotions/autocount-cloudaccounting-65-promo.webp",
  ],
  "/products/feedme-pos": [
    "/images/products/feedme-pos-showcase.webp",
    "/images/logos/feedme-logo.webp",
    "/images/products/feedme-white-logo.webp",
  ],
  "/apps/autocount-plugin": [
    DEFAULT_PRODUCT_HERO,
    "/images/other-services/acplugin.webp",
  ],
  "/apps/sales2do": [
    DEFAULT_PRODUCT_HERO,
    "/images/other-services/acplugin.webp",
  ],
  "/gallery": [
    "/images/branding/service-card-back.webp",
  ],
};

const routeCriticalAssets = {
  "/": [
    branding.heroLogo,
    branding.navLogo,
  ],
  "/products/autocount-accounting": [
    DEFAULT_PRODUCT_HERO,
    PRODUCT_IMAGES.autocountAccountingIcon,
  ],
  "/products/autocount-cloud-accounting": [
    "/images/products/autocount-cloudaccounting-hero.webp",
    "/images/products/cloudaccounting-icon.webp",
  ],
  "/products/feedme-pos": [
    "/images/products/feedme-pos-showcase.webp",
    "/images/logos/feedme-logo.webp",
  ],
  "/apps/autocount-plugin": [
    DEFAULT_PRODUCT_HERO,
    acPluginIcon,
  ],
  "/apps/sales2do": [
    DEFAULT_PRODUCT_HERO,
    acPluginIcon,
  ],
  "/gallery": [
    "/images/branding/service-card-back.webp",
  ],
};

function compactUnique(values) {
  return [...new Set(values.filter((src) => typeof src === "string" && src.trim()))];
}

function getPriorityRank(priority) {
  if (priority === "high") return 3;
  if (priority === "low") return 1;
  return 2;
}

function addImagePreloadLink(src, priority) {
  if (priority !== "high" || typeof document === "undefined" || preloadLinks.has(src)) return;

  preloadLinks.add(src);
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  link.fetchPriority = "high";
  document.head.appendChild(link);
}

function wait(ms) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    window.setTimeout(resolve, Math.max(0, ms));
  });
}

function requestImage(src, priority = "low") {
  if (typeof window === "undefined" || typeof Image === "undefined") {
    return Promise.resolve({ src, loaded: false });
  }

  const rank = getPriorityRank(priority);
  const previousRank = warmedImages.get(src) || 0;
  if (previousRank < rank) {
    warmedImages.set(src, rank);
    addImagePreloadLink(src, priority);
  }

  if (imageReadyPromises.has(src)) {
    return imageReadyPromises.get(src);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = async (loaded) => {
      if (settled) return;
      settled = true;
      if (loaded && typeof img.decode === "function") {
        try {
          await img.decode();
        } catch {
          /* decode can fail for cached/cross-origin edge cases; the image still loaded. */
        }
      }
      resolve({ src, loaded });
    };

    img.decoding = "async";
    img.fetchPriority = priority;
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = src;

    if (img.complete) {
      finish(img.naturalWidth > 0);
    }
  });

  imageReadyPromises.set(src, promise);
  return promise;
}

function getPathname(to) {
  if (!to || typeof to !== "string") return "";
  try {
    return new URL(to, window.location.origin).pathname;
  } catch {
    return to.split(/[?#]/)[0] || "";
  }
}

export function preloadImages(sources, priority = "low") {
  if (typeof window === "undefined" || typeof Image === "undefined") return;

  compactUnique(sources).forEach((src) => {
    requestImage(src, priority);
  });
}

export function preloadRouteAssets(to, priority = "low") {
  const pathname = getPathname(to);
  if (!pathname) return;

  preloadImages([
    ...(routeCriticalAssets[pathname] || []),
    ...(routeAssets[pathname] || []),
  ], priority);
}

function getRouteAssets(to) {
  const pathname = getPathname(to);
  if (!pathname) return [];
  return routeAssets[pathname] || [];
}

function getRouteCriticalAssets(to) {
  const pathname = getPathname(to);
  if (!pathname) return [];
  return routeCriticalAssets[pathname] || getRouteAssets(pathname).slice(0, 2);
}

async function waitForCriticalImages(sources, options = {}) {
  const {
    priority = "high",
    timeout = CRITICAL_ASSET_TIMEOUT_MS,
  } = options;
  const assets = compactUnique(sources);
  if (assets.length === 0) return { total: 0, loaded: 0, timedOut: false };

  const loadPromise = Promise.allSettled(assets.map((src) => requestImage(src, priority))).then((results) => ({
    total: assets.length,
    loaded: results.filter((result) => result.status === "fulfilled" && result.value?.loaded).length,
    timedOut: false,
  }));

  const timeoutPromise = wait(timeout).then(() => ({
    total: assets.length,
    loaded: 0,
    timedOut: true,
  }));

  return Promise.race([loadPromise, timeoutPromise]);
}

async function waitForTransitionReadiness({ assets = [], route = "", minDelay = TRANSITION_DELAY_MS, timeout = CRITICAL_ASSET_TIMEOUT_MS } = {}) {
  const criticalAssets = compactUnique([
    ...assets,
    ...(route ? getRouteCriticalAssets(route) : []),
  ]);

  await Promise.all([
    wait(minDelay),
    waitForCriticalImages(criticalAssets, { priority: "high", timeout }),
  ]);
}

export function waitForRouteAssets(to, options = {}) {
  const {
    assets = [],
    priority = "high",
    timeout = CRITICAL_ASSET_TIMEOUT_MS,
  } = options;
  const criticalAssets = compactUnique([
    ...assets,
    ...getRouteCriticalAssets(to),
  ]);

  return waitForCriticalImages(criticalAssets, { priority, timeout });
}

export function signalRouteProgressStart(to) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("ks-route-progress:start", {
      detail: { to: typeof to === "string" ? to : "" },
    })
  );
}

export function signalRouteProgressComplete() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event("ks-route-progress:complete"));
}

export function runWithProgressFeedback(action, options = {}) {
  if (typeof window === "undefined") {
    action?.();
    return;
  }

  const {
    delay = TRANSITION_DELAY_MS,
    assets = [],
    route = "",
  } = options;
  const runId = ++pendingFeedbackRun;

  preloadImages(assets, "high");
  if (route) preloadRouteAssets(route, "high");
  signalRouteProgressStart(route);

  if (pendingFeedbackTimer) {
    window.clearTimeout(pendingFeedbackTimer);
  }

  pendingFeedbackTimer = null;

  waitForTransitionReadiness({ assets, route, minDelay: delay }).then(() => {
    if (runId !== pendingFeedbackRun) return;
    pendingFeedbackTimer = null;
    action?.();
    signalRouteProgressComplete();
  });
}

export function navigateWithRouteFeedback(navigate, to, options = {}) {
  if (typeof to !== "string") {
    const { delay = TRANSITION_DELAY_MS } = options;
    const runId = ++pendingNavigationRun;

    signalRouteProgressStart("");

    if (pendingNavigationTimer) {
      window.clearTimeout(pendingNavigationTimer);
    }

    pendingNavigationTimer = null;

    waitForTransitionReadiness({ minDelay: delay }).then(() => {
      if (runId !== pendingNavigationRun) return;
      pendingNavigationTimer = null;
      navigate(to);
      signalRouteProgressComplete();
    });
    return;
  }

  const {
    delay = TRANSITION_DELAY_MS,
    replace = false,
    scrollTop = true,
  } = options;
  const runId = ++pendingNavigationRun;

  const pathname = getPathname(to);
  const alreadyHere = pathname && pathname === window.location.pathname && !to.includes("?");

  preloadRouteAssets(to, "high");

  if (alreadyHere || delay <= 0) {
    navigate(to, { replace });
    if (scrollTop) window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    return;
  }

  signalRouteProgressStart(to);

  if (pendingNavigationTimer) {
    window.clearTimeout(pendingNavigationTimer);
  }

  pendingNavigationTimer = null;

  waitForTransitionReadiness({ route: to, minDelay: delay }).then(() => {
    if (runId !== pendingNavigationRun) return;
    pendingNavigationTimer = null;
    navigate(to, { replace });
    if (scrollTop) window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  });
}
