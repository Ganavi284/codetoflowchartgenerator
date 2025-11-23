/**
 * Shared helper functions for Python language mapping
 */

export function generateId(prefix = 'python') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}