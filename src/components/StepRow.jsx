export function StepNum({ n, color = "#2f315a" }) {
  const textColor = color === "#2f315a" ? "#ffffff" : "#1e2040";

  return (
    <span className="step-num" style={{ background: color, color: textColor }}>
      {n}
    </span>
  );
}

export default function StepRow({
  n,
  children,
  color = "#2f315a",
  className = "",
}) {
  return (
    <div className={`step-row${className ? ` ${className}` : ""}`}>
      <StepNum n={n} color={color} />
      <div className="step-row-body ks-body-text">{children}</div>
    </div>
  );
}
