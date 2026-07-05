import stats from "../content/stats.json";

const PRINCIPLES = [
  {
    roman: "I",
    title: "Our vision",
    desc: "Help Malaysian SMEs run with confidence through clearer compliance, practical systems and steady support.",
  },
  {
    roman: "II",
    title: "Our mission",
    desc: "Deliver true end-to-end execution across registration, tax, audit, accounting, POS and IT.",
  },
  {
    roman: "III",
    title: "Our values",
    desc: "Sincerity, precision and professionalism. No hard-selling, just careful long-term partnership.",
  },
  {
    roman: "IV",
    title: "Our standard",
    desc: "Experience since 1981 paired with modern software, keeping clients compliant and ready to grow.",
  },
];

const STATS = (stats.items || []).map((item) => ({
  number: String(item.num || ""),
  label: item.label,
}));

function splitStatNumber(value) {
  const match = value.match(/^(.*?)(\+)$/);
  return match ? { value: match[1], suffix: match[2] } : { value, suffix: "" };
}

export default function HomeWhyChooseUs({ teamPhoto = "/images/team/group-photo-placeholder.jpg" }) {
  return (
    <section
      id="why-ksl"
      className="home-section home-snap-panel-scroll home-why-section home-why-editorial"
      aria-labelledby="home-why-heading"
    >
      <div className="home-why-bg" aria-hidden="true">
        <img src={teamPhoto} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="home-why-editorial-overlay" aria-hidden="true" />

      <div className="content-wrap home-why-editorial-content">
        <header className="home-why-editorial-header">
          <p className="home-why-editorial-kicker">Why Choose Us</p>
          <h2 id="home-why-heading">Our vision, mission and values</h2>
          <p className="home-why-editorial-lede">
            Four decades of practical, judgement-led support for Malaysian SMEs.
          </p>
        </header>

        <div className="home-why-editorial-grid" aria-label="K.S. Leow Group principles">
          {PRINCIPLES.map((item) => (
            <article className="home-why-editorial-item" key={item.roman}>
              <span className="home-why-editorial-roman" aria-hidden="true">
                {item.roman}
              </span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="home-why-editorial-stats" aria-label="K.S. Leow Group key statistics">
          {STATS.map((item) => {
            const stat = splitStatNumber(item.number);
            return (
              <div className="home-why-editorial-stat" key={item.label}>
                <strong>
                  {stat.value}
                  {stat.suffix ? <span>{stat.suffix}</span> : null}
                </strong>
                <small>{item.label}</small>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
