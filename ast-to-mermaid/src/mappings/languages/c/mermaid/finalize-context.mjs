export function finalizeFlowContext(context) {
  if (!context) return null;

  if (typeof context.completeBranches === 'function') {
    context.completeBranches();
  }

  const endId = context.next();
  context.add(endId, '(["end"])');

  console.log('Finalizing context with pending joins:', context.pendingJoins?.length || 0);
  
  // Handle switch break statements properly
  // They should connect to the next statement after the switch block, not to the end node
  if (context.pendingJoins && context.pendingJoins.length > 0) {
    console.log('Processing pending joins');
    
    // Check if these pending joins are from switch break statements
    let hasSwitchBreaks = false;
    const breakNodeIds = new Set();
    
    // Look for break statements in the nodes
    context.nodes.forEach(node => {
      const match = node.match(/^(N\d+)\["break;"\]/);
      if (match) {
        breakNodeIds.add(match[1]);
      }
    });
    
    console.log('Break node IDs found:', Array.from(breakNodeIds));
    
    // Check if any pending joins are from break statements
    context.pendingJoins.forEach(join => {
      join.edges.forEach(edge => {
        if (breakNodeIds.has(edge.from)) {
          hasSwitchBreaks = true;
          console.log('Found switch break:', edge.from);
        }
      });
    });
    
    if (hasSwitchBreaks) {
      console.log('Processing switch breaks');
      
      // For switch break statements, we need to connect them to the next statement
      // Find the next statement after switch blocks
      if (context.nodes && context.edges) {
        // Get all node IDs in order
        const nodeInfos = [];
        context.nodes.forEach(node => {
          const nodeIdMatch = node.match(/^(N\d+)/);
          if (nodeIdMatch) {
            nodeInfos.push({id: nodeIdMatch[1], node: node});
          }
        });
        
        console.log('Node infos:', nodeInfos.map(n => `${n.id}: ${n.node}`).join('\n'));
        
        // Find switch statements and their positions
        const switchPositions = [];
        nodeInfos.forEach((nodeInfo, index) => {
          if (nodeInfo.node.includes('switch')) {
            switchPositions.push(index);
          }
        });
        
        console.log('Switch positions:', switchPositions);
        
        // For each switch statement, find the first statement after it that's not part of the switch
        if (switchPositions.length > 0) {
          switchPositions.forEach(switchIndex => {
            const switchId = nodeInfos[switchIndex].id;
            console.log('Processing switch:', switchId);
            
            // Find all case statements that connect from this switch
            const caseEdges = context.edges.filter(edge => 
              edge.startsWith(`${switchId} -->`)
            );
            
            console.log('Case edges:', caseEdges);
            
            // Find the first non-switch-related statement after the switch
            let nextStatementId = null;
            for (let i = switchIndex + 1; i < nodeInfos.length; i++) {
              const nodeInfo = nodeInfos[i];
              const nodeId = nodeInfo.id;
              
              // Check if this node is part of the switch
              const isSwitchRelated = 
                nodeInfo.node.includes('case ') || 
                nodeInfo.node.includes('default:') ||
                caseEdges.some(edge => edge.includes(`--> ${nodeId}`));
              
              console.log(`Checking node ${nodeId}: ${nodeInfo.node}, isSwitchRelated: ${isSwitchRelated}`);
              
              if (!isSwitchRelated) {
                nextStatementId = nodeId;
                console.log('Found next statement:', nextStatementId);
                break;
              }
            }
            
            // If we found the next statement, connect all pending joins to it
            if (nextStatementId) {
              console.log('Connecting pending joins to:', nextStatementId);
              const joins = context.pendingJoins.splice(0);
              joins.forEach(join => {
                join.edges.forEach(({ from, label }) => {
                  if (!from) return;
                  console.log(`Connecting ${from} to ${nextStatementId}`);
                  if (label) {
                    context.addEdge(from, nextStatementId, label);
                  } else {
                    context.addEdge(from, nextStatementId);
                  }
                });
              });
            }
          });
        }
      }
    }
  }

  // If we still have pending joins, resolve them to the end node
  if (context.pendingJoins && context.pendingJoins.length > 0) {
    console.log('Resolving remaining pending joins to end node');
    const joins = context.pendingJoins.splice(0);
    joins.forEach(join => {
      join.edges.forEach(({ from, label }) => {
        if (!from) return;
        if (label) {
          context.addEdge(from, endId, label);
        } else {
          context.addEdge(from, endId);
        }
      });
    });
  }

  // Note: pendingBreaks should be empty here if completeSwitch was called properly
  // Only connect breaks that are still pending (shouldn't happen in normal flow)
  if (context.pendingBreaks && context.pendingBreaks.length > 0) {
    context.pendingBreaks.forEach(breakInfo => {
      // Connect orphaned breaks directly to end
      context.addEdge(breakInfo.breakId, endId);
    });
    context.pendingBreaks = [];
  }

  // Note: Default case without break also needs to connect to next statement
  // But only if there are no pending joins (which would handle this connection)
  if (context.last && (!context.pendingJoins || context.pendingJoins.length === 0)) {
    context.addEdge(context.last, endId);
  }

  return endId;
}