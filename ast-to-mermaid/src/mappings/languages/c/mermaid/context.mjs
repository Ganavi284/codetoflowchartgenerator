// Context for Mermaid diagram generation
const createState = () => ({
  nodeId: 2,        // Start from 2 since N1 is reserved for start node
  subgraphId: 1,    // Counter for subgraphs
  subgraphNodeId: 1, // Counter for subgraph nodes
});

export function ctx(sharedState = null) {
  const state = sharedState || createState();

  const context = {
    state,
    nodes: [],
    edges: [],
    last: null,
    switchEndNodes: [],
    pendingBreaks: [],
    pendingLoops: [],
    currentSwitchId: null,
    inLoop: false,
    loopContinueNode: null,
    deferredStatements: [],
    ifStack: [],
    pendingJoins: [],
    functionMap: {}, // Map of function names to their definitions
    subgraphIds: {}, // Map of function names to their subgraph IDs
    
    next() {
      return `N${state.nodeId++}`;
    },

    nextSubgraphId() {
      return `SG${state.subgraphId++}`;
    },
    
    nextSubgraphNode() {
      // Use a separate counter for subgraph nodes
      if (!state.subgraphNodeId) {
        state.subgraphNodeId = 1;
      }
      return `SGN${state.subgraphNodeId++}`;
    },
    
    add(id, label) {
      this.nodes.push(`${id}${label}`);
    },
    
    addEdge(from, to, label = null) {
      if (label) {
        this.edges.push(`${from} -- ${label} --> ${to}`);
      } else {
        this.edges.push(`${from} --> ${to}`);
      }
    },
    
    setLast(id) {
      this.last = id;
    },

    fork() {
      return ctx(state);
    },

    addRaw(line) {
      this.nodes.push(line);
    },

    addSubgraph(label, lines = []) {
      this.nodes.push(`subgraph ${label}`);
      lines.forEach(line => this.nodes.push(`  ${line}`));
      this.nodes.push('end');
    },

    // Add function to create connections between function calls and definitions
    createFunctionConnections() {
      // First handle explicitly stored function calls
      if (this.functionCalls && this.subgraphIds) {
        this.functionCalls.forEach(callInfo => {
          const functionName = callInfo.functionName;
          const callId = callInfo.callId;
          
          if (this.subgraphIds[functionName]) {
            const subgraphId = this.subgraphIds[functionName];
            // Add a bidirectional connection from the function call to the subgraph
            this.edges.push(`${callId} <--> ${subgraphId}`);
          }
        });
      }
      
      // Then scan through all nodes to find function calls in node texts
      if (this.subgraphIds && this.nodes) {
        // Create a map of function names to subgraph IDs for quick lookup
        const functionRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
        
        this.nodes.forEach(nodeLine => {
          // Check if this is a regular node (not a subgraph declaration)
          if (nodeLine.startsWith('N') && !nodeLine.startsWith('subgraph')) {
            // Extract the node ID (e.g., N5)
            const nodeIdMatch = nodeLine.match(/^N\d+/);
            if (nodeIdMatch) {
              const nodeId = nodeIdMatch[0];
              
              // Look for function calls in the node text
              const nodeText = nodeLine.substring(nodeId.length);
              let match;
              while ((match = functionRegex.exec(nodeText)) !== null) {
                const functionName = match[1];
                
                // Skip common C functions that are not user-defined
                if (['if', 'for', 'while', 'switch', 'return', 'break', 'continue', 'sizeof'].includes(functionName)) {
                  continue;
                }
                
                // Check if this is a user-defined function
                if (this.subgraphIds[functionName]) {
                  const subgraphId = this.subgraphIds[functionName];
                  // Add a bidirectional connection from the node to the subgraph
                  this.edges.push(`${nodeId} <--> ${subgraphId}`);
                }
              }
            }
          }
        });
      }
    },

    completeBranches() {
      // Placeholder for legacy calls. Branch handling now occurs via join queue.
    },

    // --- If handling helpers ------------------------------------------------
    registerIf(conditionId, hasElse) {
      const frame = {
        conditionId,
        hasElse,
        then: { started: false, last: null },
        else: { started: false, last: null },
        activeBranch: null
      };
      this.ifStack.push(frame);
      return frame;
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
      if (!frame || !frame.activeBranch) return false;

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
      this.last = nodeId;
      return true;
    },

    completeIf() {
      const frame = this.ifStack.pop();
      if (!frame) return null;
      
      // Check if we're currently inside a loop
      const insideLoop = this.inLoop && this.loopContinueNode;
      
      if (insideLoop) {
        // If we're inside a loop, queue joins back to the loop condition
        // instead of to the next statement
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
          } else {
            edges.push({ from: frame.conditionId, label: 'No' });
          }
        } else {
          edges.push({ from: frame.conditionId, label: 'No' });
        }
        
        // Add all edges to loop back to the loop condition
        edges.forEach(edge => {
          if (edge.from && this.loopContinueNode) {
            this.addEdge(edge.from, this.loopContinueNode);
          }
        });
        
        // Set the last node to the loop condition so the loop continues properly
        this.last = this.loopContinueNode;
        
        // Mark that the loop continuation has been handled to prevent duplicate connection
        if (!this.loopContinuationHandled) {
          this.loopContinuationHandled = new Set();
        }
        this.loopContinuationHandled.add(this.loopContinueNode);
      } else {
        // Normal case: queue joins for frame to next statement
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
      }
      
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

    completeSwitch() {
      // Collect all edges that should connect to the next statement after switch
      const edges = [];
      
      // Current switch level is the length of switchEndNodes array minus 1
      // (since we push a placeholder when entering switch)
      const currentSwitchLevel = (this.switchEndNodes?.length || 1) - 1;
      
      // Track break IDs for this switch level to avoid duplicate connections
      const currentSwitchBreakIds = new Set();
      
      // Add pending breaks from this switch level
      if (this.pendingBreaks && this.pendingBreaks.length > 0) {
        const switchBreaks = this.pendingBreaks.filter(
          b => b.switchLevel === currentSwitchLevel
        );
        
        // Record break IDs for this switch level
        switchBreaks.forEach(b => currentSwitchBreakIds.add(b.breakId));
        
        // Remove processed breaks
        this.pendingBreaks = this.pendingBreaks.filter(
          b => b.switchLevel !== currentSwitchLevel
        );
        
        // Add break edges
        switchBreaks.forEach(b => {
          edges.push({ from: b.breakId, label: null });
        });
      }
      
      // Add the last node if it exists and is not already a break statement
      // (default case without break, or last case without break)
      if (this.last && !currentSwitchBreakIds.has(this.last)) {
        edges.push({ from: this.last, label: null });
      }
      
      // Queue all edges as pending joins
      if (edges.length > 0) {
        this.pendingJoins.push({ edges });
      }
      
      // Pop the switch end node placeholder
      if (this.switchEndNodes && this.switchEndNodes.length > 0) {
        this.switchEndNodes.pop();
      }
      
      // Clear the current switch ID but preserve last pointer for proper flow
      this.currentSwitchId = null;
      // Don't clear this.last - it's needed for connecting to next statement
    },
    
    completeLoop() {
      // Connect the end of the loop body back to the loop condition
      // Get the most recent pending loop
      let loopInfo = null;
      if (this.pendingLoops && this.pendingLoops.length > 0) {
        loopInfo = this.pendingLoops[this.pendingLoops.length - 1];
        
        // Handle do-while loops differently from while/for loops
        if (loopInfo.type === 'do-while') {
          // For do-while: the body was processed first, now we connect back to the condition
          // The condition node was already created in the mapping function
          // Connect the end of the body back to the condition
          if (this.last && loopInfo.loopId) {
            this.addEdge(this.last, loopInfo.loopId);
          }
          
          // Update the last pointer to the condition node so next statement connects properly
          this.last = loopInfo.loopId;
        } else {
          // Handle while/for loops normally
          // Check if loop continuation has already been handled (e.g., by nested conditionals)
          const alreadyHandled = this.loopContinuationHandled && 
                            this.loopContinuationHandled.has(loopInfo.loopId);
          
          if (this.last && loopInfo.loopId && !alreadyHandled) {
            this.addEdge(this.last, loopInfo.loopId);
          }
          
          // Update the last pointer to the loop condition node
          // This ensures that the next statement connects from the loop as a whole
          this.last = loopInfo.loopId;
        }
        
        // Remove the processed loop
        this.pendingLoops.pop();
      }
      
      // Clear loop-specific context
      this.inLoop = false;
      this.loopContinueNode = null;
      
      // Clean up the loop continuation handling tracking
      if (this.loopContinuationHandled && loopInfo) {
        this.loopContinuationHandled.delete(loopInfo.loopId);
        // Clean up the set if it's empty
        if (this.loopContinuationHandled.size === 0) {
          this.loopContinuationHandled = null;
        }
      }
    },
    
    emit() {
      // Create function connections before emitting
      this.createFunctionConnections();
      
      return [
        'flowchart TD',
        ...this.nodes,
        ...this.edges
      ].join('\n');
    }
  };
  
  return context;
}