/**
 * Mermaid code generator for Java language
 */

export function generateMermaidFromAST(ast) {
  let mermaidCode = 'graph TD\n';
  let nodeIdCounter = 0;
  
  // Process the AST nodes and generate Mermaid code
  if (ast.body && Array.isArray(ast.body)) {
    ast.body.forEach(node => {
      const result = processProgramNode(node, 1, nodeIdCounter);
      mermaidCode += result.code;
      nodeIdCounter = result.counter;
    });
  }
  
  return mermaidCode;
}

function processProgramNode(node, depth, counter) {
  const indent = '    '.repeat(depth);
  let mermaidLine = '';
  let newCounter = counter;
  
  switch (node.type) {
    case 'ClassDeclaration':
      // Process class body
      if (node.body && node.body.body && Array.isArray(node.body.body)) {
        node.body.body.forEach(childNode => {
          const result = processClassMemberNode(childNode, depth, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
        });
      }
      break;
  }
  
  return { code: mermaidLine, counter: newCounter };
}

function processClassMemberNode(node, depth, counter) {
  const indent = '    '.repeat(depth);
  let mermaidLine = '';
  let newCounter = counter;
  
  switch (node.type) {
    case 'MethodDeclaration':
      const methodId = `F${++newCounter}`;
      mermaidLine += `${indent}${methodId}[Method: ${node.name}]\n`;
      if (node.body && node.body.body && Array.isArray(node.body.body)) {
        let lastChildId = methodId;
        node.body.body.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === methodId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${methodId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
  }
  
  return { code: mermaidLine, counter: newCounter };
}

function processNode(node, depth, counter) {
  const indent = '    '.repeat(depth);
  let mermaidLine = '';
  let newCounter = counter;
  
  switch (node.type) {
    case 'ForStatement':
      const forId = `L${++newCounter}`;
      mermaidLine += `${indent}${forId}[For Loop]\n`;
      if (node.body && node.body.body && Array.isArray(node.body.body)) {
        let lastChildId = forId;
        node.body.body.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === forId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${forId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
      
    case 'WhileStatement':
      const whileId = `L${++newCounter}`;
      mermaidLine += `${indent}${whileId}[While Loop]\n`;
      if (node.body && node.body.body && Array.isArray(node.body.body)) {
        let lastChildId = whileId;
        node.body.body.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === whileId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${whileId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
      
    case 'DoWhileStatement':
      const doWhileId = `L${++newCounter}`;
      mermaidLine += `${indent}${doWhileId}[Do-While Loop]\n`;
      if (node.body && node.body.body && Array.isArray(node.body.body)) {
        let lastChildId = doWhileId;
        node.body.body.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === doWhileId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${doWhileId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
      
    case 'IfStatement':
      const ifId = `C${++newCounter}`;
      mermaidLine += `${indent}${ifId}[If Statement]\n`;
      if (node.consequent && node.consequent.body && Array.isArray(node.consequent.body)) {
        let lastChildId = ifId;
        node.consequent.body.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === ifId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${ifId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      if (node.alternate && node.alternate.body && Array.isArray(node.alternate.body)) {
        const elseId = `E${++newCounter}`;
        mermaidLine += `${indent}${elseId}[Else]\n`;
        mermaidLine += `${indent}${ifId} --> ${elseId}\n`;
        
        let lastChildId = elseId;
        node.alternate.body.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === elseId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${elseId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
      
    case 'SwitchStatement':
      const switchId = `S${++newCounter}`;
      mermaidLine += `${indent}${switchId}[Switch Statement]\n`;
      if (node.cases && Array.isArray(node.cases)) {
        node.cases.forEach(caseNode => {
          const result = processSwitchCase(caseNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect switch to first case
          const firstCaseId = getChildId(caseNode, newCounter);
          if (firstCaseId) {
            mermaidLine += `${indent}${switchId} --> ${firstCaseId}\n`;
          }
        });
      }
      break;
      
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression') {
        if (node.expression.callee && node.expression.callee.object && 
            node.expression.callee.object.name === 'System' &&
            node.expression.callee.property && 
            node.expression.callee.property.name === 'out') {
          const ioId = `I${++newCounter}`;
          mermaidLine += `${indent}${ioId}[Print Statement]\n`;
        }
      }
      break;
      
    case 'BreakStatement':
      const breakId = `B${++newCounter}`;
      mermaidLine += `${indent}${breakId}[Break Statement]\n`;
      break;
  }
  
  return { code: mermaidLine, counter: newCounter };
}

function processSwitchCase(caseNode, depth, counter) {
  const indent = '    '.repeat(depth);
  let caseLine = '';
  let newCounter = counter;
  
  let caseId;
  if (caseNode.test) {
    caseId = `CASE${++newCounter}`;
    caseLine += `${indent}${caseId}[Case ${caseNode.test.value}]\n`;
  } else {
    caseId = `CASE${++newCounter}`;
    caseLine += `${indent}${caseId}[Default Case]\n`;
  }
  
  if (caseNode.consequent && Array.isArray(caseNode.consequent)) {
    let lastChildId = caseId;
    caseNode.consequent.forEach(node => {
      const result = processNode(node, depth + 1, newCounter);
      caseLine += result.code;
      newCounter = result.counter;
      
      // Connect to first child if this is the first child
      if (lastChildId === caseId) {
        const firstChildId = getChildId(node, newCounter);
        if (firstChildId) {
          caseLine += `${indent}${caseId} --> ${firstChildId}\n`;
        }
      }
    });
  }
  
  return { code: caseLine, counter: newCounter };
}

function getChildId(node, counter) {
  switch (node.type) {
    case 'MethodDeclaration':
      return `F${counter}`;
    case 'ForStatement':
      return `L${counter}`;
    case 'WhileStatement':
      return `L${counter}`;
    case 'DoWhileStatement':
      return `L${counter}`;
    case 'IfStatement':
      return `C${counter}`;
    case 'SwitchStatement':
      return `S${counter}`;
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression' && 
          node.expression.callee && node.expression.callee.object && 
          node.expression.callee.object.name === 'System' &&
          node.expression.callee.property && 
          node.expression.callee.property.name === 'out') {
        return `I${counter}`;
      }
      return null;
    case 'BreakStatement':
      return `B${counter}`;
    case 'SwitchCase':
      return `CASE${counter}`;
    default:
      return null;
  }
}