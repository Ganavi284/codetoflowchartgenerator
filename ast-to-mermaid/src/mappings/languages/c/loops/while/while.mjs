/**
 * While loop mapping for C language
 */

export function mapWhileLoop(node) {
  // Extract components for C while loop
  let testInfo = {};
  
  // Handle test condition
  if (node.test) {
    if (typeof node.test === 'string') {
      testInfo = { text: node.test };
    } else if (node.test.text) {
      testInfo = { text: node.test.text };
    } else {
      testInfo = node.test;
    }
  }
  
  return {
    type: 'while',
    test: testInfo,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    id: `while-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}