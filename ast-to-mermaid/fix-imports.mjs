// Fix import paths in JavaScript loop files using exact string replacement
import fs from 'fs';

// Define the files to update
const files = [
  'src/mappings/languages/javascript/loops/for.mjs',
  'src/mappings/languages/javascript/loops/while/while.mjs',
  'src/mappings/languages/javascript/loops/do-while/do-while.mjs',
  'src/mappings/languages/typescript/loops/for.mjs',
  'src/mappings/languages/typescript/loops/while/while.mjs',
  'src/mappings/languages/typescript/loops/do-while/do-while.mjs'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix shapes import path - from ../../../mermaid/shapes.mjs to ../../../mappings/mermaid/shapes.mjs
    content = content.replace(
      'import { shapes } from "../../../mermaid/shapes.mjs";',
      'import { shapes } from "../../../mappings/mermaid/shapes.mjs";'
    );
    
    // Fix common import path - from ../../../mappings/common/common.mjs to ../../../../common/common.mjs
    content = content.replace(
      'import { linkNext } from "../../../mappings/common/common.mjs";',
      'import { linkNext } from "../../../../common/common.mjs";'
    );
    
    fs.writeFileSync(file, content);
    console.log(`Fixed imports in ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Import path fixes completed.');