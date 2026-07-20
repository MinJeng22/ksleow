const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/images/feedme-brands');
const files = fs.readdirSync(dir);

async function processFiles() {
  for (const file of files) {
    if (!file.match(/\.(png|jpe?g|webp)$/i)) continue;
    if (file.startsWith('temp_')) continue;
    
    const filePath = path.join(dir, file);
    const tempPath = path.join(dir, 'temp_' + file);
    
    try {
      // Read file into memory so Sharp doesn't lock the file on Windows
      const buffer = fs.readFileSync(filePath);
      
      await sharp(buffer)
        .trim({ threshold: 5 })
        .toFile(tempPath);
        
      fs.rmSync(filePath);
      fs.renameSync(tempPath, filePath);
      console.log(`Trimmed ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
      if (fs.existsSync(tempPath)) fs.rmSync(tempPath);
    }
  }
}

processFiles().then(() => console.log('Done trimming logos.'));
