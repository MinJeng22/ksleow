import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "src/content/autocountReleases.json");
const CATEGORY_URL = "https://wiki.autocountsoft.com/wiki/Category:AutoCount_Accounting_2.2:Release_Note";
const WIKI_ORIGIN = "https://wiki.autocountsoft.com";
const USER_AGENT = "KSL AutoCount Release Sync/1.0 (+https://ksleow.com)";

const SECTION_LABELS = ["Enhancement:", "Bug Fixed:"];

async function main() {
  const categoryHtml = await fetchText(CATEGORY_URL);
  const links = extractReleaseLinks(categoryHtml);
  if (links.length === 0) {
    throw new Error("No AutoCount Accounting 2.2 release links found on the official category page.");
  }

  const releases = [];
  for (const link of links) {
    const html = await fetchText(link.url);
    releases.push(parseReleasePage(html, link));
  }

  releases.sort((a, b) => compareVersions(b.version, a.version));

  const highlightsCount = releases.filter((release) => release.highlightsUrl).length;
  const nextJson = `${JSON.stringify(releases, null, 2)}\n`;
  let currentJson = "";
  try {
    currentJson = await fs.readFile(OUTPUT_FILE, "utf8");
  } catch {
    // First run creates the file.
  }

  if (currentJson === nextJson) {
    console.log(`AutoCount release notes already up to date. Latest: ${releases[0]?.version}. Highlights: ${highlightsCount}`);
    return;
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, nextJson, "utf8");
  console.log(`Updated ${path.relative(ROOT, OUTPUT_FILE)} with ${releases.length} releases. Latest: ${releases[0]?.version}. Highlights: ${highlightsCount}`);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function extractReleaseLinks(html) {
  const links = new Map();
  const re = /<li\b[^>]*>[\s\S]*?<a\s+href="([^"]+)"[^>]*title="Release Note ([0-9.]+)"[^>]*>\s*Release Note \2\s*<\/a>[\s\S]*?<\/li>/gi;
  let match;
  while ((match = re.exec(html))) {
    const itemHtml = match[0];
    const version = match[2];
    links.set(version, {
      version,
      url: absoluteUrl(decodeHtml(match[1])),
      releasePdfUrl: extractAnchorUrl(itemHtml, "Download PDF"),
      highlightsUrl: extractHighlightsUrl(itemHtml),
    });
  }
  return [...links.values()].sort((a, b) => compareVersions(b.version, a.version));
}

function parseReleasePage(html, link) {
  const content = extractContent(html);
  const titleVersion = textMatch(content, /Release Note\s+([0-9.]+)/i) || link.version;
  const dateRaw = textMatch(content, /Official Release Date:\s*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/i);
  const dbVer = textMatch(content, /Database Version to\s*([0-9.]+)/i) || "";
  const server = textMatch(content, /AutoCount Server Version\s*([0-9.]+)/i) || "";
  const features = extractSectionItems(content, "Enhancement:");
  const fixes = extractSectionItems(content, "Bug Fixed:");
  const version = titleVersion.trim();

  return {
    version,
    rev: `Rev ${version.split(".").at(-1)}`,
    date: normaliseDate(dateRaw),
    dbVer,
    server,
    features,
    fixes,
    sourceUrl: link.url,
    releasePdfUrl: link.releasePdfUrl || "",
    highlightsUrl: link.highlightsUrl || "",
  };
}

function extractAnchorUrl(html, label) {
  const anchors = extractAnchors(html);
  const anchor = anchors.find((item) => item.text.toLowerCase() === label.toLowerCase());
  return anchor ? absoluteUrl(decodeHtml(anchor.href)) : "";
}

function extractHighlightsUrl(html) {
  const anchors = extractAnchors(html);
  const anchor = anchors.find((item) => {
    const haystack = `${item.text} ${item.title} ${item.href}`.toLowerCase();
    return item.text.toLowerCase() === "highlights" || /whats?_?new|what'?s new|highlights?/.test(haystack);
  });
  return anchor ? absoluteUrl(decodeHtml(anchor.href)) : "";
}

function extractAnchors(html) {
  return [...String(html).matchAll(/<a\s+([^>]+)>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: readAttribute(match[1], "href"),
    title: readAttribute(match[1], "title"),
    text: cleanHtml(match[2]),
  })).filter((item) => item.href);
}

function readAttribute(attrs, name) {
  const match = String(attrs).match(new RegExp(`${name}="([^"]*)"`, "i"));
  return match?.[1] || "";
}

function extractContent(html) {
  const marker = '<div class="mw-content-ltr mw-parser-output"';
  const start = html.indexOf(marker);
  if (start === -1) return html;
  const end = html.indexOf('<div class="printfooter"', start);
  return html.slice(start, end === -1 ? undefined : end);
}

function extractSectionItems(content, label) {
  const start = content.indexOf(`<b>${label}</b>`);
  if (start === -1) return [];
  const tableStart = content.indexOf("<table", start);
  if (tableStart === -1) return [];
  const tableEnd = content.indexOf("</table>", tableStart);
  if (tableEnd === -1) return [];
  const section = content.slice(tableStart, tableEnd + "</table>".length);
  const rows = [...section.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const items = [];

  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cleanHtml(cell[1]));
    if (cells.length < 2) continue;
    const description = cells.at(-1);
    if (description && !/^description$/i.test(description)) {
      items.push(description);
    }
  }

  return items;
}

function textMatch(html, regex) {
  const text = cleanHtml(html);
  const match = text.match(regex);
  return match?.[1]?.trim() || "";
}

function cleanHtml(value) {
  return fixMojibake(decodeHtml(String(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()));
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ndash;|&#8211;/g, "-")
    .replace(/&mdash;|&#8212;/g, "-")
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rsquo;|&#8217;/g, "'");
}

function fixMojibake(value) {
  return String(value)
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u02dc/g, "'")
    .replace(/\u00e2\u20ac\u0153|\u00e2\u20ac\u009d/g, '"')
    .replace(/\u00e2\u20ac\u201c|\u00e2\u20ac\u201d/g, "-")
    .replace(/\u00c2\u00b7/g, "-");
}

function normaliseDate(value) {
  if (!value) return "";
  const [day, month, year] = value.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function absoluteUrl(href) {
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return `${WIKI_ORIGIN}${href}`;
  return href;
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
