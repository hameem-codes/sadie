import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Play,
  Share2,
  Download,
  Copy,
  Archive,
  Trash2,
  ArrowUpRight,
  RefreshCw,
  FolderKanban,
  Check,
  ChevronDown,
  Eye,
  Star,
  Layers,
  ArrowLeftRight,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  Table as TableIcon,
  ListFilter
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { StatusPill } from '../components/ui/StatusPill';
import { Table, Column } from '../components/ui/Table';
import { VirtualizedTable } from '../components/ui/VirtualizedTable';
import { Modal } from '../components/ui/Modal';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { CaseItem, AnalysisStatus, ProcedureType } from '../types';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';
import { ExecutionDetailsModal } from '../components/cases/ExecutionDetailsModal';
import { RunAnalysisModal } from '../components/cases/RunAnalysisModal';
import { CaseComparisonModal } from '../components/cases/CaseComparisonModal';
import { CaseTemplateModal, CaseTemplate } from '../components/cases/CaseTemplateModal';
import { BatchActionsBar } from '../components/cases/BatchActionsBar';

export const Cases: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'shared'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'all');
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [isProcedureDropdownOpen, setIsProcedureDropdownOpen] = useState(false);
  const [selectedSurgeon, setSelectedSurgeon] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [searchInNotesOnly, setSearchInNotesOnly] = useState(false);

  // Customizable Table Columns
  const [isColumnsDropdownOpen, setIsColumnsDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<{
    caseNumber: boolean;
    patientName: boolean;
    procedure: boolean;
    stage: boolean;
    status: boolean;
    score: boolean;
    lastUpdated: boolean;
  }>({
    caseNumber: true,
    patientName: true,
    procedure: true,
    stage: true,
    status: true,
    score: true,
    lastUpdated: true,
  });

  // Saved Filter Presets
  const [activePreset, setActivePreset] = useState<string>('default');

  // High performance virtualized list toggle
  const [isVirtualizedView, setIsVirtualizedView] = useState(false);

  // Starred / Favorites state
  const [starredCaseIds, setStarredCaseIds] = useState<Set<string>>(() => new Set(['case-101', 'case-104']));
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // Multi-select bulk selection state
  const [selectedCaseIds, setSelectedCaseIds] = useState<Set<string>>(new Set());

  // Active row menu dropdown
  const [menuOpenCaseId, setMenuOpenCaseId] = useState<string | null>(null);

  // Share modal state
  const [shareCase, setShareCase] = useState<CaseItem | null>(null);
  const [shareEmail, setShareEmail] = useState('');

  // Delete modal state
  const [deleteCaseTarget, setDeleteCaseTarget] = useState<CaseItem | null>(null);

  // Archive modal state
  const [archiveCaseTarget, setArchiveCaseTarget] = useState<CaseItem | null>(null);

  // Inspect execution modal state
  const [inspectExecutionCase, setInspectExecutionCase] = useState<CaseItem | null>(null);

  // Live Run Analysis modal state
  const [runAnalysisTargetCase, setRunAnalysisTargetCase] = useState<CaseItem | null>(null);

  // Case Comparison modal state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Case Template modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    loadCases();
  }, [activeTab, selectedStatus, selectedProcedures, selectedSurgeon]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCases({
        search: searchQuery,
        tab: activeTab,
        status: selectedStatus,
        procedure: selectedProcedures.length === 1 ? selectedProcedures[0] : 'all',
        currentUserId: 'usr-1',
      });
      setCases(data);
    } catch (e) {
      toast({ type: 'error', title: 'Failed to fetch cases' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCases();
  };

  const toggleStar = (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredCaseIds(prev => {
      const next = new Set(prev);
      if (next.has(caseId)) {
        next.delete(caseId);
        toast({ type: 'info', title: 'Removed from Favorites' });
      } else {
        next.add(caseId);
        toast({ type: 'success', title: 'Starred Case Added to Favorites' });
      }
      return next;
    });
  };

  const toggleSelectCase = (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCaseIds(prev => {
      const next = new Set(prev);
      if (next.has(caseId)) {
        next.delete(caseId);
      } else {
        next.add(caseId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCaseIds.size === filteredCases.length) {
      setSelectedCaseIds(new Set());
    } else {
      setSelectedCaseIds(new Set(filteredCases.map(c => c.id)));
    }
  };

  const handleRunAnalysis = (c: CaseItem) => {
    setMenuOpenCaseId(null);
    setRunAnalysisTargetCase(c);
  };

  const handleDuplicate = async (c: CaseItem) => {
    setMenuOpenCaseId(null);
    try {
      const dup = await api.duplicateCase(c.id);
      toast({ type: 'success', title: 'Case Duplicated', message: `Created copy: ${dup.caseNumber}` });
      loadCases();
    } catch {
      toast({ type: 'error', title: 'Failed to duplicate case' });
    }
  };

  const handleArchive = (c: CaseItem) => {
    setMenuOpenCaseId(null);
    setArchiveCaseTarget(c);
  };

  const confirmArchive = () => {
    if (!archiveCaseTarget) return;
    toast({ type: 'info', title: 'Case Archived', message: `${archiveCaseTarget.caseNumber} moved to clinical archive.` });
    setCases(prev => prev.filter(c => c.id !== archiveCaseTarget.id));
    setArchiveCaseTarget(null);
  };

  const handleExport = (c: CaseItem) => {
    setMenuOpenCaseId(null);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(c, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${c.caseNumber}_outcome_evaluation.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({ type: 'success', title: 'JSON Export Complete', message: `Exported ${c.caseNumber}` });
  };

  const confirmDelete = async () => {
    if (!deleteCaseTarget) return;
    try {
      await api.deleteCase(deleteCaseTarget.id);
      toast({ type: 'success', title: 'Case Deleted', message: `Removed ${deleteCaseTarget.caseNumber}` });
      setDeleteCaseTarget(null);
      loadCases();
    } catch {
      toast({ type: 'error', title: 'Failed to delete case' });
    }
  };

  // Bulk Operations
  const handleBatchExport = () => {
    const selectedCases = cases.filter(c => selectedCaseIds.has(c.id));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedCases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SADIE_batch_export_${selectedCaseIds.size}_cases.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({
      type: 'success',
      title: 'Batch Export Complete',
      message: `Exported ${selectedCaseIds.size} case datasets in single package.`
    });
    setSelectedCaseIds(new Set());
  };

  const handleBatchAnalyze = () => {
    toast({
      type: 'info',
      title: 'Batch Pipeline Initiated',
      message: `Queued ${selectedCaseIds.size} cases for background volumetric landmark synthesis.`
    });
    setSelectedCaseIds(new Set());
  };

  const handleBatchArchive = () => {
    setCases(prev => prev.filter(c => !selectedCaseIds.has(c.id)));
    toast({
      type: 'info',
      title: 'Batch Archive Complete',
      message: `Moved ${selectedCaseIds.size} cases to clinical archive.`
    });
    setSelectedCaseIds(new Set());
  };

  const handleBatchDelete = () => {
    setCases(prev => prev.filter(c => !selectedCaseIds.has(c.id)));
    toast({
      type: 'warning',
      title: 'Cases Deleted',
      message: `Permanently removed ${selectedCaseIds.size} cases from registry.`
    });
    setSelectedCaseIds(new Set());
  };

  const handleCreateFromTemplate = async (template: CaseTemplate) => {
    try {
      const created = await api.createCase({
        patientName: 'New Patient (Template)',
        procedure: template.procedure,
        stage: template.stage,
        notes: template.defaultNotes,
        age: 26,
        gender: 'Female',
      });
      setCases(prev => [created, ...prev]);
      toast({
        type: 'success',
        title: 'Case Created from Template',
        message: `Instantiated protocol: ${template.name}`
      });
      navigate(`/cases/${created.id}`);
    } catch {
      toast({ type: 'error', title: 'Failed to create case from template' });
    }
  };

  // Filtered dataset
  const filteredCases = cases.filter(c => {
    if (showStarredOnly && !starredCaseIds.has(c.id)) return false;
    if (minScore > 0 && (!c.score || c.score < minScore)) return false;
    if (selectedProcedures.length > 0 && !selectedProcedures.includes(c.procedure)) return false;
    if (selectedSurgeon !== 'all') {
      const surg = selectedSurgeon.toLowerCase();
      const match = c.primarySurgeon?.toLowerCase().includes(surg) || c.notes?.toLowerCase().includes(surg);
      if (!match) return false;
    }
    if (startDate && c.surgeryDate && c.surgeryDate < startDate) return false;
    if (endDate && c.surgeryDate && c.surgeryDate > endDate) return false;
    if (searchQuery) {
      if (searchInNotesOnly) {
        if (!c.notes?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      } else {
        const q = searchQuery.toLowerCase();
        const matches =
          c.patientName.toLowerCase().includes(q) ||
          c.caseNumber.toLowerCase().includes(q) ||
          c.patientId.toLowerCase().includes(q) ||
          c.procedure.toLowerCase().includes(q) ||
          (c.notes && c.notes.toLowerCase().includes(q));
        if (!matches) return false;
      }
    }
    return true;
  });

  // Selected cases for comparison (take first two if multiple selected)
  const compareCasesList = cases.filter(c => selectedCaseIds.has(c.id));
  const caseA = compareCasesList[0] || null;
  const caseB = compareCasesList[1] || null;

  // Table Columns Definition
  const allColumns: Column<CaseItem>[] = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={filteredCases.length > 0 && selectedCaseIds.size === filteredCases.length}
          onChange={toggleSelectAll}
          className="rounded accent-[#8EC5E8] cursor-pointer"
          title="Select all"
        />
      ),
      width: '42px',
      render: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedCaseIds.has(item.id)}
            onChange={(e) => toggleSelectCase(item.id, e as any)}
            className="rounded accent-[#8EC5E8] cursor-pointer"
          />
        </div>
      )
    },
    {
      key: 'favorite',
      header: '',
      width: '36px',
      render: (item) => (
        <button
          type="button"
          onClick={(e) => toggleStar(item.id, e)}
          className="text-muted hover:text-amber-400 transition-colors p-1"
          title={starredCaseIds.has(item.id) ? 'Unstar case' : 'Star case'}
        >
          <Star className={`w-3.5 h-3.5 ${starredCaseIds.has(item.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      )
    },
    {
      key: 'caseNumber',
      header: 'Case ID',
      width: '125px',
      render: (item) => (
        <span className="font-mono text-sm text-white font-medium whitespace-nowrap">
          {item.caseNumber}
        </span>
      )
    },
    {
      key: 'patientName',
      header: 'Patient',
      width: '185px',
      render: (item) => (
        <div className="max-w-[185px]">
          <span className="text-[15px] font-medium text-white block truncate" title={item.patientName}>
            {item.patientName}
          </span>
          <span className="text-[13px] text-muted font-mono whitespace-nowrap">
            {item.patientId} • {item.age}y
          </span>
        </div>
      )
    },
    {
      key: 'procedure',
      header: 'Procedure',
      width: '210px',
      render: (item) => (
        <span className="text-[14px] text-secondary font-medium block truncate max-w-[210px]" title={item.procedure}>
          {item.procedure}
        </span>
      )
    },
    {
      key: 'stage',
      header: 'Stage',
      width: '165px',
      render: (item) => (
        <span className="text-[13px] text-muted block truncate max-w-[165px]" title={item.stage}>
          {item.stage}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Analysis Status',
      width: '135px',
      render: (item) => (
        <div className="whitespace-nowrap">
          <StatusPill status={item.status} size="md" />
        </div>
      )
    },
    {
      key: 'score',
      header: 'Score',
      width: '75px',
      align: 'center',
      render: (item) => item.score ? (
        <span className="font-mono font-medium text-[13px] sm:text-sm text-[#a3ffb2] bg-[#122415] px-2.5 py-0.5 rounded-pill border border-[#2f6b3a]/70 whitespace-nowrap">
          <AnimatedNumber value={`${item.score}%`} />
        </span>
      ) : (
        <span className="text-muted text-sm">—</span>
      )
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      width: '120px',
      render: (item) => (
        <span className="text-[13px] text-muted whitespace-nowrap">{item.lastUpdated}</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '112px',
      align: 'right',
      render: (item) => (
        <div className={`relative flex items-center justify-end gap-1.5 whitespace-nowrap min-w-[95px] ${menuOpenCaseId === item.id ? 'z-50' : 'z-10'}`} onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/cases/${item.id}`)}
            className="text-sm text-secondary hover:text-white px-2.5 py-1"
          >
            Open
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpenCaseId(menuOpenCaseId === item.id ? null : item.id)}
            aria-label="Case actions menu"
            className="text-muted hover:text-white h-8 w-8"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {/* Row Actions Dropdown */}
          {menuOpenCaseId === item.id && (
            <div className="absolute right-0 top-10 w-44 bg-[#16171d] rounded-lg shadow-2xl border border-white/20 p-1.5 z-50 animate-fade-up">
              <button
                type="button"
                onClick={() => {
                  setMenuOpenCaseId(null);
                  setInspectExecutionCase(item);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-secondary hover:text-white hover:bg-elevated rounded cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#8EC5E8]" />
                Inspect
              </button>
              <button
                type="button"
                onClick={() => handleRunAnalysis(item)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-secondary hover:text-white hover:bg-elevated rounded"
              >
                <Play className="w-3.5 h-3.5 text-status-completed" />
                Run Analysis
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpenCaseId(null);
                  setShareCase(item);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-secondary hover:text-white hover:bg-elevated rounded"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              <button
                type="button"
                onClick={() => handleExport(item)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-secondary hover:text-white hover:bg-elevated rounded"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => handleDuplicate(item)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-secondary hover:text-white hover:bg-elevated rounded"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => handleArchive(item)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-secondary hover:text-white hover:bg-elevated rounded"
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
              <div className="pt-1 mt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpenCaseId(null);
                    setDeleteCaseTarget(item);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Case
                </button>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  const columns = allColumns.filter(col => {
    if (col.key === 'select' || col.key === 'favorite' || col.key === 'actions') return true;
    return visibleColumns[col.key as keyof typeof visibleColumns] ?? true;
  });

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    if (presetKey === 'default') {
      setSelectedStatus('all');
      setSelectedProcedures([]);
      setSelectedSurgeon('all');
      setMinScore(0);
      setShowStarredOnly(false);
      setStartDate('');
      setEndDate('');
    } else if (presetKey === 'active-preop') {
      setSelectedStatus('processing');
      setSelectedProcedures([]);
      setMinScore(0);
      setShowStarredOnly(false);
    } else if (presetKey === 'high-score') {
      setSelectedStatus('all');
      setMinScore(90);
      setShowStarredOnly(false);
    } else if (presetKey === 'needs-review') {
      setSelectedStatus('failed');
      setMinScore(0);
      setShowStarredOnly(false);
    } else if (presetKey === 'orthognathic') {
      setSelectedStatus('all');
      setSelectedProcedures(['Bimaxillary Osteotomy', 'Le Fort I Osteotomy', 'BSSO (Bilateral Sagittal Split)']);
      setShowStarredOnly(false);
    } else if (presetKey === 'starred') {
      setShowStarredOnly(true);
    }
    toast({ type: 'info', title: 'Filter Preset Applied', message: `Preset '${presetKey}' activated.` });
  };

  const ALL_PROCEDURES: ProcedureType[] = [
    'Bimaxillary Osteotomy',
    'Le Fort I Osteotomy',
    'BSSO (Bilateral Sagittal Split)',
    'Genioplasty',
    'Mandibular Reconstruction (Fibula)',
    'TMJ Alloplastic Replacement',
    'SARPE (Palatal Expansion)',
    'ZMC Fracture Repair'
  ];

  const toggleProcedure = (proc: string) => {
    setSelectedProcedures(prev => {
      if (prev.includes(proc)) {
        return prev.filter(p => p !== proc);
      } else {
        return [...prev, proc];
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-drop-down">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Cases Directory
          </h1>
          <p className="text-xs text-muted mt-1">
            Maxillofacial surgical outcome records, multiplanar DICOM series & CAD/CAM models
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Compare Button (enabled when 2 cases selected) */}
          <Button
            variant="outline"
            size="md"
            disabled={selectedCaseIds.size !== 2}
            onClick={() => setIsCompareModalOpen(true)}
            icon={<ArrowLeftRight className="w-4 h-4 text-[#8EC5E8]" />}
            iconPosition="left"
            className="border-white/15"
          >
            Compare (2)
          </Button>

          {/* New from Template Button */}
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsTemplateModalOpen(true)}
            icon={<Layers className="w-4 h-4 text-[#a3ffb2]" />}
            iconPosition="left"
            className="border-white/15"
          >
            From Template
          </Button>

          {/* New Case Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              const evt = new CustomEvent('open-new-case');
              window.dispatchEvent(evt);
            }}
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            New Case
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 p-4 rounded-xl bg-surface/60 border border-border-hairline animate-drop-down" style={{ animationDelay: '80ms' }}>
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4.5 h-4.5 text-muted absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder={searchInNotesOnly ? "Full-text search in operative notes..." : "Search patient, MRN, procedure, or notes..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-border-hairline rounded-pill pl-10 pr-4 py-2.5 text-sm sm:text-base text-primary placeholder-muted focus:outline-none focus:border-white/40"
            />
          </form>

          {/* Quick Filter Tabs & Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Chip
              active={activeTab === 'all' && !showStarredOnly}
              onClick={() => {
                setActiveTab('all');
                setShowStarredOnly(false);
              }}
              count={cases.length}
            >
              All Cases
            </Chip>
            <Chip
              active={activeTab === 'mine'}
              onClick={() => {
                setActiveTab('mine');
                setShowStarredOnly(false);
              }}
            >
              My Cases
            </Chip>
            <Chip
              active={showStarredOnly}
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              count={starredCaseIds.size}
            >
              ⭐ Starred
            </Chip>

            {/* Saved Filter Presets Dropdown */}
            <select
              value={activePreset}
              onChange={(e) => applyPreset(e.target.value)}
              className="bg-elevated border border-white/10 rounded-pill px-3 py-1.5 text-xs text-secondary hover:text-white focus:outline-none cursor-pointer"
              title="Filter Presets"
            >
              <option value="default">Presets: All / Custom</option>
              <option value="active-preop">⚡ Active Pre-Op</option>
              <option value="high-score">⭐ High Score (&gt;90%)</option>
              <option value="needs-review">⚠️ Needs Review</option>
              <option value="orthognathic">🦴 Orthognathic Cohort</option>
              <option value="starred">⭐ Starred Only</option>
            </select>

            {/* Customizable Table Columns Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColumnsDropdownOpen(!isColumnsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-mono transition-all cursor-pointer ${
                  isColumnsDropdownOpen
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-elevated border border-white/10 text-secondary hover:text-white'
                }`}
                title="Customize visible table columns"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Columns</span>
              </button>

              {isColumnsDropdownOpen && (
                <div className="absolute right-0 top-9 w-52 bg-[#16171d] rounded-xl shadow-2xl border border-white/20 p-3 z-50 animate-fade-up space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">Visible Columns</span>
                  {[
                    { key: 'caseNumber' as const, label: 'Case ID' },
                    { key: 'patientName' as const, label: 'Patient' },
                    { key: 'procedure' as const, label: 'Procedure' },
                    { key: 'stage' as const, label: 'Surgical Stage' },
                    { key: 'status' as const, label: 'Analysis Status' },
                    { key: 'score' as const, label: 'Outcome Score' },
                    { key: 'lastUpdated' as const, label: 'Last Updated' },
                  ].map((col) => (
                    <label key={col.key} className="flex items-center justify-between text-secondary hover:text-white cursor-pointer py-0.5">
                      <span>{col.label}</span>
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.key]}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, [col.key]: !prev[col.key] }))}
                        className="rounded accent-[#8EC5E8] cursor-pointer"
                      />
                    </label>
                  ))}
                  <div className="pt-2 border-t border-white/10 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsColumnsDropdownOpen(false)}
                      className="text-[11px] text-[#8EC5E8] hover:underline"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Virtualized List Mode */}
            <button
              type="button"
              onClick={() => setIsVirtualizedView(!isVirtualizedView)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-mono transition-all cursor-pointer ${
                isVirtualizedView
                  ? 'bg-[#8EC5E8] text-black font-semibold'
                  : 'bg-elevated border border-white/10 text-secondary hover:text-white'
              }`}
              title="Toggle virtualized table rendering for 100+ cases"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{isVirtualizedView ? 'Virtualized' : 'Standard'}</span>
            </button>
          </div>
        </div>

        {/* Filter Chips: Status, Procedure Multi-Select, Score & Advanced Toggle */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2.5 text-sm">
          <span className="text-muted flex items-center gap-1.5 font-medium mr-1 text-sm">
            <Filter className="w-4 h-4" /> Filter by:
          </span>

          {/* Status Chips */}
          {['all', 'completed', 'processing', 'failed', 'draft'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-pill transition-all capitalize font-medium text-xs ${
                selectedStatus === st
                  ? 'bg-white text-base shadow-sm'
                  : 'bg-elevated text-secondary hover:text-white border border-border-hairline'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="text-white/20 mx-1">|</span>

          {/* Multi-Select Procedure Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProcedureDropdownOpen(!isProcedureDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium transition-all cursor-pointer ${
                selectedProcedures.length > 0
                  ? 'bg-[#8EC5E8] text-black font-semibold shadow-sm'
                  : 'bg-elevated text-secondary hover:text-white border border-border-hairline'
              }`}
            >
              <span>
                {selectedProcedures.length === 0
                  ? 'All Procedures'
                  : `${selectedProcedures.length} Selected`}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isProcedureDropdownOpen && (
              <div className="absolute left-0 top-8 w-64 bg-[#16171d] rounded-xl shadow-2xl border border-white/20 p-3 z-50 animate-fade-up space-y-1.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Select Procedures</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProcedures(ALL_PROCEDURES)}
                      className="text-[10px] text-[#8EC5E8] hover:underline"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProcedures([])}
                      className="text-[10px] text-muted hover:text-white hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {ALL_PROCEDURES.map((proc) => {
                    const isSelected = selectedProcedures.includes(proc);
                    return (
                      <label
                        key={proc}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer text-xs"
                      >
                        <span className={`truncate mr-2 ${isSelected ? 'text-white font-medium' : 'text-secondary'}`}>
                          {proc}
                        </span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProcedure(proc)}
                          className="rounded accent-[#8EC5E8] cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsProcedureDropdownOpen(false)}
                    className="text-[11px] text-[#8EC5E8] hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Score Slider Filter */}
          <div className="flex items-center gap-1.5 bg-elevated/80 border border-border-hairline rounded-pill px-3 py-1 text-xs">
            <span className="text-muted text-[11px] whitespace-nowrap">Min Score:</span>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="accent-[#8EC5E8] w-16 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-white w-7 text-right">{minScore ? `${minScore}%` : 'Any'}</span>
          </div>

          {/* Advanced Filter Expansion Toggle */}
          <button
            type="button"
            onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-pill text-xs transition-colors cursor-pointer ${
              isAdvancedFiltersOpen ? 'bg-white/10 text-white border border-white/20' : 'text-muted hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
          </button>

          {(selectedStatus !== 'all' || selectedProcedures.length > 0 || minScore > 0 || searchQuery || showStarredOnly || startDate || endDate || selectedSurgeon !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('all');
                setSelectedProcedures([]);
                setSelectedSurgeon('all');
                setMinScore(0);
                setSearchQuery('');
                setShowStarredOnly(false);
                setStartDate('');
                setEndDate('');
                setActivePreset('default');
              }}
              className="text-muted hover:text-white text-xs underline ml-auto cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Expandable Advanced Filters: Date Range, Surgeon, Notes Search, Save Preset */}
        {isAdvancedFiltersOpen && (
          <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fade-up">
            {/* Date Range Picker */}
            <div className="space-y-1">
              <span className="text-muted text-[11px] block">Date Range (Case Ingestion):</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-base border border-white/15 rounded-md px-2 py-1 text-xs text-white"
                />
                <span className="text-muted">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-base border border-white/15 rounded-md px-2 py-1 text-xs text-white"
                />
              </div>
            </div>

            {/* Surgeon Dropdown */}
            <div className="space-y-1">
              <span className="text-muted text-[11px] block">Primary Surgeon / Team:</span>
              <select
                value={selectedSurgeon}
                onChange={(e) => setSelectedSurgeon(e.target.value)}
                className="w-full bg-base border border-white/15 rounded-md px-2.5 py-1 text-xs text-white"
              >
                <option value="all">All Surgical Teams</option>
                <option value="vance">Dr. Evelyn Vance, MD, DDS</option>
                <option value="sterling">Dr. Marcus Sterling, DMD</option>
                <option value="chen">Dr. Soraya Chen, MD</option>
                <option value="mansoor">Dr. Tariq Al-Mansoor, DDS</option>
              </select>
            </div>

            {/* Full-text Notes Search & Save Preset */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notes-only"
                  checked={searchInNotesOnly}
                  onChange={(e) => setSearchInNotesOnly(e.target.checked)}
                  className="rounded accent-[#8EC5E8] cursor-pointer"
                />
                <label htmlFor="notes-only" className="text-secondary text-xs cursor-pointer select-none">
                  Full-text search in case notes only
                </label>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('sadie_saved_case_filters', JSON.stringify({
                      status: selectedStatus,
                      procedures: selectedProcedures,
                      surgeon: selectedSurgeon,
                      minScore,
                      startDate,
                      endDate
                    }));
                    toast({
                      type: 'success',
                      title: 'Filter Preset Saved',
                      message: 'Current filter configuration stored to local presets.'
                    });
                  }}
                  className="text-xs text-[#8EC5E8] hover:text-white underline cursor-pointer"
                >
                  Save Current Filter Preset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Table: Standard Table or Virtualized Table */}
      <div className="animate-slide-up w-full min-w-0" style={{ animationDelay: '160ms' }}>
        {isVirtualizedView ? (
          <VirtualizedTable
            columns={columns}
            data={filteredCases}
            keyExtractor={(c) => c.id}
            onRowClick={(c) => navigate(`/cases/${c.id}`)}
            emptyMessage="No maxillofacial cases matching selected filters."
            height={520}
            rowHeight={64}
          />
        ) : (
          <Table
            columns={columns}
            data={filteredCases}
            keyExtractor={(c) => c.id}
            onRowClick={(c) => navigate(`/cases/${c.id}`)}
            isLoading={isLoading}
            emptyMessage="No maxillofacial cases matching selected filters."
            tableLayout="fixed"
          />
        )}
      </div>

      {/* Bulk Floating Actions Bar */}
      <BatchActionsBar
        selectedCount={selectedCaseIds.size}
        onClearSelection={() => setSelectedCaseIds(new Set())}
        onBatchExport={handleBatchExport}
        onBatchAnalyze={handleBatchAnalyze}
        onBatchArchive={handleBatchArchive}
        onBatchDelete={handleBatchDelete}
      />

      {/* Share Modal */}
      {shareCase && (
        <Modal
          isOpen={true}
          onClose={() => setShareCase(null)}
          title={`Share Case ${shareCase.caseNumber}`}
          description={`Share radiographic outcome data for ${shareCase.patientName} with surgical colleagues.`}
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">
                Colleague Email or Health System ID
              </label>
              <input
                type="email"
                placeholder="colleague@sadie-omfs.org"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none"
              />
            </div>
            <div className="p-3 rounded-lg bg-surface border border-white/5 text-xs text-secondary">
              Shared collaborators receive read-only access to multiplanar CT reconstructions, cephalometric metrics, and SADIE outcome confidence scores.
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShareCase(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  toast({ type: 'success', title: 'Case Shared', message: `Invitation sent to ${shareEmail || 'colleague'}` });
                  setShareCase(null);
                }}
              >
                Send Invite ↗
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCaseTarget && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteCaseTarget(null)}
          title="Delete Maxillofacial Case?"
          description="Are you sure you want to permanently delete this clinical case and all attached DICOM files?"
        >
          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-md bg-[#361515] border border-[#c8623c]/40 text-xs text-[#fca582]">
              Warning: Case {deleteCaseTarget.caseNumber} ({deleteCaseTarget.patientName}) and all associated measurements, evidence chains, and 3D segmentation results will be permanently removed.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setDeleteCaseTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Archive Confirmation Modal */}
      {archiveCaseTarget && (
        <Modal
          isOpen={true}
          onClose={() => setArchiveCaseTarget(null)}
          title="Archive Clinical Case?"
          description="Moving this case to the archive will remove it from the active registry while preserving all surgical rubrics and radiographic scans."
        >
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-md bg-elevated border border-white/10 text-xs text-secondary">
              Case <strong className="text-white">{archiveCaseTarget.caseNumber}</strong> ({archiveCaseTarget.patientName}) will be marked as archived. You can restore it anytime from archived filters.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setArchiveCaseTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmArchive}>
                Confirm Archive
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Execution Details Inspection Modal */}
      <ExecutionDetailsModal
        isOpen={!!inspectExecutionCase}
        onClose={() => setInspectExecutionCase(null)}
        caseItem={inspectExecutionCase}
        onRerun={(c) => handleRunAnalysis(c)}
      />

      {/* Live Run Analysis Pipeline Modal */}
      <RunAnalysisModal
        isOpen={!!runAnalysisTargetCase}
        onClose={() => setRunAnalysisTargetCase(null)}
        caseItem={runAnalysisTargetCase}
        onComplete={() => {
          loadCases();
        }}
      />

      {/* Side-by-Side Case Comparison Modal */}
      <CaseComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        caseA={caseA}
        caseB={caseB}
      />

      {/* Case Template Modal */}
      <CaseTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleCreateFromTemplate}
      />
    </div>
  );
};
