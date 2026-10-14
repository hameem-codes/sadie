import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Globe,
  CheckCircle2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
  Sparkles,
  ExternalLink,
  FileText,
  Download,
  BookOpen
} from 'lucide-react';
import { CopilotMessage } from '../../types';
import { useToast } from './Toast';
import { Modal } from './Modal';

interface ClinicalMessageViewProps {
  message: CopilotMessage;
  queryTitle?: string;
  scopedCaseName?: string;
  scopedCaseId?: string;
}

export const ClinicalMessageView: React.FC<ClinicalMessageViewProps> = ({
  message,
  queryTitle = 'Hi',
  scopedCaseName = 'Eleanor Vance-Cole',
  scopedCaseId = 'MX-2026-0891'
}) => {
  const { toast } = useToast();
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [viewingSource, setViewingSource] = useState<{
    badge: string;
    category: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const isUser = message.role === 'user';

  // USER MESSAGE VIEW: Clean, minimal user bubble without account identity
  if (isUser) {
    return (
      <div className="flex flex-col items-end my-5 animate-reply-in">
        <div className="text-xs text-muted mb-1.5 px-1 flex items-center gap-1.5">
          <span>{message.timestamp || 'Just now'}</span>
        </div>
        <div className="bg-[#1a1b22] text-white border border-white/15 rounded-2xl rounded-tr-sm px-5 py-3.5 text-base sm:text-[17px] shadow-sm max-w-[85%] leading-relaxed font-sans">
          {message.content}
        </div>
      </div>
    );
  }

  // AI MESSAGE VIEW: Direct natural conversational flow (NO CARDS), animated progressively
  const trace = message.thinkingTrace || {
    duration: '2.4s',
    searched: [
      { label: 'Patient CBCT Archive' },
      { label: 'Operative Transcription' },
      { label: 'Cephalometric Norms v3.2' },
      { label: 'NSQIP Clinical Rubric' }
    ],
    steps: [
      `Finding patient DICOM scan: ${scopedCaseName}_PostOp_CBCT.dcm...`,
      'Calculating 3D cephalometric landmarks (SNA, SNB, Pog, Menton)...',
      'Calculating airway volumetric clearance and minimum cross-sectional area...',
      'Verifying procedural benchmarks against NSQIP criteria...',
      'Synthesizing clinical evaluation decision recommendation...'
    ],
    isFinished: true
  };

  const dossier = message.clinicalDossier || {
    primarySources: [
      {
        badge: 'Op Note',
        category: 'Operative Note',
        title: 'Operative Transcription (Section 4)',
        subtitle: 'Surgical Registry • Verified'
      },
      {
        badge: 'Pathology',
        category: 'Pathology Record',
        title: 'Surgical Histopathology Report',
        subtitle: 'Pathology Accession PATH-2026-4491'
      },
      {
        badge: 'NSQIP',
        category: 'Quality Standard',
        title: 'NSQIP Quality Standard Benchmark',
        subtitle: 'National Surgical Quality Advisory'
      }
    ],
    title: `${queryTitle}: Clinical Evaluation`,
    scopedCaseName: scopedCaseName,
    scopedCaseId: scopedCaseId,
    findings: [
      {
        text: 'Adherence verified against operative transcription',
        badge: 'Op Note'
      },
      {
        text: 'Histopathology examination confirms benign tissue morphology with negative surgical margins',
        badge: 'Pathology'
      },
      {
        text: 'Procedural benchmarks remain compliant with NSQIP criteria',
        badge: 'NSQIP'
      }
    ],
    contextNote: 'Grounded in all standard dossier records and quality metrics for this case.',
    recommendation: 'Patient records reflect low complication risk (Low (2.4%)). Continue planned clinical protocol.'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${dossier.title}\n\n${dossier.recommendation}`);
    setCopied(true);
    toast({ type: 'success', title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-5 space-y-5 text-white">
      {/* 1. ASSISTANT HEADER: Direct on canvas (No card) */}
      <div
        className="flex items-center justify-between animate-reply-in"
        style={{ animationDelay: '50ms' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-serif text-sm font-bold shrink-0 shadow-sm">
            ✦
          </div>
          <span className="font-semibold text-sm text-white">SADIE</span>
          <span className="text-xs text-muted">• {message.timestamp || '12:04 AM'}</span>
        </div>
      </div>

      {/* 2. THINKING TRACE: Minimal hairline accordion in flow (No card) */}
      <div
        className="animate-reply-in border-l-2 border-white/10 pl-4 my-2.5"
        style={{ animationDelay: '120ms' }}
      >
        <button
          type="button"
          onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
          className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors cursor-pointer group"
        >
          {isThinkingExpanded ? (
            <ChevronUp className="w-4 h-4 group-hover:text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover:text-white" />
          )}
          <span className="font-mono text-sm text-secondary group-hover:text-white">
            Worked for {trace.duration || '2.4s'}
          </span>
          <span className="text-xs text-muted ml-1">
            ({trace.steps.length} reasoning steps • {isThinkingExpanded ? 'hide' : 'view trace'})
          </span>
        </button>

        {isThinkingExpanded && (
          <div className="mt-3 space-y-3 text-sm text-secondary animate-reply-in">
            {/* Searched Sources */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-muted text-xs flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-muted" /> Searched:
              </span>
              {trace.searched.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-secondary font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8EC5E8]" />
                  {s.label}
                </span>
              ))}
            </div>

            {/* Step list */}
            <div className="space-y-2 pl-1 my-2.5">
              {trace.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#8EC5E8] mt-0.5 text-xs">✓</span>
                  <span className="text-secondary leading-relaxed">{step}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-[#8EC5E8] pt-1 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Finished analysis node</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. PRIMARY SOURCES: Inline sleek pill tags (No cards!) */}
      <div
        className="animate-reply-in space-y-2.5 pt-1"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>≡ Primary Sources ({dossier.primarySources.length})</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {dossier.primarySources.map((src, i) => {
            const isOp = src.badge.toLowerCase().includes('op');
            const isPath = src.badge.toLowerCase().includes('path');
            const badgeClasses = isOp
              ? 'bg-[#8EC5E8]/15 text-[#8EC5E8] border-[#8EC5E8]/30'
              : isPath
              ? 'bg-[#F2E6C8]/15 text-[#F2E6C8] border-[#F2E6C8]/30'
              : 'bg-[#C8623C]/15 text-[#E08A68] border-[#C8623C]/30';

            return (
              <button
                key={i}
                type="button"
                onClick={() => setViewingSource(src)}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-pill bg-[#14151a] border border-white/10 hover:border-[#8EC5E8]/40 hover:bg-[#1a1b24] text-sm text-white transition-all hover-lift cursor-pointer group"
                title="Click to view document with genie animation"
              >
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${badgeClasses}`}>
                  {src.badge}
                </span>
                <span className="font-medium text-sm text-white truncate max-w-[240px] group-hover:text-[#8EC5E8] transition-colors">
                  {src.title}
                </span>
                <span className="text-xs text-muted hidden md:inline truncate max-w-[160px]">
                  • {src.category}
                </span>
                <span className="text-xs text-[#8EC5E8] opacity-0 group-hover:opacity-100 transition-opacity">
                  ↗
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. HEADLINE: Direct typography flow (No card) */}
      <div
        className="animate-reply-in pt-2.5 space-y-1.5"
        style={{ animationDelay: '280ms' }}
      >
        <h3 className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight leading-tight">
          {dossier.title}
        </h3>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          Clinical evaluation analysis for query: <strong className="text-white font-semibold">"{queryTitle}"</strong>
        </p>
      </div>

      {/* 5. FINDINGS ANALYSIS: Clean text list directly on canvas */}
      <div
        className="animate-reply-in space-y-2.5 pt-2"
        style={{ animationDelay: '360ms' }}
      >
        <h4 className="text-sm font-semibold text-white/95 uppercase tracking-wider">
          1. Case Findings Analysis
        </h4>
        <ul className="space-y-3 text-base sm:text-[17px] text-secondary pl-1">
          {dossier.findings.map((f, i) => {
            const isOp = f.badge.toLowerCase().includes('op');
            const isPath = f.badge.toLowerCase().includes('path');
            const badgeClasses = isOp
              ? 'bg-[#8EC5E8]/15 text-[#8EC5E8] border-[#8EC5E8]/30'
              : isPath
              ? 'bg-[#F2E6C8]/15 text-[#F2E6C8] border-[#F2E6C8]/30'
              : 'bg-[#C8623C]/15 text-[#E08A68] border-[#C8623C]/30';

            return (
              <li key={i} className="flex items-start gap-3">
                <span className="text-muted mt-1 text-sm">•</span>
                <span className="leading-relaxed">
                  {f.text}{' '}
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ml-1.5 ${badgeClasses}`}>
                    {f.badge}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 6. CONTEXT CONSIDERATION */}
      <div
        className="animate-reply-in space-y-2 pt-2"
        style={{ animationDelay: '440ms' }}
      >
        <h4 className="text-sm font-semibold text-white/95 uppercase tracking-wider">
          2. Attached Context Consideration
        </h4>
        <p className="text-base sm:text-[17px] text-secondary leading-relaxed pl-1">
          {dossier.contextNote}
        </p>
      </div>

      {/* 7. SYNTHESIZED RECOMMENDATION: Editorial Sky Blue accent line (No green) */}
      <div
        className="animate-reply-in border-l-3 border-[#8EC5E8] bg-[#8EC5E8]/[0.04] pl-5 py-3.5 my-3.5 rounded-r-lg text-base sm:text-[17px] text-secondary leading-relaxed"
        style={{ animationDelay: '520ms' }}
      >
        <strong className="text-[#8EC5E8] font-semibold block mb-1 text-xs sm:text-sm uppercase tracking-wider">
          Synthesized Recommendation:
        </strong>
        <p className="text-white/95 text-base sm:text-[17px] leading-relaxed">
          {dossier.recommendation}
        </p>
      </div>

      {/* 8. ACTION TOOLBAR: Minimal inline pills */}
      <div
        className="animate-reply-in pt-3.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-sm"
        style={{ animationDelay: '600ms' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 rounded-pill border border-white/10 bg-[#16171d] hover:bg-[#20222b] text-secondary hover:text-white transition-all text-sm cursor-pointer hover-lift"
          >
            {copied ? <Check className="w-4 h-4 text-[#8EC5E8]" /> : <Copy className="w-4 h-4 text-muted" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFeedback(feedback === 'up' ? null : 'up');
              toast({ type: 'success', title: 'Feedback recorded' });
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-pill border transition-all text-sm cursor-pointer hover-lift ${
              feedback === 'up'
                ? 'bg-[#8EC5E8]/15 text-[#8EC5E8] border-[#8EC5E8]/40'
                : 'bg-[#16171d] hover:bg-[#20222b] border-white/10 text-secondary hover:text-white'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Helpful</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFeedback(feedback === 'down' ? null : 'down');
              toast({ type: 'info', title: 'Feedback recorded' });
            }}
            className={`p-2 rounded-pill border transition-all text-sm cursor-pointer hover-lift ${
              feedback === 'down'
                ? 'bg-[#2b1919] text-status-failed border-status-failed/60'
                : 'bg-[#16171d] hover:bg-[#20222b] border-white/10 text-secondary hover:text-white'
            }`}
            title="Dislike"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ type: 'success', title: 'Link copied to clipboard' });
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-pill border border-white/10 bg-[#16171d] hover:bg-[#20222b] text-secondary hover:text-white transition-all text-sm cursor-pointer hover-lift"
          >
            <Share2 className="w-4 h-4 text-muted" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* GENIE ANIMATED VIEW DOCUMENT MODAL FROM CHAT */}
      <Modal
        isOpen={!!viewingSource}
        onClose={() => setViewingSource(null)}
        title={viewingSource?.title || 'Clinical Source Record'}
        description={`${viewingSource?.category} • ${viewingSource?.subtitle || 'Verified Medical Registry'}`}
        maxWidth="lg"
        animation="genie"
      >
        {viewingSource && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0e0f14] border border-white/10 font-mono text-xs text-primary leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto custom-scrollbar select-text">
              {viewingSource.badge.toLowerCase().includes('op') && `OPERATIVE TRANSCRIPTION RECORD
Patient: ${scopedCaseName} (${scopedCaseId})
Procedure: Bimaxillary Orthognathic Surgery with Mandibular Angle Contour
Registry Accession: REC-2026-OP-994

FINDINGS & TECHNIQUE:
1. Maxillary Le Fort I osteotomy performed with 4.5mm advancement and 1.8mm impaction.
2. Bilateral sagittal split osteotomy (BSSO) stabilized with bicortical 2.0mm titanium screws.
3. Rigid fixation confirmed across piriform rims and zygomaticomaxillary buttresses.
4. Final occlusion indexed to CAD/CAM surgical wafer; Class I canine and molar relation verified.`}

              {viewingSource.badge.toLowerCase().includes('path') && `SURGICAL PATHOLOGY & HISTOLOGY REPORT
Specimen: Cortical and cancellous bone margin biopsies
Accession: PATH-2026-4491
Pathologist: Chief of Surgical Pathology

MICROSCOPIC EVALUATION:
- Benign lamellar bone with active osteoblastic rimming.
- No evidence of high-grade dysplasia, cytologic atypia, or malignancy.
- Bone marrow elements demonstrate normal trilineage hematopoiesis.
- Margins clear (> 5mm histological margin preserved).`}

              {viewingSource.badge.toLowerCase().includes('nsqip') && `NATIONAL SURGICAL QUALITY IMPROVEMENT PROGRAM (NSQIP)
Registry Protocol: Complex Craniomaxillofacial & Orthognathic Reconstruction
Protocol Reference: NSQIP-CMF-v3.2

BENCHMARK COMPARISONS:
- 30-Day Unplanned Reoperation Rate: 1.4% (Cohort median: 2.1%)
- Surgical Site Infection (SSI) Risk Index: Low (0.8%)
- Deep Vein Thrombosis (DVT) Risk: Low (0.2%)
- Airway Obstruction Adverse Event Probability: < 1.0%
- Overall Risk Stratification: Compliant with benchmark standard.`}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-muted font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8EC5E8]" />
                Cryptographically Authenticated Source
              </span>
              <button
                type="button"
                onClick={() => {
                  toast({ type: 'success', title: 'Exporting Document', message: `Exported ${viewingSource.title}` });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8EC5E8] text-black font-medium hover:bg-[#8EC5E8]/90 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
