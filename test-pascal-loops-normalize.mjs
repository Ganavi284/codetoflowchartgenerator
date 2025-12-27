import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';

const testCode = `
program TestLoops;
var
  i, j: integer;
begin
  for i := 1 to 5 do
    writeln('For loop: ', i);
    
  j := 0;
  while j < 3 do
  begin
    writeln('While loop: ', j);
    j := j + 1;
  end;
  
  i := 5;
  repeat
    writeln('Repeat loop: ', i);
    i := i - 1;
  until i = 0;
end.
`;

console.log('Testing Pascal loop normalization...');
const ast = extractPascal(testCode);
const normalized = normalizePascal(ast);

// Find the for loop in the normalized AST
function findForLoop(node) {
  if (!node) return null;
  
  if (node.type === 'For') {
    return node;
  }
  
  if (node.body && Array.isArray(node.body)) {
    for (const child of node.body) {
      const result = findForLoop(child);
      if (result) return result;
    }
  }
  
  if (node.body && typeof node.body === 'object') {
    const result = findForLoop(node.body);
    if (result) return result;
  }
  
  return null;
}

const forLoop = findForLoop(normalized);
if (forLoop) {
  console.log('Found For loop:');
  console.log('  init:', forLoop.init?.text);
  console.log('  cond:', forLoop.cond?.text);
  console.log('  update:', forLoop.update?.text);
  console.log('  body type:', forLoop.body?.type);
} else {
  console.log('No For loop found in normalized AST');
}

console.log('Test completed successfully');