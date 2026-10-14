import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import {
  Filter,
  TrendingUp,
  BarChart2,
  GitCompare,
  Sparkles,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { mockCases } from '../data/mockData';
import { CaseItem } from '../types';
import { useToast } from '../components/ui/Toast';

export const Insights: React.FC = () => {
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<'scores' | 'trends' | 'compare'>('scores');
  const [procedureFilter, setProcedureFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  // Case Compare states
  const [compareCaseId1, setCompareCaseId1] = useState(mockCases[0]?.id || '');
  const [compareCaseId2, setCompareCaseId2] = useState(mockCases[1]?.id || '');

  const case1 = mockCases.find(c => c.id === compareCaseId1) || mockCases[0];
  const case2 = mockCases.find(c => c.id === compareCaseId2) || mockCases[1];

  // Score distribution data
  const scoreDistributionData = [
    { range: '80–84%', count: 1 },
    { range: '85–89%', count: 3 },
    { range: '90–94%', count: 5 },
    { range: '95–98%', count: 3 },
  ];

  // Domain performance data
  const domainData = [
    { domain: 'Occlusion', score: 95.8, target: 90 },
    { domain: 'Symmetry', score: 92.4, target: 90 },
    { domain: 'Soft Tissue', score: 94.6, target: 90 },
    { domain: 'Airway Safety', score: 93.1, target: 90 },
  ];

  // Longitudinal Trends data
  const trendsData = [
    { month: 'May', avgScore: 89.2, volume: 8, confidence: 93.4 },
    { month: 'Jun', avgScore: 90.8, volume: 11, confidence: 94.1 },
    { month: 'Jul', avgScore: 92.0, volume: 14, confidence: 95.2 },
    { month: 'Aug', avgScore: 93.4, volume: 16, confidence: 95.8 },
    { month: 'Sep', avgScore: 94.1, volume: 18, confidence: 96.3 },
    { month: 'Oct', avgScore: 94.6, volume: 15, confidence: 97.0 },
  ];

  // Custom Theme-Adaptive Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface/95 backdrop-blur-md border border-border-hairline p-3 rounded-xl shadow-2xl text-xs space-y-1.5 animate-fade-up">
          <p className="font-serif font-medium text-primary pb-1 border-b border-border-hairline">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-secondary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#8EC5E8' }} />
                {entry.name}:
              </span>
              <span className="font-mono font-semibold text-primary">
                {entry.value}{typeof entry.value === 'number' && entry.value > 10 ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 animate-drop-down">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary">
            Surgical Analytics & Outcome Insights
          </h1>
        </div>

        {/* Section Navigation Tabs */}
        <div className="w-full xl:w-auto overflow-x-auto custom-scrollbar pb-1 shrink-0">
          <Tabs
            tabs={[
              { id: 'scores', label: 'Scores & Domains', icon: <BarChart2 className="w-4 h-4" /> },
              { id: 'trends', label: 'Longitudinal Trends', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'compare', label: 'Case Comparison', icon: <GitCompare className="w-4 h-4" /> },
            ]}
            activeTab={selectedSection}
            onChange={(tab) => setSelectedSection(tab as any)}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-surface border border-border-hairline shadow-card flex flex-wrap items-center justify-between gap-3 text-xs animate-drop-down" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter Cohort:
          </span>

          <select
            value={procedureFilter}
            onChange={(e) => setProcedureFilter(e.target.value)}
            className="bg-elevated border border-border-hairline rounded-pill px-3 py-1.5 text-secondary hover:text-primary focus:outline-none"
          >
            <option value="all">All Procedures</option>
            <option value="bimax">Bimaxillary Osteotomy</option>
            <option value="lefort">Le Fort I</option>
            <option value="genio">Genioplasty</option>
            <option value="tmj">TMJ Alloplastic</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-elevated border border-border-hairline rounded-pill px-3 py-1.5 text-secondary hover:text-primary focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="6w">Early (6 Weeks)</option>
            <option value="6m">Intermediate (6 Months)</option>
            <option value="12m">Final (12 Months)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last 180 Days</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," +
                "Month,AvgScore,Volume,Confidence\n" +
                trendsData.map(t => `${t.month},${t.avgScore}%,${t.volume},${t.confidence}%`).join("\n") +
                "\n\nDomain,Score,Target\n" +
                domainData.map(d => `${d.domain},${d.score}%,${d.target}%`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `SADIE_Surgical_Analytics_Cohort_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              toast({
                type: 'success',
                title: 'Analytics Data Exported',
                message: 'Downloaded cohort metrics CSV dossier.'
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-elevated hover:bg-elevated-hover border border-border-hairline text-secondary hover:text-primary transition-all cursor-pointer shadow-sm text-xs"
            title="Export Cohort Analytics to CSV"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SCORES & DOMAINS */}
      {selectedSection === 'scores' && (
        <div key="scores" className="space-y-6 animate-fade-in">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              title="Mean Score"
              value="93.8%"
              change="+2.1% baseline"
              isPositive={true}
              badge="v3.2"
              className="animate-card-in"
              style={{ animationDelay: '40ms' }}
            />
            <KpiCard
              title="Evaluated Cases"
              value="12"
              change="100% verified"
              isPositive={true}
              className="animate-card-in"
              style={{ animationDelay: '90ms' }}
            />
            <KpiCard
              title="Pass Rate"
              value="91.6%"
              change="11 of 12 passing"
              isPositive={true}
              className="animate-card-in"
              style={{ animationDelay: '140ms' }}
            />
            <KpiCard
              title="Confidence (CI)"
              value="96.2%"
              change="±1.6% margin"
              isPositive={true}
              className="animate-card-in"
              style={{ animationDelay: '190ms' }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution Chart */}
            <Card hoverable className="p-6 transition-all duration-300 border-border-hairline hover:border-border-subtle shadow-card animate-slide-up" style={{ animationDelay: '240ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-primary">
                    Score Distribution Histogram
                  </h3>
                  <p className="text-xs text-muted">Frequency count of surgical outcome scores across registry</p>
                </div>
                <span className="text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-pill flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Normal Curve
                </span>
              </div>

              <div className="h-64 min-h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreHistogramGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity={0.95} />
                        <stop offset="60%" stopColor="#38BDF8" stopOpacity={0.88} />
                        <stop offset="100%" stopColor="#7DD3FC" stopOpacity={0.75} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-hairline" vertical={false} />
                    <XAxis dataKey="range" stroke="currentColor" className="text-muted" fontSize={11} tickLine={false} />
                    <YAxis stroke="currentColor" className="text-muted" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(56, 189, 248, 0.08)', radius: 6 }}
                      animationDuration={150}
                      animationEasing="ease-out"
                    />
                    <Bar
                      dataKey="count"
                      name="Cases"
                      fill="url(#scoreHistogramGrad)"
                      radius={[6, 6, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={450}
                      animationEasing="ease-out"
                      animationBegin={0}
                      activeBar={{
                        fill: '#38BDF8',
                        stroke: '#0284C7',
                        strokeWidth: 2
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Domain Performance Breakdown */}
            <Card hoverable className="p-6 transition-all duration-300 border-border-hairline hover:border-border-subtle shadow-card animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-primary">
                    Clinical Domain Performance
                  </h3>
                  <p className="text-xs text-muted">Sub-score averages compared to benchmark thresholds</p>
                </div>
                <span className="text-xs font-mono text-amber-600 dark:text-[#F2E6C8] bg-amber-50 dark:bg-[#F2E6C8]/10 border border-amber-200 dark:border-[#F2E6C8]/25 px-2.5 py-0.5 rounded-pill flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-[#F2E6C8]" />
                  Target: 90.0%
                </span>
              </div>

              <div className="h-64 min-h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="domainBarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity={0.85} />
                        <stop offset="65%" stopColor="#38BDF8" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#7DD3FC" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-hairline" horizontal={false} />
                    <XAxis type="number" domain={[80, 100]} stroke="currentColor" className="text-muted" fontSize={11} />
                    <YAxis dataKey="domain" type="category" stroke="currentColor" className="text-muted" fontSize={11} width={95} tickLine={false} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(56, 189, 248, 0.08)', radius: 6 }}
                      animationDuration={150}
                      animationEasing="ease-out"
                    />
                    <Bar
                      dataKey="score"
                      name="Cohort Score"
                      fill="url(#domainBarGrad)"
                      radius={[0, 6, 6, 0]}
                      barSize={18}
                      isAnimationActive={true}
                      animationDuration={450}
                      animationEasing="ease-out"
                      animationBegin={0}
                      activeBar={{
                        fill: '#7DD3FC',
                        stroke: '#0284C7',
                        strokeWidth: 1.5
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* SECTION 2: LONGITUDINAL TRENDS */}
      {selectedSection === 'trends' && (
        <div className="space-y-6 animate-fade-up">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-primary">
                  Outcome Scores & Statistical Confidence Over Time
                </h3>
                <p className="text-xs text-muted">Monthly trajectory of average outcome scores vs algorithm confidence</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Avg Score (%)
                </span>
                <span className="flex items-center gap-1.5 text-accent">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Confidence (%)
                </span>
              </div>
            </div>

            <div className="h-80 min-h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-hairline" vertical={false} />
                  <XAxis dataKey="month" stroke="currentColor" className="text-muted" fontSize={12} />
                  <YAxis domain={[85, 100]} stroke="currentColor" className="text-muted" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="currentColor" className="text-primary" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={true} animationDuration={450} animationEasing="ease-out" />
                  <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#8ec5e8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} isAnimationActive={true} animationDuration={450} animationEasing="ease-out" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* SECTION 3: CASE COMPARISON */}
      {selectedSection === 'compare' && (
        <div className="space-y-6 animate-fade-up">
          {/* Case Selectors Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-surface border border-border-hairline shadow-card">
            <div>
              <label className="text-xs text-muted block mb-1.5 font-medium">Select Primary Case (A)</label>
              <select
                value={compareCaseId1}
                onChange={(e) => setCompareCaseId1(e.target.value)}
                className="w-full bg-elevated border border-border-hairline rounded-md p-2 text-sm text-primary focus:outline-none"
              >
                {mockCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.patientName} — {c.caseNumber} ({c.procedure})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1.5 font-medium">Select Comparison Case (B)</label>
              <select
                value={compareCaseId2}
                onChange={(e) => setCompareCaseId2(e.target.value)}
                className="w-full bg-elevated border border-border-hairline rounded-md p-2 text-sm text-primary focus:outline-none"
              >
                {mockCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.patientName} — {c.caseNumber} ({c.procedure})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case 1 Profile */}
            <Card className="p-6 border-border-hairline shadow-card space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-border-hairline">
                <div>
                  <span className="font-mono text-xs text-muted">{case1.caseNumber}</span>
                  <h3 className="font-serif text-2xl font-medium text-primary">{case1.patientName}</h3>
                  <p className="text-xs text-secondary mt-0.5">{case1.procedure}</p>
                </div>
                <span className="font-serif text-3xl font-medium text-status-completed font-mono">
                  {case1.score ? `${case1.score}%` : 'N/A'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border-hairline">
                  <span className="text-muted">Surgical Stage:</span>
                  <span className="text-primary font-medium">{case1.stage}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-hairline">
                  <span className="text-muted">Surgery Date:</span>
                  <span className="text-primary font-medium">{case1.surgeryDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-hairline">
                  <span className="text-muted">95% Confidence Interval:</span>
                  <span className="font-mono text-primary font-medium">
                    {case1.confidenceInterval ? `[${case1.confidenceInterval[0]}%, ${case1.confidenceInterval[1]}%]` : 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Domain Scores
                </h4>
                <div className="space-y-1.5">
                  {case1.domainScores.map((d, i) => (
                    <div key={i} className="flex justify-between text-xs p-2 rounded bg-elevated border border-border-hairline">
                      <span className="text-secondary">{d.domain}</span>
                      <span className="font-mono text-primary font-medium">{d.score}/100</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Case 2 Profile */}
            <Card className="p-6 border-border-hairline shadow-card space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-border-hairline">
                <div>
                  <span className="font-mono text-xs text-muted">{case2.caseNumber}</span>
                  <h3 className="font-serif text-2xl font-medium text-primary">{case2.patientName}</h3>
                  <p className="text-xs text-secondary mt-0.5">{case2.procedure}</p>
                </div>
                <span className="font-serif text-3xl font-medium text-status-completed font-mono">
                  {case2.score ? `${case2.score}%` : 'N/A'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border-hairline">
                  <span className="text-muted">Surgical Stage:</span>
                  <span className="text-primary font-medium">{case2.stage}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-hairline">
                  <span className="text-muted">Surgery Date:</span>
                  <span className="text-primary font-medium">{case2.surgeryDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-hairline">
                  <span className="text-muted">95% Confidence Interval:</span>
                  <span className="font-mono text-primary font-medium">
                    {case2.confidenceInterval ? `[${case2.confidenceInterval[0]}%, ${case2.confidenceInterval[1]}%]` : 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Domain Scores
                </h4>
                <div className="space-y-1.5">
                  {case2.domainScores.map((d, i) => (
                    <div key={i} className="flex justify-between text-xs p-2 rounded bg-elevated border border-border-hairline">
                      <span className="text-secondary">{d.domain}</span>
                      <span className="font-mono text-primary font-medium">{d.score}/100</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
