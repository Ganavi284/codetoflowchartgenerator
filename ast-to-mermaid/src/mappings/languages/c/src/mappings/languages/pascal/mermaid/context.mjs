// Context for Mermaid diagram generation
let nodeId = 2; // Start from 2 since N1 is reserved for start node

// Import the mapping function
import { mapNodePascal } from '../map-node-pascal.mjs';

export function ctx() {
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
    
    next() {
      return `N${nodeId++}`;
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
    
    // Handler function for the walker
    handle(node) {
      if (node && node.type) {
        // Use the mapping function to add nodes to the context
        mapNodePascal(node, this);
      }
    },
    
    // If statement management
    registerIf(conditionId, hasElse) {
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

      // Handle then branch
      if (frame.then.last) {
        // Connect from the last node in the then branch
        edges.push({ from: frame.then.last, label: null });
      } else {
        // Connect directly from the condition with "Yes" label
        edges.push({ from: frame.conditionId, label: 'Yes' });
      }

      // Handle else branch
      if (frame.hasElse) {
        if (frame.else.last) {
          // Connect from the last node in the else branch
          edges.push({ from: frame.else.last, label: null });
        } else {
          // Connect directly from the condition with "No" label
          edges.push({ from: frame.conditionId, label: 'No' });
        }
      } else {
        // No else branch, connect directly from condition with "No" label
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
    
    completeLoop() {
      // Connect the end of the loop body back to the loop condition
      // Get the most recent pending loop
      if (this.pendingLoops && this.pendingLoops.length > 0) {
        const loopInfo = this.pendingLoops[this.pendingLoops.length - 1];
        if (this.last && loopInfo.loopId) {
          this.addEdge(this.last, loopInfo.loopId);
        }
        
        // Update the last pointer to the loop condition node
        // This ensures that the next statement connects from the loop as a whole
        this.last = loopInfo.loopId;
        
        // Remove the processed loop
        this.pendingLoops.pop();
      }
      
      // Clear loop-specific context
      this.inLoop = false;
      this.loopContinueNode = null;
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
        
        // Connect the last node to END if there are no pending joins
        // and no explicit edge to END from the last node
        const lastNodeId = this.nodes[this.nodes.length - 1].split('[')[0];
        const hasEdgeToEND = this.edges.some(edge => 
          edge.includes(`${lastNodeId} --> END`) || 
          edge.includes(`${lastNodeId} --`) && edge.includes('--> END')
        );
        
        if (!hasEdgeToEND) {
          lines.push(`  ${lastNodeId} --> END`);
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