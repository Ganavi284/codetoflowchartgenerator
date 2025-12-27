/**
 * Normalize Pascal AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizePascal(node) {
  if (!node) return null;
  
  console.log(`Normalizing node type: ${node.type}`);
  
  // Convert Pascal-specific AST nodes to unified node types
  switch (node.type) {
    case "Program":
      return {
        type: "Program",
        name: "main",
        body: node.body ? node.body.map(normalizePascal).filter(Boolean) : []
      };
      
    case "if":
      // Simple if statement (no else)
      return {
        type: "If",
        cond: extractConditionFromIf(node),
        then: extractThenBranch(node),
        else: null
      };
      
    case "ifElse":
      // If-else statement
      return {
        type: "IfElse",
        cond: extractConditionFromIf(node),
        then: extractThenBranch(node),
        else: extractElseBranch(node)
      };
      
    case "ForStatement":
      // Pascal for loops have the structure: for variable := start to|downto end do
      // Extract the variable, start, direction (to/downto), and end values to create condition and update
      let init = null;
      let cond = null;
      let update = null;
      
      if (node.init) {
        init = normalizePascal(node.init);
        
        // Extract variable, start, direction, and end from the init expression
        if (node.init.text) {
          const match = node.init.text.match(/^(\w+)\s*:=\s*(.+?)\s+(to|downto)\s+(.+)$/);
          if (match) {
            const varName = match[1];
            const startValue = match[2];
            const direction = match[3];
            const endValue = match[4];
            
            // Create condition based on direction
            const condText = direction === 'to' ? `${varName} <= ${endValue}` : `${varName} >= ${endValue}`;
            cond = { text: condText };
            
            // Create update expression
            const updateText = direction === 'to' ? `${varName} := ${varName} + 1` : `${varName} := ${varName} - 1`;
            update = { text: updateText };
          }
        }
      }
      
      return {
        type: "For",
        init: init,
        cond: cond,
        update: update,
        body: normalizePascal(node.body)
      };
      
    case "WhileStatement":
      // For WhileStatement, we need to handle the case where child statements 
      // are separate AST nodes rather than a single body property
      let normalizedBody = null;
      
      // If node has a body property, process it as before
      if (node.body) {
        normalizedBody = normalizePascal(node.body);
        
        // If the body is a single expression with begin-end structure, try to split it
        if (normalizedBody && normalizedBody.type === "Expr" && normalizedBody.text && 
            normalizedBody.text.includes('begin') && normalizedBody.text.includes('end')) {
          // Parse the begin-end block into individual statements
          const blockContent = normalizedBody.text;
          // Extract content between 'begin' and 'end.'
          const beginEndMatch = blockContent.match(/begin\s*(.*?)\s*end\s*\./s);
          if (beginEndMatch) {
            let content = beginEndMatch[1].trim();
            
            // Split statements by semicolon
            const statements = content.split(';').map(s => s.trim()).filter(s => s);

            // Create individual expression nodes for each statement
            const statementNodes = statements.map(stmt => ({
              type: "Expr",
              text: stmt
            }));
            
            // Create a block node with these statements
            normalizedBody = {
              type: "Block",
              body: statementNodes
            };
          }
        } else if (normalizedBody && normalizedBody.type === "Expr" && normalizedBody.text && 
                   normalizedBody.text.includes(';;')) {
          // Handle multiple statements separated by ;; (which seems to be how the parser combines them)
          const statements = normalizedBody.text.split(';;').map(s => s.trim()).filter(s => s);
          
          // Create individual expression nodes for each statement
          const statementNodes = statements.map(stmt => ({
            type: "Expr",
            text: stmt
          }));
          
          // Create a block node with these statements
          normalizedBody = {
            type: "Block",
            body: statementNodes
          };
        }
      }
      
      // If no body property was found but we need to handle child statements,
      // we might need to extract them from the raw AST structure
      // For now, we'll use what we have
      
      return {
        type: "While",
        cond: normalizePascal(node.cond || node.test), // Handle both cond and test
        body: normalizedBody
      };
      
    case "RepeatStatement":  // Handle Pascal repeat-until loops
    case "RepeatUntil":
      // Handle the body in the same way as WhileStatement
      let repeatBody = normalizePascal(node.body);
      
      // If the body is a single expression with begin-end structure, try to split it
      if (repeatBody && repeatBody.type === "Expr" && repeatBody.text && 
          repeatBody.text.includes('begin') && repeatBody.text.includes('end')) {
        // Parse the begin-end block into individual statements
        const blockContent = repeatBody.text;
        // Extract content between 'begin' and 'end.'
        const beginEndMatch = blockContent.match(/begin\s*(.*?)\s*end\s*\./s);
        if (beginEndMatch) {
          let content = beginEndMatch[1].trim();
          
          // Split statements by semicolon
          const statements = content.split(';').map(s => s.trim()).filter(s => s);
          
          // Create individual expression nodes for each statement
          const statementNodes = statements.map(stmt => ({
            type: "Expr",
            text: stmt
          }));
          
          // Create a block node with these statements
          repeatBody = {
            type: "Block",
            body: statementNodes
          };
        }
      } else if (repeatBody && repeatBody.type === "Expr" && repeatBody.text && 
                 repeatBody.text.includes(';;')) {
        // Handle multiple statements separated by ;; (which seems to be how the parser combines them)
        const statements = repeatBody.text.split(';;').map(s => s.trim()).filter(s => s);
        
        // Create individual expression nodes for each statement
        const statementNodes = statements.map(stmt => ({
          type: "Expr",
          text: stmt
        }));
        
        // Create a block node with these statements
        repeatBody = {
          type: "Block",
          body: statementNodes
        };
      }
      
      return {
        type: "RepeatUntil",
        cond: normalizePascal(node.cond || node.untilCondition || node.test), // Handle different property names
        body: repeatBody
      };
      
    case "CallExpression":
    case "exprCall":
      // Handle writeln, write, and readln statements
      if (node.text) {
        const functionName = node.text.split('(')[0];
        if (functionName === 'writeln' || functionName === 'write' || functionName === 'readln' || functionName === 'read') {
          return {
            type: "IO",
            text: node.text
          };
        }
      }
      return {
        type: "Expr",
        text: node.text || "procedure call"
      };
      
    case "AssignmentExpression":
      return {
        type: "Assign",
        text: node.text.replace(':=', '=')
      };
      
    case "VariableDeclaration":
    case "declVar":
      return {
        type: "Decl",
        text: node.text
      };
      
    case "BlockStatement":
    case "block":
    case "Block":  // Add this case for our fallback parser
      console.log('Processing Block node with body:', node.body);
      return {
        type: "Block",
        body: node.body ? node.body.map(normalizePascal).filter(Boolean) : []
      };
      
    case "ExpressionStatement":
      return normalizePascal(node.expression);
      
    case "BinaryExpression":
    case "exprBinary":
      return {
        type: "Expr",
        text: node.text
      };
      
    case "identifier":
      return {
        type: "Expr",
        text: node.text
      };
      
    case "literalNumber":
      return {
        type: "Expr",
        text: node.text
      };
      
    case "literalString":
      return {
        type: "Expr",
        text: node.text
      };
      
    case "kGt": // Greater than operator
      return {
        type: "Expr",
        text: ">"
      };
      
    case "kLt": // Less than operator
      return {
        type: "Expr",
        text: "<"
      };
      
    case "kGe": // Greater than or equal operator
      return {
        type: "Expr",
        text: ">="
      };
      
    case "kLe": // Less than or equal operator
      return {
        type: "Expr",
        text: "<="
      };
      
    case "kEq": // Equal operator
      return {
        type: "Expr",
        text: "=="
      };
      
    case "kNe": // Not equal operator
      return {
        type: "Expr",
        text: "!="
      };
      
    // Handle Pascal case statements
    case "Case":
      return {
        type: "Case",
        cond: extractConditionFromCase(node),
        body: extractCaseBody(node)
      };
      
    case "caseCase":
      // Handle individual case options
      return {
        type: "CaseOption",
        value: node.value || node.label || "", // Use the value or label directly
        body: node.body ? normalizePascal(node.body) : null
      };
      
    case "kElse":
      // Handle else case
      return {
        type: "ElseCase",
        body: node.body ? normalizePascal(node.body) : null
      };
      
    // Handle Pascal function/procedure definitions
    case "defProc":
      return {
        type: "Function",
        name: node.name || "unknown",
        funcType: node.funcType || "procedure", // function or procedure
        signature: node.signature || "",
        body: node.body ? normalizePascal(node.body) : null
      };
      
    default:
      // For simple nodes with text, convert to expression
      if (node.text) {
        return {
          type: "Expr",
          text: node.text
        };
      }
      console.log(`Unknown node type: ${node.type}`);
      return null;
  }
}

// Helper function to extract condition from if statements
function extractConditionFromIf(ifNode) {
  // If we have source code and condition text directly (from fallback parser)
  if (ifNode.cond && ifNode.cond.text) {
    return { text: ifNode.cond.text };
  }
  
  // If we have source code, extract the actual condition from it
  if (ifNode.sourceCode) {
    try {
      // If we have start position, use it
      if (ifNode.start) {
        // Parse the start position to get line and column
        const startPos = ifNode.start.split(',').map(Number);
        const lineIndex = startPos[0] - 1; // Convert to 0-based index
        
        // Get the lines of source code
        const lines = ifNode.sourceCode.split('\n');
        
        // Search for the actual if statement in the vicinity of the reported start position
        // Look in a few lines before and after the reported position
        for (let i = Math.max(0, lineIndex - 1); i < Math.min(lines.length, lineIndex + 5); i++) {
          const line = lines[i];
          
          // Extract condition between "if" and "then"
          const conditionMatch = line.match(/if\s+(.*?)\s+then/i);
          if (conditionMatch) {
            return { text: conditionMatch[1].trim() };
          }
        }
      } else {
        // If no start position, search the entire source code
        const lines = ifNode.sourceCode.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const conditionMatch = line.match(/if\s+(.*?)\s+then/i);
          if (conditionMatch) {
            return { text: conditionMatch[1].trim() };
          }
        }
      }
    } catch (error) {
      console.error('Error extracting condition from source:', error);
    }
  }
  
  // Fallback to the old method if source code extraction fails
  if (!ifNode.raw) return { text: "condition" };
  
  // Look for condition: (exprBinary ...) pattern and capture everything until the next opening parenthesis or end
  const conditionMatch = ifNode.raw.match(/condition:\s*\((exprBinary[\s\S]*?)\)\s*\n\s*\(/);
  if (!conditionMatch) {
    // Try alternative pattern that captures until the end of the condition section
    const altMatch = ifNode.raw.match(/condition:\s*\((exprBinary[\s\S]*?)\)\s*\n\s*\(kThen/);
    if (altMatch) {
      const conditionText = extractExpressionText(altMatch[1]);
      return { text: conditionText };
    }
    return { text: "condition" };
  }
  
  // Extract the text from the condition
  const conditionText = extractExpressionText(conditionMatch[1]);
  return { text: conditionText };
}

// Helper function to extract then branch from if statements
function extractThenBranch(ifNode) {
  // If we have a then branch from the fallback parser, use it
  if (ifNode.then) {
    console.log('Processing then branch:', JSON.stringify(ifNode.then, null, 2));
    const result = normalizePascal(ifNode.then);
    console.log('Normalized then branch:', JSON.stringify(result, null, 2));
    return result;
  }
  
  if (!ifNode.raw) return null;
  
  // Simple direct approach - just check if there's a then section
  if (ifNode.raw.includes('then:')) {
    // Return a simple block with a placeholder
    return { type: "Block", body: [{ type: "Expr", text: "then branch content" }] };
  }
  
  return null;
}

// Helper function to extract else branch from if-else statements
function extractElseBranch(ifNode) {
  // If we have an else branch from the fallback parser, use it
  if (ifNode.else) {
    console.log('Processing else branch:', JSON.stringify(ifNode.else, null, 2));
    const result = normalizePascal(ifNode.else);
    console.log('Normalized else branch:', JSON.stringify(result, null, 2));
    return result;
  }
  
  if (!ifNode.raw) return null;
  
  // Simple direct approach - just check if there's an else section
  if (ifNode.raw.includes('else:')) {
    // Return a simple block with a placeholder
    return { type: "Block", body: [{ type: "Expr", text: "else branch content" }] };
  }
  
  return null;
}

// Helper function to extract case body from case statements
function extractCaseBody(caseNode) {
  // If we have options from the fallback parser, use them directly
  if (caseNode.options) {
    return caseNode.options.map(option => normalizePascal(option));
  }
  
  if (!caseNode.raw) return [];
  
  // Simple direct approach - just check if there are caseCase sections
  const caseCaseCount = (caseNode.raw.match(/caseCase/g) || []).length;
  if (caseCaseCount > 0) {
    // Return placeholders for each case option
    return Array(caseCaseCount).fill().map((_, index) => ({ 
      type: "CaseOption", 
      value: `option ${index + 1}`, 
      body: { type: "Block", body: [{ type: "Expr", text: `case body ${index + 1}` }] } 
    }));
  }
  
  return [];
}

// Helper function to extract condition from case statements
function extractConditionFromCase(caseNode) {
  // If we have the condition text directly (from fallback parser)
  if (caseNode.cond && caseNode.cond.text) {
    return { text: caseNode.cond.text };
  }
  
  // If we have source code, extract the actual expression from it
  if (caseNode.sourceCode) {
    try {
      // If we have start position, use it
      if (caseNode.start) {
        // Parse the start position to get line and column
        const startPos = caseNode.start.split(',').map(Number);
        const lineIndex = startPos[0] - 1; // Convert to 0-based index
        
        // Get the lines of source code
        const lines = caseNode.sourceCode.split('\n');
        
        // Search for the actual case statement in the vicinity of the reported start position
        // Look in a few lines before and after the reported position
        for (let i = Math.max(0, lineIndex - 1); i < Math.min(lines.length, lineIndex + 5); i++) {
          const line = lines[i];
          
          // Extract expression between "case" and "of"
          const expressionMatch = line.match(/case\s+(.*?)\s+of/i);
          if (expressionMatch) {
            return { text: expressionMatch[1].trim() };
          }
        }
      } else {
        // If no start position, search the entire source code
        const lines = caseNode.sourceCode.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const expressionMatch = line.match(/case\s+(.*?)\s+of/i);
          if (expressionMatch) {
            return { text: expressionMatch[1].trim() };
          }
        }
      }
    } catch (error) {
      console.error('Error extracting case expression from source:', error);
    }
  }
  
  // Fallback to the old method if source code extraction fails
  if (!caseNode.raw) return { text: "expression" };
  
  // Look for the identifier after 'case'
  const identifierMatch = caseNode.raw.match(/identifier\s*\[[^\]]+\]\s*-\s*\[[^\]]+\]\s*\n\s*([^\n]*)/);
  if (identifierMatch) {
    return { text: identifierMatch[1].trim() };
  }
  
  return { text: "expression" };
}

// Helper function to extract expression text
function extractExpressionText(exprContent) {
  // Extract the actual values directly
  const lhsMatch = exprContent.match(/lhs:\s*\(identifier\s*\[[^\]]+\]\s*-\s*\[[^\]]+\]\s*\n\s*([^\n]*)/);
  const operatorMatch = exprContent.match(/operator:\s*\(k\w+\s*\[[^\]]+\]\s*-\s*\[[^\]]+\]\s*\n\s*([^\n]*)/);
  const rhsMatch = exprContent.match(/rhs:\s*\(literalNumber\s*\[[^\]]+\]\s*-\s*\[[^\]]+\]\s*\n\s*([^\n]*)/);
  
  const lhs = lhsMatch ? lhsMatch[1].trim() : "";
  const operator = operatorMatch ? operatorMatch[1].trim() : "";
  const rhs = rhsMatch ? rhsMatch[1].trim() : "";
  
  // Map operator keywords to symbols
  const operatorMap = {
    'kGt': '>',
    'kLt': '<',
    'kGe': '>=',
    'kLe': '<=',
    'kEq': '==',
    'kNe': '!='
  };
  
  const operatorSymbol = operatorMap[operator] || operator;
  
  if (lhs && operatorSymbol && rhs) {
    return `${lhs} ${operatorSymbol} ${rhs}`;
  }
  
  // Fallback: return a generic condition
  return "condition";
}

// Helper function to extract case label text
function extractCaseLabel(labelNode) {
  if (!labelNode) return "";
  
  // Handle simple literal numbers
  if (labelNode.type === 'literalNumber') {
    return labelNode.text;
  }
  
  // Handle ranges
  if (labelNode.type === 'range') {
    const start = labelNode.child(0) ? labelNode.child(0).text : "";
    const end = labelNode.child(1) ? labelNode.child(1).text : "";
    return `${start}..${end}`;
  }
  
  return labelNode.text || "";
}