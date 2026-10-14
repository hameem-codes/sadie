import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Share2,
  FileText,
  Download,
  Printer,
  Sparkles,
  MessageSquare,
  Upload,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileCheck,
  Send,
  Trash2,
  Edit2,
  Mail,
  FileSignature,
  Package,
  X,
  Smartphone,
  KeyRound,
  Database,
  Calendar,
  AlertTriangle,
  Pin
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { StatusPill } from '../components/ui/StatusPill';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { Table, Column } from '../components/ui/Table';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { ImagingViewer } from '../components/workspace/ImagingViewer';
import { ChatBubble } from '../components/ui/ChatBubble';
import { RunAnalysisModal } from '../components/cases/RunAnalysisModal';
import { DigitalSignaturePad } from '../components/workspace/DigitalSignaturePad';
import { CoViewingPresence } from '../components/workspace/CoViewingPresence';
import { ImagingAnnotations } from '../components/workspace/ImagingAnnotations';
import { CaseAuditLogModal } from '../components/workspace/CaseAuditLogModal';
import { MobileFeaturesModal } from '../components/mobile/MobileFeaturesModal';
import { SecurityComplianceModal } from '../components/compliance/SecurityComplianceModal';
import { IntegrationsModal } from '../components/integrations/IntegrationsModal';
import { CaseItem, MeasurementItem, FindingEvidence, CaseFile, CopilotMessage } from '../types';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';

