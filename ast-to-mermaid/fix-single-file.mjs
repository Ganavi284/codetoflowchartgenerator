// Fix import paths for JavaScript for.mjs
import fs from 'fs';

const filePath = 'src/mappings/languages/javascript/loops/for.mjs';
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
console.log('Fixed import paths in JavaScript for.mjs');