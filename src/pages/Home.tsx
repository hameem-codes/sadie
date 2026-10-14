import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  RefreshCw,
  FolderKanban,
  FileText,
  ChevronRight,
  ShieldAlert,
  TrendingUp,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { KpiCard } from '../components/ui/KpiCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { StatusPill } from '../components/ui/StatusPill';
import { Table, Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { CaseItem } from '../types';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';
import { OutcomeHeatmap, QuarterlyReportModal } from '../components/analytics/HeatmapAndReports';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCustomizeWidgetsOpen, setIsCustomizeWidgetsOpen] = useState(false);

  const [visibleWidgets, setVisibleWidgets] = useState<{
    kpiCards: boolean;
    trajectoryChart: boolean;
    procedureStats: boolean;
    activityFeed: boolean;
    needsAttention: boolean;
    outcomeHeatmap: boolean;
    recentTable: boolean;
  }>(() => {
    const saved = localStorage.getItem('sadie_home_widgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      kpiCards: true,
      trajectoryChart: true,
      procedureStats: true,
      activityFeed: true,
      needsAttention: true,
      outcomeHeatmap: true,
      recentTable: true,
    };
  });

  const toggleWidget = (key: keyof typeof visibleWidgets) => {
    setVisibleWidgets(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('sadie_home_widgets', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allCases = await api.getCases();
      setCases(allCases);
    } catch (e) {
      toast({ type: 'error', title: 'Error loading cases' });
    } finally {
      setIsLoading(false);
    }
  };

  const completedCases = cases.filter(c => c.status === 'completed');
  const inProgressCases = cases.filter(c => c.status === 'processing');
  const needsAttentionCases = cases.filter(c => c.status === 'failed' || c.status === 'processing');
  
  const avgScore = completedCases.length > 0
    ? (completedCases.reduce((acc, c) => acc + (c.score || 0), 0) / completedCases.length).toFixed(1)
    : '92.4';

  const recentCases = [...cases].slice(0, 6);

  const handleRetryAnalysis = async (e: React.MouseEvent, caseId: string) => {
    e.stopPropagation();
    toast({ type: 'info', title: 'Rerunning Evaluator', message: 'Running artifact reduction filter & landmark locator...' });
    try {
      const updated = await api.runAnalysis(caseId);
      toast({ type: 'success', title: 'Analysis Complete', message: `Score: ${updated.score}%` });
      loadData();
    } catch (err) {
      toast({ type: 'error', title: 'Analysis failed' });
    }
  };

  const recentColumns: Column<CaseItem>[] = [
    {
      key: 'caseNumber',
      header: 'Case ID',
      width: '125px',
      render: (item) => (
        <span className="font-mono text-sm text-white/90 font-medium whitespace-nowrap">
          {item.caseNumber}
        </span>
      )
    },
    {
      key: 'patientName',
      header: 'Patient',
      render: (item) => (
        <div className="min-w-[140px]">
          <div className="text-[15px] font-medium text-white truncate" title={item.patientName}>{item.patientName}</div>
          <div className="text-[13px] text-muted font-mono whitespace-nowrap">{item.patientId} • {item.age}y {item.gender[0]}</div>
        </div>
      )
    },
    {
      key: 'procedure',
      header: 'Procedure',
      render: (item) => (
        <span className="text-secondary text-[14px] font-medium min-w-[130px] max-w-xs block truncate" title={item.procedure}>{item.procedure}</span>
      )
    },
    {
      key: 'stage',
      header: 'Surgical Stage',
      render: (item) => (
        <span className="text-muted text-[13px] min-w-[110px] block truncate" title={item.stage}>{item.stage}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <div className="whitespace-nowrap">
          <StatusPill status={item.status} size="md" />
        </div>
      )
    },
    {
      key: 'score',
      header: 'Outcome Score',
      align: 'right',
      render: (item) => item.score ? (
        <span className="font-mono font-medium text-[15px] text-[#a3ffb2] bg-[#122415] px-3 py-1 rounded-pill border border-[#2f6b3a]/70 whitespace-nowrap">
          <AnimatedNumber value={`${item.score}%`} />
        </span>
      ) : (
        <span className="text-muted text-sm font-mono">—</span>
      )
    },
    {
      key: 'actions',
      header: '',
      width: '90px',
      align: 'right',
      render: (item) => (
        <div className="whitespace-nowrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/cases/${item.id}`);
            }}
            className="text-sm text-secondary hover:text-white px-3 py-1.5"
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            Open
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome with Eyebrow Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10 animate-drop-down">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Maxillofacial Surgical Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsCustomizeWidgetsOpen(true)}
            icon={<SlidersHorizontal className="w-4 h-4 text-[#8EC5E8]" />}
            iconPosition="left"
            className="border-white/15"
            title="Configure visible dashboard widgets"
          >
            Customize
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReportModalOpen(true)}
            icon={<TrendingUp className="w-4 h-4 text-[#8EC5E8]" />}
            iconPosition="left"
            className="border-white/15"
          >
            Quarterly Report
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={loadData}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            iconPosition="left"
          >
            Sync Data
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/cases')}
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            All Cases
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards (Total Cases, In Progress, Completed, Avg Score) */}
      {visibleWidgets.kpiCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <KpiCard
            title="Total Cases"
            value={cases.length}
            change="+18% this quarter"
            isPositive={true}
            icon={<FolderKanban className="w-4 h-4 text-sky-400" />}
            onClick={() => navigate('/cases')}
            className="animate-card-in"
            style={{ animationDelay: '40ms' }}
          />
          <KpiCard
            title="In Progress"
            value={inProgressCases.length}
            badge="Active"
            change="4.2m avg latency"
            isPositive={true}
            icon={<Clock className="w-4 h-4 text-status-processing" />}
            onClick={() => navigate('/cases?status=processing')}
            className="animate-card-in"
            style={{ animationDelay: '90ms' }}
          />
          <KpiCard
            title="Completed"
            value={completedCases.length}
            change="98.2% adherence"
            isPositive={true}
            icon={<CheckCircle2 className="w-4 h-4 text-status-completed" />}
            onClick={() => navigate('/cases?status=completed')}
            className="animate-card-in"
            style={{ animationDelay: '140ms' }}
          />
          <KpiCard
            title="Average Score"
            value={`${avgScore}%`}
            badge="v3.2"
            change="+2.4% vs benchmark"
            isPositive={true}
            icon={<Sparkles className="w-4 h-4 text-white" />}
            onClick={() => navigate('/insights')}
            className="animate-card-in"
            style={{ animationDelay: '190ms' }}
          />
        </div>
      )}

      {/* CLINICAL ANALYTICS: Longitudinal Outcome Trajectory & Recent Activity Feed */}
      {(visibleWidgets.trajectoryChart || visibleWidgets.activityFeed) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '240ms' }}>
          {/* Outcome Trajectory & Success Rates Widget (2 cols or full if activity hidden) */}
          {visibleWidgets.trajectoryChart && (
            <div className={`${visibleWidgets.activityFeed ? 'lg:col-span-2' : 'lg:col-span-3'} p-5 rounded-xl bg-surface/40 border border-border-hairline flex flex-col justify-between space-y-4`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-elevated border border-white/10 text-[#8EC5E8]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-medium text-white">
                      Longitudinal Surgical Trajectory
                    </h3>
                    <p className="text-xs text-muted">
                      3D Radiomic cephalometric score progression across clinical cohorts
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#a3ffb2] bg-[#122415] px-2.5 py-1 rounded-pill border border-[#2f6b3a]/70">
                  <AnimatedNumber value="+6.2%" /> 6-Mo Gain
                </span>
              </div>

              {/* SVG Trend Curve */}
              <div className="relative pt-2 pb-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-2">
                  <span>Cohort May</span>
                  <span>Cohort Jul</span>
                  <span>Cohort Sep</span>
                  <span className="text-[#a3ffb2] font-semibold">Active Cohort (Oct)</span>
                </div>
                <div className="h-28 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 90" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8EC5E8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8EC5E8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M 10 70 Q 130 50, 240 32 T 390 12 L 390 90 L 10 90 Z"
                      fill="url(#curveGradient)"
                    />
                    {/* Curve line */}
                    <path
                      d="M 10 70 Q 130 50, 240 32 T 390 12"
                      fill="none"
                      stroke="#8EC5E8"
                      strokeWidth="2.5"
                    />
                    {/* Points */}
                    <circle cx="10" cy="70" r="4" fill="#8EC5E8" stroke="#000" strokeWidth="1.5" />
                    <circle cx="130" cy="50" r="4" fill="#8EC5E8" stroke="#000" strokeWidth="1.5" />
                    <circle cx="250" cy="30" r="4" fill="#8EC5E8" stroke="#000" strokeWidth="1.5" />
                    <circle cx="390" cy="12" r="5" fill="#a3ffb2" stroke="#000" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Procedure Success Rates Quick Breakdown */}
              {visibleWidgets.procedureStats && (
                <div className="pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-elevated/70 border border-white/5">
                    <span className="text-muted block text-[11px] truncate">Bimaxillary</span>
                    <span className="text-white font-mono font-medium text-sm">
                      <AnimatedNumber value="94.2%" />
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-elevated/70 border border-white/5">
                    <span className="text-muted block text-[11px] truncate">Le Fort I</span>
                    <span className="text-white font-mono font-medium text-sm">
                      <AnimatedNumber value="92.8%" />
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-elevated/70 border border-white/5">
                    <span className="text-muted block text-[11px] truncate">BSSO Split</span>
                    <span className="text-white font-mono font-medium text-sm">
                      <AnimatedNumber value="96.1%" />
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-elevated/70 border border-white/5">
                    <span className="text-muted block text-[11px] truncate">Genioplasty</span>
                    <span className="text-white font-mono font-medium text-sm">
                      <AnimatedNumber value="97.1%" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Activity Feed (1 col or full if trajectory hidden) */}
          {visibleWidgets.activityFeed && (
            <div className={`${visibleWidgets.trajectoryChart ? 'lg:col-span-1' : 'lg:col-span-3'} p-5 rounded-xl bg-surface/40 border border-border-hairline flex flex-col justify-between space-y-3`}>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#8EC5E8]" />
                  <h3 className="font-serif text-base font-medium text-white">
                    Clinical Activity Feed
                  </h3>
                </div>
                <span className="text-[10px] text-muted font-mono uppercase">Live</span>
              </div>

              <div className="space-y-3 flex-1 overflow-hidden">
                {[
                  {
                    title: '3D Cephalometric sign-off',
                    detail: 'Eleanor Vance-Cole (MX-2026-0891)',
                    time: '12m ago',
                    user: 'Clinical Protocol'
                  },
                  {
                    title: 'Volumetric Airway Segmented',
                    detail: 'Julian Hayes (MX-2026-0892)',
                    time: '45m ago',
                    user: 'SADIE AI'
                  },
                  {
                    title: 'Virtual Splint STL Imported',
                    detail: 'Maya Lin-Patel (MX-2026-0893)',
                    time: '2h ago',
                    user: 'CAD/CAM Wafer'
                  },
                  {
                    title: 'Stability Evaluation Complete',
                    detail: 'Sophia Montgomery (MX-2026-0895)',
                    time: '3h ago',
                    user: 'Biomechanical Model'
                  }
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-[#8EC5E8] mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{act.title}</p>
                      <p className="text-[11px] text-muted truncate">{act.detail}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Needs Clinical Attention (Compact 3-Card Grid between Analytics and Recent Evaluations) */}
      {visibleWidgets.needsAttention && needsAttentionCases.length > 0 && (
        <div className="space-y-2.5 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-status-failed" />
              <h2 className="font-serif text-lg font-medium text-white">
                Needs Clinical Attention
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-pill bg-[#361515] text-[#fca582] border border-[#c8623c]/40 font-mono font-medium">
                {needsAttentionCases.length} Cases
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {needsAttentionCases.map((c, idx) => (
              <div
                key={c.id}
                style={{ animationDelay: `${340 + idx * 60}ms` }}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="p-3.5 rounded-xl border-l-2 border-l-[#C8623C] border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col justify-between cursor-pointer group animate-card-in"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[11px] text-muted">{c.caseNumber}</span>
                    <StatusPill status={c.status} size="sm" />
                  </div>
                  <h3
                    title={c.patientName}
                    className="font-serif text-sm font-medium text-white mt-1 group-hover:text-[#8EC5E8] transition-colors truncate"
                  >
                    {c.patientName}
                  </h3>
                  <p
                    title={`${c.procedure} • ${c.stage}`}
                    className="text-[11px] text-secondary/70 truncate mt-0.5"
                  >
                    {c.procedure} • {c.stage}
                  </p>

                  <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-secondary/90 leading-snug line-clamp-2">
                    <span className="text-[#fca582] font-medium mr-1 font-mono text-[10px]">Notice:</span>
                    {c.attentionReason || 'Processing radiomic segmentation across CT volume.'}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-muted font-mono">
                    {c.caseNumber}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {c.status === 'failed' && (
                      <button
                        type="button"
                        onClick={(e) => handleRetryAnalysis(e, c.id)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors cursor-pointer"
                        title="Retry Analysis"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Retry
                      </button>
                    )}
                    <span className="text-[10px] text-secondary group-hover:text-white flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SURGICAL OUTCOME HEATMAP by Procedure & Domain */}
      {visibleWidgets.outcomeHeatmap && (
        <div className="animate-slide-up" style={{ animationDelay: '360ms' }}>
          <OutcomeHeatmap />
        </div>
      )}

      {/* Recent Cases Section */}
      {visibleWidgets.recentTable && (
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '420ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-medium text-white">
                Recent Evaluations
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cases')}
              className="text-sm text-secondary hover:text-white"
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              View All ({cases.length})
            </Button>
          </div>

          <div className="w-full min-w-0">
            <Table
              columns={recentColumns}
              data={recentCases}
              keyExtractor={(c) => c.id}
              onRowClick={(c) => navigate(`/cases/${c.id}`)}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Customize Dashboard Widgets Modal */}
      <Modal
        isOpen={isCustomizeWidgetsOpen}
        onClose={() => setIsCustomizeWidgetsOpen(false)}
        title="Customize Dashboard Layout"
        description="Toggle visible clinical analytics widgets and panels. Your layout preferences are automatically saved."
      >
        <div className="space-y-3 pt-2">
          {[
            { key: 'kpiCards' as const, label: 'Key Performance Indicators (KPIs)', desc: 'Total cases, in progress, completed, average score' },
            { key: 'trajectoryChart' as const, label: 'Longitudinal Surgical Trajectory', desc: 'Surgical outcome trend curve across clinical cohorts' },
            { key: 'procedureStats' as const, label: 'Procedure Success Breakdown', desc: 'Average success rates across Bimax, Le Fort, BSSO, Genio' },
            { key: 'activityFeed' as const, label: 'Live Clinical Activity Feed', desc: 'Recent system segmentation, CAD/CAM, and review actions' },
            { key: 'needsAttention' as const, label: 'Needs Clinical Attention Notices', desc: 'Cases with active notices or failed radiomic tasks' },
            { key: 'outcomeHeatmap' as const, label: 'Surgical Outcome Heatmap', desc: 'Domain score density matrix by procedure type' },
            { key: 'recentTable' as const, label: 'Recent Evaluations Registry Table', desc: 'Interactive table of most recently processed cases' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start justify-between p-3 rounded-xl bg-elevated/70 border border-white/5 hover:border-white/15 cursor-pointer transition-all"
            >
              <div className="pr-3">
                <span className="text-sm font-medium text-white block">{item.label}</span>
                <span className="text-xs text-muted block mt-0.5">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={visibleWidgets[item.key]}
                onChange={() => toggleWidget(item.key)}
                className="rounded accent-[#8EC5E8] w-4 h-4 mt-0.5 cursor-pointer"
              />
            </label>
          ))}

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                const allOn = {
                  kpiCards: true,
                  trajectoryChart: true,
                  procedureStats: true,
                  activityFeed: true,
                  needsAttention: true,
                  outcomeHeatmap: true,
                  recentTable: true,
                };
                setVisibleWidgets(allOn);
                localStorage.setItem('sadie_home_widgets', JSON.stringify(allOn));
                toast({ type: 'info', title: 'Widgets Reset', message: 'All dashboard widgets restored to visible.' });
              }}
              className="text-xs text-secondary hover:text-white underline cursor-pointer"
            >
              Reset to Defaults
            </button>
            <Button variant="primary" size="sm" onClick={() => setIsCustomizeWidgetsOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quarterly Performance Audit Modal */}
      <QuarterlyReportModal
        isReportModalOpen={isReportModalOpen}
        onCloseReportModal={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
