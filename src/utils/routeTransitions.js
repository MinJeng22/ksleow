import branding from "../content/branding.json";
import otherServicesContent from "../content/otherServices.json";
import productsContent from "../content/products.json";
import servicesContent from "../content/services.json";

const DEFAULT_PRODUCT_HERO = "/images/products/autocount-accounting-hero.webp";
const TRANSITION_DELAY_MS = 280;
const warmedImages = new Set();
let pendingNavigationTimer = null;

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

function compactUnique(values) {
  return [...new Set(values.filter((src) => typeof src === "string" && src.trim()))];
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
    if (warmedImages.has(src)) return;
    warmedImages.add(src);

    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = priority;
    img.src = src;
  });
}

export function preloadRouteAssets(to, priority = "low") {
  const pathname = getPathname(to);
  if (!pathname) return;

  preloadImages(routeAssets[pathname] || [], priority);
}

export function signalRouteProgressStart(to) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("ks-route-progress:start", {
      detail: { to: typeof to === "string" ? to : "" },
    })
  );
}

export function navigateWithRouteFeedback(navigate, to, options = {}) {
  if (typeof to !== "string") {
    navigate(to);
    return;
  }

  const {
    delay = TRANSITION_DELAY_MS,
    replace = false,
    scrollTop = true,
  } = options;

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

  pendingNavigationTimer = window.setTimeout(() => {
    pendingNavigationTimer = null;
    navigate(to, { replace });
    if (scrollTop) window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }, delay);
}
