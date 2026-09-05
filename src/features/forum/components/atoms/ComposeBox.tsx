import React, { useState, useRef } from 'react';
import { Send }       from 'lucide-react';
import { AnonAvatar } from './AnonAvatar';
import { Button }     from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

const MAX_CHARS = 280;
const WARN_THRESHOLD = 240;

/** SVG circular progress indicator para el conteo de caracteres */
const CharCircle: React.FC<{ count: number }> = ({ count }) => {
  const R    = 10;
  const CIRC = 2 * Math.PI * R;
  const pct  = Math.min(count / MAX_CHARS, 1);
  const dash = CIRC * pct;
  const over = count > MAX_CHARS;
  const warn = count >= WARN_THRESHOLD;

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      {/* track */}
      <circle cx="14" cy="14" r={R} fill="none" stroke="rgba(255,255,255,0.08)"
        strokeWidth="2.5" />
      {/* progress */}
      <circle
        cx="14" cy="14" r={R} fill="none"
        stroke={over ? '#b71234' : warn ? '#f59e0b' : '#004aad'}
        strokeWidth="2.5"
        strokeDasharray={`${dash} ${CIRC}`}
        strokeLinecap="round"
        transform="rotate(-90 14 14)"
        style={{ transition: 'stroke-dasharray 0.15s ease' }}
      />
      {/* counter text (only visible near limit) */}
      {warn && (
        <text x="14" y="18" textAnchor="middle"
          fontSize="7" fontFamily="monospace"
          fill={over ? '#b71234' : '#f59e0b'}
        >
          {MAX_CHARS - count}
        </text>
      )}
    </svg>
  );
};

interface Props {
  onSubmit: (body: string) => Promise<void>;
  compact?: boolean;
}

export const ComposeBox: React.FC<Props> = ({ onSubmit, compact = false }) => {
  const { user }                  = useAuthStore();
  const [body,    setBody]        = useState('');
  const [loading, setLoading]     = useState(false);
  const [error,   setError]       = useState<string | null>(null);
  const taRef                     = useRef<HTMLTextAreaElement>(null);

  const over = body.length > MAX_CHARS;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    setError(null);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = async () => {
    if (!body.trim() || loading || over) return;
    if (body.trim().length < 3) { setError('Mínimo 3 caracteres'); return; }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(body.trim());
      setBody('');
      if (taRef.current) taRef.current.style.height = 'auto';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al publicar');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
  };

  return (
    <div className={`flex gap-3 bg-itec-bg border-b border-itec-border text-xs ${compact ? 'p-3' : 'p-4'}`}>
      <AnonAvatar pseudonym={user?.email || 'Anon'} size={compact ? 'sm' : 'md'} />
      <div className="flex-1 min-w-0">
        <textarea
          ref={taRef}
          value={body}
          onChange={handleInput}
          onKeyDown={handleKey}
          placeholder="¿Qué está pasando en UTN?"
          rows={3}
          className="text-xs w-full bg-transparent text-itec-text outline-none resize-none placeholder:text-itec-muted leading-relaxed"
        />
        {error && <p className="text-xs text-itec-red mt-1">{error}</p>}
        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-itec-border/50">
          <CharCircle count={body.length} />
          <Button
            variant={over ? 'danger' : 'primary'}
            hierarchy="solid"
            onClick={handleSend}
            disabled={!body.trim() || loading || over}
            isLoading={loading}
          >
            <Send size={13} className="mr-1" />
            Publicar
          </Button>
        </div>
      </div>
    </div>
  );
};
