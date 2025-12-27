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
  
  // Look for various Pascal statements
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
      continue;
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
    
    // Match writeln, write, and readln statements
    const callMatch = line.match(/^\s*\((?:exprCall|call) \[([^\]]+)\] - \[([^\]]+)\]/);
    if (callMatch) {
      const start = callMatch[1];
      const end = callMatch[2];
      
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
        type: 'exprCall',
        start: start,
        end: end,
        raw: content,
        sourceCode: sourceCode
      });
      
      // Skip the lines we've already processed
      i = j - 1;
      continue;
    }
    
    // Match assignment statements
    const assignMatch = line.match(/^\s*\(assignment \[([^\]]+)\] - \[([^\]]+)\]/);
    if (assignMatch) {
      const start = assignMatch[1];
      const end = assignMatch[2];
      
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
        type: 'assignment',
        start: start,
        end: end,
        raw: content,
        sourceCode: sourceCode
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
    
    // Match function/procedure definitions
    const procMatch = line.match(/^\s*\(defProc \[([^\]]+)\] - \[([^\]]+)\]/);
    if (procMatch) {
      const start = procMatch[1];
      const end = procMatch[2];
      
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
        type: 'defProc',
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
 * Fallback parser for Pascal code when tree-sitter fails
 * @param {string} sourceCode - Pascal source code
 * @returns {Object} - Simplified AST
 */
function parsePascalFallback(sourceCode) {
  const lines = sourceCode.split('\n');
  const statements = [];
  
  // Track if we're in the variable declaration section
  let inVarSection = false;
  // Track if we're inside a function/procedure definition
  let inFunctionDefinition = false;
  let currentFunction = null;
  
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
    
    // Detect function/procedure definitions
    const functionMatch = line.match(/^(function|procedure)\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    if (functionMatch) {
      const funcType = functionMatch[1];
      const funcName = functionMatch[2];
      
      // Collect function signature (parameters, return type, etc.)
      let signature = line;
      let j = i + 1;
      
      // Look for continuation lines until we hit the function body or ;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (nextLine.toLowerCase() === 'begin' || nextLine === ';') {
          break;
        }
        if (nextLine) {
          signature += ' ' + nextLine;
        }
        j++;
      }
      
      // Create function definition node
      statements.push({
        type: 'defProc',
        name: funcName,
        signature: signature,
        funcType: funcType,
        sourceCode: sourceCode
      });
      
      // Skip processed lines
      i = j - 1;
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
    
    // Match for loops
    const forMatch = line.match(/^for\s+(.+?)\s+:=\s+(.+?)\s+(to|downto)\s+(.+?)\s+do/i);
    if (forMatch) {
      const init = `${forMatch[1]} := ${forMatch[2]}`;
      const direction = forMatch[3];
      const endValue = forMatch[4];
      const loopCondition = `${init} ${direction} ${endValue}`;
      
      // Look for the body of the for loop
      let body = '';
      let j = i + 1;
      
      // If the next line starts with 'begin', collect until 'end'
      if (lines[j].trim().toLowerCase() === 'begin') {
        body = 'begin';
        j++;
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine.toLowerCase() === 'end') {
            body += ' ' + nextLine;
            j++;
            break;
          }
          if (nextLine) {
            body += ' ' + nextLine;
          }
          j++;
        }
      } else {
        // Single-line body
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('{')) {
          body = nextLine;
          j++;
        }
      }
      
      statements.push({
        type: 'ForStatement',
        init: { text: loopCondition },
        body: parseCaseBody(body),
        sourceCode: sourceCode
      });
      
      // Skip processed lines
      i = j - 1;
      continue;
    }
    
    // Match while loops
    const whileMatch = line.match(/^while\s+(.+?)\s+do/i);
    if (whileMatch) {
      const condition = whileMatch[1];
      
      // Look for the body of the while loop
      let body = '';
      let j = i + 1;
      
      // If the next line starts with 'begin', collect until 'end'
      if (lines[j].trim().toLowerCase() === 'begin') {
        body = 'begin';
        j++;
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          if (nextLine.toLowerCase() === 'end') {
            body += ' ' + nextLine;
            j++;
            break;
          }
          if (nextLine) {
            body += ' ' + nextLine;
          }
          j++;
        }
      } else {
        // Single-line body
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('{')) {
          body = nextLine;
          j++;
        }
      }
      
      statements.push({
        type: 'WhileStatement',
        cond: { text: condition },
        body: parseCaseBody(body),
        sourceCode: sourceCode
      });
      
      // Skip processed lines
      i = j - 1;
      continue;
    }
    
    // Match repeat-until loops
    if (line.toLowerCase().startsWith('repeat')) {
      // Collect statements until we find 'until'
      let loopBody = [];
      let j = i + 1;
      let untilCondition = '';
      
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        
        // Check if this is the until condition
        const untilMatch = nextLine.match(/^until\s+(.+)$/i);
        if (untilMatch) {
          untilCondition = untilMatch[1];
          j++; // Skip the until line
          break;
        }
        
        // Add the line to the loop body if it's not empty and not a comment
        if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('{')) {
          loopBody.push(nextLine);
        }
        
        j++;
      }
      
      statements.push({
        type: 'RepeatStatement',  // Use the same type as in the normalizer
        untilCondition: { text: untilCondition },
        body: parseCaseBody(loopBody.join('; ')),
        sourceCode: sourceCode
      });
      
      // Skip processed lines
      i = j - 1;
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
          // Collect the else body until we find "end;" or another case-like construct
          const elseLines = [];
          while (k < lines.length) {
            const elseLine = lines[k].trim();
            // Stop at end of case statement
            if (elseLine.toLowerCase() === 'end;') {
              break;
            }
            // Stop if we encounter another case-like construct
            if (elseLine.includes(':') || 
                elseLine.toLowerCase().startsWith('else ') ||
                elseLine.toLowerCase() === 'else') {
              k--; // Step back so this line can be processed in the main loop
              break;
            }
            if (elseLine) {
              elseLines.push(elseLine);
            }
            k++;
          }
          
          // Create else body from collected lines
          if (elseLines.length > 0) {
            // Join the lines with proper semicolons to preserve statement boundaries
            let elseText = elseLines.join('; ').replace(/;$/, ''); // Remove trailing semicolon
            
            // If the first line is 'begin' and we don't see 'end', add it
            if (elseLines[0].trim() === 'begin' && !elseText.includes('end')) {
              elseText += '; end';
            }
            
            // Parse the else body through parseCaseBody to handle complex statements
            elseBody = parseCaseBody(elseText);
          }
          continue;
        }
        
        // Check for else clause with statement on same line
        if (caseLine.toLowerCase().startsWith('else ')) {
          hasElse = true;
          // Extract the statement after "else"
          const elseStatement = caseLine.substring(5).trim(); // Remove "else "
          if (elseStatement) {
            // Handle begin/end blocks properly
            let finalElseStatement = elseStatement.replace(/;$/, ''); // Remove trailing semicolon
            
            // If this is a begin statement without end, add end
            if (finalElseStatement.trim() === 'begin') {
              finalElseStatement += '; end';
            }
            
            // Parse the else body through parseCaseBody to handle complex statements
            elseBody = parseCaseBody(finalElseStatement);
          }
          k++;
          continue;
        }
        
        // Match case options (value: statement)
        // Handle both single-line and multi-line case statements
        // Check if this line contains a colon (indicating a case label)
        if (caseLine.includes(':')) {
          // Split the line at the first colon
          const colonIndex = caseLine.indexOf(':');
          const label = caseLine.substring(0, colonIndex).trim();
          let statement = caseLine.substring(colonIndex + 1).trim();
          
          // Always look for the statement on the next line(s) to handle multi-line cases properly
          // This includes cases where the statement starts on the same line but continues on next lines
          let nextLineIndex = k + 1;
          
          // If we have a partial statement, start with it
          if (statement && statement !== ';') {
            // If the statement is just 'begin', we need to collect the rest
            if (statement === 'begin') {
              // Clear the statement and collect everything from the next line
              statement = 'begin';
            }
            // For other statements, we'll collect additional lines if needed
          } else {
            // No statement on this line, start fresh
            statement = '';
          }
          
          // Track begin/end block depth and if/else depth
          let beginEndDepth = statement === 'begin' ? 1 : 0;
          let ifElseDepth = statement.startsWith('if ') ? 1 : 0;
          let elseSeen = false; // Track if we've seen an else for the current if
          
          // Collect lines until we find a complete statement
          while (nextLineIndex < lines.length) {
            const nextLine = lines[nextLineIndex].trim();
            
            // Track if/else blocks
            if (nextLine.startsWith('if ')) {
              ifElseDepth++;
              elseSeen = false; // Reset elseSeen when we start a new if
            } else if (nextLine.toLowerCase() === 'else' && ifElseDepth > 0 && !elseSeen) {
              // This is an else clause for an if statement we're tracking
              elseSeen = true;
            } else if (ifElseDepth > 0 && (nextLine.endsWith(';') || nextLine === 'end' || nextLine === 'end;')) {
              // This might be the end of an if statement
              // Check if we've seen the else clause for this if
              if (elseSeen) {
                ifElseDepth--;
                elseSeen = false;
              }
            }
            
            // Track begin/end blocks
            if (nextLine === 'begin') {
              beginEndDepth++;
              statement += (statement ? ' ' : '') + nextLine;
            } else if (nextLine === 'end' || nextLine === 'end;') {
              beginEndDepth--;
              statement += (statement ? ' ' : '') + (nextLine === 'end;' ? 'end' : nextLine);
              // If we've closed all begin blocks, we're done with this case
              if (beginEndDepth <= 0) {
                nextLineIndex++;
                break;
              }
            } else if (beginEndDepth > 0) {
              // Inside a begin/end block, add the line
              if (nextLine) {
                statement += (statement ? ' ' : '') + nextLine;
              }
            } else {
              // Not inside a begin/end block
              
              // Stop conditions for non-begin/end statements:
              // Only stop if we're not inside an if statement and we're not at the top level of this case option
              if (ifElseDepth <= 0 && beginEndDepth <= 0) {
                if (nextLine.includes(':') || 
                    nextLine.toLowerCase() === 'else' || 
                    nextLine.toLowerCase() === 'end;' ||
                    nextLine.startsWith('case ')) {
                  break;
                }
              }
              
              // Add this line to the statement
              if (nextLine) {
                statement += (statement ? ' ' : '') + nextLine;
              }
              
              // If this line ends with semicolon and we're not in an if statement, we have a complete statement
              if (nextLine.endsWith(';') && ifElseDepth <= 0) {
                nextLineIndex++; // Move past this line
                break;
              }
            }
            
            nextLineIndex++;
          }
          
          // Remove trailing semicolon if present
          statement = statement.replace(/;$/, '').trim();
          
          caseOptions.push({
            type: 'caseCase',
            value: label,
            body: parseCaseBody(statement)
          });
          
          // Skip the lines we've processed
          if (nextLineIndex) {
            k = nextLineIndex - 1; // -1 because the loop will increment k
          }
        }
        // Note: We don't have an else clause here because we want to process ALL lines
        // within the case statement, not just those with colons
        
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
        type: 'Case',  // Changed from 'case' to 'Case' to match the switch statement
        cond: { text: expression },
        options: caseOptions,
        sourceCode: sourceCode
      });
      
      // Skip lines we've processed
      i = k;
      continue;
    }
    
    // Match if statements
    const ifMatch = line.match(/^if\s+(.+?)\s+then/i);
    if (ifMatch) {
      const condition = ifMatch[1];
      // Check if this is an if-else statement
      let hasElse = false;
      let thenStatement = null;
      let elseStatement = null;
      let j = i + 1;
      
      // Look for the then statement (next non-empty line)
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('{')) {
          // Check if this is a begin/end block
          if (nextLine === 'begin') {
            // Collect all lines until we find 'end'
            let blockLines = [];
            let k = j + 1;
            while (k < lines.length) {
              const blockLine = lines[k].trim();
              if (blockLine === 'end' || blockLine === 'end;') {
                break;
              }
              if (blockLine && !blockLine.startsWith('//') && !blockLine.startsWith('{')) {
                blockLines.push(blockLine);
              }
              k++;
            }
            // Join the block lines with semicolons
            thenStatement = blockLines.join('; ');
            // Update j to skip the lines we've processed
            j = k + 1;
          } else {
            // Extract the statement after "then"
            const thenMatch = nextLine.match(/^(.+?);?$/);
            if (thenMatch) {
              thenStatement = thenMatch[1];
            }
            j++;
          }
          break;
        }
        j++;
      }
      
      // Look for else statement
      let k = j;
      let lastProcessedLine = j; // Track the last line we processed as part of the if statement
      
      // Process chained else-if statements
      let currentElseStatement = null;
      let lastElseIf = null;
      
      while (k < lines.length) {
        const nextLine = lines[k].trim();
        
        // Check for else if (chained if statement)
        const elseIfMatch = nextLine.match(/^else\s+if\s+(.+?)\s*then/i);
        if (elseIfMatch) {
          // Found an else-if chain
          hasElse = true;
          const elseIfCondition = elseIfMatch[1];
          
          // Look for the then statement
          let thenStatement = null;
          let m = k + 1;
          while (m < lines.length) {
            const thenLine = lines[m].trim();
            if (thenLine && !thenLine.startsWith('//') && !thenLine.startsWith('{')) {
              // Check if this is a begin/end block
              if (thenLine === 'begin') {
                // Collect all lines until we find 'end'
                let blockLines = [];
                let n = m + 1;
                while (n < lines.length) {
                  const blockLine = lines[n].trim();
                  if (blockLine === 'end' || blockLine === 'end;') {
                    break;
                  }
                  if (blockLine && !blockLine.startsWith('//') && !blockLine.startsWith('{')) {
                    blockLines.push(blockLine);
                  }
                  n++;
                }
                // Join the block lines with semicolons
                thenStatement = blockLines.join('; ');
                // Update m to skip the lines we've processed
                m = n + 1;
              } else {
                const thenMatch = thenLine.match(/^(.+?);?$/);
                if (thenMatch) {
                  thenStatement = thenMatch[1];
                }
                m++;
              }
              break;
            }
            m++;
          }
          
          // Create a nested if-else structure
          const nestedIf = {
            type: 'ifElse',
            cond: { text: elseIfCondition },
            then: thenStatement ? { 
              type: 'Block', 
              body: [{
                type: 'exprCall',
                text: thenStatement
              }]
            } : null,
            else: null,
            sourceCode: sourceCode
          };
          
          // Chain the else-if statements properly
          if (lastElseIf) {
            // Add this else-if as the else branch of the previous else-if
            lastElseIf.else = nestedIf;
          } else {
            // This is the first else-if, store it as the main else statement
            currentElseStatement = nestedIf;
          }
          
          lastElseIf = nestedIf;
          lastProcessedLine = m;
          k = m;
          continue; // Continue to check for more else-if statements
        } else if (nextLine.toLowerCase() === 'else') {
          hasElse = true;
          // Look for the else statement (next non-empty line after else)
          k++;
          while (k < lines.length) {
            const elseLine = lines[k].trim();
            if (elseLine && !elseLine.startsWith('//') && !elseLine.startsWith('{')) {
              // Check if this is a begin/end block
              if (elseLine === 'begin') {
                console.log('Found begin in final else block');
                // Collect all lines until we find 'end'
                let blockLines = [];
                let m = k + 1;
                while (m < lines.length) {
                  const blockLine = lines[m].trim();
                  console.log('Processing block line:', JSON.stringify(blockLine));
                  if (blockLine === 'end' || blockLine === 'end;') {
                    console.log('Found end of block');
                    break;
                  }
                  if (blockLine && !blockLine.startsWith('//') && !blockLine.startsWith('{')) {
                    blockLines.push(blockLine);
                  }
                  m++;
                }
                // Join the block lines with semicolons
                const finalElseStatement = blockLines.join('; ');
                
                // Parse the begin/end block properly
                const parsedBlock = parseCaseBody('begin ' + finalElseStatement + ' end');
                
                // Add the final else statement to the chain
                if (lastElseIf) {
                  lastElseIf.else = parsedBlock;
                } else {
                  currentElseStatement = parsedBlock;
                }
                
                // Update lastProcessedLine to skip the lines we've processed
                lastProcessedLine = m + 1;
                k = m + 1;
              } else {
                // Extract the statement after "else"
                const elseMatch = elseLine.match(/^(.+?);?$/);
                if (elseMatch) {
                  const finalElseStatement = elseMatch[1];
                  
                  // Add the final else statement to the chain
                  if (lastElseIf) {
                    lastElseIf.else = {
                      type: 'Block',
                      body: [{
                        type: 'exprCall',
                        text: finalElseStatement
                      }]
                    };
                  } else {
                    currentElseStatement = {
                      type: 'Block',
                      body: [{
                        type: 'exprCall',
                        text: finalElseStatement
                      }]
                    };
                  }
                }
                lastProcessedLine = k + 1;
                k++;
              }
              break;
            }
            k++;
          }
          break;
        }
        // Stop if we encounter another statement
        if (nextLine && !nextLine.startsWith('//') && nextLine !== 'begin' && nextLine !== 'end.' && !nextLine.toLowerCase().startsWith('else if')) {
          break;
        }
        k++;
      }
      
      // Use the properly chained else statement
      elseStatement = currentElseStatement;
      
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
          body: [elseStatement.type ? elseStatement : {
            type: 'exprCall',
            text: elseStatement
          }]
        } : null,
        sourceCode: sourceCode
      });
      
      // Skip lines we've processed as part of this if statement
      i = lastProcessedLine;
      continue;
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
      // Fall back to manual parsing
      console.log('Falling back to manual Pascal parsing...');
      return parsePascalFallback(sourceCode);
    }
  } catch (error) {
    console.error('Error extracting Pascal AST:', error);
    // Fall back to manual parsing
    console.log('Falling back to manual Pascal parsing...');
    return parsePascalFallback(sourceCode);
  }
}

