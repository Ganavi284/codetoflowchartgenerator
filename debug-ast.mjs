import { extractJava } from './ast-to-mermaid/src/mappings/languages/java/extractors/java-extractor.mjs';
import fs from 'fs';

const sourceCode = fs.readFileSync('./FunctionWithIf.java', 'utf-8');
const javaAst = extractJava(sourceCode);
console.log(JSON.stringify(javaAst, null, 2));

console.log('Source code:');
console.log(sourceCode);

console.log('\n=== RAW AST ===');
console.log(JSON.stringify(javaAst, null, 2));