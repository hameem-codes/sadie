import React, { useState } from 'react';
import { Users, Eye, UserPlus, Circle, Check } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface ActiveViewer {
  id: string;
  name: string;
  initials: string;
  role: string;
  activeSlice: string;
  color: string;
}

export const CoViewingPresence: React.FC = () => {
  const { toast } = useToast();
  const [showPresenceMenu, setShowPresenceMenu] = useState(false);

  const viewers: ActiveViewer[] = [
    {
      id: 'v1',
      name: 'Sarah Chen, MD',
      initials: 'SC',
      role: 'Craniofacial Fellow',
      activeSlice: 'Axial #148',
      color: 'bg-[#8EC5E8] text-black'
    },
    {
      id: 'v2',
      name: 'Marcus Vance, DDS',
      initials: 'MV',
      role: 'Attending Surgeon',
      activeSlice: '3D Mesh',
      color: 'bg-[#a3ffb2] text-black'
    }
  ];

  const handleInvite = () => {
    toast({
      type: 'info',
      title: 'Co-Viewing Link Generated',
      message: 'One-time session link copied to clipboard. Synchronized viewport active.'
    });
    setShowPresenceMenu(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPresenceMenu(!showPresenceMenu)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-elevated/70 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        title="Active Co-Viewing Clinicians"
      >
        <div className="flex -space-x-1.5">
          {viewers.map((v) => (
            <div
              key={v.id}
              className={`w-6 h-6 rounded-full border border-base font-mono text-[10px] font-bold flex items-center justify-center ${v.color}`}
            >
              {v.initials}
            </div>
          ))}
        </div>
        <span className="text-xs text-secondary group-hover:text-white flex items-center gap-1.5">
          <Circle className="w-2 h-2 fill-[#a3ffb2] text-[#a3ffb2] animate-pulse" />
          <span className="font-medium">2 Co-Viewing</span>
        </span>
      </button>

      {showPresenceMenu && (
        <div className="absolute right-0 top-11 w-72 rounded-xl bg-[#16171d] border border-white/20 p-3 shadow-2xl z-50 animate-fade-up">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#8EC5E8]" />
              <span className="text-xs font-semibold text-white">Live Session Presence</span>
            </div>
            <span className="text-[10px] text-muted font-mono uppercase">WebSocket Sync</span>
          </div>

          <div className="space-y-2 mb-3">
            {viewers.map((v) => (
              <div key={v.id} className="p-2 rounded-lg bg-surface border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-[10px] ${v.color}`}>
                    {v.initials}
                  </div>
                  <div>
                    <span className="font-medium text-white block">{v.name}</span>
                    <span className="text-[10px] text-muted">{v.role}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#8EC5E8] bg-[#0f1d24] px-1.5 py-0.5 rounded border border-[#8EC5E8]/30">
                  {v.activeSlice}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleInvite}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-pill bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite Clinician to Session
          </button>
        </div>
      )}
    </div>
  );
};
