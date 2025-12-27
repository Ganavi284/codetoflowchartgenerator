import { generateFlowchart } from './src/mappings/languages/fortran/pipeline/flow.mjs';
import fs from 'fs';

const fortranCode = fs.readFileSync('./test-gradecheck.f90', 'utf8');

console.log('Testing Fortran GradeCheck program with if-elseif-else conditional...');
console.log('Source code:');
console.log(fortranCode);
console.log('\n' + '='.repeat(50));
console.log('Generated flowchart:');

try {
  const result = generateFlowchart(fortranCode);
  console.log(result);
} catch (e) {
  console.error('Error:', e.message);
  console.error('Stack:', e.stack);
}