import { extractPascal } from '../extractors/pascal-extractor.mjs';
import { normalizePascal } from '../normalizer/normalize-pascal.mjs';
import { mapNodePascal } from '../map-node-pascal.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';

/**
 * Generate VTU-style Mermaid flowchart from Pascal source code
 * @param {string} sourceCode - Pascal source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractPascal(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizePascal(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // 4. Walk and generate nodes using mapping functions
  if (normalized) {
    // Find the main program and process its body
    if (normalized.type === 'Program' && normalized.body) {
      // Process each statement in the program body
      normalized.body.forEach(statement => {
        walk(statement, context);
      });
    }
  }
  
  // The END node will be added by the emit function
  // Resolve any pending joins to the END node that will be added by emit
  context.resolvePendingJoins('END');
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}