import { extractFortran } from '../extractors/fortran-extractor.mjs';
import { normalizeFortran } from '../normalizer/normalize-fortran.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

// Import mapping functions (reusing C mapping functions since they're similar)
import { mapNode } from './map-node.js';

/**
 * Map Fortran nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized Fortran node
 * @param {Object} ctx - Context for flowchart generation
 */
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
            mapNode(node, context, mapNode);
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
            mapNode(node, context, mapNode);
          }
        }
      };
      
      walk(normalized, walkerContext);
    }
  }
  
  // Finalize the context
  finalizeFlowContext(context);
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}