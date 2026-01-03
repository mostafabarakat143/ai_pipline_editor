import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { usePipelineStore } from '../../store/pipelineStore';
import { ScrollArea } from '../ui/scroll-area';
import type { LogEntry } from '../../types/pipeline';

interface ExecutionLogsProps {
  className?: string;
}

function LogEntryItem({ log }: { log: LogEntry }) {
  const typeStyles = {
    info: 'text-muted-foreground',
    success: 'text-status-completed',
    error: 'text-status-error',
    warning: 'text-node-model',
  };

  return (
    <div className={cn('animate-slide-in py-1.5', typeStyles[log.type])}>
      <div className="flex items-start gap-2">
        <span className="text-xs shrink-0 text-muted-foreground">
          {log.timestamp.toLocaleTimeString()}
        </span>
        <span className="text-sm">{log.message}</span>
      </div>
    </div>
  );
}

export function ExecutionLogs({ className }: ExecutionLogsProps) {
  const { logs } = usePipelineStore();
  const scrollRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <div className={cn('flex h-full flex-col bg-sidebar', className)}>
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Execution Logs</h2>
        <p className="text-sm text-muted-foreground">
          {logs.length === 0 ? 'No logs yet' : `${logs.length} entries`}
        </p>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-sm">
              Execute the pipeline to see logs here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <LogEntryItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
