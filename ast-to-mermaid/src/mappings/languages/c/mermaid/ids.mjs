/**
 * ID generation for VTU-style Mermaid flowcharts
 */

// Global counter for node generation
export let nodeCounter = 2; // Start from 2 since N1 is reserved for start node

/**
 * Generate sequential node IDs: N2, N3, N4, etc.
 * @param {Object} node - The node for which to generate an ID
 * @param {string} type - The type of node (used for special handling)
 * @returns {string} The generated ID
 */
export function generateMermaidId(node, type = 'node') {
  // For all nodes (N1 is reserved for start node, end node will be handled separately)
  return `N${nodeCounter++}`;
}

/**
 * Reset counter to initial value
 */
export function resetCounters() {
  nodeCounter = 2; // Start from 2 since N1 is reserved for start node
}