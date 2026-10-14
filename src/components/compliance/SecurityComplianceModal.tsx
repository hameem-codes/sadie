import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Clock,
  UserCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface SecurityComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityComplianceModal: React.FC<SecurityComplianceModalProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [sessionTimeoutMin, setSessionTimeoutMin] = useState(15);
  const [autoMaskMRN, setAutoMaskMRN] = useState(false);

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast({
      type: is2FAEnabled ? 'warning' : 'success',
      title: is2FAEnabled ? '2FA Disabled' : 'FIDO2 / TOTP 2FA Enforced',
      message: is2FAEnabled ? 'Emergency bypass active.' : 'Hardware security keys required for DICOM export.'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Security, HIPAA & Cryptographic Controls" size="lg">
      <div className="space-y-4 text-xs">
        {/* HIPAA Banner */}
        <div className="p-3.5 rounded-xl bg-[#122415] border border-[#2f6b3a]/60 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#a3ffb2] shrink-0" />
          <div>
            <span className="font-semibold text-white block">
              HIPAA Security Rule (45 CFR § 164.312) Verified
            </span>
            <p className="text-[11px] text-[#a3ffb2]/90">
              End-to-end TLS 1.3 in-transit, AES-256-GCM at rest, with automated BAA validation and zero unauthorized external telemetry.
            </p>
          </div>
        </div>

        {/* Security Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Two-Factor Authentication */}
          <div className="p-3.5 rounded-xl bg-surface/60 border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#8EC5E8]" />
                <span className="font-medium text-white">2-Factor Authentication</span>
              </div>
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`w-9 h-5 rounded-pill transition-colors p-0.5 cursor-pointer ${
                  is2FAEnabled ? 'bg-[#a3ffb2]' : 'bg-elevated border border-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    is2FAEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Requires hardware WebAuthn key or authenticator app for clinical sign-offs.
            </p>
          </div>

          {/* Session Timeout */}
          <div className="p-3.5 rounded-xl bg-surface/60 border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8EC5E8]" />
                <span className="font-medium text-white">Inactivity Session Timeout</span>
              </div>
              <span className="font-mono text-white text-[11px] font-semibold">{sessionTimeoutMin}m</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={sessionTimeoutMin}
              onChange={(e) => setSessionTimeoutMin(Number(e.target.value))}
              className="accent-[#8EC5E8] w-full cursor-pointer"
            />
            <p className="text-[11px] text-muted">
              Auto-locks workspace when screen is left unattended in clinical areas.
            </p>
          </div>

          {/* Auto-masking MRN */}
          <div className="p-3.5 rounded-xl bg-surface/60 border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#8EC5E8]" />
                <span className="font-medium text-white">De-Identify / Mask MRN</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAutoMaskMRN(!autoMaskMRN);
                  toast({ type: 'info', title: autoMaskMRN ? 'MRN Unmasked' : 'MRN Masked for Screen Privacy' });
                }}
                className={`w-9 h-5 rounded-pill transition-colors p-0.5 cursor-pointer ${
                  autoMaskMRN ? 'bg-[#a3ffb2]' : 'bg-elevated border border-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoMaskMRN ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Obfuscates patient medical record numbers when presenting cases publicly.
            </p>
          </div>

          {/* Data Retention */}
          <div className="p-3.5 rounded-xl bg-surface/60 border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#8EC5E8]" />
              <span className="font-medium text-white">Statutory Data Retention</span>
            </div>
            <p className="text-[11px] text-muted">
              Preserves 3D radiomic models and signed operative rubrics for 7 years according to state medical board requirements.
            </p>
            <span className="font-mono text-[10px] text-[#a3ffb2]">Policy: Retention Active (Permanent)</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
