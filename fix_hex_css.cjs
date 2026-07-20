const fs = require('fs');
let code = fs.readFileSync('src/styles/global.css', 'utf-8');

// 1. Add flex to hex-features-item-title globally
code = code.replace(
  /\.hex-features-item-title \{([\s\S]*?)\}/,
  `.hex-features-item-title {$1  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.hex-features-text-left .hex-features-item-title {\n  justify-content: flex-end;\n}\n.hex-features-text-right .hex-features-item-title {\n  justify-content: flex-start;\n}`
);

// 2. Replace the mobile layout logic
const oldMobileBlock = `  .hex-features-ring {
    order: -1;
    width: 260px;
  }

  .hex-features-text-left,
  .hex-features-text-right {
    text-align: center;
  }

  .hex-features-text-left .hex-features-item-dot,
  .hex-features-text-right .hex-features-item-dot {
    margin-left: auto;
    margin-right: auto;
  }

  .hex-features-text-left .hex-features-item-desc,
  .hex-features-text-right .hex-features-item-desc {
    margin-left: auto;
    margin-right: auto;
  }`;

const newMobileBlock = `  .hex-features-ring {
    width: 260px;
  }

  .hex-features-text-left {
    text-align: left;
  }
  .hex-features-text-right {
    text-align: right;
  }

  .hex-features-text-left .hex-features-item-title {
    justify-content: flex-start;
  }
  .hex-features-text-right .hex-features-item-title {
    justify-content: flex-end;
  }

  .hex-features-text-left .hex-features-item-desc {
    margin-left: 0;
  }
  .hex-features-text-right .hex-features-item-desc {
    margin-left: auto;
  }
  
  .hex-features-text-left .hex-features-item-dot,
  .hex-features-text-right .hex-features-item-dot {
    margin-left: 0;
    margin-right: 0;
  }`;

code = code.replace(oldMobileBlock, newMobileBlock);

fs.writeFileSync('src/styles/global.css', code);
console.log("Updated global.css for HexFeatures mobile layout");
