const fs = require('fs');
let code = fs.readFileSync('src/components/AutoCountTrainingWebGL.jsx', 'utf8');

const search = 'className={	utorial-video-frame}';
const replace = 'className={	utorial-video-frame}';

const searchCss = \        .tutorial-video-frame {
          position: relative;\;
const replaceCss = \        .tutorial-video-frame.no-shadow {
          box-shadow: none !important;
        }
        .tutorial-video-frame {
          position: relative;\;

if (code.includes(search) && code.includes(searchCss)) {
  code = code.replace(search, replace).replace(searchCss, replaceCss);
  fs.writeFileSync('src/components/AutoCountTrainingWebGL.jsx', code);
  console.log('Fixed');
} else {
  console.log('Not found');
  console.log('search included:', code.includes(search));
  console.log('searchCss included:', code.includes(searchCss));
}\
