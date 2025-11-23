/**
 * Common Java language mapping utilities
 */

// Import specific mapping functions
import { mapMethodDeclaration } from './functions/function.mjs';
import { mapIfStatement } from './conditional/if.mjs';
import { mapIfElseStatement } from './conditional/if-else/if-else.mjs';
import { mapIfElseIfStatement } from './conditional/if-elseif/if-elseif.mjs';
import { mapForStatement } from './loops/for.mjs';
import { mapWhileStatement } from './loops/while/while.mjs';
import { mapDoWhileStatement } from './loops/do-while/do-while.mjs';
import { mapSwitchStatement, mapCase, mapDefault } from './conditional/switch/switch.mjs';
import { mapSystemOutPrint } from './io/printf.mjs';
import { mapIoStatement } from './io/io.mjs';
import { mapBreakStatement } from './other-statements/break.mjs';
import { mapAssignment } from './other-statements/assignment.mjs';
import { mapExpr } from './other-statements/expression.mjs';
import { mapIncDecStatement } from './other-statements/inc-dec.mjs';
import { mapReturn } from './other-statements/return.mjs';

export function mapJavaNode(node) {
  // Map Java node based on its type
  switch (node.type) {
    case 'MethodDeclaration':
      return mapMethodDeclaration(node);
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
    case 'SwitchCase':
      // Handle case and default cases
      if (node.test) {
        return { type: 'case', value: node.test.value };
      } else {
        return { type: 'default' };
      }
    case 'ExpressionStatement':
      if (node.expression && node.expression.type === 'CallExpression' && 
          node.expression.callee && node.expression.callee.object && 
          node.expression.callee.object.name === 'System' &&
          node.expression.callee.property && 
          node.expression.callee.property.name === 'out') {
        return mapSystemOutPrint(node.expression);
      }
      return {
        id: node.id || 'java-node',
        type: node.type || 'unknown'
      };
    case 'BreakStatement':
      return mapBreakStatement(node);
    case 'AssignmentExpression':
      return mapAssignment(node);
    case 'UpdateExpression':
      return mapIncDecStatement(node);
    case 'ReturnStatement':
      return mapReturn(node);
    default:
      return {
        id: node.id || 'java-node',
        type: node.type || 'unknown'
      };
  }
}