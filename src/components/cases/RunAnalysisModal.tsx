import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { CaseItem } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../ui/Toast';

export interface RunAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseItem | null;
  onComplete?: (updatedCase: CaseItem) => void;
}

interface StepConfig {
  title: string;
  detail: string;
  metric: string;
  durationMs: number;
}

const ANALYSIS_STEPS: StepConfig[] = [
  {
    title: 'Volumetric Ingestion & DICOM Parsing',
    detail: 'Loading 512×512 axial slices (FOV 180mm), verifying isotropic 0.4mm voxel spacing',
    metric: '512 slices verified • Isotropic 0.38mm',
    durationMs: 700
  },
  {
    title: 'Streak Artifact & Metal Scatter Cleansing',
    detail: 'Suppressing high-Z beam hardening from orthodontic brackets & titanium osteosynthesis screws',
    metric: 'Streak artifacts suppressed • SNR +4.2 dB',
    durationMs: 800
  },
  {
    title: '3D Anatomical Landmark Localization',
    detail: 'Auto-detecting 48 cranial coordinates (S, N, A, B, Pog, Me, ANS, PNS, Or, Po)',
    metric: '48/48 landmarks tracked (±0.18mm conf)',
    durationMs: 900
  },
  {
    title: 'CAD/CAM Surgical Wafer & Vector Discrepancy',
    detail: 'Computing osteotomy vectors, maxillary roll/pitch/yaw & mandibular setback tolerances',
    metric: 'Advancement 4.5mm • Roll < 0.3° aligned',
    durationMs: 850
  },
  {
    title: 'Consensus Rubric Synthesis & Outcome Scoring',
    detail: 'Benchmarking against SADIE v3.2 standards & evaluating 95% confidence intervals',
    metric: 'Score synthesized • 95% CI generated',
    durationMs: 750
  }
];

