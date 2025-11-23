/**
 * Node emission for Mermaid diagrams
 */

import { generateMermaidId } from './ids.mjs';
import { shapes } from './shapes.mjs';

export function emitNode(node) {
  const id = generateMermaidId(node);
  const shape = shapes.rectangle;
  
  // Placeholder for node emission logic
  return `${id}${shape.replace('{}', node.label || node.type)}`;
}