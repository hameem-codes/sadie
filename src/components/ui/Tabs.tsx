import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = ''
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-border-hairline gap-6 ${className}`}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-sm font-medium transition-all relative flex items-center gap-2 ${
                isActive ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-elevated text-muted">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center p-1 rounded-pill bg-surface border border-border-hairline max-w-full overflow-x-auto custom-scrollbar shrink-0 ${className}`}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-pill text-xs font-medium transition-all flex items-center gap-1.5 sm:gap-2 select-none hover-lift whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? 'bg-white text-base shadow-sm font-semibold'
                : 'text-secondary hover:text-primary hover:bg-elevated/60'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span className="whitespace-nowrap">{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ${
                  isActive ? 'bg-base text-white' : 'bg-elevated text-muted'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
