/**
 * Pipeline Types
 * Core type definitions for the AI Pipeline Editor
 */

// Node types available in the palette
export type NodeTypeName = 'Data Source' | 'Transformer' | 'Model' | 'Sink';

// API response for node types
export interface NodeTypeData {
  id: string;
  name: NodeTypeName;
}

// Node execution status
export type NodeStatus = 'idle' | 'running' | 'completed' | 'error';

// Custom data attached to each pipeline node
export interface PipelineNodeData {
  label: string;
  nodeType: NodeTypeName;
  status: NodeStatus;
  instanceId: string;
  [key: string]: unknown; // Index signature for React Flow compatibility
}

// Log entry for execution output
export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  nodeId?: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// Execution state
export type ExecutionState = 'idle' | 'running' | 'completed' | 'error';

// Node type configuration for styling and icons
export interface NodeTypeConfig {
  name: NodeTypeName;
  color: string;
  bgClass: string;
  borderClass: string;
  icon: string;
  description: string;
}

// Map of node type configurations
export const NODE_TYPE_CONFIGS: Record<NodeTypeName, NodeTypeConfig> = {
  'Data Source': {
    name: 'Data Source',
    color: 'var(--node-data-source)',
    bgClass: 'bg-node-data-source/20',
    borderClass: 'border-node-data-source',
    icon: 'Database',
    description: 'Input data provider',
  },
  'Transformer': {
    name: 'Transformer',
    color: 'var(--node-transformer)',
    bgClass: 'bg-node-transformer/20',
    borderClass: 'border-node-transformer',
    icon: 'Sparkles',
    description: 'Data transformation',
  },
  'Model': {
    name: 'Model',
    color: 'var(--node-model)',
    bgClass: 'bg-node-model/20',
    borderClass: 'border-node-model',
    icon: 'Brain',
    description: 'AI/ML model',
  },
  'Sink': {
    name: 'Sink',
    color: 'var(--node-sink)',
    bgClass: 'bg-node-sink/20',
    borderClass: 'border-node-sink',
    icon: 'HardDrive',
    description: 'Output destination',
  },
};
