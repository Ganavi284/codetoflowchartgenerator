/**
 * Sanitize node labels according to VTU-style rules
 * 1. Remove ALL internal double quotes
 * 2. Trim whitespace
 * 3. Wrap the text in double quotes
 * @param {string} text - Raw text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeLabel(text) {
  if (!text) return '""';
  
  // Remove all internal double quotes
  let sanitized = text.replace(/"/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Wrap in double quotes
  return `"${sanitized}"`;
}