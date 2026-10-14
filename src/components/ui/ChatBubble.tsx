import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { CopilotMessage } from '../../types';

export interface ChatBubbleProps {
  message: CopilotMessage;
  onSuggestionClick?: (suggestion: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onSuggestionClick
}) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 my-3 animate-fade-up">
        <div className="max-w-[80%] md:max-w-[70%]">
          <div className="bg-btn-primary-bg text-btn-primary-text border border-border-hairline rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
            {message.content}
          </div>
          <div className="text-[10px] text-muted text-right mt-1 px-1">
            {message.timestamp}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-elevated border border-border-hairline flex items-center justify-center text-[11px] font-semibold text-secondary shrink-0 select-none">
          YOU
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3 my-4 animate-fade-up">
      {/* Sparkle badge avatar */}
      <div className="w-8 h-8 rounded-full bg-btn-primary-bg text-btn-primary-text text-base flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <Sparkles className="w-4 h-4 fill-current" />
      </div>

      <div className="flex-1 max-w-[88%] min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-primary">SADIE Copilot</span>
          <span className="text-[10px] text-muted">{message.timestamp}</span>
        </div>

        {/* Message body */}
        <div className="text-sm leading-relaxed text-primary whitespace-pre-line bg-surface border border-border-hairline rounded-2xl rounded-tl-sm p-4 shadow-card">
          {message.content}

          {/* Nested Result Card */}
          {message.nestedCard && (
            <div className="mt-3 p-3.5 rounded-xl bg-elevated border border-border-hairline">
              <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-completed" />
                  <h4 className="text-xs font-medium text-primary">
                    {message.nestedCard.title}
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-status-completed bg-status-completed/10 px-2 py-0.5 rounded-pill border border-status-completed/30">
                  {message.nestedCard.badge}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 my-2.5 text-center">
                <div className="p-2 rounded bg-surface border border-border-hairline">
                  <span className="text-[11px] font-mono text-primary block font-medium">
                    {message.nestedCard.stat1}
                  </span>
                </div>
                <div className="p-2 rounded bg-surface border border-border-hairline">
                  <span className="text-[11px] font-mono text-primary block font-medium">
                    {message.nestedCard.stat2}
                  </span>
                </div>
                <div className="p-2 rounded bg-surface border border-border-hairline">
                  <span className="text-[11px] font-mono text-primary block font-medium">
                    {message.nestedCard.stat3}
                  </span>
                </div>
              </div>

              <p className="text-xs text-secondary mt-1">
                {message.nestedCard.summary}
              </p>
            </div>
          )}

          {/* Key measurements breakdown if present */}
          {message.measurements && message.measurements.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block">
                Evaluated Landmarks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.measurements.map((m, i) => (
                  <div key={i} className="text-xs p-2 rounded bg-surface border border-border-hairline flex items-start justify-between">
                    <div>
                      <span className="font-medium text-primary block">{m.landmark}</span>
                      <span className="text-muted text-[11px]">{m.assessment}</span>
                    </div>
                    <span className="font-mono text-secondary text-[11px]">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources and Evidence citations */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-hairline flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-muted uppercase font-medium">Radiographic Sources:</span>
              {message.sources.map((src, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-surface border border-border-hairline text-secondary"
                >
                  <CheckCircle2 className="w-3 h-3 text-status-completed" />
                  {src.title}
                  {src.confidence && <span className="text-muted">({src.confidence}%)</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick(sug)}
                className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-pill bg-elevated hover:bg-elevated-hover border border-border-hairline text-secondary hover:text-primary hover-lift transition-all"
              >
                <span>{sug}</span>
                <ChevronRight className="w-3 h-3 text-muted" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
