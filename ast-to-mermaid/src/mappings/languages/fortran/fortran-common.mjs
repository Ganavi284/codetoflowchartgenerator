/**
 * Common Fortran language mapping utilities
 */

// Import specific mapping functions
import { mapFunctionDeclaration } from './functions/function.mjs';
import { mapIfStatement } from './conditional/if.mjs';
import { mapForStatement } from './loops/for.mjs';
import { mapWhileStatement } from './loops/while/while.mjs';
import { mapDoWhileStatement } from './loops/do-while/do-while.mjs';
import { mapSwitchStatement } from './conditional/switch/switch.mjs';
import { mapPrintCall } from './io/printf.mjs';
import { mapBreakStatement } from './other-statements/break.mjs';

export function mapFortranNode(node) {
  // Map Fortran node based on its type
  switch (node.type) {
    case 'Program':
      return mapProgram(node);
    case 'IfStatement':
      return mapIfStatement(node);
    case 'DoLoop':
      return mapForStatement(node);
    case 'DoWhileLoop':
      return mapWhileStatement(node);
    case 'SelectCase':
      return mapSwitchStatement(node);
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression' && 
          node.expression.callee && node.expression.callee.name === 'print') {
        return mapPrintCall(node.expression);
      }
      return {
        id: node.id || 'fortran-node',
        type: node.type || 'unknown'
      };
    case 'ExitStatement':
      return mapBreakStatement(node);
    case 'StopStatement':
      return {
        type: 'stop',
        id: `stop-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
    default:
      return {
        id: node.id || 'fortran-node',
        type: node.type || 'unknown'
      };
  }
}

function mapProgram(node) {
  // Map program with body support
  return {
    type: 'program',
    name: node.name,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    mermaidId: `program-${node.name || 'main'}`
  };
}