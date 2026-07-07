import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const files = [
  'public/images/products/autocount-pos-backend-black.png',
  'public/images/products/autocount-pos-backend-ui.png',
  'public/images/products/autocount-pos-backend.png',
  'public/images/products/autocount-pos-frontend-black.png',
  'public/images/products/autocount-pos-frontend-ui.png',
  'public/images/products/autocount-pos-frontend.png',
  'public/images/products/pos-tutorial-thumb.png',
  'public/images/products/serverlink-icon.png',
  'public/images/team/group-photo-placeholder.png'
];

async function run() {
  for (const file of files) {
    if (await fs.access(file).then(() => true).catch(() => false)) {
      const parsed = path.parse(file);
      const outPath = path.join(parsed.dir, parsed.name + '.webp');
      
      console.log(`Converting ${file} to ${outPath}...`);
      await sharp(file)
        .webp({ quality: 90 })
        .toFile(outPath);
        
      console.log(`Deleting ${file}...`);
      await fs.unlink(file);
    }
  }
}

run().catch(console.error);
