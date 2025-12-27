import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse tree-sitter CLI output into a structured AST
 * @param {string} cliOutput - Raw tree-sitter CLI output
 * @param {string} sourceCode - Original source code
 * @returns {Object} - Structured AST
 */
function parsePascalCLIOutput(cliOutput, sourceCode) {
  // Split the output into lines
  const lines = cliOutput.split('\n');
  const statements = [];
  
  // Look for if and case statements
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match if statements
    const ifMatch = line.match(/^\s*\((if(?:Else)?) \[([^\]]+)\] - \[([^\]]+)\]/);
    if (ifMatch) {
      const type = ifMatch[1];
      const start = ifMatch[2];
      const end = ifMatch[3];
      
      // Extract the content of this statement by counting parentheses
      let content = '';
      let parenCount = 1;
      let j = i + 1;
      
      while (j < lines.length && parenCount > 0) {
        const nextLine = lines[j];
        content += nextLine + '\n';
        
        // Count opening and closing parentheses
        const openCount = (nextLine.match(/\(/g) || []).length;
        const closeCount = (nextLine.match(/\)/g) || []).length;
        parenCount += openCount - closeCount;
        
        j++;
      }
      
      statements.push({
        type: type,
        start: start,
        end: end,
        raw: content,
        sourceCode: sourceCode // Pass the source code for condition extraction
      });
      
      // Skip the lines we've already processed
      i = j - 1;
    }
    
    // Match case statements
    const caseMatch = line.match(/^\s*\(case \[([^\]]+)\] - \[([^\]]+)\]/);
    if (caseMatch) {
      const start = caseMatch[1];
      const end = caseMatch[2];
      
      // Extract the content of this statement by counting parentheses
      let content = '';
      let parenCount = 1;
      let j = i + 1;
      
      while (j < lines.length && parenCount > 0) {
        const nextLine = lines[j];
        content += nextLine + '\n';
        
        // Count opening and closing parentheses
        const openCount = (nextLine.match(/\(/g) || []).length;
        const closeCount = (nextLine.match(/\)/g) || []).length;
        parenCount += openCount - closeCount;
        
        j++;
      }
      
      statements.push({
        type: 'case',
        start: start,
        end: end,
        raw: content,
        sourceCode: sourceCode // Pass the source code for condition extraction
      });
      
      // Skip the lines we've already processed
      i = j - 1;
      continue;
    }
    
    // Match variable declarations
    const varMatch = line.match(/^\s*\(declVar \[([^\]]+)\] - \[([^\]]+)\]/);
    if (varMatch) {
      const start = varMatch[1];
      const end = varMatch[2];
      
      // Extract the content of this statement by counting parentheses
      let content = '';
      let parenCount = 1;
      let j = i + 1;
      
      while (j < lines.length && parenCount > 0) {
        const nextLine = lines[j];
        content += nextLine + '\n';
        
        // Count opening and closing parentheses
        const openCount = (nextLine.match(/\(/g) || []).length;
        const closeCount = (nextLine.match(/\)/g) || []).length;
        parenCount += openCount - closeCount;
        
        j++;
      }
      
      statements.push({
        type: 'declVar',
        start: start,
        end: end,
        raw: content,
        sourceCode: sourceCode
      });
      
      // Skip the lines we've already processed
      i = j - 1;
      continue;
    }
  }
  
  return {
    type: 'Program',
    body: statements
  };
}

/**
 * Extract Pascal AST using the local tree-sitter-pascal grammar via CLI
 * @param {string} sourceCode - Pascal source code
 * @returns {Object} - Parsed (simplified) AST
 */
