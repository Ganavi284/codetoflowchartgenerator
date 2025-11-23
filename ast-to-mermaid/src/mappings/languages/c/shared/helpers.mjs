/**
 * Shared utilities for C AST manipulation
 * Provides helper functions for dynamic AST processing
 */

/**
 * Sanitize node text according to VTU flowchart rules
 * @param {string} text - Raw node text
 * @returns {string} - Sanitized text
 */
export const sanitizeNodeText = (text, options = {}) => {
  const { wrap = true } = options;
  if (!text) return "";
  
  // Remove inner double quotes
  let sanitized = text.replace(/"/g, "");
  
  // Replace newlines with escaped newlines
  sanitized = sanitized.replace(/\n/g, "\\n");
  
  // Trim spaces
  sanitized = sanitized.trim();
  
  if (wrap) {
    return `"${sanitized}"`;
  }
  
  return sanitized;
};

/**
 * Flatten compound statements recursively
 * @param {Array} nodes - Array of AST nodes
 * @returns {Array} - Flattened array of nodes
 */
export const flattenBlocks = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return [];
  
  return nodes.reduce((acc, node) => {
    if (node && node.type === "Block") {
      acc.push(...flattenBlocks(node.body));
    } else if (node) {
      acc.push(node);
    }
    return acc;
  }, []);
};

/**
 * Resolve left recursion in expressions
 * @param {Object} node - AST node
 * @returns {Object} - Resolved node
 */
export const resolveLeftRecursion = (node) => {
  // For now, return node as-is
  // Can be extended for more complex resolution
  return node;
};

/**
 * Convert Tree-sitter node to string representation
 * @param {Object} node - AST node
 * @returns {string} - Text representation
 */
export const nodeToString = (node) => {
  return node?.text || "";
};

/**
 * Safe child access with bounds checking
 * @param {Object} node - Parent AST node
 * @param {number} index - Child index
 * @returns {Object|null} - Child node or null
 */
export const safeChildAccess = (node, index) => {
  if (node && node.children && index < node.children.length) {
    return node.children[index];
  }
  return null;
};