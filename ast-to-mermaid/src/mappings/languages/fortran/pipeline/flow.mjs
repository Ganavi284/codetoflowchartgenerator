import { extractFortran } from '../extractors/fortran-extractor.mjs';
import { normalizeFortran } from '../normalizer/normalize-fortran.mjs';
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
 * Map Fortran nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized Fortran node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNodeFortran(node, ctx) {
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
  }
}

/**
 * Generate VTU-style Mermaid flowchart from Fortran source code
 * @param {string} sourceCode - Fortran source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  let ast;
  try {
    const tree = extractFortran(sourceCode);
    
    // Handle both tree objects and simplified AST representations
    if (tree && tree.type === 'translation_unit') {
      // This is a simplified AST from CLI fallback
      ast = tree;
    } else {
      // This is a tree-sitter tree object
      ast = tree.rootNode || tree;
    }
  } catch (error) {
    console.error('Error extracting AST:', error);
    // Return a simple flowchart on error
    return `flowchart TD
    N1(["start"])
    N2(["end"])
    N1 --> N2`;
  }
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeFortran(ast, sourceCode);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Walk and generate nodes using mapping functions
  if (normalized) {
    // Find the main program and process its body directly
    let mainProgramBody = null;
    
    // Check if normalized is the main program itself
    if (normalized.type === 'Program') {
      mainProgramBody = normalized.body;
    }
    
    // If we found the main program, process its body directly
    if (mainProgramBody) {
      // Create a walker context that uses the mapping functions
      const walkerContext = {
        handle: (node) => {
          if (node && node.type) {
            // Use the mapping function to add nodes to the context
            mapNodeFortran(node, context);
          }
        }
      };
      
      // Walk each node in the main program's body
      mainProgramBody.forEach(node => {
        walk(node, walkerContext);
      });
    } else {
      // If no main program found, walk the entire normalized AST
      const walkerContext = {
        handle: (node) => {
          if (node && node.type) {
            // Use the mapping function to add nodes to the context
            mapNodeFortran(node, context);
          }
        }
      };
      
      walk(normalized, walkerContext);
    }
  }
  
  // Complete any pending branches
  if (context.completeBranches) {
    context.completeBranches();
  }
  
  // Handle completed if statements with branch convergence
  if (context.completedIfStatements && context.completedIfStatements.length > 0) {
    context.completedIfStatements.forEach(ifStmt => {
      // Only handle if statements that have both branches completed
      if (ifStmt.thenBranchLast && ifStmt.elseBranchLast) {
        // Create a merge point for the if statement branches
        let mergeId = context.next();
        context.add(mergeId, '["assignment statement"]');  // Generic placeholder
        
        // Connect both branches to the merge point
        context.addEdge(ifStmt.thenBranchLast, mergeId);
        context.addEdge(ifStmt.elseBranchLast, mergeId);
        
        // Process any deferred statements at the merge point
        let lastNodeId = mergeId;
        if (context.deferredStatements && context.deferredStatements.length > 0) {
          context.deferredStatements.forEach(deferred => {
            if (deferred.type === 'assign') {
              const deferredId = context.next();
              context.add(deferredId, `[${deferred.text}]`);
              context.addEdge(lastNodeId, deferredId);
              lastNodeId = deferredId;
            }
          });
          // Clear deferred statements
          context.deferredStatements = [];
        }
        
        // If we're in a loop, connect the merge point back to the loop condition
        if (context.inLoop && context.loopContinueNode) {
          context.addEdge(lastNodeId, context.loopContinueNode);
        }
        
        // Set the merge point as the last node so subsequent nodes connect to it
        context.last = lastNodeId;
      }
    });
    
    // Clear the completed if statements
    context.completedIfStatements = [];
  }
  
  // Handle if statement branches
  // This is a simplified approach - in a full implementation, we would need
  // a more sophisticated control flow analysis
  
  // Create a merge point for if statement branches if needed
  if (context.ifConditionId) {
    // In a full implementation, we would create proper branch convergence
    // For now, we'll just complete any pending branches
    // If we have candidates for merge points, connect them
    if (context.ifMergeCandidate && context.last && context.ifMergeCandidate !== context.last) {
      // Connect the last branch node to the current last node
      // This is a simplified approach to branch convergence
    }
  }
  
  // Add end node
  const endId = context.next();
  context.add(endId, '(["end"])');
  
  // Store the end node ID for switch statements
  if (context.switchEndNodes && context.switchEndNodes.length > 0) {
    // Update the last switch end node reference
    context.switchEndNodes[context.switchEndNodes.length - 1] = endId;
  }
  
  // Connect any pending break statements to the end node
  if (context.pendingBreaks && context.pendingBreaks.length > 0) {
    context.pendingBreaks.forEach(breakInfo => {
      const endNodeId = context.switchEndNodes[breakInfo.switchLevel];
      if (endNodeId) {
        context.addEdge(breakInfo.breakId, endNodeId);
      }
    });
    // Clear pending breaks
    context.pendingBreaks = [];
  }
  
  // Connect last node to end node (only if there's a last node and it's not null)
  if (context.last) {
    context.addEdge(context.last, endId);
  }
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}