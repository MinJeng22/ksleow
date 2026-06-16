import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module"; // 💡 引入原生的 CommonJS 加载器

const root = process.cwd();
const distDir = path.join(root, "dist");
const kbDir = path.join(root, "public", "kb");
const siteName = "K.S. Leow Group";

// 💡 实例化 require
const require = createRequire(import.meta.url);

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
  
  // 💡 100% 防弹的 CommonJS 引入方式！(注意后缀变成了 .cjs)
  const serverEntry = path.join(distDir, "server", "entry-server.cjs");
  const ssrModule = require(serverEntry);

  // 稳稳地拿出 render 函数
  const render = ssrModule.render || ssrModule.default?.render || ssrModule.default;

  if (typeof render !== 'function') {
    throw new Error(`SSG 严重错误: 模块暴露的属性有 [${Object.keys(ssrModule)}]`);
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