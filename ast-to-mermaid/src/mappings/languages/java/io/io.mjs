import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

// Helper function to generate text representation of a node
function generateNodeText(node) {
  if (!node) return "IO operation";
  
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'Identifier':
      return node.name;
    case 'BinaryExpression':
      const leftText = generateNodeText(node.left);
      const rightText = generateNodeText(node.right);
      // For string concatenation
      if (node.operator === '+') {
        return `${leftText}${rightText}`;
      }
      return `${leftText} ${node.operator} ${rightText}`;
    default:
      return node.text || "IO operation";
  }
}

/**
 * Map System.out.print/println statement to Mermaid flowchart nodes
 * Creates IO node for print statements
 * @param {Object} node - Normalized print statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIoStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create IO node for print statement
  const ioId = ctx.next();
  
  // Generate appropriate text for the IO operation
  let ioText = "IO operation";
  if (node.text) {
    ioText = node.text;
  } else if (node.arguments && node.arguments.length > 0) {
    // Handle print/println with arguments
    const argTexts = node.arguments.map(arg => generateNodeText(arg));
    const prefix = node.callee && node.callee.property ? 
                   node.callee.property.name : "print";
    ioText = `${prefix} ${argTexts.join(", ")}`;
  } else if (node.callee && node.callee.property) {
    if (node.callee.property.name === 'out') {
      ioText = "print output";
    } else if (node.callee.property.name.startsWith('next')) {
      ioText = `read ${node.callee.property.name.substring(4).toLowerCase()}`;
    }
  }
  
  ctx.add(ioId, ioShape(ioText));
  
  // Use branch handling if we're in an active branch, otherwise use sequential linking
  const handled = ctx.handleBranchConnection && ctx.handleBranchConnection(ioId);
  if (!handled) {
    linkNext(ctx, ioId);
  }
}