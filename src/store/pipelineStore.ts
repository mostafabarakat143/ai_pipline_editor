 

import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import type { PipelineNodeData, LogEntry, ExecutionState, NodeStatus, NodeTypeName } from '../types/pipeline';

 type PipelineNode = Node<PipelineNodeData>;

interface PipelineState {
   nodes: PipelineNode[];
  edges: Edge[];
  
   executionState: ExecutionState;
  logs: LogEntry[];
  
   nodeCounter: number;
  
   onNodesChange: (changes: NodeChange<PipelineNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => boolean;
  
  addNode: (nodeType: NodeTypeName, position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  resetAllNodeStatus: () => void;
  
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  setExecutionState: (state: ExecutionState) => void;
  
   validateConnection: (connection: Connection) => { valid: boolean; message?: string };
  getExecutionOrder: () => string[] | null;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  nodes: [],
  edges: [],
  executionState: 'idle',
  logs: [],
  nodeCounter: 0,

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    const { validateConnection, addLog } = get();
    const validation = validateConnection(connection);
    
    if (!validation.valid) {
      addLog({
        message: validation.message || 'Invalid connection',
        type: 'error',
      });
      return false;
    }

    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { strokeWidth: 2 },
        },
        state.edges
      ),
    }));

    addLog({
      message: `Connected nodes successfully`,
      type: 'info',
    });

    return true;
  },

  addNode: (nodeType, position) => {
    set((state) => {
      const newCounter = state.nodeCounter + 1;
      const instanceId = `${nodeType.toLowerCase().replace(' ', '-')}-${newCounter}`;
      
      const newNode: PipelineNode = {
        id: instanceId,
        type: 'pipelineNode',
        position,
        data: {
          label: `${nodeType} ${newCounter}`,
          nodeType,
          status: 'idle',
          instanceId,
        },
      };

      return {
        nodes: [...state.nodes, newNode],
        nodeCounter: newCounter,
      };
    });

    get().addLog({
      message: `Added "${nodeType}" node to canvas`,
      type: 'info',
    });
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    }));
  },

  setNodeStatus: (nodeId, status) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, status } }
          : node
      ),
    }));
  },

  resetAllNodeStatus: () => {
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'idle' as NodeStatus },
      })),
    }));
  },

  addLog: (log) => {
    const entry: LogEntry = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      logs: [...state.logs, entry],
    }));
  },

  clearLogs: () => {
    set({ logs: [] });
  },

  setExecutionState: (executionState) => {
    set({ executionState });
  },

  validateConnection: (connection) => {
    const {  edges } = get();
    
    // Prevent self-connections
    if (connection.source === connection.target) {
      return { valid: false, message: 'Cannot connect a node to itself' };
    }

    // Check if connection already exists
    const existingEdge = edges.find(
      (e) => e.source === connection.source && e.target === connection.target
    );
    if (existingEdge) {
      return { valid: false, message: 'Connection already exists' };
    }

     const targetHasInput = edges.some((e) => e.target === connection.target);
    if (targetHasInput) {
      return { valid: false, message: 'Node already has an input connection' };
    }

     const sourceHasOutput = edges.some((e) => e.source === connection.source);
    if (sourceHasOutput) {
      return { valid: false, message: 'Node already has an output connection' };
    }

     const wouldCreateCycle = () => {
      const visited = new Set<string>();
      const stack = [connection.target];

      while (stack.length > 0) {
        const current = stack.pop()!;
        if (current === connection.source) {
          return true;
        }
        if (visited.has(current)) continue;
        visited.add(current);

        const outgoingEdges = edges.filter((e) => e.source === current);
        for (const edge of outgoingEdges) {
          stack.push(edge.target);
        }
      }
      return false;
    };

    if (wouldCreateCycle()) {
      return { valid: false, message: 'Connection would create a cycle' };
    }

    return { valid: true };
  },

  getExecutionOrder: () => {
    const { nodes, edges } = get();
    
    if (nodes.length === 0) return null;

     const adjacency: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    
    nodes.forEach((node) => {
      adjacency[node.id] = [];
      inDegree[node.id] = 0;
    });

    edges.forEach((edge) => {
      adjacency[edge.source].push(edge.target);
      inDegree[edge.target]++;
    });

     const queue: string[] = [];
    const result: string[] = [];

     Object.entries(inDegree).forEach(([nodeId, degree]) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      for (const neighbor of adjacency[current]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

     if (result.length !== nodes.length) {
      return null;
    }

    return result;
  },
}));
