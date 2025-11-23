/**
 * Common mapping utilities
 */

import { mapCNode } from '../mappings/languages/c/c-common.mjs';

export function mapCommonNode(node) {
  // Placeholder for common node mapping logic
  return {
    id: node.id || 'unknown',
    type: node.type || 'unknown'
  };
}

// Export C mapping function for chaining
export { mapCNode };