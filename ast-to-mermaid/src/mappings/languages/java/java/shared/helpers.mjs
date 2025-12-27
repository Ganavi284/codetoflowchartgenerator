/**
 * Shared helper functions for Java language mapping
 */

export function generateId(prefix = 'java') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}