import React, { useRef, useEffect, useState } from 'react';
import { MoreHorizontal, Trash2, Share2, Flag } from 'lucide-react';
import { useAuth } from '@context/AuthContext';

interface Props {
  postId:   number;
  isAuthor: boolean;
  onDelete: (id: number) => void;
  onShare:  (id: number) => void;
}

export const PostMoreMenu: React.FC<Props> = ({ postId, isAuthor, onDelete, onShare }) => {
  const { isAdmin }           = useAuth();
  const [open, setOpen]       = useState(false);
  const menuRef               = useRef<HTMLDivElement>(null);

  const canDelete = isAuthor || isAdmin;

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div ref={menuRef} className="relative" onClick={stop}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 flex items-center justify-center rounded-full text-itec-muted hover:text-itec-text hover:bg-white/8 transition-colors"
        aria-label="Más opciones"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 bg-itec-card border border-itec-border rounded-2xl shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => { onShare(postId); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-itec-text hover:bg-white/5 transition-colors"
          >
            <Share2 size={13} className="text-itec-blue-skye" />
            Copiar enlace
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-itec-muted hover:bg-white/5 transition-colors"
          >
            <Flag size={13} />
            Reportar
          </button>
          {canDelete && (
            <>
              <div className="h-px bg-itec-border mx-2 my-1" />
              <button
                onClick={() => { onDelete(postId); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-itec-red hover:bg-itec-red/10 transition-colors"
              >
                <Trash2 size={13} />
                Eliminar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
