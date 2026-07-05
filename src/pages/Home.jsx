import { useEffect } from "react";
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



function useImmersiveHomeScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = document.documentElement;
    root.classList.add("is-immersive-home");

    const panels = Array.from(document.querySelectorAll(
      ".home-hero-layer, .home-content-layer > .home-snap-panel, .home-content-layer > .home-section"
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
        threshold: 0.42,
        rootMargin: "-8% 0px -8% 0px",
      }
    );

    panels.forEach((panel) => observer.observe(panel));

    // ── JS-driven smooth panel scroll (desktop only) ──────────────────────
    // CSS scroll-behavior:smooth + scroll-snap-type:mandatory are unreliable
    // in Chrome/Edge — the browser picks one and ignores the other.
    // We intercept wheel + keyboard on desktop (≥768px) and animate ourselves.
    const isMobile = () => window.innerWidth <= 1024;

    let isAnimating = false;

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

      const duration = 750; // ms
      const t0 = performance.now();

      // Cubic ease-in-out
      const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, startY + distance * ease(p));
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          isAnimating = false;
        }
      };

      requestAnimationFrame(tick);
    }

    // Wheel handler — one panel per gesture, accumulated delta threshold
    let wheelAccum = 0;
    let wheelTimer = null;

    const onWheel = (e) => {
      if (isMobile()) return;

      // Allow native scroll inside the inner-scrollable careers+footer panel
      const scrollPanel = e.target.closest(".home-snap-panel-scroll");
      if (scrollPanel) {
        const atTop = scrollPanel.scrollTop <= 0;
        const atBottom = scrollPanel.scrollTop + scrollPanel.clientHeight >= scrollPanel.scrollHeight - 2;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
      }

      e.preventDefault();

      wheelAccum += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccum = 0; }, 80);

      if (Math.abs(wheelAccum) < 40) return;

      const direction = wheelAccum > 0 ? 1 : -1;
      wheelAccum = 0;

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
    };
  }, []);
}

export default function Home({ onContact }) {
  useImmersiveHomeScroll();

  return (
    <>
      <HomeImagePreloader />
      <div className="home-pinned-layout">
        <div className="home-hero-layer">
          <Hero onContact={onContact} />
        </div>
        <main className="home-content-layer">
          <HomeWhyChooseUs />
          <Services />
          <Products onContact={onContact} />
          <OtherServices onContact={onContact} />
          {/* <OurTeam /> */}
          <section className="home-snap-panel home-snap-panel-scroll home-combined-panel home-careers-footer-panel" aria-label="Join Us and Footer">
            <Careers />
            <Footer />
          </section>
        </main>
      </div>
    </>
  );
}
