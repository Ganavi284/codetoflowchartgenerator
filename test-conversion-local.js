const fs = require('fs');

// Read the test JavaScript file
const code = fs.readFileSync('./test-js-code.js', 'utf8');

// Make a request to the AST-to-Mermaid service
fetch('http://localhost:3400/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: code,
    language: 'javascript'
  }),
})
.then(response => response.json())
.then(data => {
  console.log('Mermaid diagram:');
  console.log(data.mermaid);
})
.catch(error => {
  console.error('Error:', error);
});