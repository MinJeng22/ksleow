import React from "react";

/* ── Helpers (same logic as Accounting / CloudAccounting pages) ──── */

function getEditionColumnIndexes(allEditions, selected) {
  if (!selected || selected.length === 0) return allEditions.map((_, i) => i);
  return selected.map(e => allEditions.indexOf(e)).filter(i => i >= 0);
}

function filterEditionValues(values, colIndexes) {
  return colIndexes.map(i => values[i]);
}

function editionRowDiffers(values, colIndexes) {
  const filtered = filterEditionValues(values, colIndexes);
  if (filtered.length <= 1) return false;
  return new Set(filtered).size > 1;
}

/* ── Value renderer — matches the premium look of Accounting tables ── */

function RenderValue({ value, accentColor }) {
  if (value === "-" || value === "") {
    return <span style={{ color: "#c8c8d0", fontWeight: 400, fontSize: "1rem", lineHeight: 1 }}>—</span>;
  }
  if (value === "+") {
    return <span style={{ display: "inline-block", width: 11, height: 11, borderRadius: "50%", background: accentColor }} />;
  }
  if (typeof value === "string") {
    if (value.startsWith("+ ")) {
      return (
        <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ display: "inline-block", width: 11, height: 11, borderRadius: "50%", background: accentColor }} />
          <span style={{ fontSize: "0.72rem", color: "#6b6f91", lineHeight: 1.3 }}>{value.slice(2)}</span>
        </span>
      );
    }

    const sstMatch = value.match(/(\s*\+\s*8%SST)/i);
    if (sstMatch) {
      const parts = value.split(/(\s*\+\s*8%SST)/i);
      return (
        <span>
          {parts.map((part, i) =>
            /^\s*\+\s*8%SST$/i.test(part) ? (
              <span key={i} style={{ fontSize: "0.75em", fontWeight: "normal", opacity: 0.8, marginLeft: "0.2em" }}>
                {part.trim()}
              </span>
            ) : (
              part
            )
          )}
        </span>
      );
    }
  }

  return <span>{value}</span>;
}

/* ── Main component ────────────────────────────────────────────── */

export default function SharedEditionsTable({
  editions,
  topRows = [],
  sections = [],
  selected = null,
  diffOnly = false,
  thColor = "#80c31e",
  featureColumnLabel = "Feature",
}) {
  const cols = (selected && selected.length > 0) ? selected : editions;
  const colIdx = getEditionColumnIndexes(editions, selected);
  const filterRow = (values) => filterEditionValues(values, colIdx);
  const rowDiffers = (values) => editionRowDiffers(values, colIdx);

  const theadRef = React.useRef(null);
  const tbodyRef = React.useRef(null);

  const handleHeadScroll = (e) => {
    if (tbodyRef.current) tbodyRef.current.scrollLeft = e.target.scrollLeft;
  };
  const handleBodyScroll = (e) => {
    if (theadRef.current) theadRef.current.scrollLeft = e.target.scrollLeft;
  };

  return (
    <div className="ks-compare-panel" style={{ maxWidth: cols.length <= 4 ? 1180 : "none", margin: cols.length <= 4 ? "0 auto" : "0" }}>
      <div className="ks-compare-wrap">
        <table className="ks-compare-table" style={{
          "--edition-count": cols.length,
          "--mobile-table-width": cols.length > 3 ? `${cols.length * 75}px` : "100%"
        }}>
          <colgroup>
            <col className="ks-compare-col-feature" width="31%" />
            {cols.map((edition) => (
              <col key={edition} className="ks-compare-col-edition" width={`${69 / cols.length}%`} />
            ))}
          </colgroup>

          {/* ── Header ── */}
          <thead className="ks-compare-thead" ref={theadRef} onScroll={handleHeadScroll}>
            <tr style={{ "--th-bg": thColor }}>
              <th className="ks-compare-th ks-compare-th-left">{featureColumnLabel}</th>
              {cols.map(e => (
                <th key={e} className="ks-compare-th">
                  <span className="ks-compare-edition-name">{e}</span>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody className="ks-compare-tbody" ref={tbodyRef} onScroll={handleBodyScroll}>

            {/* Top rows (pricing, best-for, etc.) */}
            {topRows.map((row, rIdx) => {
              if (diffOnly && !rowDiffers(row[1])) return null;
              return (
                <tr key={`top-${rIdx}`} className="ks-compare-tr-book">
                  <td className="ks-compare-td-left ks-compare-td-book" style={{ background: "inherit", fontWeight: 500 }}>
                    {row[0]}
                  </td>
                  {filterRow(row[1]).map((v, i) => (
                    <td key={i} className="ks-compare-td-book">
                      <RenderValue value={v} accentColor={thColor} />
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Section groups */}
            {sections.map(section => {
              const rows = diffOnly
                ? section.rows.filter(([, values]) => rowDiffers(values))
                : section.rows;
              if (rows.length === 0) return null;

              return (
                <React.Fragment key={section.name}>
                  <tr className="ks-compare-tr-section">
                    <td colSpan={cols.length + 1} className="ks-compare-td-section">
                      {section.name}
                    </td>
                  </tr>
                  {rows.map(([rowName, values], rIdx) => {
                    const visibleVals = filterRow(values);
                    return (
                      <tr key={`${section.name}-${rIdx}`} className="ks-compare-tr-data">
                        <td className="ks-compare-td-left ks-compare-td-data" style={{ fontWeight: 500 }}>
                          {rowName}
                        </td>
                        {visibleVals.map((v, vi) => (
                          <td key={vi} className="ks-compare-td-data">
                            <RenderValue value={v} accentColor={thColor} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
