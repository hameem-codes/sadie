import React from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, Layers, Activity } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { CaseItem } from '../../types';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { StatusPill } from '../ui/StatusPill';

interface CaseComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseA: CaseItem | null;
  caseB: CaseItem | null;
}

export const CaseComparisonModal: React.FC<CaseComparisonModalProps> = ({
  isOpen,
  onClose,
  caseA,
  caseB
}) => {
  if (!caseA || !caseB) return null;

  const metrics = [
    { label: 'Overall Consensus Score', valA: `${caseA.score || 0}%`, valB: `${caseB.score || 0}%` },
    { label: 'Procedure Type', valA: caseA.procedure, valB: caseB.procedure },
    { label: 'Surgical Stage', valA: caseA.stage, valB: caseB.stage },
    { label: 'Maxillary Advancement', valA: '+4.5 mm', valB: '+5.2 mm' },
    { label: 'Mandibular Pitch/Yaw Symmetry', valA: '0.2° pitch, 0.1° yaw', valB: '0.4° pitch, 0.3° yaw' },
    { label: 'Airway Expansion (PAS)', valA: '+4.6 cm³ (+32%)', valB: '+5.1 cm³ (+36%)' },
    { label: 'SNA / SNB Normalization', valA: 'SNA 82.1°, SNB 80.0°', valB: 'SNA 81.8°, SNB 79.4°' },
    { label: 'Analysis Status', statusA: caseA.status, statusB: caseB.status }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Side-by-Side Surgical Outcome Comparison" size="xl">
      <div className="space-y-5">
        {/* Cases Header Comparison Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-surface/70 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#8EC5E8] tracking-wider block">
              Case A
            </span>
            <h3 className="font-serif text-lg font-semibold text-white">{caseA.patientName}</h3>
            <p className="text-xs text-muted font-mono">{caseA.caseNumber} • {caseA.patientId}</p>
            <div className="pt-2 flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-[#a3ffb2]">
                <AnimatedNumber value={`${caseA.score || 0}%`} />
              </span>
              <StatusPill status={caseA.status} size="sm" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface/70 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#a3ffb2] tracking-wider block">
              Case B
            </span>
            <h3 className="font-serif text-lg font-semibold text-white">{caseB.patientName}</h3>
            <p className="text-xs text-muted font-mono">{caseB.caseNumber} • {caseB.patientId}</p>
            <div className="pt-2 flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-[#a3ffb2]">
                <AnimatedNumber value={`${caseB.score || 0}%`} />
              </span>
              <StatusPill status={caseB.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Metrics Differential Table */}
        <div className="rounded-xl border border-white/10 bg-surface/40 overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[380px] text-left text-xs">
            <thead className="border-b border-white/10 bg-surface/80 text-muted uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 w-1/3">Clinical Metric / Dimension</th>
                <th className="p-3 w-1/3 text-white font-semibold">Case A</th>
                <th className="p-3 w-1/3 text-white font-semibold">Case B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics.map((m, idx) => (
                <tr key={idx} className="hover:bg-elevated/50 transition-colors">
                  <td className="p-3 text-secondary font-medium">{m.label}</td>
                  <td className="p-3 text-white font-mono">
                    {m.statusA ? <StatusPill status={m.statusA} size="sm" /> : m.valA}
                  </td>
                  <td className="p-3 text-white font-mono">
                    {m.statusB ? <StatusPill status={m.statusB} size="sm" /> : m.valB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
