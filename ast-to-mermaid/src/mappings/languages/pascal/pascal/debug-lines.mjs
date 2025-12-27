import fs from 'fs';

console.log('Debugging Pascal Lines\n');

// Read the Pascal test file
const sourceFile = process.argv[2] || 'test-else-if-with-blocks.pas';
console.log(`Reading Pascal file: ${sourceFile}`);

try {
  const sourceCode = fs.readFileSync(sourceFile, 'utf8');
  console.log('\nSource code:');
  console.log(sourceCode);
  
  // Split into lines and show each line with line numbers
  const lines = sourceCode.split('\n');
  console.log('\nLines:');
  lines.forEach((line, index) => {
    console.log(`${index + 1}: ${JSON.stringify(line)}`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}