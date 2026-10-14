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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#16171d]/95 backdrop-blur-xl border border-white/20 rounded-pill px-5 py-2.5 shadow-2xl flex items-center gap-3.5 animate-slide-up text-xs">
      <div className="flex items-center gap-2 pr-2 border-r border-white/10 font-mono text-white">
        <CheckSquare className="w-4 h-4 text-[#8EC5E8]" />
        <span className="font-semibold">{selectedCount}</span> cases selected
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onBatchAnalyze}
          className="text-xs py-1 px-3 border-white/20 hover:border-white/40"
        >
          <Play className="w-3.5 h-3.5 mr-1 text-[#a3ffb2]" />
          Batch Analyze
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onBatchExport}
          className="text-xs py-1 px-3 border-white/20 hover:border-white/40"
        >
          <Download className="w-3.5 h-3.5 mr-1 text-[#8EC5E8]" />
          Batch Export
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onBatchArchive}
          className="text-xs py-1 px-3 border-white/20 hover:border-white/40"
        >
          <Archive className="w-3.5 h-3.5 mr-1" />
          Archive
        </Button>

        <Button
          type="button"
          size="sm"
          variant="danger"
          onClick={onBatchDelete}
          className="text-xs py-1 px-3 bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/60"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Delete
        </Button>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="p-1 rounded-full text-muted hover:text-white hover:bg-elevated transition-colors cursor-pointer"
        title="Deselect all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
