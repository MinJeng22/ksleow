const fs = require('fs');
let code = fs.readFileSync('src/pages/products/AutoCountPOS.jsx', 'utf-8');

// Replace KS Walk In Mart (Sudirman)
code = code.replace(
  /mapUrl:\s*"https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=KS%20Walk%20In%20Mart[^"]+"/,
  'mapUrl: "https://maps.app.goo.gl/bfL794Wv2EryAZNBA"'
);

fs.writeFileSync('src/pages/products/AutoCountPOS.jsx', code);
console.log("Updated map URL for Sudirman store");
