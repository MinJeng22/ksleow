import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Helper to read JSON
const readJson = (filename) => {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Could not read ${filename}`);
    return null;
  }
};

const services = readJson('services.json')?.items;
const products = readJson('products.json')?.items;
const otherServices = readJson('otherServices.json')?.items;
const offices = readJson('offices.json')?.offices || readJson('offices.json');
const stats = readJson('stats.json')?.items;

let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>K.S. Leow Group - Knowledge Base</title>
  <meta name="description" content="Complete knowledge base and directory of services, products, and contact information for K.S. Leow Group.">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
    h1 { border-bottom: 2px solid #2f315a; padding-bottom: 0.5rem; color: #2f315a; }
    h2 { color: #80c31e; margin-top: 2rem; }
    section { margin-bottom: 3rem; }
    .card { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #eee; }
  </style>
</head>
<body>
  <header>
    <h1>K.S. Leow Group - Knowledge Base</h1>
    <p>This is a plain-text directory intended for AI agents, crawlers, and quick reference.</p>
    <p><strong>Primary Contact:</strong> support@ksleow.com.my | 017-905 2323</p>
  </header>

  <section>
    <h2>Services</h2>
`;

if (Array.isArray(services)) {
  services.forEach(s => {
    html += `    <div class="card">
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>\n`;
  });
}

html += `  </section>

  <section>
    <h2>Products</h2>
`;

if (Array.isArray(products)) {
  products.forEach(p => {
    html += `    <div class="card">
      <h3>${p.name}</h3>
      <p>${p.desc || p.description}</p>
    </div>\n`;
  });
}

html += `  </section>

  <section>
    <h2>Other Services</h2>
`;

if (Array.isArray(otherServices)) {
  otherServices.forEach(s => {
    html += `    <div class="card">
      <h3>${s.title}</h3>
      <p>${s.desc || s.description}</p>
    </div>\n`;
  });
}

html += `  </section>

  <section>
    <h2>Office Locations</h2>
`;

if (Array.isArray(offices)) {
  offices.forEach(o => {
    html += `    <div class="card">
      <h3>${o.name}</h3>
      <p><em>${o.tagline || ''}</em></p>
      <ul>
        ${o.address ? o.address.map(a => `<li>${a}</li>`).join('') : ''}
      </ul>
      <p><strong>Phones:</strong> ${o.phones ? o.phones.join(', ') : ''}</p>
      <p><strong>Emails:</strong> ${o.emails ? o.emails.join(', ') : ''}</p>
    </div>\n`;
  });
}

html += `  </section>

  <footer>
    <p>&copy; ${new Date().getFullYear()} K.S. Leow Group. All rights reserved.</p>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'kb.html'), html);
console.log('✅ Generated public/kb.html');
