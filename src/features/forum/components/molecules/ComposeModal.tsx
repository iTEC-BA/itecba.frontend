import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ComposeBox } from '../atoms/ComposeBox';

interface Props {
  isOpen:   boolean;
  onClose:  () => void;
  onSubmit: (body: string) => Promise<void>;
}

export const ComposeModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (body: string) => {
    await onSubmit(body);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 "
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-itec-bg border border-itec-border rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-itec-border">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-itec-muted hover:text-itec-text transition-colors">
            <X size={16} />
          </button>
          <span className="text-sm font-semibold text-itec-text">Nueva publicación</span>
          <div className="w-8" />
        </div>
        <ComposeBox onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
