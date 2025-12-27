import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map break statement to Mermaid flowchart nodes
 * @param {Object} node - Normalized break statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapBreakStatement(node, ctx) {
  if (!node || !ctx) return;
  
  const breakId = ctx.next();
  const breakText = "EXIT"; // Fortran uses EXIT for break
  ctx.add(breakId, processShape(breakText));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, breakId);
}
