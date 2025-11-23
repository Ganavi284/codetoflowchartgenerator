/**
 * Node emission for VTU-style Mermaid flowcharts
 */

import { generateMermaidId } from './ids.mjs';
import { shapes } from './shapes.mjs';
import { sanitizeNodeText } from '../shared/helpers.mjs';

/**
 * Emit a node with VTU-style formatting
 * @param {Object} node - Unified AST node
 * @param {string} nodeType - Type of node (determines shape)
 * @param {string} nodeText - Text content for node
 * @returns {string} - Formatted Mermaid node
 */
export function emitNode(node, nodeType, nodeText) {
  const id = generateMermaidId(node, nodeType);
  
  // Sanitize the node text
  const sanitizedText = sanitizeNodeText(nodeText || node?.text || node?.type || "");
  
  // Select appropriate shape based on node type
  let shape;
  switch (nodeType) {
    case "start":
      shape = shapes.start;
      break;
    case "end":
      shape = shapes.end;
      break;
    case "If":
    case "Switch":
    case "While":
    case "DoWhile":
    case "For":
      shape = shapes.decision;
      break;
    case "IO":
      shape = shapes.io;
      break;
    case "Return":
      shape = shapes.return;
      break;
    case "Function":
      shape = shapes.function;
      break;
    default:
      shape = shapes.process;
  }
  
  // Replace placeholder with sanitized text
  return `${id}${shape.replace('{}', sanitizedText)}`;
}

/**
 * Emit a connection between nodes
 * @param {string} fromId - Source node ID
 * @param {string} toId - Target node ID
 * @param {string} label - Optional label for the connection
 * @returns {string} - Formatted Mermaid connection
 */
export function emitConnection(fromId, toId, label = null) {
  if (label) {
    return `${fromId} -->|${label}| ${toId}`;
  }
  return `${fromId} --> ${toId}`;
}