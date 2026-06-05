import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const kbDir = path.join(root, "public", "kb");
const siteName = "K.S. Leow Group";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSection(section) {
  return `
    <section>
      <h2>${escapeHtml(section.heading)}</h2>
      ${(section.body || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
    </section>`;
}

function renderFacts(facts = {}) {
  const entries = Object.entries(facts).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) return "";

  return `
    <section>
      <h2>Structured Facts</h2>
      <dl>
        ${entries.map(([key, value]) => {
          const body = Array.isArray(value)
            ? `<ul>${value.map((item) => `<li>${escapeHtml(typeof item === "string" ? item : JSON.stringify(item))}</li>`).join("")}</ul>`
            : typeof value === "object"
              ? `<pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>`
              : escapeHtml(value);
          return `<dt>${escapeHtml(key)}</dt><dd>${body}</dd>`;
        }).join("\n")}
      </dl>
    </section>`;
}

function renderStaticRoot(doc) {
  return `
    <main class="ssg-content" data-ssg-route="${escapeHtml(doc.route)}">
      <article>
        <p class="ssg-kicker">${escapeHtml(doc.category)}</p>
        <h1>${escapeHtml(doc.title)}</h1>
        <p>${escapeHtml(doc.description)}</p>
        ${renderFacts(doc.facts)}
        ${(doc.sections || []).map(renderSection).join("\n")}
      </article>
    </main>`;
}

function injectHead(html, doc) {
  const title = `${doc.title} | ${siteName}`;
  const description = doc.description || `${doc.title} from ${siteName}`;
  const canonical = doc.url;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": doc.category === "Product" ? "SoftwareApplication" : "WebPage",
    name: doc.title,
    description,
    url: canonical,
    provider: {
      "@type": "Organization",
      name: siteName,
      url: "https://ksleow.vercel.app",
    },
  };

  let next = html
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(description)}" />`);

  const tags = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].join("\n    ");

  next = next.replace("</head>", `    ${tags}\n  </head>`);
  return next;
}

async function writeRouteHtml(template, doc) {
  const html = injectHead(template, doc).replace('<div id="root"></div>', `<div id="root">${renderStaticRoot(doc)}</div>`);
  if (doc.route === "/") {
    await writeFile(path.join(distDir, "index.html"), html);
    return;
  }

  const routeDir = path.join(distDir, doc.route.replace(/^\/+/, ""));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html);
}

async function main() {
  const template = await readFile(path.join(distDir, "index.html"), "utf8");
  const index = JSON.parse(await readFile(path.join(kbDir, "index.json"), "utf8"));

  for (const item of index) {
    const doc = JSON.parse(await readFile(path.join(kbDir, `${item.id}.json`), "utf8"));
    await writeRouteHtml(template, doc);
  }

  console.log(`Generated SSG HTML for ${index.length} routes`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
