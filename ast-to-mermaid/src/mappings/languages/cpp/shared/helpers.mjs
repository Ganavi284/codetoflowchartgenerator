/**
 * Shared helper functions for C++ language mapping
 */

export function generateId(prefix = 'cpp') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}