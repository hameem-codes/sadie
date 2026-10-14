import React, { useState } from 'react';
import { MessageSquare, Pin, Send, AtSign, Check, X, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface ImageAnnotation {
  id: string;
  x: number;
  y: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies?: {
    author: string;
    content: string;
    timestamp: string;
  }[];
}

interface ImagingAnnotationsProps {
  onClose?: () => void;
}

export const ImagingAnnotations: React.FC<ImagingAnnotationsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [annotations, setAnnotations] = useState<ImageAnnotation[]>([
    {
      id: 'ann-1',
      x: 48,
      y: 52,
      author: 'Dr. Marcus Vance',
      role: 'Attending Surgeon',
      content: 'Examine the anterior nasal spine deviation relative to sagittal mid-plane. Ensure CAD/CAM splint accounts for 1.8mm roll.',
      timestamp: 'Today at 09:14 AM',
      resolved: false,
      replies: [
        {
          author: 'Dr. Sarah Chen',
          content: '@Dr. Vance verified. Splint clearance re-adjusted on osteotomy pitch.',
          timestamp: '09:28 AM'
        }
      ]
    },
    {
      id: 'ann-2',
      x: 72,
      y: 78,
      author: 'Dr. Sarah Chen',
      role: 'Fellow',
      content: 'Titanium miniplate screw trajectory clears inferior alveolar canal by 3.2mm. Safe margin confirmed.',
      timestamp: 'Today at 10:05 AM',
      resolved: true
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newAnn: ImageAnnotation = {
      id: `ann-${Date.now()}`,
      x: 50 + Math.floor(Math.random() * 20 - 10),
      y: 50 + Math.floor(Math.random() * 20 - 10),
      author: 'Attending Clinician',
      role: 'Maxillofacial Surgeon',
      content: newComment,
      timestamp: 'Just now',
      resolved: false,
      replies: []
    };

    setAnnotations([newAnn, ...annotations]);
    setNewComment('');
    toast({
      type: 'success',
      title: 'Annotation Pinned',
      message: 'New clinical comment saved at current coordinates.'
    });
  };

  const handleAddReply = (annotationId: string) => {
    if (!replyText.trim()) return;

    setAnnotations(prev =>
      prev.map(ann => {
        if (ann.id === annotationId) {
          const replies = ann.replies || [];
          return {
            ...ann,
            replies: [
              ...replies,
              {
                author: 'Attending Clinician',
                content: replyText,
                timestamp: 'Just now'
              }
            ]
          };
        }
        return ann;
      })
    );

    setReplyText('');
    setActiveReplyId(null);
    toast({ type: 'info', title: 'Reply Posted' });
  };

  const toggleResolved = (annotationId: string) => {
    setAnnotations(prev =>
      prev.map(ann =>
        ann.id === annotationId ? { ...ann, resolved: !ann.resolved } : ann
      )
    );
  };

  return (
    <div className="p-4 rounded-xl bg-surface/80 border border-white/10 flex flex-col space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#8EC5E8]" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
            Imaging Annotations & Discussion Thread
          </h4>
        </div>
        <span className="text-[10px] text-muted font-mono">
          {annotations.filter(a => !a.resolved).length} Unresolved Pins
        </span>
      </div>

      {/* New Annotation Input */}
      <form onSubmit={handleAddAnnotation} className="relative">
        <textarea
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add clinical observation or @mention team member..."
          className="w-full bg-[#0a0a0c] border border-white/15 rounded-lg p-2.5 text-xs text-white placeholder-muted focus:outline-none focus:border-white/30 resize-none font-sans"
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted flex items-center gap-1 font-mono">
            <AtSign className="w-3 h-3 text-[#8EC5E8]" />
            Type @ to mention colleague
          </span>
          <Button type="submit" variant="primary" size="sm" className="text-xs py-1 px-3">
            <Pin className="w-3.5 h-3.5 mr-1" />
            Pin Comment
          </Button>
        </div>
      </form>

      {/* Annotation Threads List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
        {annotations.map((ann) => (
          <div
            key={ann.id}
            className={`p-3 rounded-lg border text-xs transition-colors ${
              ann.resolved
                ? 'bg-elevated/40 border-white/5 opacity-75'
                : 'bg-elevated/80 border-white/10 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{ann.author}</span>
                <span className="text-[10px] text-muted font-mono bg-surface px-1.5 py-0.2 rounded">
                  {ann.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted">{ann.timestamp}</span>
                <button
                  type="button"
                  onClick={() => toggleResolved(ann.id)}
                  className={`p-1 rounded transition-colors ${
                    ann.resolved ? 'text-[#a3ffb2]' : 'text-muted hover:text-white'
                  }`}
                  title={ann.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-secondary leading-relaxed mb-2">{ann.content}</p>

            {/* Replies */}
            {ann.replies && ann.replies.length > 0 && (
              <div className="ml-3 pl-2.5 border-l border-white/10 space-y-1.5 my-2">
                {ann.replies.map((rep, idx) => (
                  <div key={idx} className="bg-surface/50 p-1.5 rounded">
                    <div className="flex items-center justify-between text-[10px] text-muted mb-0.5">
                      <span className="font-medium text-white">{rep.author}</span>
                      <span>{rep.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-secondary">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply toggle & input */}
            {activeReplyId === ann.id ? (
              <div className="mt-2 flex items-center gap-1.5">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply to thread..."
                  className="flex-1 bg-base border border-white/15 rounded-pill px-2.5 py-1 text-xs text-white placeholder-muted focus:outline-none"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => handleAddReply(ann.id)}
                  className="text-xs px-2.5 py-1"
                >
                  <Send className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveReplyId(null)}
                  className="text-xs px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveReplyId(ann.id)}
                className="text-[10px] text-[#8EC5E8] hover:underline font-mono mt-1 cursor-pointer"
              >
                + Reply to observation
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
