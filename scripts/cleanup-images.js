#!/usr/bin/env node
/**
 * cleanup-images.js
 *
 * Scans source files for /images/... references and deletes any file under
 * public/images/ that nothing points to.
 *
 * CMS uploads may keep an original PNG/JPG while the site displays a generated
 * WebP with the same basename. If one variant is referenced, all same-basename
 * image variants are treated as in-use.
 */

import fs from "node:fs";
import path from "node:path";

const REFERENCE_DIRS = ["src"];
const IMAGES_DIR = "public/images";
const REF_FILE_EXTS = new Set([".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".html", ".yml", ".yaml"]);
const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp"];

const URL_RE = /\/images\/[^"'\\\s)]+/g;

function walkFiles(dir, visit) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, visit);
    } else {
      visit(full, entry.name);
    }
  }
}

function findExplicitReferences() {
  const refs = new Set();

  for (const dir of REFERENCE_DIRS) {
    walkFiles(dir, (full, name) => {
      if (!REF_FILE_EXTS.has(path.extname(name).toLowerCase())) return;
      const text = fs.readFileSync(full, "utf8");
      for (const match of text.match(URL_RE) || []) refs.add(match);
    });
  }

  return refs;
}

function addRelatedImageVariants(refs) {
  const keep = new Set(refs);

  for (const ref of refs) {
    const ext = path.posix.extname(ref).toLowerCase();
    if (!IMAGE_EXTS.includes(ext)) continue;

    const base = ref.slice(0, -ext.length);
    const sourceBase = base.endsWith(".optimized")
      ? base.slice(0, -".optimized".length)
      : base;

    for (const imageExt of IMAGE_EXTS) {
      keep.add(`${sourceBase}${imageExt}`);
    }
    keep.add(`${sourceBase}.optimized.webp`);
  }

  return keep;
}

function listImages() {
  const out = [];

  function walk(dir, urlPrefix) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const url = `${urlPrefix}/${entry.name}`;
      if (entry.isDirectory()) walk(full, url);
      else out.push({ full, url });
    }
  }

  walk(IMAGES_DIR, "/images");
  return out;
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sub = path.join(dir, entry.name);
    removeEmptyDirs(sub);
    if (fs.readdirSync(sub).length === 0) {
      fs.rmdirSync(sub);
      console.log(`Removed empty dir ${sub}`);
    }
  }
}

const explicitRefs = findExplicitReferences();
const refs = addRelatedImageVariants(explicitRefs);
const all = listImages();
const orphans = all.filter(file => !refs.has(file.url));

console.log(`Explicit references:       ${explicitRefs.size}`);
console.log(`Referenced variants kept:  ${refs.size}`);
console.log(`On disk:                   ${all.length}`);
console.log(`Orphans:                   ${orphans.length}`);

if (orphans.length === 0) {
  console.log("No cleanup needed.");
  process.exit(0);
}

for (const orphan of orphans) {
  fs.unlinkSync(orphan.full);
  console.log(`Deleted ${orphan.url}`);
}

removeEmptyDirs(IMAGES_DIR);
console.log(`Done. Removed ${orphans.length} unused image(s).`);
