/**
 * Emit Mermaid nodes dynamically
 * Generates Mermaid syntax for flowchart nodes
 */

/**
 * Emit a single node in Mermaid format
 * @param {string} id - Node ID
 * @param {string} shape - Node shape definition
 * @returns {string} - Mermaid node syntax
 */
export function emitNode(id, shape) {
  if (!id || !shape) return "";
  return `${id}${shape}`;
}

/**
 * Emit an edge in Mermaid format
 * @param {string} fromId - Source node ID
 * @param {string} toId - Target node ID
 * @param {string|null} label - Edge label (optional)
 * @returns {string} - Mermaid edge syntax
 */
export function emitEdge(fromId, toId, label = null) {
  if (!fromId || !toId) return "";
  
  if (label) {
    return `${fromId} -->|${label}| ${toId}`;
  } else {
    return `${fromId} --> ${toId}`;
  }
}