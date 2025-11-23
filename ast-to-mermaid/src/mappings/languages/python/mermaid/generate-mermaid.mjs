/**
 * Mermaid code generator for Python language
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
    case 'FunctionDef':
      const functionId = `F${++newCounter}`;
      mermaidLine += `${indent}${functionId}[Function: ${node.name}]\n`;
      if (node.body && Array.isArray(node.body)) {
        let lastChildId = functionId;
        node.body.forEach(childNode => {
          const result = processNode(childNode, depth + 1, newCounter);
          mermaidLine += result.code;
          newCounter = result.counter;
          
          // Connect to first child if this is the first child
          if (lastChildId === functionId) {
            const firstChildId = getChildId(childNode, newCounter);
            if (firstChildId) {
              mermaidLine += `${indent}${functionId} --> ${firstChildId}\n`;
            }
          }
        });
      }
      break;
      
    case 'Expr':
      // Handle function call (main())
      if (node.value && node.value.type === 'Call' && 
          node.value.func && node.value.func.id) {
        // We don't need to visualize the function call in the diagram
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
    case 'For':
      const forId = `L${++newCounter}`;
      mermaidLine += `${indent}${forId}[For Loop]\n`;
      if (node.body && Array.isArray(node.body)) {
        let lastChildId = forId;
        node.body.forEach(childNode => {
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
      
    case 'While':
      const whileId = `L${++newCounter}`;
      mermaidLine += `${indent}${whileId}[While Loop]\n`;
      if (node.body && Array.isArray(node.body)) {
        let lastChildId = whileId;
        node.body.forEach(childNode => {
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
      
    case 'If':
      const ifId = `C${++newCounter}`;
      mermaidLine += `${indent}${ifId}[If Statement]\n`;
      if (node.body && Array.isArray(node.body)) {
        let lastChildId = ifId;
        node.body.forEach(childNode => {
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
      if (node.orelse && Array.isArray(node.orelse) && node.orelse.length > 0) {
        const elseId = `E${++newCounter}`;
        mermaidLine += `${indent}${elseId}[Else]\n`;
        mermaidLine += `${indent}${ifId} --> ${elseId}\n`;
        
        let lastChildId = elseId;
        node.orelse.forEach(childNode => {
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
      
    case 'Match':
      const switchId = `S${++newCounter}`;
      mermaidLine += `${indent}${switchId}[Match Statement]\n`;
      if (node.cases && Array.isArray(node.cases)) {
        node.cases.forEach(caseNode => {
          const result = processMatchCase(caseNode, depth + 1, newCounter);
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
      
    case 'Expr':
      if (node.value && node.value.type === 'Call') {
        if (node.value.func && node.value.func.attr === 'print') {
          const ioId = `I${++newCounter}`;
          mermaidLine += `${indent}${ioId}[Print Statement]\n`;
        }
      }
      break;
      
    case 'Break':
      const breakId = `B${++newCounter}`;
      mermaidLine += `${indent}${breakId}[Break Statement]\n`;
      break;
  }
  
  return { code: mermaidLine, counter: newCounter };
}

function processMatchCase(caseNode, depth, counter) {
  const indent = '    '.repeat(depth);
  let caseLine = '';
  let newCounter = counter;
  
  let caseId;
  if (caseNode.pattern && caseNode.pattern.type !== 'MatchAs') {
    caseId = `CASE${++newCounter}`;
    caseLine += `${indent}${caseId}[Case ${caseNode.pattern.type}]\n`;
  } else {
    caseId = `CASE${++newCounter}`;
    caseLine += `${indent}${caseId}[Default Case]\n`;
  }
  
  if (caseNode.body && Array.isArray(caseNode.body)) {
    let lastChildId = caseId;
    caseNode.body.forEach(node => {
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
    case 'FunctionDef':
      return `F${counter}`;
    case 'For':
      return `L${counter}`;
    case 'While':
      return `L${counter}`;
    case 'If':
      return `C${counter}`;
    case 'Match':
      return `S${counter}`;
    case 'Expr':
      if (node.value && node.value.type === 'Call' && 
          node.value.func && node.value.func.attr === 'print') {
        return `I${counter}`;
      }
      return null;
    case 'Break':
      return `B${counter}`;
    case 'match_case':
      return `CASE${counter}`;
    default:
      return null;
  }
}