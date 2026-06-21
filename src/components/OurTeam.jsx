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
  return (
    <section className="our-team-section" id="our-team" aria-labelledby="our-team-title">
      <style>{`
        .our-team-section {
          background:
            radial-gradient(circle at 14% 12%, rgba(201,168,76,0.12), transparent 30%),
            linear-gradient(180deg, #f5f5f8 0%, #ffffff 48%, #f2f3f7 100%);
          overflow: hidden;
          padding: clamp(4.5rem, 8vw, 7.5rem) 0;
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
          align-items: center;
          display: grid;
          gap: clamp(2rem, 5vw, 5.5rem);
          grid-template-columns: minmax(260px, 0.82fr) minmax(420px, 1.18fr);
          position: relative;
          z-index: 1;
        }
        .team-lead {
          perspective: 1200px;
          position: relative;
        }
        .team-lead-card {
          aspect-ratio: 0.72;
          border-radius: 30px;
          box-shadow: 0 34px 86px rgba(23,25,54,0.26);
          isolation: isolate;
          overflow: hidden;
          position: relative;
          transform: rotateY(-7deg) rotateX(2deg);
          transform-origin: center;
        }
        .team-lead-card::before {
          background: inherit;
          content: "";
          filter: blur(18px) saturate(0.92);
          inset: -10%;
          opacity: 0.75;
          position: absolute;
          transform: scale(1.04);
          z-index: -1;
        }
        .team-lead-card::after {
          background:
            linear-gradient(180deg, rgba(15,17,40,0.04), transparent 36%),
            linear-gradient(0deg, rgba(15,17,40,0.68), transparent 48%);
          content: "";
          inset: 0;
          pointer-events: none;
          position: absolute;
        }
        .team-lead-card img {
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transform: scale(1.025);
          width: 100%;
        }
        .team-lead-caption {
          bottom: 1.25rem;
          color: #fff;
          left: 1.35rem;
          position: absolute;
          right: 1.35rem;
          z-index: 2;
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
          font-size: clamp(1.45rem, 2.4vw, 2.15rem);
          line-height: 1.05;
        }
        .team-copy {
          margin-bottom: clamp(1.35rem, 2vw, 2rem);
          max-width: 680px;
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
          font-size: clamp(2rem, 4vw, 3.65rem);
          letter-spacing: -0.035em;
          line-height: 0.98;
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
          gap: clamp(0.6rem, 1vw, 0.95rem);
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-auto-rows: clamp(72px, 8vw, 132px);
          min-height: clamp(360px, 40vw, 560px);
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
          border: 1px solid rgba(47,49,90,0.08);
          border-radius: 22px;
          box-shadow: 0 20px 48px rgba(23,25,54,0.08);
          grid-column: span 2;
          grid-row: span 2;
          overflow: hidden;
          position: relative;
          transform: translateZ(0);
          transition: transform 0.36s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.36s ease, z-index 0s;
          z-index: 1;
        }
        .team-tile--wide { grid-column: span 3; grid-row: span 2; }
        .team-tile--medium { grid-column: span 2; grid-row: span 2; }
        .team-tile--small { grid-column: span 2; grid-row: span 1; }
        .team-tile--short { grid-row: span 1; }
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
            transform: translateY(-8px) scale(1.075);
            z-index: 5;
          }
          .team-tile:hover img {
            filter: saturate(1.06) contrast(1.04);
            transform: scale(1.11);
          }
          .team-tile--lift:hover,
          .team-tile--drop:hover {
            transform: translateY(-8px) scale(1.075);
          }
        }
        @media (max-width: 1024px) {
          .our-team-wrap {
            grid-template-columns: 1fr;
          }
          .team-lead {
            margin: 0 auto;
            max-width: 420px;
            width: min(76vw, 420px);
          }
          .team-lead-card {
            transform: none;
          }
          .team-copy {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }
          .team-photo-wall {
            grid-auto-rows: clamp(74px, 13vw, 124px);
            min-height: auto;
          }
        }
        @media (max-width: 640px) {
          .our-team-section {
            padding: 4rem 0;
          }
          .team-lead {
            width: min(86vw, 360px);
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
            grid-row: span 1;
          }
          .team-tile span {
            font-size: 0.68rem;
          }
        }
      `}</style>
      <div className="content-wrap our-team-wrap">
        <div className="team-lead" aria-label="Executive Manager">
          <div
            className="team-lead-card"
            style={{ backgroundImage: "url('/images/team/executive-manager.webp')" }}
          >
            <img
              src="/images/team/executive-manager.webp"
              alt="Executive Manager"
              loading="lazy"
              decoding="async"
            />
            <div className="team-lead-caption">
              <span>Executive Manager</span>
              <strong>Leading with clarity, care, and execution.</strong>
            </div>
          </div>
        </div>

        <div>
          <div className="team-copy">
            <p className="section-eyebrow">Our Team</p>
            <h2 id="our-team-title">People behind every solution.</h2>
            <p>
              From advisory and compliance to software implementation and support, each department brings practical experience to help clients move with confidence.
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
      </div>
    </section>
  );
}
