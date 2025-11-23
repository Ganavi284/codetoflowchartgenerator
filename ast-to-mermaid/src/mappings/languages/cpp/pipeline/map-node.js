import { mapIf } from "../conditional/if.mjs";
import { mapFor } from "../loops/for.mjs";
import { mapWhile } from "../loops/while/while.mjs";
import { mapDoWhile } from "../loops/do-while/do-while.mjs";
import { mapFunction } from "../../c/functions/function-definition.mjs";
import { mapReturn } from "../../c/other-statements/return.mjs";
import { mapBreakStatement } from "../other-statements/break.mjs";

// Import new mapping functions for if-else and if-elseif
import { mapIfElseStatement } from "../conditional/if-else/if-else.mjs";
import { mapIfElseIfStatement } from "../conditional/if-elseif/if-elseif.mjs";

// Import IO mapping function
import { mapIO } from "../io/io.mjs";

// Import new C++ specific mapping functions
import { mapClass } from "../oop/class.mjs";
import { mapNamespace } from "../namespace/namespace.mjs";
import { mapNew } from "../memory/new.mjs";
import { mapDelete } from "../memory/delete.mjs";
import { mapException } from "../error-handling/exception.mjs";

// Import switch mapping functions
import { mapSwitch, mapCase, mapDefault } from "../conditional/switch/switch.mjs";

// Import new C++ preprocessor and declaration mapping functions
import { mapInclude } from "../preprocessor/include.mjs";
import { mapUsing } from "../namespace/using.mjs";
import { mapType } from "../types/type.mjs";
import { mapFunctionDecl } from "../functions/function-decl.mjs";

// Import C mapping functions for Decl and Expr nodes
import { mapDecl } from "../../c/other-statements/declaration.mjs";
import { mapExpr } from "../../c/other-statements/expression.mjs";

// Import block mapping function
import { mapBlockStatement } from "../../c/other-statements/block.mjs";

export function mapNode(node, ctx) {
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
    // Handle if-else and if-elseif statements
    case "IfElse": return mapIfElseStatement(node, ctx);
    case "IfElseIf": return mapIfElseIfStatement(node, ctx);
    // Handle IO operations (cout, cin, etc.)
    case "IO": return mapIO(node, ctx);
    // Handle C++ specific constructs
    case "Class": return mapClass(node, ctx);
    case "Namespace": return mapNamespace(node, ctx);
    case "New": return mapNew(node, ctx);
    case "Delete": return mapDelete(node, ctx);
    case "Try": 
    case "Catch": 
    case "Throw": return mapException(node, ctx);
    // Handle C++ preprocessor and declaration constructs
    case "Include": return mapInclude(node, ctx);
    case "Using": return mapUsing(node, ctx);
    case "Type": return mapType(node, ctx);
    case "FunctionDecl": return mapFunctionDecl(node, ctx);
    // Handle C declaration and expression statements
    case "Decl": return mapDecl(node, ctx);
    case "Expr": return mapExpr(node, ctx);
    case "Block": 
      // Process the body of the block
      // The body will be processed by the walker, so we don't need to do anything here
      return;
    default:
      // For unhandled node types, create a generic process node
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `[${node.text}]`);
        // Connect to previous node and set as last
        linkNext(ctx, id);
        return id;
      }
      return null;
  }
}
