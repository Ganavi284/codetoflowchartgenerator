/**
 * Normalize Pascal AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizePascal(node) {
  if (!node) return null;
  
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
      // Simple if statement (no else)
      return {
        type: "If",
        cond: extractConditionFromIf(node),
        then: extractThenBranch(node),
        else: null
      };
      
    case "ifElse":
      // If-else statement
      // Check if the else branch contains another if statement (else-if chain)
      if (node.else && node.else.body && node.else.body.length > 0) {
        const elseBody = node.else.body[0];
        if (elseBody.type === "if") {
          // This is an if-else-if chain
          return {
            type: "ifElseIf",
            cond: extractConditionFromIf(node),
            then: extractThenBranch(node),
            else: normalizePascal(elseBody)
          };
        }
      }
      
      return {
        type: "If",
        cond: extractConditionFromIf(node),
        then: extractThenBranch(node),
        else: extractElseBranch(node)
      };
      
    case "ForStatement":
      return {
        type: "For",
        init: normalizePascal(node.init),
        cond: normalizePascal(node.test),
        update: normalizePascal(node.update),
        body: normalizePascal(node.body)
      };
      
    case "WhileStatement":
      return {
        type: "While",
        cond: normalizePascal(node.test),
        body: normalizePascal(node.body)
      };
      
    case "repeat":
      return {
        type: "Repeat",
        cond: normalizePascal(node.condition),
        body: normalizePascal(node.body)
      };
      
    case "CallExpression":
    case "exprCall":
      // Handle writeln, write, readln, read statements
      if (node.text && (node.text.startsWith('writeln') || node.text.startsWith('write') || node.text.startsWith('readln') || node.text.startsWith('read'))) {
        return {
          type: "IO",
          text: node.text
        };
      }
      return {
        type: "Expr",
        text: node.text
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
    case "Block":
      return {
        type: "Block",
        body: node.body ? node.body.map(normalizePascal).filter(Boolean) : []
      };
      
    case "ExpressionStatement":
      return normalizePascal(node.expression);
      
    case "BinaryExpression":
    case "exprBinary":
      // For binary expressions, we need to construct the text from components
      if (node.lhs && node.operator && node.rhs) {
        const left = normalizePascal(node.lhs);
        const right = normalizePascal(node.rhs);
        
        // Get operator text
        let operatorText = "?";
        if (node.operator.type) {
          switch (node.operator.type) {
            case "kGt": operatorText = ">"; break;
            case "kLt": operatorText = "<"; break;
            case "kGe": operatorText = ">="; break;
            case "kLe": operatorText = "<="; break;
            case "kEq": operatorText = "=="; break;
            case "kNe": operatorText = "!="; break;
            case "kGte": operatorText = ">="; break;
            case "kLte": operatorText = "<="; break;
            case "kAdd": operatorText = "+"; break;
            case "kSub": operatorText = "-"; break;
            case "kMul": operatorText = "*"; break;
            case "kDiv": operatorText = "/"; break;
            default: operatorText = node.operator.text || "?";
          }
        } else {
          operatorText = node.operator.text || "?";
        }
        
        return {
          type: "Expr",
          text: `${left?.text || "?"} ${operatorText} ${right?.text || "?"}`
        };
      }
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
    case "case":
      return {
        type: "Case",
        cond: extractConditionFromCase(node),
        body: extractCaseBody(node)
      };
      
    case "caseCase":
      // Handle individual case options
      return {
        type: "CaseOption",
        value: node.label ? extractCaseLabel(node.label) : "", // Extract the case label
        body: node.body ? normalizePascal(node.body) : null
      };
      
    case "kElse":
      // Handle else case
      return {
        type: "ElseCase",
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
  // Handle fallback parser nodes
  if (ifNode.then) {
    return normalizePascal(ifNode.then);
  }
  
  // Handle raw tree-sitter nodes
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
  // Handle fallback parser nodes
  if (ifNode.else) {
    return normalizePascal(ifNode.else);
  }
  
  // Handle raw tree-sitter nodes
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
  // Handle fallback parser nodes
  if (caseNode.body && Array.isArray(caseNode.body)) {
    // Process the case options from the fallback parser
    return caseNode.body.map(option => {
      // Normalize the option based on its type
      if (option.type === 'caseCase' || option.type === 'kElse') {
        return {
          type: option.type === 'kElse' ? 'ElseCase' : 'CaseOption',
          value: option.label || '',
          body: option.body ? normalizePascal(option.body) : null
        };
      }
      return normalizePascal(option);
    }).filter(Boolean);
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