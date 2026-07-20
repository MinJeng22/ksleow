const fs = require('fs');
let code = fs.readFileSync('src/pages/products/AutoCountPOS.jsx', 'utf-8');

const oldText = "KS Leow Group operates 5 grocery stores using AutoCount Accounting + AutoCount POS, giving us hands-on experience in cashier operations, barcode control, branch stock transfers, daily closing, and accounting.";
const newText = "KS Leow Group operates 5 grocery stores using AutoCount Accounting and AutoCount POS, giving us practical experience in cashier operations and accounting.";

code = code.replace(oldText, newText);

fs.writeFileSync('src/pages/products/AutoCountPOS.jsx', code);
console.log("Updated POS_RETAIL_PROOF text");
