import { extractPython } from './ast-to-mermaid/src/mappings/languages/python/extractors/python-extractor.mjs';
import { normalizePython } from './ast-to-mermaid/src/mappings/languages/python/normalizer/normalize-python.mjs';

const sourceCode = `marks = 78

if marks >= 90:
    print('Grade A')
elif marks >= 75:
    print('Grade B')
elif marks >= 50:
    print('Grade C')
else:
    print('Fail')`;

console.log("Source code:");
console.log(sourceCode);
console.log("\n");

// Extract AST using Tree-sitter
const ast = extractPython(sourceCode);
console.log("Raw AST:");
console.log(JSON.stringify(ast, null, 2));
console.log("\n");

// Normalize AST to unified node types
const normalized = normalizePython(ast);
console.log("Normalized AST:");
console.log(JSON.stringify(normalized, null, 2));