/**
 * Connector definitions for Mermaid diagrams
 */

export const connectors = {
  // Basic connectors
  arrow: '-->',
  dotted: '-.->',
  thick: '==>',
  
  // Additional connectors
  noArrow: '---',
  bidirectional: '<-->',
  
  // Labeled connectors (functions to generate labeled connectors)
  labeledArrow: (label) => `--${label}-->`,
  labeledDotted: (label) => `-.${label}.->`,
  labeledThick: (label) => `==${label}==>`,
  labeledNoArrow: (label) => `--${label}---`
};