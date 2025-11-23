/**
 * Break statement mapping for Fortran language
 */

export function mapBreakStatement(node) {
  // Map break statement (Fortran uses EXIT)
  return {
    type: 'break',
    // Add unique ID for Mermaid diagram generation
    id: `break-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}