// Simple test to debug if-else parsing
const sourceCode = `program Test;
begin
  if score >= 90 then
    grade := 'A'
  else if score >= 80 then
    grade := 'B'
  else
    grade := 'F';
end.`;

const lines = sourceCode.split('\n');

console.log('Lines:');
lines.forEach((line, index) => {
  console.log(`${index}: "${line}"`);
});

console.log('\nParsing if statement:');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  console.log(`\nChecking line ${i}: "${line}"`);
  
  // Match if statements
  const ifMatch = line.match(/^if\s+(.+?)\s+then/i);
  if (ifMatch) {
    const condition = ifMatch[1];
    console.log(`  Found if statement with condition: "${condition}"`);
    
    // Look for the then statement
    let j = i + 1;
    while (j < lines.length) {
      const nextLine = lines[j].trim();
      console.log(`    Checking next line ${j}: "${nextLine}"`);
      if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('{')) {
        console.log(`      Found then statement: "${nextLine}"`);
        break;
      }
      j++;
    }
    
    // Look for else statement
    let k = j + 1;
    while (k < lines.length) {
      const nextLine = lines[k].trim();
      console.log(`    Checking for else at line ${k}: "${nextLine}"`);
      if (nextLine.toLowerCase() === 'else') {
        console.log(`      Found else at line ${k}`);
        // Look for the else statement
        k++;
        while (k < lines.length) {
          const elseLine = lines[k].trim();
          console.log(`      Checking else content at line ${k}: "${elseLine}"`);
          if (elseLine && !elseLine.startsWith('//') && !elseLine.startsWith('{')) {
            console.log(`        Found else statement: "${elseLine}"`);
            break;
          }
          k++;
        }
        break;
      }
      k++;
    }
    break;
  }
}