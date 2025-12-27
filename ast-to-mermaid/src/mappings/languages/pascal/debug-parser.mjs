import { extractPascal } from './extractors/pascal-extractor.mjs';
import fs from 'fs';

console.log('Debugging Pascal Parser\n');

// Read the Pascal test file
const sourceFile = process.argv[2] || 'test-else-if-with-blocks.pas';
console.log(`Reading Pascal file: ${sourceFile}`);

try {
  const sourceCode = fs.readFileSync(sourceFile, 'utf8');
  console.log('\nSource code:');
  console.log(sourceCode);
  
  // Parse the AST
  console.log('\nParsing AST...\n');
  const ast = extractPascal(sourceCode);
  
  // Display the AST
  console.log('Generated AST:');
  console.log(JSON.stringify(ast, null, 2));
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}