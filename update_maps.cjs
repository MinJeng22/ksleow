const fs = require('fs');
let code = fs.readFileSync('src/pages/products/AutoCountPOS.jsx', 'utf-8');

// Replace KS Grocer
code = code.replace(
  /mapUrl:\s*"https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=KS%20Grocer[^"]+"/,
  'mapUrl: "https://maps.app.goo.gl/mxev9quQPyLbjQxW9"'
);

// Replace KS Walk-in Mart (Taman Temerloh Jaya)
code = code.replace(
  /mapUrl:\s*"https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=KS%20Walk-in%20Mart[^"]+"/,
  'mapUrl: "https://maps.app.goo.gl/PcNwdDCwLd8VHDWs7"'
);

// Replace KS Xin Mart
code = code.replace(
  /mapUrl:\s*"https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=KS%20Xin%20Mart[^"]+"/,
  'mapUrl: "https://maps.app.goo.gl/7uaeAKvjQpiencCC7"'
);

fs.writeFileSync('src/pages/products/AutoCountPOS.jsx', code);
console.log("Updated map URLs");
