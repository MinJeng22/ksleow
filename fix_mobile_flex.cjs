const fs = require('fs');
let code = fs.readFileSync('src/styles/global.css', 'utf-8');

const oldMobileCss = `  .hex-features-text-left .hex-features-item-title {
    justify-content: flex-start;
  }
  .hex-features-text-right .hex-features-item-title {
    justify-content: flex-end;
  }`;

const newMobileCss = `  .hex-features-text-left .hex-features-item-title {
    justify-content: flex-end;
    flex-direction: row-reverse;
  }
  .hex-features-text-right .hex-features-item-title {
    justify-content: flex-start;
    flex-direction: row-reverse;
  }`;

code = code.replace(oldMobileCss, newMobileCss);

fs.writeFileSync('src/styles/global.css', code);
console.log("Updated mobile flex direction correctly");
