import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';
import { ctx } from './src/mappings/languages/c/mermaid/context.mjs';
import { walk } from './src/mappings/languages/c/walkers/walk.mjs';
import { mapNodeC } from './src/mappings/languages/c/map-node-c.mjs';
import { finalizeFlowContext } from './src/mappings/languages/c/mermaid/finalize-context.mjs';
import fs from 'fs';

// C test code with if-else
const sourceCode = `
#include <stdio.h>

int main() {
    int x = 10;
    
    if (x > 5) {
        printf("x is greater than 5\\n");
    } else if (x == 5) {
        printf("x is equal to 5\\n");
    } else {
        printf("x is less than 5\\n");
    }
    
    return 0;
}
`;

console.log('C Source Code:');
console.log(sourceCode);
console.log('\n' + '='.repeat(50) + '\n');

// 1. Extract AST using Tree-sitter
const ast = extractC(sourceCode);
console.log('AST Extraction Result:');
// console.log(JSON.stringify(ast, null, 2));
console.log('\n' + '='.repeat(50) + '\n');

// 2. Normalize AST to unified node types
const normalized = normalizeC(ast);
console.log('Normalized AST:');
console.log(JSON.stringify(normalized, null, 2));
console.log('\n' + '='.repeat(50) + '\n');

// 3. Create context for flowchart generation
const context = ctx();

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

// 4. Walk nodes to build flowchart
if (normalized) {
  context.handle = (node) => {
    if (node && node.type) {
      mapNodeC(node, context);
    }
  };
  walk(normalized, context);
  delete context.handle;
}

// 5. Finalize context
finalizeFlowContext(context);

// 6. Emit final Mermaid flowchart
const mermaid = context.emit();
console.log('Generated Mermaid Flowchart:');
console.log(mermaid);