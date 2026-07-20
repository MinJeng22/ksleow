import React from "react";
import SectionDivider, { IconTrophy } from "./SectionDivider";

export const AWARD_YEARS = [
  {
    year: "2019",
    trophy: "/images/awards/top-dealer-2019-trophy.webp",
    modal: "/images/awards/top-dealer-2019-modal.webp",
  },
  {
    year: "2021",
    trophy: "/images/awards/top-dealer-2021-trophy.webp",
    modal: "/images/awards/top-dealer-2021-modal.webp",
  },
  {
    year: "2022",
    trophy: "/images/awards/top-dealer-2022-trophy.webp",
    modal: "/images/awards/top-dealer-2022-modal.webp",
  },
  {
    year: "2023",
    trophy: "/images/awards/top-dealer-2023-trophy.webp",
    modal: "/images/awards/top-dealer-2023-modal.webp",
  },
  {
    year: "2024",
    trophy: "/images/awards/top-dealer-2024-trophy.webp",
    modal: "/images/awards/top-dealer-2024-modal.webp",
  },
  {
    year: "2025",
    trophy: "/images/awards/top-dealer-2025-trophy.webp",
    modal: "/images/awards/top-dealer-2025-modal.webp",
  },
];

function AwardYear({ award, duplicate = false }) {
  return (
    <div className={`ac-awards-year${duplicate ? " dup" : ""}`} aria-label={`AutoCount Dealer Award ${award.year}`}>
      <div className="ac-awards-item ac-awards-item-trophy">
        <img src={award.trophy} alt={`AutoCount Top Dealer trophy ${award.year}`} loading="lazy" decoding="async" />
      </div>
      <div className="ac-awards-item ac-awards-item-modal">
        <img src={award.modal} alt={`AutoCount Top Dealer certificate ${award.year}`} loading="eager" decoding="async" fetchpriority="high" />
      </div>
    </div>
  );
}

