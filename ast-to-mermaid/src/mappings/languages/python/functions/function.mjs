/**
 * Function declaration mapping for Python language
 */

export function mapFunctionDef(node) {
  // Map Python function definition to a standardized format
  return {
    type: 'Function',
    name: node.name,
    params: node.args || node.arguments || [],
    body: node.body || [],
    returnType: null  // Python doesn't have explicit return types in AST
  };
}

export function mapFunctionCall(node) {
  // Map Python function call to a standardized format
  return {
    type: 'FunctionCall',
    name: getFunctionName(node),
    arguments: node.arguments || node.args || [],
    text: formatFunctionCallText(node)
  };
}

// Helper function to extract function name from call node
function getFunctionName(node) {
  if (node.func) {
    if (node.func.id) {
      return node.func.id;
    } else if (node.func.attr) {
      // For method calls like obj.method()
      return node.func.attr;
    } else if (node.func.value && node.func.value.id) {
      // For module.function() calls
      return `${node.func.value.id}.${node.func.attr}`;
    }
  }
  return 'unknown';
}

// Helper function to format function call text
function formatFunctionCallText(node) {
  const name = getFunctionName(node);
  const args = node.arguments || node.args || [];
  const argText = args.map(arg => arg.type || 'arg').join(', ');
  return `${name}(${argText})`;
}