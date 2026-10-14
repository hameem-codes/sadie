import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(t => {
          const icons = {
            success: <CheckCircle2 className="w-4 h-4 text-status-completed shrink-0" />,
            warning: <AlertTriangle className="w-4 h-4 text-status-processing shrink-0" />,
            error: <AlertCircle className="w-4 h-4 text-status-failed shrink-0" />,
            info: <Info className="w-4 h-4 text-sky-400 shrink-0" />
          };

          return (
            <div
              key={t.id}
              role="alert"
              className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg bg-[#181818] border border-white/20 shadow-xl animate-fade-up"
            >
              <div className="mt-0.5">{icons[t.type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">{t.title}</p>
                {t.message && <p className="text-xs text-secondary mt-0.5 leading-relaxed">{t.message}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted hover:text-white p-1 rounded-md transition-colors -mr-1 -mt-1"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
