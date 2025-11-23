import { extractCpp } from '../extractors/cpp-extractor.mjs';
import { normalizeCpp } from '../normalizer/normalize-cpp.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

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
import { mapNode } from './map-node.js';

/**
 * Map C++ nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized C++ node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNodeCpp(node, ctx) {
  // Use the new mapNode function that handles all node types including switch
  return mapNode(node, ctx);
}

/**
 * Generate VTU-style Mermaid flowchart from C++ source code
 * @param {string} sourceCode - C++ source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractCpp(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeCpp(ast);
  
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
            mapNodeCpp(node, context);
          }
        },
        enterBranch: (type) => {
          if (typeof context.enterBranch === 'function') {
            context.enterBranch(type);
          }
        },
        exitBranch: (type) => {
          if (typeof context.exitBranch === 'function') {
            context.exitBranch(type);
          }
        },
        completeIf: () => {
          if (typeof context.completeIf === 'function') {
            context.completeIf();
          }
        },
        completeSwitch: () => {
          if (typeof context.completeSwitch === 'function') {
            context.completeSwitch();
          }
        }
      };
      
      // Walk each node in the main program's body
      mainProgramBody.forEach(node => {
        // Special handling for Function nodes to walk into their Block.body
        if (node.type === 'Function' && node.body) {
          // Walk the function's direct children first (Type, FunctionDecl)
          node.body.forEach(child => {
            if (child.type !== 'Block') {
              walk(child, walkerContext);
            }
          });
          
          // Then walk the statements in the Block body
          const blockNode = node.body.find(child => child.type === 'Block');
          if (blockNode && blockNode.body) {
            blockNode.body.forEach(statement => {
              walk(statement, walkerContext);
            });
          }
        } else {
          // Walk the node normally
          walk(node, walkerContext);
        }
      });
    } else {
      // If no main program found, walk the entire normalized AST
      const walkerContext = {
        handle: (node) => {
          if (node && node.type) {
            // Use the mapping function to add nodes to the context
            mapNodeCpp(node, context);
          }
        },
        enterBranch: (type) => {
          if (typeof context.enterBranch === 'function') {
            context.enterBranch(type);
          }
        },
        exitBranch: (type) => {
          if (typeof context.exitBranch === 'function') {
            context.exitBranch(type);
          }
        },
        completeIf: () => {
          if (typeof context.completeIf === 'function') {
            context.completeIf();
          }
        },
        completeSwitch: () => {
          if (typeof context.completeSwitch === 'function') {
            context.completeSwitch();
          }
        }
      };
      
      walk(normalized, walkerContext);
    }
  }
  
  // Finalize the context using the shared C finalize function
  finalizeFlowContext(context);
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}