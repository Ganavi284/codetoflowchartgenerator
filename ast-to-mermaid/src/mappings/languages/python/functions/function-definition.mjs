import { shapes } from '../mermaid/shapes.mjs';
import { linkNext } from '../mappings/common/common.mjs';

// Helper function to create function shape with text
const functionShape = (text) => shapes.function.replace('{}', text);

/**
 * Map function definition to Mermaid flowchart nodes
 * Creates rectangle node for function definition
 * @param {Object} node - Normalized function definition node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunction(node, ctx) {
  if (!node || !ctx) return;
  
  // Skip creating a node for the main function
  if (node.name === 'main' || node.name === 'main()') return;
  
  // Store function definition in context for later use
  if (!ctx.functionDefinitions) {
    ctx.functionDefinitions = new Map();
  }
  
  // Register the function definition
  ctx.functionDefinitions.set(node.name, {
    name: node.name,
    body: node.body || []
  });
  
  // Note: We don't create a node for the function definition in the main flow
  // Function definitions are registered separately and only executed when called
  // The function body will be processed when the function is called
}