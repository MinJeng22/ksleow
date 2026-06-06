import React, { useEffect, useMemo, useState } from "react";
import SectionDivider, { IconTrophy } from "./SectionDivider";

export const AWARDS = [
  {
    year: "2019",
    trophy: "/images/awards/top-dealer-2019-trophy.png",
    modal: "/images/awards/top-dealer-2019-modal.png",
    title: "2019 Top Dealer Award",
  },
  {
    year: "2021",
    trophy: "/images/awards/top-dealer-2021-trophy.png",
    modal: "/images/awards/top-dealer-2021-modal.png",
    title: "2021 Top Dealer Award",
  },
  {
    year: "2022",
    trophy: "/images/awards/top-dealer-2022-trophy.png",
    modal: "/images/awards/top-dealer-2022-modal.png",
    title: "2022 Top Dealer Award",
  },
  {
    year: "2023",
    trophy: "/images/awards/top-dealer-2023-trophy.png",
    modal: "/images/awards/top-dealer-2023-modal.png",
    title: "2023 Excellent Dealer Award",
  },
  {
    year: "2024",
    trophy: "/images/awards/top-dealer-2024-trophy.png",
    modal: "/images/awards/top-dealer-2024-modal.png",
    title: "2024 Excellent Dealer Award",
  },
  {
    year: "2025",
    trophy: "/images/awards/top-dealer-2025-trophy.png",
    modal: "/images/awards/top-dealer-2025-modal.png",
    title: "2025 Top Dealer Award",
  },
];

export const AWARDS_IMAGES = AWARDS.map((award) => award.trophy);

