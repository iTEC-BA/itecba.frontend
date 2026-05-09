import React, { useRef, useEffect, useState } from 'react';
import { MoreHorizontal, Trash2, Share2, Flag } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { Button } from '@/components/ui/Button';

interface Props {
  postId:   number;
  onDelete: (id: number) => void;
  onShare:  (id: number) => void;
}

export const PostMoreMenu: React.FC<Props> = ({ postId, onDelete, onShare }) => {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="w-8 h-8 flex items-center justify-center rounded-full text-itec-muted hover:text-itec-text hover:bg-white/6 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-50 w-44 bg-itec-bg border border-itec-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <Button
            onClick={e => { e.stopPropagation(); onShare(postId); setOpen(false); }}
            variant="secondary"
            hierarchy="ghost"
            fullWidth
            className="justify-start rounded-none px-4 py-3 text-sm"
          >
            <Share2 size={14} className="text-itec-muted" />
            Copiar enlace
          </Button>
          <Button
            onClick={e => { e.stopPropagation(); setOpen(false); }}
            variant="secondary"
            hierarchy="ghost"
            fullWidth
            className="justify-start rounded-none px-4 py-3 text-sm"
          >
            <Flag size={14} className="text-itec-muted" />
            Reportar
          </Button>
          {(user || isAdmin) && (
            <Button
              onClick={e => { e.stopPropagation(); onDelete(postId); setOpen(false); }}
              variant="danger"
              hierarchy="solid"
              fullWidth
              className="justify-start rounded-none border-t border-itec-border"
            >
              <Trash2 size={14} />
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
