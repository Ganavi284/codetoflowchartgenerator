import { extractPython } from './ast-to-mermaid/src/mappings/languages/python/extractors/python-extractor.mjs';
import { normalizePython } from './ast-to-mermaid/src/mappings/languages/python/normalizer/normalize-python.mjs';

const sourceCode = `x = 10

if x > 5:
    print("Greater than 5")
else:
    print("Not greater than 5")`;

console.log("Source code:");
console.log(sourceCode);
console.log("\n");

// Extract AST using Tree-sitter
const ast = extractPython(sourceCode);
// console.log("Raw AST:");
// console.log(JSON.stringify(ast, null, 2));
console.log("\n");

// Normalize AST to unified node types
const normalized = normalizePython(ast);
console.log("Normalized AST:");
console.log(JSON.stringify(normalized, null, 2));