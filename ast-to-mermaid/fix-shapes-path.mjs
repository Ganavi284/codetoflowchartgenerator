// Fix import paths for shapes in loop files (correct path)
import fs from 'fs';

const files = [
  'src/mappings/languages/javascript/loops/for.mjs',
  'src/mappings/languages/javascript/loops/while/while.mjs', 
  'src/mappings/languages/javascript/loops/do-while/do-while.mjs',
  'src/mappings/languages/typescript/loops/for.mjs',
  'src/mappings/languages/typescript/loops/while/while.mjs',
  'src/mappings/languages/typescript/loops/do-while/do-while.mjs'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the shapes import path - should be ../../../mappings/mermaid/shapes.mjs from loops directory
    content = content.replace(
      'import { shapes } from "../../mermaid/shapes.mjs";',
      'import { shapes } from "../../../mappings/mermaid/shapes.mjs";'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed shapes import in ${filePath}`);
  }
});

console.log('Fixed shapes import paths in all loop files');