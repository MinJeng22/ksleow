export function PinnedHeroStage({ children, className = "", style }) {
  return (
    <div className={`pinned-hero-stage${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}
