import React from 'react';
import { Layers, Sparkles, Plus, CheckCircle2, ChevronRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ProcedureType, SurgicalStage } from '../../types';

export interface CaseTemplate {
  id: string;
  name: string;
  procedure: ProcedureType;
  stage: SurgicalStage;
  description: string;
  defaultNotes: string;
  recommendedModality: string;
}

interface CaseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CaseTemplate) => void;
}

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Class III Skeletal Bimaxillary Advancement',
    procedure: 'Bimaxillary Osteotomy',
    stage: 'Pre-Operative Planning',
    description: 'Le Fort I 4.5mm advancement with BSSO asymmetric setback and clockwise occlusal plane rotation.',
    defaultNotes: 'Pre-surgical orthodontics decompensated. Target overjet 2.0mm, overbite 1.5mm. Splint thickness 2.0mm CAD/CAM.',
    recommendedModality: 'CBCT 0.38mm + Digital Dental Scans'
  },
  {
    id: 'tmpl-2',
    name: 'Standard Le Fort I Maxillary Repositioning',
    procedure: 'Le Fort I Osteotomy',
    stage: 'Pre-Operative Planning',
    description: 'Maxillary impaction 3.0mm anterior, 1.5mm posterior for vertical maxillary excess correction.',
    defaultNotes: 'Incisor show at rest target: 3.5mm. Paranasal bone graft augmentation planned.',
    recommendedModality: 'High-Resolution Maxillofacial CT'
  },
  {
    id: 'tmpl-3',
    name: 'Obstructive Sleep Apnea MMA Protocol',
    procedure: 'Bimaxillary Osteotomy',
    stage: 'Pre-Operative Planning',
    description: 'Maxillomandibular advancement 10mm+ designed for posterior airway space (PAS) volumetric maximization.',
    defaultNotes: 'Pre-op AHI: 38.4 events/hr. Target 40%+ expansion in retroglossal and retropalatal airway volume.',
    recommendedModality: 'Volumetric Airway CBCT (Seated Position)'
  },
  {
    id: 'tmpl-4',
    name: 'Asymmetric Genioplasty & Border Contouring',
    procedure: 'Genioplasty',
    stage: 'Immediate Post-Op (24-48h)',
    description: 'Sliding osteotomy 5mm advancement with 2mm midline correction to facial aesthetic axis.',
    defaultNotes: 'Mental nerve clearance verified 4mm below osteotomy cut. Step defect smoothed with piezoelectric contouring.',
    recommendedModality: 'Cone Beam CT with Soft-Tissue Algorithm'
  }
];

export const CaseTemplateModal: React.FC<CaseTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Clinical Case Template" size="lg">
      <div className="space-y-3">
        <p className="text-xs text-muted">
          Choose a pre-configured surgical protocol with standardized anatomical landmarks, default operative notes, and CAD/CAM parameters.
        </p>

        <div className="space-y-2.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
          {CASE_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                onSelectTemplate(tmpl);
                onClose();
              }}
              className="p-3.5 rounded-xl bg-surface/50 border border-white/10 hover:border-white/30 hover:bg-elevated/80 transition-all cursor-pointer group flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white group-hover:text-[#8EC5E8] transition-colors">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#a3ffb2] bg-[#122415] px-2 py-0.5 rounded-pill border border-[#2f6b3a]/50">
                    {tmpl.procedure}
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">{tmpl.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted font-mono pt-1">
                  <span>Modality: {tmpl.recommendedModality}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-xs group-hover:bg-white group-hover:text-black transition-all"
              >
                Use Template
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
