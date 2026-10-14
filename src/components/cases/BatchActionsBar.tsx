import React from 'react';
import { Download, Archive, Trash2, Play, X, CheckSquare } from 'lucide-react';
import { Button } from '../ui/Button';

interface BatchActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchExport: () => void;
  onBatchAnalyze: () => void;
  onBatchArchive: () => void;
  onBatchDelete: () => void;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBatchExport,
  onBatchAnalyze,
  onBatchArchive,
  onBatchDelete
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface/95 backdrop-blur-xl border border-border-hairline rounded-pill px-5 py-2.5 shadow-2xl flex items-center gap-3.5 animate-slide-up text-xs">
      <div className="flex items-center gap-2 pr-2 border-r border-border-hairline font-mono text-primary">
        <CheckSquare className="w-4 h-4 text-accent" />
        <span className="font-semibold">{selectedCount}</span> cases selected
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onBatchAnalyze}
          className="text-xs py-1 px-3 border-border-hairline hover:border-border-subtle text-primary"
        >
          <Play className="w-3.5 h-3.5 mr-1 text-status-completed" />
          Batch Analyze
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onBatchExport}
          className="text-xs py-1 px-3 border-border-hairline hover:border-border-subtle text-primary"
        >
          <Download className="w-3.5 h-3.5 mr-1 text-accent" />
          Batch Export
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onBatchArchive}
          className="text-xs py-1 px-3 border-border-hairline hover:border-border-subtle text-primary"
        >
          <Archive className="w-3.5 h-3.5 mr-1" />
          Archive
        </Button>

        <Button
          type="button"
          size="sm"
          variant="danger"
          onClick={onBatchDelete}
          className="text-xs py-1 px-3"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Delete
        </Button>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="p-1 rounded-full text-muted hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
        title="Deselect all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
