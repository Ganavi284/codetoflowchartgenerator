import { execSync } from 'child_process';

console.log('Testing CLI...');
console.log('=============');

// Test with output file
console.log('Running CLI command...');
try {
  const output = execSync('node bin/cli.mjs -l c test.c -o cli-output.mmd', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('CLI output:', output);
} catch (error) {
  console.log('CLI stdout:', error.stdout);
  console.log('CLI stderr:', error.stderr);
  console.log('Error code:', error.status);
}