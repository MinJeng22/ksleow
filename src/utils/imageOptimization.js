const LOCAL_RASTER_RE = /\.(png|jpe?g)(\?.*)?$/i;

export function optimizedImageSrc(src) {
  if (typeof src !== "string" || !src) return src;
  if (!src.startsWith("/") || src.startsWith("/assets/")) return src;
  return src.replace(LOCAL_RASTER_RE, ".optimized.webp$2");
}
