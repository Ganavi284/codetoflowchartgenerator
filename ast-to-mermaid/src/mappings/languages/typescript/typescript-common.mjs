/**
 * Common TypeScript language mapping utilities
 */

// Import specific mapping functions
import { mapFunctionDeclaration } from './functions/function.mjs';
import { mapIfStatement } from './conditional/if.mjs';
import { mapForStatement } from './loops/for/for.mjs';
import { mapWhileStatement } from './loops/while/while.mjs';
import { mapDoWhileStatement } from './loops/do-while/do-while.mjs';
import { mapSwitchStatement } from './conditional/switch/switch.mjs';
import { mapConsoleLog } from './io/printf.mjs';
import { mapBreakStatement } from './other-statements/break.mjs';

export function mapTypeScriptNode(node) {
  // Map TypeScript node based on its type
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
      return mapSwitchStatement(node);
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression' && 
          node.expression.callee && node.expression.callee.object && 
          node.expression.callee.object.name === 'console' &&
          node.expression.callee.property && 
          node.expression.callee.property.name === 'log') {
        return mapConsoleLog(node.expression);
      }
      return {
        id: node.id || 'typescript-node',
        type: node.type || 'unknown'
      };
    case 'BreakStatement':
      return mapBreakStatement(node);
    default:
      return {
        id: node.id || 'typescript-node',
        type: node.type || 'unknown'
      };
  }
}