export function extractPascal(sourceCode) {
  try {
    const tempFile = join(tmpdir(), `temp-pascal-${Date.now()}.pas`);

    try {
      // Write source to a temporary file
      writeFileSync(tempFile, sourceCode);

      // Use the tree-sitter CLI from the local tree-sitter-pascal clone
      const cliOutput = execSync(`npx tree-sitter parse "${tempFile}"`, {
        cwd: join(__dirname, '../../../../../parsers/tree-sitter-pascal'),
        encoding: 'utf8'
      });

      // Clean up temp file
      unlinkSync(tempFile);

      // Convert CLI output into a simplified AST structure
      return parsePascalCLIOutput(cliOutput, sourceCode);
    } catch (cliError) {
      console.error('Pascal CLI parsing failed:', cliError.message);
      try {
        unlinkSync(tempFile);
      } catch {}
      throw cliError;
    }
  } catch (error) {
    console.error('Error extracting Pascal AST:', error);
    // Fall back to manual parsing
    console.log('Falling back to manual Pascal parsing...');
    return parsePascalFallback(sourceCode);
  }
}

/**
 * Fallback parser for Pascal code when tree-sitter fails
 * @param {string} sourceCode - Pascal source code
 * @returns {Object} - Simplified AST
 */
function parsePascalFallback(sourceCode) {
  const lines = sourceCode.split('\n');
  const statements = [];
  
  // Track if we're in the variable declaration section
  let inVarSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('//') || line.startsWith('{')) continue;
    
    // Detect start of variable declaration section
    if (line.toLowerCase() === 'var') {
      inVarSection = true;
      continue;
    }
    
    // Detect end of variable declaration section
    if (line.toLowerCase() === 'begin') {
      inVarSection = false;
      continue;
    }
    
    // If we're in the variable declaration section, parse variable declarations
    if (inVarSection) {
      // Match variable declarations (identifier: type)
      const varMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*(?:,\s*[a-zA-Z_][a-zA-Z0-9_]*)*)\s*:\s*(.+?);$/i);
      if (varMatch) {
        statements.push({
          type: 'declVar',
          text: `var ${varMatch[1]}: ${varMatch[2]}`,
          sourceCode: sourceCode
        });
        continue;
      }
    }
    
    // Match if statements
    const ifMatch = line.match(/^if\s+(.+?)\s+then/i);
    if (ifMatch) {
      const condition = ifMatch[1];
      
      // Check if this is part of an if-else-if chain
      let isElseIf = false;
      if (i > 0) {
        // Check if the previous non-empty line was "else"
        let prevLineIndex = i - 1;
        while (prevLineIndex >= 0) {
          const prevLine = lines[prevLineIndex].trim();
          if (prevLine && !prevLine.startsWith('//') && !prevLine.startsWith('{')) {
            if (prevLine.toLowerCase() === 'else') {
              isElseIf = true;
            }
            break;
          }
          prevLineIndex--;
        }
      }
      
      // For simple if statements (not part of if-else-if chain)
      if (!isElseIf) {
        // Check if this is an if-else statement
        let hasElse = false;
        let thenStatement = null;
        let elseStatement = null;
        let j = i + 1;
        
        // Look for the then statement (next non-empty line)
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('{')) {
            // Extract the statement after "then"
            const thenMatch = nextLine.match(/^(.+?);?$/);
            if (thenMatch) {
              thenStatement = thenMatch[1];
            }
            break;
          }
          j++;
        }
        
        // Look for else statement
        let k = j + 1;
        while (k < lines.length) {
          const nextLine = lines[k].trim();
          if (nextLine.toLowerCase() === 'else') {
            hasElse = true;
            // Collect everything after else until we hit the final statement
            let elseLines = [];
            k++;
            
            // Collect all lines that are part of the else clause
            // This includes else-if chains and the final else statement
            while (k < lines.length) {
              const elseLine = lines[k].trim();
              if (elseLine && !elseLine.startsWith('//') && !elseLine.startsWith('{')) {
                // Add the line to our else clause
                elseLines.push(elseLine);
                
                // If this line ends with a semicolon, it's likely the end of a statement
                if (elseLine.endsWith(';')) {
                  break;
                }
                
                // If this is the final else (not followed by if), stop here
                if (elseLine.toLowerCase() === 'else') {
                  // Continue to collect the next line which should be the statement
                  k++;
                  continue;
                }
              }
              k++;
            }
            
            if (elseLines.length > 0) {
              elseStatement = elseLines.join(' ').replace(/;$/, ''); // Remove trailing semicolon
            }
            break;
          }
          // Stop if we encounter another statement
          if (nextLine && !nextLine.startsWith('//') && nextLine !== 'begin' && nextLine !== 'end.') {
            break;
          }
          k++;
        }
        
        statements.push({
          type: 'ifElse',
          cond: { text: condition },
          then: thenStatement ? { 
            type: 'Block', 
            body: [{
              type: 'exprCall',
              text: thenStatement
            }]
          } : null,
          else: hasElse && elseStatement ? { 
            type: 'Block', 
            body: [{
              type: 'exprCall',
              text: elseStatement
            }]
          } : null,
          sourceCode: sourceCode
        });
        
        // Skip lines we've processed
        i = hasElse ? k : j;
        continue;
      } else {
        // This is an else-if statement, treat it as a simple if
        let thenStatement = null;
        let j = i + 1;
        
        // Look for the then statement (next non-empty line)
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('{')) {
            // Extract the statement after "then"
            const thenMatch = nextLine.match(/^(.+?);?$/);
            if (thenMatch) {
              thenStatement = thenMatch[1];
            }
            break;
          }
          j++;
        }
        
        statements.push({
          type: 'if',
          cond: { text: condition },
          then: thenStatement ? { 
            type: 'Block', 
            body: [{
              type: 'exprCall',
              text: thenStatement
            }]
          } : null,
          sourceCode: sourceCode
        });
        
        // Skip lines we've processed
        i = j;
        continue;
      }
    }
    
    // Match writeln, write, readln, read statements
    const ioMatch = line.match(/^(writeln|write|readln|read)\s*\((.*)\)/i);
    if (ioMatch) {
      statements.push({
        type: 'exprCall',
        text: `${ioMatch[1]}(${ioMatch[2]})`,
        sourceCode: sourceCode
      });
      continue;
    }
    
    // Match case statements
    const caseMatch = line.match(/^case\s+(.+?)\s+of/i);
    if (caseMatch) {
      const expression = caseMatch[1];
      
      // Collect case options until we find "end"
      const caseOptions = [];
      let k = i + 1;
      let hasElse = false;
      let elseBody = null;
      
      while (k < lines.length) {
        const caseLine = lines[k].trim();
        
        // Stop at end of case statement
        if (caseLine.toLowerCase() === 'end;') {
          break;
        }
        
        // Check for else clause
        if (caseLine.toLowerCase() === 'else') {
          hasElse = true;
          k++;
          // Collect the else body until we find "end;"
          const elseLines = [];
          while (k < lines.length) {
            const elseLine = lines[k].trim();
            if (elseLine.toLowerCase() === 'end;') {
              break;
            }
            if (elseLine) {
              elseLines.push(elseLine);
            }
            k++;
          }
          
          // Create else body from collected lines
          if (elseLines.length > 0) {
            elseBody = {
              type: 'exprCall',
              text: elseLines.join(' ').replace(/;$/, '') // Remove trailing semicolon
            };
          }
          continue;
        }
        
        // Match case options (value: statement)
        const optionMatch = caseLine.match(/^(['"\w]+(?:\.\.['"\w]+)?):\s*(.+)$/);
        if (optionMatch) {
          caseOptions.push({
            type: 'caseCase',
            label: optionMatch[1],
            body: {
              type: 'exprCall',
              text: optionMatch[2].replace(/;$/, '') // Remove trailing semicolon
            }
          });
        }
        
        k++;
      }
      
      // Add else clause if it exists
      if (elseBody) {
        caseOptions.push({
          type: 'kElse',
          body: elseBody
        });
      }
      
      statements.push({
        type: 'case',
        cond: { text: expression },
        body: caseOptions,
        sourceCode: sourceCode
      });
      
      // Skip lines we've processed
      i = k;
      continue;
    }
    
    // Match assignment statements
    const assignMatch = line.match(/^(\w+)\s*:=\s*(.+?);$/);
    if (assignMatch) {
      statements.push({
        type: 'assignment',
        text: `${assignMatch[1]} := ${assignMatch[2]}`,
        sourceCode: sourceCode
      });
      continue;
    }
  }
  
  return {
    type: 'Program',
    body: statements
  };
}