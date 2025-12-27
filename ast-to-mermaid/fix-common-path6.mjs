// Fix import paths for common in loop files (correct path - 5 levels up to reach src/)
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
    
    // Fix the common import path - should be ../../../../../common/common.mjs from loops directory (5 levels up)
    content = content.replace(
      'import { linkNext } from "../../../../common/common.mjs";',
      'import { linkNext } from "../../../../../common/common.mjs";'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed common import in ${filePath}`);
  }
});

console.log('Fixed common import paths in all loop files');