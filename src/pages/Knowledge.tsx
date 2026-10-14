import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  FileText,
  Download,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Layers,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Info,
  X
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Chip } from '../components/ui/Chip';
import { Badge } from '../components/ui/Badge';
import { Table, Column } from '../components/ui/Table';
import { mockKnowledgeDocuments, mockRubricCriteria, mockRubricVersions } from '../data/mockData';
import { KnowledgeDocument, RubricCriterion } from '../types';
import { useToast } from '../components/ui/Toast';

export const Knowledge: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'documents' | 'rubric' | 'imaging'>('documents');

  // Documents tab state: viewer is only open when a document is clicked
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeDocument, setActiveDocument] = useState<KnowledgeDocument | null>(null);

  // Document viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [docZoom, setDocZoom] = useState(100);
  const [isViewerFullscreen, setIsViewerFullscreen] = useState(false);

  const categories = ['All', 'Clinical Rubrics', 'Cephalometrics', 'Imaging Protocols', 'Surgical Guides', 'Quality Standards'];

  const filteredDocs = mockKnowledgeDocuments.filter(d => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const rubricColumns: Column<RubricCriterion>[] = [
    {
      key: 'code',
      header: 'Rubric Code',
      width: '120px',
      render: (item) => (
        <span className="font-mono text-xs text-primary font-medium bg-elevated px-2 py-0.5 rounded border border-border-hairline">
          {item.code}
        </span>
      )
    },
    {
      key: 'title',
      header: 'Evaluation Metric',
      render: (item) => (
        <div>
          <span className="font-medium text-primary block">{item.title}</span>
          <span className="text-xs text-secondary mt-0.5 block">{item.description}</span>
        </div>
      )
    },
    {
      key: 'domain',
      header: 'Domain',
      render: (item) => (
        <span className="text-xs text-secondary">{item.domain}</span>
      )
    },
    {
      key: 'targetRange',
      header: 'Standard Norm',
      render: (item) => (
        <span className="font-mono text-xs text-primary font-medium">
          {item.targetRange}
        </span>
      )
    },
    {
      key: 'toleranceMm',
      header: 'Tolerance',
      align: 'center',
      render: (item) => (
        <span className="font-mono text-xs text-status-completed bg-status-completed/10 px-2 py-0.5 rounded-pill border border-status-completed/30">
          ±{item.toleranceMm}mm
        </span>
      )
    },
    {
      key: 'weight',
      header: 'Weight',
      align: 'right',
      render: (item) => (
        <span className="font-mono text-xs text-secondary font-medium">
          {item.weight}%
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 animate-drop-down">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary">
            Clinical Knowledge & Rubrics
          </h1>
        </div>

        {/* 3 Tabs: Documents, Rubric, Imaging Requirements */}
        <div className="w-full xl:w-auto overflow-x-auto custom-scrollbar pb-1 shrink-0">
          <Tabs
            tabs={[
              { id: 'documents', label: 'Documents & Reader', icon: <FileText className="w-4 h-4" /> },
              { id: 'rubric', label: 'Clinical Rubrics', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'imaging', label: 'Imaging Protocols', icon: <Layers className="w-4 h-4" /> },
            ]}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as any)}
          />
        </div>
      </div>

      {/* TAB 1: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div key="documents" className="animate-fade-in">
          {/* Case 1: No document selected yet - full width directory view */}
          {!activeDocument ? (
            <div className="space-y-5">
              {/* Top Search & Filter Bar */}
              <div className="p-4 rounded-xl bg-surface border border-border-hairline shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-3 animate-drop-down" style={{ animationDelay: '60ms' }}>
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search guidelines, rubrics, and imaging protocols..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-elevated border border-border-hairline rounded-pill pl-9 pr-3 py-2 text-xs sm:text-sm text-primary placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs rounded-pill transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-btn-primary-bg text-btn-primary-text font-semibold shadow-sm'
                          : 'bg-elevated text-secondary hover:text-primary border border-border-hairline'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informational Guidance Bar */}
              <div className="flex items-center justify-between px-1 text-xs text-muted animate-fade-in" style={{ animationDelay: '100ms' }}>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#8EC5E8]" />
                  <span>{filteredDocs.length} Reference Documents</span>
                </span>
              </div>

              {/* Grid of Available Documents (Card-Free Editorial Catalogue) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {filteredDocs.map((doc, idx) => (
                  <div
                    key={doc.id}
                    style={{
                      animationDelay: `${Math.min(idx * 45, 360)}ms`
                    }}
                    onClick={() => {
                      setActiveDocument(doc);
                      setCurrentPage(1);
                    }}
                    className="p-5 rounded-xl cursor-pointer transition-all border border-border-hairline bg-surface hover:bg-elevated/40 shadow-card group flex flex-col justify-between animate-card-in"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded text-accent bg-accent/10 border border-accent/20">
                          {doc.category}
                        </span>
                        <span className="text-[11px] text-muted font-mono">v{doc.version}</span>
                      </div>

                      <h4 className="font-serif text-base sm:text-lg font-medium text-primary mt-3 leading-snug group-hover:text-accent transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-secondary mt-2 line-clamp-3 leading-relaxed">
                        {doc.summary}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border-hairline flex flex-wrap items-center justify-between text-xs text-muted gap-2">
                      <span className="shrink-0">{doc.pages} pages • {doc.lastUpdated}</span>
                      <span className="shrink-0 inline-flex items-center gap-1 text-primary font-medium whitespace-nowrap group-hover:translate-x-1 transition-transform">
                        Read Document →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Case 2: Document selected - split layout with smooth genie unfold animation */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column: Search & Document Directory (5 cols on xl+) */}
              <div className="xl:col-span-5 space-y-4">
                <div className="p-4 rounded-xl bg-surface border border-border-hairline shadow-card space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search guidelines and protocols..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-elevated border border-border-hairline rounded-pill pl-9 pr-3 py-2 text-xs sm:text-sm text-primary placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 text-xs rounded-pill transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-btn-primary-bg text-btn-primary-text font-semibold'
                            : 'bg-elevated text-secondary hover:text-primary border border-border-hairline'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Directory (Card-Free Editorial Index) */}
                <div className="divide-y divide-border-hairline max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredDocs.map(doc => {
                    const isSelected = activeDocument.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setActiveDocument(doc);
                          setCurrentPage(1);
                        }}
                        className={`p-3.5 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-elevated border-l-2 border-accent'
                            : 'hover:bg-elevated/40 border-l-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                            isSelected ? 'bg-accent/10 text-accent' : 'text-muted'
                          }`}>
                            {doc.category}
                          </span>
                          <span className="text-[11px] text-muted font-mono">v{doc.version}</span>
                        </div>

                        <h4 className="font-serif text-sm font-medium text-primary mt-1.5 leading-snug">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-secondary mt-1 line-clamp-2 leading-relaxed">
                          {doc.summary}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-border-hairline flex items-center justify-between text-[11px] text-muted gap-2">
                          <span className="shrink-0">{doc.pages} pages • {doc.lastUpdated}</span>
                          <span className={`shrink-0 text-xs ${isSelected ? 'text-accent font-medium' : 'text-secondary hover:text-primary'}`}>
                            {isSelected ? 'Reading •' : 'Read →'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: PDF Viewer with Genie Unfold Animation (7 cols on xl+) */}
              <div className="xl:col-span-7">
                <Card
                  key={activeDocument.id}
                  className={`animate-genie flex flex-col bg-surface overflow-hidden border border-border-hairline shadow-card ${
                    isViewerFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[min(720px,calc(100vh-10rem))] h-[min(720px,calc(100dvh-10rem))] min-h-[420px]'
                  }`}
                >
                  {/* Viewer Toolbar */}
                  <div className="p-3 border-b border-border-hairline flex items-center justify-between gap-2 bg-surface z-10 shrink-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-xs font-medium text-primary truncate max-w-[120px] sm:max-w-xs" title={activeDocument.title}>
                        {activeDocument.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 text-secondary shrink-0">
                      {/* Page Navigation */}
                      <div className="flex items-center gap-1 bg-elevated px-2 py-0.5 rounded-pill border border-border-hairline text-xs shrink-0 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          className="disabled:opacity-30 p-1 hover:text-primary cursor-pointer"
                          title="Previous Page"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[11px] px-1 text-primary whitespace-nowrap">
                          {currentPage} / {activeDocument.pages}
                        </span>
                        <button
                          type="button"
                          disabled={currentPage >= activeDocument.pages}
                          onClick={() => setCurrentPage(p => Math.min(p + 1, activeDocument.pages))}
                          className="disabled:opacity-30 p-1 hover:text-primary cursor-pointer"
                          title="Next Page"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Zoom Controls */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setDocZoom(z => Math.max(z - 15, 70))}
                          className="p-1 sm:p-1.5 rounded hover:bg-elevated hover:text-primary cursor-pointer"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <span className="text-[11px] font-mono text-muted w-8 sm:w-10 text-center select-none hidden sm:inline-block">
                          {docZoom}%
                        </span>
                        <button
                          type="button"
                          onClick={() => setDocZoom(z => Math.min(z + 15, 160))}
                          className="p-1 sm:p-1.5 rounded hover:bg-elevated hover:text-primary cursor-pointer"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Download */}
                      <button
                        type="button"
                        onClick={() => {
                          const docBlob = new Blob([
                            `# ${activeDocument.title}\n\n` +
                            `Category: ${activeDocument.category} | Version: v${activeDocument.version}\n` +
                            `Author: ${activeDocument.author || 'SADIE Clinical Consensus Board'}\n` +
                            `Last Updated: ${activeDocument.lastUpdated} | Pages: ${activeDocument.pages}\n\n` +
                            `## Summary\n${activeDocument.summary}\n\n` +
                            `## Clinical Guidelines\n${activeDocument.contentMarkdown || 'Standardized clinical evaluation protocols.'}\n`
                          ], { type: 'text/markdown;charset=utf-8' });
                          const url = URL.createObjectURL(docBlob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${activeDocument.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_v${activeDocument.version}.md`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({ type: 'success', title: 'Document Downloaded', message: `Saved ${activeDocument.title}` });
                        }}
                        className="p-1 sm:p-1.5 rounded hover:bg-elevated hover:text-primary cursor-pointer shrink-0"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      {/* Fullscreen */}
                      <button
                        type="button"
                        onClick={() => setIsViewerFullscreen(!isViewerFullscreen)}
                        className="p-1 sm:p-1.5 rounded hover:bg-elevated hover:text-primary cursor-pointer shrink-0"
                        title="Toggle Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>

                      {/* Close Viewer */}
                      <button
                        type="button"
                        onClick={() => setActiveDocument(null)}
                        className="p-1 sm:p-1.5 rounded hover:bg-elevated text-muted hover:text-primary border-l border-border-hairline pl-2 ml-0.5 cursor-pointer transition-colors shrink-0"
                        title="Close Document Reader (Return to Directory)"
                        aria-label="Close Document Reader"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Document Reading Viewport */}
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-base flex justify-center">
                    <div
                      className="w-full max-w-2xl bg-surface border border-border-hairline rounded-lg p-8 shadow-card transition-transform origin-top text-primary space-y-6"
                      style={{ transform: `scale(${docZoom / 100})` }}
                    >
                      {/* Document Cover Header */}
                      <div className="border-b border-border-hairline pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="subtle" size="sm">{activeDocument.category}</Badge>
                          <span className="text-xs text-muted">Version {activeDocument.version}</span>
                        </div>
                        <h2 className="font-serif text-2xl font-medium text-primary leading-tight">
                          {activeDocument.title}
                        </h2>
                        <p className="text-xs text-muted mt-2">
                          Authored by: {activeDocument.author} • Updated {activeDocument.lastUpdated}
                        </p>
                      </div>

                      {/* Document Body Content */}
                      <div className="text-secondary text-sm leading-relaxed space-y-4">
                        <p className="text-primary font-medium">
                          Executive Summary & Regulatory Framework
                        </p>
                        <p>{activeDocument.summary}</p>
                        <div className="p-4 rounded-md bg-elevated border border-border-hairline space-y-2 text-xs">
                          <p className="font-semibold text-primary uppercase tracking-wider">Normative Principles (Page {currentPage}):</p>
                          <ul className="list-disc pl-4 space-y-1 text-secondary">
                            <li>Sub-millimeter accuracy threshold established across multiplanar and 3D surface mesh reformations.</li>
                            <li>Automated landmark localization must exhibit repeatability with standard deviation ≤ 0.3mm across repeated DICOM scans.</li>
                            <li>Surgical relapse tolerances benchmarked at 6-month and 12-month postoperative evaluation milestones.</li>
                          </ul>
                        </div>
                        <p>
                          All surgical evaluations conducted via the SADIE engine benchmark their quantitative outputs against the clinical thresholds outlined herein.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLINICAL RUBRIC & HISTORY */}
      {activeTab === 'rubric' && (
        <div key="rubric" className="space-y-6 animate-fade-in">
          {/* Active Version Overview Banner */}
          <Card className="p-6 bg-surface border-border-hairline shadow-card animate-drop-down">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-serif text-2xl font-medium text-primary">
                    SADIE Consensus Rubric v3.2
                  </span>
                  <span className="text-xs font-semibold text-status-completed bg-status-completed/10 px-2.5 py-0.5 rounded-pill border border-status-completed/30">
                    Active Standard
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-secondary">
                  Governing clinical decision rubric for automated maxillofacial outcome grading.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted">
                <span>Release: <strong>September 2026</strong></span>
                <span>•</span>
                <span>Criteria: <strong>8 Core Metrics</strong></span>
              </div>
            </div>
          </Card>

          {/* Rubric Criteria Table */}
          <div className="space-y-2 animate-slide-up w-full min-w-0" style={{ animationDelay: '100ms' }}>
            <h3 className="font-serif text-xl font-medium text-primary">
              Standardized Evaluation Metrics & Tolerances
            </h3>
            <Table
              columns={rubricColumns}
              data={mockRubricCriteria}
              keyExtractor={(r) => r.id}
            />
          </div>

          {/* Historical Version Timeline */}
          <div className="space-y-3 pt-4 animate-slide-up" style={{ animationDelay: '180ms' }}>
            <h3 className="font-serif text-xl font-medium text-primary">
              Rubric Revision History & Regulatory Changelog
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockRubricVersions.map((ver, idx) => (
                <Card
                  key={ver.version}
                  className="p-5 flex flex-col justify-between animate-card-in bg-surface border-border-hairline shadow-card"
                  style={{ animationDelay: `${220 + idx * 70}ms` }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg font-medium text-primary">{ver.version}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-pill font-mono capitalize ${
                        ver.status === 'active' ? 'bg-status-completed/10 text-status-completed border border-status-completed/30' : 'bg-elevated text-muted'
                      }`}>
                        {ver.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted block mt-1">{ver.releaseDate}</span>

                    <div className="mt-3 space-y-1.5 text-xs text-secondary">
                      {ver.changelog.map((change, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-muted mt-1">•</span>
                          <span>{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-hairline text-[11px] text-muted">
                    Reviewed by: {ver.reviewedBy}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IMAGING REQUIREMENTS */}
      {activeTab === 'imaging' && (
        <div key="imaging" className="space-y-6 animate-fade-in">
          <Card className="p-6 bg-surface border-border-hairline shadow-card animate-drop-down">
            <h3 className="font-serif text-2xl font-medium text-primary mb-2">
              Radiographic Acquisition & Quality Standards
            </h3>
            <p className="text-sm text-secondary leading-relaxed">
              To ensure algorithmic precision, all uploaded computed tomography (CT/CBCT) scans must comply with the following standardized acquisition parameters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                {
                  step: '1. Spatial Resolution',
                  title: 'Isotropic Voxel ≤ 0.40 mm',
                  desc: 'Sub-millimeter slice collimation is mandatory to resolve thin cortical plates at the infraorbital rim, condylar head, and alveolar crest.'
                },
                {
                  step: '2. Field of View (FOV)',
                  title: 'Full Craniofacial (≥ 16×18 cm)',
                  desc: 'Must encompass from superior orbital margin to lower border of hyoid bone, capturing nasion, sella, and menton within a single acquisition.'
                },
                {
                  step: '3. Patient Posture',
                  title: 'Natural Head Position (NHP)',
                  desc: 'Patient scanned in centric relation with relaxed lips and tongue resting on palate to avoid artificial soft-tissue profile distortion.'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{ animationDelay: `${80 + idx * 80}ms` }}
                  className="p-4 rounded-lg bg-elevated border border-border-hairline space-y-2 animate-card-in shadow-card"
                >
                  <span className="text-xs uppercase font-semibold text-muted tracking-wider">{item.step}</span>
                  <h4 className="font-medium text-primary text-base">{item.title}</h4>
                  <p className="text-xs text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
