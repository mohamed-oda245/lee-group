const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\dell\\Downloads\\Lee Presentation\\lee-group-website';
const faCdn = '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n</head>';

const replacements = {
  '🛢️': '<i class="fa-solid fa-oil-well"></i>',
  '🔧': '<i class="fa-solid fa-wrench"></i>',
  '📡': '<i class="fa-solid fa-satellite-dish"></i>',
  '🔍': '<i class="fa-solid fa-magnifying-glass"></i>',
  '🛡️': '<i class="fa-solid fa-shield-halved"></i>',
  '⚙️': '<i class="fa-solid fa-gear"></i>',
  '🧪': '<i class="fa-solid fa-flask"></i>',
  '📋': '<i class="fa-solid fa-clipboard-list"></i>',
  '✅': '<i class="fa-solid fa-circle-check"></i>'
};

function processDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;
      for (const [emoji, faIcon] of Object.entries(replacements)) {
        if (content.includes(emoji)) {
          content = content.split(emoji).join(faIcon);
          modified = true;
        }
      }
      
      if (!content.includes('font-awesome')) {
        content = content.replace('</head>', faCdn);
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir(dir);
console.log('Finished updating icons');
