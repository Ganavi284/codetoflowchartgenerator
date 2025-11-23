/**
 * ID generation for Mermaid nodes
 */

// Global counters for ID generation
let nodeCounter = 1;
let subgraphCounter = 1;
let subgraphNodeCounter = 1;

/**
 * Generate Mermaid node IDs according to the specified convention:
 * - Regular nodes: N1, N2, N3, etc.
 * - Subgraphs: SG1, SG2, SG3, etc.
 * - Subgraph nodes: SGN1, SGN2, SGN3, etc.
 * @param {Object} node - The node for which to generate an ID
 * @param {string} type - The type of ID to generate ('node', 'subgraph', or 'subgraphNode')
 * @returns {string} The generated ID
 */
export function generateMermaidId(node, type = 'node') {
  switch (type) {
    case 'subgraph':
      return `SG${subgraphCounter++}`;
    case 'subgraphNode':
      return `SGN${subgraphNodeCounter++}`;
    case 'node':
    default:
      return `N${nodeCounter++}`;
  }
}

/**
 * Reset all counters to their initial values
 */
export function resetCounters() {
  nodeCounter = 1;
  subgraphCounter = 1;
  subgraphNodeCounter = 1;
}