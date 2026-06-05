import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const kbDir = path.join(publicDir, "kb");
const siteUrl = "https://ksleow.vercel.app";

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

function plain(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeRelease(release) {
  if (!release) return null;
  return {
    version: release.version,
    rev: release.rev,
    date: release.date,
    features: (release.features || []).slice(0, 12).map(plain),
    fixes: (release.fixes || []).slice(0, 12).map(plain),
    highlights: (release.highlights || []).slice(0, 10).map(plain),
    sourceUrl: release.sourceUrl || release.highlightsUrl || "",
  };
}

function doc({ slug, title, description, route, category, sections = [], facts = {}, source = "site-content" }) {
  return {
    id: slug,
    title,
    description,
    url: `${siteUrl}${route}`,
    route,
    category,
    source,
    updatedAt: new Date().toISOString(),
    facts,
    sections: sections.map((section) => ({
      heading: section.heading,
      body: Array.isArray(section.body) ? section.body.map(plain) : [plain(section.body)].filter(Boolean),
    })),
  };
}

function docText(document) {
  const lines = [
    document.title,
    document.description,
    `URL: ${document.url}`,
    `Category: ${document.category}`,
  ];

  for (const [key, value] of Object.entries(document.facts || {})) {
    if (Array.isArray(value)) {
      lines.push(`${key}: ${value.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join("; ")}`);
    } else if (value && typeof value === "object") {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (value) {
      lines.push(`${key}: ${value}`);
    }
  }

  for (const section of document.sections || []) {
    lines.push(section.heading);
    lines.push(...section.body);
  }

  return lines.filter(Boolean).join("\n");
}

function releaseText(release) {
  const summary = summarizeRelease(release);
  if (!summary) return "";
  return [
    `${summary.version} ${summary.rev}`,
    summary.date ? `Date: ${summary.date}` : "",
    summary.features?.length ? `Features: ${summary.features.join("; ")}` : "",
    summary.fixes?.length ? `Fixes: ${summary.fixes.join("; ")}` : "",
    summary.highlights?.length ? `Highlights: ${summary.highlights.join("; ")}` : "",
    summary.sourceUrl ? `Source: ${summary.sourceUrl}` : "",
  ].filter(Boolean).join("\n");
}

async function main() {
  await mkdir(kbDir, { recursive: true });

  const [products, services, otherServices, plugins, releases, cloudReleases, sales2do] = await Promise.all([
    readJson("src/content/products.json"),
    readJson("src/content/services.json"),
    readJson("src/content/otherServices.json"),
    readJson("src/content/autocountPlugins.json"),
    readJson("src/content/autocountReleases.json"),
    readJson("src/content/autocountCloudReleases.json"),
    readJson("src/content/sales2do.json"),
  ]);

  const productItems = products.items || [];
  const serviceItems = services.items || [];
  const otherItems = otherServices.items || [];
  const pluginItems = (plugins.sections || []).flatMap((section) =>
    (section.items || []).map((item) => ({ ...item, collection: section.label }))
  );
  const latestAccountingRelease = releases[0];
  const latestCloudRelease = cloudReleases[0];

  const documents = [
    doc({
      slug: "home",
      title: "K.S. Leow Group",
      description: "K.S. Leow Group official website for accounting, taxation, company secretarial, AutoCount software, IT, training, and business workflow services in Pahang.",
      route: "/",
      category: "Company",
      facts: {
        products: productItems.map((item) => `${item.name}: ${item.desc}`),
        services: serviceItems.map((item) => `${item.title}: ${item.desc}`),
        otherServices: otherItems.map((item) => `${item.title}: ${item.desc}`),
      },
      sections: [
        { heading: services.heading, body: services.intro },
        { heading: products.heading, body: products.intro },
        { heading: otherServices.heading, body: otherServices.intro },
      ],
    }),
    doc({
      slug: "autocount-accounting",
      title: "AutoCount Accounting 2.2",
      description: "Desktop accounting software for Malaysian SMEs with SST, e-Invoice, inventory, sales, purchase, and reporting workflows.",
      route: "/products/autocount-accounting",
      category: "Product",
      facts: {
        whatsapp: "+60 17-905 2323",
        latestRelease: summarizeRelease(latestAccountingRelease),
        officialReleaseNote: "https://wiki.autocountsoft.com/wiki/Category:AutoCount_Accounting_2.2:Release_Note",
      },
      sections: [
        { heading: "Key features", body: [
          "SST and LHDN e-Invoice ready workflows for Malaysian compliance.",
          "Integrated operations across accounting, POS, inventory, payroll, and custom business workflows.",
          "Prompt technical support from KSL for setup, training, and practical usage questions.",
          "Extensible through plugins, custom fields, scripting, and workflow automation.",
        ] },
        { heading: "Latest release note summary", body: releaseText(latestAccountingRelease) },
      ],
    }),
    doc({
      slug: "autocount-cloud-accounting",
      title: "AutoCount CloudAccounting",
      description: "Browser-based AutoCount CloudAccounting with e-Invoice, AI SmartScan, bank connection, and anytime access.",
      route: "/products/autocount-cloud-accounting",
      category: "Product",
      facts: {
        officialProductUrl: "https://www.autocountsoft.com/pro-cloud-acc.html",
        officialApiUrl: "https://accounting-api.autocountcloud.com/documentation/",
        officialReleaseNote: "https://help.accounting.autocountcloud.com/support/discussions/forums/69000107078",
        pricing: [
          "Lite: Monthly RM70, 12 months RM294, 24 months RM420",
          "Basic: Monthly RM100, 12 months RM420, 24 months RM600",
          "Plus: Monthly RM140, 12 months RM588, 24 months RM840",
          "Pro: Monthly RM180, 12 months RM756, 24 months RM1080",
          "Accountant: Monthly RM10, 12 months RM120, 24 months RM240",
        ],
        latestRelease: summarizeRelease(latestCloudRelease),
      },
      sections: [
        { heading: "Four advantages", body: [
          "LHDN e-Invoice Ready.",
          "Anytime, anywhere, any device.",
          "Capture, upload and extract data with AI SmartScan.",
          "Bank Connection for faster reconciliation.",
        ] },
        { heading: "Training", body: "Learn AutoCount CloudAccounting in Just 30 Minutes with the official tutorial video." },
        { heading: "Latest release note summary", body: releaseText(latestCloudRelease) },
      ],
    }),
    doc({
      slug: "feedme-pos",
      title: "FeedMe POS",
      description: "Cloud F&B POS for restaurants with table management, kitchen display, and online ordering integration.",
      route: "/products/feedme-pos",
      category: "Product",
      sections: [
        { heading: "Overview", body: productItems.find((item) => item.name === "FeedMe POS")?.desc || "" },
      ],
    }),
    doc({
      slug: "autocount-plugin",
      title: "AutoCount Plugin",
      description: "AutoCount Accounting plugin collection including KSL-built plugins and selected dealer plugins.",
      route: "/apps/autocount-plugin",
      category: "App",
      facts: {
        plugins: pluginItems.map((item) => `${item.name} (${item.collection}, ${item.dealer}): ${item.summary}`),
      },
      sections: [
        { heading: plugins.hero?.title || "AutoCount Plugin", body: plugins.hero?.body || "" },
      ],
    }),
    doc({
      slug: "sales2do",
      title: "Sales2DO AutoCount Plugin",
      description: "Sales2DO copies Invoice or Cash Sale documents to Delivery Order with outstanding quantity checking and delivery workflow controls.",
      route: "/apps/sales2do",
      category: "App",
      facts: {
        whatsapp: "+60 17-905 2323",
        download: "/downloads/app/Sales2DO.app",
      },
      sections: [
        { heading: "Overview", body: sales2do.hero?.body || pluginItems.find((item) => item.name === "Sales2DO")?.summary || "" },
        { heading: "Features", body: pluginItems.find((item) => item.name === "Sales2DO")?.features || [] },
      ],
    }),
  ];

  const index = documents.map((document) => ({
    id: document.id,
    title: document.title,
    description: document.description,
    url: document.url,
    route: document.route,
    category: document.category,
    kbJson: `${siteUrl}/kb/${document.id}.json`,
    kbText: `${siteUrl}/kb/${document.id}.txt`,
  }));

  await writeFile(path.join(kbDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);

  for (const document of documents) {
    await writeFile(path.join(kbDir, `${document.id}.json`), `${JSON.stringify(document, null, 2)}\n`);
    await writeFile(path.join(kbDir, `${document.id}.txt`), `${docText(document)}\n`);
  }

  const sitemap = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ...documents.map((document) => `  <url><loc>${document.url}</loc><changefreq>weekly</changefreq><priority>${document.route === "/" ? "1.0" : "0.8"}</priority></url>`),
    "  <url><loc>https://ksleow.vercel.app/kb/index.json</loc><changefreq>daily</changefreq><priority>0.7</priority></url>",
    "</urlset>",
  ].join("\n");

  await writeFile(path.join(publicDir, "sitemap.xml"), `${sitemap}\n`);
  await writeFile(path.join(publicDir, "robots.txt"), [
    "User-agent: *",
    "Allow: /",
    "Allow: /kb/",
    "Sitemap: https://ksleow.vercel.app/sitemap.xml",
    "",
  ].join("\n"));

  await writeFile(path.join(publicDir, "llms.txt"), [
    "# K.S. Leow Group",
    "",
    "This website provides information about K.S. Leow Group services, AutoCount Accounting, AutoCount CloudAccounting, AutoCount plugins, Sales2DO, and related business software support.",
    "",
    "## Preferred Knowledge Base",
    "- Index: https://ksleow.vercel.app/kb/index.json",
    ...index.map((item) => `- ${item.title}: ${item.kbText}`),
    "",
    "## Crawling Guidance",
    "Use the /kb/*.json or /kb/*.txt files for clean structured content. Use the public web pages for user-facing presentation and context.",
    "",
  ].join("\n"));

  console.log(`Generated ${documents.length} knowledge-base documents in public/kb`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
