import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  BookOpen,
  MessageSquare,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  ShieldCheck,
  Megaphone,
  Layers,
  Zap,
  Check,
  Sun,
  Moon,
  GraduationCap,
  History,
  Palette,
  Type,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CommandPalette } from './CommandPalette';
import { useToast } from '../ui/Toast';
import { EducationTrainingModal } from '../education/EducationTrainingModal';
import { SecurityComplianceModal } from '../compliance/SecurityComplianceModal';
import { IntegrationsModal } from '../integrations/IntegrationsModal';
import { api } from '../../services/api';
import { ProcedureType, SurgicalStage } from '../../types';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sadie-theme');
    if (saved) return saved !== 'light';
    return document.documentElement.classList.contains('dark');
  });
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sadie-theme');
    if (saved === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('sadie-theme', 'dark');
        toast({ type: 'info', title: 'Clinical Dark Mode', message: 'SADIE Radiographic Dark Theme active' });
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('sadie-theme', 'light');
        toast({ type: 'info', title: 'Clinical Light Mode', message: 'High-Contrast Surgical Light Theme active' });
      }
      return next;
    });
  };

  const isCopilotPage = location.pathname.startsWith('/copilot');

  // Global keyboard shortcuts (⌘K or ⌘/ for Search, ⌘N for New Case, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'k' || e.key === '/')) {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewCaseOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
        setIsNewCaseOpen(false);
        setIsNotificationsOpen(false);
        setIsPreferencesOpen(false);
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // New Case form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientId, setNewPatientId] = useState('');
  const [newAge, setNewAge] = useState(28);
  const [newGender, setNewGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [newProcedure, setNewProcedure] = useState<ProcedureType>('Bimaxillary Osteotomy');
  const [newStage, setNewStage] = useState<SurgicalStage>('Pre-Operative Planning');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmittingCase, setIsSubmittingCase] = useState(false);

  // Preferences state
  const [prefDenseMode, setPrefDenseMode] = useState(true);
  const [prefConfidenceIntervals, setPrefConfidenceIntervals] = useState(true);
  const [prefAutoSegmentation, setPrefAutoSegmentation] = useState(true);
  const [prefTheme, setPrefTheme] = useState<'dark' | 'contrast' | 'titanium'>('dark');
  const [prefFontSize, setPrefFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [prefAnimations, setPrefAnimations] = useState(true);
  const [prefLanguage, setPrefLanguage] = useState<'en' | 'es' | 'fr' | 'de' | 'ja'>('en');

  // Education & Recent Cases states
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isRecentDropdownOpen, setIsRecentDropdownOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Copilot', path: '/copilot', icon: Sparkles },
    { label: 'Cases', path: '/cases', icon: FolderKanban },
    { label: 'Insights', path: '/insights', icon: BarChart3 },
    { label: 'Knowledge', path: '/knowledge', icon: BookOpen },
  ];

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) {
      toast({ type: 'warning', title: 'Patient Name required', message: 'Please enter patient name.' });
      return;
    }
    setIsSubmittingCase(true);
    try {
      const created = await api.createCase({
        patientName: newPatientName,
        patientId: newPatientId || `MRN-${Math.floor(100000 + Math.random() * 899999)}`,
        age: Number(newAge),
        gender: newGender,
        procedure: newProcedure,
        stage: newStage,
        notes: newNotes,
      });
      toast({
        type: 'success',
        title: 'Case Created Successfully',
        message: `${created.patientName} (${created.caseNumber}) is ready for imaging upload & analysis.`,
      });
      setIsNewCaseOpen(false);
      setNewPatientName('');
      setNewPatientId('');
      setNewNotes('');
      navigate(`/cases/${created.id}`);
    } catch (err) {
      toast({ type: 'error', title: 'Failed to create case', message: 'Please try again.' });
    } finally {
      setIsSubmittingCase(false);
    }
  };


  return (
    <div className="flex h-screen h-[100dvh] w-full max-w-full overflow-hidden bg-base text-primary relative">
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 z-40 w-16 bg-surface/98 backdrop-blur-xl border-r border-border-hairline flex-col items-center py-3.5 select-none justify-between shadow-lg">
        {/* TOP SECTION: Toggle & Primary Nav Icons Matching Image 1 */}
        <div className="flex flex-col items-center w-full space-y-1.5">
          {/* Top Collapse/Expand Toggle (matches [>] in user image) */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:bg-elevated transition-all duration-200 cursor-pointer group relative"
            title="Expand Navigation Menu"
            aria-label="Expand Navigation Menu"
          >
            <PanelLeftOpen className="w-5 h-5 text-[#8EC5E8] group-hover:scale-110 transition-transform" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Expand Menu
            </div>
          </button>

          {/* Hairline Divider */}
          <div className="w-7 h-px bg-border-hairline my-1" />

          {/* 1. Search... (⌘K) */}
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:bg-elevated transition-all duration-200 cursor-pointer group relative"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Search (⌘K)
            </div>
          </button>

          {/* 2. Home */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? 'bg-btn-primary-bg text-btn-primary-text border border-border-hairline shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-elevated'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Home
            </div>
          </NavLink>

          {/* 3. AI Copilot */}
          <NavLink
            to="/copilot"
            className={({ isActive }) =>
              `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? 'bg-btn-primary-bg text-btn-primary-text border border-border-hairline shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-elevated'
              }`
            }
          >
            <Sparkles className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              AI Copilot
            </div>
          </NavLink>

          {/* 4. Cases */}
          <NavLink
            to="/cases"
            className={({ isActive }) =>
              `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? 'bg-btn-primary-bg text-btn-primary-text border border-border-hairline shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-elevated'
              }`
            }
          >
            <FolderKanban className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Cases
            </div>
          </NavLink>

          {/* 5. Insights */}
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? 'bg-btn-primary-bg text-btn-primary-text border border-border-hairline shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-elevated'
              }`
            }
          >
            <BarChart3 className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Insights
            </div>
          </NavLink>

          {/* 6. Knowledge */}
          <NavLink
            to="/knowledge"
            className={({ isActive }) =>
              `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? 'bg-btn-primary-bg text-btn-primary-text border border-border-hairline shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-elevated'
              }`
            }
          >
            <BookOpen className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Knowledge
            </div>
          </NavLink>

          {/* 7. Clinical Academy */}
          <button
            type="button"
            onClick={() => setIsEducationOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:bg-elevated transition-all duration-200 cursor-pointer group relative"
            title="Clinical Academy"
            aria-label="Clinical Academy"
          >
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-[#a3ffb2]" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Clinical Academy
            </div>
          </button>
        </div>

        {/* BOTTOM SECTION: Notifications, Preferences & New Case */}
        <div className="flex flex-col items-center w-full space-y-2 pb-3.5">
          {/* Quick Theme Toggle Icon (Sidebar) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:bg-elevated transition-all duration-200 cursor-pointer group relative"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500 group-hover:-rotate-12 transition-transform" />
            )}
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </div>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:bg-elevated transition-all duration-200 cursor-pointer group relative"
            title="Clinical Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-processing" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Notifications
            </div>
          </button>

          {/* Preferences Button */}
          <button
            type="button"
            onClick={() => setIsPreferencesOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:bg-elevated transition-all duration-200 cursor-pointer group relative"
            title="Settings & Display Density"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              Preferences
            </div>
          </button>

          <div className="w-7 h-px bg-border-hairline my-1" />

          {/* New Case Button */}
          <button
            type="button"
            onClick={() => setIsNewCaseOpen(true)}
            className="w-10 h-10 rounded-xl bg-btn-primary-bg text-btn-primary-text hover:opacity-90 flex items-center justify-center transition-all duration-200 cursor-pointer group relative shadow-md hover-lift"
            title="New Case (⌘N)"
            aria-label="New Case"
          >
            <Plus className="w-5 h-5 text-btn-primary-text group-hover:scale-110 transition-transform" />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-border-hairline text-[11px] text-primary rounded-md shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 font-sans">
              New Case (⌘N)
            </div>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP TOGGLE (visible only on mobile viewports < md) */}
      {!isSidebarOpen && (
        <div className="md:hidden fixed top-0 left-0 z-30 h-16 flex items-center px-4 bg-transparent select-none pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg text-secondary hover:text-primary bg-surface/90 hover:bg-elevated backdrop-blur-md border border-border-hairline shadow-md transition-all cursor-pointer"
            title="Open navigation bar"
            aria-label="Open navigation bar"
          >
            <PanelLeftOpen className="w-5 h-5 text-[#8EC5E8]" />
          </button>
        </div>
      )}

      {/* Global Top-Right Quick Utilities: Theme Toggle, Recent Cases & Clinical Academy */}
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2 select-none pointer-events-auto">
        {/* Quick Theme Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface/90 hover:bg-elevated backdrop-blur-md border border-border-hairline hover:border-border-subtle text-xs text-secondary hover:text-primary transition-all cursor-pointer shadow-sm group"
          title={isDarkMode ? "Switch to Clinical Light Mode" : "Switch to Radiographic Dark Mode"}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Dark</span>
            </>
          )}
        </button>

        {/* Recent Cases Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRecentDropdownOpen(!isRecentDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface/90 hover:bg-elevated backdrop-blur-md border border-border-hairline hover:border-border-subtle text-xs text-secondary hover:text-primary transition-all cursor-pointer shadow-sm"
            title="Recent Cases History"
          >
            <History className="w-3.5 h-3.5 text-[#8EC5E8]" />
            <span className="hidden sm:inline font-medium">Recent Cases</span>
            <ChevronDown className="w-3 h-3 text-muted" />
          </button>

          {isRecentDropdownOpen && (
            <div className="absolute right-0 top-9 w-64 rounded-xl bg-surface border border-border-hairline p-2 shadow-2xl z-50 animate-fade-up text-xs">
              <span className="text-[10px] uppercase font-mono text-muted px-2 py-1 block">Recently Visited</span>
              <div className="space-y-1">
                {[
                  { id: 'case-101', name: 'Eleanor Vance-Cole', mrn: 'MX-2026-0891', proc: 'Bimaxillary' },
                  { id: 'case-102', name: 'Julian Hayes', mrn: 'MX-2026-0892', proc: 'Le Fort I' },
                  { id: 'case-103', name: 'Maya Lin-Patel', mrn: 'MX-2026-0893', proc: 'BSSO Split' }
                ].map(rc => (
                  <button
                    key={rc.id}
                    type="button"
                    onClick={() => {
                      navigate(`/cases/${rc.id}`);
                      setIsRecentDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-elevated flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-medium text-primary block truncate">{rc.name}</span>
                      <span className="text-[10px] text-muted font-mono">{rc.mrn} • {rc.proc}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clinical Academy Button */}
        <button
          type="button"
          onClick={() => setIsEducationOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface/90 hover:bg-elevated backdrop-blur-md border border-border-hairline hover:border-border-subtle text-xs text-emerald-600 dark:text-[#a3ffb2] hover:text-primary transition-all cursor-pointer shadow-sm"
          title="SADIE Clinical Academy & CME Quiz"
        >
          <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-[#a3ffb2]" />
          <span className="hidden sm:inline font-medium">Academy</span>
        </button>
      </div>

      {/* Backdrop when Nav Bar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* OVERLAY NAVIGATION BAR: When opened, shows centered SADIE brand text and close tab */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-surface/98 backdrop-blur-2xl border-r border-border-hairline shadow-2xl flex flex-col transition-transform duration-300 ease-in-out select-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        <div className="w-64 flex flex-col h-full shrink-0">
          {/* Header in Nav Bar: SADIE brand text placed in the exact center of the navigation bar */}
          <div className="h-20 w-full relative flex items-center justify-center px-4 border-b border-border-hairline bg-surface/50">
            <NavLink
              to="/copilot"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center group cursor-pointer select-none"
              title="SADIE AI Copilot"
            >
              <span className="font-serif text-2xl font-semibold tracking-wider text-primary group-hover:text-[#8EC5E8] transition-colors leading-none">
                SADIE
              </span>
            </NavLink>

            {/* Close Nav Bar button positioned on the right */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-lg text-muted hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
              title="Close navigation"
              aria-label="Close navigation"
            >
              <PanelLeftClose className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {/* Quick Search */}
            <button
              type="button"
              onClick={() => {
                setIsCommandOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 mb-3 rounded-pill bg-elevated/70 border border-border-hairline text-secondary hover:text-primary hover:border-border-subtle text-xs transition-all cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-muted group-hover:text-primary shrink-0 transition-colors" />
              <span className="truncate text-left flex-1 font-medium">Search...</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface text-muted border border-border-hairline shrink-0">
                ⌘K
              </kbd>
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-pill text-sm font-medium transition-all group hover-lift ${
                    isActive
                      ? 'bg-btn-primary-bg text-btn-primary-text font-semibold shadow-sm'
                      : 'text-secondary hover:text-primary hover:bg-elevated'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-btn-primary-text' : 'text-secondary group-hover:text-primary'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* Clinical Academy in Navigation Menu */}
            <button
              type="button"
              onClick={() => {
                setIsEducationOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-pill text-sm font-medium text-secondary hover:text-primary hover:bg-elevated transition-all cursor-pointer group hover-lift"
              title="Clinical Academy, Case Studies & CME"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-[#a3ffb2] shrink-0" />
              <span>Clinical Academy</span>
            </button>
          </nav>

          {/* BOTTOM NAVBAR: New Case + Notifications & Settings */}
          <div className="p-3 border-t border-border-hairline space-y-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsNewCaseOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full justify-center inline-flex shadow-glow-subtle"
              icon={<Plus className="w-4 h-4 text-btn-primary-text" />}
              iconPosition="left"
            >
              New Case
            </Button>

            {/* Bottom Nav Utilities: Notifications & Settings */}
            <div className="pt-2 border-t border-border-hairline flex items-center justify-between px-1">
              {/* Notifications Toggle */}
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="View notifications"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isNotificationsOpen ? 'text-primary bg-elevated' : 'text-secondary hover:text-primary hover:bg-elevated'
                }`}
              >
                <Bell className="w-4 h-4 text-muted" />
                <span className="font-medium">Notifications</span>
                <span className="w-2 h-2 rounded-full bg-status-processing" />
              </button>

              <div className="flex items-center gap-1">
                {/* Theme Switcher Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  title={isDarkMode ? "Switch to Clinical Light Mode" : "Switch to Radiographic Dark Mode"}
                  className="flex items-center justify-center p-2 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-500 hover:-rotate-12 transition-transform" />
                  )}
                </button>

                {/* Settings Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen(true)}
                  aria-label="Settings"
                  title="Settings"
                  className="flex items-center justify-center p-2 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-muted hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative md:pl-16">
        {/* PAGE CONTENT CONTAINER */}
        <main className={`flex-1 overflow-y-auto bg-base custom-scrollbar ${isCopilotPage ? 'p-0 pt-20' : 'px-4 sm:px-6 lg:px-8 pb-24 md:pb-8 pt-20 sm:pt-28'}`}>
          <div key={location.pathname} className="w-full">
            <Outlet />
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR (for quick thumb access under 768px with safe-area support) */}
        <div className="md:hidden min-h-[3.5rem] pb-[env(safe-area-inset-bottom)] border-t border-border-hairline bg-surface/95 backdrop-blur-md flex items-center justify-around px-2 shrink-0 z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full transition-colors ${isActive ? 'text-white' : 'text-muted hover:text-secondary'}`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            );
          })}
          {/* Mobile Notifications button */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full relative text-muted hover:text-secondary transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-processing" />
          </button>
          {/* Mobile Settings button */}
          <button
            type="button"
            onClick={() => setIsPreferencesOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full text-muted hover:text-secondary transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS POPOVER (Positioned globally so it's never clipped by sidebar overflow-hidden) */}
      {isNotificationsOpen && (
        <>
          {/* Backdrop for click-outside dismissal */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setIsNotificationsOpen(false)}
          />

          <div className="fixed bottom-16 left-3 sm:left-4 z-50 w-[min(calc(100vw-1.5rem),360px)] glass-modal rounded-xl shadow-2xl border border-white/15 p-4 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-status-processing" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Clinical Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-processing/20 text-status-processing font-semibold">
                  2 Pending
                </span>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-md text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close notifications"
                  aria-label="Close notifications"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2 custom-scrollbar">
              <div
                onClick={() => {
                  navigate('/cases/case-104');
                  setIsNotificationsOpen(false);
                }}
                className="py-3 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-status-failed text-xs font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Analysis Failed (Motion Artifact)</span>
                  </div>
                  <span className="text-[10px] text-muted">2h ago</span>
                </div>
                <p className="text-xs text-secondary mt-1 group-hover:text-primary transition-colors leading-relaxed">
                  Case MX-2026-0894: CT motion blur at Infraorbital Margin. Manual landmark pin or rescan recommended.
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#8EC5E8] font-medium group-hover:underline">
                  <span>Inspect Case & Rescan</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div
                onClick={() => {
                  navigate('/cases/case-103');
                  setIsNotificationsOpen(false);
                }}
                className="py-3 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-status-processing text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-status-processing animate-ping shrink-0" />
                    <span>Segmentation In Progress</span>
                  </div>
                  <span className="text-[10px] text-muted">12m ago</span>
                </div>
                <p className="text-xs text-secondary mt-1 group-hover:text-primary transition-colors leading-relaxed">
                  Case MX-2026-0893: 840 axial CT slices processing. Real-time bone surface model generation.
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#8EC5E8] font-medium group-hover:underline">
                  <span>Track Pipeline Status</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  navigate('/cases');
                  setIsNotificationsOpen(false);
                }}
                className="text-secondary hover:text-white transition-colors cursor-pointer font-medium"
              >
                View all cases
              </button>
              <button
                type="button"
                onClick={() => {
                  toast({
                    type: 'info',
                    title: 'Notifications Cleared',
                    message: 'All clinical alert notices marked as reviewed.'
                  });
                  setIsNotificationsOpen(false);
                }}
                className="text-muted hover:text-white transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            </div>
          </div>
        </>
      )}

      {/* GLOBAL COMMAND PALETTE */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNewCase={() => setIsNewCaseOpen(true)}
      />

      {/* NEW CASE MODAL */}
      <Modal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        title="Initiate New Case"
        description="Enter patient demographics and operative details to begin automated evaluation."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rachel Sterling"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">
                MRN / Patient ID
              </label>
              <input
                type="text"
                placeholder="e.g. MRN-902143"
                value={newPatientId}
                onChange={(e) => setNewPatientId(e.target.value)}
                className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-secondary block mb-1.5">Age</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newAge}
                  onChange={(e) => setNewAge(Number(e.target.value))}
                  className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-secondary block mb-1.5">Gender</label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as any)}
                  className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-white/40"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Surgical Stage</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value as any)}
                className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-white/40"
              >
                <option value="Pre-Operative Planning">Pre-Operative Planning</option>
                <option value="Immediate Post-Op (24-48h)">Immediate Post-Op (24-48h)</option>
                <option value="Early Follow-up (6 Weeks)">Early Follow-up (6 Weeks)</option>
                <option value="Intermediate (6 Months)">Intermediate (6 Months)</option>
                <option value="Final Review (12 Months)">Final Review (12 Months)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Procedure Type</label>
            <select
              value={newProcedure}
              onChange={(e) => setNewProcedure(e.target.value as any)}
              className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-white/40"
            >
              <option value="Bimaxillary Osteotomy">Bimaxillary Osteotomy</option>
              <option value="Le Fort I Osteotomy">Le Fort I Osteotomy</option>
              <option value="BSSO (Bilateral Sagittal Split)">BSSO (Bilateral Sagittal Split)</option>
              <option value="Genioplasty">Genioplasty</option>
              <option value="Mandibular Reconstruction (Fibula)">Mandibular Reconstruction (Fibula)</option>
              <option value="TMJ Alloplastic Replacement">TMJ Alloplastic Replacement</option>
              <option value="SARPE (Palatal Expansion)">SARPE (Palatal Expansion)</option>
              <option value="ZMC Fracture Repair">ZMC Fracture Repair</option>
              <option value="Distraction Osteogenesis">Distraction Osteogenesis</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Clinical Notes & Targets</label>
            <textarea
              rows={3}
              placeholder="e.g. Planned maxillary impaction 3.5mm, planned mandibular setback 4.0mm, monitor condylar position."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full bg-surface border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-white/40 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsNewCaseOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmittingCase}
            >
              {isSubmittingCase ? 'Creating Case...' : 'Create & Open Workspace ↗'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* PREFERENCES MODAL */}
      <Modal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        title="Clinical Evaluator Preferences"
        description="Configure display density, radiomic scoring thresholds, and algorithm parameters."
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-hairline">
            <div>
              <p className="text-sm font-medium text-primary">Dense Clinical Layout</p>
              <p className="text-xs text-muted">Compact row heights and dense measurement charts.</p>
            </div>
            <button
              type="button"
              onClick={() => setPrefDenseMode(!prefDenseMode)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${prefDenseMode ? 'bg-btn-primary-bg' : 'bg-elevated border border-border-hairline'}`}
            >
              <div className={`w-4 h-4 rounded-full transition-transform ${prefDenseMode ? 'bg-btn-primary-text translate-x-5' : 'bg-muted'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-hairline">
            <div>
              <p className="text-sm font-medium text-primary">Display 95% Confidence Intervals</p>
              <p className="text-xs text-muted">Show statistical uncertainty bounds on radiographic outcome scores.</p>
            </div>
            <button
              type="button"
              onClick={() => setPrefConfidenceIntervals(!prefConfidenceIntervals)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${prefConfidenceIntervals ? 'bg-btn-primary-bg' : 'bg-elevated border border-border-hairline'}`}
            >
              <div className={`w-4 h-4 rounded-full transition-transform ${prefConfidenceIntervals ? 'bg-btn-primary-text translate-x-5' : 'bg-muted'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-hairline">
            <div>
              <p className="text-sm font-medium text-primary">Automated DICOM Segmentation</p>
              <p className="text-xs text-muted">Initiate 3D skull thresholding and landmark inference upon upload.</p>
            </div>
            <button
              type="button"
              onClick={() => setPrefAutoSegmentation(!prefAutoSegmentation)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${prefAutoSegmentation ? 'bg-btn-primary-bg' : 'bg-elevated border border-border-hairline'}`}
            >
              <div className={`w-4 h-4 rounded-full transition-transform ${prefAutoSegmentation ? 'bg-btn-primary-text translate-x-5' : 'bg-muted'}`} />
            </button>
          </div>

          {/* Color Themes */}
          <div className="p-3 rounded-lg bg-surface border border-border-hairline space-y-2">
            <p className="text-sm font-medium text-primary">Customizable Color Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: 'Clinical Dark' },
                { id: 'light', label: 'Clinical Light' },
                { id: 'contrast', label: 'High Contrast' }
              ].map(th => {
                const isSelected = (th.id === 'light' && !isDarkMode) || (th.id === 'dark' && isDarkMode) || prefTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setPrefTheme(th.id as any);
                      if (th.id === 'light') {
                        setIsDarkMode(false);
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                        localStorage.setItem('sadie-theme', 'light');
                      } else {
                        setIsDarkMode(true);
                        document.documentElement.classList.add('dark');
                        document.documentElement.classList.remove('light');
                        localStorage.setItem('sadie-theme', 'dark');
                      }
                    }}
                    className={`py-1.5 px-2 rounded-pill text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-btn-primary-bg text-btn-primary-text font-semibold shadow-sm'
                        : 'bg-elevated border border-border-hairline text-secondary hover:text-primary'
                    }`}
                  >
                    {th.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size Adjustments */}
          <div className="p-3 rounded-lg bg-surface border border-border-hairline space-y-2">
            <p className="text-sm font-medium text-primary">Font Size Scale</p>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'sm', label: '13px' },
                { id: 'md', label: '14px (Std)' },
                { id: 'lg', label: '15px' },
                { id: 'xl', label: '16px' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPrefFontSize(f.id as any)}
                  className={`py-1 rounded-pill text-xs font-mono transition-all ${
                    prefFontSize === f.id
                      ? 'bg-btn-primary-bg text-btn-primary-text font-semibold'
                      : 'bg-elevated border border-border-hairline text-secondary hover:text-primary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Localization */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-hairline">
            <div>
              <p className="text-sm font-medium text-primary">Clinical Localization</p>
              <p className="text-xs text-muted">Language for anatomical rubrics and diagnostic dossiers.</p>
            </div>
            <select
              value={prefLanguage}
              onChange={(e) => setPrefLanguage(e.target.value as any)}
              className="bg-elevated border border-border-hairline rounded-pill px-3 py-1 text-xs text-primary"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="ja">日本語 (JA)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end">
            <Button
              variant="primary"
              onClick={() => {
                setIsPreferencesOpen(false);
                toast({ type: 'success', title: 'Preferences Saved', message: 'Evaluation settings and theme updated.' });
              }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clinical Academy & CME Quiz Modal */}
      <EducationTrainingModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
      />

      {/* Security & HIPAA Compliance Modal */}
      <SecurityComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />

      {/* PACS & EHR Integrations Modal */}
      <IntegrationsModal
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />
    </div>
  );
};