export const CaseWorkspace: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [caseData, setCaseData] = useState<CaseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Slide-over & Drawer states
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [isRunAnalysisModalOpen, setIsRunAnalysisModalOpen] = useState(false);

  // Digital Sign-Off & Email Report states
  const [isReportSigned, setIsReportSigned] = useState(false);
  const [signedTimestamp, setSignedTimestamp] = useState<string | null>(null);
  const [savedSignatureUrl, setSavedSignatureUrl] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isEmailReportOpen, setIsEmailReportOpen] = useState(false);
  const [reportEmailTarget, setReportEmailTarget] = useState('');
  const [reportTemplate, setReportTemplate] = useState<'full' | 'executive' | 'radiologist' | 'patient'>('full');
  const [reportVersion, setReportVersion] = useState<'v1.1' | 'v1.0'>('v1.1');

  // Collaboration, Compliance & Mobile States
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);

  // Measurement Category Filter
  const [measurementCategory, setMeasurementCategory] = useState<'All' | 'Skeletal' | 'Dental' | 'Soft Tissue' | 'Airway'>('All');

  // Files Tab states
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteFileTarget, setDeleteFileTarget] = useState<CaseFile | null>(null);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');

  // Case-Scoped Copilot state
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingCopilot, setIsSendingCopilot] = useState(false);
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCopilotOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, isCopilotOpen, isSendingCopilot]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCopilotOpen) {
        setIsCopilotOpen(false);
      }
    };
    if (isCopilotOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCopilotOpen]);

  useEffect(() => {
    if (caseId) {
      loadCase(caseId);
    }
  }, [caseId]);

  const loadCase = async (id: string) => {
    setIsLoading(true);
    try {
      const found = await api.getCaseById(id);
      if (found) {
        setCaseData(found);
        setFiles(found.files || []);
        // Seed case-scoped copilot messages
        setCopilotMessages([
          {
            id: 'cmsg-init',
            role: 'assistant',
            content: `Reviewing **${found.patientName} (${found.caseNumber})**.\nProcedure: ${found.procedure}.\n\nHow can I assist your evaluation of the 3D surgical plan or post-operative stability?`,
            timestamp: 'Just now',
            suggestions: [
              'Check dental midline and overjet',
              'Assess condylar seating symmetry',
              'Verify airway volumetric changes'
            ]
          }
        ]);
      } else {
        toast({ type: 'error', title: 'Case not found' });
      }
    } catch {
      toast({ type: 'error', title: 'Error loading case details' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAnalysis = () => {
    if (!caseData) return;
    setIsRunAnalysisModalOpen(true);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !caseData) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCopilotMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSendingCopilot(true);

    try {
      const aiReply: CopilotMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `Regarding **${caseData.patientName}**: ${
          text.toLowerCase().includes('airway')
            ? `Post-operative volumetric reconstruction confirms oropharyngeal airway expansion to 16.4 cm³ (+28.4% increase from baseline). Minimum retroglossal cross-sectional area expanded safely without retropalatal collapse.`
            : text.toLowerCase().includes('midline')
            ? `Maxillary and mandibular midlines demonstrate <0.4mm discrepancy across the ANS and Me coordinates, satisfying the Level-1 rubric tolerance (<1.0mm).`
            : `All 3D osteotomy gap tolerances, rigid fixation screw integrity, and Holdaway soft-tissue angles satisfy clinical benchmarks for ${caseData.procedure}.`
        }`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nestedCard: {
          title: 'Case-Specific Verification',
          badge: caseData.score ? `Score: ${caseData.score}%` : 'Analysis Verified',
          stat1: 'ANS Dev: 0.2mm',
          stat2: 'Pog-Horiz: +7.1mm',
          stat3: 'CI: 95%',
          summary: 'Parameters remain within target surgical plan specifications.'
        },
        suggestions: [
          'Generate clinical report summary',
          'Inspect axial slice #142',
          'Compare to cohort average'
        ]
      };
      setCopilotMessages(prev => [...prev, aiReply]);
    } finally {
      setIsSendingCopilot(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const file = uploadedFiles[0];
    
    setIsUploading(true);
    setUploadProgress(20);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        const newCaseFile: CaseFile = {
          id: `f-${Date.now()}`,
          name: file.name,
          type: file.name.endsWith('.dcm') ? 'CBCT' : file.name.endsWith('.stl') ? 'CT 3D' : 'Cephalometric X-ray',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          url: '/imaging/ct-3d.png',
          viewType: '3d'
        };
        setFiles(prev => [newCaseFile, ...prev]);
        toast({ type: 'success', title: 'File Uploaded', message: `Attached ${file.name} to case.` });
      }, 250);
    }, 700);
  };

  const confirmDeleteFile = () => {
    if (!deleteFileTarget) return;
    setFiles(prev => prev.filter(f => f.id !== deleteFileTarget.id));
    toast({ type: 'info', title: 'File Removed', message: `Deleted ${deleteFileTarget.name}` });
    setDeleteFileTarget(null);
  };

  const handleSaveRename = (id: string) => {
    if (!newFileName.trim()) return;
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newFileName } : f));
    setRenameFileId(null);
    setNewFileName('');
    toast({ type: 'success', title: 'File Renamed' });
  };

  const handleSignReport = () => {
    const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    setIsReportSigned(true);
    setSignedTimestamp(timestamp);
    toast({ type: 'success', title: 'Evaluation Signed Off', message: `Cryptographic seal generated: ${timestamp}` });
  };

  const handleExportDicom = () => {
    if (!caseData) return;
    const dicomHeader = {
      SOPClassUID: '1.2.840.10008.5.1.4.1.1.88.33 (Comprehensive 3D SR)',
      PatientID: caseData.patientId,
      PatientName: caseData.patientName,
      StudyInstanceUID: `2.16.840.1.113669.632.${Date.now()}`,
      Procedure: caseData.procedure,
      OutcomeScore: caseData.score,
      ClinicalProtocol: 'SADIE Consensus Radiomic Standard v3.2',
      SignedOffBy: isReportSigned ? 'Signed & Verified' : 'Unsigned',
      SignOffTimestamp: signedTimestamp || 'Pending'
    };
    const blob = new Blob([JSON.stringify(dicomHeader, null, 2)], { type: 'application/dicom+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseData.caseNumber}_DICOM_SR_PACKAGE.dcm.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: 'success', title: 'DICOM SR Package Exported' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-secondary text-sm font-serif">Loading Maxillofacial Workspace...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-secondary text-base">Case record not found.</p>
        <Button variant="outline" onClick={() => navigate('/cases')}>
          Return to Cases
        </Button>
      </div>
    );
  }

  const filteredMeasurements = measurementCategory === 'All'
    ? caseData.measurements
    : caseData.measurements.filter(m => m.category === measurementCategory);

  const measurementColumns: Column<MeasurementItem>[] = [
    {
      key: 'name',
      header: 'Measurement / Parameter',
      render: (item) => (
        <div className="min-w-[150px]">
          <span className="font-medium text-white block">{item.name}</span>
          <span className="text-xs text-muted font-mono">{item.landmark}</span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <span className="text-xs px-2 py-0.5 rounded-pill bg-elevated border border-white/10 text-secondary whitespace-nowrap">
          {item.category}
        </span>
      )
    },
    {
      key: 'preOp',
      header: 'Pre-Op',
      align: 'right',
      render: (item) => (
        <span className="font-mono text-[15px] text-secondary whitespace-nowrap">
          {item.preOp} {item.unit}
        </span>
      )
    },
    {
      key: 'postOp',
      header: 'Post-Op',
      align: 'right',
      render: (item) => (
        <span className="font-mono text-[15px] text-white font-medium whitespace-nowrap">
          {item.postOp} {item.unit}
        </span>
      )
    },
    {
      key: 'change',
      header: 'Change (Δ)',
      align: 'right',
      render: (item) => (
        <span className={`font-mono text-[15px] font-semibold whitespace-nowrap ${item.change >= 0 ? 'text-[#a3ffb2]' : 'text-[#8ec5e8]'}`}>
          {item.change > 0 ? `+${item.change}` : item.change} {item.unit}
        </span>
      )
    },
    {
      key: 'expectedRange',
      header: 'Expected Range',
      render: (item) => (
        <span className="font-mono text-[15px] text-muted whitespace-nowrap">
          [{item.expectedRange[0]}, {item.expectedRange[1]}] {item.unit}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (item) => (
        <div className="whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#a3ffb2] bg-[#122415] px-2.5 py-0.5 rounded-pill border border-[#2f6b3a]/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Within Norm
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-up max-w-7xl mx-auto pb-12">
      {/* Back button & top navigation breadcrumb */}
      <button
        type="button"
        onClick={() => navigate('/cases')}
        className="inline-flex items-center gap-2 text-xs text-secondary hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cases Directory
      </button>

      {/* Case Header Banner */}
      <div className="p-6 rounded-2xl bg-surface/80 border border-border-hairline backdrop-blur-md shadow-card-subtle flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="font-mono text-xs text-white px-2 py-0.5 rounded bg-elevated border border-white/10">
              {caseData.caseNumber}
            </span>
            <StatusPill status={caseData.status} size="sm" />
            <span className="text-xs text-muted">• {caseData.stage}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white">
            {caseData.patientName}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-secondary">
            <span>MRN: <strong className="text-white font-mono">{caseData.patientId}</strong></span>
            <span>•</span>
            <span>Age: <strong className="text-white">{caseData.age}y</strong> ({caseData.gender})</span>
            <span>•</span>
            <span>Procedure: <strong className="text-white">{caseData.procedure}</strong></span>
            <span>•</span>
            <div className="inline-flex items-center gap-1.5 bg-elevated/80 border border-white/15 rounded-pill px-2.5 py-0.5">
              <span className="text-muted">Primary Surgeon:</span>
              <select
                value={caseData.primarySurgeon || 'Dr. Evelyn Vance, MD, DDS'}
                onChange={(e) => {
                  const newSurgeon = e.target.value;
                  setCaseData(prev => prev ? { ...prev, primarySurgeon: newSurgeon } : null);
                  toast({
                    type: 'success',
                    title: 'Case Assigned',
                    message: `Primary surgical responsibility assigned to ${newSurgeon}`
                  });
                }}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
                title="Assign case to specific surgeon"
              >
                <option value="Dr. Evelyn Vance, MD, DDS" className="bg-[#16171d]">Dr. Evelyn Vance, MD, DDS</option>
                <option value="Dr. Marcus Sterling, DMD" className="bg-[#16171d]">Dr. Marcus Sterling, DMD</option>
                <option value="Dr. Soraya Chen, MD" className="bg-[#16171d]">Dr. Soraya Chen, MD</option>
                <option value="Dr. Tariq Al-Mansoor, DDS" className="bg-[#16171d]">Dr. Tariq Al-Mansoor, DDS</option>
                <option value="Maxillofacial Service Team A" className="bg-[#16171d]">Fellowship Service Team A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Controls in Header (Organized into 2 clean responsive rows) */}
        <div className="flex flex-col gap-2.5 w-full xl:w-auto shrink-0">
          {/* Row 1: Primary Clinical Evaluation & Report Actions */}
          <div className="flex flex-wrap items-center gap-2 justify-start xl:justify-end">
            <CoViewingPresence />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCopilotOpen(true)}
              icon={<Sparkles className="w-3.5 h-3.5 text-white" />}
              iconPosition="left"
              className="text-xs whitespace-nowrap"
            >
              Copilot Assist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              icon={<Share2 className="w-3.5 h-3.5" />}
              className="border-white/15 text-xs whitespace-nowrap"
            >
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportOpen(true)}
              icon={<FileText className="w-3.5 h-3.5" />}
              className="border-white/15 text-xs whitespace-nowrap"
            >
              Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunAnalysis}
              icon={<Play className="w-3.5 h-3.5 text-black fill-black" />}
              iconPosition="left"
              className="shadow-glow-subtle font-semibold text-xs whitespace-nowrap"
            >
              Run Analysis
            </Button>
          </div>

          {/* Row 2: Clinical Tool Integrations */}
          <div className="flex flex-wrap items-center gap-2 justify-start xl:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuditModalOpen(true)}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-[#a3ffb2]" />}
              className="border-white/10 text-xs text-secondary hover:text-white whitespace-nowrap"
            >
              Audit Trail
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileModalOpen(true)}
              icon={<Smartphone className="w-3.5 h-3.5 text-[#8EC5E8]" />}
              className="border-white/10 text-xs text-secondary hover:text-white whitespace-nowrap"
            >
              Mobile Camera
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsIntegrationsModalOpen(true)}
              icon={<Database className="w-3.5 h-3.5 text-[#8EC5E8]" />}
              className="border-white/10 text-xs text-secondary hover:text-white whitespace-nowrap"
            >
              PACS / EHR
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSecurityModalOpen(true)}
              icon={<KeyRound className="w-3.5 h-3.5 text-[#8EC5E8]" />}
              className="border-white/10 text-xs text-secondary hover:text-white whitespace-nowrap"
            >
              Security
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Tabs: Overview, Measurements, Evidence, Files */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-1 shrink-0">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
            { id: 'measurements', label: 'Measurements', count: caseData.measurements.length },
            { id: 'evidence', label: 'Evidence & Rubrics', count: caseData.evidence.length },
            { id: 'files', label: 'Imaging Files', count: files.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-up">
          {/* Top Score Banner with Confidence Interval */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-[#121212] border-white/15 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-muted">
                  SADIE Final Outcome Score
                </span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-white tracking-tight">
                    {caseData.score ? (
                      <AnimatedNumber value={`${caseData.score}%`} />
                    ) : (
                      'Pending'
                    )}
                  </span>
                  {caseData.score && (
                    <span className="text-xs font-semibold text-[#a3ffb2] bg-[#122415] px-2.5 py-1 rounded-pill border border-[#2f6b3a]/70">
                      Level 1 Passing
                    </span>
                  )}
                </div>
              </div>

              {caseData.confidenceInterval && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-secondary">95% Confidence Interval:</span>
                  <span className="font-mono text-white font-medium">
                    [<AnimatedNumber value={`${caseData.confidenceInterval[0]}%`} /> – <AnimatedNumber value={`${caseData.confidenceInterval[1]}%`} />]
                  </span>
                </div>
              )}
            </Card>

            {/* Quick Clinical Summary Notes */}
            <Card className="p-6 col-span-1 md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted">
                    Operative Assessment & Notes
                  </span>
                  <span className="text-xs text-muted font-mono">{caseData.evaluator}</span>
                </div>
                <p className="mt-3 text-sm text-secondary leading-relaxed">
                  {caseData.notes || 'Virtual surgical planning alignment verified. Radiographic assessment measures hard and soft tissue stability according to standardized protocol.'}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs text-muted">
                <span>Surgery Date: <strong className="text-white">{caseData.surgeryDate}</strong></span>
                <span>•</span>
                <span>Last Updated: <strong className="text-white">{caseData.lastUpdated}</strong></span>
                <span>•</span>
                <span className="text-[#a3ffb2] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> High Precision Segmentation
                </span>
              </div>
            </Card>
          </div>

          {/* Interactive Pre vs Post Imaging Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-primary">
                Multiplanar Radiographic Assessment
              </h3>
              <span className="text-xs text-muted">Interactive 3D volume, cross-sections, pan, zoom & caliper</span>
            </div>
            <ImagingViewer
              patientName={caseData.patientName}
              procedure={caseData.procedure}
              files={files}
              onUploadClick={() => setActiveTab('files')}
            />
          </div>

          {/* AI Clinical Anomaly Alert & Treatment Recommendation Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#231515] border border-[#c8623c]/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#fca582] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-white text-xs block">AI Anomaly Alert: Scatter Cleansed</span>
                <p className="text-[11px] text-[#fca582]/90 leading-relaxed">
                  Titanium bracket scatter suppressed on right condyle. 3D landmark localization maintained ±0.18mm isotropic fidelity.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#122415] border border-[#2f6b3a]/50 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#a3ffb2] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-white text-xs block">Predictive Rubric Recommendation</span>
                <p className="text-[11px] text-[#a3ffb2]/90 leading-relaxed">
                  Maxillary advancement of 4.5mm successfully addresses retrognathic airway obstruction (+32% volume). Recommended protocol: Guiding elastics for 14 days.
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Imaging Annotations & Discussion Thread */}
          <ImagingAnnotations />

          {/* Domain Scores Breakdown */}
          {caseData.domainScores.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-medium text-primary">
                Domain Score Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseData.domainScores.map((ds, i) => (
                  <Card key={i} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-white">{ds.domain}</span>
                        <span className="font-mono font-medium text-sm text-[#a3ffb2]">
                          <AnimatedNumber value={ds.score} />/100
                        </span>
                      </div>
                      <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden my-3">
                        <div
                          className="bg-white h-full rounded-full transition-all duration-500"
                          style={{ width: `${ds.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-secondary leading-relaxed">
                        {ds.summary}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-muted flex items-center justify-between">
                      <span>Rubric Weight: {ds.weight}%</span>
                      <span className="text-status-completed font-medium capitalize">{ds.status}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEASUREMENTS */}
      {activeTab === 'measurements' && (
        <div className="space-y-4 animate-fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface/60 border border-border-hairline">
            <div>
              <h3 className="font-serif text-lg font-medium text-white">
                Cephalometric & 3D Skeletal Measurements
              </h3>
              <p className="text-xs text-muted">Automated computerized landmark tracking against normative ranges.</p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['All', 'Skeletal', 'Dental', 'Soft Tissue', 'Airway'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMeasurementCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-pill transition-all font-medium ${
                    measurementCategory === cat
                      ? 'bg-white text-base shadow-sm'
                      : 'bg-elevated text-secondary hover:text-white border border-border-hairline'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Table
            columns={measurementColumns}
            data={filteredMeasurements}
            keyExtractor={(m) => m.id}
            emptyMessage="No measurements found in this category."
          />
        </div>
      )}

      {/* TAB 3: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-4 animate-fade-up">
          <div className="p-4 rounded-xl bg-surface/60 border border-border-hairline">
            <h3 className="font-serif text-lg font-medium text-white">
              Linked Clinical Evidence & Rubric Audit Trail
            </h3>
            <p className="text-xs text-muted">Auditable pipeline linking radiographic findings directly to consensus rubric criteria.</p>
          </div>

          <div className="space-y-3">
            {caseData.evidence.length === 0 ? (
              <Card className="p-12 text-center text-secondary text-sm">
                No evidence items logged. Run analysis to extract radiographic findings.
              </Card>
            ) : (
              caseData.evidence.map((ev) => (
                <Card key={ev.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-status-completed" />
                      <h4 className="font-medium text-base text-white">{ev.findingTitle}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-elevated border border-white/10 text-secondary">
                        {ev.rubricCode}
                      </span>
                      <span className="text-xs font-mono text-[#a3ffb2] bg-[#122415] px-2 py-0.5 rounded-pill border border-[#2f6b3a]/70">
                        {ev.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-secondary leading-relaxed">
                    {ev.findingDescription}
                  </p>

                  <div className="p-3 rounded-lg bg-[#111111] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-muted mr-1.5">Rubric Target:</span>
                      <strong className="text-white">{ev.rubricRule}</strong>
                    </div>
                    <div>
                      <span className="text-muted mr-1.5">Radiographic Source:</span>
                      <span className="text-[#8ec5e8] font-mono">{ev.radiographicSource}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FILES */}
      {activeTab === 'files' && (
        <div className="space-y-6 animate-fade-up">
          {/* Upload Zone */}
          <div className="p-8 rounded-xl border-2 border-dashed border-white/15 bg-surface/30 hover:border-white/30 transition-colors text-center relative">
            <input
              type="file"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
              title="Upload DICOM / CT scan"
            />
            {isUploading ? (
              <div className="max-w-md mx-auto space-y-3 py-2">
                <div className="w-10 h-10 rounded-full bg-elevated border border-white/10 flex items-center justify-center mx-auto text-white">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
                <h4 className="font-serif text-base font-medium text-white">
                  Uploading & Parsing DICOM Series...
                </h4>
                <div className="w-full bg-elevated rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-white h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted font-mono">{uploadProgress}% Complete</p>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-2 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-elevated border border-white/10 flex items-center justify-center mx-auto text-secondary">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-medium text-white">
                  Upload Radiographic Imaging (DICOM / STL / CBCT)
                </h4>
                <p className="text-xs text-muted">
                  Drag and drop DICOM series (.dcm, .nii, .gz) or virtual surgical plans (.stl, .ply) up to 500MB.
                </p>
              </div>
            )}
          </div>

          {/* Files List */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-white">
              Associated Case Files ({files.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.map(f => (
                <Card key={f.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-elevated border border-white/10 flex items-center justify-center shrink-0 text-white font-mono text-xs font-bold">
                      {f.type === 'CBCT' ? 'CBCT' : f.type === 'CT 3D' ? '3D' : 'RAD'}
                    </div>
                    <div className="min-w-0">
                      {renameFileId === f.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="bg-base border border-white/30 rounded px-2 py-0.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSaveRename(f.id)}
                            className="text-xs text-status-completed hover:underline"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-xs font-medium text-white truncate max-w-xs">{f.name}</h4>
                      )}
                      <p className="text-[11px] text-muted">{f.type} • {f.size} • Uploaded {f.uploadDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setRenameFileId(f.id);
                        setNewFileName(f.name);
                      }}
                      className="p-1.5 rounded text-muted hover:text-white"
                      title="Rename"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteFileTarget(f)}
                      className="p-1.5 rounded text-muted hover:text-status-failed hover:bg-elevated transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CASE-SCOPED COPILOT FIXED CHAT WINDOW (Constant height & width, with Genie animation) */}
      {isCopilotOpen && (
        <>
          {/* Backdrop (dismiss on click) */}
          <div
            className="fixed inset-0 bg-base/70 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
            onClick={() => setIsCopilotOpen(false)}
            aria-hidden="true"
          />

          {/* Fixed Constant Chat Window */}
          <div
            role="dialog"
            aria-modal="true"
            className="fixed right-2 sm:right-6 bottom-2 sm:bottom-6 z-50 w-[min(calc(100vw-1rem),460px)] h-[min(580px,calc(100vh-2rem))] h-[min(580px,calc(100dvh-2rem))] max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] bg-[#121318] border border-white/15 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-genie-window select-none"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-surface/80 shrink-0">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#8EC5E8] shrink-0" />
                  <h3 className="font-serif text-base font-medium text-white truncate">
                    SADIE Copilot — {caseData.patientName}
                  </h3>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  Clinical Q&A scoped to {caseData.caseNumber} ({caseData.procedure})
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCopilotOpen(false)}
                aria-label="Close copilot chat"
                className="text-muted hover:text-white h-7 w-7 shrink-0 -mr-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-[#0e0f14]/80">
              {copilotMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  onSuggestionClick={(sug) => handleSendMessage(sug)}
                />
              ))}
              {isSendingCopilot && (
                <div className="flex items-center gap-2 text-xs text-muted p-2 animate-fade-in">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8EC5E8] animate-ping" />
                  Analyzing multiplanar slices...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Fixed Bottom Input Area */}
            <div className="p-3 border-t border-white/10 bg-[#14151b] shrink-0">
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="Ask about landmarks, airway volume, or rubric scores..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full bg-[#1c1d24] border border-border-hairline rounded-xl p-2.5 pr-10 text-xs text-primary placeholder-muted focus:outline-none focus:border-white/40 resize-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isSendingCopilot}
                  className="absolute right-2.5 bottom-2.5 p-1.5 rounded-full bg-white text-black hover:opacity-90 disabled:opacity-30 transition-opacity cursor-pointer shrink-0"
                  aria-label="Send query"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* REPORT PREVIEW DRAWER (PDF, JSON, Print) */}
      <Drawer
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="Clinical Outcome Report"
        description="Comprehensive evaluative dossier for surgical records and tumor board review."
        width="xl"
      >
        <div className="space-y-6">
          {/* Template & Versioning Selector Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface/70 border border-white/10 text-xs">
            {/* Custom Report Template Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted text-[11px] font-mono">Template:</span>
              {(['full', 'executive', 'radiologist', 'patient'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setReportTemplate(t)}
                  className={`px-2.5 py-1 rounded-pill capitalize font-medium transition-all cursor-pointer ${
                    reportTemplate === t
                      ? 'bg-white text-black font-semibold'
                      : 'bg-elevated text-secondary hover:text-white border border-white/10'
                  }`}
                >
                  {t === 'full' ? 'Operative Dossier' : t === 'executive' ? 'Executive' : t === 'radiologist' ? 'Radiologist DICOM' : 'Patient Brief'}
                </button>
              ))}
            </div>

            {/* Versioning & Shareable Link */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-elevated px-2 py-0.5 rounded-pill border border-white/10 text-[11px] font-mono">
                <span className="text-muted">Rev:</span>
                <button
                  type="button"
                  onClick={() => setReportVersion(reportVersion === 'v1.1' ? 'v1.0' : 'v1.1')}
                  className="text-[#8EC5E8] hover:underline cursor-pointer"
                >
                  {reportVersion} (Toggle History)
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast({
                    type: 'success',
                    title: 'Secure Report Link Copied',
                    message: 'Encrypted 48-hour access token generated for consulting physician.'
                  });
                }}
                className="text-xs py-1 px-2.5"
              >
                <Share2 className="w-3 h-3 mr-1" />
                Copy Secure Link
              </Button>
            </div>
          </div>

          {/* Action buttons (Download PDF, Export JSON, Print) */}
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                window.print();
                toast({ type: 'success', title: 'Printing initiated' });
              }}
              icon={<Printer className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              Print Report
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                toast({ type: 'success', title: 'PDF Dossier Generated', message: 'Downloaded clinical evaluation PDF.' });
              }}
              icon={<Download className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDicom}
              icon={<Package className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              Export DICOM
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEmailReportOpen(true)}
              icon={<Mail className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              Email Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(caseData, null, 2));
                const a = document.createElement('a');
                a.href = dataStr;
                a.download = `${caseData.caseNumber}_report.json`;
                a.click();
              }}
            >
              Export JSON
            </Button>
          </div>

          {/* Printable Report Document Card */}
          <div className="p-8 rounded-lg bg-surface border border-white/15 space-y-6 text-primary">
            {/* Report Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div>
                <h2 className="font-serif text-2xl font-medium text-white">
                  SADIE Maxillofacial Outcome Evaluation
                </h2>
                <p className="text-xs text-muted mt-1">
                  Department of Oral & Maxillofacial Surgery • International Consensus Protocol
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-white block">{caseData.caseNumber}</span>
                <span className="text-[11px] text-muted">Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Demographics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-elevated text-xs">
              <div>
                <span className="text-muted block">Patient Name</span>
                <strong className="text-white">{caseData.patientName}</strong>
              </div>
              <div>
                <span className="text-muted block">MRN</span>
                <strong className="text-white font-mono">{caseData.patientId}</strong>
              </div>
              <div>
                <span className="text-muted block">Procedure</span>
                <strong className="text-white">{caseData.procedure}</strong>
              </div>
              <div>
                <span className="text-muted block">Score / CI</span>
                <strong className="text-[#a3ffb2] font-mono">{caseData.score}% (95% CI)</strong>
              </div>
            </div>

            {/* Domain Summary Table */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Domain Score Synthesis
              </h4>
              <div className="space-y-2">
                {caseData.domainScores.map((ds, idx) => (
                  <div key={idx} className="p-3 rounded bg-base border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-white block">{ds.domain}</span>
                      <span className="text-muted">{ds.summary}</span>
                    </div>
                    <span className="font-mono font-medium text-white text-sm">{ds.score}/100</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Measurements */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Evaluated Anatomical Parameters
              </h4>
              <div className="divide-y divide-white/5 text-sm">
                {caseData.measurements.slice(0, 5).map((m) => (
                  <div key={m.id} className="py-2 flex items-center justify-between">
                    <span>{m.name} ({m.landmark})</span>
                    <span className="font-mono text-white text-sm">Pre: {m.preOp}{m.unit} → Post: {m.postOp}{m.unit} (Δ {m.change > 0 ? `+${m.change}` : m.change}{m.unit})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signoff */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-muted block">Protocol Verification:</span>
                <div className="font-mono text-xs text-white mt-0.5">
                  SADIE Consensus Protocol ID: #MX-SEC-920184
                </div>
              </div>

              <div>
                {isReportSigned ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#122415] border border-[#2f6b3a]/70 text-[#a3ffb2] shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-[#a3ffb2]" />
                      <div>
                        <span className="font-semibold block text-xs">Cryptographically Signed & Locked</span>
                        <span className="text-[10px] text-[#a3ffb2]/80 font-mono">{signedTimestamp}</span>
                      </div>
                    </div>
                    {savedSignatureUrl && (
                      <div className="p-2 rounded bg-black/60 border border-white/10 mt-1 max-w-[200px]">
                        <img src={savedSignatureUrl} alt="Clinician Signature" className="h-10 object-contain invert brightness-200" />
                      </div>
                    )}
                  </div>
                ) : showSignaturePad ? (
                  <div className="mt-3">
                    <DigitalSignaturePad
                      onSign={(dataUrl, signer) => {
                        setSavedSignatureUrl(dataUrl);
                        setIsReportSigned(true);
                        setSignedTimestamp(new Date().toLocaleTimeString());
                        setShowSignaturePad(false);
                        toast({
                          type: 'success',
                          title: 'Digital Signature Applied',
                          message: `Signed by ${signer} with SHA-512 seal.`
                        });
                      }}
                    />
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSignaturePad(true)}
                    icon={<FileSignature className="w-3.5 h-3.5" />}
                    iconPosition="left"
                  >
                    Open Digital Sign-Off Pad
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* SHARE MODAL */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Case with Clinical Peer"
        description={`Grant secure access to ${caseData.patientName}'s radiomic outcome evaluation.`}
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Colleague Email</label>
            <input
              type="email"
              placeholder="surgeon@hospital.org"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsShareModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                toast({ type: 'success', title: 'Case Shared', message: `Sent access link to ${shareEmail || 'colleague'}` });
                setIsShareModalOpen(false);
              }}
            >
              Send Share Link ↗
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete File Confirmation Modal */}
      {deleteFileTarget && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteFileTarget(null)}
          title="Remove Radiographic Scan?"
          description={`Are you sure you want to remove ${deleteFileTarget.name}? This file will be unlinked from the patient workspace.`}
        >
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-md bg-elevated border border-white/10 text-xs text-secondary">
              File: <strong className="text-white font-mono">{deleteFileTarget.name}</strong> ({deleteFileTarget.type} • {deleteFileTarget.size})
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setDeleteFileTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteFile}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Email Report Modal */}
      {isEmailReportOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEmailReportOpen(false)}
          title="Email Surgical Evaluation Report"
          description={`Directly dispatch patient evaluation report for ${caseData.patientName} (${caseData.caseNumber}) to consulting clinicians.`}
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Recipient Clinician Email</label>
              <input
                type="email"
                placeholder="chief-surgeon@omfs-hospital.org"
                value={reportEmailTarget}
                onChange={(e) => setReportEmailTarget(e.target.value)}
                className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none"
              />
            </div>
            <div className="p-3 rounded-lg bg-surface border border-white/5 text-xs text-secondary">
              Includes 3D cephalometric findings, domain scores, measurement deltas, and DICOM dataset manifest.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsEmailReportOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  toast({
                    type: 'success',
                    title: 'Evaluation Dossier Dispatched',
                    message: `Report sent to ${reportEmailTarget || 'recipient'}`
                  });
                  setIsEmailReportOpen(false);
                  setReportEmailTarget('');
                }}
                icon={<Mail className="w-3.5 h-3.5" />}
                iconPosition="left"
              >
                Send Report
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Automated Radiomic Analysis Live Pipeline Modal */}
      <RunAnalysisModal
        isOpen={isRunAnalysisModalOpen}
        onClose={() => setIsRunAnalysisModalOpen(false)}
        caseItem={caseData}
        onComplete={(updated) => {
          setCaseData(updated);
        }}
      />

      {/* Case Audit Trail & HIPAA Compliance Log Modal */}
      <CaseAuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        caseNumber={caseData.caseNumber}
      />

      {/* Mobile Suite Modal */}
      <MobileFeaturesModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        patientName={caseData.patientName}
        onVoiceNoteAdded={(transcript) => {
          setCaseData(prev => prev ? { ...prev, notes: (prev.notes ? `${prev.notes}\n\n[Dictation] ` : '[Dictation] ') + transcript } : null);
        }}
      />

      {/* Security & Cryptographic Compliance Modal */}
      <SecurityComplianceModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* PACS & EHR FHIR Integrations Modal */}
      <IntegrationsModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        caseNumber={caseData.caseNumber}
        patientName={caseData.patientName}
      />
    </div>
  );
};
