import React, { useState } from 'react';
import {
  Server,
  Database,
  Calendar,
  Cloud,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Code,
  CalendarPlus
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber?: string;
  patientName?: string;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  caseNumber = 'MX-2026-0891',
  patientName = 'Eleanor Vance-Cole'
}) => {
  const { toast } = useToast();
  const [isSyncingPacs, setIsSyncingPacs] = useState(false);
  const [isSyncingEpic, setIsSyncingEpic] = useState(false);

  const handleSyncPacs = () => {
    setIsSyncingPacs(true);
    setTimeout(() => {
      setIsSyncingPacs(false);
      toast({
        type: 'success',
        title: 'PACS Query/Retrieve Synced',
        message: 'Connected to Orthanc/GE PACS. 512 DICOM axial slices matched.'
      });
    }, 1500);
  };

  const handleSyncEpic = () => {
    setIsSyncingEpic(true);
    setTimeout(() => {
      setIsSyncingEpic(false);
      toast({
        type: 'success',
        title: 'Epic EHR FHIR Resource Exported',
        message: 'Dispatched HL7 FHIR R4 Observation [Maxillofacial_Surgical_Evaluation] to Epic Hyperspace.'
      });
    }, 1500);
  };

  const handleExportCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SADIE//Maxillofacial Outcomes//EN\nBEGIN:VEVENT\nSUMMARY:Maxillofacial Surgery: ${patientName} (${caseNumber})\nDESCRIPTION:SADIE Pre-Op CAD/CAM Splint Verification & Bimaxillary Osteotomy\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Surgical_Procedure_${caseNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      type: 'success',
      title: 'Calendar Event Downloaded',
      message: 'iCalendar (.ics) ready for Google Calendar, Outlook, and Apple Calendar.'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hospital PACS, EHR & Clinical Integrations" size="lg">
      <div className="space-y-4 text-xs">
        {/* Integrations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* DICOM PACS Integration */}
          <div className="p-3.5 rounded-xl bg-surface border border-border-hairline shadow-sm flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent-blue" />
                <span className="font-semibold text-primary">DICOM PACS Network</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-[#a3ffb2] bg-emerald-500/10 px-2 py-0.5 rounded-pill border border-emerald-500/20">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Automated C-FIND and C-MOVE over DICOM port 11112. Directly stream high-bitrate CBCTs without manual export.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncPacs}
              disabled={isSyncingPacs}
              className="text-xs w-full"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncingPacs ? 'animate-spin' : ''}`} />
              {isSyncingPacs ? 'Querying PACS...' : 'Sync DICOM Studies'}
            </Button>
          </div>

          {/* Epic & Cerner FHIR Sync */}
          <div className="p-3.5 rounded-xl bg-surface border border-border-hairline shadow-sm flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-accent-blue" />
                <span className="font-semibold text-primary">Epic / Cerner EHR (FHIR R4)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-[#a3ffb2] bg-emerald-500/10 px-2 py-0.5 rounded-pill border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Bi-directional HL7 FHIR sync with Epic Hyperspace. Operative scores automatically populate inpatient charts.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncEpic}
              disabled={isSyncingEpic}
              className="text-xs w-full"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncingEpic ? 'animate-spin' : ''}`} />
              {isSyncingEpic ? 'Pushing FHIR...' : 'Push to EHR Chart'}
            </Button>
          </div>

          {/* Calendar Integration */}
          <div className="p-3.5 rounded-xl bg-surface border border-border-hairline shadow-sm flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent-blue" />
                <span className="font-semibold text-primary">Surgery Calendar Sync</span>
              </div>
              <span className="text-[10px] font-mono text-muted">.ics Format</span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Export surgery date, patient MRN, and operative checklist directly to your clinical or OR calendar.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCalendar}
              className="text-xs w-full"
            >
              <CalendarPlus className="w-3.5 h-3.5 mr-1.5 text-accent-blue" />
              Add Surgery to Calendar (.ics)
            </Button>
          </div>

          {/* Cloud Storage & Webhooks */}
          <div className="p-3.5 rounded-xl bg-surface border border-border-hairline shadow-sm flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-accent-blue" />
                <span className="font-semibold text-primary">Cloud Archive & Webhooks</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-[#a3ffb2] bg-emerald-500/10 px-2 py-0.5 rounded-pill border border-emerald-500/20">
                Encrypted
              </span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Instant webhooks fired on analysis completion. Mirror DICOM datasets to AWS S3 / GCP Healthcare bucket.
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted">
              <span>Endpoint:</span>
              <span className="text-primary truncate">https://api.hospital.org/sadie/webhook</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
