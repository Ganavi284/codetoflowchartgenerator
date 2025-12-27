import { generateFlowchart } from './src/mappings/languages/fortran/pipeline/flow.mjs';
import fs from 'fs';

// Test simple if statement
const simpleIfCode = `program test
    integer :: x = 5
    if (x > 0) then
        print *, 'positive'
    end if
end program test
`;

console.log('Testing simple if statement...');
try {
  const result = generateFlowchart(simpleIfCode);
  console.log('Simple If Result:');
  console.log(result);
  console.log('\n' + '='.repeat(50) + '\n');
} catch (e) {
  console.error('Error with simple if:', e.message);
}

// Test if-else statement  
const ifElseCode = `program test
    integer :: x = 5
    if (x > 0) then
        print *, 'positive'
    else
        print *, 'not positive'
    end if
end program test
`;

console.log('Testing if-else statement...');
try {
  const result2 = generateFlowchart(ifElseCode);
  console.log('If-Else Result:');
  console.log(result2);
  console.log('\n' + '='.repeat(50) + '\n');
} catch (e) {
  console.error('Error with if-else:', e.message);
}

// Test the original test file
const originalTestCode = fs.readFileSync('./test-fortran-conditionals.f90', 'utf8');
console.log('Testing original test file...');
try {
  const result3 = generateFlowchart(originalTestCode);
  console.log('Original Test File Result:');
  console.log(result3);
} catch (e) {
  console.error('Error with original test:', e.message);
}