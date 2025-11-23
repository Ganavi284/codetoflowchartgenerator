import { mapIf } from "./conditional/if.mjs";
import { mapFor } from "./loops/for.mjs";
import { mapWhile } from "./loops/while.mjs";
import { mapDoWhile } from "./loops/do-while.mjs";
import { mapSwitch, mapCase, mapDefault } from "./conditional/switch/switch.mjs";
import { mapFunction } from "./functions/function-definition.mjs";
import { mapReturn } from "./other-statements/return.mjs";
import { mapAssign } from "./other-statements/assign.mjs";
import { mapBreakStatement } from "./other-statements/break.mjs";

// Import new mapping functions
import { mapIO } from "./io/io.mjs";
import { mapDecl } from "./other-statements/declaration.mjs";
import { mapExpr } from "./other-statements/expression.mjs";
import { mapBlockStatement } from "./other-statements/block.mjs";

export function mapNodeC(node, ctx) {
  switch (node.type) {
    case "If": return mapIf(node, ctx);
    case "For": return mapFor(node, ctx);
    case "While": return mapWhile(node, ctx);
    case "DoWhile": return mapDoWhile(node, ctx);
    case "Switch": return mapSwitch(node, ctx);
    case "Case": return mapCase(node, ctx);
    case "Default": return mapDefault(node, ctx);
    case "Break": return mapBreakStatement(node, ctx);
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
  }
}