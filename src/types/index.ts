export type AnalysisStatus = 'completed' | 'processing' | 'failed' | 'draft';

export interface ApiResponse<T> {
  data: T | null;
  error?: string | null;
  loading?: boolean;
  status?: number | 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export type ProcedureType = 
  | 'Le Fort I Osteotomy'
  | 'BSSO (Bilateral Sagittal Split)'
  | 'Bimaxillary Osteotomy'
  | 'Genioplasty'
  | 'ZMC Fracture Repair'
  | 'Mandibular Reconstruction (Fibula)'
  | 'Distraction Osteogenesis'
  | 'TMJ Alloplastic Replacement'
  | 'SARPE (Palatal Expansion)';

export type SurgicalStage = 
  | 'Pre-Operative Planning'
  | 'Immediate Post-Op (24-48h)'
  | 'Early Follow-up (6 Weeks)'
  | 'Intermediate (6 Months)'
  | 'Final Review (12 Months)';

export interface MeasurementItem {
  id: string;
  name: string;
  landmark: string;
  preOp: number;
  postOp: number;
  change: number;
  unit: 'mm' | '°' | 'cm³' | '%';
  expectedRange: [number, number];
  status: 'within-norm' | 'marginal' | 'out-of-range';
  category: 'Skeletal' | 'Dental' | 'Soft Tissue' | 'Airway';
  notes?: string;
}

export interface DomainScore {
  domain: string;
  score: number; // 0-100
  maxScore: number;
  weight: number; // percentage
  status: 'optimal' | 'acceptable' | 'deviated';
  summary: string;
}

export interface FindingEvidence {
  id: string;
  findingTitle: string;
  findingDescription: string;
  rubricCode: string;
  rubricRule: string;
  radiographicSource: string;
  confidence: number;
  impact: 'positive' | 'neutral' | 'negative';
}

export interface CaseFile {
  id: string;
  name: string;
  type: 'CT 3D' | 'CBCT' | 'Cephalometric X-ray' | 'Panoramic' | 'Intraoral Scan' | 'Clinical Photo';
  size: string;
  uploadDate: string;
  url: string;
  viewType: '3d' | 'axial' | 'coronal' | 'sagittal' | 'xray';
  isKeyImaging?: boolean;
}

export interface CaseItem {
  id: string;
  caseNumber: string;
  patientName: string;
  patientId: string; // MRN
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  procedure: ProcedureType;
  stage: SurgicalStage;
  status: AnalysisStatus;
  lastUpdated: string;
  surgeryDate: string;
  primarySurgeon: string;
  evaluator: string;
  ownerId: string;
  isShared: boolean;
  score?: number;
  confidenceInterval?: [number, number];
  needsAttention?: boolean;
  attentionReason?: string;
  notes?: string;
  domainScores: DomainScore[];
  measurements: MeasurementItem[];
  evidence: FindingEvidence[];
  files: CaseFile[];
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'Chief Surgeon' | 'Attending Surgeon' | 'Fellow' | 'Resident' | 'Oral Radiologist' | 'Administrator';
  status: 'Active' | 'Invited' | 'Suspended';
  department: string;
  casesCount: number;
  lastActive: string;
  avatarUrl?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Clinical Rubrics' | 'Cephalometrics' | 'Imaging Protocols' | 'Surgical Guides' | 'Quality Standards';
  version: string;
  lastUpdated: string;
  pages: number;
  author: string;
  summary: string;
  downloadUrl?: string;
  contentMarkdown?: string;
}

export interface RubricCriterion {
  id: string;
  code: string;
  title: string;
  domain: string;
  weight: number;
  targetRange: string;
  toleranceMm: number;
  description: string;
  updatedInVersion: string;
}

export interface RubricVersion {
  version: string;
  releaseDate: string;
  status: 'active' | 'archived';
  changelog: string[];
  reviewedBy: string;
}

export interface ThinkingTrace {
  duration?: string;
  searched: { label: string; icon?: string; badgeClass?: string }[];
  steps: string[];
  isFinished: boolean;
}

export interface ClinicalDossier {
  primarySources: {
    badge: string;
    category: string;
    title: string;
    subtitle: string;
  }[];
  title: string;
  scopedCaseName: string;
  scopedCaseId: string;
  findings: {
    text: string;
    badge: string;
  }[];
  contextNote: string;
  recommendation: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  userName?: string;
  userRole?: string;
  caseContextId?: string;
  thinkingTrace?: ThinkingTrace;
  clinicalDossier?: ClinicalDossier;
  sources?: { title: string; ref: string; confidence?: number }[];
  measurements?: { landmark: string; value: string; assessment: string }[];
  nestedCard?: {
    title: string;
    badge: string;
    stat1: string;
    stat2: string;
    stat3: string;
    summary: string;
  };
  suggestions?: string[];
}

export interface CopilotConversation {
  id: string;
  title: string;
  caseId?: string;
  caseName?: string;
  createdAt: string;
  updatedAt: string;
  messages: CopilotMessage[];
}

export interface InsightScoreKpi {
  overallAvg: number;
  totalEvaluated: number;
  passRate: number;
  avgConfidence: number;
}

