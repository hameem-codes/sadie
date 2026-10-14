import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, User, ArrowRight, Activity, Plus, BookOpen, MessageSquare } from 'lucide-react';
import { mockCases, mockKnowledgeDocuments } from '../../data/mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewCase?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNewCase
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCases = mockCases.filter(c =>
    c.patientName.toLowerCase().includes(query.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
    c.procedure.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredDocs = mockKnowledgeDocuments.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const navigationItems = [
    { label: 'Go to Dashboard', path: '/dashboard', icon: <Activity className="w-4 h-4 text-sky-400" /> },
    { label: 'Go to Cases Directory', path: '/cases', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
    { label: 'Go to Surgical Insights', path: '/insights', icon: <ArrowRight className="w-4 h-4 text-amber-400" /> },
    { label: 'Go to Knowledge Rubrics', path: '/knowledge', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
    { label: 'Open SADIE Copilot', path: '/copilot', icon: <MessageSquare className="w-4 h-4 text-white" /> }
  ].filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-base/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-surface/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-border-hairline animate-fade-up z-10">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border-hairline flex items-center gap-3 bg-surface">
          <Search className="w-5 h-5 text-secondary shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, patient name, procedure, or document..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-primary text-base placeholder-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-muted bg-elevated rounded border border-border-hairline">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-sm custom-scrollbar">
          {/* Quick Actions */}
          {onNewCase && (
            <div>
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
                Quick Actions
              </div>
              <button
                type="button"
                onClick={() => handleSelect(() => onNewCase())}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-primary hover:bg-elevated transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-md bg-btn-primary-bg text-btn-primary-text">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-primary">Create New Maxillofacial Case</span>
                </div>
                <span className="text-xs text-muted">Action</span>
              </button>
            </div>
          )}

          {/* Cases */}
          {filteredCases.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
                Cases & Patients
              </div>
              <div className="space-y-1">
                {filteredCases.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect(() => navigate(`/cases/${c.id}`))}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-secondary hover:text-primary hover:bg-elevated transition-colors"
                  >
                    <div>
                      <div className="font-medium text-primary flex items-center gap-2">
                        {c.patientName}
                        <span className="text-xs text-muted font-mono">{c.caseNumber}</span>
                      </div>
                      <div className="text-xs text-secondary">{c.procedure} • {c.stage}</div>
                    </div>
                    {c.score && (
                      <span className="text-xs font-mono font-medium text-emerald-600 dark:text-[#a3ffb2] bg-emerald-500/10 px-2 py-0.5 rounded-pill border border-emerald-500/20">
                        {c.score}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Docs */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
                Knowledge & Rubric Documents
              </div>
              <div className="space-y-1">
                {filteredDocs.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelect(() => navigate('/knowledge'))}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-secondary hover:text-primary hover:bg-elevated transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-medium text-primary truncate max-w-sm">{d.title}</span>
                    </div>
                    <span className="text-[11px] text-muted">{d.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          {navigationItems.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 mb-1.5">
                Navigation
              </div>
              <div className="space-y-1">
                {navigationItems.map(item => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleSelect(() => navigate(item.path))}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left text-secondary hover:text-primary hover:bg-elevated transition-colors"
                  >
                    {item.icon}
                    <span className="font-medium text-primary">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
