import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { PipelineHeader } from './PipelineHeader';
import { NodePalette } from './NodePalette';
import { PipelineCanvas } from './PipelineCanvas';
import { ExecutionLogs } from './ExecutionLogs';

export function PipelineEditor() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-background">
      <PipelineHeader />
      <div className="relative flex flex-1 overflow-hidden">
        <aside className={cn('relative shrink-0 border-r border-border transition-all duration-300', leftPanelOpen ? 'w-64' : 'w-0')}>{leftPanelOpen && <NodePalette className="absolute inset-0" />}</aside>
        <main className="relative flex-1 overflow-hidden">
          <Button variant="ghost" size="icon" className="absolute z-10 w-8 h-8 rounded-full shadow-md left-2 top-2 bg-card hover:bg-secondary" onClick={() => setLeftPanelOpen(!leftPanelOpen)}>{leftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}</Button>
          <Button variant="ghost" size="icon" className="absolute z-10 w-8 h-8 rounded-full shadow-md right-2 top-2 bg-card hover:bg-secondary" onClick={() => setRightPanelOpen(!rightPanelOpen)}>{rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}</Button>
          <PipelineCanvas />
        </main>
        <aside className={cn('relative shrink-0 border-l border-border transition-all duration-300', rightPanelOpen ? 'w-80' : 'w-0')}>{rightPanelOpen && <ExecutionLogs className="absolute inset-0" />}</aside>
      </div>
    </div>
  );
}
