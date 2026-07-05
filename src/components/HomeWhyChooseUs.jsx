import stats from "../content/stats.json";

const WHY_POINTS = [
  {
    kicker: "Our Approach",
    title: "Precision Without the Pitch",
    body:
      "We work efficiently and meticulously, without hard-selling. Our focus is long-term trust with SMEs across Malaysia, built through sincerity and professional follow-through.",
  },
  {
    kicker: "Our Expertise",
    title: "Doers, Not Just Advisors",
    body:
      "From company registration and compliance to Accounting, POS, IT systems, and website development, we handle the work end to end so clients can move faster.",
  },
  {
    kicker: "Our Value",
    title: "Simplifying Your Success",
    body:
      "We help SME owners standardize operations, reduce manual work, and make everyday business decisions clearer, simpler, and more profitable.",
  },
  {
    kicker: "Our Edge",
    title: "Legacy Meets Innovation",
    body:
      "With business experience dating back to 1981, we understand Malaysian compliance deeply while delivering modern IT and system solutions that keep evolving.",
  },
];

const STAT_ITEMS = stats.items || [];

export default function HomeWhyChooseUs({ teamPhoto = "/images/team/group-photo-placeholder.jpg" }) {
  return (
    <section id="why-ksl" className="home-section home-snap-panel-scroll home-why-section" aria-labelledby="home-why-title">
      <div className="home-why-bg" aria-hidden="true">
        <img src={teamPhoto} alt="" loading="eager" decoding="async" fetchpriority="high" />
      </div>
      <div className="home-why-scrim" aria-hidden="true" />
      <div className="home-why-glow home-why-glow-a" aria-hidden="true" />
      <div className="home-why-glow home-why-glow-b" aria-hidden="true" />

      <div className="content-wrap home-why-content">
        <div className="home-why-hero">
          <div className="home-why-copy">
            <div className="ks-eyebrow-chip home-why-eyebrow">Why Choose Us</div>
            <h2 id="home-why-title" className="ks-section-title home-why-title">
              Practical business support, delivered with quiet precision.
            </h2>
            <p className="home-why-lede">
              Top AutoCount Dealer in Pahang State for 6 award-winning years, empowering your business with proven expertise, prompt on-site support, and dedicated training.
            </p>
          </div>

          <div className="home-why-stats" aria-label="K.S. Leow Group statistics">
            {STAT_ITEMS.map((item) => (
              <div className="home-why-stat" key={`${item.num}-${item.label}`}>
                <strong>{item.num}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home-why-grid" aria-label="Why clients choose K.S. Leow Group">
          {WHY_POINTS.map((point) => (
            <article className="home-why-card" key={point.title}>
              <div className="home-why-card-core">
                <span>{point.kicker}</span>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
