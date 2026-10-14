import React, { useState } from 'react';
import {
  FileText,
  X,
  ExternalLink,
  Check,
  CheckCircle2,
  Paperclip,
  Eye,
  ChevronDown,
  ShieldCheck,
  FileCheck2,
  FolderOpen,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CaseItem } from '../../types';
import { mockCases } from '../../data/mockData';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export interface DossierFile {
  id: string;
  name: string;
  category: string;
  size: string;
  previewContent: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  status: string;
  description: string;
  tag: string;
}

interface ContextSourcesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  attachedFiles: string[];
  onAttachFile: (fileName: string) => void;
  onDetachFile: (fileName: string) => void;
  isExtended?: boolean;
  onToggleExtended?: () => void;
}

export const ContextSourcesPanel: React.FC<ContextSourcesPanelProps> = ({
  isOpen,
  onClose,
  selectedCaseId,
  onSelectCase,
  attachedFiles,
  onAttachFile,
  onDetachFile,
  isExtended = false,
  onToggleExtended
}) => {
  const { toast } = useToast();
  const [inspectingFile, setInspectingFile] = useState<DossierFile | null>(null);

  // Active case fallback
  const currentCase: CaseItem =
    mockCases.find((c) => c.id === selectedCaseId) || mockCases[0];

  // Sample dossier files matching the requested screenshot
  const dossierFiles: DossierFile[] = [
    {
      id: 'dossier-1',
      name: `Operative_Note_${currentCase.caseNumber}.pdf`,
      category: 'Operative Transcription',
      size: '342 KB',
      previewContent: `OPERATIVE TRANSCRIPTION RECORD
Patient: ${currentCase.patientName} (${currentCase.caseNumber})
Procedure: ${currentCase.procedure}

FINDINGS & TECHNIQUE:
1. Maxillary Le Fort I osteotomy performed with 4.5mm advancement and 1.8mm impaction.
2. Bilateral sagittal split osteotomy (BSSO) stabilized with bicortical 2.0mm titanium screws.
3. Rigid fixation confirmed across piriform rims and zygomaticomaxillary buttresses.
4. Final occlusion indexed to CAD/CAM surgical wafer; Class I canine and molar relation verified.`
    },
    {
      id: 'dossier-2',
      name: `Pathology_Biopsy_${currentCase.caseNumber}.pdf`,
      category: 'Histopathology Report',
      size: '1.2 MB',
      previewContent: `SURGICAL PATHOLOGY REPORT
Specimen: Cortical and cancellous bone margin biopsies
Gross Description: Multiple fragments of tan-white bone measuring 1.4 x 0.8 cm in aggregate.
Microscopic Evaluation:
- Benign lamellar bone with active osteoblastic rimming.
- No evidence of high-grade dysplasia, cytologic atypia, or malignancy.
- Bone marrow elements demonstrate normal trilineage hematopoiesis.`
    },
    {
      id: 'dossier-3',
      name: 'NSQIP_Quality_Benchmark.pdf',
      category: 'Quality Standard',
      size: '890 KB',
      previewContent: `NATIONAL SURGICAL QUALITY IMPROVEMENT (NSQIP) BENCHMARK
Registry Procedure: Complex Craniomaxillofacial & Orthognathic Reconstruction
- 30-Day Unplanned Reoperation Rate: 1.4% (Cohort median: 2.1%)
- Surgical Site Infection (SSI) Risk Index: Low (0.8%)
- Deep Vein Thrombosis (DVT) Risk: Low (0.2%)
- Airway Obstruction Adverse Event Probability: < 1.0%`
    },
    {
      id: 'dossier-4',
      name: `PreOp_CT_${currentCase.caseNumber}.nii`,
      category: 'Diagnostic Imaging',
      size: '18.4 MB',
      previewContent: `MULTI-DETECTOR VOLUMETRIC CT REPORT
Modality: Multiplanar 3D CBCT (0.4mm isotropic voxel resolution)
Reconstruction Matrix: 512 x 512 x 640 slices
Cephalometric Landmarks:
- S-N-A: 77.2° -> Target: 82.1°
- S-N-B: 83.5° -> Target: 79.4°
- ANB Difference: -6.3° -> Target: +2.7°
- Airway Volume: PNS-Epiglottis 12.8 cm³ baseline`
    },
    {
      id: 'dossier-5',
      name: `PreOp_CBC_Metabolic_Panel.pdf`,
      category: 'Laboratory Panel',
      size: '118 KB',
      previewContent: `COMPREHENSIVE METABOLIC & HEMATOLOGIC PANEL
- Hemoglobin: 14.2 g/dL (Normal: 12.0 - 16.0)
- Hematocrit: 42.1% (Normal: 37.0 - 48.0)
- Platelet Count: 245 x 10³/µL (Normal: 150 - 400)
- Serum Creatinine: 0.82 mg/dL (Normal: 0.60 - 1.20)
- Blood Urea Nitrogen: 14 mg/dL (Normal: 7 - 20)
- Coagulation PT/INR: 1.02 (Normal: 0.85 - 1.15)`
    }
  ];

  // Evidence items matching clinical workflow (concise and precise)
  const evidenceItems: EvidenceItem[] = [
    {
      id: 'ev-1',
      title: 'Critical View of Safety',
      status: 'Confirmed',
      description: 'Anatomical margins verified; osteotomy lines rigid.',
      tag: 'Op Note'
    },
    {
      id: 'ev-2',
      title: 'Hardware Rigidity',
      status: 'Confirmed',
      description: 'Piriform L-plates intact; zero micro-motion observed.',
      tag: 'Op Note'
    },
    {
      id: 'ev-3',
      title: 'Margin Clearance',
      status: 'Confirmed',
      description: 'Benign morphology; negative resection margins.',
      tag: 'Pathology'
    },
    {
      id: 'ev-4',
      title: 'Airway Volumetric Safety',
      status: 'Audit Ready',
      description: 'Retroglossal airway volume verified within NSQIP norm.',
      tag: 'NSQIP'
    }
  ];

  const handleToggleAttach = (fileName: string) => {
    if (attachedFiles.includes(fileName)) {
      onDetachFile(fileName);
      toast({
        type: 'info',
        title: 'File Detached',
        message: `Removed ${fileName} from clinical query prompt.`
      });
    } else {
      onAttachFile(fileName);
      toast({
        type: 'success',
        title: 'Dossier Attached',
        message: `Attached ${fileName} to active inquiry context.`
      });
    }
  };

  return (
    <>
      {/* Slide-out Sidebar Panel with smooth transition */}
      <aside
        aria-label="Context and sources sidebar"
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-surface border-l border-border-hairline shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* PANEL HEADER */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border-hairline shrink-0 bg-surface">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <h2 className="font-serif text-sm font-semibold text-primary tracking-wide">
              Context & Sources
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleExtended && (
              <button
                type="button"
                onClick={onToggleExtended}
                className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-elevated transition-colors cursor-pointer hidden sm:flex"
                title={isExtended ? 'Standard Width' : 'Extend Width'}
              >
                {isExtended ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
              title="Close Context & Sources"
              aria-label="Close Context & Sources"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5 select-none">
          {/* SECTION 1: CURRENT CASE SELECTOR */}
          <div className="pb-3 border-b border-border-hairline">
            <label
              htmlFor="case-selector-dropdown"
              className="block text-[10px] font-mono uppercase tracking-widest text-muted font-medium mb-1.5"
            >
              Current Case
            </label>
            <div className="relative">
              <select
                id="case-selector-dropdown"
                value={currentCase.id}
                onChange={(e) => onSelectCase(e.target.value)}
                className="w-full bg-elevated hover:bg-elevated-hover border border-border-hairline rounded-lg px-3 py-2 text-xs text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-accent transition-colors pr-8 cursor-pointer font-medium"
              >
                {mockCases.map((c) => (
                  <option key={c.id} value={c.id} className="bg-surface text-primary">
                    {c.caseNumber}: {c.patientName} ({c.procedure.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* SECTION 2: CASE CLINICAL OVERVIEW (CARD-FREE EDITORIAL CANVAS) */}
          <div className="pb-4 border-b border-border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {currentCase.caseNumber}
              </span>
              <span className="text-[10px] text-muted font-mono tracking-wider uppercase">
                Active Context
              </span>
            </div>

            <div>
              <h3 className="font-serif text-base font-medium text-primary tracking-tight">
                {currentCase.patientName}
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                {currentCase.procedure}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">Demographics</span>
                <span className="text-primary font-medium text-xs mt-0.5 block">
                  {currentCase.gender[0]}, {currentCase.age} yrs
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">Quality Risk</span>
                <span className="text-accent font-medium text-xs mt-0.5 block">
                  Low (2.4%)
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: AVAILABLE SAMPLE DOSSIER FILES (CARD-FREE STREAM) */}
          <div className="pb-4 border-b border-border-hairline space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted font-semibold">
                Dossier Files
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-accent bg-accent/10 border border-accent/20">
                {dossierFiles.length} files
              </span>
            </div>

            <div className="divide-y divide-border-hairline">
              {dossierFiles.map((file) => {
                const isAttached = attachedFiles.includes(file.name);
                return (
                  <div
                    key={file.id}
                    className="py-2.5 px-2 -mx-2 rounded-lg hover:bg-elevated transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors shrink-0" />
                        <p className="font-mono text-xs text-primary truncate font-medium" title={file.name}>
                          {file.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-muted truncate mt-0.5 pl-5">
                        {file.category} • {file.size}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspectingFile(file)}
                        className="px-2 py-1 rounded text-[11px] font-medium text-secondary hover:text-primary hover:bg-elevated-hover transition-colors cursor-pointer"
                        title={`Inspect ${file.name}`}
                      >
                        Inspect
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAttach(file.name)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          isAttached
                            ? 'bg-accent/20 border border-accent/50 text-accent'
                            : 'bg-elevated hover:bg-elevated-hover text-secondary hover:text-primary border border-border-hairline'
                        }`}
                        title={isAttached ? 'Detach file' : 'Attach to query'}
                      >
                        {isAttached ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Attached</span>
                          </>
                        ) : (
                          <span>+ Attach</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: EVIDENCE VERIFICATION ITEMS (CARD-FREE CLINICAL STREAM) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted font-semibold">
                Evidence Checks
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-accent bg-accent/10 border border-accent/20">
                Audit Ready
              </span>
            </div>

            <div className="divide-y divide-border-hairline">
              {evidenceItems.map((item) => (
                <div
                  key={item.id}
                  className="py-3 px-2 -mx-2 rounded-lg hover:bg-elevated transition-colors space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="group-hover:text-accent transition-colors font-medium">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-accent shrink-0">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed pl-5">
                    {item.description}
                  </p>

                  <div className="pl-5 pt-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono text-muted bg-elevated border border-border-hairline">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay on mobile or when drawer is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* INSPECT FILE MODAL */}
      <Modal
        isOpen={!!inspectingFile}
        onClose={() => setInspectingFile(null)}
        title={inspectingFile?.name || 'Dossier Record'}
        description={`${inspectingFile?.category} • ${inspectingFile?.size}`}
        maxWidth="lg"
      >
        {inspectingFile && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-base border border-border-hairline font-mono text-xs text-primary leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto custom-scrollbar select-text">
              {inspectingFile.previewContent}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-hairline">
              <span className="text-xs text-muted font-mono">
                Cryptographic SHA-256 Verified
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleAttach(inspectingFile.name);
                    setInspectingFile(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-btn-primary-bg text-btn-primary-text hover:opacity-90 transition-colors"
                >
                  {attachedFiles.includes(inspectingFile.name)
                    ? 'Detach from Inquiry'
                    : 'Attach to Inquiry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
