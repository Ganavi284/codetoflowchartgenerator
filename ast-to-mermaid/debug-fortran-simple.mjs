import { generateFlowchart } from './src/mappings/languages/fortran/pipeline/flow.mjs';

const testCode = `program test
    integer :: x = 5
    if (x > 0) then
        print *, 'positive'
    end if
end program test
`;

try {
  const result = generateFlowchart(testCode);
  console.log('Flowchart generated:');
  console.log(result);
} catch (e) {
  console.error('Error:', e.message);
  console.error('Stack:', e.stack);
}