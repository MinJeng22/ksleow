import { useEffect, useState } from "react";
import AutoCountTrialModal from "../components/AutoCountTrialModal.jsx";
import HomeImagePreloader from "../components/HomeImagePreloader";
import Hero from "../components/Hero";
import HomeWhyChooseUs from "../components/HomeWhyChooseUs";
import Services from "../components/Services";
import Products from "../components/Products";
import OtherServices from "../components/OtherServices";
// import OurTeam from "../components/OurTeam";
import Careers from "../components/Careers";
import Footer from "../components/Footer";
import "../styles/homeImmersive.css";



const KSL_CONTACT_MODAL_HASHES = new Set(["#kslbs", "#contact-kslbs", "#qr-contact"]);

const KSL_CONTACT_MESSAGE =
  "Hi KSL Business Solutions, I scanned your QR code and would like to know more about your POS, hardware, or business software services.";

function shouldOpenKslContactModal() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return (
    KSL_CONTACT_MODAL_HASHES.has(window.location.hash) ||
    params.get("modal") === "kslbs" ||
    params.get("contact") === "kslbs"
  );
}

function clearKslContactModalUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("modal");
  url.searchParams.delete("contact");
  if (KSL_CONTACT_MODAL_HASHES.has(url.hash)) url.hash = "";
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function useKslContactDeepLink() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncFromUrl = () => setOpen(shouldOpenKslContactModal());
    syncFromUrl();

    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  const close = () => {
    setOpen(false);
    clearKslContactModalUrl();
  };

  return [open, close];
}

function useImmersiveHomeScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = document.documentElement;
    root.classList.add("is-immersive-home");

    const panels = Array.from(document.querySelectorAll(
      ".home-hero-layer, .home-content-layer > .home-snap-panel, .home-content-layer > .home-section, .home-careers-footer-panel"
    ));

    panels.forEach((panel) => panel.classList.add("home-immersive-panel"));

    if (typeof IntersectionObserver === "undefined") {
      panels.forEach((panel) => panel.classList.add("is-visible"));
      return () => {
        root.classList.remove("is-immersive-home");
        panels.forEach((panel) => panel.classList.remove("home-immersive-panel", "is-visible"));
      };
    }

    // Intersection observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "-5% 0px -5% 0px",
      }
    );

    panels.forEach((panel) => observer.observe(panel));

    // ── JS-driven smooth panel scroll (desktop only) ──────────────────────
    // CSS scroll-behavior:smooth + scroll-snap-type:mandatory are unreliable
    // in Chrome/Edge — the browser picks one and ignores the other.
    // We intercept wheel + keyboard on desktop (≥768px) and animate ourselves.
    const isMobile = () => window.innerWidth <= 1024;

    let isAnimating = false;
    let animationFrame = 0;

    // Find which panel is currently closest to viewport top
    function getCurrentIndex() {
      let best = 0;
      let bestDist = Infinity;
      panels.forEach((p, i) => {
        const dist = Math.abs(p.getBoundingClientRect().top);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }

    // Smooth scroll to a specific panel using requestAnimationFrame + cubic ease
    function scrollToPanel(index) {
      if (index < 0 || index >= panels.length) return;
      if (isAnimating) return;

      const target = panels[index];
      const startY = window.scrollY;
      const targetY = startY + target.getBoundingClientRect().top;
      const distance = targetY - startY;

      if (Math.abs(distance) < 2) return;

      isAnimating = true;

      const duration = 660; // ms
      const t0 = performance.now();

      // Smooth but decisive, so the page does not feel stuck between panels.
      const ease = (t) => 1 - Math.pow(1 - t, 4);

      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, startY + distance * ease(p));
        if (p < 1) {
          animationFrame = requestAnimationFrame(tick);
        } else {
          animationFrame = 0;
          isAnimating = false;
          window.dispatchEvent(new Event("ks-glass-tone:refresh"));
        }
      };

      animationFrame = requestAnimationFrame(tick);
    }

    // Wheel handler — one panel per gesture, accumulated delta threshold
    let wheelAccum = 0;
    let wheelTimer = null;
    let isScrollLocked = false;

    const onWheel = (e) => {
      if (isMobile()) return;

      // Allow native scroll inside the inner-scrollable careers+footer panel
      const scrollPanel = e.target.closest(".home-snap-panel-scroll");
      if (scrollPanel) {
        const canScrollInside = scrollPanel.scrollHeight > scrollPanel.clientHeight + 4;
        const atTop = scrollPanel.scrollTop <= 0;
        const atBottom = scrollPanel.scrollTop + scrollPanel.clientHeight >= scrollPanel.scrollHeight - 2;
        if (canScrollInside && ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom))) return;
      }

      e.preventDefault();

      // If we are currently animating or locked from a recent scroll,
      // just renew the timer and ignore the wheel event to absorb inertia.
      if (isAnimating || isScrollLocked) {
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
          wheelAccum = 0;
          isScrollLocked = false;
        }, 140);
        return;
      }

      wheelAccum += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { 
        wheelAccum = 0;
        isScrollLocked = false;
      }, 140);

      if (Math.abs(wheelAccum) < 56) return;

      const direction = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0;
      isScrollLocked = true; // Lock until they stop scrolling

      const idx = getCurrentIndex();
      scrollToPanel(idx + direction);
    };

    // Keyboard handler
    const onKeyDown = (e) => {
      if (isMobile()) return;
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(e.key)) return;
      const tag = document.activeElement?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      e.preventDefault();
      const direction = ["ArrowDown", "PageDown"].includes(e.key) ? 1 : -1;
      const idx = getCurrentIndex();
      scrollToPanel(idx + direction);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      observer.disconnect();
      root.classList.remove("is-immersive-home");
      panels.forEach((panel) => panel.classList.remove("home-immersive-panel", "is-visible"));
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(wheelTimer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);
}

export default function Home({ onContact }) {
  useImmersiveHomeScroll();
  const [kslContactOpen, closeKslContact] = useKslContactDeepLink();

  return (
    <>
      <HomeImagePreloader />
      <div className="home-pinned-layout">
        <div className="home-hero-layer">
          <Hero onContact={onContact} />
        </div>
        <main className="home-content-layer">
          <Services />
          <HomeWhyChooseUs />
          <Products onContact={onContact} />
          <OtherServices onContact={onContact} />
          {/* <OurTeam /> */}
          <section className="home-combined-panel home-careers-footer-panel" aria-label="Join Us and Footer">
            <Careers />
            <Footer />
          </section>
        </main>
      </div>
      <AutoCountTrialModal
        open={kslContactOpen}
        onClose={closeKslContact}
        productName="KSL Business Solutions"
        title=""
        panelTitle=""
        whatsappLabel="Chat on WhatsApp"
        supportMessage={KSL_CONTACT_MESSAGE}
        stats={[
          { label: "WhatsApp", value: "017-905 2323" },
          { label: "Email", value: "support@ksleow.com.my" },
        ]}
        checklist={[]}
      />
    </>
  );
}
