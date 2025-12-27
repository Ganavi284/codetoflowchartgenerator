import { mapIf } from "./conditional/if.mjs";
import { mapIfElse } from "./conditional/if-else/if-else.mjs";
import { mapIfElseIf } from "./conditional/if-elseif/if-elseif.mjs";
import { mapFor } from "./loops/for.mjs";
import { mapWhile } from "./loops/while.mjs";
import { mapDoWhile } from "./loops/do-while.mjs";
import { mapSwitch, mapCase, mapDefault } from "./conditional/switch/switch.mjs";
import { mapIO } from "./io/io.mjs";
import { mapAssign } from "./other-statements/assignment.mjs";
import { mapDecl } from "./other-statements/declaration.mjs";
import { mapExpr } from "./other-statements/expression.mjs";
import { mapReturn } from "./other-statements/return.mjs";
import { mapFunction } from "./functions/function-definition.mjs";
import { mapFunctionCall } from "./functions/function-call.mjs";
import { mapBreakStatement } from "./other-statements/break.mjs";

/**
 * Central dispatcher for Fortran language constructs
 * Routes normalized AST nodes to appropriate mapping functions
 * @param {Object} node - Normalized AST node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Recursive mapper function
 */
export function mapNodeFortran(node, ctx, mapper) {
  if (!node || !ctx) return;
  
  switch (node.type) {
    case "If": 
      // Check if this is a simple if, if-else, or if-elseif by examining the structure
      if (node.else && Array.isArray(node.else) && node.else.length > 0) {
        // Check if the else branch contains another If node (elseif case)
        if (node.else.length === 1 && node.else[0].type === 'If') {
          return mapIfElseIf(node, ctx, mapper);
        } else {
          // This is a regular if-else
          return mapIfElse(node, ctx, mapper);
        }
      } else {
        // This is a simple if statement
        return mapIf(node, ctx, mapper);
      }
      
    case "For": 
      return mapFor(node, ctx, mapper);
      
    case "While": 
      return mapWhile(node, ctx, mapper);
      
    case "DoWhile": 
      return mapDoWhile(node, ctx, mapper);
      
    case "SelectCase": 
      return mapSwitch(node, ctx, mapper);
      
    case "Case": 
      return mapCase(node, ctx, mapper);
      
    case "Default": 
      return mapDefault(node, ctx, mapper);
      
    case "Break": 
      return mapBreakStatement(node, ctx, mapper);
      
    case "IO": 
      return mapIO(node, ctx, mapper);
      
    case "Assign": 
      return mapAssign(node, ctx, mapper);
      
    case "Decl": 
      return mapDecl(node, ctx, mapper);
      
    case "Expr": 
      return mapExpr(node, ctx, mapper);
      
    case "Return": 
      return mapReturn(node, ctx, mapper);
      
    case "Function": 
      return mapFunction(node, ctx, mapper);
      
    case "FunctionCall": 
      return mapFunctionCall(node, ctx, mapper);
      
    case "Block":
      // Handle block statements by mapping each child
      if (node.body && Array.isArray(node.body)) {
        node.body.forEach(child => mapNodeFortran(child, ctx, mapper));
      }
      break;
      
    default:
      // Skip unhandled node types
      return;
  }
}

/**
 * Map Fortran program to Mermaid flowchart
 * @param {Object} ast - Normalized AST
 * @returns {Object} - Mapped program
 */
export function mapFortranProgram(ast) {
  // This would be the main entry point for mapping a Fortran program
  // Implementation would depend on the specific requirements
  return {
    type: 'FortranProgram',
    ast: ast
  };
}