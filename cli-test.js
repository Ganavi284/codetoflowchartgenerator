const { exec } = require('child_process');

// Test JavaScript code with if statement
const testCode = `
let x = prompt("Enter a number:");
x = Number(x);
if (x > 0) {
  console.log("Positive");
}
`;

console.log('Testing JavaScript flowchart generation via CLI...');
console.log('Test code:');
console.log(testCode);

// Test via curl to the AST-to-Mermaid service
const curlCommand = `curl -X POST http://localhost:3400/convert -H "Content-Type: application/json" -d "{\\"code\\":\\"${testCode.replace(/\n/g, '\\n').replace(/"/g, '\\\\\"')}\\",\\"language\\":\\"javascript\\"}"`;

console.log('\\nExecuting CLI command:');
console.log(curlCommand);

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('Error executing CLI command:', error);
    return;
  }
  
  if (stderr) {
    console.error('CLI stderr:', stderr);
    return;
  }
  
  console.log('\\nCLI stdout:');
  console.log(stdout);
  
  try {
    const response = JSON.parse(stdout);
    console.log('\\nGenerated flowchart:');
    console.log(response.mermaid);
  } catch (parseError) {
    console.error('Error parsing JSON response:', parseError);
  }
});