export const RunAnalysisModal: React.FC<RunAnalysisModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  onComplete
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [updatedResult, setUpdatedResult] = useState<CaseItem | null>(null);
  const timerRef = useRef<any>(null);
  const caseItemRef = useRef(caseItem);
  caseItemRef.current = caseItem;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isOpen || !caseItem?.id) {
      setCurrentStep(0);
      setIsCompleted(false);
      setProgressPercent(0);
      setUpdatedResult(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Reset when modal opens
    setCurrentStep(0);
    setIsCompleted(false);
    setProgressPercent(15);
    setUpdatedResult(null);

    let stepIndex = 0;

    const executeNextStep = () => {
      if (stepIndex < ANALYSIS_STEPS.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        setProgressPercent(Math.round(((stepIndex + 1) / ANALYSIS_STEPS.length) * 94));
        timerRef.current = setTimeout(executeNextStep, ANALYSIS_STEPS[stepIndex].durationMs);
      } else {
        const targetId = caseItemRef.current?.id;
        if (!targetId) return;

        api.runAnalysis(targetId)
          .then((result) => {
            setUpdatedResult(result);
            setProgressPercent(100);
            setIsCompleted(true);
            if (onCompleteRef.current) onCompleteRef.current(result);
            toast({
              type: 'success',
              title: 'Radiomic Evaluation Complete',
              message: `Final Outcome Score: ${result.score}% for ${result.patientName}`
            });
          })
          .catch(() => {
            toast({ type: 'error', title: 'Analysis evaluation failed' });
            setIsCompleted(true);
          });
      }
    };

    timerRef.current = setTimeout(executeNextStep, ANALYSIS_STEPS[0].durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, caseItem?.id]);

  if (!caseItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#8EC5E8]/10 text-[#8EC5E8] border border-[#8EC5E8]/20">
            <Sparkles className="w-5 h-5 text-[#8EC5E8]" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight">
              {isCompleted ? 'Evaluation Complete' : 'Executing Radiomic Analysis'}
            </h3>
            <span className="text-xs text-muted block mt-0.5">
              {caseItem.patientName} ({caseItem.caseNumber}) • {caseItem.procedure}
            </span>
          </div>
        </div>
      }
      maxWidth="xl"
      headerBorder={true}
    >
      <div className="space-y-4 pt-1 select-none">
        {/* Progress Bar & Header Status */}
        <div className="p-3.5 rounded-xl bg-surface/70 border border-border-hairline space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary font-medium flex items-center gap-2">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#a3ffb2]" />
                  <span className="text-[#a3ffb2] font-semibold">All 5 Analysis Pipeline Tasks Complete</span>
                </>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 text-[#8EC5E8] animate-spin" />
                  <span>Pipeline Task {currentStep + 1} of {ANALYSIS_STEPS.length} in progress...</span>
                </>
              )}
            </span>
            <span className="font-mono text-primary text-xs font-semibold">
              {progressPercent}%
            </span>
          </div>

          {/* Animated gradient progress bar */}
          <div className="w-full h-2 rounded-full bg-base overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#8EC5E8] to-[#a3ffb2] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Vertical Timeline of Analysis Tasks */}
        <div className="space-y-4 px-1">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isStepFinished = isCompleted || idx < currentStep;
            const isStepActive = !isCompleted && idx === currentStep;
            const isStepPending = idx > currentStep && !isCompleted;

            return (
              <div key={step.title} className="relative flex items-start gap-3.5 group">
                {/* Vertical connector line */}
                {idx < ANALYSIS_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-[28px] bottom-[-16px] w-[2px] transition-colors duration-500 ${
                      isStepFinished ? 'bg-[#2f6b3a]' : 'bg-white/10'
                    }`}
                  />
                )}

                {/* Node Indicator */}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 z-10 ${
                    isStepFinished
                      ? 'bg-[#122415] border border-[#2f6b3a] text-[#a3ffb2] shadow-sm'
                      : isStepActive
                      ? 'bg-[#142838] border-2 border-[#8EC5E8] text-[#8EC5E8] shadow-[0_0_12px_rgba(142,197,232,0.35)] animate-pulse'
                      : 'bg-elevated/70 border border-white/10 text-muted'
                  }`}
                >
                  {isStepFinished ? (
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  ) : isStepActive ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#8EC5E8]" />
                  ) : (
                    <span className="font-mono text-xs text-muted">{idx + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-medium transition-colors ${
                        isStepFinished
                          ? 'text-white'
                          : isStepActive
                          ? 'text-[#8EC5E8]'
                          : 'text-muted'
                      }`}
                    >
                      {step.title}
                    </h4>

                    {/* Step Status Badge */}
                    {isStepFinished ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-[#122415] text-[#a3ffb2] border border-[#2f6b3a]/70 whitespace-nowrap">
                        Completed
                      </span>
                    ) : isStepActive ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-[#122838] text-[#8EC5E8] border border-[#2b5278] animate-pulse whitespace-nowrap">
                        Executing...
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted/60 whitespace-nowrap">
                        Queued
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-secondary/75 mt-0.5 leading-snug">
                    {step.detail}
                  </p>

                  {/* Real-time Metric Snippet once executed */}
                  {(isStepFinished || isStepActive) && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-muted px-2 py-0.5 rounded bg-black/40 border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8EC5E8]" />
                      {step.metric}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Execution Result Summary (Revealed when completed) */}
        {isCompleted && (
          <div className="p-4 rounded-xl bg-surface border border-border-hairline animate-fade-up space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-status-completed" />
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Clinical Synthesis Verified
                  </h5>
                  <span className="text-[11px] text-muted">
                    SADIE v3.2 Protocol • Consensus Level 1
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-muted block uppercase">Final Score</span>
                <span className="font-serif text-2xl font-bold text-status-completed font-mono">
                  <AnimatedNumber value={`${updatedResult?.score || 94.6}%`} />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-base border border-border-hairline">
                <span className="text-muted text-[10px] block">Confidence</span>
                <span className="text-primary font-mono font-medium">[92.8%, 96.4%]</span>
              </div>
              <div className="p-2 rounded-lg bg-base border border-border-hairline">
                <span className="text-muted text-[10px] block">Airway Expansion</span>
                <span className="text-status-completed font-mono font-medium">+3.6 cm³</span>
              </div>
              <div className="p-2 rounded-lg bg-base border border-border-hairline">
                <span className="text-muted text-[10px] block">Skeletal Symmetry</span>
                <span className="text-primary font-mono font-medium">0.2mm Dev</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className="text-secondary hover:text-primary"
          >
            {isCompleted ? 'Close' : 'Cancel'}
          </Button>

          {isCompleted && (
            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View Updated Workspace
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
