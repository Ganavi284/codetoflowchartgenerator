/**
 * Common C++ language mapping utilities
 */

// Import specific mapping functions
import { mapFunctionDeclaration } from './functions/function.mjs';
import { mapIfStatement } from './conditional/if.mjs';
import { mapForStatement } from './loops/for.mjs';
import { mapWhileStatement } from './loops/while/while.mjs';
import { mapDoWhileStatement } from './loops/do-while/do-while.mjs';
// Remove the incorrect switch mapping import
// import { mapSwitchStatement } from './mixed-statements/switch.mjs';
import { mapPrintfCall } from './io/printf.mjs';
import { mapBreakStatement } from './other-statements/break.mjs';

// Import the proper switch mapping functions
import { mapSwitch, mapCase, mapDefault } from './conditional/switch/switch.mjs';

export function mapCppNode(node) {
  // Map C++ node based on its type
  switch (node.type) {
    case 'FunctionDeclaration':
      return mapFunctionDeclaration(node);
    case 'IfStatement':
      return mapIfStatement(node);
    case 'ForStatement':
      return mapForStatement(node);
    case 'WhileStatement':
      return mapWhileStatement(node);
    case 'DoWhileStatement':
      return mapDoWhileStatement(node);
    case 'SwitchStatement':
      // Use the proper switch mapping instead of the placeholder
      return mapSwitch(node);
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression' && 
          node.expression.callee && node.expression.callee.name === 'printf') {
        return mapPrintfCall(node.expression);
      }
      return {
        id: node.id || 'cpp-node',
        type: node.type || 'unknown'
      };
    case 'BreakStatement':
      return mapBreakStatement(node);
    case 'ReturnStatement':
      return {
        type: 'return',
        argument: node.argument,
        id: `return-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
    default:
      return {
        id: node.id || 'cpp-node',
        type: node.type || 'unknown'
      };
  }
}