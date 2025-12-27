import { extractTypeScript } from '../extractors/typescript-extractor.mjs';
import { normalizeTypescriptAst } from '../normalizer/normalize-typescript.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';
import { shapes } from '../mermaid/shapes.mjs';

// Import TypeScript mapping functions
import { mapIfStatement } from '../conditional/if.mjs';
import { mapIfElseStatement } from '../conditional/if-else/if-else.mjs';
import { mapIfElseIfStatement } from '../conditional/if-elseif/if-elseif.mjs';
import { mapSwitchStatement, mapCase, mapDefault } from '../conditional/switch/switch.mjs';
import { mapFunction } from '../functions/index.mjs';
import { mapFunctionCall } from '../functions/index.mjs';
import { mapForStatement } from '../loops/for/for.mjs';
import { mapWhileStatement } from '../loops/while/while.mjs';
import { mapDoWhileStatement } from '../loops/do-while/do-while.mjs';
import { mapIO } from '../io/io.mjs';
import { completeSwitch } from '../mappings/common/common.mjs';

/**
 * Map TypeScript nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized TypeScript node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Recursive mapper function
 */
export function mapNodeTypescript(node, ctx, mapper) {
  switch (node.type) {
    case "If": 
      // Check if this is a simple if, if-else, or if-else-if statement
      if (node.alternate) {
        if (node.alternate.type === 'If') {
          // This is an if-else-if statement
          return mapIfElseIfStatement(node, ctx, mapper);
        } else {
          // This is an if-else statement
          return mapIfElseStatement(node, ctx, mapper);
        }
      } else {
        // This is a simple if statement
        return mapIfStatement(node, ctx, mapper);
      }
    case "IO": return mapIO(node, ctx);
    case "Decl": 
      // Handle variable declarations
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`); // Process shape
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
      break;
    case "Assign": 
      // Handle assignments
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`); // Process shape
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
      break;
    case "Expr": 
      // Handle expressions
      // Special handling for break statements
      if (node.text === 'break;') {
        // Handle break statements in switch cases
        if (ctx.currentSwitchId) {
          // Create a break node
          const breakId = ctx.next();
          ctx.add(breakId, `["break;"\]`);
          
          // Connect to the previous statement
          if (ctx.last) {
            ctx.addEdge(ctx.last, breakId);
          }
          ctx.setLast(breakId);
          
          // Track this break statement for later connection to the end of the switch
          if (!ctx.pendingBreaks) {
            ctx.pendingBreaks = [];
          }
          
          // Get the current switch level
          const switchLevel = ctx.switchEndNodes ? ctx.switchEndNodes.length - 1 : 0;
          ctx.pendingBreaks.push({
            breakId: breakId,
            switchLevel: switchLevel,
            nextStatementId: 'NEXT_AFTER_SWITCH' // Will be resolved in finalize context
          });
          break;
        } else {
          // Break outside of switch (e.g., in loops) - treat as regular statement
          const id = ctx.next();
          ctx.add(id, `["break;"\]`);
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
          break;
        }
      }
      
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`); // Process shape
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
      break;
    case "Switch":
      // Handle switch statements
      return mapSwitchStatement(node, ctx, mapper);
    case "Function":
      // Handle function declarations
      return mapFunction(node, ctx);
    case "FunctionCall":
      // Handle function calls
      return mapFunctionCall(node, ctx);
    case "For":
      // Handle for loops
      return mapForStatement(node, ctx, mapper);
    case "While":
      // Handle while loops
      return mapWhileStatement(node, ctx, mapper);
    case "DoWhile":
      // Handle do-while loops
      return mapDoWhileStatement(node, ctx, mapper);
    case "Case":
      // Handle case statements
      return mapCase(node, ctx, mapper);
    case "Default":
      // Handle default case
      return mapDefault(node, ctx, mapper);
    case "Break":
      // Handle break statements in switch cases
      if (ctx.currentSwitchId) {
        // Create a break node
        const breakId = ctx.next();
        ctx.add(breakId, `["break;"\]`);
        
        // Connect to the previous statement
        if (ctx.last) {
          ctx.addEdge(ctx.last, breakId);
        }
        ctx.setLast(breakId);
        
        // Track this break statement for later connection to the end of the switch
        if (!ctx.pendingBreaks) {
          ctx.pendingBreaks = [];
        }
        
        // Get the current switch level
        const switchLevel = ctx.switchEndNodes ? ctx.switchEndNodes.length - 1 : 0;
        ctx.pendingBreaks.push({
          breakId: breakId,
          switchLevel: switchLevel,
          nextStatementId: 'NEXT_AFTER_SWITCH' // Will be resolved in finalize context
        });
      } else {
        // Break outside of switch (e.g., in loops) - treat as regular statement
        const id = ctx.next();
        ctx.add(id, `["break;"\]`);
        if (ctx.last) {
          ctx.addEdge(ctx.last, id);
        }
        ctx.setLast(id);
      }
      break;
    default:
      // For unhandled node types, create a generic process node
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`);
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
  }
}

