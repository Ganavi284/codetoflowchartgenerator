import { mapIf } from "./conditional/if.mjs";
import { mapFor } from "./loops/for.mjs";
import { mapWhile } from "./loops/while.mjs";
import { mapDoWhile } from "./loops/do-while.mjs";
import { mapSwitch } from "./switch/switch.mjs";
import { mapIO } from "./io/io.mjs";
import { mapAssign } from "./other-statements/assignment.mjs";
import { mapDecl } from "./other-statements/declaration.mjs";
import { mapExpr } from "./other-statements/expression.mjs";
import { mapReturn } from "./other-statements/return.mjs";
import { mapFunction } from "./functions/function-definition.mjs";

/**
 * Central dispatcher for C language constructs
 * Routes normalized AST nodes to appropriate mapping functions
 * @param {Object} node - Normalized AST node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNodeC(node, ctx) {
  if (!node || !ctx) return;
  
  switch (node.type) {
    case "If": 
      return mapIf(node, ctx);
      
    case "For": 
      return mapFor(node, ctx);
      
    case "While": 
      return mapWhile(node, ctx);
      
    case "DoWhile": 
      return mapDoWhile(node, ctx);
      
    case "Switch": 
      return mapSwitch(node, ctx);
      
    case "IO": 
      return mapIO(node, ctx);
      
    case "Assign": 
      return mapAssign(node, ctx);
      
    case "Decl": 
      return mapDecl(node, ctx);
      
    case "Expr": 
      return mapExpr(node, ctx);
      
    case "Return": 
      return mapReturn(node, ctx);
      
    case "Function": 
      return mapFunction(node, ctx);
      
    case "Block":
      // Handle block statements by mapping each child
      if (node.body && Array.isArray(node.body)) {
        node.body.forEach(child => mapNodeC(child, ctx));
      }
      break;
      
    default:
      // Skip unhandled node types
      return;
  }
}