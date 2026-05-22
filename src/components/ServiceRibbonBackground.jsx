import { useEffect, useRef } from "react";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const catmullRom = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    ),
    y: 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    ),
  };
};

function buildPath(width, height) {
  const mobile = width < 640;
  const controls = mobile
    ? [
        { x: -0.14 * width, y: 0.14 * height },
        { x: 0.14 * width, y: 0.29 * height },
        { x: 0.74 * width, y: 0.42 * height },
        { x: 0.18 * width, y: 0.6 * height },
        { x: 0.82 * width, y: 0.78 * height },
        { x: 1.1 * width, y: 0.98 * height },
      ]
    : [
        { x: -0.1 * width, y: 0.16 * height },
        { x: 0.28 * width, y: 0.3 * height },
        { x: 0.06 * width, y: 0.58 * height },
        { x: 0.42 * width, y: 0.62 * height },
        { x: 0.62 * width, y: 0.18 * height },
        { x: 1.08 * width, y: 0.36 * height },
        { x: 0.82 * width, y: 0.56 * height },
        { x: 1.05 * width, y: 0.78 * height },
      ];

  const padded = [controls[0], ...controls, controls[controls.length - 1]];
  const points = [];
  const samples = mobile ? 36 : 44;

  for (let i = 0; i < padded.length - 3; i += 1) {
    for (let step = 0; step < samples; step += 1) {
      points.push(catmullRom(
        padded[i],
        padded[i + 1],
        padded[i + 2],
        padded[i + 3],
        step / samples
      ));
    }
  }
  points.push(controls[controls.length - 1]);

  const lengths = [0];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    lengths.push(total);
  }

  return { points, lengths, total };
}

function partialPoints(path, progress) {
  if (!path.points.length || progress <= 0) return [];

  const target = path.total * clamp(progress);
  const result = [path.points[0]];

  for (let i = 1; i < path.points.length; i += 1) {
    if (path.lengths[i] < target) {
      result.push(path.points[i]);
      continue;
    }

    const prevLength = path.lengths[i - 1];
    const segmentLength = path.lengths[i] - prevLength || 1;
    const segmentProgress = clamp((target - prevLength) / segmentLength);
    const prev = path.points[i - 1];
    const next = path.points[i];
    result.push({
      x: prev.x + (next.x - prev.x) * segmentProgress,
      y: prev.y + (next.y - prev.y) * segmentProgress,
    });
    break;
  }

  return result;
}

function drawPolyline(ctx, points, width, color, alpha, shadow = 0, offsetY = 0) {
  if (points.length < 2) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y + offsetY);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y + offsetY);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgba(${color}, ${alpha})`;
  ctx.shadowColor = `rgba(${color}, ${Math.min(alpha, 0.32)})`;
  ctx.shadowBlur = shadow;
  ctx.stroke();
  ctx.restore();
}

export default function ServiceRibbonBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let path = buildPath(1, 1);
    let targetProgress = 0;
    let progress = 0;
    let rafId = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateProgress = () => {
      const section = canvas.parentElement;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const triggerLine = window.innerHeight * 0.36;
      const travel = Math.max(rect.height * 0.9, 1);
      targetProgress = clamp((triggerLine - rect.top) / travel);

      if (motionQuery.matches) {
        progress = targetProgress;
        draw();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      path = buildPath(width, height);
      updateProgress();
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const visible = partialPoints(path, progress);
      const strokeWidth = width < 640 ? 9 : 12;
      const glowWidth = strokeWidth * 2.6;
      const blue = "69, 90, 220";
      const gold = "201, 168, 76";

      drawPolyline(ctx, visible, glowWidth, blue, 0.1, 28);
      drawPolyline(ctx, visible, strokeWidth + 5, blue, 0.18, 14);
      drawPolyline(ctx, visible, strokeWidth, blue, 0.86, 0);

      if (progress > 0.14) {
        const accent = partialPoints(path, Math.max(0, progress - 0.08));
        drawPolyline(ctx, accent, Math.max(3, strokeWidth * 0.34), gold, 0.34, 8, strokeWidth * 1.15);
      }

      const head = visible[visible.length - 1];
      if (head) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(head.x, head.y, strokeWidth * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${blue}, 0.72)`;
        ctx.shadowColor = `rgba(${blue}, 0.32)`;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
      }
    };

    const tick = () => {
      if (!motionQuery.matches) {
        progress += (targetProgress - progress) * 0.12;
        if (Math.abs(targetProgress - progress) < 0.001) progress = targetProgress;
        draw();
        rafId = requestAnimationFrame(tick);
      }
    };

    resize();

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    updateProgress();
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.72,
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.4) 18%, #000 34%, #000 100%)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.4) 18%, #000 34%, #000 100%)",
      }}
    />
  );
}
