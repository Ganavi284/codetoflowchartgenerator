import { extractC } from '../extractors/c-extractor.mjs';
import { normalizeC } from '../normalizer/normalize-c.mjs';
import { mapNodeC } from '../map-node-c.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

/**
 * Generate VTU-style Mermaid flowchart from C source code
 * @param {string} sourceCode - C source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractC(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeC(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Identify functions (main + user-defined)
  let mainFunction = null;
  const userFunctions = [];

  if (normalized) {
    const collectFunctions = {
      handle: (node) => {
        if (node && node.type === 'Function') {
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

  // 5. Walk nodes to build main flowchart
  if (normalized) {
    const target = mainFunction?.body || normalized;
    context.handle = (node) => {
      if (node && node.type) {
        mapNodeC(node, context);
      }
    };
    walk(target, context);
    delete context.handle;
  }

  // 6. Finalize main context
  finalizeFlowContext(context);

  // 7. Build subgraphs for user-defined functions (only when a main function exists)
  if (mainFunction && userFunctions.length > 0) {
    userFunctions.forEach(fnNode => {
      if (!fnNode?.body) return;

      const fnContext = context.fork();

      // Create local start node
      const startId = fnContext.next();
      fnContext.add(startId, '(["start"])');
      fnContext.setLast(startId);

      fnContext.handle = (node) => {
        if (node && node.type) {
          mapNodeC(node, fnContext);
        }
      };
      walk(fnNode.body, fnContext);
      delete fnContext.handle;

      // Finalize function-specific context
      finalizeFlowContext(fnContext);

      const subgraphId = context.nextSubgraphId();
      const subgraphLabel = `${subgraphId}["function ${fnNode.name || "anonymous"}"]`;
      const subgraphLines = [
        ...fnContext.nodes,
        ...fnContext.edges
      ];

      context.addSubgraph(subgraphLabel, subgraphLines);
    });
  }

  // 8. Emit final Mermaid flowchart
  return context.emit();
}

function isMainFunction(node) {
  if (!node?.name) return false;
  const name = node.name.trim();
  return name === 'main' || name === 'main()' || name.startsWith('main');
}