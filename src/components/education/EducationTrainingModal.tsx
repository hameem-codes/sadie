import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface EducationTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationTrainingModal: React.FC<EducationTrainingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'tutorial' | 'caseStudies' | 'quiz' | 'cert'>('tutorial');

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestion = {
    question: 'When localizing the A-Point (Subspinale) on 3D CBCT, what anatomical boundary defines its most posterior midline limit?',
    options: [
      'The deepest concavity between the Anterior Nasal Spine (ANS) and Prosthion (Pr)',
      'The junction of the nasal bone and frontal bone (Nasion)',
      'The most posterior superior point on the mandibular symphysis',
      'The geometric center of the sella turcica'
    ],
    correctAnswer: 0,
    rationale: 'A-Point (Subspinale) is radiographically defined as the deepest midline concavity between the anterior nasal spine (ANS) and prosthion on the anterior maxilla.'
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedAnswer === quizQuestion.correctAnswer) {
      toast({
        type: 'success',
        title: 'Correct Answer! +50 CME Points',
        message: 'Accurate identification of maxillary cephalometric boundary.'
      });
    } else {
      toast({
        type: 'error',
        title: 'Incorrect',
        message: 'Review cranial landmarking rubric before re-attempting.'
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SADIE Clinical Academy & Certification" maxWidth="xl">
      <div className="space-y-4 text-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-pill border border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'tutorial', label: 'Feature Tour', icon: Play },
            { id: 'caseStudies', label: 'Case Studies', icon: BookOpen },
            { id: 'quiz', label: 'Landmark Quiz', icon: HelpCircle },
            { id: 'cert', label: 'CME Certification', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-max flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-pill font-medium transition-all cursor-pointer whitespace-nowrap text-xs ${
                  activeTab === tab.id
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Feature Tour */}
        {activeTab === 'tutorial' && (
          <div className="space-y-3 p-4 rounded-xl bg-surface/60 border border-white/10">
            <h4 className="font-serif text-sm font-semibold text-white">Interactive Evaluator Tour</h4>
            <p className="text-muted leading-relaxed">
              Step through the core components of the SADIE maxillofacial outcome workflow:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { step: '1. DICOM Ingestion', desc: 'Drag CBCT files into Workspace to automatically reconstruct 3D isotropic voxel volumes.' },
                { step: '2. Landmark Extraction', desc: 'AI pinpoints 48 cephalometric coordinates with sub-millimeter precision.' },
                { step: '3. Vector & Splint Discrepancy', desc: 'Detect maxillary pitch, yaw, and roll errors against surgical planning splints.' },
                { step: '4. Digital Sign-Off', desc: 'Sign reports cryptographically with digital stylus and push directly to Epic EHR.' }
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-surface border border-white/5 space-y-1">
                  <span className="font-semibold text-[#8EC5E8] block">{s.step}</span>
                  <p className="text-secondary text-[11px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Case Studies */}
        {activeTab === 'caseStudies' && (
          <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
            {[
              {
                title: 'Case Study: Severe Class III Skeletal Discrepancy',
                tags: 'Bimaxillary • 4.8mm Advancement',
                summary: 'Examining surgical wafer stability and 3D airway expansion in a 24-year-old female post Le Fort I and BSSO setback.',
                score: '96.2%'
              },
              {
                title: 'Case Study: Post-Traumatic ZMC Reconstruction',
                tags: 'Orbital Floor • Titanium Mesh',
                summary: 'Pre vs post-op comparison evaluating zygomatic arch symmetry and diplopia resolution.',
                score: '93.5%'
              },
              {
                title: 'Case Study: Obstructive Sleep Apnea (OSA) Expansion',
                tags: 'MMA • Airway +42%',
                summary: '10mm maxillomandibular advancement leading to total normalization of hypopnea index.',
                score: '97.8%'
              }
            ].map((cs, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-surface/50 border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{cs.title}</span>
                  <span className="font-mono text-[#a3ffb2] bg-[#122415] px-2 py-0.5 rounded-pill border border-[#2f6b3a]/50 text-[10px]">
                    Benchmark: {cs.score}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8EC5E8] block mb-1">{cs.tags}</span>
                <p className="text-muted text-[11px]">{cs.summary}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Interactive Landmark Quiz */}
        {activeTab === 'quiz' && (
          <div className="p-4 rounded-xl bg-surface/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <span className="font-semibold text-white">Landmark Competency Assessment</span>
              <span className="font-mono text-muted text-[10px]">Question 1 of 5</span>
            </div>

            <p className="text-white font-medium leading-relaxed">{quizQuestion.question}</p>

            <div className="space-y-2">
              {quizQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => !quizSubmitted && setSelectedAnswer(idx)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    selectedAnswer === idx
                      ? 'bg-elevated border-white text-white font-medium'
                      : 'bg-surface/50 border-white/5 text-secondary hover:text-white hover:bg-elevated/60'
                  } ${
                    quizSubmitted && idx === quizQuestion.correctAnswer
                      ? '!border-[#a3ffb2] !bg-[#122415] !text-[#a3ffb2]'
                      : ''
                  }`}
                >
                  <span className="font-mono mr-2 text-muted">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            {quizSubmitted && (
              <div className="p-2.5 rounded bg-surface border border-white/10 text-[11px] text-muted">
                <span className="text-white font-semibold block mb-0.5">Clinical Rationale:</span>
                {quizQuestion.rationale}
              </div>
            )}

            <div className="flex justify-end pt-1">
              {!quizSubmitted ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                  className="text-xs"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAnswer(null);
                    setQuizSubmitted(false);
                  }}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Retry Question
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Certification Tracking */}
        {activeTab === 'cert' && (
          <div className="p-4 rounded-xl bg-surface/60 border border-white/10 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#122415] border border-[#2f6b3a] flex items-center justify-center text-[#a3ffb2]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="font-semibold text-white text-sm block">
                  SADIE Certified Surgical Evaluator
                </span>
                <span className="text-[11px] text-muted">
                  Accredited by the International Association of Oral and Maxillofacial Surgeons (IAOMS)
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-muted">CME Credit Progress:</span>
                <span className="text-[#a3ffb2]">18.5 / 20.0 Credits (92.5%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-white/5">
                <div className="h-full bg-[#a3ffb2] rounded-full transition-all" style={{ width: '92.5%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded bg-surface border border-white/5">
                <span className="text-muted block text-[10px]">Credential ID:</span>
                <span className="text-white">OMFS-2026-SADIE-891</span>
              </div>
              <div className="p-2 rounded bg-surface border border-white/5">
                <span className="text-muted block text-[10px]">Status:</span>
                <span className="text-[#a3ffb2] font-semibold">Active Attending</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
