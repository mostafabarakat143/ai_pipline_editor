import { Database, Sparkles, Brain, HardDrive, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNodeTypes } from '../../hooks/useNodeTypes';
import { NODE_TYPE_CONFIGS } from '../../types/pipeline';
import type { NodeTypeName } from '../../types/pipeline';
import { Button } from '../ui/button';

const ICONS: Record<NodeTypeName, React.ElementType> = {
  'Data Source': Database,
  'Transformer': Sparkles,
  'Model': Brain,
  'Sink': HardDrive,
};

interface NodePaletteProps {
  className?: string;
}

export function NodePalette({ className }: NodePaletteProps) {
  const { nodeTypes, isLoading, error, refetch } = useNodeTypes();

  const onDragStart = (event: React.DragEvent, nodeType: NodeTypeName) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={cn('flex h-full flex-col bg-sidebar p-4', className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Node Palette</h2>
        <p className="text-sm text-muted-foreground">
          Drag nodes to the canvas
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading node types...</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Node list */}
      {!isLoading && !error && (
        <div className="flex flex-col gap-2">
          {nodeTypes.map((nodeType) => {
            const config = NODE_TYPE_CONFIGS[nodeType.name];
            const Icon = ICONS[nodeType.name];

            return (
              <div
                key={nodeType.id}
                draggable
                onDragStart={(e) => onDragStart(e, nodeType.name)}
                className={cn(
                  'group flex cursor-grab items-center gap-3 rounded-lg border-2 border-border bg-card p-3 transition-all duration-200',
                  'hover:border-primary hover:shadow-md hover:shadow-primary/10',
                  'active:cursor-grabbing'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md transition-transform group-hover:scale-110',
                    config.bgClass
                  )}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: `hsl(${config.color})` }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{nodeType.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      <div className="pt-4 mt-auto border-t border-border">
        <p className="text-xs text-muted-foreground">
          {/* 💡  */}
          <strong>Tip:</strong> Connect nodes by dragging from output (right) to input (left) handles.
        </p>
      </div>
    </div>
  );
}
