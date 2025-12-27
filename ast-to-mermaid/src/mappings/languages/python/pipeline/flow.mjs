import { extractPython } from '../extractors/python-extractor.mjs';
import { normalizePython } from '../normalizer/normalize-python.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

// Import mapping functions (reusing C mapping functions since they're similar)
import { mapIf } from '../conditional/if.mjs';

import { mapFor } from '../loops/map-for.mjs';
import { mapWhile } from '../loops/map-while.mjs';
import { mapFunction } from '../functions/function-definition.mjs';
import { mapFunctionCall } from '../functions/function-call.mjs';
import { mapReturn } from '../../c/other-statements/return.mjs';
import { mapAssign } from '../other-statements/assign.mjs';
import { mapIO } from '../io/io.mjs';
import { mapDecl } from '../../c/other-statements/declaration.mjs';
import { mapExpr } from '../../c/other-statements/expression.mjs';
import { mapMatch, mapCase, mapDefault } from '../conditional/switch/switch.mjs';

/**
 * Map Python nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized Python node
 * @param {Object} ctx - Context for flowchart generation
 */
function mapNodePython(node, ctx) {
  // Determine which context to use - main context or subgraph context
  const targetCtx = ctx.subgraphContext || ctx;
  
  switch (node.type) {
    case "If": return mapIf(node, targetCtx);
    case "For": return mapFor(node, targetCtx);
    case "While": return mapWhile(node, targetCtx);
    case "Function": return mapFunction(node, targetCtx);
    case "FunctionCall": return mapFunctionCall(node, targetCtx);
    case "Return": return mapReturn(node, targetCtx);
    case "Assign": return mapAssign(node, targetCtx);
    case "IO": return mapIO(node, targetCtx);
    case "Decl": return mapDecl(node, targetCtx);
    case "Expr": return mapExpr(node, targetCtx);
    case "Match": return mapMatch(node, targetCtx);
    case "Case": 
      // Check if this is a default case (wildcard pattern)
      if (node.pattern && node.pattern.type === "Expr" && node.pattern.text === "_") {
        return mapDefault(node, targetCtx);
      } else {
        return mapCase(node, targetCtx);
      }
    default:
      // For unhandled node types, create a generic process node
      if (node.text) {
        const id = targetCtx.next();
        targetCtx.add(id, `["${node.text}"]`);
        
        // Check if this is a case body being processed and needs to connect to a pending condition
        if (targetCtx.pendingCaseCondition) {
          // Connect this node to the pending case condition with "Yes" label instead of to previous
          targetCtx.addEdge(targetCtx.pendingCaseCondition, id, "Yes");
          // Clear the pending condition as it's now used
          targetCtx.pendingCaseCondition = null;
          // Set this node as the last node
          targetCtx.setLast(id);
        } else {
          // Regular connection to previous node
          if (targetCtx.last) {
            targetCtx.addEdge(targetCtx.last, id);
          }
          targetCtx.setLast(id);
        }
      }
  }
}

/**
 * Generate VTU-style Mermaid flowchart from Python source code
 * @param {string} sourceCode - Python source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractPython(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizePython(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Walk and generate nodes using mapping functions
  if (normalized) {
    // Find the main program and process its body
    let program;
    if (normalized && normalized.type === 'Program') {
      program = normalized;
    } else if (normalized && normalized.body) {
      // If normalized is a module with body, use it directly
      program = normalized;
    } else {
      program = normalized?.body?.find(node => node.type === 'Program');
    }
    
    // If no program was found, try using the normalized object directly if it has a body
    const programToUse = program || (normalized && normalized.body ? normalized : null);
    
    if (programToUse && programToUse.body) {
      // First, collect all function definitions separately
      const functionDefinitions = new Map();
      const mainBody = [];
      
      for (const node of programToUse.body) {
        if (node && node.type === 'Function') {
          // Store function definition by name
          functionDefinitions.set(node.name, node);
        } else {
          // Add non-function nodes to main execution body
          mainBody.push(node);
        }
      }
      
      // Add function definitions to context for later use
      context.functionDefinitions = functionDefinitions;
      
      // Create a walker context with our handler
      const walkerContext = {
        handle: (node) => mapNodePython(node, context),
        enterBranch: (type) => context.enterBranch(type),
        exitBranch: (type) => context.exitBranch(type),
        completeIf: () => context.completeBranches(),
        completeLoop: () => context.completeLoop(),
        // Add direct access to the context for case tracking
        getContext: () => context,
        // Function call handler for executing function bodies
        functionCallHandler: (node, ctx) => mapNodePython(node, ctx)
      };
      
      // Also set the functionCallHandler on the main context so it can be accessed by subgraph operations
      context.functionCallHandler = walkerContext.functionCallHandler;
      
      // Walk through the main execution body (excluding function definitions)
      mainBody.forEach(node => {
        if (node) {
          walk(node, walkerContext);
        }
      });
    }
  }
  
  // 5. Finalize the context to handle proper branch joins and add end node
  finalizeFlowContext(context);
  
  // 6. Generate Mermaid diagram using the context's emit method
  return context.emit();
}