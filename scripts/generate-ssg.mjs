import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const distDir = path.join(root, "dist");
const kbDir = path.join(root, "public", "kb");
const serverEntry = path.join(root, "dist", "server", "entry-server.js"); // 💡 重新用回固定的传统路径
const siteName = "K.S. Leow Group";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

async function writeRouteHtml(template, doc, render) {
  const appHtml = render(doc.route);
  const html = injectHead(template, doc).replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
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
  
  // 💡 最标准纯粹的 ESM 具名解构赋值
  const { render } = await import(pathToFileURL(serverEntry).href);

  // 严格的类型标准检查
  if (typeof render !== 'function') {
    throw new Error(`SSG Error: 'render' must be a function, but got '${typeof render}'. Please check 'src/entry-server.jsx' has 'export function render'.`);
  }

  for (const item of index) {
    const doc = JSON.parse(await readFile(path.join(kbDir, `${item.id}.json`), "utf8"));
    await writeRouteHtml(template, doc, render);
  }

  console.log(`Generated SSG HTML for ${index.length} routes`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});