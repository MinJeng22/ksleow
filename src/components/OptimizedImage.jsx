import { useEffect, useState } from "react";
import { optimizedImageSrc } from "../utils/imageOptimization.js";

export default function OptimizedImage({ src, onError, ...props }) {
  const [fallback, setFallback] = useState(false);
  const optimizedSrc = optimizedImageSrc(src);
  const resolvedSrc = fallback ? src : optimizedSrc;

  useEffect(() => {
    setFallback(false);
  }, [src]);

  function handleError(event) {
    if (!fallback && optimizedSrc !== src) {
      setFallback(true);
      return;
    }
    onError?.(event);
  }

  return <img {...props} src={resolvedSrc} onError={handleError} />;
}
