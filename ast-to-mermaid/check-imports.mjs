// Check all loop files for the correct import path
import fs from 'fs';

// Check all loop files for the wrong import path
const loopFiles = [
  'src/mappings/languages/javascript/loops/for.mjs',
  'src/mappings/languages/javascript/loops/while/while.mjs',
  'src/mappings/languages/javascript/loops/do-while/do-while.mjs',
  'src/mappings/languages/typescript/loops/for.mjs',
  'src/mappings/languages/typescript/loops/while/while.mjs',
  'src/mappings/languages/typescript/loops/do-while/do-while.mjs'
];

for (const file of loopFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (lines[i].includes('import') && lines[i].includes('shapes.mjs')) {
        console.log(file + ': ' + lines[i].trim());
      }
    }
  }
}