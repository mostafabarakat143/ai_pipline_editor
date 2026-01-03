import { useCallback, useRef } from 'react';
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '../../lib/utils';
import { usePipelineStore } from '../../store/pipelineStore';
import { PipelineNode } from './PipelineNode';
import type { NodeTypeName, PipelineNodeData } from '../../types/pipeline';

const nodeTypes = { pipelineNode: PipelineNode };

function PipelineCanvasInner({ className }: { className?: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = usePipelineStore();

  const onDragOver = useCallback((event: React.DragEvent) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow') as NodeTypeName;
    if (!nodeType) return;
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    addNode(nodeType, position);
  }, [screenToFlowPosition, addNode]);

  return (
    <div ref={reactFlowWrapper} className={cn('h-full w-full', className)}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onDragOver={onDragOver} onDrop={onDrop} nodeTypes={nodeTypes} fitView snapToGrid snapGrid={[15, 15]} defaultEdgeOptions={{ animated: true, style: { strokeWidth: 2 } }} proOptions={{ hideAttribution: true }}>
        <Background gap={15} size={1} color="hsl(var(--border))" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} nodeColor={(node: Node<PipelineNodeData>) => {
          const status = node.data?.status;
          if (status === 'running') return 'hsl(var(--primary))';
          if (status === 'completed') return 'hsl(var(--status-completed))';
          if (status === 'error') return 'hsl(var(--status-error))';
          return 'hsl(var(--muted))';
        }} maskColor="hsl(var(--background) / 0.8)" />
      </ReactFlow>
    </div>
  );
}

export function PipelineCanvas(props: { className?: string }) {
  return <ReactFlowProvider><PipelineCanvasInner {...props} /></ReactFlowProvider>;
}
