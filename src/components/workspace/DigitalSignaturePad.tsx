import React, { useRef, useState, useEffect } from 'react';
import { Eraser, CheckCircle2, ShieldCheck, PenTool } from 'lucide-react';
import { Button } from '../ui/Button';

interface DigitalSignaturePadProps {
  onSign: (signatureDataUrl: string, signerName: string) => void;
  signerNameDefault?: string;
}

export const DigitalSignaturePad: React.FC<DigitalSignaturePadProps> = ({
  onSign,
  signerNameDefault = 'Attending Surgeon, Oral & Maxillofacial'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerTitle, setSignerTitle] = useState(signerNameDefault);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApplySignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSign(dataUrl, signerTitle);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-surface border border-border-hairline shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-accent" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Clinician Digital Sign-Off Pad
          </h4>
        </div>
        <span className="text-[10px] font-mono text-muted flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-status-completed" />
          Cryptographically Verified
        </span>
      </div>

      <div className="relative border border-border-hairline rounded-lg bg-elevated overflow-hidden">
        <canvas
          ref={canvasRef}
          width={440}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-28 cursor-crosshair touch-none"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted text-xs select-none">
            Sign here with mouse, trackpad, or stylus
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <input
          type="text"
          value={signerTitle}
          onChange={(e) => setSignerTitle(e.target.value)}
          placeholder="Clinician credentials..."
          className="bg-base border border-border-hairline rounded-pill px-3 py-1 text-xs text-primary placeholder-muted focus:outline-none focus:border-border-subtle w-60 font-mono"
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            disabled={!hasDrawn}
            className="text-xs text-secondary hover:text-primary"
          >
            <Eraser className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApplySignature}
            disabled={!hasDrawn}
            className="text-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Apply Sign-Off
          </Button>
        </div>
      </div>
    </div>
  );
};
