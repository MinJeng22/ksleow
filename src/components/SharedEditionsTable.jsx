import React from "react";

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

function RenderValue({ value }) {
  if (value === "-" || value === "") {
    return <span style={{ color: "#9aa", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>-</span>;
  }
  if (value === "+") {
    return <span style={{ color: "#80c31e", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>+</span>;
  }
  // For "+ (something)"
  if (typeof value === "string" && value.startsWith("+ ")) {
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ color: "#80c31e", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>+</span>
        <span style={{ fontSize: "0.75rem", color: "#6b6f91", marginTop: 4 }}>{value.replace("+ ", "")}</span>
      </span>
    );
  }
  return <span style={{ fontSize: "0.85rem", color: "#2f315a" }}>{value}</span>;
}

export default function SharedEditionsTable({ editions, topRows = [], sections = [], selected = null, diffOnly = false, thColor = "#80c31e", thIcon = null }) {
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
    <div className="ks-compare-panel" style={{ maxWidth: cols.length <= 4 ? 1180 : 'none', margin: cols.length <= 4 ? '0 auto' : '0' }}>
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
          <thead className="ks-compare-thead" ref={theadRef} onScroll={handleHeadScroll}>
            <tr style={{ "--th-bg": thColor }}>
              <th className="ks-compare-th ks-compare-th-left">
                {thIcon && <span style={{ marginRight: 6 }}>{thIcon}</span>}
                Compare Plans
              </th>
              {cols.map(e => (
                <th key={e} className="ks-compare-th">
                  <span className="ks-compare-edition-name">{e}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="ks-compare-tbody" ref={tbodyRef} onScroll={handleBodyScroll}>
            {topRows.map((row, rIdx) => {
              if (diffOnly && !rowDiffers(row[1])) return null;
              return (
                <tr key={`top-${rIdx}`} className="ks-compare-tr-book">
                  <td className="ks-compare-td-left ks-compare-td-book" style={{ background: "inherit", fontWeight: 500 }}>
                    {row[0]}
                  </td>
                  {filterRow(row[1]).map((v, i) => (
                    <td key={i} className="ks-compare-td-book" style={{ textAlign: "center" }}>
                      <RenderValue value={v} />
                    </td>
                  ))}
                </tr>
              );
            })}

            {sections.map(section => (
              <React.Fragment key={section.name}>
                {(!diffOnly || section.rows.some(r => rowDiffers(r[1]))) && (
                  <tr className="ks-compare-tr-section">
                    <td colSpan={cols.length + 1} className="ks-compare-td-section">
                      {section.name}
                    </td>
                  </tr>
                )}
                {section.rows.map((row, rIdx) => {
                  if (diffOnly && !rowDiffers(row[1])) return null;
                  return (
                    <tr key={`${section.name}-${rIdx}`} className="ks-compare-tr-feature">
                      <td className="ks-compare-td-left">{row[0]}</td>
                      {filterRow(row[1]).map((v, i) => (
                        <td key={i} className="ks-compare-td-check">
                          <RenderValue value={v} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
