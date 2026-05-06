const fs = require('fs');
const path = require('path');

const weights = ['400', '500', '700'];
const src = path.join(__dirname, '..', 'node_modules', '@fontsource', 'inter', 'files');
const dest = path.join(__dirname, '..', 'src', 'fonts', 'inter');

fs.mkdirSync(dest, { recursive: true });

for (const weight of weights) {
  const file = `inter-latin-${weight}-normal.woff2`;
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
  console.log(`copied ${file}`);
}
