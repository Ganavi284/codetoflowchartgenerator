import { cConfig } from "./mappings/languages/c/c-config.mjs";
import { createContext } from "./mappings/common/context.mjs";

/**
 * Generate Mermaid flowchart from C source code
 * Main entry point for the dynamic C flowchart engine
 * @param {string} cCode - C source code to convert to flowchart
 * @returns {string} - Mermaid flowchart syntax
 */
export function generateFlowchartFromC(cCode) {
  if (!cCode || typeof cCode !== 'string') {
    throw new Error('Invalid C code provided');
  }
  
  try {
    // Step 1: Extract AST using Tree-sitter
    const ast = cConfig.extractor(cCode);
    
    // Step 2: Normalize AST to unified representation
    const normalizedAst = cConfig.normalizer(ast);
    
    // Step 3: Create context for flowchart generation
    const context = createContext();
    
    // Step 4: Map normalized AST to flowchart nodes
    if (normalizedAst) {
      cConfig.mapper(normalizedAst, context);
    }
    
    // Step 5: Generate Mermaid flowchart
    return context.generateMermaid();
    
  } catch (error) {
    throw new Error(`Failed to generate flowchart: ${error.message}`);
  }
}

/**
 * Example usage:
 * 
 * const cCode = `
 * int main() {
 *   int x = 5;
 *   if (x > 0) {
 *     printf("Positive");
 *   } else {
 *     printf("Non-positive");
 *   }
 *   return 0;
 * }
 * `;
 * 
 * const flowchart = generateFlowchartFromC(cCode);
 * console.log(flowchart);
 */