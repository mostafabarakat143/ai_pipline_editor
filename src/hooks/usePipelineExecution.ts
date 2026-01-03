/**
 * usePipelineExecution Hook
 * Handles pipeline execution simulation with proper async handling
 */

import { useCallback } from 'react';
import { usePipelineStore } from '../store/pipelineStore';
import type { NodeTypeName } from '../types/pipeline';

// Simulated processing messages for each node type
const PROCESSING_MESSAGES: Record<NodeTypeName, (label: string) => string> = {
  'Data Source': (label) => `"${label}" processed 100 records`,
  'Transformer': (label) => `"${label}" applied feature scaling transformation`,
  'Model': (label) => `"${label}" generated predictions for 100 samples`,
  'Sink': (label) => `"${label}" saved results to database`,
};

// Processing delay per node (ms)
const NODE_PROCESSING_DELAY = 1500;

export function usePipelineExecution() {
  const {
    nodes,
    executionState,
    getExecutionOrder,
    setNodeStatus,
    resetAllNodeStatus,
    addLog,
    clearLogs,
    setExecutionState,
  } = usePipelineStore();

  const execute = useCallback(async () => {
    // Validate pipeline has nodes
    if (nodes.length === 0) {
      addLog({
        message: 'Pipeline is empty. Add some nodes first.',
        type: 'warning',
      });
      return;
    }

    // Get execution order
    const executionOrder = getExecutionOrder();
    
    if (!executionOrder) {
      addLog({
        message: 'Invalid pipeline: contains cycles or disconnected nodes',
        type: 'error',
      });
      return;
    }

    // Start execution
    clearLogs();
    resetAllNodeStatus();
    setExecutionState('running');
    // 🚀
    addLog({
      message: ' Pipeline execution started',
      type: 'info',
    });

    try {
      // Execute nodes in order
      for (const nodeId of executionOrder) {
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        // Set node as running
        setNodeStatus(nodeId, 'running');
        
        addLog({
          message: `▶ Processing "${node.data.label}"...`,
          nodeId,
          type: 'info',
        });

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, NODE_PROCESSING_DELAY));

        // Simulate random error (10% chance for demo)
        const shouldError = Math.random() < 0.1;
        
        if (shouldError) {
          setNodeStatus(nodeId, 'error');
          addLog({
            message: `✗ Error in "${node.data.label}": Simulated processing failure`,
            nodeId,
            type: 'error',
          });
          setExecutionState('error');
          addLog({
            message: '❌ Pipeline execution failed',
            type: 'error',
          });
          return;
        }

        // Set node as completed
        setNodeStatus(nodeId, 'completed');
        
        const processingMessage = PROCESSING_MESSAGES[node.data.nodeType];
        addLog({
          message: `✓ ${processingMessage(node.data.label)}`,
          nodeId,
          type: 'success',
        });
      }

      // All nodes completed successfully
      setExecutionState('completed');
      addLog({
        message: '✅ Pipeline execution completed successfully!',
        type: 'success',
      });
    } catch (error) {
      setExecutionState('error');
      addLog({
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      });
    }
  }, [nodes, getExecutionOrder, setNodeStatus, resetAllNodeStatus, addLog, clearLogs, setExecutionState]);

  const reset = useCallback(() => {
    resetAllNodeStatus();
    clearLogs();
    setExecutionState('idle');
  }, [resetAllNodeStatus, clearLogs, setExecutionState]);

  return {
    execute,
    reset,
    isRunning: executionState === 'running',
    executionState,
  };
}
