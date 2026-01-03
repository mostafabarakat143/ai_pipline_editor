import { Play, RotateCcw, Loader2, Workflow } from 'lucide-react';
import { usePipelineExecution } from '../../hooks/usePipelineExecution';
import { usePipelineStore } from '../../store/pipelineStore';
import { Button } from '../ui/button';
  
export function PipelineHeader() {
  const { execute, reset, isRunning, executionState } = usePipelineExecution();
  const { nodes } = usePipelineStore();

  const hasNodes = nodes.length > 0;

  return (
    <header className="flex items-center justify-between px-4 border-b h-14 border-border bg-card">
      <div className="flex items-center gap-3">
         <img src="/whitebglogo.png" alt="logo" className="w-10 h-10 rounded-full " />
        
        <div>
          <h1 className="text-lg font-bold text-foreground">
            AI Pipeline Editor
          </h1>
          <p className="text-xs text-muted-foreground">
            Visual workflow builder
          </p>
        </div>
        <div className="flex items-center justify-center rounded-lg h-9 w-9 bg-primary/10">
          <Workflow className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-2">
         <Button
          variant="outline"
          size="sm"
          onClick={reset}
          disabled={isRunning || !hasNodes}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

         <Button
          size="sm"
          onClick={execute}
          disabled={isRunning || !hasNodes}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Execute
            </>
          )}
        </Button>

         {executionState !== 'idle' && (
          <div
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              executionState === 'running'
                ? 'bg-primary/20 text-primary'
                : executionState === 'completed'
                ? 'bg-status-completed/20 text-status-completed'
                : 'bg-status-error/20 text-status-error'
            }`}
          >
            {executionState === 'running'
              ? 'Executing...'
              : executionState === 'completed'
              ? 'Completed'
              : 'Failed'}
          </div>
        )}
      </div>
    </header>
  );
}
