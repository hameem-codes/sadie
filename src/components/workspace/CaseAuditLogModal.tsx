import React from 'react';
import { ShieldCheck, Lock, Clock, User, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

export interface AuditLogEntry {
  id: string;
  action: string;
  category: 'Security' | 'Clinical' | 'Compliance' | 'Imaging';
  user: string;
  role: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

interface CaseAuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber: string;
}

export const CaseAuditLogModal: React.FC<CaseAuditLogModalProps> = ({
  isOpen,
  onClose,
  caseNumber
}) => {
  const auditEntries: AuditLogEntry[] = [
    {
      id: 'aud-1',
      action: 'DICOM Series Ingest & Hash Verify',
      category: 'Imaging',
      user: 'System Ingestion Agent',
      role: 'Automated Pipeline',
      ipAddress: '10.240.12.8 (Internal PACS)',
      timestamp: 'Today at 08:30:15',
      details: '512 slices SHA-256 verified. Voxel grid 0.38mm registered.'
    },
    {
      id: 'aud-2',
      action: 'Rubric Score Computed & Benchmarked',
      category: 'Clinical',
      user: 'SADIE Evaluator v3.2',
      role: 'Core AI Engine',
      ipAddress: '10.240.12.14',
      timestamp: 'Today at 08:31:02',
      details: 'Evaluated 48 landmarks. Score synthesized with 95% CI.'
    },
    {
      id: 'aud-3',
      action: 'Landmark Co-ordinates Inspected',
      category: 'Compliance',
      user: 'Dr. Sarah Chen',
      role: 'Craniofacial Fellow',
      ipAddress: '192.168.1.104 (Hospital VLAN)',
      timestamp: 'Today at 09:12:44',
      details: 'Session started. Verified ANS/PNS pitch alignment.'
    },
    {
      id: 'aud-4',
      action: 'Digital Signature Applied',
      category: 'Security',
      user: 'Dr. Marcus Vance',
      role: 'Attending Surgeon',
      ipAddress: '192.168.1.112 (Hospital VLAN)',
      timestamp: 'Today at 10:24:18',
      details: 'Cryptographic SHA-512 seal attached to Operative Evaluation Report.'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Case Audit Trail & HIPAA Compliance Log: ${caseNumber}`} size="lg">
      <div className="space-y-4">
        {/* Compliance Banner */}
        <div className="p-3.5 rounded-xl bg-surface border border-border-hairline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-status-completed/10 border border-status-completed/30 flex items-center justify-center text-status-completed">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-primary flex items-center gap-2">
                <span>HIPAA Title II & 45 CFR § 164.312 Compliant</span>
                <Badge variant="forest" size="sm">Active</Badge>
              </div>
              <p className="text-[11px] text-muted">
                Immutable, append-only cryptographic ledger with AES-256 GCM encryption at rest.
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-muted">
            Retention: <span className="text-primary font-medium">7 Years</span>
          </div>
        </div>

        {/* Audit Log Timeline */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto custom-scrollbar pr-1">
          {auditEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-lg bg-elevated border border-border-hairline hover:border-border-subtle transition-all text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{entry.action}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-pill font-mono ${
                    entry.category === 'Security'
                      ? 'bg-status-processing/10 text-status-processing border border-status-processing/30'
                      : entry.category === 'Clinical'
                      ? 'bg-status-completed/10 text-status-completed border border-status-completed/30'
                      : 'bg-elevated text-secondary border border-border-hairline'
                  }`}>
                    {entry.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {entry.timestamp}
                </span>
              </div>

              <p className="text-muted text-[11px] mb-2">{entry.details}</p>

              <div className="flex items-center justify-between text-[10px] font-mono text-secondary pt-1.5 border-t border-border-hairline">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-muted" />
                  {entry.user} ({entry.role})
                </span>
                <span className="text-muted">{entry.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
