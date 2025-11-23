/**
 * Shared helper functions for TypeScript language mapping
 */

export function generateId(prefix = 'typescript') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}