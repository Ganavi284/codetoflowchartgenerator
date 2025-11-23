import { extractTypeScript } from '../extractors/typescript-extractor.mjs';
import { normalizeTypescriptAst } from '../normalizer/normalize-typescript.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';

// Import mapping functions (reusing C mapping functions since they're similar)
import { mapIf } from '../../c/conditional/if.mjs';
import { mapFor } from '../../c/loops/for.mjs';
import { mapWhile } from '../../c/loops/while.mjs';
import { mapFunction } from '../../c/functions/function-definition.mjs';
import { mapReturn } from '../../c/other-statements/return.mjs';
import { mapAssign } from '../../c/other-statements/assign.mjs';
import { mapIO } from '../../c/io/io.mjs';
import { mapDecl } from '../../c/other-statements/declaration.mjs';
import { mapExpr } from '../../c/other-statements/expression.mjs';

/**
 * Map TypeScript nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized TypeScript node
 * @param {Object} ctx - Context for flowchart generation
 */
function mapNodeTypeScript(node, ctx) {
  switch (node.type) {
    case "If": return mapIf(node, ctx);
    case "For": return mapFor(node, ctx);
    case "While": return mapWhile(node, ctx);
    case "Function": return mapFunction(node, ctx);
    case "Return": return mapReturn(node, ctx);
    case "Assign": return mapAssign(node, ctx);
    case "IO": return mapIO(node, ctx);
    case "Decl": return mapDecl(node, ctx);
    case "Expr": return mapExpr(node, ctx);
    default:
      // For unhandled node types, create a generic process node
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `[\"${node.text}\"]`);
        if (ctx.last) {
          ctx.addEdge(ctx.last, id);
        }
        ctx.setLast(id);
      }
  }
}

/**
 * Generate VTU-style Mermaid flowchart from TypeScript source code
 * @param {string} sourceCode - TypeScript source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractTypeScript(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeTypescriptAst(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Walk and generate nodes using mapping functions
  if (normalized) {
    // Find the main program and process its body
    const program = normalized.type === 'Program' ? normalized : 
                   normalized.body?.find(node => node.type === 'Program');
    
    if (program && program.body) {
      // Create a walker context with our handler
      const walkerContext = {
        handle: (node) => mapNodeTypeScript(node, context)
      };
      
      // Walk through the program body
      program.body.forEach(node => walk(node, walkerContext));
    }
  }
  
  // Complete any pending branches
  context.completeBranches();
  
  // Add the end node
  const endId = context.next();
  context.add(endId, '(["end"])');
  if (context.last) {
    context.addEdge(context.last, endId);
  }
  
  // 5. Generate Mermaid diagram
  let diagram = 'graph TD\n';
  diagram += context.nodes.join('\n') + '\n';
  diagram += context.edges.join('\n') + '\n';
  
  return diagram;
}