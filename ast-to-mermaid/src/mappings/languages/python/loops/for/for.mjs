/**
 * For loop statement mapping for Python language
 * Handles Python-specific syntax: for target in iter:
 */

export function mapForStatement(node) {
  // Extract components for Python for loop
  let targetInfo = {};
  let iterInfo = {};
  
  // Handle target (the variable being iterated over)
  if (node.target) {
    if (node.target.id) {
      targetInfo = { id: node.target.id };
    } else {
      targetInfo = node.target;
    }
  }
  
  // Handle iterator (what we're iterating over)
  if (node.iter) {
    if (node.iter.func && node.iter.func.id === 'range') {
      // Handle range function specifically
      iterInfo = {
        func: 'range',
        args: node.iter.args || []
      };
    } else {
      iterInfo = node.iter;
    }
  }
  
  return {
    type: 'for',
    target: targetInfo,
    iter: iterInfo,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    id: `for-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}