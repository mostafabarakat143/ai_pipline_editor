 import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { Database, Sparkles, Brain, HardDrive, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NODE_TYPE_CONFIGS } from '../../types/pipeline';
import type { PipelineNodeData, NodeTypeName } from '../../types/pipeline';
import { usePipelineStore } from '../../store/pipelineStore';

const ICONS: Record<NodeTypeName, React.ElementType> = {
  'Data Source': Database,
  'Transformer': Sparkles,
  'Model': Brain,
  'Sink': HardDrive,
};


type PipelineNodeType = Node<PipelineNodeData>;

function PipelineNodeComponent({ id, data, selected }: NodeProps<PipelineNodeType>) {
  const { removeNode, executionState } = usePipelineStore();
  const config = NODE_TYPE_CONFIGS[data.nodeType];
  const Icon = ICONS[data.nodeType];

  const statusBorderClasses = { idle: 'border-border', running: 'border-primary', completed: 'border-status-completed', error: 'border-status-error' };
  const statusClasses = { idle: '', running: 'node-running', completed: 'node-completed', error: 'node-error' };

  return (
    <div className={cn('relative min-w-[180px] rounded-lg border-2 bg-card shadow-lg transition-all duration-200', statusBorderClasses[data.status], statusClasses[data.status], selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background')}>
      {executionState !== 'running' && (
        <button onClick={(e) => { e.stopPropagation(); removeNode(id); }} className="absolute z-10 flex items-center justify-center w-5 h-5 transition-opacity rounded-full opacity-0 -right-2 -top-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 group-hover:opacity-100" style={{ opacity: selected ? 1 : undefined }}>
          <X className="w-3 h-3" />
        </button>
      )}
      <Handle type="target" position={Position.Left} className="!-left-1.5" />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-md', config.bgClass)} style={{ borderColor: `hsl(${config.color})` }}>
            <Icon className="w-4 h-4" style={{ color: `hsl(${config.color})` }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground">{data.nodeType}</p>
            <p className="text-sm font-semibold text-foreground">{data.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('h-2 w-2 rounded-full', data.status === 'idle' && 'bg-muted-foreground', data.status === 'running' && 'bg-primary animate-pulse', data.status === 'completed' && 'bg-status-completed', data.status === 'error' && 'bg-status-error')} />
          <span className="text-xs capitalize text-muted-foreground">{data.status}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!-right-1.5" />
    </div>
  );
}

export const PipelineNode = memo(PipelineNodeComponent);
