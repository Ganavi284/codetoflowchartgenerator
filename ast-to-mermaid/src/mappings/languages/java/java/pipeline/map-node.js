export function mapNode(node, context) {
  if (!node || !context) {
    return null;
  }

  // Map node based on its type
  switch (node.type) {
    case 'IfStatement':
      return mapIfStatement(node, context);
    case 'SwitchStatement':
      // Map the switch statement first
      mapSwitchStatement(node, context);
      
      // Then process all the cases
      if (node.cases && Array.isArray(node.cases)) {
        node.cases.forEach(caseNode => {
          if (caseNode) { // Add null check
            mapNode(caseNode, context);
            
            // Process the consequent statements for this case
            if (caseNode.consequent && Array.isArray(caseNode.consequent)) {
              caseNode.consequent.forEach(stmt => {
                if (stmt) {
                  mapNode(stmt, context);
                }
              });
            }
          }
        });
      }
      
      return;
    case 'SwitchCase':
      if (node.test) {
        return mapCase(node, context);
      } else {
        return mapDefault(node, context);
      }
    case 'ForStatement':
      return mapForStatement(node, context);
    case 'WhileStatement':
      return mapWhileStatement(node, context);
    case 'DoWhileStatement':
      return mapDoWhileStatement(node, context);
    case 'BreakStatement':
      return mapBreakStatement(node, context);
    case 'AssignmentExpression':
      return mapAssignment(node, context);
    case 'ExpressionStatement':
      return mapExpr(node, context);
    case 'UpdateExpression':
      return mapIncDecStatement(node, context);
    case 'ReturnStatement':
      return mapReturn(node, context);
    case 'CallExpression':
      // Check for System.out.print/println
      if (node.callee && node.callee.object && 
          node.callee.object.name === 'System' &&
          node.callee.property && 
          (node.callee.property.name === 'out')) {
        return mapIoStatement(node, context);
      }
      break;
    default:
      // For unhandled node types, create a generic process node
      if (node.text) {
        const nodeId = context.next();
        context.add(nodeId, `["${node.text}"]`);
        if (context.last) {
          context.addEdge(context.last, nodeId);
        }
        context.last = nodeId;
        return nodeId;
      }
      break;
  }

  return null;
}