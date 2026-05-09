import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { AnonAvatar } from './AnonAvatar';
import { useAuth } from '@context/AuthContext';

interface Props { onSubmit: (body: string) => Promise<void>; compact?: boolean; }

export const ComposeBox: React.FC<Props> = ({ onSubmit, compact = false }) => {
  const { user } = useAuth();
  const [body,    setBody]    = useState('');
  const [loading, setLoading] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = async () => {
    if (!body.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(body);
      setBody('');
      if (taRef.current) taRef.current.style.height = 'auto';
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
          rows={4}
          className="text-xs w-full bg-transparent text-itec-text outline-none resize-none placeholder:text-itec-muted leading-relaxed"
        />
        <div className="flex items-center justify-end mt-2 pt-2 border-t border-itec-border/50">
          <button
            onClick={handleSend}
            disabled={!body.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-itec-red hover:bg-itec-red disabled:opacity-40 text-white font-semibold rounded-full text-sm transition-all active:scale-95"
          >
            {loading
              ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><Send size={13} />Publicar</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};
