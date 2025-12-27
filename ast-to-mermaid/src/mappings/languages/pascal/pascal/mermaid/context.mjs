import { mapNodePascal } from '../map-node-pascal.mjs';
import { shapes } from "./shapes.mjs";

let nodeId = 1;

export function ctx() {
  // Reset nodeId for each new context
  nodeId = 1;
  
  const context = {
    nodes: [],
    edges: [],
    last: null,
    switchEndNodes: [],
    pendingBreaks: [],
    currentSwitchId: null,
    inLoop: false,
    loopContinueNode: null,
    deferredStatements: [],
    // If statement tracking
    ifStack: [],
    // Case statement tracking
    caseStack: [],
    // Track case end nodes for proper connectivity
    caseEndNodes: [],
    // Track the node that comes after a case statement
    nextAfterCase: null,
    
    next() {
      return `N${nodeId++}`;
    },
    
    add(id, label) {
      console.log('Adding node:', id, label);
      this.nodes.push(`${id}${label}`);
    },
    
    addEdge(from, to, label = null) {
      console.log('Adding edge:', from, to, label);
      if (label) {
        this.edges.push(`${from} -- ${label} --> ${to}`);
      } else {
        this.edges.push(`${from} --> ${to}`);
      }
    },
    
    setLast(id) {
      console.log('Setting last node:', id);
      this.last = id;
    },
    
    // Handler function for the walker
    handle(node) {
      console.log('Context handling node:', node.type);
      if (node && node.type) {
        // Use the mapping function to add nodes to the context
        mapNodePascal(node, this);
      }
    },
    
    // If statement management
    registerIf(conditionId, hasElse) {
      console.log('Registering if statement:', conditionId, hasElse);
      const frame = {
        conditionId,
        hasElse,
        then: { started: false, last: null },
        else: { started: false, last: null },
        activeBranch: null
      };
      this.ifStack.push(frame);
    },
    
    currentIf() {
      return this.ifStack[this.ifStack.length - 1] || null;
    },
    
    enterBranch(type) {
      const frame = this.currentIf();
      if (!frame) return;
      frame.activeBranch = type === 'else' ? 'else' : 'then';
    },
    
    exitBranch(type) {
      const frame = this.currentIf();
      if (!frame) return;
      if (frame.activeBranch === type) {
        frame.activeBranch = null;
      }
    },
    
    handleBranchConnection(nodeId, { skipEdge = false } = {}) {
      const frame = this.currentIf();
      if (!frame || !frame.activeBranch) {
        return false;
      }

      const branchInfo = frame[frame.activeBranch];
      if (!skipEdge) {
        if (!branchInfo.started) {
          const label = frame.activeBranch === 'then' ? 'Yes' : 'No';
          this.addEdge(frame.conditionId, nodeId, label);
        } else if (branchInfo.last) {
          this.addEdge(branchInfo.last, nodeId);
        }
      }

      branchInfo.started = true;
      branchInfo.last = nodeId;
      return true;
    },
    
    completeIf() {
      const frame = this.ifStack.pop();
      console.log('Completing if statement:', frame);
      if (!frame) return null;
      this.queueJoinForFrame(frame);
      
      // Check if this if was inside a parent if's branch
      const parentFrame = this.currentIf();
      if (parentFrame && parentFrame.activeBranch) {
        const parentBranch = parentFrame[parentFrame.activeBranch];
        // If the parent branch's last node is this if's condition,
        // it means this if was the first statement in the parent's branch.
        // Update the parent branch to have no single last node since joins are queued.
        if (parentBranch.last === frame.conditionId) {
          parentBranch.last = null;
        }
      }
      
      // Don't leave ctx.last pointing to this if's condition node
      // because that would cause the parent to think the branch ends at the condition
      // Instead, set it to null to indicate no single last node (joins are queued)
      this.last = null;
      
      return frame;
    },
    
    queueJoinForFrame(frame) {
      const edges = [];

      if (frame.then.last) {
        edges.push({ from: frame.then.last, label: null });
      } else {
        edges.push({ from: frame.conditionId, label: 'Yes' });
      }

      if (frame.hasElse) {
        if (frame.else.last) {
          edges.push({ from: frame.else.last, label: null });
        } else if (frame.else.started) {
          // Else branch was started but has no last node.
          // This means it contains only control flow structures (nested ifs)
          // that have queued their own joins. Don't add an edge from condition.
        } else {
          // Else branch was never started (empty), edge from condition
          edges.push({ from: frame.conditionId, label: 'No' });
        }
      } else {
        edges.push({ from: frame.conditionId, label: 'No' });
      }

      this.pendingJoins = this.pendingJoins || [];
      this.pendingJoins.push({ edges });
    },
    
    resolvePendingJoins(targetId) {
      if (!this.pendingJoins || this.pendingJoins.length === 0) return false;
      const joins = this.pendingJoins.splice(0);
      joins.forEach(join => {
        join.edges.forEach(({ from, label }) => {
          if (!from) return;
          if (label) {
            this.addEdge(from, targetId, label);
          } else {
            this.addEdge(from, targetId);
          }
        });
      });
      return joins.length > 0;
    },
    
    completeBranches() {
      // Handle any remaining pending joins
      if (this.pendingJoins && this.pendingJoins.length > 0) {
        // This would be handled when connecting to the end node
      }
    },
    
    // Case statement management
    registerCase(caseId) {
      console.log('Registering case statement:', caseId);
      const frame = {
        caseId,
        options: [],
        hasElse: false,
        lastProcessed: null,
        caseEndNodes: [] // Track all nodes that end case branches
      };
      this.caseStack.push(frame);
    },
    
    currentCase() {
      return this.caseStack[this.caseStack.length - 1] || null;
    },
    
    addCaseEndNode(nodeId) {
      const frame = this.currentCase();
      if (frame && nodeId) {
        frame.caseEndNodes.push(nodeId);
        console.log('Added case end node:', nodeId, 'to case:', frame.caseId);
      }
    },
    
    completeCase() {
      const frame = this.caseStack.pop();
      console.log('Completing case statement:', frame);
      if (!frame) return null;
      
      // Store the case end nodes to be used for connectivity
      if (frame.caseEndNodes && frame.caseEndNodes.length > 0) {
        // Add all case end nodes to the main caseEndNodes array for final connection
        this.caseEndNodes = this.caseEndNodes.concat(frame.caseEndNodes);
        console.log('Case end nodes to connect:', frame.caseEndNodes);
      }
      
      // Don't leave ctx.last pointing to the case condition node
      // Set it to null to allow normal flow continuation
      this.last = null;
      
      return frame;
    },
    
    // Loop management - handle the "No" branch from loop condition to exit the loop
    completeLoop() {
      if (!this.pendingLoops || this.pendingLoops.length === 0) {
        return;
      }
      
      // Get the most recent loop
      const loop = this.pendingLoops[this.pendingLoops.length - 1];
      if (!loop) return;
      
      // Store the original last before we modify it
      const originalLastBeforeLoopEnd = this.last;
      
      // For different loop types, handle the connections differently
      if (loop.type === 'repeat-until') {
        // For repeat-until: the "No" branch continues the loop (condition is false)
        // The "Yes" branch exits the loop (condition is true)
        // The connection from body to condition is handled in the walker
        // We just need to track the exit node for proper "No" branch handling
        // For repeat-until, the next statement after the loop should not connect directly to the condition
        // Instead, the connection should only happen via the "Yes" branch
        
        // Track repeat-until loops separately
        this.repeatUntilLoops = this.repeatUntilLoops || [];
        this.repeatUntilLoops.push(loop.loopId);
      } else {
        // For For and While loops: connect end of body back to condition (Yes branch - continue loop)
        if (this.last && loop.loopId) {
          this.addEdge(this.last, loop.loopId);
        }
      }
      
      // Track the loop condition node for proper "No" branch handling
      this.loopExitNodes = this.loopExitNodes || [];
      this.loopExitNodes.push(loop.loopId);
      
      // For repeat-until, the flow continues after the condition is satisfied (Yes branch)
      // But we don't want the next statement to connect directly to the condition
      // So we need to set the last to null or handle it differently
      // Actually, we should still set the condition as the last node so that
      // the "Yes" branch logic works properly in the flowchart
      this.last = loop.loopId;
      
      // Remove the processed loop
      this.pendingLoops.pop();
      
      // Clear loop-specific context
      this.inLoop = false;
      this.loopContinueNode = null;
      
      console.log('Completing loop:', loop);
    },
    
    // Enter loop body to handle "Yes" branch connection
    enterLoopBody(loopConditionId) {
      const frame = {
        conditionId: loopConditionId,
        started: false,
        last: null
      };
      this.loopStack = this.loopStack || [];
      this.loopStack.push(frame);
      // Track that we're entering a loop body to handle first connection specially
      this.inFirstLoopBodyNode = true;
      console.log('Entering loop body:', loopConditionId);
    },
    
    // Enter repeat-until loop body (different handling)
    enterRepeatUntilLoopBody(loopConditionId) {
      const frame = {
        conditionId: loopConditionId,
        started: false,
        last: null
      };
      this.loopStack = this.loopStack || [];
      this.loopStack.push(frame);
      // Track that we're entering a repeat-until loop body to handle connections specially
      this.inRepeatUntilBody = true;
      console.log('Entering repeat-until loop body:', loopConditionId);
    },
    
    // Exit loop body
    exitLoopBody() {
      const frame = this.loopStack && this.loopStack.pop();
      this.inFirstLoopBodyNode = false;
      this.inRepeatUntilBody = false;
      console.log('Exiting loop body:', frame);
    },
    
    // Get current loop frame
    currentLoop() {
      return this.loopStack && this.loopStack[this.loopStack.length - 1] || null;
    },
    
    // Handle connection within loop body
    handleLoopConnection(nodeId) {
      const frame = this.currentLoop();
      if (!frame) return false;
      
      if (!frame.started) {
        // First node in the loop body - connect condition to body with "Yes" label
        // Check if there's already a connection we need to replace
        this.addEdge(frame.conditionId, nodeId, 'Yes');
      } else if (frame.last) {
        // Subsequent nodes in the loop body - connect sequentially
        this.addEdge(frame.last, nodeId);
      }
      
      frame.started = true;
      frame.last = nodeId;
      this.inFirstLoopBodyNode = false; // No longer the first node
      return true;
    },
    
    emit() {
      // Handle empty flowcharts
      if (this.nodes.length === 0) {
        return [
          'flowchart TD',
          '  START(["start"])',
          '  END(["end"])',
          '  START --> END'
        ].join('\n');
      }

      // Build the flowchart
      const lines = ['flowchart TD'];
      
      // Add start node
      lines.push('  START(["start"])');
      
      // Add all nodes
      this.nodes.forEach(node => {
        lines.push(`  ${node}`);
      });
      
      // Add end node
      lines.push('  END(["end"])');
      
      // Add edges
      if (this.nodes.length > 0) {
        // Connect start to first node
        const firstNodeId = this.nodes[0].split('[')[0];
        lines.push(`  START --> ${firstNodeId}`);
        
        // Process edges, removing duplicates where there's both a regular and labeled connection
        // between the same nodes
        // First, determine which special connections will be added for repeat-until loops
        const specialRepeatUntilConnections = [];
        if (this.loopExitNodes && this.loopExitNodes.length > 0) {
          this.loopExitNodes.forEach(loopConditionId => {
            // Check if this is a repeat-until loop to handle branches differently
            const isRepeatUntil = this.repeatUntilLoops && this.repeatUntilLoops.includes(loopConditionId);
            
            if (isRepeatUntil) {
              // For repeat-until: "No" branch should go back to the body (continue loop)
              const bodyNodeThatConnectsToCondition = this.edges
                .map(edge => {
                  const match = edge.match(/(\w+) --> (\w+)/);
                  return match && match[2] === loopConditionId ? match[1] : null;
                })
                .find(node => node !== null);
              
              if (bodyNodeThatConnectsToCondition) {
                // "No" branch from condition back to body (continue loop)
                specialRepeatUntilConnections.push(`${loopConditionId} -- No --> ${bodyNodeThatConnectsToCondition}`);
              }
              
              // For repeat-until, the "Yes" branch (exit) should go to the next statement
              const nextStatement = this.edges
                .map(edge => {
                  const match = edge.match(/(\w+) --> (\w+)/);
                  return match && match[1] === loopConditionId && match[2] !== bodyNodeThatConnectsToCondition ? match[2] : null;
                })
                .find(node => node !== null);
                
              if (nextStatement) {
                // "Yes" branch from condition to next statement (exit loop)
                specialRepeatUntilConnections.push(`${loopConditionId} -- Yes --> ${nextStatement}`);
              } else {
                // If no next statement found, connect "Yes" branch to END
                specialRepeatUntilConnections.push(`${loopConditionId} -- Yes --> END`);
              }
            }
          });
        }
        
        // Combine original edges with special connections for duplicate detection
        const allEdges = [...this.edges, ...specialRepeatUntilConnections];
        
        // Now process edges, removing duplicates where there's both a regular and labeled connection
        const processedEdges = [];
        const edgePairs = new Set(); // To track "from--to" pairs that have labeled connections
        
        // First, identify which pairs have labeled connections in ALL edges (original + special)
        for (const edge of allEdges) {
          const labeledMatch = edge.match(/^(\w+) -- (.+?) --> (\w+)$/); // Labeled edges like "A -- Yes --> B"
          if (labeledMatch) {
            const from = labeledMatch[1];
            const to = labeledMatch[3];
            edgePairs.add(`${from}--${to}`);
          }
        }
        
        // Add original edges, skipping unlabeled ones that have labeled counterparts
        for (const edge of this.edges) {
          const unlabeledMatch = edge.match(/^(\w+) --> (\w+)$/); // Unlabeled edges like "A --> B"
          if (unlabeledMatch) {
            const from = unlabeledMatch[1];
            const to = unlabeledMatch[2];
            // Skip unlabeled edges if there's a labeled version of the same pair
            if (!edgePairs.has(`${from}--${to}`)) {
              processedEdges.push(edge);
            }
          } else {
            // It's a labeled edge or different format, add it
            processedEdges.push(edge);
          }
        }
        
        // Add the special repeat-until connections that we calculated
        specialRepeatUntilConnections.forEach(edge => {
          processedEdges.push(edge);
        });
        
        // Add all processed edges
        processedEdges.forEach(edge => {
          lines.push(`  ${edge}`);
        });
        
        // Handle loop connections: connect "No" branch from condition to END or next statement
        // For completed loops, we track their condition nodes to ensure proper "No" branches
        if (this.loopExitNodes && this.loopExitNodes.length > 0) {
          this.loopExitNodes.forEach(loopConditionId => {
            // Check if this is a repeat-until loop to handle branches differently
            const isRepeatUntil = this.repeatUntilLoops && this.repeatUntilLoops.includes(loopConditionId);
            
            if (!isRepeatUntil) {
              // For other loops: "No" branch goes to END or next statement
              // Connect the "No" branch from loop condition to END
              // Only add if this edge doesn't already exist
              const edgeExists = processedEdges.some(edge => 
                edge.includes(`${loopConditionId} -- No -->`)
              );
              if (!edgeExists) {
                lines.push(`  ${loopConditionId} -- No --> END`);
              }
            }
            // For repeat-until loops, connections are handled in the edge processing logic
          });
        }
        
        // Connect all case branch ends to the next statement after case if it exists,
        // otherwise connect to END
        if (this.caseEndNodes && this.caseEndNodes.length > 0) {
          console.log('Connecting case end nodes to next statement or END:', this.caseEndNodes);
          
          // Check if there are statements after the case by looking for nodes that are not 
          // case-related and come after the case branches in the sequence
          // For now, if there are nodes after the case end nodes, connect to the next available node
          const lastCaseNode = this.caseEndNodes[this.caseEndNodes.length - 1];
          const allNodeIds = this.nodes.map(node => node.split('[')[0]);
          
          // Find the first node that's not in caseEndNodes and comes after the last case node
          let nextNodeAfterCase = null;
          let foundLastCase = false;
          
          for (const nodeId of allNodeIds) {
            if (nodeId === lastCaseNode) {
              foundLastCase = true;
              continue;
            }
            if (foundLastCase && !this.caseEndNodes.includes(nodeId)) {
              nextNodeAfterCase = nodeId;
              break;
            }
          }
          
          if (nextNodeAfterCase) {
            // Connect all case end nodes to the next statement after case
            console.log('Connecting case end nodes to next statement:', nextNodeAfterCase);
            this.caseEndNodes.forEach(caseEndNode => {
              // Only add the connection if it doesn't already exist
              const edgeExists = this.edges.some(edge => 
                edge.includes(`${caseEndNode} --> ${nextNodeAfterCase}`)
              );
              if (!edgeExists) {
                lines.push(`  ${caseEndNode} --> ${nextNodeAfterCase}`);
              }
            });
          } else {
            // Connect all case end nodes to END
            console.log('Connecting case end nodes to END');
            this.caseEndNodes.forEach(caseEndNode => {
              // Only add the connection if it doesn't already exist
              const edgeExists = this.edges.some(edge => 
                edge.includes(`${caseEndNode} --> END`) || 
                edge.includes(`${caseEndNode} --`) && edge.includes('--> END')
              );
              if (!edgeExists) {
                lines.push(`  ${caseEndNode} --> END`);
              }
            });
          }
        } else {
          // If no case end nodes, connect the last node to END if there's no explicit edge to END
          const lastNodeId = this.nodes[this.nodes.length - 1].split('[')[0];
          const hasEdgeToEND = this.edges.some(edge => 
            edge.includes(`${lastNodeId} --> END`) || 
            edge.includes(`${lastNodeId} --`) && edge.includes('--> END')
          );
          
          // Check if this last node is part of a loop that already has exit handled
          // For example, if it's a loop body node that connects back to a condition
          const isLoopBodyNode = this.edges.some(edge => 
            edge.includes(`${lastNodeId} --> `) && 
            this.loopExitNodes && this.loopExitNodes.some(loopId => 
              edge.includes(`--> ${loopId}`)
            )
          );
          
          // For repeat-until loops, the last node in the body should connect back to condition,
          // not to END, so we need to check for repeat-until connections too
          const connectsToRepeatUntil = this.repeatUntilLoops && this.repeatUntilLoops.some(loopId => 
            this.edges.some(edge => edge.includes(`${lastNodeId} --> ${loopId}`))
          );
          
          if (!hasEdgeToEND && !isLoopBodyNode && !connectsToRepeatUntil) {
            lines.push(`  ${lastNodeId} --> END`);
          }
        }
      } else {
        // If no nodes were added, connect start directly to end
        lines.push('  START --> END');
      }
      
      return lines.join('\n');
    }
  };
  
  return context;
}