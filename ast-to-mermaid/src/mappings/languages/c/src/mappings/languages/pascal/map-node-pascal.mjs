/**
 * Map Pascal AST nodes to Mermaid diagram elements
 */

import { mapIf } from './conditional/if.mjs';
import { mapCase, mapCaseOption, mapElseCase } from './conditional/switch/switch.mjs';
import { mapFor } from './loops/for.mjs';
import { mapWhile } from './loops/while.mjs';
import { mapRepeat } from './loops/repeat.mjs';
import { mapDoWhile } from './loops/do-while.mjs';
import { shapes } from './mermaid/shapes.mjs';

// Import IO handler
import { mapIO } from './io/io.mjs';

// Import new conditional handlers
import { mapIfElseStatement } from './conditional/if-else.mjs';
import { mapIfElseIf } from './conditional/if-elseif/if-elseif.mjs';

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map a Pascal AST node to Mermaid diagram elements
 * @param {Object} node - Pascal AST node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNodePascal(node, ctx) {
  if (!node || !ctx) return;

  // Handle different node types
  switch (node.type) {
    case 'If':
      // This is a normalized If node
      mapIf(node, ctx);
      break;
      
    case 'IfElse':
      // This is a normalized If-Else node
      mapIfElseStatement(node, ctx);
      break;
      
    case 'ifElseIf':
      // This is a normalized If-Else-If node
      mapIfElseIf(node, ctx);
      break;
      
    case 'For':
      // Handle for loop
      mapFor(node, ctx);
      break;
      
    case 'While':
      // Handle while loop
      mapWhile(node, ctx);
      break;
      
    case 'Repeat':
      // Handle repeat-until loop
      mapRepeat(node, ctx);
      break;
      
    case 'DoWhile':
      // Handle do-while loop
      mapDoWhile(node, ctx);
      break;
      
    case 'Case':
      mapCase(node, ctx);
      break;
      
    case 'CaseOption':
      mapCaseOption(node, ctx);
      break;
      
    case 'ElseCase':
      mapElseCase(node, ctx);
      break;
      
    case 'Decl':
      // Handle variable declarations
      const declId = ctx.next();
      const declText = node.text || "var declaration";
      ctx.add(declId, processShape(declText));
      
      // Link to previous node
      if (ctx.last) {
        ctx.addEdge(ctx.last, declId);
      }
      ctx.last = declId;
      break;
      
    case 'IO':
      // Handle IO operations
      mapIO(node, ctx);
      break;
      
    case 'Expr':
      // Handle expressions
      const exprId = ctx.next();
      const exprText = node.text || "expression";
      ctx.add(exprId, processShape(exprText));
      
      // Link to previous node
      if (ctx.last) {
        ctx.addEdge(ctx.last, exprId);
      }
      ctx.last = exprId;
      break;
      
    case 'Assign':
      // Handle assignments
      const assignId = ctx.next();
      const assignText = node.text || "assignment";
      ctx.add(assignId, processShape(assignText));
      
      // Link to previous node
      if (ctx.last) {
        ctx.addEdge(ctx.last, assignId);
      }
      ctx.last = assignId;
      break;
      
    case 'Block':
      // Handle block nodes by processing their body
      if (node.body && Array.isArray(node.body)) {
        node.body.forEach(statement => {
          if (ctx && typeof ctx.handle === 'function') {
            ctx.handle(statement);
          }
        });
      }
      break;
      
    default:
      // For other node types, we can create a generic representation or skip them
      // For debugging purposes, we might want to show unknown nodes
      /*
      const unknownId = ctx.next();
      ctx.add(unknownId, processShape(`[${node.type}]`));
      
      if (ctx.last) {
        ctx.addEdge(ctx.last, unknownId);
      }
      ctx.last = unknownId;
      */
      break;
  }
}

/**
 * Get the text content of a node
 * @param {Object} node - Tree-sitter node
 * @returns {string} Text content of the node
 */
function getNodeText(node) {
  if (!node) return '';
  return node.text || '';
}

/**
 * Get condition text from an if statement
 * @param {Object} node - Tree-sitter node
 * @returns {string} Condition text
 */
function getConditionText(node) {
  // For repeat loops, look specifically for the condition after kUntil
  if (node.type === 'repeat') {
    // Look for kUntil and then the exprBinary after it
    let foundUntil = false;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && child.type === 'kUntil') {
        foundUntil = true;
        continue;
      }
      
      if (foundUntil && child && child.type === 'exprBinary') {
        return child.text || 'condition';
      }
    }
    return 'condition';
  }
  
  // For other nodes, look for exprBinary node which contains the condition
  return findChildTextByType(node, 'exprBinary') || 'condition';
}

/**
 * Find child node by type
 * @param {Object} node - Parent node
 * @param {string} type - Type to search for
 * @returns {Object|null} Child node or null
 */
function getChildByType(node, type) {
  if (!node || !node.childCount) return null;
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === type) {
      return child;
    }
  }
  
  return null;
}

/**
 * Find child node by field name
 * @param {Object} node - Parent node
 * @param {string} fieldName - Field name to search for
 * @returns {Object|null} Child node or null
 */
function getChildByFieldName(node, fieldName) {
  if (!node || !node.childCount) return null;
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    // Tree-sitter doesn't expose field names directly in JavaScript bindings
    // So we need to find the child based on position or type
    return child;
  }
  
  return null;
}

/**
 * Find text of child node by type
 * @param {Object} node - Parent node
 * @param {string} type - Type to search for
 * @returns {string} Text of child node or empty string
 */
function findChildTextByType(node, type) {
  if (!node || !node.childCount) return '';
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      if (child.type === type) {
        return child.text || '';
      }
      
      // Recursively search in children
      const result = findChildTextByType(child, type);
      if (result) {
        return result;
      }
    }
  }
  
  return '';
}

/**
 * Check if an if statement has an else clause
 * @param {Object} node - If statement node
 * @returns {boolean} True if has else clause
 */
function hasElseClause(node) {
  if (!node || !node.childCount) return false;
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === 'kElse') {
      return true;
    }
  }
  
  return false;
}

/**
 * Get for loop start text
 * @param {Object} node - For loop node
 * @returns {string} Start text
 */
function getForStartText(node) {
  // Look for assignment node which contains the start condition
  return findChildTextByType(node, 'assignment') || '';
}

/**
 * Get for loop direction (to/downto)
 * @param {Object} node - For loop node
 * @returns {string} Direction text
 */
function getForDirection(node) {
  // Look for kTo or kDownto nodes
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && (child.type === 'kTo' || child.type === 'kDownto')) {
      return child.text || '';
    }
  }
  return 'to';
}

/**
 * Get for loop end text
 * @param {Object} node - For loop node
 * @returns {string} End text
 */
function getForEndText(node) {
  // Look for the expression after kTo/kDownto
  let foundDirection = false;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && (child.type === 'kTo' || child.type === 'kDownto')) {
      foundDirection = true;
      continue;
    }
    
    if (foundDirection && child && (child.type === 'literalNumber' || child.type === 'identifier' || child.type === 'exprBinary')) {
      return child.text || '';
    }
  }
  return '';
}