import stats from "../content/stats.json";

const PRINCIPLES = [
  {
    roman: "I",
    title: "Our vision",
    desc: "To be the leading business solutions partner in Pahang, driving digital transformation and sustainable growth for every client.",
  },
  {
    roman: "II",
    title: "Our mission",
    desc: "To deliver precise, end-to-end accounting and IT systems with unwavering integrity, allowing business owners to focus on moving faster.",
  },
  {
    roman: "III",
    title: "Our values",
    desc: "Efficiency, continuous innovation, and quiet precision. We build long-term trust through honest work without the hard-sell.",
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
          <h2 id="home-why-heading" className="ks-section-title ks-section-title-lg">Our Vision, Mission and Values</h2>
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
