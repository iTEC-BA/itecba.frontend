import React, { useEffect, useRef, useState } from 'react';
import { X, Send }       from 'lucide-react';
import { AnonAvatar }    from '../atoms/AnonAvatar';
import { useAuth }       from '@context/AuthContext';

interface Props {
  isOpen:   boolean;
  onClose:  () => void;
  onSubmit: (body: string) => Promise<void>;
  placeholder?: string;
}

export const ComposeModal: React.FC<Props> = ({
  isOpen, onClose, onSubmit, placeholder = '¿Qué está pasando en UTN?',
}) => {
  const { user }                  = useAuth();
  const [body, setBody]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const taRef                     = useRef<HTMLTextAreaElement>(null);

  // Auto-focus al abrir
  useEffect(() => {
    if (isOpen) { setTimeout(() => taRef.current?.focus(), 60); }
    else        { setBody(''); setError(null); }
  }, [isOpen]);

  // Escape para cerrar
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = async () => {
    const trimmed = body.trim();
    if (!trimmed || loading) return;
    if (trimmed.length < 3)   { setError('Mínimo 3 caracteres'); return; }
    if (trimmed.length > 1000){ setError('Máximo 1000 caracteres'); return; }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(trimmed);
      setBody('');
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al publicar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-itec-bg border border-itec-border rounded-t-4xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full sm:fade-in sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-itec-border">
          <span className="text-sm font-semibold text-itec-text">Nueva publicación</span>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-itec-muted hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Compose */}
        <div className="flex gap-3 px-5 py-4">
          <AnonAvatar pseudonym={user?.email || 'Anon'} size="md" />
          <div className="flex-1 min-w-0">
            <textarea
              ref={taRef}
              value={body}
              onChange={handleInput}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
              placeholder={placeholder}
              rows={4}
              className="w-full bg-transparent text-sm text-itec-text outline-none resize-none placeholder:text-itec-muted leading-relaxed"
            />
            {error && <p className="text-xs text-itec-red mt-1">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pb-5 pt-2 border-t border-itec-border/50">
          <span className={`text-xs font-mono ${body.length > 950 ? 'text-itec-red' : 'text-itec-muted'}`}>
            {body.length}/1000
          </span>
          <button
            onClick={handleSend}
            disabled={!body.trim() || loading}
            className="flex items-center gap-2 px-5 py-2 bg-itec-red hover:bg-itec-red/80 disabled:opacity-40 text-white font-semibold rounded-full text-sm transition-all active:scale-95"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Send size={13} />Publicar</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};