function RetailProofPanel({ proof }) {
  if (!proof) return null;

  return (
    <section className="ac-retail-proof" aria-labelledby="ac-retail-proof-title">
      <div className="ac-retail-proof-copy">
        <h3 id="ac-retail-proof-title">{proof.title}</h3>
        <p>{proof.body}</p>
      </div>

      <div className="ac-retail-proof-grid">
        {proof.branches.map((branch) => (
          <a className="ac-retail-proof-card" href={branch.mapUrl} target="_blank" rel="noreferrer" key={branch.name}>
            <img src={branch.image} alt={`${branch.name} storefront`} loading="lazy" decoding="async" />
            <div>
              <h4>{branch.name}</h4>
              <p>{branch.address}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function WhyChooseUs({ section, sectionFrom = "var(--ks-page-cloud)", sectionTo = "var(--ks-page-warm)", retailProof }) {
  return (
    <>
      <div className="product-app-divider" style={{ "--section-from": sectionFrom, "--section-to": sectionTo }}>
        <SectionDivider section={section || { id: "why-ksl", icon: IconTrophy }} />
      </div>
      <div id="why-ksl" className="product-app-section product-app-section-warm" style={{ padding: "clamp(2rem, 4vw, 3.4rem) 0", scrollMarginTop: 24 }}>
        <style>{`
          .ac-awards-container-new {
            margin-top: clamp(0.5rem, 2vw, 1.5rem);
            padding: clamp(1rem, 3vw, 2.2rem) 0;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          .ac-awards-marquee-track {
            display: flex;
            align-items: center;
            gap: 1.4rem;
          }
          .ac-awards-year {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
          }
          .ac-awards-item {
            flex: 0 0 auto;
            width: auto;
            height: 126px;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            padding: 0;
          }
          .ac-awards-item:hover {
            transform: translateY(-5px);
            z-index: 10;
          }
          .ac-awards-item img {
            width: auto;
            height: 100%;
            max-width: none;
            max-height: none;
            object-fit: contain;
            transition: transform 0.4s ease;
          }
          .ac-awards-item:hover img {
            transform: scale(1.15);
          }
          @keyframes ac-awards-marquee-loop {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }
          @media (hover: hover) and (pointer: fine) {
            .ac-awards-container-new:hover .ac-brand-marquee {
              animation-play-state: paused !important;
            }
          }

          /* Desktop: Static, fit 12 items exactly to screen */
          @media (min-width: 1025px) {
            .ac-awards-container-new {
              mask-image: none;
              -webkit-mask-image: none;
              max-width: min(1480px, calc(100% - clamp(2rem, 5vw, 8rem)));
              margin-left: auto;
              margin-right: auto;
              overflow: visible;
              container-type: inline-size;
            }
            .ac-awards-marquee-track {
              display: grid;
              grid-template-columns: repeat(6, minmax(0, 1fr));
              animation: none !important;
              column-gap: clamp(0.4rem, 1vw, 1.35rem);
              justify-content: stretch;
              width: 100%;
            }
            .ac-awards-year.dup {
              display: none;
            }
            .ac-awards-year {
              gap: clamp(0.2rem, 1cqw, 0.8rem);
              justify-content: center;
              min-width: 0;
            }
            .ac-awards-year:first-child {
              justify-content: flex-start;
            }
            .ac-awards-year:nth-child(6) {
              justify-content: flex-end;
            }
            .ac-awards-item {
              flex: 0 1 auto;
              height: clamp(50px, 10.5cqw, 168px);
              padding: 0;
              margin-right: -0.2rem;
              min-width: 0;
            }
            .ac-awards-item-trophy {
              width: auto;
              margin-right: 0;
              position: relative;
              z-index: 2;
            }
            .ac-awards-item-modal {
              width: auto;
              position: relative;
              z-index: 1;
            }
            .ac-awards-item img {
              width: auto;
              height: 100%;
              object-fit: contain;
            }
          }
          @media (min-width: 1600px) {
            .ac-awards-container-new {
              max-width: min(1560px, calc(100% - clamp(7rem, 10vw, 14rem)));
              padding-top: 1.45rem;
              padding-bottom: 1.45rem;
            }
            .ac-awards-marquee-track {
              column-gap: clamp(0.55rem, 0.8cqw, 1rem);
            }
            .ac-awards-item {
              height: clamp(140px, 10.5cqw, 185px);
            }
          }
          @media (min-width: 1900px) {
            .ac-awards-container-new {
              max-width: min(1680px, calc(100% - clamp(10rem, 14vw, 22rem)));
            }
            .ac-awards-item {
              height: clamp(160px, 10.5cqw, 195px);
            }
          }
          @media (min-width: 2400px) {
            .ac-awards-container-new {
              max-width: 1760px;
            }
            .ac-awards-item {
              height: 198px;
            }
          }
          /* Mobile: Keep marquee sizes */
          @media (max-width: 1024px) {
            .ac-awards-marquee-track {
              width: max-content;
              animation-name: ac-awards-marquee-loop !important;
              animation-timing-function: linear !important;
              animation-iteration-count: infinite !important;
              will-change: transform;
              transform: translate3d(0, 0, 0);
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
            .ac-awards-marquee-track {
              gap: 0 !important;
            }
            .ac-awards-year {
              gap: 0.18rem;
              padding-right: 1rem;
            }
            .ac-awards-item {
              width: auto;
              height: 122px;
              padding: 0;
            }
          }
          .ac-retail-proof {
            gap: clamp(1.2rem, 2.5vw, 1.8rem);
            margin: clamp(1.5rem, 3vw, 2.5rem) auto 0;
            max-width: 1180px;
            text-align: left;
          }
          .ac-retail-proof-copy {
            margin: 0 0 clamp(1.5rem, 2vw, 2rem);
            max-width: 1000px;
            text-align: left;
          }
          .ac-retail-proof-copy h3 {
            color: #2f315a;
            font-size: clamp(1.55rem, 2.8vw, 2.3rem);
            font-weight: 900;
            letter-spacing: 0;
            line-height: 1.05;
            margin: 0;
            text-wrap: balance;
          }
          .ac-retail-proof-copy p {
            color: #6b6f91;
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            line-height: 1.6;
            margin: 0.85rem 0 0;
          }
          .ac-retail-proof-grid {
            display: grid;
            gap: 0.85rem;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .ac-retail-proof-card {
            background: rgba(255, 255, 255, 0.82);
            border: 1px solid rgba(47, 49, 90, 0.08);
            border-radius: 18px;
            box-shadow: 0 12px 35px rgba(47, 49, 90, 0.07);
            color: inherit;
            display: block;
            min-width: 0;
            overflow: hidden;
            text-decoration: none;
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          }
          .ac-retail-proof-card:hover {
            border-color: rgba(228, 158, 37, 0.45);
            box-shadow: 0 16px 42px rgba(47, 49, 90, 0.12);
            transform: translateY(-3px);
          }
          .ac-retail-proof-card img {
            aspect-ratio: 4 / 3;
            display: block;
            height: auto;
            object-fit: cover;
            width: 100%;
          }
          .ac-retail-proof-card div {
            padding: 0.9rem;
          }
          .ac-retail-proof-card h4 {
            color: #2f315a;
            font-size: 0.98rem;
            font-weight: 900;
            letter-spacing: 0;
            line-height: 1.2;
            margin: 0;
          }
          .ac-retail-proof-card p {
            color: rgba(47, 49, 90, 0.68);
            font-size: 0.82rem;
            font-weight: 650;
            line-height: 1.45;
            margin: 0.45rem 0 0;
          }
          @media (max-width: 980px) {
            .ac-retail-proof-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
          @media (max-width: 680px) {
            .ac-retail-proof-grid {
              grid-template-columns: 1fr;
            }
            .ac-retail-proof-card {
              display: grid;
              grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
            }
            .ac-retail-proof-card img {
              aspect-ratio: auto;
              height: 100%;
              min-height: 150px;
            }
          }
        `}</style>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 className="ks-section-title ks-section-title-inherit" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Why Choose Us?</h2>
          
          <p style={{
            textAlign: "center", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em",
            color: "#6b6f91", textTransform: "uppercase", marginBottom: "2.5rem", maxWidth: "1000px", margin: "0 auto 2.5rem", lineHeight: 1.6
          }}>
            Top AutoCount Dealer in Pahang State for 6 Award-Winning Years - Empowering Your Business with Proven Expertise, Prompt On-Site Support & Dedicated Training
          </p>

          <div className="ac-brand-marquee-container ac-awards-container-new">
            <div className="ac-brand-marquee ac-awards-marquee-track" style={{ animationDuration: "35s" }}>
              {AWARD_YEARS.map((award) => <AwardYear key={`orig-${award.year}`} award={award} />)}
              {AWARD_YEARS.map((award, i) => (
                <AwardYear key={`dup-${award.year}-${i}`} award={award} duplicate />
              ))}
            </div>
          </div>

          <RetailProofPanel proof={retailProof} />

        </div>
      </div>
    </>
  );
}
