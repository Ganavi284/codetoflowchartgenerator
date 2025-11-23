/**
 * Shared helper functions for Fortran language mapping
 */

export function generateId(prefix = 'fortran') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}