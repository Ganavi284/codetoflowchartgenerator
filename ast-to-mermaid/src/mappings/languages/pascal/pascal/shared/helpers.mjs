/**
 * Shared helper functions for Pascal language mapping
 */

export function generateId(prefix = 'pascal') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}