export default function WhyChooseUs({ section, sectionFrom = "var(--ks-page-cloud)", sectionTo = "var(--ks-page-warm)" }) {
  const [activeAward, setActiveAward] = useState(null);
  const awards = useMemo(() => [...AWARDS].sort((a, b) => Number(a.year) - Number(b.year)), []);
  const marqueeAwards = useMemo(() => [...awards, ...awards, ...awards], [awards]);

  useEffect(() => {
    if (!activeAward) return undefined;
    document.body.classList.add("has-active-modal");
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveAward(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("has-active-modal");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeAward]);

  return (
    <>
      <div className="product-app-divider" style={{ "--section-from": sectionFrom, "--section-to": sectionTo }}>
        <SectionDivider section={section || { id: "why-ksl", icon: IconTrophy }} />
      </div>
      <div id="why-ksl" className="product-app-section product-app-section-warm" style={{ padding: "4rem 0", scrollMarginTop: 24 }}>
        <style>{`
          .ac-awards-container-new {
            margin-top: 1.5rem;
            padding: 2.5rem 0;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .ac-awards-marquee-track {
            align-items: stretch;
          }
          .ac-awards-item {
            appearance: none;
            background: transparent;
            border: 0;
            cursor: pointer;
            flex: 0 0 auto;
            width: 96px;
            min-height: 132px;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.65rem;
            color: #2f315a;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .ac-awards-item:nth-child(even) {
            margin-right: 1.5rem;
          }
          .ac-awards-item:hover,
          .ac-awards-item:focus-visible {
            transform: translateY(-5px);
            z-index: 10;
          }
          .ac-awards-item:focus-visible {
            outline: 2px solid rgba(201,168,76,0.72);
            outline-offset: 6px;
            border-radius: 18px;
          }
          .ac-awards-item img {
            max-width: 100%;
            height: 104px;
            object-fit: contain;
            transition: transform 0.4s ease;
          }
          .ac-awards-item:hover img,
          .ac-awards-item:focus-visible img {
            transform: scale(1.12);
          }
          .ac-awards-year {
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.13em;
            line-height: 1;
          }
          .ac-awards-container-new:hover .ac-brand-marquee {
            animation-play-state: paused !important;
          }
          .award-modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 3200;
            padding: clamp(1rem, 3vw, 2.5rem);
            display: grid;
            place-items: center;
            background: rgba(10, 10, 18, 0.78);
            backdrop-filter: blur(16px);
          }
          .award-modal-panel {
            position: relative;
            width: min(92vw, 860px);
            max-height: min(88vh, 900px);
            display: grid;
            place-items: center;
            border-radius: 24px;
            background:
              linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04)),
              rgba(12, 12, 20, 0.72);
            border: 1px solid rgba(255,255,255,0.16);
            box-shadow: 0 32px 90px rgba(0,0,0,0.38);
            overflow: hidden;
          }
          .award-modal-img {
            display: block;
            max-width: 100%;
            max-height: min(86vh, 880px);
            width: auto;
            height: auto;
            object-fit: contain;
          }
          .award-modal-close {
            position: absolute;
            top: 0.85rem;
            right: 0.85rem;
            width: 42px;
            height: 42px;
            display: inline-grid;
            place-items: center;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.32);
            background: rgba(20,20,28,0.68);
            color: #fff;
            cursor: pointer;
            box-shadow: 0 14px 32px rgba(0,0,0,0.24);
          }
          .award-modal-close:hover {
            background: rgba(47,49,90,0.86);
          }

          @media (min-width: 1025px) {
            .ac-awards-container-new {
              mask-image: none;
              -webkit-mask-image: none;
              max-width: 980px;
              margin-left: auto;
              margin-right: auto;
            }
            .ac-awards-marquee-track {
              animation: none !important;
              justify-content: space-between;
              width: 100%;
            }
            .ac-awards-item.dup {
              display: none;
            }
            .ac-awards-item {
              flex: 1;
              max-width: calc(100% / 6);
              min-height: 164px;
              padding: 0 8px;
              margin-right: 0 !important;
            }
            .ac-awards-item img {
              width: 100%;
              height: 136px;
              object-fit: contain;
            }
          }
          @media (max-width: 1024px) {
            .ac-awards-item {
              width: 96px;
              min-height: 132px;
              padding: 0 0.5rem;
            }
          }
          @media (max-width: 640px) {
            .award-modal-backdrop {
              padding: 0.85rem;
            }
            .award-modal-panel {
              width: 96vw;
              border-radius: 18px;
            }
            .award-modal-close {
              width: 38px;
              height: 38px;
            }
          }
        `}</style>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Why Choose Us?</h2>

          <p style={{
            textAlign: "center", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em",
            color: "#6b6f91", textTransform: "uppercase", marginBottom: "2.5rem", maxWidth: "1000px", margin: "0 auto 2.5rem", lineHeight: 1.6
          }}>
            Top AutoCount Dealer in Pahang State for 6 Award-Winning Years - Empowering Your Business with Proven Expertise, Prompt On-Site Support & Dedicated Training
          </p>

          <div className="ac-brand-marquee-container ac-awards-container-new">
            <div className="ac-brand-marquee ac-awards-marquee-track" style={{ animationDuration: "35s" }}>
              {awards.map((award) => (
                <AwardItem key={`orig-${award.year}`} award={award} onOpen={setActiveAward} />
              ))}
              {marqueeAwards.map((award, i) => (
                <AwardItem key={`dup-${award.year}-${i}`} award={award} onOpen={setActiveAward} duplicate />
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeAward && (
        <div className="award-modal-backdrop" role="presentation" onMouseDown={() => setActiveAward(null)}>
          <div className="award-modal-panel" role="dialog" aria-modal="true" aria-label={activeAward.title} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="award-modal-close" onClick={() => setActiveAward(null)} aria-label="Close award preview">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <img className="award-modal-img" src={activeAward.modal} alt={activeAward.title} />
          </div>
        </div>
      )}
    </>
  );
}

function AwardItem({ award, onOpen, duplicate = false }) {
  return (
    <button type="button" className={`ac-awards-item${duplicate ? " dup" : ""}`} onClick={() => onOpen(award)} aria-label={`View ${award.title}`}>
      <img src={award.trophy} alt={award.title} loading={duplicate ? "lazy" : "eager"} />
      <span className="ac-awards-year">{award.year}</span>
    </button>
  );
}
