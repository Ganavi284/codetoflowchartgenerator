/**
 * Normalize Fortran AST (parsed from CLI output) to unified node types
 * @param {Object} node - Parsed AST node
 * @param {string} sourceCode - Original source text
 * @returns {Object|Array|null} - Normalized node(s)
 */
export function normalizeFortran(node, sourceCode = '') {
  if (!node) return null;

  switch (node.type) {
    case 'translation_unit':
      return {
        type: 'Program',
        name: 'main',
        body: normalizeChildren(node.children, sourceCode)
      };

    case 'program':
      return {
        type: 'Program',
        name: extractProgramName(node) || 'main',
        body: normalizeProgramBody(node.children, sourceCode)
      };

    case 'variable_declaration':
      return {
        type: 'Decl',
        text: buildDeclarationText(node)
      };

    case 'assignment_statement': {
      const left = findChildByField(node, 'left');
      const right = findChildByField(node, 'right');
      return {
        type: 'Assign',
        text: `${extractText(left)} = ${extractText(right)}`
      };
    }

    case 'print_statement':
      return {
        type: 'IO',
        text: sanitizeWhitespace(extractText(node))
      };

    case 'do_loop_statement':
      return normalizeLoop(node, sourceCode);

    case 'if_statement':
      return normalizeIf(node, sourceCode);

    case 'stop_statement':
    case 'return_statement':
      return {
        type: 'Return',
        text: extractText(node) || 'return'
      };

    case 'else_clause':
      return normalizeChildren(node.children, sourceCode);

    default:
      return normalizeChildren(node.children, sourceCode);
  }
}

function normalizeProgramBody(children = [], source) {
  const filtered = (children || []).filter(child => !child.type?.startsWith('end_') && child.type !== 'program_statement' && child.type !== 'implicit_statement');
  return normalizeChildren(filtered, source);
}

function normalizeLoop(node, source) {
  if (!node) return null;
  const whileNode = (node.children || []).find(child => child.type === 'while_statement');
  const rangeNode = (node.children || []).find(child => child.type === 'loop_control_expression');
  const bodyChildren = (node.children || []).filter(child => !['while_statement', 'loop_control_expression'].includes(child.type) && !child.type?.startsWith('end_'));
  const normalizedBody = normalizeChildren(bodyChildren, source);

  if (whileNode) {
    return {
      type: 'While',
      cond: {
        type: 'Expr',
        text: stripParentheses(extractExpressionText(whileNode))
      },
      body: normalizedBody
    };
  }

  if (rangeNode) {
    return {
      type: 'For',
      init: null,
      cond: {
        type: 'Expr',
        text: sanitizeWhitespace(extractText(rangeNode))
      },
      update: null,
      body: normalizedBody
    };
  }

  return normalizedBody;
}

function normalizeIf(node, source) {
  const conditionNode = (node.children || []).find(child => child.type?.includes('expression'));
  const bodyChildren = [];
  let elseChildren = null;

  (node.children || []).forEach(child => {
    if (child === conditionNode || child.type?.startsWith('end_')) {
      return;
    }
    if (child.type === 'else_clause') {
      const normalizedElse = normalizeFortran(child, source);
      if (Array.isArray(normalizedElse) && normalizedElse.length > 0) {
        elseChildren = normalizedElse;
      }
    } else {
      const normalized = normalizeFortran(child, source);
      if (Array.isArray(normalized)) {
        bodyChildren.push(...normalized);
      } else if (normalized) {
        bodyChildren.push(normalized);
      }
    }
  });

  return {
    type: 'If',
    cond: {
      type: 'Expr',
      text: stripParentheses(extractExpressionText(conditionNode))
    },
    then: bodyChildren,
    else: elseChildren
  };
}

function normalizeChildren(children = [], source) {
  const result = [];
  (children || []).forEach(child => {
    const normalized = normalizeFortran(child, source);
    if (Array.isArray(normalized)) {
      result.push(...normalized);
    } else if (normalized) {
      result.push(normalized);
    }
  });
  return result;
}

function findChildByField(node, field) {
  if (!node || !node.children) return null;
  return node.children.find(child => child.field === field) || null;
}

function extractProgramName(node) {
  const nameNode = findDescendant(node, 'name');
  return sanitizeWhitespace(extractText(nameNode));
}

function buildDeclarationText(node) {
  const typeNode = findChildByField(node, 'type');
  const declaratorNode = findChildByField(node, 'declarator');
  return sanitizeWhitespace(`${extractText(typeNode)} ${extractText(declaratorNode)}`.trim());
}

function extractExpressionText(node) {
  if (!node) return '';
  const exprChild = (node.children || []).find(child => child.type?.includes('expression'));
  if (exprChild) {
    return extractText(exprChild);
  }
  return extractText(node);
}

function extractText(node) {
  if (!node || typeof node.startIndex !== 'number' || typeof node.endIndex !== 'number') {
    return node?.text || '';
  }
  return node.text || '';
}

function sanitizeWhitespace(text = '') {
  return text.replace(/\s+/g, ' ').trim();
}

function stripParentheses(text = '') {
  let result = text.trim();
  while (result.startsWith('(') && result.endsWith(')')) {
    result = result.slice(1, -1).trim();
  }
  return result;
}

function findDescendant(node, type) {
  if (!node) return null;
  if (node.type === type) return node;
  for (const child of node.children || []) {
    const found = findDescendant(child, type);
    if (found) return found;
  }
  return null;
}