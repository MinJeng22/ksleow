import { Img } from "../Media.jsx";

const LAYOUT_CLASSES = [
  "ks-bento-left",
  "ks-bento-mid-top",
  "ks-bento-mid-bottom",
  "ks-bento-right",
];

export function BentoGrid({ items = [], minItems = 4, imageFor, onOpen, className = "" }) {
  const displayItems = [...items];
  while (displayItems.length < minItems) {
    displayItems.push({ isEmpty: true, key: `empty-${displayItems.length}` });
  }

  return (
    <div className={`ks-bento${className ? ` ${className}` : ""}`}>
      {displayItems.slice(0, minItems).map((item, index) => (
        <BentoCard
          key={item.key || index}
          item={item}
          index={index}
          layoutClass={LAYOUT_CLASSES[index] || ""}
          image={imageFor?.(item)}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export function BentoCard({ item, index, layoutClass = "", image, onOpen }) {
  const isEmpty = item?.isEmpty;
  const clickable = !isEmpty && !!(item?.route || item?.modal || item?.href);

  const handleOpen = () => {
    if (clickable) onOpen?.(item, index);
  };

  return (
    <article
      id={item?.modal ? `${item.modal}-card` : undefined}
      className={`ks-bento-card ${layoutClass}${index === 0 || index === 3 ? " is-tall" : " is-wide"}${clickable ? " is-clickable" : ""}${isEmpty ? " is-empty" : ""}`}
      onClick={clickable ? handleOpen : undefined}
      onKeyDown={clickable ? (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleOpen();
      } : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-hidden={isEmpty ? "true" : undefined}
    >
      <div className="ks-bento-media">
        {image && !isEmpty ? (
          <Img
            src={image}
            alt={item.title}
            className="ks-bento-img"
            protect={false}
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="ks-bento-placeholder" />
        )}
      </div>
      <div className="ks-bento-body">
        {!isEmpty && (
          <>
            <h3 className="site-card-title ks-bento-title">{item.title}</h3>
            <p className="site-card-copy ks-bento-copy">{item.desc}</p>
            {clickable && (
              <span className="ks-learn-more ks-bento-link">
                Learn more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            )}
          </>
        )}
      </div>
    </article>
  );
}
