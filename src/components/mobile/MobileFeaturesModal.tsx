import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Camera,
  QrCode,
  WifiOff,
  Bell,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface MobileFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onVoiceNoteAdded?: (transcript: string) => void;
  onQrScanned?: (patientId: string) => void;
}

export const MobileFeaturesModal: React.FC<MobileFeaturesModalProps> = ({
  isOpen,
  onClose,
  patientName,
  onVoiceNoteAdded,
  onQrScanned
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'voice' | 'camera' | 'scanner' | 'offline'>('voice');

  // Voice note dictation state
  const [isRecording, setIsRecording] = useState(false);
  const [dictationText, setDictationText] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  // Scanner simulator state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Offline mode state
  const [isOfflineModeActive, setIsOfflineModeActive] = useState(false);
  const [cachedCasesCount, setCachedCasesCount] = useState(12);

  // Camera capture simulation
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setDictationText('Listening... Clinical operative observations streaming...');

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    // Simulate speech-to-text dictation
    setTimeout(() => {
      setDictationText('Patient presents with 4.5mm maxillary retrognathia and anterior open bite. Splint alignment verified with zero impingement on infraorbital bundle.');
    }, 2500);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSaveVoiceNote = () => {
    if (dictationText && onVoiceNoteAdded) {
      onVoiceNoteAdded(dictationText);
    }
    toast({
      type: 'success',
      title: 'Voice Note Appended',
      message: 'Transcribed clinical note attached to case documentation.'
    });
    setDictationText('');
    setRecordingSeconds(0);
  };

  const simulateQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const mockMRN = 'MRN-849201';
      setScannedResult(mockMRN);
      if (onQrScanned) onQrScanned(mockMRN);
      toast({
        type: 'success',
        title: 'Patient Wristband Verified',
        message: `Matched ${mockMRN}: ${patientName}`
      });
    }, 1800);
  };

  const simulateCameraCapture = () => {
    setCapturedPhoto('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231a1a24"/><text x="150" y="100" fill="%238EC5E8" font-size="14" text-anchor="middle" font-family="sans-serif">Clinical Photo: Intraoral Occlusal View</text><circle cx="150" cy="140" r="18" fill="%23a3ffb2"/></svg>');
    toast({
      type: 'success',
      title: 'Clinical Photo Captured',
      message: 'Attached to pre-operative photo catalogue.'
    });
  };

  const toggleOfflineMode = () => {
    setIsOfflineModeActive(!isOfflineModeActive);
    toast({
      type: isOfflineModeActive ? 'info' : 'success',
      title: isOfflineModeActive ? 'Online Mode Restored' : 'Clinic Rounds Offline Mode Enabled',
      message: isOfflineModeActive
        ? 'Synchronized 12 case modifications with central server.'
        : 'All 12 cases cached in IndexedDB. Safe for underground surgical suites.'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mobile & Clinic Rounds Suite" size="md">
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-elevated p-1 rounded-pill border border-border-hairline text-xs">
          {[
            { id: 'voice', label: 'Voice Notes', icon: Mic },
            { id: 'camera', label: 'Camera Capture', icon: Camera },
            { id: 'scanner', label: 'Wristband QR', icon: QrCode },
            { id: 'offline', label: 'Offline Mode', icon: WifiOff }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-pill font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-btn-primary-bg text-btn-primary-text font-semibold shadow-sm'
                    : 'text-secondary hover:text-primary hover:bg-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Voice Notes */}
        {activeTab === 'voice' && (
          <div className="space-y-3 p-4 rounded-xl bg-surface border border-border-hairline text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">Clinical Voice Dictation</span>
              {isRecording && (
                <span className="font-mono text-rose-500 flex items-center gap-1 text-[11px] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Recording: {recordingSeconds}s
                </span>
              )}
            </div>

            <div className="p-3 rounded-lg bg-elevated border border-border-hairline min-h-24 text-secondary leading-relaxed font-sans">
              {dictationText || (
                <span className="text-muted italic">
                  Press the microphone button and dictate clinical observations. Speech is auto-transcribed using Web Speech AI.
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              {isRecording ? (
                <Button variant="danger" size="sm" onClick={stopVoiceRecording} className="text-xs">
                  <MicOff className="w-3.5 h-3.5 mr-1" />
                  Stop Recording
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={startVoiceRecording} className="text-xs">
                  <Mic className="w-3.5 h-3.5 mr-1" />
                  Start Dictation
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveVoiceNote}
                disabled={!dictationText || isRecording}
                className="text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#a3ffb2]" />
                Append to Case
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Camera Capture */}
        {activeTab === 'camera' && (
          <div className="space-y-3 p-4 rounded-xl bg-surface border border-border-hairline text-xs text-center shadow-sm">
            {capturedPhoto ? (
              <div className="space-y-2">
                <img
                  src={capturedPhoto}
                  alt="Captured clinical view"
                  loading="lazy"
                  className="w-full h-40 object-cover rounded-lg border border-border-hairline"
                />
                <Button variant="outline" size="sm" onClick={() => setCapturedPhoto(null)} className="text-xs">
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Retake Photo
                </Button>
              </div>
            ) : (
              <div className="py-6 border-2 border-dashed border-border-hairline rounded-lg flex flex-col items-center justify-center space-y-2">
                <Camera className="w-8 h-8 text-accent-blue" />
                <p className="text-secondary text-xs">Position device camera to document intraoral or profile view</p>
                <Button variant="primary" size="sm" onClick={simulateCameraCapture} className="text-xs mt-2">
                  Capture Clinical Photo
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Barcode / QR Scanner */}
        {activeTab === 'scanner' && (
          <div className="space-y-3 p-4 rounded-xl bg-surface border border-border-hairline text-xs text-center shadow-sm">
            <div className="py-6 border-2 border-dashed border-border-hairline rounded-lg flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
              {isScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-accent-blue shadow-glow-cyan animate-pulse top-1/2" />
              )}
              <QrCode className="w-10 h-10 text-secondary" />
              <p className="text-secondary text-xs">Scan patient wristband or surgical wafer barcode</p>
              <Button
                variant="primary"
                size="sm"
                onClick={simulateQrScan}
                disabled={isScanning}
                className="text-xs mt-2"
              >
                {isScanning ? 'Scanning Barcode...' : 'Scan Wristband'}
              </Button>
            </div>

            {scannedResult && (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-600 dark:text-[#a3ffb2]">
                <span>Verified Match: {scannedResult}</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Offline Mode */}
        {activeTab === 'offline' && (
          <div className="space-y-3 p-4 rounded-xl bg-surface border border-border-hairline text-xs shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-primary block">Clinic Rounds Offline Mode</span>
                <span className="text-[11px] text-secondary">
                  Full local CBCT slice viewing & scoring when detached from hospital Wi-Fi.
                </span>
              </div>
              <button
                type="button"
                onClick={toggleOfflineMode}
                className={`w-11 h-6 rounded-pill transition-colors p-0.5 cursor-pointer ${
                  isOfflineModeActive ? 'bg-emerald-500' : 'bg-elevated border border-border-hairline'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isOfflineModeActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-2.5 rounded bg-elevated border border-border-hairline flex items-center justify-between font-mono text-[11px]">
              <span className="text-secondary">Cached Cases in Local Storage:</span>
              <span className="text-accent-blue font-bold">{cachedCasesCount} Cases (1.4 GB)</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
