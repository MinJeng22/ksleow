import React from 'react';

/**
 * Parses a string and wraps "+ 8%SST" or "+ 8% SST" in a smaller span.
 * If the input is not a string, it returns it unchanged.
 */
export function formatSST(text) {
  if (typeof text !== 'string') return text;
  
  const sstMatch = text.match(/(\s*\+\s*8%SST)/i);
  if (!sstMatch) return text;

  const parts = text.split(/(\s*\+\s*8%SST)/i);
  return (
    <>
      {parts.map((part, i) =>
        /^\s*\+\s*8%SST$/i.test(part) ? (
          <span key={i} style={{ fontSize: "0.75em", fontWeight: "normal", opacity: 0.8, marginLeft: "0.2em" }}>
            {part.trim()}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
