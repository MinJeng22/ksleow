import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "src/content/autocountPosReleases.json");
const CATEGORY_URL = "https://wiki.autocountsoft.com/wiki/Category:AutoCount_Pos_5.2:_Release_Note";
const API_URL = "https://wiki.autocountsoft.com/w/api.php";
const USER_AGENT = "KSL AutoCount POS Release Sync/1.0 (+https://ksleow.com)";
const FILE_PREFIX = "POS_Release_Note_5.2";

async function main() {
  const currentReleases = await readCurrentReleases();
  const discovered = await collectReleaseFiles();

  if (discovered.length === 0) {
    throw new Error("No AutoCount POS 5.2 release files found from the official wiki.");
  }

  const existingByVersion = new Map(currentReleases.map((release) => [release.version, release]));
  const releases = discovered.map((item) => {
    const current = existingByVersion.get(item.version) || {};
    return {
      version: item.version,
      rev: current.rev || `Release ${item.version.split(".").at(-1)}`,
      date: current.date || formatWikiDate(item.release?.timestamp),
      lastModified: current.lastModified || formatWikiDate(item.release?.timestamp),
      dbVer: current.dbVer || "",
      posDbVer: current.posDbVer || "",
      frontendDbVer: current.frontendDbVer || "",
      server: current.server || "",
      features: Array.isArray(current.features) ? current.features : [],
      fixes: Array.isArray(current.fixes) ? current.fixes : [],
      highlightsUrl: item.highlight?.url || current.highlightsUrl || "",
      releasePdfUrl: item.release?.url || current.releasePdfUrl || "",
      sourceUrl: CATEGORY_URL,
    };
  }).sort((a, b) => compareVersions(b.version, a.version));

  const nextJson = `${JSON.stringify(releases, null, 2)}\n`;
  const currentJson = await readFileIfExists(OUTPUT_FILE);

  if (currentJson === nextJson) {
    console.log(`AutoCount POS release notes already up to date. Latest: ${releases[0]?.version}.`);
    return;
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, nextJson, "utf8");
  console.log(`Updated ${path.relative(ROOT, OUTPUT_FILE)} with ${releases.length} releases. Latest: ${releases[0]?.version}.`);
}

async function readCurrentReleases() {
  const json = await readFileIfExists(OUTPUT_FILE);
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(`Unable to parse ${path.relative(ROOT, OUTPUT_FILE)}: ${error.message}`);
  }
}

async function readFileIfExists(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

async function collectReleaseFiles() {
  const releaseFiles = new Map();
  const highlightFiles = new Map();
  let continuation = {};

  do {
    const data = await fetchWikiApi({
      action: "query",
      list: "allimages",
      aiprefix: FILE_PREFIX,
      ailimit: "500",
      aiprop: "name|url|timestamp",
      format: "json",
      ...continuation,
    });

    for (const file of data.query?.allimages || []) {
      const releaseMatch = file.name.match(/^POS_Release_Note_(5\.2\.\d+\.\d+)(?:_v(\d+))?\.pdf$/i);
      const highlightMatch = file.name.match(/^POS_Release_Note_(5\.2\.\d+\.\d+)_Highlight(?:_v(\d+))?\.pdf$/i);

      if (releaseMatch) {
        pushVersionedFile(releaseFiles, releaseMatch[1], file, releaseMatch[2]);
      } else if (highlightMatch) {
        pushVersionedFile(highlightFiles, highlightMatch[1], file, highlightMatch[2]);
      }
    }

    continuation = data.continue || null;
  } while (continuation);

  return [...releaseFiles.entries()].map(([version, files]) => ({
    version,
    release: chooseBestFile(files),
    highlight: chooseBestFile(highlightFiles.get(version) || []),
  }));
}

function pushVersionedFile(map, version, file, variant) {
  const list = map.get(version) || [];
  list.push({
    name: file.name,
    url: file.url,
    timestamp: file.timestamp,
    variant: Number(variant || 1),
  });
  map.set(version, list);
}

function chooseBestFile(files) {
  return [...files].sort((a, b) => {
    const variantDiff = (b.variant || 1) - (a.variant || 1);
    if (variantDiff !== 0) return variantDiff;
    return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
  })[0] || null;
}

async function fetchWikiApi(params) {
  const url = new URL(API_URL);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function formatWikiDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function compareVersions(a, b) {
  const left = String(a).split(".").map(Number);
  const right = String(b).split(".").map(Number);
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
