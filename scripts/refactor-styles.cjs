const fs = require('fs');

const files = [
  'src/pages/products/FeedMePOS.jsx',
  'src/pages/apps/Sales2DO.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Remove the const S definition
  content = content.replace(/const S = \{[\s\S]*?\};\n/, '');
  
  // Replace simple style attributes
  content = content.replace(/style=\{S\.label\}/g, 'className="ks-eyebrow"');
  content = content.replace(/style=\{S\.h2\}/g, 'className="ks-section-title"');
  content = content.replace(/style=\{S\.h3\}/g, 'className="ks-card-title"');
  
  // Replace spread styles
  content = content.replace(/style=\{\{\s*\.\.\.S\.h2,\s*(.*?)\s*\}\}/g, 'className="ks-section-title" style={{ $1 }}');
  content = content.replace(/style=\{\{\s*\.\.\.S\.h3,\s*(.*?)\s*\}\}/g, 'className="ks-card-title" style={{ $1 }}');
  content = content.replace(/style=\{\{\s*\.\.\.S\.body,\s*(.*?)\s*\}\}/g, 'className="ks-body-text" style={{ $1 }}');

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
