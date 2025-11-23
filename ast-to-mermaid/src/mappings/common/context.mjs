/**
 * Dynamic node/edge registry for Mermaid flowchart generation
 * Manages node IDs, connections, and flowchart structure
 */

let nodeIdCounter = 1;

export function createContext() {
  nodeIdCounter = 1;

  return {
    nodes: [],
    nodeOrder: [],
    edges: [],
    last: null,
    lastNodeId: null,
    
    // Generate next unique node ID
    nextId() {
      return `N${nodeIdCounter++}`;
    },

    // Legacy alias used throughout the language mappers
    next() {
      return this.nextId();
    },
    
    // Add a node to the flowchart
    addNode(id, shape) {
      if (!id || !shape) return;
      this.nodes.push(`${id}${shape}`);
      this.nodeOrder.push(id);
      this.lastNodeId = id;
    },

    // Legacy alias
    add(id, shape) {
      this.addNode(id, shape);
    },
    
    // Add an edge between nodes
    addEdge(fromId, toId, label = null) {
      if (!fromId || !toId) return;
      if (label) {
        this.edges.push(`${fromId} -->|${label}| ${toId}`);
      } else {
        this.edges.push(`${fromId} --> ${toId}`);
      }
    },

    // Convenience helper for map utilities
    getLastNodeId() {
      return this.last ?? this.lastNodeId ?? null;
    },
    
    // Generate complete Mermaid flowchart
    generateMermaid() {
      const startId = 'START';
      const endId = 'END';
      
      const allNodes = [
        `${startId}(["start"])`,
        ...this.nodes,
        `${endId}(["end"])`
      ];
      
      const edges = [];
      if (this.nodeOrder.length === 0) {
        edges.push(`${startId} --> ${endId}`);
      } else {
        edges.push(`${startId} --> ${this.nodeOrder[0]}`);
        edges.push(...this.edges);
        const tailId = this.last ?? this.lastNodeId ?? this.nodeOrder[this.nodeOrder.length - 1];
        edges.push(`${tailId} --> ${endId}`);
      }
      
      return [
        'flowchart TD',
        ...allNodes,
        ...edges
      ].join('\n');
    }
  };
}