import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  RotateCcw,
  Check,
  Loader2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CaseItem } from '../../types';
import { useToast } from '../ui/Toast';

interface ExecutionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseItem | null;
  onRerun?: (caseItem: CaseItem) => void;
}

export const ExecutionDetailsModal: React.FC<ExecutionDetailsModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  onRerun
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!caseItem) return null;

  const handleOpenCase = () => {
    onClose();
    navigate(`/cases/${caseItem.id}`);
  };

  const handleRerun = () => {
    toast({
      type: 'info',
      title: 'Inference Re-Run Initiated',
      message: `Re-running evaluation for ${caseItem.caseNumber}...`
    });
    if (onRerun) {
      onRerun(caseItem);
    }
  };

  const phases = [
    'Ingestion & DICOM Parsing',
    'Phase Segmentation',
    'Critical View of Safety Audit',
    'Governance & NSQIP Synthesis'
  ];

  const getPhaseIcon = (index: number) => {
    if (caseItem.status === 'failed') {
      if (index === 3) {
        return <span className="w-2.5 h-2.5 rounded-full bg-[#C8623C] shrink-0" />;
      }
      return <Check className="w-3.5 h-3.5 text-[#4E9A4B] shrink-0" strokeWidth={2.5} />;
    }

    if (caseItem.status === 'processing') {
      if (index === 2) {
        return <Loader2 className="w-3.5 h-3.5 text-[#E58A3A] shrink-0 animate-spin" />;
      }
      if (index > 2) {
        return <span className="w-2 h-2 rounded-full bg-white/20 shrink-0" />;
      }
      return <Check className="w-3.5 h-3.5 text-[#4E9A4B] shrink-0" strokeWidth={2.5} />;
    }

    return <Check className="w-3.5 h-3.5 text-[#4E9A4B] shrink-0" strokeWidth={2.5} />;
  };

  const confidence = caseItem.score ? `${caseItem.score}%` : '94.6%';
  const qualityScore = caseItem.score ? `${(caseItem.score / 10).toFixed(1)} / 10` : '9.5 / 10';
  const governancePassed = caseItem.status !== 'failed';
  const governanceText = governancePassed ? 'Passed' : 'Failed';
  const governanceColor = governancePassed ? 'text-[#4E9A4B]' : 'text-[#C8623C]';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Execution Details"
      description={
        <div>
          <span className="text-xs text-muted block">
            Case {caseItem.caseNumber} • {caseItem.patientName}
          </span>
          <span className="text-[11px] text-muted/80 block mt-0.5">
            Oct 11, 2026, 22:38 • 4m 6s
          </span>
        </div>
      }
      maxWidth="480"
      headerBorder={true}
    >
      <div className="select-none">
        {/* SECTION 1: PHASES */}
        <div className="py-4 border-b border-border-hairline space-y-2.5">
          {phases.map((name, idx) => (
            <div key={name} className="flex items-center gap-2.5">
              {getPhaseIcon(idx)}
              <span className="text-white text-xs sm:text-sm font-normal truncate">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* SECTION 2: RESULT METRICS */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-4 py-4 border-b border-border-hairline text-center">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs text-muted block mb-1 truncate">
              Confidence
            </span>
            <span className="font-mono text-sm sm:text-lg md:text-xl font-bold text-white block truncate">
              {confidence}
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs text-muted block mb-1 truncate">
              Quality Score
            </span>
            <span className="font-mono text-sm sm:text-lg md:text-xl font-bold text-white block truncate">
              {qualityScore}
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs text-muted block mb-1 truncate">
              Governance
            </span>
            <span className={`font-mono text-sm sm:text-lg md:text-xl font-bold ${governanceColor} block truncate`}>
              {governanceText}
            </span>
          </div>
        </div>

        {/* SECTION 3: FOOTER */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCase}
            icon={<ExternalLink className="w-3.5 h-3.5 text-black" />}
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Open Case
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRerun}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Re-run
          </Button>
        </div>
      </div>
    </Modal>
  );
};
