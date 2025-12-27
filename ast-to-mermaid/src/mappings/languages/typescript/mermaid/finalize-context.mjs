export function finalizeFlowContext(context) {
  if (!context) return null;

  // Complete any remaining branches
  if (typeof context.completeBranches === 'function') {
    context.completeBranches();
  }

  // Identify all switch-related nodes to help with conditional handling inside switches
  let switchRelatedNodes = new Set();
  let switchStartNodes = new Map(); // Maps switch node ID to its start index
  let switchEndIndices = new Map(); // Maps switch node ID to its end index
  
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
        switchStartNodes.set(nodeInfo.id, index);
      }
    });
    
    // For each switch statement, find the end of the switch block
    switchPositions.forEach(switchIndex => {
      const switchId = nodeInfos[switchIndex].id;
      let lastSwitchNodeIndex = switchIndex;
      
      // Look for all nodes that are part of this switch
      for (let i = switchIndex + 1; i < nodeInfos.length; i++) {
        const nodeInfo = nodeInfos[i];
        const nodeId = nodeInfo.id;
        
        // Check if this node is part of the switch
        const isSwitchRelated = 
          nodeInfo.node.includes('case ') || 
          nodeInfo.node.includes('default:') ||
          nodeInfo.node.includes('break;') ||
          context.edges.some(edge => edge.startsWith(`${switchId} -->`) && edge.includes(`--> ${nodeId}`)) ||
          // Check if this node comes after a case/default but before a break
          (i > switchIndex && i < nodeInfos.length - 1 && 
           (() => {
             // Look backwards to see if we're in a case block
             for (let j = i - 1; j > switchIndex; j--) {
               const prevNodeInfo = nodeInfos[j];
               if (prevNodeInfo.node.includes('break;')) {
                 // Found a break before this node, so this node is not part of a case
                 return false;
               }
               if (prevNodeInfo.node.includes('case ') || prevNodeInfo.node.includes('default:')) {
                 // Found a case/default before this node, so this node is part of a case
                 return true;
               }
             }
             return false;
           })());
      
        if (isSwitchRelated) {
          switchRelatedNodes.add(nodeId);
          lastSwitchNodeIndex = i;
        } else {
          // Once we find a non-switch node, we can stop looking
          break;
        }
      }
      
      switchEndIndices.set(switchId, lastSwitchNodeIndex);
    });
  }
  
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
        const edgeString = `${currentNode.id} -->|No| ${nextNode.id}`;
        
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
  
  // Handle conditional branches inside switch cases
  // These should connect to the next statement after the switch or to the break statement
  if (context.pendingJoins && context.pendingJoins.length > 0) {
    const nodeInfos = [];
    context.nodes.forEach(node => {
      const nodeIdMatch = node.match(/^(N\d+)/);
      if (nodeIdMatch) {
        nodeInfos.push({id: nodeIdMatch[1], node: node});
      }
    });
    
    const conditionalInSwitchJoins = [];
    const remainingJoins = [];
    
    context.pendingJoins.forEach(join => {
      let isConditionalInSwitch = false;
      const switchEdges = [];
      const otherEdges = [];
      
      join.edges.forEach(edge => {
        if (!edge.from) {
          otherEdges.push(edge);
          return;
        }
        
        // Check if this edge's source is from a conditional inside a switch
        const fromNodeInfo = nodeInfos.find(n => n.id === edge.from);
        if (fromNodeInfo && switchRelatedNodes.has(edge.from)) {
          // Check if this is part of a conditional (has decision shape)
          if (fromNodeInfo.node.includes('{')) {  // Decision node
            isConditionalInSwitch = true;
            switchEdges.push(edge);
          } else {
            otherEdges.push(edge);
          }
        } else {
          otherEdges.push(edge);
        }
      });
      
      if (isConditionalInSwitch && switchEdges.length > 0) {
        conditionalInSwitchJoins.push({ edges: switchEdges });
      }
      
      if (otherEdges.length > 0) {
        remainingJoins.push({ edges: otherEdges });
      }
    });
    
    // Handle conditional branches inside switch cases
    // They should connect to the break statement in the same case or to the next statement after the switch
    conditionalInSwitchJoins.forEach(join => {
      let targetId = 'END';
      
      // Find the switch and case this conditional belongs to
      for (const [switchId, endIndex] of switchEndIndices.entries()) {
        // Find if any edge in this join comes from inside this switch
        const edgeFromThisSwitch = join.edges.some(edge => {
          // Check if the edge's source is within the range of this switch
          const sourceIndex = nodeInfos.findIndex(n => n.id === edge.from);
          const switchStartIndex = switchStartNodes.get(switchId);
          
          if (sourceIndex !== -1 && switchStartIndex !== undefined && endIndex !== undefined) {
            return sourceIndex >= switchStartIndex && sourceIndex <= endIndex;
          }
          return false;
        });
        
        if (edgeFromThisSwitch) {
          // Look for break statements in this switch block
          // We need to find the appropriate break for the case that contains this conditional
          let foundBreak = false;
          
          // Find the range of the case that contains this conditional
          const sourceIndex = nodeInfos.findIndex(n => n.id === join.edges[0].from); // Use first edge as reference
          
          // Find the case node that contains this conditional
          let caseStartIndex = -1;
          for (let i = switchStartNodes.get(switchId); i <= sourceIndex && i <= endIndex; i++) {
            if (nodeInfos[i].node.includes('case ') || nodeInfos[i].node.includes('default:')) {
              // Check if this case contains our source by looking for the next case/break
              let nextBoundaryIndex = i + 1;
              for (let j = i + 1; j <= endIndex + 1 && j < nodeInfos.length; j++) {
                if (nodeInfos[j].node.includes('case ') || nodeInfos[j].node.includes('default:') || nodeInfos[j].node.includes('break;')) {
                  nextBoundaryIndex = j;
                  break;
                }
              }
              
              if (sourceIndex >= i && sourceIndex < nextBoundaryIndex) {
                caseStartIndex = i;
                break;
              }
            }
          }
          
          if (caseStartIndex !== -1) {
            // Now find the break statement in this specific case
            for (let i = caseStartIndex + 1; i <= endIndex && i < nodeInfos.length; i++) {
              if (nodeInfos[i].node.includes('break;')) {
                // Check if this break is within the same case (before the next case starts)
                let nextCaseIndex = -1;
                for (let j = caseStartIndex + 1; j <= endIndex && j < nodeInfos.length; j++) {
                  if (nodeInfos[j].node.includes('case ') || nodeInfos[j].node.includes('default:')) {
                    nextCaseIndex = j;
                    break;
                  }
                }
                
                if (nextCaseIndex === -1 || i < nextCaseIndex) {
                  // This break is in the same case as our conditional
                  targetId = nodeInfos[i].id;
                  foundBreak = true;
                  break;
                }
              }
            }
          }
          
          if (!foundBreak) {
            // If no break found in the specific case, look for any break in the switch
            for (let i = switchStartNodes.get(switchId); i <= endIndex && i < nodeInfos.length; i++) {
              const nodeInfo = nodeInfos[i];
              if (nodeInfo.node.includes('break;')) {
                targetId = nodeInfo.id;
                foundBreak = true;
                break;
              }
            }
          }
          
          // If no break was found in the switch block, connect to next statement after switch
          if (!foundBreak) {
            const nextIndex = endIndex + 1;
            if (nextIndex < nodeInfos.length) {
              targetId = nodeInfos[nextIndex].id;
            }
          }
          
          break; // Found the switch, exit the loop
        }
      }
      
      // Connect all edges in this join to the target
      join.edges.forEach(({ from, label }) => {
        if (from) {
          // Check if this connection already exists to avoid duplicates
          const edgeExists = context.edges.some(edge => {
            if (label) {
              return edge === `${from} -->|${label}| ${targetId}`;
            } else {
              return edge === `${from} --> ${targetId}`;
            }
          });
          
          if (!edgeExists) {
            if (label) {
              context.addEdge(from, targetId, label);
            } else {
              context.addEdge(from, targetId);
            }
          }
        }
      });
    });
    
    // Update pendingJoins with remaining joins that are not from conditionals inside switches
    context.pendingJoins = remainingJoins;
  }

  // Handle switch break statements properly
  // They should connect to the next statement after the switch block, not to the end node
  
  // Always check for break statements, even if there are no pending joins
  let hasSwitchBreaks = false;
  const breakNodeIds = new Set();
  
  // Look for break statements in the nodes
  context.nodes.forEach(node => {
    const match = node.match(/^(N\d+)\["break;"\]/);
    if (match) {
      breakNodeIds.add(match[1]);
      hasSwitchBreaks = true;
    }
  });
  
  // Handle switch break statements even if there are no pending joins
  if (hasSwitchBreaks) {
    
    // Check if any pending joins are from break statements
    context.pendingJoins.forEach((join, index) => {
      join.edges.forEach((edge, edgeIndex) => {
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
            let inSwitchBlock = true;
            
            for (let i = switchIndex + 1; i < nodeInfos.length; i++) {
              const nodeInfo = nodeInfos[i];
              const nodeId = nodeInfo.id;
              
              // Check if we're still in the switch block
              if (inSwitchBlock) {
                // Check if this node marks the end of the switch block
                if (nodeInfo.node.includes('break;')) {
                  // This is a break statement, check if it's the last one in the switch
                  // For now, we'll assume we're still in the switch block
                } else if (!nodeInfo.node.includes('case ') && 
                          !nodeInfo.node.includes('default:') &&
                          !nodeInfo.node.includes('switch')) {
                  // Check if this node is connected from within the switch
                  const isConnectedFromSwitch = context.edges.some(edge => {
                    const fromMatch = edge.match(/^(N\d+) -->/);
                    if (fromMatch) {
                      const fromId = fromMatch[1];
                      // Check if the from node is part of the switch
                      const fromNode = nodeInfos.find(n => n.id === fromId);
                      if (fromNode) {
                        return fromNode.node.includes('case ') || 
                               fromNode.node.includes('default:') ||
                               fromNode.node.includes('break;');
                      }
                    }
                    return false;
                  });
                  
                  if (!isConnectedFromSwitch) {
                    // This node is not connected from within the switch, so it's after the switch
                    inSwitchBlock = false;
                    nextStatementId = nodeId;
                    break;
                  }
                }
              } else {
                // We're outside the switch block, this is the next statement
                nextStatementId = nodeId;
                break;
              }
            }
            
            // Connect break statement pending joins to the next statement after switch (or END if no next statement)
            // Filter pending joins to only include those from break statements
            const breakJoins = [];
            const remainingJoins = [];
            
            context.pendingJoins.forEach(join => {
              const breakEdges = [];
              const otherEdges = [];
              
              join.edges.forEach(edge => {
                if (breakNodeIds.has(edge.from)) {
                  breakEdges.push(edge);
                } else {
                  otherEdges.push(edge);
                }
              });
              
              if (breakEdges.length > 0) {
                breakJoins.push({ edges: breakEdges });
              }
              
              if (otherEdges.length > 0) {
                remainingJoins.push({ edges: otherEdges });
              }
            });
            
            // Connect break statement pending joins to the next statement after switch, or to END if no next statement
            breakJoins.forEach(join => {
              const target = nextStatementId || 'END';  // Default to END if no next statement found
              join.edges.forEach(({ from, label }) => {
                if (!from) return;
                if (label) {
                  context.addEdge(from, target, label);
                } else {
                  context.addEdge(from, target);
                }
              });
            });
            
            // Keep remaining pending joins for later processing
            context.pendingJoins = remainingJoins;
          });
        }
      }
    }
  }
  
  // Handle special marker values in pending breaks
  if (context.pendingBreaks && context.pendingBreaks.length > 0) {
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
    
    context.pendingBreaks.forEach((breakInfo, index) => {
      // If the break was supposed to connect to NEXT_AFTER_SWITCH, 
      // find the actual next statement and connect to it
      if (breakInfo.nextStatementId === 'NEXT_AFTER_SWITCH') {
        // Find the actual next statement after the switch
        // Look for the first node that comes after all the switch-related nodes
        let nextStatementId = 'END';
        
        // For each switch statement, find the first statement after it that's not part of the switch
        if (switchPositions.length > 0) {
          // Find which switch this break belongs to by looking at edges
          // We'll use a simple approach: find the switch that's closest before this break node
          const breakNodeIndex = nodeInfos.findIndex(nodeInfo => nodeInfo.id === breakInfo.breakId);
          if (breakNodeIndex !== -1) {
            // Look backwards from the break to find the most recent switch
            for (let i = breakNodeIndex - 1; i >= 0; i--) {
              if (nodeInfos[i].node.includes('switch')) {
                // Found the switch for this break
                const switchIndex = i;
                const switchId = nodeInfos[switchIndex].id;
                
                // Find all nodes that are part of this specific switch
                const caseEdges = context.edges.filter(edge => 
                  edge.startsWith(`${switchId} -->`)
                );
                
                // Find the last switch-related node for this specific switch
                let lastSwitchNodeIndex = switchIndex;
                
                // Find all nodes that are part of this switch by tracking the case branches
                // Start with the switch node
                const switchRelatedNodes = new Set([switchId]);
                
                // Find all nodes that connect directly from the switch (the cases and default)
                const directlyConnected = [];
                context.edges.forEach(edge => {
                  const match = edge.match(/^(N\d+) --> (N\d+)/);
                  if (match && match[1] === switchId) {
                    const targetId = match[2];
                    directlyConnected.push(targetId);
                    switchRelatedNodes.add(targetId); // Add the case/default nodes
                  }
                });
                
                // For each directly connected node (case/default), find all nodes in its execution path
                directlyConnected.forEach(caseId => {
                  const caseIndex = nodeInfos.findIndex(n => n.id === caseId);
                  if (caseIndex !== -1) {
                    // From this case node, follow the linear path until we hit a break or reach a node that's already processed
                    for (let k = caseIndex + 1; k < nodeInfos.length; k++) {
                      const currentInfo = nodeInfos[k];
                      
                      // Check if there's an edge from the previous node to this one
                      const prevId = k > 0 ? nodeInfos[k-1]?.id : null;
                      if (prevId && context.edges.some(edge => 
                        edge === `${prevId} --> ${currentInfo.id}`
                      )) {
                        // This is part of the linear execution path from the case
                        switchRelatedNodes.add(currentInfo.id);
                        
                        // If this is a break statement, stop following this path
                        if (currentInfo.node.includes('break;')) {
                          break;
                        }
                      } else {
                        // No linear connection, stop following this path
                        break;
                      }
                    }
                  }
                });
                
                // Find the highest index among switch-related nodes
                for (let i = switchIndex + 1; i < nodeInfos.length; i++) {
                  if (switchRelatedNodes.has(nodeInfos[i].id)) {
                    lastSwitchNodeIndex = i;
                  } else {
                    // Once we find a non-switch node, we can stop looking
                    break;
                  }
                }
                
                // The next statement is the one after the last switch-related node
                if (lastSwitchNodeIndex + 1 < nodeInfos.length) {
                  nextStatementId = nodeInfos[lastSwitchNodeIndex + 1].id;
                } else {
                  // If there's no statement after the switch, connect to END
                  nextStatementId = 'END';
                }
                
                break; // Found the switch for this break, exit the loop
              }
            }
          }
        }
        
        // Only add the edge if nextStatementId is not a marker and not the same as breakId
        if (nextStatementId !== 'NEXT_AFTER_SWITCH' && nextStatementId !== breakInfo.breakId) {
          context.addEdge(breakInfo.breakId, nextStatementId);
        }
      } else {
        // Connect to the specified next statement
        // Only add the edge if nextStatementId is not a marker
        const targetStatementId = breakInfo.nextStatementId || 'END';
        if (targetStatementId !== 'NEXT_AFTER_SWITCH' && targetStatementId !== breakInfo.breakId) {
          context.addEdge(breakInfo.breakId, targetStatementId);
        }
      }
    });
    context.pendingBreaks = [];
  }
  
  // Remove any edges that contain NEXT_AFTER_SWITCH as this is just a marker
  context.edges = context.edges.filter(edge => !edge.includes('NEXT_AFTER_SWITCH'));
  
  // Handle any nodes that have NEXT_AFTER_SWITCH as their last property
  // These should connect to the actual next statement or END
  if (context.last === 'NEXT_AFTER_SWITCH') {
    // Find the actual next statement after all switch-related nodes
    let nextStatementId = 'END';
    
    if (context.nodes && context.nodeOrder.length > 0) {
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
        // Use the last switch position to find the next statement
        const lastSwitchIndex = switchPositions[switchPositions.length - 1];
        
        // Find all case statements that connect from this switch
        const switchId = nodeInfos[lastSwitchIndex].id;
        const caseEdges = context.edges.filter(edge => 
          edge.startsWith(`${switchId} -->`)
        );
        
        // Find the last switch-related node by checking all nodes after the switch
        let lastSwitchNodeIndex = lastSwitchIndex;
        
        // Look for all nodes that are part of this switch
        for (let i = lastSwitchIndex + 1; i < nodeInfos.length; i++) {
          const nodeInfo = nodeInfos[i];
          const nodeId = nodeInfo.id;
          
          // Check if this node is part of the switch
          // A node is part of the switch if:
          // 1. It explicitly contains switch-related keywords
          // 2. It's connected from a case/default node
          // 3. It comes after a case/default but before a break
          const isSwitchRelated = 
            nodeInfo.node.includes('case ') || 
            nodeInfo.node.includes('default:') ||
            nodeInfo.node.includes('break;') ||
            caseEdges.some(edge => edge.includes(`--> ${nodeId}`)) ||
            // Check if this node comes after a case/default but before a break
            (i > lastSwitchIndex && i < nodeInfos.length - 1 && 
             (() => {
               // Look backwards to see if we're in a case block
               for (let j = i - 1; j > lastSwitchIndex; j--) {
                 const prevNodeInfo = nodeInfos[j];
                 if (prevNodeInfo.node.includes('break;')) {
                   // Found a break before this node, so this node is not part of a case
                   return false;
                 }
                 if (prevNodeInfo.node.includes('case ') || prevNodeInfo.node.includes('default:')) {
                   // Found a case/default before this node, so this node is part of a case
                   return true;
                 }
               }
               return false;
             })());
          
          if (isSwitchRelated) {
            lastSwitchNodeIndex = i;
          } else {
            // Once we find a non-switch node, we can stop looking
            break;
          }
        }
        
        // The next statement is the one after the last switch-related node
        if (lastSwitchNodeIndex + 1 < nodeInfos.length) {
          nextStatementId = nodeInfos[lastSwitchNodeIndex + 1].id;
        }
      }
    }
    
    // Set the context last to the next statement
    context.last = nextStatementId;
  }
  
  // Handle JavaScript switch merge nodes
  // Connect the switch merge node to the next statement after the switch
  // This section is now obsolete since we connect break statements directly to next statement

  // If we still have pending joins, resolve them to the end node
  if (context.pendingJoins && context.pendingJoins.length > 0) {
    const joins = context.pendingJoins.splice(0);
    joins.forEach(join => {
      join.edges.forEach(({ from, label }) => {
        if (!from) return;
        if (label) {
          context.addEdge(from, 'END', label);
        } else {
          context.addEdge(from, 'END');
        }
      });
    });
  }

  // Complete any remaining if statements
  while (context.ifStack && context.ifStack.length > 0) {
    if (typeof context.completeIf === 'function') {
      context.completeIf();
    } else {
      // Fallback if completeIf is not available
      context.ifStack.pop();
    }
  }

  // Note: pendingBreaks should be empty here if completeSwitch was called properly
  // Only connect breaks that are still pending (shouldn't happen in normal flow)
  if (context.pendingBreaks && context.pendingBreaks.length > 0) {
    context.pendingBreaks.forEach(breakInfo => {
      // Connect orphaned breaks directly to end
      context.addEdge(breakInfo.breakId, 'END');
    });
    context.pendingBreaks = [];
  }

  // Note: Default case without break also needs to connect to next statement
  // But only if there are no pending joins (which would handle this connection)
  // Find the last statement in the default case and connect it to the next statement after the switch
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
    
    // For each switch statement, connect the default case to the next statement
    if (switchPositions.length > 0) {
      switchPositions.forEach(switchIndex => {
        // Find all case statements that connect from this switch
        const switchId = nodeInfos[switchIndex].id;
        const caseEdges = context.edges.filter(edge => 
          edge.startsWith(`${switchId} -->`)
        );
        
        // Find the default case node
        let defaultNodeIndex = -1;
        let lastSwitchNodeIndex = switchIndex;
        
        // Look for all nodes that are part of this switch
        for (let i = switchIndex + 1; i < nodeInfos.length; i++) {
          const nodeInfo = nodeInfos[i];
          const nodeId = nodeInfo.id;
          
          // Check if this node is part of the switch
          const isSwitchRelated = 
            nodeInfo.node.includes('case ') || 
            nodeInfo.node.includes('default:') ||
            nodeInfo.node.includes('break;') ||
            caseEdges.some(edge => edge.includes(`--> ${nodeId}`)) ||
            // Check if this node comes after a case/default but before a break
            (i > switchIndex && i < nodeInfos.length - 1 && 
             (() => {
               // Look backwards to see if we're in a case block
               for (let j = i - 1; j > switchIndex; j--) {
                 const prevNodeInfo = nodeInfos[j];
                 if (prevNodeInfo.node.includes('break;')) {
                   // Found a break before this node, so this node is not part of a case
                   return false;
                 }
                 if (prevNodeInfo.node.includes('case ') || prevNodeInfo.node.includes('default:')) {
                   // Found a case/default before this node, so this node is part of a case
                   return true;
                 }
               }
               return false;
             })());
        
          if (nodeInfo.node.includes('default:')) {
            defaultNodeIndex = i;
          }
          
          if (isSwitchRelated) {
            lastSwitchNodeIndex = i;
          } else {
            // Once we find a non-switch node, we can stop looking
            break;
          }
        }
        
        // The next statement is the one after the last switch-related node
        if (lastSwitchNodeIndex + 1 < nodeInfos.length) {
          const nextStatementId = nodeInfos[lastSwitchNodeIndex + 1].id;
          
          // If we found a default case, connect it to the next statement
          if (defaultNodeIndex !== -1) {
            const defaultNodeId = nodeInfos[defaultNodeIndex].id;
            // Find the last statement in the default case
            let lastDefaultStatementIndex = defaultNodeIndex;
            for (let i = defaultNodeIndex + 1; i <= lastSwitchNodeIndex; i++) {
              const nodeInfo = nodeInfos[i];
              // If this is not a break statement, it's part of the default case
              if (!nodeInfo.node.includes('break;')) {
                lastDefaultStatementIndex = i;
              } else {
                // Found a break, stop here
                break;
              }
            }
            
            // Connect the last statement in the default case to the next statement
            const lastDefaultStatementId = nodeInfos[lastDefaultStatementIndex].id;
            // Only connect if it's not already connected to END or the next statement
            if (lastDefaultStatementId !== nextStatementId) {
              // Check if already connected to END to avoid duplicate connections
              const isConnectedToEnd = context.edges.some(edge => 
                edge.startsWith(`${lastDefaultStatementId} -->`) && edge.includes('END')
              );
              const isConnectedToNext = context.edges.some(edge => 
                edge.startsWith(`${lastDefaultStatementId} -->`) && edge.includes(nextStatementId)
              );
              
              if (!isConnectedToEnd && !isConnectedToNext) {
                context.addEdge(lastDefaultStatementId, nextStatementId);
              }
            }
          }
        } else {
          // If there's no statement after the switch, default case should connect to END
          if (defaultNodeIndex !== -1) {
            const defaultNodeId = nodeInfos[defaultNodeIndex].id;
            // Find the last statement in the default case
            let lastDefaultStatementIndex = defaultNodeIndex;
            for (let i = defaultNodeIndex + 1; i <= lastSwitchNodeIndex; i++) {
              const nodeInfo = nodeInfos[i];
              // If this is not a break statement, it's part of the default case
              if (!nodeInfo.node.includes('break;')) {
                lastDefaultStatementIndex = i;
              } else {
                // Found a break, stop here
                break;
              }
            }
            
            // Connect the last statement in the default case to END
            const lastDefaultStatementId = nodeInfos[lastDefaultStatementIndex].id;
            // Check if already connected to END to avoid duplicate connections
            const isConnectedToEnd = context.edges.some(edge => 
              edge.startsWith(`${lastDefaultStatementId} -->`) && edge.includes('END')
            );
            
            if (!isConnectedToEnd) {
              context.addEdge(lastDefaultStatementId, 'END');
            }
          }
        }
      });
    }
    
    // Ensure the very last statement in the flow connects to END
    // This is a simple approach: find the last node in the flow
    if (nodeInfos.length > 0) {
      // Find the last node in the flow
      const lastNodeInfo = nodeInfos[nodeInfos.length - 1];
      if (lastNodeInfo && lastNodeInfo.id !== 'END') {
        // Check if this node is already connected to END
        const isConnectedToEnd = context.edges.some(edge => 
          edge.startsWith(`${lastNodeInfo.id} -->`) && edge.includes('END')
        );
        
        // If not connected to END, connect it
        if (!isConnectedToEnd) {
          context.addEdge(lastNodeInfo.id, 'END');
        }
      }
    }
  }

  // Handle function call connections to subgraphs
  if (context.functionCalls && context.subgraphIds) {
    context.functionCalls.forEach(call => {
      const { callId, functionName } = call;
      
      if (functionName && context.subgraphIds[functionName]) {
        // Create connection between function call and its subgraph
        const subgraphId = context.subgraphIds[functionName];
        // Add a connection between the function call node and the subgraph
        context.edges.push(`${callId} -.-> ${subgraphId}`);
      }
    });
  }

  // Return the predefined END node
  return 'END';
}