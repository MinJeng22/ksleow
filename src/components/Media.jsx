/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * Media â€” protected <img> and <video> wrappers
 *
 * Two concerns rolled into one place:
 *
 *   1. Load speed
 *      â€¢ <img> default to loading="lazy" + decoding="async" so off-
 *        screen images don't block first paint.
 *      â€¢ <video> default to preload="metadata" â€” only the size/duration
 *        header is fetched up front; the body downloads when play starts.
 *      â€¢ Optional `priority` prop opts an above-the-fold image out of
 *        lazy mode and adds fetchPriority="high".
 *
 *   2. Casual anti-download
 *      â€¢ Right-click "Save image asâ€¦" â†’ suppressed (onContextMenu).
 *      â€¢ Drag-to-desktop â†’ suppressed (draggable={false}).
 *      â€¢ Native video controls download button â†’ suppressed
 *        (controlsList="nodownload") on Chromium browsers.
 *      â€¢ Picture-in-picture â†’ disabled for videos.
 *
 *      Caveat: these stop casual saves. A determined visitor can still
 *      grab assets via DevTools Network tab or a screen capture. For
 *      truly private media you'd need a signed-URL server endpoint;
 *      these wrappers are the right level of friction for public
 *      marketing pages.
 *
 *   YouTube exception: YouTube <iframe> embeds are out-of-scope on
 *   purpose. They live on youtube.com, have their own protections,
 *   and trying to wrap them only breaks the player.
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

import { forwardRef } from "react";

const noContextMenu = (e) => e.preventDefault();
const noDrag        = (e) => e.preventDefault();

const WRAPPER_STYLE_KEYS = new Set([
  "position", "inset", "top", "right", "bottom", "left", "zIndex",
  "opacity", "transform", "transition", "animation",
  "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
  "alignSelf", "justifySelf", "placeSelf", "gridArea", "gridColumn", "gridRow",
  "flex", "flexBasis", "flexGrow", "flexShrink", "order",
]);

function splitProtectedImageStyle(style = {}) {
  const wrapperStyle = {};
  const imageStyle = { ...style };

  for (const key of WRAPPER_STYLE_KEYS) {
    if (key in style) {
      wrapperStyle[key] = style[key];
      delete imageStyle[key];
    }
  }

  return {
    wrapperStyle: {
      display: style.display || "inline-block",
      lineHeight: 0,
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
      width: style.width,
      height: style.height,
      minWidth: style.minWidth,
      minHeight: style.minHeight,
      maxWidth: style.maxWidth,
      maxHeight: style.maxHeight,
      borderRadius: style.borderRadius,
      overflow: style.overflow || (style.borderRadius ? "hidden" : undefined),
      ...wrapperStyle,
      position: wrapperStyle.position || "relative",
    },
    imageStyle: {
      ...imageStyle,
      display: imageStyle.display || "block",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitUserDrag: "none",
    },
  };
}

/* â”€â”€ <Img /> â€” drop-in replacement for <img>
 *
 *   <Img src="..." alt="..." />              lazy + decode-async (default)
 *   <Img src="..." alt="..." priority />     eager + fetchPriority high
 *
 * All other native <img> props pass through (width / height / style / classNameâ€¦).
 * forwardRef so caller-side refs reach the underlying <img>.
 */
export const Img = forwardRef(function Img({
  src, alt = "", priority = false,
  loading: loadingProp,
  decoding: decodingProp,
  protect = true,
  style,
  wrapperStyle: wrapperStyleProp,
  ...rest
}, ref) {
  const renderImage = (imageStyle) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loadingProp ?? (priority ? "eager" : "lazy")}
      decoding={decodingProp ?? "async"}
      fetchpriority={priority ? "high" : "low"}
      draggable={false}
      onContextMenu={noContextMenu}
      onDragStart={noDrag}
      style={imageStyle}
      {...rest}
    />
  );

  if (!protect) return renderImage(style);

  const protectedStyle = splitProtectedImageStyle(style);
  return (
    <span
      draggable={false}
      onContextMenu={noContextMenu}
      onDragStart={noDrag}
      style={{ ...protectedStyle.wrapperStyle, ...wrapperStyleProp }}
    >
      {/*
        Transparent overlay catches right-click / drag interactions, so
        casual "Save image as..." attempts hit the empty layer instead
        of the real image. This is a deterrent, not DRM.
      */}
      {renderImage(protectedStyle.imageStyle)}
      <span
        aria-hidden="true"
        draggable={false}
        onContextMenu={noContextMenu}
        onDragStart={noDrag}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background: "rgba(255,255,255,0)",
          cursor: style?.cursor || "inherit",
        }}
      />
    </span>
  );
});

/* â”€â”€ <Vid /> â€” drop-in replacement for <video>
 *
 *   <Vid src="..." />                 preload metadata, no download UI
 *   <Vid src="..." poster="..." />    same + custom poster image
 *
 * Pass any native <video> attrs through. `controls` is opt-in: if you
 * don't pass it, the player has no native controls (suitable for the
 * Sales2DO Tutorial Video case where overlay buttons handle play/pause).
 *
 * If you do pass controls, the download item is stripped via
 * controlsList="nodownload".
 *
 * forwardRef so callers can grab the underlying <video> for play /
 * pause / currentTime control â€” Sales2DO's dual-slot crossfade
 * depends on this.
 */
export const Vid = forwardRef(function Vid({
  src, poster,
  preload: preloadProp,
  ...rest
}, ref) {
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload={preloadProp ?? "metadata"}
      playsInline
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      onContextMenu={noContextMenu}
      {...rest}
    />
  );
});

