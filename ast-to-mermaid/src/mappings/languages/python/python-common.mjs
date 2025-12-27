/**
 * Common Python language mapping utilities
 */

// Import specific mapping functions
import { mapFunctionDef } from './functions/function.mjs';
import { mapFunctionCall } from './functions/function.mjs';
import { mapIf } from './conditional/if.mjs';
import { mapForStatement } from './loops/for/for.mjs';
import { mapWhileStatement } from './loops/while/while.mjs';
import { mapDoWhileStatement } from './loops/do-while/do-while.mjs';
import { mapMatch } from './conditional/switch/switch.mjs';
import { mapPrintCall } from './io/printf.mjs';
import { mapBreakStatement } from './other-statements/break.mjs';

export function mapPythonNode(node) {
  // Map Python node based on its type
  switch (node.type) {
    case 'FunctionDef':
      return mapFunctionDef(node);
    case 'If':
      return mapIfStatement(node);
    case 'For':
      return mapForStatement(node);
    case 'While':
      return mapWhileStatement(node);
    case 'Match':
      return mapMatch(node);
    case 'Expr':
      if (node.value && node.value.type === 'Call') {
        // Handle function calls
        if (node.value.func && node.value.func.attr === 'print') {
          return mapPrintCall(node.value);
        } else {
          return mapFunctionCall(node.value);
        }
      }
      return {
        id: node.id || 'python-node',
        type: node.type || 'unknown'
      };
    case 'Call':
      return mapFunctionCall(node);
    case 'Break':
      return mapBreakStatement(node);
    default:
      return {
        id: node.id || 'python-node',
        type: node.type || 'unknown'
      };
  }
}