// Add a helper function to recursively parse statements within case bodies
function parseCaseBody(bodyText) {
  // Handle empty body
  if (!bodyText || bodyText.trim() === '') {
    return {
      type: 'exprCall',
      text: ''
    };
  }
  
  // Trim the body text
  const trimmedBody = bodyText.trim();
  //console.log('Parsing case body:', trimmedBody);
  
  // Handle simple expressions (single statements without complex control structures)
  // But don't treat blocks that start with begin as simple expressions
  if (!trimmedBody.includes('if ') && 
      !trimmedBody.includes('for ') && 
      !trimmedBody.includes('while ') && 
      !trimmedBody.includes('repeat ') &&
      !(trimmedBody.startsWith('begin') && trimmedBody.endsWith('end')) &&
      !trimmedBody.includes('else')) {
    //console.log('Treating as simple expression');
    return {
      type: 'exprCall',
      text: trimmedBody
    };
  }
  
  // Handle begin/end blocks by extracting the content between begin and end
  if (trimmedBody.startsWith('begin') && trimmedBody.endsWith('end')) {
    //console.log('Handling begin/end block');
    // Extract content between begin and end
    // Find the position of 'begin' and 'end'
    const beginIndex = trimmedBody.indexOf('begin');
    const endIndex = trimmedBody.lastIndexOf('end');
    
    // Extract content between begin and end (excluding the words themselves)
    if (beginIndex !== -1 && endIndex !== -1 && endIndex > beginIndex) {
      const content = trimmedBody.substring(beginIndex + 5, endIndex).trim();
      //console.log('Extracted content from begin/end block:', JSON.stringify(content));
      if (content) {
        // For begin/end blocks, we need to parse the content into separate statements
        // This is a simplified approach - in a full implementation we would parse recursively
        return {
          type: 'Block',
          body: parseStatementsInBlock(content)
        };
      }
    }
  }
  
  // Handle if statements
  if (trimmedBody.startsWith('if ')) {
    //console.log('Attempting to parse if statement');
    // Try to parse if/else statements
    // More robust pattern to handle complex then/else parts
    const ifElseMatch = trimmedBody.match(/^if\s+(.+?)\s+then\s+(.+?)(?:\s+else\s+(.+))?$/i);
    if (ifElseMatch) {
      //console.log('Successfully matched if statement');
      const condition = ifElseMatch[1];
      const thenPart = ifElseMatch[2];
      const elsePart = ifElseMatch[3];
      
      // Parse the then part properly
      const thenParsed = parseCaseBody(thenPart);
      
      return {
        type: 'ifElse',
        cond: { text: condition },
        then: {
          type: 'Block',
          body: [thenParsed]
        },
        else: elsePart ? {
          type: 'Block',
          body: [parseCaseBody(elsePart)]
        } : null
      };
    }
  }
  
  // Handle for loops - more flexible pattern
  if (trimmedBody.startsWith('for ')) {
    //console.log('Attempting to parse for loop');
    // More flexible pattern to match for loops
    const forMatch = trimmedBody.match(/^for\s+(.+?)\s+do\s+(.+)$/i);
    if (forMatch) {
      //console.log('Successfully matched for loop');
      const init = forMatch[1];
      const body = forMatch[2];
      
      // Parse the body properly
      const bodyParsed = parseCaseBody(body);
      
      return {
        type: 'ForStatement', // Changed from 'For' to 'ForStatement' to match normalizer
        init: { text: init },
        body: {
          type: 'Block',
          body: [bodyParsed]
        }
      };
    } else {
      //console.log('Failed to match for loop pattern');
      //console.log('Pattern attempted: /^for\\s+(.+?)\\s+do\\s+(.+)$/i');
    }
  }
  
  // Handle while loops - more flexible pattern
  if (trimmedBody.startsWith('while ')) {
    //console.log('Attempting to parse while loop');
    // More flexible pattern to match while loops
    // Handle both single-line and multi-line while loops
    
    // Try to handle while loops with begin/end blocks properly
    const whileWithBeginMatch = trimmedBody.match(/^while\s+(.+?)\s+do\s+begin\s+(.+?)\s+end\s*;?\s*$/i);
    if (whileWithBeginMatch) {
      //console.log('Successfully matched while loop with begin/end');
      const condition = whileWithBeginMatch[1];
      const bodyContent = whileWithBeginMatch[2];
      
      // Parse the body content into statements
      const bodyStatements = parseStatementsInBlock(bodyContent);
      
      return {
        type: 'WhileStatement',
        cond: { text: condition },
        body: {
          type: 'Block',
          body: bodyStatements
        }
      };
    }
    
    // Try single-line pattern
    const whileMatch = trimmedBody.match(/^while\s+(.+?)\s+do\s+(.+)$/i);
    if (whileMatch) {
      //console.log('Successfully matched while loop (single-line)');
      const condition = whileMatch[1];
      const body = whileMatch[2];
      
      return {
        type: 'WhileStatement',
        cond: { text: condition },
        body: {
          type: 'Block',
          body: [{
            type: 'exprCall',
            text: body
          }]
        }
      };
    } else {
      // Try multi-line pattern where body is on next line(s)
      const whileHeaderMatch = trimmedBody.match(/^while\s+(.+?)\s+do\s*$/i);
      if (whileHeaderMatch) {
        //console.log('Successfully matched while loop header');
        const condition = whileHeaderMatch[1];
        // Extract the body (everything after the header)
        const bodyStartIndex = trimmedBody.indexOf('do') + 2;
        const body = trimmedBody.substring(bodyStartIndex).trim();
        
        // If body is empty, it might be on the next line
        if (!body) {
          // For now, we'll treat this as a simple while statement
          return {
            type: 'WhileStatement',
            cond: { text: condition },
            body: {
              type: 'Block',
              body: [{
                type: 'exprCall',
                text: ''
              }]
            }
          };
        } else {
          return {
            type: 'WhileStatement',
            cond: { text: condition },
            body: {
              type: 'Block',
              body: [{
                type: 'exprCall',
                text: body
              }]
            }
          };
        }
      }
      //console.log('Failed to match while loop pattern');
      //console.log('Patterns attempted: /^while\\s+(.+?)\\s+do\\s+(.+)$/i and /^while\\s+(.+?)\\s+do\\s*$/i');
    }
  }
  
  // For complex statements we can't easily parse, return as exprCall
  //console.log('Treating as exprCall fallback');
  return {
    type: 'exprCall',
    text: trimmedBody
  };
}

