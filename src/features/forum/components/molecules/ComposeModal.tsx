import React, { useEffect, useRef, useState } from 'react';
import { X }          from 'lucide-react';
import { AnonAvatar } from '../atoms/AnonAvatar';
import { Button }     from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

const MAX_CHARS      = 280;
const WARN_THRESHOLD = 240;

const CharCircle: React.FC<{ count: number }> = ({ count }) => {
  const R    = 11;
  const CIRC = 2 * Math.PI * R;
  const pct  = Math.min(count / MAX_CHARS, 1);
  const over = count > MAX_CHARS;
  const warn = count >= WARN_THRESHOLD;
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <circle cx="15" cy="15" r={R} fill="none"
        stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
      <circle
        cx="15" cy="15" r={R} fill="none"
        stroke={over ? '#b71234' : warn ? '#f59e0b' : '#004aad'}
        strokeWidth="2.5"
        strokeDasharray={`${CIRC * pct} ${CIRC}`}
        strokeLinecap="round"
        transform="rotate(-90 15 15)"
        style={{ transition: 'stroke-dasharray 0.15s ease' }}
      />
      {warn && (
        <text x="15" y="19" textAnchor="middle"
          fontSize="8" fontFamily="monospace"
          fill={over ? '#b71234' : '#f59e0b'}>
          {MAX_CHARS - count}
        </text>
      )}
    </svg>
  );
};

interface Props {
  isOpen:      boolean;
  onClose:     () => void;
  onSubmit:    (body: string) => Promise<void>;
  placeholder?: string;
}

export const ComposeModal: React.FC<Props> = ({
  isOpen, onClose, onSubmit, placeholder = '¿Qué está pasando en UTN?',
}) => {
  const { user }              = useAuthStore();
  const [body,    setBody]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const taRef                 = useRef<HTMLTextAreaElement>(null);

  const over = body.length > MAX_CHARS;

  useEffect(() => {
    if (isOpen) { setTimeout(() => taRef.current?.focus(), 60); }
    else        { setBody(''); setError(null); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    setError(null);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = async () => {
    const trimmed = body.trim();
    if (!trimmed || loading || over) return;
    if (trimmed.length < 3) { setError('Mínimo 3 caracteres'); return; }
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
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60  p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-itec-bg border border-itec-border rounded-t-4xl sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom-full sm:fade-in sm:zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-itec-border">
          <span className="text-sm font-semibold text-itec-text">Nueva publicación</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-itec-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Compose area */}
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
          <CharCircle count={body.length} />
          <Button
            variant={over ? 'danger' : 'primary'}
            hierarchy="solid"
            onClick={handleSend}
            disabled={!body.trim() || loading || over}
            isLoading={loading}
          >
            Publicar
          </Button>
        </div>
      </div>
    </div>
  );
};
