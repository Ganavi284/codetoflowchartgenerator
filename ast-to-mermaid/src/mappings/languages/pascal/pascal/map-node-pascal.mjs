import { mapIf } from "./conditional/if.mjs";
import { mapFor } from "./loops/for.mjs";
import { mapWhile } from "./loops/while.mjs";
import { mapRepeatUntil } from "./loops/repeat-until.mjs";
import { mapFunction } from "./functions/function-definition.mjs";
import { mapReturn } from "./other-statements/return.mjs";
import { mapAssign } from "./other-statements/assign.mjs";

// Import new mapping functions
import { mapIO } from "./io/io.mjs";
import { mapDecl } from "./other-statements/declaration.mjs";
import { mapExpr } from "./other-statements/expression.mjs";
import { mapBlockStatement } from "./other-statements/block.mjs";
import { mapCase, mapCaseOption, mapElseCase } from "./conditional/switch/switch.mjs";
import { mapIfElseStatement } from "./conditional/if-else.mjs";
import { mapIfElseIfStatement } from "./conditional/if-elseif.mjs";

export function mapNodePascal(node, ctx) {
  switch (node.type) {
    case "If": 
      return mapIf(node, ctx);
    case "IfElse": 
      return mapIfElseStatement(node, ctx);
    case "ifElseIf": 
      return mapIfElseIfStatement(node, ctx);
    case "For": return mapFor(node, ctx);
    case "While": return mapWhile(node, ctx);
    case "RepeatUntil": return mapRepeatUntil(node, ctx);
    case "Case": return mapCase(node, ctx);
    case "CaseOption": return mapCaseOption(node, ctx);
    case "ElseCase": return mapElseCase(node, ctx);
    case "Function": return mapFunction(node, ctx);
    case "Return": return mapReturn(node, ctx);
    case "Assign": return mapAssign(node, ctx);
    case "IO": return mapIO(node, ctx);
    case "Decl": return mapDecl(node, ctx);
    case "Expr": return mapExpr(node, ctx);
    case "Block": 
      // Process the body of the block
      // The body will be processed by the walker, so we don't need to do anything here
      return;
    case "exprCall": 
      // Handle procedure calls like writeln, write, readln
      return mapIO({ type: "IO", text: node.text || "IO operation" }, ctx);
    case "assignment": 
      // Handle assignment statements
      return mapAssign({ type: "Assign", text: node.text || "assignment" }, ctx);
    default:
      // Handle any other node types that might be encountered
      // This ensures we don't miss any statements
      if (node.type) {
        // Try to map unknown node types as expressions
        return mapExpr({ type: "Expr", text: node.type }, ctx);
      }
      return;
  }
}