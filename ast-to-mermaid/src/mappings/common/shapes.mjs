import { sanitizeLabel } from './sanitize.mjs';

/**
 * VTU-style Mermaid node shapes
 * Provides dynamic shape generation for flowchart nodes
 */

// Start node shape (Rounded)
export const startShape = () => '(["start"])';

// End node shape (Rounded)
export const endShape = () => '(["end"])';

// Process node shape (Rectangle)
export const processShape = (text) => `[${sanitizeLabel(text)}]`;

// Decision node shape (Diamond)
export const decisionShape = (text) => `{${sanitizeLabel(text)}}`;

// IO node shape (Parallelogram)
export const ioShape = (text) => `[/${sanitizeLabel(text)}/]`;

// Function node shape (Double rectangle)
export const functionShape = (text) => `[[${sanitizeLabel(text)}]]`;

// Return node shape (Process)
export const returnShape = (text) => `[${sanitizeLabel(text)}]`;