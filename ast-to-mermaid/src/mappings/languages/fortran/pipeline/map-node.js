import { mapIf } from '../conditional/if.mjs';
import { mapIfElse } from '../conditional/if-else/if-else.mjs';
import { mapIfElseIf } from '../conditional/if-elseif/if-elseif.mjs';
import { mapFor } from '../loops/for.mjs';
import { mapWhile } from '../loops/while/while.mjs';
import { mapDoWhile } from '../loops/do-while/do-while.mjs';
import { mapSelectCase as mapSwitch, mapCase, mapCaseDefault as mapDefault } from '../conditional/switch/switch.mjs';
import { mapIO } from '../io/io.mjs';
import { mapAssign } from '../other-statements/assignment.mjs';
import { mapDecl } from '../other-statements/declaration.mjs';
import { mapExpr } from '../other-statements/expression.mjs';
import { mapReturn } from '../other-statements/return.mjs';
import { mapFunction } from '../functions/function-definition.mjs';
import { mapFunctionCall } from '../functions/function-call.mjs';
import { mapBreakStatement } from '../other-statements/break.mjs';

/**
 * Map AST nodes to Mermaid elements (Fortran)
 */
export function mapNode(node, context, mapper = mapNode) {
  switch (node.type) {
    case 'If': 
      // Check if this is a simple if, if-else, or if-elseif by examining the structure
      if (node.else && Array.isArray(node.else) && node.else.length > 0) {
        // Check if the else branch contains another If node (elseif case)
        if (node.else.length === 1 && node.else[0].type === 'If') {
          return mapIfElseIf(node, context, mapper);
        } else {
          // This is a regular if-else
          return mapIfElse(node, context, mapper);
        }
      } else {
        // This is a simple if statement
        return mapIf(node, context, mapper);
      }
    case 'For': return mapFor(node, context, mapper);
    case 'While': return mapWhile(node, context, mapper);
    case 'DoWhile': return mapDoWhile(node, context, mapper);
    case 'Function': return mapFunction(node, context, mapper);
    case 'Return': return mapReturn(node, context, mapper);
    case 'Assign': return mapAssign(node, context, mapper);
    case 'IO': return mapIO(node, context, mapper);
    case 'Decl': return mapDecl(node, context, mapper);
    case 'Expr': return mapExpr(node, context, mapper);
    case 'SelectCase': return mapSwitch(node, context, mapper);
    case 'Case': return mapCase(node, context, mapper);
    case 'CaseDefault': return mapDefault(node, context, mapper);
    case 'FunctionCall': return mapFunctionCall(node, context, mapper);
    case 'Break': return mapBreakStatement(node, context, mapper);
    default:
      return null;
  }
}