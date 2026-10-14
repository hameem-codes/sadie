import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  FileSpreadsheet,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { AnimatedNumber } from '../ui/AnimatedNumber';

interface HeatmapAndReportsProps {
  isReportModalOpen: boolean;
  onCloseReportModal: () => void;
}

export const OutcomeHeatmap: React.FC = () => {
  const procedures = ['Le Fort I', 'BSSO', 'Bimaxillary', 'Genioplasty', 'ZMC Repair'];
  const domains = ['Skeletal (Bony)', 'Dental Occlusion', 'Soft Tissue Profile', 'Airway Expansion (PAS)'];

  // Matrix values representing outcome adherence percentages
  const matrix: Record<string, Record<string, number>> = {
    'Le Fort I': { 'Skeletal (Bony)': 96.4, 'Dental Occlusion': 94.8, 'Soft Tissue Profile': 92.1, 'Airway Expansion (PAS)': 91.5 },
    'BSSO': { 'Skeletal (Bony)': 95.2, 'Dental Occlusion': 97.1, 'Soft Tissue Profile': 93.4, 'Airway Expansion (PAS)': 89.8 },
    'Bimaxillary': { 'Skeletal (Bony)': 93.8, 'Dental Occlusion': 95.0, 'Soft Tissue Profile': 94.2, 'Airway Expansion (PAS)': 96.5 },
    'Genioplasty': { 'Skeletal (Bony)': 97.8, 'Dental Occlusion': 98.2, 'Soft Tissue Profile': 96.9, 'Airway Expansion (PAS)': 92.0 },
    'ZMC Repair': { 'Skeletal (Bony)': 91.5, 'Dental Occlusion': 93.0, 'Soft Tissue Profile': 90.4, 'Airway Expansion (PAS)': 88.2 }
  };

  const getHeatmapColor = (score: number) => {
    if (score >= 96) return 'bg-[#122415] text-[#a3ffb2] border border-[#2f6b3a]';
    if (score >= 93) return 'bg-[#15232d] text-[#8EC5E8] border border-[#8EC5E8]/30';
    if (score >= 90) return 'bg-elevated text-secondary border border-white/10';
    return 'bg-[#2b1717] text-[#fca582] border border-[#c8623c]/40';
  };

  return (
    <div className="p-4 rounded-xl bg-surface/50 border border-border-hairline space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#E58A3A]" />
          <h3 className="font-serif text-sm font-semibold text-white">
            Surgical Outcome Heatmap by Procedure & Anatomical Domain
          </h3>
        </div>
        <span className="text-[10px] text-muted font-mono uppercase">Clinical Rubric Standard</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted text-[10px] uppercase font-mono">
              <th className="p-2 text-left">Procedure</th>
              {domains.map((d, i) => (
                <th key={i} className="p-2 text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {procedures.map((proc) => (
              <tr key={proc} className="hover:bg-elevated/40 transition-colors">
                <td className="p-2 font-medium text-white whitespace-nowrap">{proc}</td>
                {domains.map((dom) => {
                  const score = matrix[proc][dom];
                  return (
                    <td key={dom} className="p-1.5 text-center">
                      <span className={`inline-block font-mono text-[11px] px-2 py-1 rounded font-semibold transition-all ${getHeatmapColor(score)}`}>
                        {score}%
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted font-mono pt-1">
        <span>Legend: High Adherence (≥96%)</span>
        <span className="text-[#a3ffb2]">■ &gt;96% Optimal</span>
        <span className="text-[#8EC5E8]">■ 93-95% Target</span>
        <span className="text-[#fca582]">■ &lt;90% Review</span>
      </div>
    </div>
  );
};

export const QuarterlyReportModal: React.FC<HeatmapAndReportsProps> = ({
  isReportModalOpen,
  onCloseReportModal
}) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    toast({
      type: 'success',
      title: 'Quarterly Executive Report Generated',
      message: 'Downloaded SADIE_Q3_2026_Clinical_Outcome_Report.pdf'
    });
    onCloseReportModal();
  };

  return (
    <Modal isOpen={isReportModalOpen} onClose={onCloseReportModal} title="Quarterly Maxillofacial Performance Audit" size="lg">
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-surface/70 border border-white/10 flex items-center justify-between">
          <div>
            <span className="font-semibold text-white block">Quarterly Outcome Report (Q3 2026)</span>
            <span className="text-[11px] text-muted">National Maxillofacial Quality & Safety Benchmark</span>
          </div>
          <span className="font-mono text-[10px] text-[#a3ffb2] bg-[#122415] px-2.5 py-1 rounded-pill border border-[#2f6b3a]/50">
            Audit Complete
          </span>
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-surface border border-white/5 space-y-1 text-center">
            <span className="text-[10px] text-muted font-mono uppercase block">Total Operations Evaluated</span>
            <span className="text-xl font-bold text-white font-mono">148 Cases</span>
            <span className="text-[10px] text-[#a3ffb2] font-mono block">+14% vs Q2</span>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-white/5 space-y-1 text-center">
            <span className="text-[10px] text-muted font-mono uppercase block">Hospital Consensus Score</span>
            <span className="text-xl font-bold text-[#a3ffb2] font-mono">93.8%</span>
            <span className="text-[10px] text-muted font-mono block">Top 5% Decile</span>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-white/5 space-y-1 text-center">
            <span className="text-[10px] text-muted font-mono uppercase block">Splint Fit Discrepancy</span>
            <span className="text-xl font-bold text-white font-mono">&lt; 0.28 mm</span>
            <span className="text-[10px] text-[#a3ffb2] font-mono block">Zero Complications</span>
          </div>
        </div>

        {/* Benchmark comparisons */}
        <div className="space-y-2 p-3.5 rounded-xl bg-surface/50 border border-white/5">
          <span className="font-semibold text-white block text-xs">National Registry Benchmarks</span>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-muted">
              <span>National Academic Medical Center Average:</span>
              <span className="text-white">88.4%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface border border-white/5">
              <div className="h-full bg-secondary rounded-full" style={{ width: '88.4%' }} />
            </div>

            <div className="flex justify-between text-muted pt-1">
              <span>This Hospital (SADIE Tracked):</span>
              <span className="text-[#a3ffb2] font-bold">93.8%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface border border-white/5">
              <div className="h-full bg-[#a3ffb2] rounded-full" style={{ width: '93.8%' }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onCloseReportModal} className="text-xs">
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownloadReport} className="text-xs">
            <Download className="w-3.5 h-3.5 mr-1" />
            Download Complete Audit PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
