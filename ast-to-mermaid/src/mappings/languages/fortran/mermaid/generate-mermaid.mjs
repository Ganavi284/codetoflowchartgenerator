/**
 * Mermaid code generator for Fortran language
 */

export function generateMermaidFromAST(ast) {
  let mermaidCode = 'graph TD\n';
  let nodeIdCounter = 0;
  
  // Process the AST nodes and generate Mermaid code
  let bodyNodes = [];
  if (Array.isArray(ast.body)) {
    bodyNodes = ast.body;
  } else if (ast.body && Array.isArray(ast.body.body)) {
    bodyNodes = ast.body.body;
  }
  
  bodyNodes.forEach(node => {
    const result = processNode(node, 1, nodeIdCounter);
    mermaidCode += result.code;
    nodeIdCounter = result.counter;
  });
  
  return mermaidCode;
}

function processNode(node, depth, counter) {
  const indent = '    '.repeat(depth);
  let mermaidLine = '';
  let newCounter = counter;
  
  switch (node.type) {
    case 'Program':
      const progId = `F${++newCounter}`;
      mermaidLine += `${indent}${progId}[Program: ${node.name}]\n`;
      let programBodyNodes = [];
      if (Array.isArray(node.body)) {
        programBodyNodes = node.body;
      } else if (node.body && Array.isArray(node.body.body)) {
        programBodyNodes = node.body.body;
      }
      
      if (programBodyNodes.length > 0) {
        let lastChildId = progId;
        programBodyNodes.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === progId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${progId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
      
    case 'DoLoop':
      const doId = `L${++newCounter}`;
      mermaidLine += `${indent}${doId}[Do Loop]\n`;
      let doBodyNodes = [];
      if (Array.isArray(node.body)) {
        doBodyNodes = node.body;
      } else if (node.body && Array.isArray(node.body.body)) {
        doBodyNodes = node.body.body;
      }
      
      if (doBodyNodes.length > 0) {
        let lastChildId = doId;
        doBodyNodes.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === doId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${doId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
      
    case 'DoWhileLoop':
      const doWhileId = `L${++newCounter}`;
      mermaidLine += `${indent}${doWhileId}[Do While Loop]\n`;
      let doWhileBodyNodes = [];
      if (Array.isArray(node.body)) {
        doWhileBodyNodes = node.body;
      } else if (node.body && Array.isArray(node.body.body)) {
        doWhileBodyNodes = node.body.body;
      }
      
      if (doWhileBodyNodes.length > 0) {
        let lastChildId = doWhileId;
        doWhileBodyNodes.forEach(childNode => {
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
      let ifBodyNodes = [];
      if (Array.isArray(node.consequent)) {
        ifBodyNodes = node.consequent;
      } else if (node.consequent && Array.isArray(node.consequent.body)) {
        ifBodyNodes = node.consequent.body;
      }
      
      if (ifBodyNodes.length > 0) {
        let lastChildId = ifId;
        ifBodyNodes.forEach(childNode => {
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
      
      if (node.alternate) {
        const elseId = `E${++newCounter}`;
        mermaidLine += `${indent}${elseId}[Else]\n`;
        mermaidLine += `${indent}${ifId} --> ${elseId}\n`;
        
        let elseBodyNodes = [];
        if (Array.isArray(node.alternate)) {
          elseBodyNodes = node.alternate;
        } else if (node.alternate && Array.isArray(node.alternate.body)) {
          elseBodyNodes = node.alternate.body;
        }
        
        if (elseBodyNodes.length > 0) {
          let lastChildId = elseId;
          elseBodyNodes.forEach(childNode => {
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
      }
      break;
      
    case 'SelectCase':
      const selectId = `S${++newCounter}`;
      mermaidLine += `${indent}${selectId}[Select Case]\n`;
      if (node.cases) {
        node.cases.forEach(caseNode => {
          const result = processSelectCase(caseNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect select to first case
          const firstCaseId = getChildId(caseNode, newCounter);
          if (firstCaseId) {
            mermaidLine += `${indent}${selectId} --> ${firstCaseId}\n`;
          }
        });
      }
      break;
      
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression') {
        if (node.expression.callee && node.expression.callee.name === 'print') {
          const ioId = `I${++newCounter}`;
          mermaidLine += `${indent}${ioId}[Print Statement]\n`;
        }
      }
      break;
      
    case 'StopStatement':
      const stopId = `R${++newCounter}`;
      mermaidLine += `${indent}${stopId}[Stop Statement]\n`;
      break;
      
    case 'ExitStatement':
      const exitId = `B${++newCounter}`;
      mermaidLine += `${indent}${exitId}[Exit Statement]\n`;
      break;
  }
  
  return { code: mermaidLine, counter: newCounter };
}

function processSelectCase(caseNode, depth, counter) {
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
  
  let caseBodyNodes = [];
  if (Array.isArray(caseNode.consequent)) {
    caseBodyNodes = caseNode.consequent;
  } else if (caseNode.consequent && Array.isArray(caseNode.consequent.body)) {
    caseBodyNodes = caseNode.consequent.body;
  }
  
  if (caseBodyNodes.length > 0) {
    let lastChildId = caseId;
    caseBodyNodes.forEach(node => {
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
    case 'Program':
      return `F${counter}`;
    case 'DoLoop':
      return `L${counter}`;
    case 'DoWhileLoop':
      return `L${counter}`;
    case 'IfStatement':
      return `C${counter}`;
    case 'SelectCase':
      return `S${counter}`;
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression' && 
          node.expression.callee && node.expression.callee.name === 'print') {
        return `I${counter}`;
      }
      return null;
    case 'StopStatement':
      return `R${counter}`;
    case 'ExitStatement':
      return `B${counter}`;
    default:
      return null;
  }
}