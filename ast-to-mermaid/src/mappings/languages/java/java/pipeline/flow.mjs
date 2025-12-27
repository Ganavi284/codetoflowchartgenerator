import { extractJava } from '../extractors/java-extractor.mjs';
import { normalizeJava } from '../normalizer/normalize-java.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

// Import Java mapping functions
import { mapIfStatement } from '../conditional/if.mjs';
import { mapIfElseStatement } from '../conditional/if-else/if-else.mjs';
import { mapIfElseIfStatement } from '../conditional/if-elseif/if-elseif.mjs';
import { mapSwitchStatement, mapCase, mapDefault } from '../conditional/switch/switch.mjs';
import { mapForStatement } from '../loops/for.mjs';
import { mapWhileStatement } from '../loops/while/while.mjs';
import { mapDoWhileStatement } from '../loops/do-while/do-while.mjs';
import { mapBreakStatement } from '../other-statements/break.mjs';
import { mapAssignment } from '../other-statements/assignment.mjs';
import { mapExpr } from '../other-statements/expression.mjs';
import { mapIncDecStatement } from '../other-statements/inc-dec.mjs';
import { mapReturn } from '../other-statements/return.mjs';
import { mapIoStatement } from '../io/io.mjs';

/**
 * Check if a node represents executable logic that should be included in the flowchart
 * @param {Object} node - AST node to check
 * @returns {boolean} - True if node represents executable logic
 */
function isExecutableLogic(node) {
  if (!node || !node.type) return false;
  
  // Include these types of executable statements
  const executableTypes = [
    'IfStatement',
    'SwitchStatement',
    'SwitchCase',
    'ForStatement',
    'WhileStatement',
    'DoWhileStatement',
    'BreakStatement',
    'ContinueStatement',
    'ReturnStatement',
    'ThrowStatement',
    'TryStatement',
    'ExpressionStatement',
    'AssignmentExpression',
    'UpdateExpression'
  ];
  
  // Check if this is an executable statement type
  if (executableTypes.includes(node.type)) {
    return true;
  }
  
  // For variable declarations, only include those with initialization
  if (node.type === 'VariableDeclaration') {
    return node.declarations && node.declarations.some(decl => decl.init);
  }
  
  // For expression statements, check if they contain meaningful operations
  if (node.type === 'ExpressionStatement') {
    const expr = node.expression;
    if (!expr) return false;
    
    // Include method calls (like System.out.println)
    if (expr.type === 'CallExpression') {
      return true;
    }
    
    // Include assignments
    if (expr.type === 'AssignmentExpression') {
      return true;
    }
    
    // Include increment/decrement operations
    if (expr.type === 'UpdateExpression') {
      return true;
    }
  }
  
  return false;
}

/**
 * Extract executable statements from a program body, ignoring boilerplate
 * @param {Array} body - Array of AST nodes
 * @returns {Array} - Filtered array of executable nodes
 */
function extractExecutableStatements(body) {
  if (!body || !Array.isArray(body)) return [];
  
  const executableNodes = [];
  
  body.forEach(node => {
    // Skip null/undefined nodes
    if (!node) return;
    
    // Skip class/method declarations and other boilerplate
    if (['ClassDeclaration', 'MethodDeclaration', 'ImportDeclaration', 'PackageDeclaration'].includes(node.type)) {
      // But process their bodies if they have them
      if (node.body && node.body.body) {
        executableNodes.push(...extractExecutableStatements(node.body.body));
      } else if (node.declarations) {
        node.declarations.forEach(decl => {
          if (decl.init) {
            executableNodes.push({
              type: 'AssignmentExpression',
              left: decl.id,
              right: decl.init,
              operator: '='
            });
          }
        });
      }
      return;
    }
    
    // For blocks, recursively extract statements
    if (node.type === 'BlockStatement' && node.body) {
      executableNodes.push(...extractExecutableStatements(node.body));
      return;
    }
    
    // Add executable logic nodes
    if (isExecutableLogic(node)) {
      executableNodes.push(node);
    }
  });
  
  return executableNodes;
}

