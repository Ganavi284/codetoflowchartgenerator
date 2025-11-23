/**
 * Example utility functions
 */

export function deepClone(obj) {
  // Placeholder for deep clone implementation
  return JSON.parse(JSON.stringify(obj));
}

export function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}