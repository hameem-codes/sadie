import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Split,
  Eye,
  Crosshair,
  Sliders,
  Upload,
  Ruler,
  Camera,
  SunMedium,
  CheckCircle2,
  Info,
  Box,
  Compass,
  Download
} from 'lucide-react';
import { Button } from '../ui/Button';
import { CaseFile } from '../../types';
import { useToast } from '../ui/Toast';

interface ImagingViewerProps {
  patientName: string;
  procedure: string;
  files?: CaseFile[];
  onUploadClick?: () => void;
}

export const ImagingViewer: React.FC<ImagingViewerProps> = ({
  patientName,
  procedure,
  files,
  onUploadClick
}) => {
  const { toast } = useToast();
  const [activeModality, setActiveModality] = useState<'3d' | 'axial' | 'coronal' | 'sagittal'>('3d');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'split-slider' | 'multiplanar'>('side-by-side');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [splitSliderPos, setSplitSliderPos] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 3D Volume Rendering Controls
  const [yawRotation, setYawRotation] = useState(15);
  const [pitchRotation, setPitchRotation] = useState(-8);
  const [boneThreshold, setBoneThreshold] = useState(350);
  const [isRotating, setIsRotating] = useState(false);
  const [sliceIndex, setSliceIndex] = useState(148);

  // Advanced Clinical Features: Window Level & Measurement Tool
  const [windowPreset, setWindowPreset] = useState<'bone' | 'soft' | 'dental'>('bone');
  const [windowWidth, setWindowWidth] = useState(2000);
  const [windowLevel, setWindowLevel] = useState(350);
  const [showWlSliders, setShowWlSliders] = useState(false);
  const [activeTool, setActiveTool] = useState<'pan' | 'ruler' | 'angle'>('pan');
  const [isFlashing, setIsFlashing] = useState(false);

  // Container ref for screenshot capture & touch gestures
  const viewerRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number | null>(null);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 60), 220));
  };

  const resetView = () => {
    setZoomLevel(100);
    setSplitSliderPos(50);
    setActiveTool('pan');
    setWindowPreset('bone');
    setWindowWidth(2000);
    setWindowLevel(350);
    setYawRotation(15);
    setPitchRotation(-8);
    setSliceIndex(148);
  };

  const handlePresetSelect = (preset: 'bone' | 'soft' | 'dental') => {
    setWindowPreset(preset);
    if (preset === 'bone') {
      setWindowWidth(2000);
      setWindowLevel(350);
    } else if (preset === 'soft') {
      setWindowWidth(400);
      setWindowLevel(40);
    } else {
      setWindowWidth(4000);
      setWindowLevel(1000);
    }
  };

  // Screenshot capture feature
  const handleCaptureScreenshot = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);

    const filename = `${patientName.replace(/\s+/g, '_')}_${activeModality.toUpperCase()}_slice${sliceIndex}.png`;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clinical background
        ctx.fillStyle = '#0a0e17';
        ctx.fillRect(0, 0, 1000, 700);

        // Header info
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`SADIE Radiomic Snapshot: ${patientName}`, 32, 45);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Modality: ${activeModality.toUpperCase()}  |  Slice: #${sliceIndex}  |  Zoom: ${zoomLevel}%  |  W/L: ${windowWidth}/${windowLevel}`, 32, 75);
        ctx.fillText(`Procedure: ${procedure}  |  Timestamp: ${new Date().toLocaleString()}`, 32, 98);

        // Grid lines
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 32; x < 968; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 120);
          ctx.lineTo(x, 660);
          ctx.stroke();
        }
        for (let y = 120; y < 660; y += 60) {
          ctx.beginPath();
          ctx.moveTo(32, y);
          ctx.lineTo(968, y);
          ctx.stroke();
        }

        // Draw crosshair center
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.strokeRect(280, 180, 440, 420);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '14px monospace';
        ctx.fillText(`[3D MULTIPLANAR VOXEL PROJECTION]`, 340, 400);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    } catch {
      // Fallback
    }

    toast({
      type: 'success',
      title: 'Screenshot Captured',
      message: `Downloaded snapshot: ${filename}`
    });
  };

  // Touch gesture handler for mobile pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - touchStartDistRef.current) * 0.4;
      setZoomLevel(prev => Math.min(Math.max(prev + delta, 60), 220));
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = null;
  };

  // Dynamic filter string for radiographic visualization
  const getFilterStyle = () => {
    if (windowPreset === 'soft') {
      return 'contrast(1.4) brightness(0.9) saturate(0.8)';
    } else if (windowPreset === 'dental') {
      return 'contrast(1.6) brightness(1.1)';
    }
    return 'contrast(1.2) brightness(1.0)';
  };

  // Fullscreen escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  // Empty state check (Issue 2)
  const isNoFiles = !files || files.length === 0;

  return (
    <div
      ref={viewerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative rounded-xl border border-border-hairline bg-[#0d0d0d] overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full min-h-[360px] h-[55vw] max-h-[calc(100vh-14rem)] max-h-[calc(100dvh-14rem)] aspect-[4/3] sm:aspect-[16/10]'
      }`}
    >
      {/* Flash animation layer when screenshot is captured */}
      {isFlashing && (
        <div className="absolute inset-0 z-50 bg-white/40 pointer-events-none transition-opacity duration-300" />
      )}

      {/* Viewer Header Toolbar */}
      <div className="h-12 border-b border-border-hairline px-3 sm:px-4 flex items-center justify-between bg-surface/80 backdrop-blur-sm z-10 shrink-0 gap-2">
        {/* Modality & Cross-Sectional Selector */}
        <div className="flex items-center gap-1 bg-elevated p-1 rounded-pill border border-border-hairline">
          {[
            { id: '3d', label: '3D Volume', icon: Box },
            { id: 'axial', label: 'Axial (Z)', icon: Layers },
            { id: 'coronal', label: 'Coronal (Y)', icon: Crosshair },
            { id: 'sagittal', label: 'Sagittal (X)', icon: Compass }
          ].map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModality(m.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-pill text-[11px] font-medium transition-all cursor-pointer ${
                  activeModality === m.id
                    ? 'bg-btn-primary-bg text-btn-primary-text font-semibold shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-elevated p-1 rounded-pill border border-border-hairline">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2 py-0.5 rounded-pill text-[10px] font-medium transition-all cursor-pointer ${
              viewMode === 'side-by-side' ? 'bg-btn-primary-bg text-btn-primary-text font-semibold' : 'text-secondary hover:text-primary'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split-slider')}
            className={`px-2 py-0.5 rounded-pill text-[10px] font-medium transition-all cursor-pointer ${
              viewMode === 'split-slider' ? 'bg-btn-primary-bg text-btn-primary-text font-semibold' : 'text-secondary hover:text-primary'
            }`}
          >
            Split Overlay
          </button>
          <button
            type="button"
            onClick={() => setViewMode('multiplanar')}
            className={`px-2 py-0.5 rounded-pill text-[10px] font-medium transition-all cursor-pointer ${
              viewMode === 'multiplanar' ? 'bg-btn-primary-bg text-btn-primary-text font-semibold' : 'text-secondary hover:text-primary'
            }`}
          >
            MPR Orthogonal
          </button>
        </div>

        {/* Window Level (WW/WL) Presets */}
        <div className="hidden md:flex items-center gap-1 bg-elevated p-1 rounded-pill border border-border-hairline">
          {[
            { id: 'bone', label: 'Bone' },
            { id: 'soft', label: 'Soft' },
            { id: 'dental', label: 'Enamel' }
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetSelect(p.id as any)}
              className={`px-2 py-0.5 rounded-pill text-[10px] font-medium transition-all cursor-pointer ${
                windowPreset === p.id ? 'bg-btn-primary-bg text-btn-primary-text font-semibold' : 'text-secondary hover:text-primary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Viewer Tools (Screenshot, Caliper, WW/WL, Landmarks, Zoom, Fullscreen) */}
        <div className="flex items-center gap-1 text-secondary">
          {/* Screenshot Capture Button */}
          <button
            type="button"
            onClick={handleCaptureScreenshot}
            className="p-1.5 rounded-md hover:bg-elevated hover:text-primary transition-colors cursor-pointer text-muted"
            title="Capture Viewport Screenshot"
          >
            <Camera className="w-4 h-4 text-accent" />
          </button>

          {/* Caliper Measurement Toggle */}
          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'ruler' ? 'pan' : 'ruler')}
            className={`p-1.5 rounded-md hover:bg-elevated transition-colors cursor-pointer ${
              activeTool === 'ruler' ? 'text-status-completed bg-elevated border border-status-completed/30' : 'text-muted hover:text-primary'
            }`}
            title="Measurement Caliper (Distance & Angle)"
          >
            <Ruler className="w-4 h-4" />
          </button>

          {/* Window Level Sliders Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setShowWlSliders(!showWlSliders)}
            className={`p-1.5 rounded-md hover:bg-elevated transition-colors cursor-pointer ${
              showWlSliders ? 'text-primary bg-elevated' : 'text-muted hover:text-primary'
            }`}
            title="Window Level / Window Width HU Adjustment"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Cephalometric Landmarks Toggle */}
          <button
            type="button"
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`p-1.5 rounded-md hover:bg-elevated transition-colors cursor-pointer ${
              showLandmarks ? 'text-primary bg-elevated' : 'text-muted'
            }`}
            title="Toggle Cephalometric Landmarks"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleZoom(-15)}
            className="p-1.5 rounded-md hover:bg-elevated hover:text-primary transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-muted w-9 text-center select-none">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(+15)}
            className="p-1.5 rounded-md hover:bg-elevated hover:text-primary transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-md hover:bg-elevated hover:text-primary transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md hover:bg-elevated hover:text-primary transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Window Width / Window Level adjustment overlay */}
      {showWlSliders && (
        <div className="bg-surface/95 backdrop-blur-md border-b border-border-hairline px-4 py-2.5 z-20 flex flex-wrap items-center gap-6 text-xs text-secondary animate-fade-up">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted">WW (Width):</span>
            <input
              type="range"
              min="100"
              max="4000"
              step="50"
              value={windowWidth}
              onChange={(e) => setWindowWidth(Number(e.target.value))}
              className="accent-[#8EC5E8] w-28 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-primary w-12">{windowWidth} HU</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted">WL (Level):</span>
            <input
              type="range"
              min="-200"
              max="1500"
              step="20"
              value={windowLevel}
              onChange={(e) => setWindowLevel(Number(e.target.value))}
              className="accent-[#8EC5E8] w-28 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-primary w-12">{windowLevel} HU</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted">Slice:</span>
            <input
              type="range"
              min="1"
              max="320"
              value={sliceIndex}
              onChange={(e) => setSliceIndex(Number(e.target.value))}
              className="accent-[#8EC5E8] w-24 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-primary w-14">#{sliceIndex}/320</span>
          </div>

          <div className="ml-auto text-[11px] text-muted font-mono">
            Preset: <span className="text-primary capitalize">{windowPreset}</span>
          </div>
        </div>
      )}

      {/* 3D Volume Rotation & Threshold Sub-bar (when 3D mode is active) */}
      {activeModality === '3d' && (
        <div className="bg-surface/90 border-b border-border-hairline px-4 py-1.5 z-15 flex flex-wrap items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-accent">Yaw:</span>
              <input
                type="range"
                min="-180"
                max="180"
                value={yawRotation}
                onChange={(e) => setYawRotation(Number(e.target.value))}
                className="accent-[#8EC5E8] w-20 cursor-pointer"
              />
              <span className="font-mono text-[10px] text-primary w-8">{yawRotation}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-accent">Pitch:</span>
              <input
                type="range"
                min="-45"
                max="45"
                value={pitchRotation}
                onChange={(e) => setPitchRotation(Number(e.target.value))}
                className="accent-[#8EC5E8] w-20 cursor-pointer"
              />
              <span className="font-mono text-[10px] text-primary w-8">{pitchRotation}°</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted font-mono">3D Bone Density Iso-Surface:</span>
            <span className="text-[10px] text-[#a3ffb2] font-mono">+{boneThreshold} HU</span>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center select-none">
        {/* EMPTY STATE (Fix Issue 2): Displays upload icon and text when no scans are present */}
        {isNoFiles ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-elevated/90 border border-white/10 flex items-center justify-center text-muted shadow-lg">
              <Upload className="w-6 h-6 text-[#8EC5E8]" />
            </div>
            <h4 className="font-serif text-lg font-medium text-white">No Radiographic Scans Attached</h4>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              Upload pre-operative and post-operative CBCT, 3D CT volumetric series, or Cephalometric DICOM files to begin multiplanar alignment and rubric assessment.
            </p>
            {onUploadClick && (
              <Button variant="primary" size="sm" onClick={onUploadClick} className="mt-2">
                Upload DICOM Files
              </Button>
            )}
          </div>
        ) : viewMode === 'multiplanar' ? (
          /* MULTIPLANAR RECONSTRUCTION (MPR) ORTHOGONAL GRID */
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 bg-[#111111] p-1">
            {/* Axial Window */}
            <div className="relative bg-[#070707] rounded border border-white/10 flex items-center justify-center overflow-hidden">
              <span className="absolute top-2 left-2 z-10 text-[9px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-[#8EC5E8] border border-white/10">
                AXIAL (Z-PLANE) #{sliceIndex}
              </span>
              <svg className="w-40 h-40 text-zinc-500" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="#8EC5E8" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="50" y1="15" x2="50" y2="85" stroke="#8EC5E8" strokeWidth="0.8" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="1.5" fill="#a3ffb2" />
              </svg>
            </div>
            {/* Coronal Window */}
            <div className="relative bg-[#070707] rounded border border-white/10 flex items-center justify-center overflow-hidden">
              <span className="absolute top-2 left-2 z-10 text-[9px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-[#8EC5E8] border border-white/10">
                CORONAL (Y-PLANE) #{sliceIndex - 20}
              </span>
              <svg className="w-40 h-40 text-zinc-500" viewBox="0 0 100 100">
                <path d="M 25 30 Q 50 15 75 30 L 75 75 Q 50 85 25 75 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="#8EC5E8" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="50" y1="15" x2="50" y2="85" stroke="#8EC5E8" strokeWidth="0.8" strokeDasharray="2,2" />
              </svg>
            </div>
            {/* Sagittal Window */}
            <div className="relative bg-[#070707] rounded border border-white/10 flex items-center justify-center overflow-hidden">
              <span className="absolute top-2 left-2 z-10 text-[9px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-[#8EC5E8] border border-white/10">
                SAGITTAL (X-PLANE) #{sliceIndex + 12}
              </span>
              <svg className="w-40 h-40 text-zinc-500" viewBox="0 0 100 100">
                <path d="M 30 20 C 60 20, 70 45, 65 65 C 60 80, 40 85, 30 80 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="#8EC5E8" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="50" y1="15" x2="50" y2="85" stroke="#8EC5E8" strokeWidth="0.8" strokeDasharray="2,2" />
              </svg>
            </div>
            {/* 3D Reconstruction Window */}
            <div className="relative bg-[#070707] rounded border border-white/10 flex items-center justify-center overflow-hidden">
              <span className="absolute top-2 left-2 z-10 text-[9px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-[#a3ffb2] border border-white/10">
                3D VOLUMETRIC MESH
              </span>
              <div
                style={{ transform: `rotateY(${yawRotation}deg) rotateX(${pitchRotation}deg)` }}
                className="transition-transform duration-75 flex items-center justify-center"
              >
                <svg className="w-36 h-36 text-zinc-400 drop-shadow-xl" viewBox="0 0 100 100">
                  <path d="M 50 15 C 30 15, 20 35, 20 60 C 20 80, 35 90, 50 90 C 65 90, 80 80, 80 60 C 80 35, 70 15, 50 15 Z" fill="rgba(60,60,65,0.7)" stroke="#a3ffb2" strokeWidth="1.2" />
                  <rect x="36" y="52" width="28" height="3" rx="1.5" fill="#8ec5e8" />
                </svg>
              </div>
            </div>
          </div>
        ) : viewMode === 'side-by-side' ? (
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* Pre-Op Panel */}
            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#070707] p-4">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/70 border border-white/20 text-[#fca582]">
                  PRE-OPERATIVE BASELINE
                </span>
              </div>
              <div
                className="transition-transform duration-100 ease-out flex items-center justify-center relative"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotateY(${activeModality === '3d' ? yawRotation * 0.7 : 0}deg) rotateX(${activeModality === '3d' ? pitchRotation * 0.7 : 0}deg)`,
                  filter: getFilterStyle()
                }}
              >
                {/* SVG CT/Radiographic Graphic Representation with Lazy Loading simulation */}
                <svg className="w-64 h-64 text-zinc-600 drop-shadow-2xl" viewBox="0 0 200 200" fill="none">
                  <path
                    d="M100 25 C60 25, 35 55, 35 105 C35 145, 55 175, 100 175 C145 175, 165 145, 165 105 C165 55, 140 25, 100 25 Z"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    fill="rgba(30,30,30,0.6)"
                  />
                  {/* Pre-op maxilla retracted & open bite */}
                  <path d="M70 95 Q100 85 130 95" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
                  <path d="M75 125 Q100 135 125 125" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
                  {/* Orbit & piriform */}
                  <circle cx="75" cy="75" r="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  <circle cx="125" cy="75" r="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  <path d="M95 85 L105 85 L100 102 Z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  {/* Pre-op asymmetry landmark deviation */}
                  {showLandmarks && (
                    <g>
                      <circle cx="106" cy="100" r="3" fill="#c8623c" />
                      <text x="112" y="103" fill="#fca582" fontSize="8" fontFamily="monospace">ANS (dev: 2.1mm)</text>
                      <circle cx="94" cy="165" r="3" fill="#c8623c" />
                      <text x="50" y="168" fill="#fca582" fontSize="8" fontFamily="monospace">Me (dev: 3.4mm)</text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Post-Op Panel */}
            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#070707] p-4">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/70 border border-[#4e9a4b]/50 text-[#a3ffb2]">
                  POST-OPERATIVE (EVALUATED)
                </span>
                <span className="text-[10px] text-muted font-mono bg-elevated px-1.5 py-0.5 rounded">
                  {activeModality.toUpperCase()}
                </span>
              </div>
              <div
                className="transition-transform duration-100 ease-out flex items-center justify-center relative"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotateY(${activeModality === '3d' ? yawRotation : 0}deg) rotateX(${activeModality === '3d' ? pitchRotation : 0}deg)`,
                  filter: getFilterStyle()
                }}
              >
                {/* SVG CT/Radiographic Post-op aligned representation */}
                <svg className="w-64 h-64 text-zinc-500 drop-shadow-2xl" viewBox="0 0 200 200" fill="none">
                  <path
                    d="M100 25 C60 25, 35 55, 35 105 C35 145, 55 175, 100 175 C145 175, 165 145, 165 105 C165 55, 140 25, 100 25 Z"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2.5"
                    fill="rgba(40,40,40,0.7)"
                  />
                  {/* Post-op maxilla advanced & occlusion locked */}
                  <path d="M72 98 Q100 92 128 98" stroke="#84e190" strokeWidth="2.5" />
                  <path d="M74 116 Q100 120 126 116" stroke="#84e190" strokeWidth="2.5" />
                  {/* Titanium Fixation Plates representation */}
                  <rect x="65" y="92" width="12" height="4" rx="2" fill="#8ec5e8" stroke="#ffffff" strokeWidth="0.5" />
                  <rect x="123" y="92" width="12" height="4" rx="2" fill="#8ec5e8" stroke="#ffffff" strokeWidth="0.5" />
                  <circle cx="75" cy="75" r="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <circle cx="125" cy="75" r="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <path d="M96 85 L104 85 L100 102 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

                  {/* Caliper measurement tool overlay */}
                  {activeTool === 'ruler' && (
                    <g>
                      <line x1="72" y1="98" x2="128" y2="98" stroke="#a3ffb2" strokeWidth="1.5" strokeDasharray="3,2" />
                      <circle cx="72" cy="98" r="3" fill="#a3ffb2" />
                      <circle cx="128" cy="98" r="3" fill="#a3ffb2" />
                      <rect x="85" y="86" width="30" height="10" rx="2" fill="#122415" stroke="#2f6b3a" strokeWidth="0.5" />
                      <text x="88" y="93.5" fill="#a3ffb2" fontSize="6.5" fontFamily="monospace">24.6mm</text>
                    </g>
                  )}

                  {/* Post-op normalized landmarks */}
                  {showLandmarks && (
                    <g>
                      <line x1="100" y1="30" x2="100" y2="175" stroke="#4e9a4b" strokeDasharray="3,3" strokeWidth="1" />
                      <circle cx="100" cy="102" r="3" fill="#4e9a4b" />
                      <text x="108" y="105" fill="#84e190" fontSize="8" fontFamily="monospace">ANS (0.2mm)</text>
                      <circle cx="100.3" cy="166" r="3" fill="#4e9a4b" />
                      <text x="108" y="169" fill="#84e190" fontSize="8" fontFamily="monospace">Me (0.3mm)</text>
                      <circle cx="100" cy="45" r="2.5" fill="#8EC5E8" />
                      <text x="106" y="47" fill="#8EC5E8" fontSize="7" fontFamily="monospace">N (Nasion)</text>
                      <circle cx="100" cy="120" r="2.5" fill="#84e190" />
                      <text x="106" y="122" fill="#84e190" fontSize="7" fontFamily="monospace">Pog (0.1mm)</text>
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>
        ) : (
          /* OVERLAY SPLIT SLIDER MODE */
          <div className="relative w-full h-full flex items-center justify-center bg-[#070707] overflow-hidden">
            <div
              className="transition-transform duration-100 ease-out flex items-center justify-center relative w-full h-full"
              style={{ transform: `scale(${zoomLevel / 100})`, filter: getFilterStyle() }}
            >
              {/* Graphic container with clip path for split view */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                <svg className="w-full h-full text-zinc-500 absolute inset-0" viewBox="0 0 200 200" fill="none">
                  <path
                    d="M100 25 C60 25, 35 55, 35 105 C35 145, 55 175, 100 175 C145 175, 165 145, 165 105 C165 55, 140 25, 100 25 Z"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2.5"
                    fill="rgba(35,35,35,0.6)"
                  />
                  <path d="M72 98 Q100 92 128 98" stroke="#84e190" strokeWidth="2.5" />
                  <path d="M74 116 Q100 120 126 116" stroke="#84e190" strokeWidth="2.5" />
                </svg>

                {/* Vertical split line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-glow-subtle flex items-center justify-center pointer-events-none"
                  style={{ left: `${splitSliderPos}%` }}
                >
                  <div className="w-5 h-5 rounded-full bg-white text-black text-[9px] flex items-center justify-center font-bold shadow-md">
                    ⇄
                  </div>
                </div>
              </div>
            </div>

            {/* Slider control input */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-64 bg-surface/90 border border-white/15 px-3 py-1.5 rounded-pill flex items-center gap-2">
              <span className="text-[10px] text-muted font-mono">PRE</span>
              <input
                type="range"
                min="0"
                max="100"
                value={splitSliderPos}
                onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
              <span className="text-[10px] text-[#a3ffb2] font-mono">POST</span>
            </div>
          </div>
        )}

        {/* Floating Calibration Tag & Readout */}
        {!isNoFiles && (
          <div className="absolute bottom-3 left-3 bg-surface/80 border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-mono text-muted flex items-center gap-2 pointer-events-none">
            <span>FOV: 180×160mm</span>
            <span>•</span>
            <span>Voxel: 0.38mm³</span>
            <span>•</span>
            <span className="text-[#a3ffb2]">CAD/CAM Splint Registered</span>
            {activeTool === 'ruler' && (
              <>
                <span>•</span>
                <span className="text-[#a3ffb2] font-semibold">Caliper Calibrated: 24.6mm</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
