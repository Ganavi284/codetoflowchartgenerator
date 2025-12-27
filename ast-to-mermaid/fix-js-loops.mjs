// Fix import paths for all JavaScript loop files
import fs from 'fs';

const files = [
  'src/mappings/languages/javascript/loops/while/while.mjs',
  'src/mappings/languages/javascript/loops/do-while/do-while.mjs'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the import paths
    content = content.replace(
      'import { shapes } from "../../../mappings/mermaid/shapes.mjs";',
      'import { shapes } from "../../mermaid/shapes.mjs";'
    );

    content = content.replace(
      'import { linkNext } from "../../../../common/common.mjs";',
      'import { linkNext } from "../../../common/common.mjs";'
    );

    fs.writeFileSync(filePath, content);
    console.log(`Fixed import paths in ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Fixed import paths in JavaScript loop files');