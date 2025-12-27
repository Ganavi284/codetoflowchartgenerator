import { generateFlowchart as generateFlowchartNew } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';
import { generateFlowchart as generateFlowchartOld } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/pipeline/flow.mjs';

// Test with the exact code from your example
const testCode = `program CheckNumber;
var
  n: integer;
begin
  write('Enter a number: ');
  readln(n);

  if n >= 0 then
    writeln('Number is Positive')
  else
    writeln('Number is Negative');
end.`;

console.log('=== Comprehensive Pascal Conditional Test ===\n');

console.log('Test code:');
console.log(testCode);
console.log('\n' + '='.repeat(50));

// Test newer pipeline
console.log('\n1. Newer Pipeline Results:');
try {
  const flowchartNew = generateFlowchartNew(testCode);
  console.log('Generated flowchart:');
  console.log(flowchartNew);
  
  // Validation
  const linesNew = flowchartNew.split('\n');
  const hasVarDeclNew = linesNew.some(line => line.includes('var n: integer'));
  const hasWriteNew = linesNew.some(line => line.includes("write('Enter a number: ')"));
  const hasReadlnNew = linesNew.some(line => line.includes('readln(n)'));
  const hasConditionNew = linesNew.some(line => line.includes('if n >= 0'));
  const hasPositiveNew = linesNew.some(line => line.includes("writeln('Number is Positive')"));
  const hasNegativeNew = linesNew.some(line => line.includes("writeln('Number is Negative')"));
  const hasProperBranchingNew = linesNew.some(line => line.includes('-- Yes -->')) && 
                                linesNew.some(line => line.includes('-- No -->'));
  const hasEndConnectionsNew = linesNew.some(line => line.includes('N5 --> END')) || 
                              linesNew.some(line => line.includes('N6 --> END')); // Will depend on node numbering
  
  console.log('\nValidation:');
  console.log(`✓ Variable declaration: ${hasVarDeclNew}`);
  console.log(`✓ Write statement: ${hasWriteNew}`);
  console.log(`✓ Readln statement: ${hasReadlnNew}`);
  console.log(`✓ Condition node: ${hasConditionNew}`);
  console.log(`✓ Positive branch: ${hasPositiveNew}`);
  console.log(`✓ Negative branch: ${hasNegativeNew}`);
  console.log(`✓ Proper branching (Yes/No): ${hasProperBranchingNew}`);
  console.log(`✓ End connections: ${hasEndConnectionsNew}`);
  
} catch (error) {
  console.error('Error with newer pipeline:', error.message);
}

console.log('\n' + '='.repeat(50));

// Test older pipeline
console.log('\n2. Older Pipeline Results:');
try {
  const flowchartOld = generateFlowchartOld(testCode);
  console.log('Generated flowchart:');
  console.log(flowchartOld);
  
  // Validation
  const linesOld = flowchartOld.split('\n');
  const hasVarDeclOld = linesOld.some(line => line.includes('var n: integer'));
  const hasWriteOld = linesOld.some(line => line.includes("write('Enter a number: ')"));
  const hasReadlnOld = linesOld.some(line => line.includes('readln(n)'));
  const hasConditionOld = linesOld.some(line => line.includes('if n >= 0'));
  const hasPositiveOld = linesOld.some(line => line.includes("writeln('Number is Positive')"));
  const hasNegativeOld = linesOld.some(line => line.includes("writeln('Number is Negative')"));
  const hasProperBranchingOld = linesOld.some(line => line.includes('-- Yes -->')) && 
                               linesOld.some(line => line.includes('-- No -->'));
  const hasEndConnectionsOld = linesOld.some(line => line.includes('--> END'));
  
  console.log('\nValidation:');
  console.log(`✓ Variable declaration: ${hasVarDeclOld}`);
  console.log(`✓ Write statement: ${hasWriteOld}`);
  console.log(`✓ Readln statement: ${hasReadlnOld}`);
  console.log(`✓ Condition node: ${hasConditionOld}`);
  console.log(`✓ Positive branch: ${hasPositiveOld}`);
  console.log(`✓ Negative branch: ${hasNegativeOld}`);
  console.log(`✓ Proper branching (Yes/No): ${hasProperBranchingOld}`);
  console.log(`✓ End connections: ${hasEndConnectionsOld}`);
  
} catch (error) {
  console.error('Error with older pipeline:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('\n🎉 Test completed! Both pipelines should now handle Pascal conditionals correctly.');