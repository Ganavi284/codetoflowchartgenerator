/**
 * Normalize C language AST to unified AST
 * Handles dynamic conversion of Tree-sitter nodes to unified representation
 * @param {Object} node - Tree-sitter AST node
 * @returns {Object|null} - Normalized node or null
 */
export function normalizeC(node) {
  if (!node) return null;

  switch (node.type) {
    case "translation_unit":
    case "source_file":
      return {
        type: "Block",
        body: node.children
          .map(normalizeC)
          .filter(Boolean)
      };

    // -------------------------
    // CONDITIONALS
    // -------------------------
    case "if_statement": {
      const elseClause = node.child(3); // else_clause node or null
      let elseBody = null;
      
      if (elseClause && elseClause.type === "else_clause") {
        // else_clause has: child(0) = "else" keyword, child(1) = actual else body
        elseBody = normalizeC(elseClause.child(1));
      }
      
      return {
        type: "If",
        cond: normalizeC(node.child(1)),
        then: normalizeC(node.child(2)),
        else: elseBody
      };
    }

    // -------------------------
    // LOOPS
    // -------------------------
    case "for_statement":
      return {
        type: "For",
        init: normalizeC(node.child(1)),
        cond: normalizeC(node.child(2)),
        update: normalizeC(node.child(3)),
        body: normalizeC(node.child(4))
      };

    case "while_statement":
      return {
        type: "While",
        cond: normalizeC(node.child(1)),
        body: normalizeC(node.child(2))
      };

    case "do_statement":
      return {
        type: "DoWhile",
        body: normalizeC(node.child(0)),
        cond: normalizeC(node.child(2))
      };

    // -------------------------
    // SWITCH
    // -------------------------
    case "switch_statement":
      return {
        type: "Switch",
        cond: normalizeC(node.child(1)),
        body: normalizeC(node.child(2))
      };

    case "case_statement": {
      // Check if this is a default case
      const label = node.child(0);
      if (label && label.type === "default") {
        return {
          type: "Default",
          body: node.children.slice(2)
            .map(normalizeC)
            .filter(Boolean)
        };
      }
      // Regular case
      return {
        type: "Case",
        value: node.child(1)?.text || "",
        body: node.children.slice(3)
          .map(normalizeC)
          .filter(Boolean)
      };
    }

    case "labeled_statement": {
      // This handles labels in code
      return normalizeC(node.child(2));
    }

    case "break_statement":
      return {
        type: "Break"
      };

    // -------------------------
    // FUNCTIONS
    // -------------------------
    case "function_definition": {
      const nameNode = node.child(1);
      const paramsNode = node.child(2);
      const bodyNode = node.child(node.children.length - 1);
      const normalizedBody = normalizeC(bodyNode);

      const functionName = nameNode?.text || "";
      if (functionName === "main" || functionName === "main()") {
        return normalizedBody;
      }

      return {
        type: "Function",
        name: functionName,
        parameters: paramsNode?.text || "",
        body: normalizedBody
      };
    }

    // -------------------------
    // BASIC STATEMENTS
    // -------------------------
    case "return_statement":
      return {
        type: "Return",
        value: node.child(1)?.text || null
      };

    case "declaration":
      return {
        type: "Decl",
        text: node.text
      };

    case "assignment_expression":
      return {
        type: "Assign",
        text: node.text
      };

    case "call_expression":
      // Check if this is an IO call (printf, scanf, etc.)
      if (node.text && (node.text.includes("printf") || node.text.includes("scanf"))) {
        return {
          type: "IO",
          text: node.text
        };
      }
      return {
        type: "Call",
        text: node.text
      };

    case "binary_expression":
    case "unary_expression":
    case "identifier":
    case "number_literal":
    case "string_literal":
    case "parenthesized_expression":
      return {
        type: "Expr",
        text: node.text
      };

    // -------------------------
    // IO OPERATIONS
    // -------------------------
    case "expression_statement":
      // Check for IO operations like printf, scanf  
      const text = node.text || "";
      if (text.includes("printf") || text.includes("scanf") || text.includes("gets") || text.includes("puts")) {
        return {
          type: "IO",
          text: node.text
        };
      }
      return {
        type: "Expr",
        text: node.text
      };

    // -------------------------
    // BLOCKS
    // -------------------------
    case "compound_statement":
      return {
        type: "Block",
        body: node.children
          .map(normalizeC)
          .filter(Boolean)
      };

    default:
      return null;
  }
}