// Helper function to parse statements within a begin/end block
function parseStatementsInBlock(content) {
  // This is a simplified implementation
  // In a full implementation, we would parse the content into separate AST nodes
  const statements = [];
  
  // Preprocess to remove comments
  let cleanContent = content;
  //console.log('Original content:', JSON.stringify(content));
  
  // Remove single-line comments (// ...)
  // But be careful not to remove statements that come after the comment on the same line
  //console.log('Before // comment removal:', JSON.stringify(cleanContent));
  // Split by semicolons first, then remove comments from each part
  const parts = cleanContent.split(';');
  const cleanedParts = parts.map(part => {
    // Remove comments from this part
    return part.replace(/\/\/.*$/gm, '');
  });
  cleanContent = cleanedParts.join(';');
  //console.log('After // comment removal:', JSON.stringify(cleanContent));
  //console.log('After // comment removal:', JSON.stringify(cleanContent));
  
  // Remove multi-line comments ({ ... })
  // This is a simple implementation - a full implementation would need to handle nested braces
  let braceCommentDepth = 0;
  let cleanedContent = '';
  for (let i = 0; i < cleanContent.length; i++) {
    const char = cleanContent[i];
    
    if (char === '{') {
      braceCommentDepth++;
      continue;
    }
    
    if (char === '}') {
      braceCommentDepth--;
      continue;
    }
    
    if (braceCommentDepth <= 0) {
      cleanedContent += char;
    }
  }
  
  cleanContent = cleanedContent;
  //console.log('After {} comment removal:', JSON.stringify(cleanContent));
  
  // Also remove any remaining whitespace lines
  cleanContent = cleanContent.replace(/^\s*\n/gm, '');
  //console.log('After whitespace line removal:', JSON.stringify(cleanContent));
  
  // Split the content into individual statements
  // First split by semicolons
  const rawStatements = cleanContent.split(';');
  //console.log('Raw statements after splitting by semicolon:', rawStatements);
  
  // Process each raw statement
  for (let i = 0; i < rawStatements.length; i++) {
    const rawStatement = rawStatements[i].trim();
    //console.log('Processing raw statement:', JSON.stringify(rawStatement));
    
    // Skip empty statements
    if (!rawStatement) continue;
    
    // Check if this is a control structure that should be parsed as a whole
    // Trim the statement to handle leading/trailing spaces
    const trimmedStatement = rawStatement.trim();
    if ((trimmedStatement.startsWith('if ') && trimmedStatement.includes(' then')) ||
        (trimmedStatement.startsWith('for ') && trimmedStatement.includes(' do')) ||
        (trimmedStatement.startsWith('while ') && trimmedStatement.includes(' do'))) {
      //console.log('Found control structure:', trimmedStatement);
      // Parse the control structure
      const parsedStatement = parseCaseBody(trimmedStatement);
      statements.push(parsedStatement);
    } else {
      // Other statements (might be assignments, etc.)
      //console.log('Found other statement:', trimmedStatement);
      const parsedStatement = parseCaseBody(trimmedStatement);
      statements.push(parsedStatement);
    }
  }
  
  return statements.length > 0 ? statements : [{
    type: 'exprCall',
    text: content
  }];
}

// Helper function to parse control structures (if, for, while)
function parseControlStructure(content, type) {
  let statementEnd = -1;
  let beginEndDepth = 0;
  
  // Find the end of the control structure
  for (let i = 0; i < content.length; i++) {
    if (content.substring(i).startsWith('begin')) {
      beginEndDepth++;
      i += 4; // Skip "begin"
    } else if (content.substring(i).startsWith('end')) {
      beginEndDepth--;
      i += 2; // Skip "end"
      if (beginEndDepth <= 0) {
        statementEnd = i + 1;
        break;
      }
    } else if (content[i] === ';' && beginEndDepth <= 0) {
      // For simple control structures without begin/end blocks
      statementEnd = i;
      break;
    }
  }
  
  if (statementEnd !== -1) {
    const statementText = content.substring(0, statementEnd).trim();
    const remaining = content.substring(statementEnd + 1).trim();
    
    // Parse the statement using parseCaseBody
    const parsedStatement = parseCaseBody(statementText);
    return {
      statement: parsedStatement,
      remaining: remaining
    };
  }
  
  return null;
}