/**
 * Process a block of statements
 * @param {Array} statements - Array of statements to process
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Function to map nodes
 */
function processBlock(statements, ctx, mapper) {
  if (!statements || !Array.isArray(statements)) return;
  
  statements.forEach(statement => {
    if (statement) {
      mapper(statement, ctx);
    }
  });
}

/**
 * Map Java nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized Java node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNodeJava(node, ctx) {
  // Add null check
  if (!node) return;
  
  switch (node.type) {
    case "IfStatement": 
      // Check if this is an if-else or if-elseif statement
      if (node.alternate) {
        // Check if alternate is another if statement (else if)
        if (node.alternate.type === 'IfStatement') {
          return mapIfElseIfStatement(node, ctx, mapNodeJava);
        } else {
          // Regular if-else statement
          return mapIfElseStatement(node, ctx, mapNodeJava);
        }
      } else {
        // Simple if statement
        return mapIfStatement(node, ctx, mapNodeJava);
      }
    case "SwitchStatement": 
      // Map the switch statement first
      mapSwitchStatement(node, ctx);
      
      // Then process all the cases
      if (node.cases && Array.isArray(node.cases)) {
        node.cases.forEach(caseNode => {
          if (caseNode) { // Add null check
            mapNodeJava(caseNode, ctx);
            
            // Process the consequent statements for this case
            if (caseNode.consequent && Array.isArray(caseNode.consequent)) {
              caseNode.consequent.forEach(stmt => {
                if (stmt) {
                  mapNodeJava(stmt, ctx);
                }
              });
            }
          }
        });
      }
      
      return;
    case "SwitchCase":
      if (node.test) {
        return mapCase(node, ctx);
      } else {
        return mapDefault(node, ctx);
      }
    case "ForStatement": 
      return mapForStatement(node, ctx);
    case "WhileStatement": 
      return mapWhileStatement(node, ctx);
    case "DoWhileStatement": 
      return mapDoWhileStatement(node, ctx);
    case "BreakStatement": 
      return mapBreakStatement(node, ctx);
    case "AssignmentExpression": 
      return mapAssignment(node, ctx);
    case "ExpressionStatement": 
      return mapExpr(node, ctx);
    case "UpdateExpression": 
      return mapIncDecStatement(node, ctx);
    case "ReturnStatement": 
      return mapReturn(node, ctx);
    case "CallExpression":
      // Check for System.out.print/println
      if (node.callee && node.callee.object && 
          node.callee.object.name === 'System' &&
          node.callee.property && 
          (node.callee.property.name === 'out')) {
        return mapIoStatement(node, ctx);
      }
      break;
  }
}

/**
 * Generate VTU-style Mermaid flowchart from Java source code
 * @param {string} sourceCode - Java source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractJava(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeJava(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Walk and generate nodes using mapping functions
  if (normalized) {
    // Find the main program and process its body directly
    let mainProgramBody = null;
    
    // Check if normalized is the main program itself
    if (normalized.type === 'Program' || normalized.type === 'Block') {
      mainProgramBody = normalized.body;
    }
    
    // Extract only executable statements, ignoring boilerplate
    const executableStatements = extractExecutableStatements(mainProgramBody);
    
    // If we found executable statements, process them
    if (executableStatements && executableStatements.length > 0) {
      // Create a walker context that uses the mapping functions
      const walkerContext = {
        handle: (node) => {
          if (node && node.type) {
            // Use the mapping function to add nodes to the context
            mapNodeJava(node, context);
          }
        }
      };
      
      // Walk each executable statement
      executableStatements.forEach((node, index) => {
        walk(node, walkerContext);
      });
    }
  }
  
  // Finalize the flow context
  finalizeFlowContext(context);
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}