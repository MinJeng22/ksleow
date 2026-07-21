import fs from "node:fs/promises";
import path from "node:path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

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
  const parsedByVersion = new Map();

  for (const item of discovered) {
    if (!shouldParseReleasePdf(item.release?.url)) continue;

    try {
      parsedByVersion.set(item.version, await parseReleasePdf(item.release.url));
    } catch (error) {
      console.warn(`Unable to parse POS release PDF ${item.version}: ${error.message}`);
    }
  }

  const releases = discovered.map((item) => {
    const current = existingByVersion.get(item.version) || {};
    const parsed = parsedByVersion.get(item.version) || {};
    return {
      version: item.version,
      rev: current.rev || `Release ${item.version.split(".").at(-1)}`,
      date: parsed.date || current.date || formatWikiDate(item.release?.timestamp),
      lastModified: parsed.lastModified || current.lastModified || formatWikiDate(item.release?.timestamp),
      dbVer: parsed.dbVer || current.dbVer || "",
      posDbVer: parsed.posDbVer || current.posDbVer || "",
      frontendDbVer: parsed.frontendDbVer || current.frontendDbVer || "",
      server: parsed.server || current.server || "",
      features: chooseReleaseItems(parsed.features, current.features),
      fixes: chooseReleaseItems(parsed.fixes, current.fixes),
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

function shouldParseReleasePdf(releasePdfUrl) {
  return Boolean(releasePdfUrl);
}

async function parseReleasePdf(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/pdf,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = String(args[0] || "");
    if (/^Warning: TT:/.test(message)) return;
    originalWarn(...args);
  };

  try {
    const data = await pdfParse(Buffer.from(await response.arrayBuffer()));
    return parseReleasePdfText(data.text || "");
  } finally {
    console.warn = originalWarn;
  }
}

function parseReleasePdfText(text) {
  const lines = normalisePdfLines(text);
  const joined = lines.join(" ");

  const fixes = extractPdfSectionItems(lines, /^Bug Fix(?:es|ed):?$/i);
  const lastModifiedRaw = textMatch(joined, /Last Modified\s+([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/i)
    || textMatch(joined, /Last Modified\s+([0-9]{1,2}\s*(?:st|nd|rd|th)?\s+[A-Za-z]+\s+[0-9]{4})/i);

  return {
    date: normaliseDate(textMatch(joined, /Official Release Date:\s*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/i)),
    lastModified: normaliseDate(lastModifiedRaw),
    dbVer: textMatch(joined, /Database Version to\s*([0-9]+(?:\.[0-9]+)*)/i),
    posDbVer: textMatch(joined, /POS Database\s+Version to\s*([0-9]+(?:\.[0-9]+)*)/i),
    frontendDbVer: textMatch(joined, /frontend Database Version to\s*([0-9]+(?:\.[0-9]+)*)/i),
    server: textMatch(joined, /AutoCount Server Version\s*([0-9]+(?:\.[0-9]+)*)/i),
    features: extractPdfSectionItems(lines, /^Enhancements?:?$/i),
    fixes: fixes.length ? fixes : extractOrphanBugFixItems(lines),
  };
}

function normalisePdfLines(text) {
  return String(text)
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function extractPdfSectionItems(lines, headingPattern) {
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start === -1) return [];

  return collectPdfTableItems(lines.slice(start + 1), {
    stopAt(line, items) {
      if (/^(?:Bug Fix(?:es|ed)|Enhancements?):?$/i.test(line)) return true;
      if (items.length > 0 && /^Document Prepared by\b/i.test(line)) return true;
      return false;
    },
  });
}

function extractOrphanBugFixItems(lines) {
  const bugHeadingIndex = lines.findIndex((line) => /^Bug Fix(?:es|ed):?$/i.test(line));
  const enhancementIndex = lines.findIndex((line) => /^Enhancements?:?$/i.test(line));
  const preparedIndex = lines.findIndex((line, index) => index > enhancementIndex && /^Document Prepared by\b/i.test(line));

  if (bugHeadingIndex === -1 || enhancementIndex === -1 || preparedIndex === -1 || bugHeadingIndex > enhancementIndex) {
    return [];
  }

  return collectPdfTableItems(lines.slice(preparedIndex + 1), {
    stopAt(line, items) {
      return items.length > 0 && /^POS Release Note\b/i.test(line);
    },
  });
}

function collectPdfTableItems(lines, options = {}) {
  const items = [];
  let current = null;

  for (const rawLine of lines) {
    const line = cleanPdfLine(rawLine);
    if (!line) continue;
    if (options.stopAt?.(line, items)) break;
    if (isPdfTableNoise(line)) continue;

    const idOnly = line.match(/^(\d{4,})$/);
    const idWithDescription = line.match(/^(?:ID:?\s*)?(\d{4,})\s+(.+)$/i);

    if (idOnly) {
      flushPdfItem(items, current);
      current = { id: idOnly[1], description: "" };
      continue;
    }

    if (idWithDescription) {
      flushPdfItem(items, current);
      current = { id: idWithDescription[1], description: idWithDescription[2] };
      continue;
    }

    if (current) {
      current.description = `${current.description} ${line}`.trim();
    }
  }

  flushPdfItem(items, current);
  return uniqueItems(items);
}

function flushPdfItem(items, item) {
  const description = cleanPdfDescription(item?.description || "");
  if (description) items.push(description);
}

function cleanPdfLine(line) {
  return String(line)
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanPdfDescription(description) {
  return cleanPdfLine(description)
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isPdfTableNoise(line) {
  return /^ID\s+Description$/i.test(line)
    || /^ID$/i.test(line)
    || /^Description$/i.test(line)
    || /^Page$/i.test(line)
    || (/^\d+$/.test(line) && line.length < 4)
    || /^Auto Count Sdn Bhd\b/i.test(line)
    || /^www\.autocountsoft\.com$/i.test(line)
    || /^Tel:/i.test(line)
    || /^B2-3A-01\b/i.test(line);
}

function uniqueItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function chooseReleaseItems(parsedItems, currentItems) {
  if (Array.isArray(parsedItems) && parsedItems.length > 0) return parsedItems;
  return Array.isArray(currentItems) ? currentItems : [];
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

function textMatch(text, regex) {
  const match = String(text).match(regex);
  return match?.[1]?.trim() || "";
}

function normaliseDate(value) {
  if (!value) return "";
  const longDate = value.match(/^([0-9]{1,2})\s*(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+([0-9]{4})$/i);
  if (longDate) {
    const month = monthNameToNumber(longDate[2]);
    return month ? `${longDate[1].padStart(2, "0")}/${month}/${longDate[3]}` : "";
  }

  const [day, month, year] = value.split("/");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

function monthNameToNumber(value) {
  const months = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  return months[String(value).toLowerCase()] || "";
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
