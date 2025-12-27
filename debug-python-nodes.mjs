import { extractPython } from './ast-to-mermaid/src/mappings/languages/python/extractors/python-extractor.mjs';
import { normalizePython } from './ast-to-mermaid/src/mappings/languages/python/normalizer/normalize-python.mjs';

const pythonCode = `
marks = 78

if marks >= 90:
    print('Grade A')
elif marks >= 75:
    print('Grade B')
elif marks >= 50:
    print('Grade C')
else:
    print('Fail')
`;

console.log('Original AST:');
const ast = extractPython(pythonCode);
console.log(JSON.stringify(ast, null, 2));

console.log('\nNormalized AST:');
const normalized = normalizePython(ast);
console.log(JSON.stringify(normalized, null, 2));