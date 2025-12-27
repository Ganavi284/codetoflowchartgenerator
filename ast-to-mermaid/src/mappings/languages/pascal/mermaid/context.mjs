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
    
    // Loop condition management
    registerLoopCondition(conditionId, loopType) {
      console.log('Registering loop condition:', conditionId, loopType);
      const frame = {
        conditionId,
        loopType,
        body: { started: false, last: null },
        active: true
      };
      this.loopStack = this.loopStack || [];
      this.loopStack.push(frame);
      return frame;
    },
    
    currentLoop() {
      if (!this.loopStack) return null;
      return this.loopStack[this.loopStack.length - 1] || null;
    },
    
    enterLoopBody() {
      const frame = this.currentLoop();
      if (!frame) return;
      frame.body.started = true;
    },
    
    exitLoop() {
      const frame = this.loopStack ? this.loopStack.pop() : null;
      if (!frame) return null;
      console.log('Exiting loop:', frame);
      return frame;
    },
    
    handleLoopBodyConnection(nodeId, { skipEdge = false } = {}) {
      const frame = this.currentLoop();
      if (!frame || !frame.active) return false;
      
      if (!skipEdge) {
        if (!frame.body.started) {
          // Connect the condition to the first body node with appropriate label
          // For 'for' and 'while' loops: condition 'Yes' branch goes to body
          // For 'repeat-until' loops: condition 'No' branch goes to body (loop continues when condition is false)
          const label = frame.loopType === 'repeat-until' ? 'No' : 'Yes';
          this.addEdge(frame.conditionId, nodeId, label);
        } else if (frame.body.last) {
          // Connect subsequent body nodes
          this.addEdge(frame.body.last, nodeId);
        }
      }
      
      frame.body.started = true;
      frame.body.last = nodeId;
      this.last = nodeId;
      return true;
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
      const loop = this.pendingLoops.pop();
      if (!loop) return;
      
      // The loop condition node should have a "No" branch to the next statement
      // This is handled in the emit method when we connect the loop condition to END
      // or to the next statement after the loop
      console.log('Completing loop:', loop);
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
        
        // Add all registered edges
        this.edges.forEach(edge => {
          lines.push(`  ${edge}`);
        });
        
        // Handle loop connections: connect "No" branch from condition to END or next statement
        if (this.pendingLoops) {
          this.pendingLoops.forEach(loop => {
            if (loop.loopId) {
              // For different loop types, handle the "No" branch differently
              // For For and While loops: condition "No" branch goes to END
              // For Repeat-Until loops: condition "Yes" branch goes to END (loop exits when condition is true)
              if (loop.type === 'repeat-until') {
                // For repeat-until, when condition is true, exit the loop
                lines.push(`  ${loop.loopId} -- Yes --> END`);
              } else {
                // For For and While loops, when condition is false, exit the loop
                lines.push(`  ${loop.loopId} -- No --> END`);
              }
            }
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
          
          if (!hasEdgeToEND) {
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