import { extractJava } from './ast-to-mermaid/src/mappings/languages/java/extractors/java-extractor.mjs';
import { normalizeJava } from './ast-to-mermaid/src/mappings/languages/java/normalizer/normalize-java.mjs';
import fs from 'fs';

const sourceCode = fs.readFileSync('./FunctionWithIf.java', 'utf-8');
const javaAst = extractJava(sourceCode);
const javaNormalized = normalizeJava(javaAst);
console.log('Java Normalized AST:');
console.log(JSON.stringify(javaNormalized, null, 2));

import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';

const testCode = `
program TestLoops;
var
  i: integer;
begin
  for i := 1 to 3 do
    writeln('For loop: ', i);
end.
`;

console.log('Testing normalized AST structure...');

const pascalAst = extractPascal(testCode);
const pascalNormalized = normalizePascal(pascalAst);

console.log('Pascal Normalized AST:');
console.log(JSON.stringify(pascalNormalized, null, 2));

// Find the for loop in the normalized AST
function findForLoop(node, path = []) {
  if (!node) return null;
  
  if (node.type === 'For') {
    console.log('Found For loop at path:', path.join(' -> '));
    console.log('For loop body:', node.body);
    return node;
  }
  
  if (typeof node === 'object' && node !== null) {
    for (const key in node) {
      if (typeof node[key] === 'object' && node[key] !== null) {
        const result = findForLoop(node[key], [...path, `${key}`]);
        if (result) return result;
      }
    }
  }
  
  return null;
}

const forLoop = findForLoop(pascalNormalized);
if (forLoop) {
  console.log('\nPascal For loop body structure:');
  console.log(JSON.stringify(forLoop.body, null, 2));
}

console.log('\nTest completed successfully');