import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  side?: 'right' | 'left';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'md',
  side = 'right'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const sideClasses = side === 'right' ? 'right-0 top-0 bottom-0' : 'left-0 top-0 bottom-0';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-base/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className={`fixed inset-y-0 ${side === 'right' ? 'right-0 pl-0 xs:pl-6 sm:pl-10' : 'left-0 pr-0 xs:pr-6 sm:pr-10'} max-w-full flex`}>
        <div
          className={`w-full max-w-full ${widthClasses[width]} bg-[#111111] border-l border-white/15 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-surface/50">
            <div>
              {title && (
                <h3 className="font-serif text-lg font-medium text-primary">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-muted mt-0.5">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close drawer"
              className="text-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
