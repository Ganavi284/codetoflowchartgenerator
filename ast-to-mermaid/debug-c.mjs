import { generateFlowchart } from './src/mappings/languages/c/pipeline/flow.mjs';
const testCode = `int main() {
    int x = 5;
    if (x > 0) {
        printf("positive");
    } else {
        printf("not positive");
    }
    return 0;
}`;

try {
  const result = generateFlowchart(testCode);
  console.log('C Flowchart:');
  console.log(result);
} catch (e) {
  console.error('Error:', e.message);
}