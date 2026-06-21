import { useEffect, useRef } from "react";

const teamTiles = [
  {
    label: "Tax & Accounting",
    image: "/images/services/ksLeow-group.webp",
    className: "team-tile team-tile--wide",
  },
  {
    label: "Software & Support",
    image: "/images/services/webinar.webp",
    className: "team-tile team-tile--small team-tile--lift",
  },
  {
    label: "Company Advisory",
    image: "/images/services/taxation-bg.webp",
    className: "team-tile team-tile--small",
  },
  {
    label: "Secretarial",
    image: "/images/services/secretarial-bg.webp",
    className: "team-tile team-tile--medium",
  },
  {
    label: "Audit & Compliance",
    image: "/images/services/auditing-bg.webp",
    className: "team-tile team-tile--medium team-tile--drop",
  },
  {
    label: "Training",
    image: "/images/services/software-training-bg.webp",
    className: "team-tile team-tile--wide team-tile--short",
  },
];

export default function OurTeam() {
  const leadCardRef = useRef(null);
  const leadFrameRef = useRef(null);
  const leadCurrentRef = useRef({ bgX: 0, bgY: 0, personX: 0, personY: 0, active: 0 });
  const leadTargetRef = useRef({ bgX: 0, bgY: 0, personX: 0, personY: 0, active: 0 });

  const renderLeadDepth = () => {
    const card = leadCardRef.current;
    const current = leadCurrentRef.current;
    const target = leadTargetRef.current;

    leadFrameRef.current = null;
    if (!card) return;

    const ease = 0.12;
    current.bgX += (target.bgX - current.bgX) * ease;
    current.bgY += (target.bgY - current.bgY) * ease;
    current.personX += (target.personX - current.personX) * ease;
    current.personY += (target.personY - current.personY) * ease;
    current.active += (target.active - current.active) * 0.1;

    card.style.setProperty("--team-bg-x", `${current.bgX.toFixed(2)}px`);
    card.style.setProperty("--team-bg-y", `${current.bgY.toFixed(2)}px`);
    card.style.setProperty("--team-person-x", `${current.personX.toFixed(2)}px`);
    card.style.setProperty("--team-person-y", `${current.personY.toFixed(2)}px`);
    card.style.setProperty("--team-depth-active", current.active.toFixed(3));

    const remaining =
      Math.abs(target.bgX - current.bgX) +
      Math.abs(target.bgY - current.bgY) +
      Math.abs(target.personX - current.personX) +
      Math.abs(target.personY - current.personY) +
      Math.abs(target.active - current.active);

    if (remaining > 0.08) {
      leadFrameRef.current = requestAnimationFrame(renderLeadDepth);
    }
  };

  const setLeadTarget = (target) => {
    leadTargetRef.current = target;
    if (!leadFrameRef.current) {
      leadFrameRef.current = requestAnimationFrame(renderLeadDepth);
    }
  };

  useEffect(() => () => {
    if (leadFrameRef.current) cancelAnimationFrame(leadFrameRef.current);
  }, []);

  const handleLeadMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    setLeadTarget({
      bgX: x * -8,
      bgY: y * -5,
      personX: x * 11,
      personY: y * 4.5,
      active: 1,
    });
  };

  const resetLeadDepth = () => {
    setLeadTarget({ bgX: 0, bgY: 0, personX: 0, personY: 0, active: 0 });
  };

  return (
    <section className="our-team-section" id="our-team" aria-labelledby="our-team-title">
      <style>{`
        .our-team-section {
          background:
            radial-gradient(circle at 17% 18%, rgba(201,168,76,0.18), transparent 32%),
            radial-gradient(circle at 82% 22%, rgba(201,168,76,0.12), transparent 34%),
            linear-gradient(180deg, #fbf5e8 0%, #fffaf0 48%, #fbf5e8 100%);
          overflow: hidden;
          padding: clamp(2.75rem, 4vw, 4.5rem) 0;
          position: relative;
        }
        .our-team-section::before,
        .our-team-section::after {
          background: rgba(201,168,76,0.12);
          border-radius: 999px;
          content: "";
          filter: blur(18px);
          height: 120px;
          position: absolute;
          width: 120px;
          z-index: 0;
        }
        .our-team-section::before {
          left: max(1.5rem, 8vw);
          top: 9%;
        }
        .our-team-section::after {
          bottom: 12%;
          right: max(1.5rem, 10vw);
        }
        .our-team-wrap {
          align-items: stretch;
          display: grid;
          gap: clamp(1.35rem, 3vw, 3.25rem);
          grid-template-columns: minmax(0, 65fr) minmax(300px, 35fr);
          position: relative;
          z-index: 1;
        }
        .team-gallery-panel {
          min-width: 0;
          padding: clamp(0.35rem, 1vw, 0.85rem) 0;
        }
        .team-lead {
          align-self: stretch;
          justify-self: end;
          perspective: 1200px;
          position: relative;
          width: 100%;
        }
        .team-lead-card {
          --team-depth-active: 0;
          --team-bg-x: 0px;
          --team-bg-y: 0px;
          --team-person-x: 0px;
          --team-person-y: 0px;
          background: #173040;
          border-radius: 28px;
          box-shadow:
            0 34px 88px rgba(47,49,90,0.18),
            inset 0 0 0 1px rgba(255,255,255,0.12);
          height: 100%;
          isolation: isolate;
          overflow: hidden;
          position: relative;
          transform: translateZ(0);
          transform-origin: center;
          min-height: clamp(520px, 46vw, 690px);
          transition: box-shadow 0.36s ease;
        }
        .team-lead-card::before {
          background:
            radial-gradient(circle at calc(48% + var(--team-person-x, 0px)) 24%, rgba(232,201,122,0.28), transparent 33%),
            radial-gradient(circle at 36% 18%, rgba(255,255,255,0.14), transparent 28%),
            radial-gradient(circle at 50% 74%, rgba(10,18,28,0.5), transparent 42%);
          content: "";
          inset: 0;
          opacity: 0.78;
          position: absolute;
          z-index: 2;
        }
        .team-lead-card::after {
          background:
            radial-gradient(circle at 50% 17%, rgba(255,255,255,0.16), transparent 24%),
            linear-gradient(90deg, rgba(15,17,40,0.34), transparent 30%, transparent 74%, rgba(15,17,40,0.32)),
            linear-gradient(0deg, rgba(15,17,40,0.58), transparent 45%);
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
          z-index: 4;
        }
        .team-lead-ambient,
        .team-lead-rim {
          pointer-events: none;
          position: absolute;
        }
        .team-lead-ambient {
          background:
            radial-gradient(ellipse at 52% 34%, rgba(255,218,134,0.22), transparent 32%),
            radial-gradient(ellipse at 52% 70%, rgba(255,255,255,0.09), transparent 34%);
          filter: blur(10px);
          inset: 0;
          opacity: calc(0.52 + var(--team-depth-active) * 0.18);
          transform: translate3d(calc(var(--team-person-x) * 0.28), calc(var(--team-person-y) * 0.22), 0);
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        .team-lead-rim {
          border-radius: 999px;
          box-shadow:
            0 0 70px rgba(232,201,122,0.24),
            0 0 22px rgba(255,244,205,0.18);
          height: 64%;
          left: 50%;
          opacity: calc(0.42 + var(--team-depth-active) * 0.18);
          top: 10%;
          transform: translate3d(calc(-50% + var(--team-person-x) * 0.38), calc(var(--team-person-y) * 0.24), 0);
          width: 56%;
          z-index: 2;
        }
        .team-lead-bg,
        .team-lead-person {
          display: block;
          position: absolute;
        }
        .team-lead-bg {
          filter: blur(0.65px) saturate(1.04) contrast(1.05);
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: translate3d(var(--team-bg-x), var(--team-bg-y), 0) scale(1.055);
          transition: filter 0.32s ease;
          width: 100%;
          z-index: 1;
        }
        .team-lead-person {
          bottom: -1.5%;
          filter:
            drop-shadow(0 34px 48px rgba(2,8,17,0.34))
            drop-shadow(0 0 10px rgba(232,201,122,0.12));
          height: 98%;
          left: 50%;
          max-width: none;
          object-fit: contain;
          object-position: center bottom;
          transform: translate3d(calc(-50% + var(--team-person-x)), var(--team-person-y), 0) scale(1.045);
          transform-origin: center bottom;
          transition: filter 0.32s ease;
          width: auto;
          z-index: 3;
        }
        @media (hover: hover) and (pointer: fine) {
          .team-lead-card:hover {
            box-shadow:
              0 40px 98px rgba(47,49,90,0.22),
              inset 0 0 0 1px rgba(255,255,255,0.18);
          }
          .team-lead-card:hover .team-lead-bg {
            filter: blur(1.15px) saturate(1.08) contrast(1.07);
          }
          .team-lead-card:hover .team-lead-person {
            filter:
              drop-shadow(0 38px 58px rgba(2,8,17,0.4))
              drop-shadow(0 0 14px rgba(232,201,122,0.2));
          }
        }
        .team-lead-caption {
          bottom: 1.85rem;
          color: #fff;
          left: 2rem;
          position: absolute;
          right: 2rem;
          z-index: 5;
        }
        .team-lead-caption span {
          color: #d8bd6a;
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          margin-bottom: 0.35rem;
          text-transform: uppercase;
        }
        .team-lead-caption strong {
          display: block;
          font-size: clamp(1.55rem, 2.35vw, 2.2rem);
          line-height: 1.05;
        }
        .team-copy {
          margin-bottom: clamp(1.1rem, 1.8vw, 1.75rem);
          max-width: none;
        }
        .team-copy .section-eyebrow {
          color: #c0a044;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          margin: 0 0 0.6rem;
          text-transform: uppercase;
        }
        .team-copy h2 {
          color: #2f315a;
          font-size: var(--heading-lg);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.18;
          margin: 0 0 0.85rem;
        }
        .team-copy p {
          color: rgba(47,49,90,0.68);
          font-size: clamp(0.95rem, 1.2vw, 1.08rem);
          line-height: 1.75;
          margin: 0;
        }
        .team-photo-wall {
          display: grid;
          gap: clamp(0.65rem, 1vw, 1rem);
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-auto-rows: clamp(82px, 7vw, 126px);
          min-height: clamp(390px, 35vw, 520px);
          position: relative;
        }
        .team-photo-wall::before,
        .team-photo-wall::after {
          background: rgba(47,49,90,0.08);
          border-radius: 22px;
          content: "";
          filter: blur(6px);
          position: absolute;
          z-index: 0;
        }
        .team-photo-wall::before {
          height: 78px;
          right: 7%;
          top: 2%;
          width: 78px;
        }
        .team-photo-wall::after {
          bottom: 5%;
          height: 96px;
          left: 5%;
          width: 96px;
        }
        .team-tile {
          background: #e6e6ea;
          border: 1px solid rgba(47,49,90,0.1);
          border-radius: 18px;
          box-shadow: 0 18px 46px rgba(47,49,90,0.07);
          grid-column: span 2;
          grid-row: span 2;
          overflow: hidden;
          position: relative;
          transform: translateZ(0);
          transform-origin: center;
          transition: transform 0.36s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.36s ease, z-index 0s;
          z-index: 1;
        }
        .team-tile--wide { grid-column: span 4; grid-row: span 2; }
        .team-tile--medium { grid-column: span 2; grid-row: span 2; }
        .team-tile--small { grid-column: span 2; grid-row: span 1; }
        .team-tile--short { grid-column: span 3; grid-row: span 1; }
        .team-tile--lift { transform: translateY(-18px); }
        .team-tile--drop { transform: translateY(20px); }
        .team-tile img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.36s ease;
          width: 100%;
        }
        .team-tile::after {
          background: linear-gradient(0deg, rgba(15,17,40,0.58), transparent 58%);
          content: "";
          inset: 0;
          opacity: 0.9;
          position: absolute;
        }
        .team-tile span {
          bottom: 0.85rem;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 800;
          left: 0.9rem;
          letter-spacing: 0.04em;
          position: absolute;
          right: 0.9rem;
          z-index: 2;
        }
        @media (hover: hover) and (pointer: fine) {
          .team-tile:hover {
            box-shadow: 0 32px 82px rgba(23,25,54,0.2);
            transform: scale(1.12);
            z-index: 5;
          }
          .team-tile:hover img {
            filter: saturate(1.06) contrast(1.04);
            transform: scale(1.18);
          }
          .team-tile--lift:hover {
            transform: translateY(-18px) scale(1.12);
          }
          .team-tile--drop:hover {
            transform: translateY(20px) scale(1.12);
          }
        }
        @media (min-width: 1025px) {
          .team-copy p {
            white-space: nowrap;
          }
        }
        @media (max-width: 1024px) {
          .our-team-wrap {
            grid-template-columns: 1fr;
          }
          .team-lead {
            margin: 0 auto;
            max-width: 560px;
            width: min(86vw, 560px);
          }
          .team-lead-card {
            border-radius: 24px;
            min-height: clamp(480px, 80vw, 680px);
            transform: none;
          }
          .team-copy {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }
          .team-copy p {
            white-space: normal;
          }
          .team-photo-wall {
            grid-auto-rows: clamp(74px, 13vw, 124px);
            min-height: auto;
          }
        }
        @media (max-width: 640px) {
          .our-team-section {
            padding: 3.25rem 0;
          }
          .team-lead {
            width: min(100%, 390px);
          }
          .team-lead-card {
            border-radius: 22px;
            min-height: 520px;
          }
          .team-lead-bg {
            filter: blur(0.35px) saturate(1.04) contrast(1.05);
          }
          .team-photo-wall {
            gap: 0.55rem;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-auto-rows: 76px;
          }
          .team-tile,
          .team-tile--wide,
          .team-tile--medium,
          .team-tile--small {
            border-radius: 16px;
            grid-column: span 2;
            grid-row: span 2;
            transform: none;
          }
          .team-tile--short {
            grid-column: span 2;
            grid-row: span 1;
          }
          .team-tile span {
            font-size: 0.68rem;
          }
        }
      `}</style>
      <div className="content-wrap our-team-wrap">
        <div className="team-gallery-panel">
          <div className="team-copy">
            <p className="section-eyebrow">People Behind Every Solution</p>
            <h2 id="our-team-title">Our Team</h2>
            <p>
              Practical teams. Clear support. Reliable follow-through.
            </p>
          </div>
          <div className="team-photo-wall" aria-label="Department team gallery">
            {teamTiles.map((tile) => (
              <figure className={tile.className} key={tile.label}>
                <img src={tile.image} alt={`${tile.label} team`} loading="lazy" decoding="async" />
                <span>{tile.label}</span>
              </figure>
            ))}
          </div>
        </div>

        <div className="team-lead" aria-label="Executive Manager Leow Chuen Hock">
          <div
            className="team-lead-card"
            ref={leadCardRef}
            onMouseMove={handleLeadMove}
            onMouseLeave={resetLeadDepth}
          >
            <img
              className="team-lead-bg"
              src="/images/team/ch-leow-background.webp"
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <span className="team-lead-ambient" aria-hidden="true" />
            <span className="team-lead-rim" aria-hidden="true" />
            <img
              className="team-lead-person"
              src="/images/team/ch-leow-portrait.webp"
              alt="Executive Manager Leow Chuen Hock"
              loading="lazy"
              decoding="async"
            />
            <div className="team-lead-caption">
              <span>Executive Manager</span>
              <strong>Leow Chuen Hock</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
