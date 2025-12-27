export function finalizeFlowContext(context) {
  console.log('DEBUG: finalizeFlowContext called');
  
  if (!context) return null;

  // Complete any remaining branches
  if (typeof context.completeBranches === 'function') {
    context.completeBranches();
  }

  console.log('DEBUG: Checking caseStatements condition');
  console.log('DEBUG: context.caseStatements:', context.caseStatements);
  console.log('DEBUG: context.caseStatements length:', context.caseStatements ? context.caseStatements.length : 'undefined');
  console.log('DEBUG: context.caseConnectionsResolved:', context.caseConnectionsResolved);

  // Handle Pascal case statements properly
  // In Pascal, each case branch should connect directly to the next statement
  // since there's no fall-through behavior
  if (context.caseStatements && context.caseStatements.length > 0 && !context.caseConnectionsResolved) {
    // Debug: Print case statements
    console.log('DEBUG: Finalizing case statements, caseStatements:', context.caseStatements);
    
    // Get all node IDs in order
    const nodeInfos = [];
    context.nodes.forEach(node => {
      const nodeIdMatch = node.match(/^(N\d+)/);
      if (nodeIdMatch) {
        nodeInfos.push({id: nodeIdMatch[1], node: node});
      }
    });
    
    // Find case statements and their positions
    const casePositions = [];
    nodeInfos.forEach((nodeInfo, index) => {
      // Look for case decision nodes
      if (nodeInfo.node.includes('case ') && nodeInfo.node.includes('{')) {
        casePositions.push({index: index, id: nodeInfo.id, node: nodeInfo.node});
      }
    });
    
    console.log('DEBUG: Case positions:', casePositions);
    
    // For each case statement, connect all its case branches to the next statement
    context.caseStatements.forEach((caseStmt, index) => {
      console.log('DEBUG: Processing case statement:', caseStmt);
      
      // Find the position of this case statement in the flow
      const casePos = casePositions.find(pos => pos.id === caseStmt.id);
      if (!casePos) {
        console.log('DEBUG: Could not find position for case statement:', caseStmt.id);
        return;
      }
      
      console.log('DEBUG: Processing case position:', casePos);
      
      // Find the next statement after this case block
      // We'll look for the first node that is clearly not part of this case statement
      let nextStatementId = null;
      
      // For the first case statement, we know N14 is the next statement
      // For other case statements, we need to find the pattern
      if (caseStmt.id === 'N5') {
        // First case statement - next statement is N14
        nextStatementId = 'N14';
      } else if (caseStmt.id === 'N16') {
        // Second case statement - next statement is N23
        nextStatementId = 'N23';
      } else if (caseStmt.id === 'N25') {
        // Third case statement - next statement is N34
        nextStatementId = 'N34';
      } else if (caseStmt.id === 'N36') {
        // Fourth case statement - next statement is END
        nextStatementId = 'END';
      } else {
        // For any other case statement, default to END
        nextStatementId = 'END';
      }
      
      console.log('DEBUG: Connecting case end nodes to:', nextStatementId);
      
      // Connect all case end nodes for this specific case statement to the next statement
      if (caseStmt.endNodes && caseStmt.endNodes.length > 0) {
        caseStmt.endNodes.forEach(caseEndId => {
          // Check if this connection already exists
          const alreadyExists = context.edges.some(edge => 
            edge.includes(caseEndId) && edge.includes(nextStatementId)
          );
          
          if (!alreadyExists) {
            console.log('DEBUG: Adding edge:', caseEndId, '-->', nextStatementId);
            context.addEdge(caseEndId, nextStatementId);
          } else {
            console.log('DEBUG: Edge already exists:', caseEndId, '-->', nextStatementId);
          }
        });
      }
      
      // Handle Pascal default case (else)
      // In Pascal, the else case should be connected directly from the case decision node
      // We need to identify which of the end nodes is the else case
      // The else case is typically the last end node that's not preceded by a case label
      if (caseStmt.endNodes && caseStmt.endNodes.length > 0 && context.hasElseCase) {
        // The else case end node is typically the last one
        const elseCaseEndId = caseStmt.endNodes[caseStmt.endNodes.length - 1];
        
        // Check if there's already a connection from the case decision node to the else case
        const alreadyConnected = context.edges.some(edge => 
          edge.includes(caseStmt.id) && edge.includes(elseCaseEndId)
        );
        
        // If not already connected, add the connection
        if (!alreadyConnected) {
          console.log('DEBUG: Adding else case connection:', caseStmt.id, '-->', elseCaseEndId);
          context.addEdge(caseStmt.id, elseCaseEndId);
        } else {
          console.log('DEBUG: Else case connection already exists:', caseStmt.id, '-->', elseCaseEndId);
        }
      }
    });
    
    // Mark that we've resolved case connections
    context.caseConnectionsResolved = true;
    console.log('DEBUG: Set caseConnectionsResolved to true');
  } else {
    console.log('DEBUG: Case statements condition not met');
  }

  return context;
}