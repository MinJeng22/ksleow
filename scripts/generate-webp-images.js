import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const RASTER_EXT = /\.(png|jpe?g)$/i;

const PUBLIC_ROOT = path.join(ROOT, "public");
const PUBLIC_UPLOADS = path.join(PUBLIC_ROOT, "uploads");

const STATIC_ASSETS = [
  "src/assets/logos/logo-hero.png",
  "src/assets/logos/logo-nav.png",
  "src/assets/logos/logo-footer.png",
  "src/assets/images/apps/ac-plugin-icon.png",
  "src/assets/images/apps/sales2do/hero.png",
  "src/assets/images/apps/sales2do/outstanding.png",
  "src/assets/images/apps/sales2do/preset-delivery.png",
  "src/assets/images/apps/sales2do/settings.png",
  "src/assets/images/apps/sales2do/license-offline.png",
  "src/assets/images/apps/sales2do/license-online.png",
  "src/assets/images/products/autocount-accounting-icon.png",
  "src/assets/images/products/autocount-interface.png",
];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function listImages(dir, { recursive = true } = {}) {
  if (!(await exists(dir))) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      files.push(...await listImages(fullPath, { recursive }));
      continue;
    }
    if (entry.isFile() && RASTER_EXT.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getOutputPath(inputPath) {
  if (inputPath.startsWith(PUBLIC_ROOT)) {
    return inputPath.replace(RASTER_EXT, ".optimized.webp");
  }
  return inputPath.replace(RASTER_EXT, ".webp");
}

function getOptions(inputPath) {
  const normalized = inputPath.replaceAll(path.sep, "/");

  if (normalized.includes("/src/assets/logos/")) {
    return { maxWidth: 1000, webp: { lossless: true, quality: 82, effort: 6 } };
  }

  if (normalized.includes("/public/uploads/branding/ksleow-")) {
    return { maxWidth: 1000, webp: { lossless: true, quality: 82, effort: 6 } };
  }

  if (normalized.includes("/favicon.") || normalized.includes("/ksl-logo-circle.")) {
    return { maxWidth: 256, webp: { quality: 82, effort: 6 } };
  }

  if (normalized.includes("/public/uploads/products/")) {
    return { maxWidth: 960, webp: { quality: 78, effort: 6 } };
  }

  if (normalized.includes("/src/assets/images/apps/")) {
    return { maxWidth: 1200, webp: { quality: 80, effort: 6 } };
  }

  return { maxWidth: 1200, webp: { quality: 78, effort: 6 } };
}

async function shouldSkip(inputPath, outputPath) {
  if (!(await exists(outputPath))) return false;
  const [inputStat, outputStat] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
  return outputStat.mtimeMs >= inputStat.mtimeMs && outputStat.size > 0;
}

async function convert(inputPath) {
  const outputPath = getOutputPath(inputPath);
  if (await shouldSkip(inputPath, outputPath)) return { status: "skipped", inputPath, outputPath };

  const { maxWidth, webp } = getOptions(inputPath);
  const image = sharp(inputPath, { failOn: "none" }).rotate();
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.webp(webp).toFile(outputPath);
  return { status: "converted", inputPath, outputPath };
}

async function main() {
  const publicRootImages = await listImages(PUBLIC_ROOT, { recursive: false });
  const uploadImages = await listImages(PUBLIC_UPLOADS);
  const staticImages = (await Promise.all(
    STATIC_ASSETS.map(async asset => {
      const fullPath = path.join(ROOT, asset);
      return await exists(fullPath) ? fullPath : null;
    })
  )).filter(Boolean);

  const inputs = [...new Set([...publicRootImages, ...uploadImages, ...staticImages])];
  const results = [];

  for (const input of inputs) {
    try {
      results.push(await convert(input));
    } catch (err) {
      console.warn(`[webp] skipped ${path.relative(ROOT, input)}: ${err.message}`);
    }
  }

  const converted = results.filter(result => result.status === "converted");
  if (converted.length) {
    console.log(`[webp] generated ${converted.length} optimized image${converted.length === 1 ? "" : "s"}`);
    for (const result of converted) {
      console.log(`[webp] ${path.relative(ROOT, result.outputPath)}`);
    }
  } else {
    console.log("[webp] optimized images are up to date");
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
