export default function SectionHeader({
  eyebrow,
  title,
  children,
  className = "",
  align = "left",
  style,
}) {
  return (
    <div className={`ks-section-header ks-section-header--${align}${className ? ` ${className}` : ""}`} style={style}>
      {eyebrow && <div className="ks-section-eyebrow">{eyebrow}</div>}
      {title && <h2 className="ks-section-title">{title}</h2>}
      {children && <p className="ks-section-intro">{children}</p>}
    </div>
  );
}

