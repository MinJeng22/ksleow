/**
 * compress-uploads.mjs — post-build image compression
 * ══════════════════════════════════════════════════════════════
 * Walks dist/ (post-Vite-build output) and rewrites every
 * JPG / PNG / WebP under `uploads/` to a smaller version:
 *
 *   • images wider than MAX_WIDTH are downscaled
 *   • PNG / JPG / WebP re-encoded with sensible quality settings
 *   • file only overwritten if the new buffer is smaller
 *   • EXIF orientation honored so portrait phone shots don't flip
 *
 * Result: admins upload full-resolution originals via the CMS
 * (committed straight into public/uploads/) and the visitor still
 * downloads a sensibly-sized asset because Vercel deploys dist/
 * — not public/ — and dist/ has been through this pass.
 *
 * The public/uploads/ source files are never touched, so the CMS
 * can keep using them and re-running the build always re-derives
 * the optimized output.
 *
 * Run automatically as the second half of `npm run build`. Skip
 * silently if sharp isn't installed (so the optional optimization
 * doesn't gate the build on machines / CI environments that haven't
 * installed it yet).
 * ══════════════════════════════════════════════════════════════ */
import fs   from "node:fs/promises";
import path from "node:path";

const ROOT      = "dist/uploads";
const MAX_WIDTH = 2000;             // px — feel free to lower (1600 for tighter)
const QUALITY   = { jpeg: 78, webp: 78, png: 80 };

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("[compress-uploads] sharp not installed — skipping. " +
    "Install with: npm i -D sharp");
  process.exit(0);
}

async function* walk(dir) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let totalSaved = 0;
let touched    = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  try {
    const orig = await fs.stat(file);
    const img  = sharp(file, { failOn: "none" }).rotate();
    const meta = await img.metadata();

    const transformer = (meta.width && meta.width > MAX_WIDTH)
      ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
      : img;

    const buf = ext === ".png"
      ? await transformer.png({ quality: QUALITY.png, compressionLevel: 9, palette: true }).toBuffer()
      : ext === ".webp"
      ? await transformer.webp({ quality: QUALITY.webp }).toBuffer()
      : await transformer.jpeg({ quality: QUALITY.jpeg, mozjpeg: true }).toBuffer();

    if (buf.length < orig.size) {
      await fs.writeFile(file, buf);
      const savedKB = (orig.size - buf.length) / 1024;
      totalSaved += orig.size - buf.length;
      touched += 1;
      console.log(`  ${file.replace(/\\/g, "/")}: ${(orig.size/1024).toFixed(0)} → ${(buf.length/1024).toFixed(0)} KB  (-${savedKB.toFixed(0)} KB)`);
    }
  } catch (err) {
    console.warn(`[compress-uploads] skip ${file}: ${err.message}`);
  }
}

if (touched === 0) {
  console.log("[compress-uploads] nothing to optimize");
} else {
  console.log(`[compress-uploads] ${touched} files optimized, ${(totalSaved/1024/1024).toFixed(2)} MB saved`);
}