/**
 * Generate VTU-style Mermaid flowchart from TypeScript source code
 * @param {string} sourceCode - TypeScript source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractTypeScript(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeTypescriptAst(ast);
  
  // Collect functions (Main + user-defined)
  let mainFunction = null;
  const userFunctions = [];
  
  if (normalized && normalized.type === 'Program' && normalized.body) {
    // The main function is the outer Program node itself
    if (isMainFunction(normalized)) {
      mainFunction = normalized;
    }
    
    // Process the body to find user-defined functions
    normalized.body.forEach(node => {
      if (node && node.type === 'Function') {
        if (!isMainFunction(node)) {
          userFunctions.push(node);
        }
      }
    });
  }
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Define the recursive mapper function
  const mapper = (node, ctx) => {
    if (node && node.type) {
      mapNodeTypescript(node, ctx, mapper);
      // After processing a switch statement, complete it to connect break statements
      if (node.type === 'Switch') {
        completeSwitch(ctx);
      }
    }
  };
  
  // Manually set the start node
  // The context.emit() method already adds START and END nodes
  
  // 4. Walk and generate nodes using mapping functions
  // Process main function body instead of all program body
  let targetBody = null;
  
  // If we have a main function, use its actual body
  if (mainFunction && mainFunction.body) {
    // The main function's body contains nested Programs
    // Find the actual main function body (which should be another Program with name 'main')
    const actualMainBody = mainFunction.body.find(node => node && node.type === 'Program' && node.name === 'main');
    if (actualMainBody && actualMainBody.body) {
      targetBody = actualMainBody.body;
    } else {
      targetBody = mainFunction.body;
    }
  } else if (normalized.type === 'Program' && normalized.body) {
    // Otherwise, look for the main function body in the program
    // The main function body might be nested as another Program
    const mainBody = normalized.body.find(node => node && node.type === 'Program' && node.name === 'main');
    if (mainBody && mainBody.body) {
      targetBody = mainBody.body;
    } else {
      targetBody = normalized.body;
    }
  } else {
    targetBody = normalized;
  }
  
  if (targetBody) {
    if (Array.isArray(targetBody)) {
      // Walk each node in the main function's body
      targetBody.forEach(node => {
        // Only process non-function declarations in main execution flow
        if (node && node.type !== 'Function') {
          mapper(node, context);
        }
      });
    } else {
      // If targetBody is not an array, process it directly
      mapper(targetBody, context);
    }
  }
  
  // Finalize the context
  finalizeFlowContext(context);
  
  // Build subgraphs for user-defined functions when main exists
  const subgraphIds = {};
  
  if (mainFunction && userFunctions.length > 0) {
    userFunctions.forEach(fnNode => {
      if (!fnNode?.body) return;
      
      const fnContext = context.fork();
      const fnMapper = (node, ctx) => {
        if (node && node.type) {
          mapNodeTypescript(node, ctx, fnMapper);
        }
      };
      
      // Process function body
      fnNode.body.forEach(node => {
        fnMapper(node, fnContext);
      });
      
      finalizeFlowContext(fnContext, false);
      
      const subgraphId = context.nextSubgraphId();
      const functionName = fnNode.name ? fnNode.name.split('(')[0].trim() : "anonymous";
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