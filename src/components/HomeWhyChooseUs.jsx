import { useEffect, useRef, useState } from "react";
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
  {
    roman: "IV",
    title: "Our standard",
    desc: "Experience since 1981 paired with modern software, keeping clients compliant, organized, and ready to grow.",
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

function StatCounter({ targetValue, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  // Parse numeric part. If it fails, fallback to 0
  const target = parseFloat(targetValue.replace(/,/g, '')) || 0;
  const isFloat = !Number.isInteger(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === 0) return;

    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          let startTime = null;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = easeOut * target;
            setCount(current);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  if (target === 0) {
    return (
      <strong>
        {targetValue}
        {suffix ? <span>{suffix}</span> : null}
      </strong>
    );
  }

  const displayValue = isFloat ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <strong ref={ref}>
      {displayValue}
      {suffix ? <span>{suffix}</span> : null}
    </strong>
  );
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
          <p className="ks-eyebrow home-why-editorial-eyebrow">Why Choose Us</p>
          <h2 id="home-why-heading" className="ks-section-title ks-section-title-lg">Our Vision, Mission and Values</h2>
        </header>

        <div className="home-why-editorial-grid" aria-label="K.S. Leow Group principles">
          {PRINCIPLES.map((item) => (
            <article className="home-why-editorial-item" key={item.roman}>
              <span className="home-why-editorial-roman" aria-hidden="true">
                {item.roman}
              </span>
              <h3>
                <span className="home-why-editorial-title-roman" aria-hidden="true">
                  {item.roman}
                </span>
                {item.title}
              </h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="home-why-editorial-stats" aria-label="K.S. Leow Group key statistics">
          {STATS.map((item) => {
            const stat = splitStatNumber(item.number);
            return (
              <div className="home-why-editorial-stat" key={item.label}>
                <StatCounter targetValue={stat.value} suffix={stat.suffix} duration={1500} />
                <small>{item.label}</small>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
