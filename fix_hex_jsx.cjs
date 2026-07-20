const fs = require('fs');
let code = fs.readFileSync('src/components/HexFeatures.jsx', 'utf-8');

// Remove inline styles from left column titles
code = code.replace(
  /style=\{\{\s*display:\s*"flex",\s*alignItems:\s*"center",\s*justifyContent:\s*"flex-end",\s*gap:\s*"8px"\s*\}\}/g,
  ''
);

// Remove inline styles from right column titles
code = code.replace(
  /style=\{\{\s*display:\s*"flex",\s*alignItems:\s*"center",\s*justifyContent:\s*"flex-start",\s*gap:\s*"8px"\s*\}\}/g,
  ''
);

fs.writeFileSync('src/components/HexFeatures.jsx', code);
console.log("Removed inline styles from HexFeatures.jsx");
