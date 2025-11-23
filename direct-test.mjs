import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

const code = 'console.log("Hello, World!");';

try {
  const result = generateFlowchart(code);
  console.log('Generated flowchart:');
  console.log(result);
} catch (error) {
  console.error('Error generating flowchart:', error);
  console.error('Stack trace:', error.stack);
}