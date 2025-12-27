import { extractJava } from '../extractors/java-extractor.mjs';
import { normalizeJava } from '../normalizer/normalize-java.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

// Import Java mapping functions
import { mapIfStatement } from '../conditional/if.mjs';
import { mapIfElseStatement } from '../conditional/if-else/if-else.mjs';
import { mapIfElseIfStatement } from '../conditional/if-elseif/if-elseif.mjs';
import { mapSwitchStatement, mapCase, mapDefault, completeSwitch } from '../conditional/switch/switch.mjs';
import { mapForStatement } from '../loops/for.mjs';
import { mapWhileStatement } from '../loops/while/while.mjs';
import { mapDoWhileStatement } from '../loops/do-while/do-while.mjs';
import { mapBreakStatement } from '../other-statements/break.mjs';
import { mapAssignment } from '../other-statements/assignment.mjs';
import { mapExpr } from '../other-statements/expression.mjs';
import { mapIncDecStatement } from '../other-statements/inc-dec.mjs';
import { mapReturn } from '../other-statements/return.mjs';
import { mapIoStatement } from '../io/io.mjs';
import { mapFunction, mapFunctionCall } from '../functions/index.mjs';



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
  
  // Check if we're currently in a branch and handle connection appropriately
  const originalLast = ctx.last;
  
  switch (node.type) {
    case "Function":
      return mapFunction(node, ctx);
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
      
      // Add break statement handling after switch to connect to next statement
      if (typeof completeSwitch === 'function') {
        completeSwitch(ctx);
      }
      
      return;
    case "SwitchCase":
      if (node.test) {
        return mapCase(node, ctx);
      } else {
        return mapDefault(node, ctx);
      }
    case "ForStatement": 
      // For for loops, we need to handle the condition and body properly
      // First, create the condition node
      mapForStatement(node, ctx);
      
      // Set inLoop flag to indicate we're inside a loop
      ctx.inLoop = true;
      
      // Set flag to indicate we're processing the first loop body node
      ctx.isFirstLoopBodyNode = true;
      
      // Then process the loop body - treat as 'then' branch (Yes path)
      if (typeof ctx.enterBranch === 'function') {
        ctx.enterBranch('then');
      }
      
      if (node.body && node.body.body) {
        // Process each statement in the loop body
        const bodyStatements = Array.isArray(node.body.body) ? node.body.body : [node.body];
        bodyStatements.forEach(bodyNode => {
          if (bodyNode) {
            mapNodeJava(bodyNode, ctx);
          }
        });
      } else if (node.body && node.body.type) {
        // If body is a single statement
        mapNodeJava(node.body, ctx);
      }
      
      // Clear the flag
      delete ctx.isFirstLoopBodyNode;
      
      // Exit the branch
      if (typeof ctx.exitBranch === 'function') {
        ctx.exitBranch('then');
      }
      
      // Complete the loop by connecting the body back to the condition
      if (typeof ctx.completeLoop === 'function') {
        ctx.completeLoop();
      }
      
      return;
    case "WhileStatement": 
      // For while loops, we need to handle the condition and body properly
      // First, create the condition node
      mapWhileStatement(node, ctx);
      
      // Set inLoop flag to indicate we're inside a loop
      ctx.inLoop = true;
      
      // Set flag to indicate we're processing the first loop body node
      ctx.isFirstLoopBodyNode = true;
      
      // Then process the loop body
      if (node.body && node.body.body) {
        // Process each statement in the loop body
        const bodyStatements = Array.isArray(node.body.body) ? node.body.body : [node.body];
        bodyStatements.forEach(bodyNode => {
          if (bodyNode) {
            mapNodeJava(bodyNode, ctx);
          }
        });
      } else if (node.body && node.body.type) {
        // If body is a single statement
        mapNodeJava(node.body, ctx);
      }
      
      // Clear the flag
      delete ctx.isFirstLoopBodyNode;
      
      // Complete the loop by connecting the body back to the condition
      if (typeof ctx.completeLoop === 'function') {
        ctx.completeLoop();
      }
      
      return;
    case "DoWhileStatement": 
      // For do-while loops, we process the body first (at least once), then check the condition
      // First, create the condition node but don't connect it to the flow yet
      mapDoWhileStatement(node, ctx);
      
      // Set inLoop flag to indicate we're inside a loop
      ctx.inLoop = true;
      
      // Store the first body node ID for do-while loop back connection
      let firstBodyNodeId = null;
      
      // Process the loop body - for do-while, don't use isFirstLoopBodyNode
      // because the body continues from the previous flow, not from the condition
      if (node.body && node.body.body) {
        // Process each statement in the loop body
        const bodyStatements = Array.isArray(node.body.body) ? node.body.body : [node.body];
        bodyStatements.forEach((bodyNode, index) => {
          if (bodyNode) {
            // Capture the ID of the first body node
            const previousLast = ctx.last;
            mapNodeJava(bodyNode, ctx);
            // If this is the first statement, store its ID
            if (index === 0 && ctx.last && ctx.last !== previousLast) {
              firstBodyNodeId = ctx.last;
            }
          }
        });
      } else if (node.body && node.body.type) {
        // If body is a single statement
        const previousLast = ctx.last;
        mapNodeJava(node.body, ctx);
        if (ctx.last && ctx.last !== previousLast) {
          firstBodyNodeId = ctx.last;
        }
      }
      
      // Store the first body node ID in the context for do-while loop handling
      if (firstBodyNodeId) {
        ctx.doWhileFirstBodyNodeId = firstBodyNodeId;
      }
      
      // Complete the loop by connecting the body back to the condition
      if (typeof ctx.completeLoop === 'function') {
        ctx.completeLoop();
      }
      
      // Clean up
      delete ctx.doWhileFirstBodyNodeId;
      
      return;
    case "BreakStatement": 
      return mapBreakStatement(node, ctx);
    case "AssignmentExpression": 
      return mapAssignment(node, ctx);
    case "ExpressionStatement": 
      return mapExpr(node, ctx);
    case "UpdateExpression": 
      return mapIncDecStatement(node, ctx);
    case "ReturnStatement": 
      // Handle return statements specially when in a branch context
      // If we're in a branch context, return statements should not connect sequentially
      // but should end that branch
      return mapReturn(node, ctx);
    case "CallExpression":
      // CallExpression nodes within ExpressionStatement are handled by mapExpr
      // This case should only handle CallExpressions that are not within ExpressionStatement
      // For consistency with expression statements, we'll skip this case
      // as function calls should be handled via ExpressionStatement wrapping
      return;
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

  // Collect functions (main + user-defined)
  let mainFunction = null;
  const userFunctions = [];

  if (normalized) {
    const collectFunctions = {
      handle: (node) => {
        if (node && node.type === "Function") {
          if (isMainFunction(node)) {
            mainFunction = node;
          } else {
            userFunctions.push(node);
          }
        }
      }
    };
    walk(normalized, collectFunctions);
  }
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Clear the visited set for this new context to start fresh
  context.visited.clear();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Walk and generate nodes using mapping functions
  const walkBody = (target, handlerCtx) => {
    if (!target) return;
    if (Array.isArray(target)) {
      target.forEach(n => walk(n, handlerCtx));
    } else {
      walk(target, handlerCtx);
    }
  };

  if (normalized) {
    const targetBody =
      (mainFunction && mainFunction.body) ||
      (normalized.type === "Program" ? normalized.body : normalized);

    if (targetBody) {
      const walkerContext = {
        handle: (node) => {
          if (node && node.type) {
            // Process the node first to create it in the context
            mapNodeJava(node, context);
            
            // After the node is processed, if there are pending joins,
            // they should be resolved to the newly created node (which is now in context.last)
            if (context.pendingJoins && context.pendingJoins.length > 0 && context.last) {
              context.resolvePendingJoins(context.last);
            }
          }
        }
      };

      walkBody(targetBody, walkerContext);
    }
  }
  
  // Finalize the flow context
  finalizeFlowContext(context);

  // Build subgraphs for user-defined functions when main exists
  const subgraphIds = {};

  if (mainFunction && userFunctions.length > 0) {
    userFunctions.forEach(fnNode => {
      if (!fnNode?.body) return;

      const fnContext = context.fork();
      
      // Clear the visited set for this function context to start fresh
      fnContext.visited.clear();
      
      const fnWalkerCtx = {
        handle: (node) => {
          if (node && node.type) {
            mapNodeJava(node, fnContext);
            
            // After the node is processed, if there are pending joins,
            // they should be resolved to the newly created node (which is now in fnContext.last)
            if (fnContext.pendingJoins && fnContext.pendingJoins.length > 0 && fnContext.last) {
              fnContext.resolvePendingJoins(fnContext.last);
            }
          }
        }
      };

      walkBody(fnNode.body, fnWalkerCtx);
      
      finalizeFlowContext(fnContext, false);

      const subgraphId = context.nextSubgraphId();
      const functionName = fnNode.name ? fnNode.name.split("(")[0].trim() : "anonymous";
      const subgraphLabel = `${subgraphId}["function ${fnNode.name || "anonymous"}"]`;
      const subgraphLines = [
        ...fnContext.nodes,
        ...fnContext.edges
      ];

      context.addSubgraph(subgraphLabel, subgraphLines);
      subgraphIds[functionName] = subgraphId;
    });
  }

  context.subgraphIds = subgraphIds;
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}

function isMainFunction(node) {
  if (!node?.name) return false;
  const name = node.name.trim();
  return name === "main" || name === "main()";
}