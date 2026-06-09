import React from "react";

export function getEditionColumnIndexes(allEditions, selected) {
  const visibleEditions = selected?.length ? selected : allEditions;
  return visibleEditions.map((edition) => allEditions.indexOf(edition));
}

export function filterEditionValues(values, columnIndexes) {
  return columnIndexes.map((index) => values[index]);
}

export function editionRowDiffers(values, columnIndexes) {
  const visibleValues = filterEditionValues(values, columnIndexes);
  return !visibleValues.every((value) => value === visibleValues[0]);
}

export function CompareFeatureCell({ children, meta, className = "ks-compare-td-data", style }) {
  return (
    <td className={`ks-compare-td-left ${className}`} style={style}>
      {children}
      {meta && <span className="ks-compare-td-price">{meta}</span>}
    </td>
  );
}

