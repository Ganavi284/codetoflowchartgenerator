export function finalizeFlowContext(context) {
  if (!context) return null;

  if (typeof context.completeBranches === 'function') {
    context.completeBranches();
  }

  const endId = context.next();
  context.add(endId, '(["end"])');

  // Handle if-else-if chains properly
  // In if-else-if chains, the No branches should connect to the next condition,
  // not to the end node
  if (context.pendingJoins && context.pendingJoins.length > 0) {
    // First, let's identify if-else-if chains by looking at the node shapes
    const nodeMap = {};
    const nodeOrder = [];
    context.nodes.forEach(nodeLine => {
      const match = nodeLine.match(/^(N\d+)(.*)/);
      if (match) {
        nodeMap[match[1]] = match[2];
        nodeOrder.push(match[1]);
      }
    });
    
    // Identify decision nodes and their positions
    const decisionNodes = [];
    nodeOrder.forEach((nodeId, index) => {
      const nodeText = nodeMap[nodeId];
      if (nodeText && nodeText.includes('{')) {
        decisionNodes.push({id: nodeId, text: nodeText, index: index});
      }
    });
    
    // Identify if-else-if chains
    const ifElseIfChains = [];
    for (let i = 0; i < decisionNodes.length; i++) {
      const currentNode = decisionNodes[i];
      const nodeText = currentNode.text;
      
      // Check if this is an if/else if statement
      if (nodeText && (nodeText.includes('if ') || nodeText.includes('else if '))) {
        const chain = [currentNode];
        let nextIndex = i + 1;
        
        // Look for consecutive else if statements
        while (nextIndex < decisionNodes.length) {
          const nextNode = decisionNodes[nextIndex];
          const nextNodeText = nextNode.text;
          
          // Check if the next decision node is an else if statement
          if (nextNodeText && nextNodeText.includes('else if ')) {
            // For if-else-if chains, we're more permissive about what constitutes a valid chain
            // We allow IO statements and other simple statements between conditions
            // Only break the chain if we encounter a non-if statement that's not simple IO
            let isConsecutive = true;
            for (let j = currentNode.index + 1; j < nextNode.index; j++) {
              const intermediateNodeId = nodeOrder[j];
              const intermediateNodeText = nodeMap[intermediateNodeId];
              
              // If there's a non-decision node that's not a simple IO or process node, it might break the chain
              if (intermediateNodeText && 
                  !intermediateNodeText.includes('{') && 
                  !intermediateNodeText.includes('(["end"])') &&
                  !intermediateNodeText.trim().startsWith('//')) {
                // Check if it's a complex statement that would break the chain
                // For now, let's be more permissive and only break on certain complex statements
                // Allow simple IO statements and process statements
                if (intermediateNodeText.includes('switch') || 
                    intermediateNodeText.includes('for') || 
                    intermediateNodeText.includes('while')) {
                  isConsecutive = false;
                  break;
                }
                // Otherwise, continue (allow simple statements like IO and assignments)
              }
            }
            
            if (isConsecutive) {
              chain.push(nextNode);
              nextIndex++;
            } else {
              break;
            }
          } else {
            break;
          }
        }
        
        // If we found a chain of 2 or more, add it
        if (chain.length >= 2) {
          ifElseIfChains.push(chain);
        }
      }
    }
    
    // Create a set of decision node IDs that are part of if-else-if chains (except the last in each chain)
    const chainNodeIds = new Set();
    const chainConnections = new Map(); // Track which node connects to which next node
    ifElseIfChains.forEach(chain => {
      // Add all nodes except the last one and track their connections
      for (let i = 0; i < chain.length - 1; i++) {
        chainNodeIds.add(chain[i].id);
        chainConnections.set(chain[i].id, chain[i + 1].id);
      }
    });
    
    // Process pending joins and handle if-else-if chains
    const remainingJoins = [];
    context.pendingJoins.forEach((join, joinIndex) => {
      const newEdges = [];
      join.edges.forEach((edge, edgeIndex) => {
        if (!edge.from) {
          newEdges.push(edge);
          return;
        }
        
        // Check if this is a No branch from a decision node that's part of an if-else-if chain
        if (edge.label === 'No' && chainNodeIds.has(edge.from)) {
          // This edge should be handled by connecting to the next condition in the chain
          // We don't add it to remaining joins because it will be handled separately
        } else {
          // This edge is not part of an if-else-if chain or is not a No branch, add to remaining joins
          newEdges.push(edge);
        }
      });
      
      if (newEdges.length > 0) {
        remainingJoins.push({ edges: newEdges });
      }
    });
    
    // Now connect the No branches of chain nodes to the next condition in their chain
    // But only add them if they don't already exist to prevent duplicates
    const existingEdges = new Set();
    context.edges.forEach(edge => {
      existingEdges.add(edge);
    });
    
    ifElseIfChains.forEach(chain => {
      for (let i = 0; i < chain.length - 1; i++) {
        const currentNode = chain[i];
        const nextNode = chain[i + 1];
        const edgeString = `${currentNode.id} -- No --> ${nextNode.id}`;
        
        // Only add the edge if it doesn't already exist
        if (!existingEdges.has(edgeString)) {
          context.addEdge(currentNode.id, nextNode.id, 'No');
          existingEdges.add(edgeString);
        }
      }
    });
    
    // Update pendingJoins with remaining joins
    context.pendingJoins = remainingJoins;
  }

  // Handle switch break statements properly
  // They should connect to the next statement after the switch block, not to the end node
  if (context.pendingJoins && context.pendingJoins.length > 0) {
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
    
    // Check if any pending joins are from break statements
    context.pendingJoins.forEach(join => {
      join.edges.forEach(edge => {
        if (breakNodeIds.has(edge.from)) {
          hasSwitchBreaks = true;
        }
      });
    });
    
    if (hasSwitchBreaks) {
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
        
        // Find switch statements and their positions
        const switchPositions = [];
        nodeInfos.forEach((nodeInfo, index) => {
          if (nodeInfo.node.includes('switch')) {
            switchPositions.push(index);
          }
        });
        
        // For each switch statement, find the first statement after it that's not part of the switch
        if (switchPositions.length > 0) {
          switchPositions.forEach(switchIndex => {
            const switchId = nodeInfos[switchIndex].id;
            
            // Find all case statements that connect from this switch
            const caseEdges = context.edges.filter(edge => 
              edge.startsWith(`${switchId} -->`)
            );
            
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
              
              if (!isSwitchRelated) {
                nextStatementId = nodeId;
                break;
              }
            }
            
            // If we found the next statement, connect all pending joins to it
            if (nextStatementId) {
              const joins = context.pendingJoins.splice(0);
              joins.forEach(join => {
                join.edges.forEach(({ from, label }) => {
                  if (!from) return;
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