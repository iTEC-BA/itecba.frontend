#!/usr/bin/env bash
# =============================================================================
#  forum_frontend.sh — MICRO-X Forum · Frontend
#  Ejecutar desde la raíz de itecba-frontend/
#
#  Crea los archivos FALTANTES de features/forum/ y parcheando los existentes:
#    src/features/forum/components/atoms/VoteButton.tsx         (nuevo)
#    src/features/forum/components/atoms/RichText.tsx           (nuevo)
#    src/features/forum/components/atoms/TrendingBanner.tsx     (nuevo — carrusel admin)
#    src/features/forum/components/molecules/ForumSkeleton.tsx  (nuevo)
#    src/features/forum/components/molecules/ComposeModal.tsx   (nuevo)
#    src/features/forum/components/molecules/BannerAdminModal.tsx (nuevo — CRUD banners)
#    src/features/forum/components/organisms/ThreadView.tsx     (nuevo)
#    src/features/forum/hooks/useBanners.ts                     (nuevo)
#    src/features/forum/services/forumService.ts                (sobreescribe — agrega banners)
#    src/features/forum/components/atoms/index.ts               (sobreescribe — agrega exports)
#    src/pages/ForumThreadPage.tsx                              (nuevo)
#    src/App.tsx                                                (parche — agrega /foro/:postId)
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[forum-frontend]${NC} $1"; }
warn() { echo -e "${YELLOW}[forum-frontend]${NC} $1"; }

BASE="src/features/forum"
mkdir -p \
  "$BASE/components/atoms" \
  "$BASE/components/molecules" \
  "$BASE/components/organisms" \
  "$BASE/hooks" \
  "$BASE/services" \
  "$BASE/types"

# ─────────────────────────────────────────────────────────────────────────────
# ATOM: VoteButton
# ─────────────────────────────────────────────────────────────────────────────
log "Creando VoteButton.tsx…"
cat > "$BASE/components/atoms/VoteButton.tsx" << 'EOF'
import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  upvotes:  number;
  userVote: number;
  onVote:   (v: 1 | -1) => void;
  disabled?: boolean;
  compact?:  boolean;
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}K` : String(n);

export const VoteButton: React.FC<Props> = ({ upvotes, userVote, onVote, disabled, compact }) => (
  <div className={`flex items-center gap-${compact ? '1' : '2'}`}>
    <button
      disabled={disabled}
      onClick={() => onVote(1)}
      className={`flex items-center gap-1 transition-colors ${
        userVote === 1 ? 'text-itec-red' : 'text-itec-muted hover:text-itec-red'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <Heart size={compact ? 13 : 15} fill={userVote === 1 ? 'currentColor' : 'none'} />
      <span className={`font-mono ${compact ? 'text-[11px]' : 'text-xs'}`}>{fmt(upvotes)}</span>
    </button>
  </div>
);
EOF

# ─────────────────────────────────────────────────────────────────────────────
# ATOM: RichText (parsea URLs y hashtags)
# ─────────────────────────────────────────────────────────────────────────────
log "Creando RichText.tsx…"
cat > "$BASE/components/atoms/RichText.tsx" << 'EOF'
import React from 'react';

interface Props {
  text:      string;
  className?: string;
}

const URL_RE  = /(https?:\/\/[^\s]+)/g;
const HASH_RE = /(#\w+)/g;

export const RichText: React.FC<Props> = ({ text, className }) => {
  const parts = text.split(/(https?:\/\/[^\s]+|#\w+)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (URL_RE.test(part)) {
          URL_RE.lastIndex = 0;
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-itec-blue-skye underline underline-offset-2 break-all hover:text-blue-400 transition-colors"
            >
              {part}
            </a>
          );
        }
        if (HASH_RE.test(part)) {
          HASH_RE.lastIndex = 0;
          return (
            <span key={i} className="text-itec-red font-medium">
              {part}
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
};
EOF

# ─────────────────────────────────────────────────────────────────────────────
# ATOM: TrendingBanner (carrusel clickeable + botón admin CRUD)
# ─────────────────────────────────────────────────────────────────────────────
log "Creando TrendingBanner.tsx…"
cat > "$BASE/components/atoms/TrendingBanner.tsx" << 'EOF'
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useBanners } from '../../hooks/useBanners';
import { BannerAdminModal } from '../molecules/BannerAdminModal';

export const TrendingBanner: React.FC = () => {
  const { isAdmin }                   = useAuth();
  const { banners, loading, refresh } = useBanners(true);   // solo activos
  const [current, setCurrent]         = useState(0);
  const [adminOpen, setAdminOpen]     = useState(false);

  // Auto-avance cada 5 s
  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  const prev = useCallback(() => setCurrent(c => (c - 1 + banners.length) % banners.length), [banners.length]);
  const next = useCallback(() => setCurrent(c => (c + 1)                  % banners.length), [banners.length]);

  if (loading) {
    return <div className="h-16 mx-4 my-2 rounded-2xl bg-white/5 animate-pulse" />;
  }

  return (
    <>
      <div className="relative mx-4 my-2">
        {banners.length > 0 ? (
          <a
            href={banners[current].redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full bg-itec-card border border-itec-border rounded-2xl px-4 py-3 hover:border-itec-red/40 transition-all group"
          >
            {/* SVG / icono */}
            {banners[current].svg_content ? (
              <div
                className="w-10 h-10 shrink-0 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: banners[current].svg_content }}
              />
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-xl bg-itec-red/10 flex items-center justify-center text-itec-red font-bold text-lg">
                📢
              </div>
            )}

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-itec-text truncate">{banners[current].title}</p>
              {banners[current].description && (
                <p className="text-xs text-itec-muted truncate">{banners[current].description}</p>
              )}
            </div>

            {/* Flechas (múltiples banners) */}
            {banners.length > 1 && (
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={e => { e.preventDefault(); prev(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-itec-muted hover:text-white transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] text-itec-muted font-mono">{current + 1}/{banners.length}</span>
                <button onClick={e => { e.preventDefault(); next(); }}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-itec-muted hover:text-white transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </a>
        ) : (
          <div className="flex items-center gap-3 w-full bg-itec-card border border-dashed border-itec-border rounded-2xl px-4 py-3 opacity-50">
            <span className="text-xs text-itec-muted">Sin banners activos</span>
          </div>
        )}

        {/* Botón admin */}
        {isAdmin && (
          <button
            onClick={() => setAdminOpen(true)}
            title="Gestionar banners"
            className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-itec-bg border border-itec-border text-itec-muted hover:text-itec-text hover:border-white/20 transition-colors z-10"
          >
            <Settings size={11} />
          </button>
        )}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-1 mb-1">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-itec-red w-3' : 'bg-itec-border'}`}
            />
          ))}
        </div>
      )}

      {/* Modal admin */}
      {isAdmin && (
        <BannerAdminModal
          isOpen={adminOpen}
          onClose={() => { setAdminOpen(false); refresh(); }}
        />
      )}
    </>
  );
};
EOF

# ─────────────────────────────────────────────────────────────────────────────
# ATOM: index.ts (actualizado con nuevos exports)
# ─────────────────────────────────────────────────────────────────────────────
log "Actualizando atoms/index.ts…"
cat > "$BASE/components/atoms/index.ts" << 'EOF'
export { AnonAvatar }         from './AnonAvatar';
export { VoteButton }         from './VoteButton';
export { ForumBadge }         from './ForumBadge';
export { ComposeBox }         from './ComposeBox';
export { TrendingBanner }     from './TrendingBanner';
export { RepostIndicator }    from './RepostIndicator';
export { PostMoreMenu }       from './PostMoreMenu';
export { RichText }           from './RichText';
EOF

# ─────────────────────────────────────────────────────────────────────────────
# MOLECULE: ForumSkeleton
# ─────────────────────────────────────────────────────────────────────────────
log "Creando ForumSkeleton.tsx…"
cat > "$BASE/components/molecules/ForumSkeleton.tsx" << 'EOF'
import React from 'react';

const SkeletonPost: React.FC = () => (
  <div className="flex gap-3 px-4 py-3 border-b border-itec-border animate-pulse">
    <div className="w-9 h-9 rounded-full bg-white/8 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <div className="h-3.5 w-28 rounded-full bg-white/8" />
        <div className="h-3.5 w-16 rounded-full bg-white/5" />
      </div>
      <div className="h-3 w-full rounded-full bg-white/8" />
      <div className="h-3 w-4/5 rounded-full bg-white/5" />
      <div className="flex gap-6 mt-1">
        <div className="h-3 w-8 rounded-full bg-white/5" />
        <div className="h-3 w-8 rounded-full bg-white/5" />
        <div className="h-3 w-8 rounded-full bg-white/5" />
      </div>
    </div>
  </div>
);

interface Props { count?: number; }
export const ForumSkeleton: React.FC<Props> = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => <SkeletonPost key={i} />)}
  </div>
);
EOF

# ─────────────────────────────────────────────────────────────────────────────
# MOLECULE: ComposeModal
# ─────────────────────────────────────────────────────────────────────────────
log "Creando ComposeModal.tsx…"
cat > "$BASE/components/molecules/ComposeModal.tsx" << 'EOF'
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
EOF

# ─────────────────────────────────────────────────────────────────────────────
# MOLECULE: BannerAdminModal (CRUD banners — solo admin)
# ─────────────────────────────────────────────────────────────────────────────
log "Creando BannerAdminModal.tsx…"
cat > "$BASE/components/molecules/BannerAdminModal.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Pencil, CheckCircle, XCircle } from 'lucide-react';
import { useBanners, type ForumBanner } from '../../hooks/useBanners';

interface Props {
  isOpen:  boolean;
  onClose: () => void;
}

const EMPTY: Partial<ForumBanner> = { title: '', description: '', redirect_url: '', svg_content: '', is_active: 1 };

export const BannerAdminModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { banners, loading, create, update, remove } = useBanners(false); // todos
  const [form, setForm]       = useState<Partial<ForumBanner>>(EMPTY);
  const [editId, setEditId]   = useState<number | null>(null);
  const [saving, setSaving]   = useState(false);
  const [errMsg, setErrMsg]   = useState<string | null>(null);
  const [view, setView]       = useState<'list' | 'form'>('list');

  useEffect(() => {
    if (!isOpen) { setForm(EMPTY); setEditId(null); setView('list'); setErrMsg(null); }
  }, [isOpen]);

  if (!isOpen) return null;

  const openNew  = () => { setForm(EMPTY); setEditId(null); setView('form'); setErrMsg(null); };
  const openEdit = (b: ForumBanner) => { setForm({ ...b }); setEditId(b.id); setView('form'); setErrMsg(null); };
  const back     = () => { setView('list'); setForm(EMPTY); setEditId(null); };

  const handleSave = async () => {
    if (!form.title?.trim() || !form.redirect_url?.trim()) {
      setErrMsg('Título y URL de redirección son obligatorios'); return;
    }
    setSaving(true); setErrMsg(null);
    try {
      if (editId !== null) {
        await update(editId, form);
      } else {
        await create(form as Omit<ForumBanner, 'id' | 'created_at' | 'updated_at'>);
      }
      back();
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este banner?')) return;
    try { await remove(id); } catch { /* silencioso */ }
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl bg-itec-bg border border-itec-border rounded-3xl shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-itec-border shrink-0">
          <div>
            <h2 className="text-lg font-bold text-itec-text">Gestión de Banners</h2>
            <p className="text-xs text-itec-muted mt-0.5">TrendingBanner institucional</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-itec-muted hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {view === 'list' ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-itec-text">{banners.length} banners</span>
                <button onClick={openNew}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-itec-red hover:bg-itec-red/80 text-white text-xs font-semibold rounded-full transition-all">
                  <Plus size={13} /> Nuevo
                </button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-12 text-itec-muted text-sm">Sin banners — creá el primero</div>
              ) : (
                <div className="space-y-2">
                  {banners.map(b => (
                    <div key={b.id}
                      className="flex items-center gap-3 p-3 bg-itec-card border border-itec-border rounded-2xl hover:border-white/20 transition-colors">
                      {/* Estado */}
                      <div className={`shrink-0 ${b.is_active ? 'text-emerald-400' : 'text-itec-muted'}`}>
                        {b.is_active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-itec-text truncate">{b.title}</p>
                        <p className="text-xs text-itec-muted truncate">{b.redirect_url}</p>
                      </div>
                      {/* Acciones */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => openEdit(b)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-itec-muted hover:text-white hover:bg-white/10 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(b.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-itec-muted hover:text-itec-red hover:bg-itec-red/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* FORMULARIO */
            <div className="space-y-4">
              <button onClick={back} className="text-xs text-itec-muted hover:text-itec-text transition-colors">
                ← Volver a la lista
              </button>
              <h3 className="text-base font-bold text-itec-text">{editId ? 'Editar banner' : 'Nuevo banner'}</h3>

              <div className="space-y-3">
                {/* Título */}
                <div>
                  <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">Título *</label>
                  <input
                    value={form.title || ''}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Ej: Inscripciones abiertas"
                    className="w-full bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-sm text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors"
                  />
                </div>
                {/* Descripción */}
                <div>
                  <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">Descripción</label>
                  <input
                    value={form.description || ''}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Subtítulo opcional"
                    className="w-full bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-sm text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors"
                  />
                </div>
                {/* URL */}
                <div>
                  <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">URL de redirección *</label>
                  <input
                    value={form.redirect_url || ''}
                    onChange={e => setForm(p => ({ ...p, redirect_url: e.target.value }))}
                    placeholder="https://..."
                    type="url"
                    className="w-full bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-sm text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors"
                  />
                </div>
                {/* SVG */}
                <div>
                  <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">SVG (icono opcional)</label>
                  <textarea
                    value={form.svg_content || ''}
                    onChange={e => setForm(p => ({ ...p, svg_content: e.target.value }))}
                    placeholder={'<svg width="40" height="40" ...></svg>'}
                    rows={3}
                    className="w-full bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-xs font-mono text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors resize-none"
                  />
                  {/* Preview SVG */}
                  {form.svg_content && (
                    <div className="mt-2 p-2 bg-itec-card border border-dashed border-itec-border rounded-xl flex items-center gap-2">
                      <div className="w-10 h-10 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: form.svg_content }} />
                      <span className="text-xs text-itec-muted">Preview del SVG</span>
                    </div>
                  )}
                </div>
                {/* Activo */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setForm(p => ({ ...p, is_active: p.is_active ? 0 : 1 }))}
                    className={`w-10 h-6 rounded-full transition-all ${form.is_active ? 'bg-emerald-500' : 'bg-white/10'} flex items-center px-0.5`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm text-itec-text">{form.is_active ? 'Activo' : 'Inactivo'}</span>
                </div>

                {errMsg && <p className="text-xs text-itec-red">{errMsg}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer (solo en form) */}
        {view === 'form' && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-itec-border shrink-0">
            <button onClick={back} className="px-4 py-2 text-sm text-itec-muted hover:text-itec-text transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-itec-red hover:bg-itec-red/80 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition-all"
            >
              {saving
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : editId ? 'Guardar cambios' : 'Crear banner'
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
EOF

# ─────────────────────────────────────────────────────────────────────────────
# ORGANISM: ThreadView
# ─────────────────────────────────────────────────────────────────────────────
log "Creando ThreadView.tsx…"
cat > "$BASE/components/organisms/ThreadView.tsx" << 'EOF'
import React, { useState } from 'react';
import { ArrowLeft }       from 'lucide-react';
import { AnonAvatar }      from '../atoms/AnonAvatar';
import { VoteButton }      from '../atoms/VoteButton';
import { RichText }        from '../atoms/RichText';
import { ReplyCard }       from '../molecules/ReplyCard';
import { ComposeBox }      from '../atoms/ComposeBox';
import type { ForumPost }  from '../../types/forum';
import { useAuth }         from '@context/AuthContext';

const timeAgo = (iso: string): string => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return `${s}s`;
  if (s < 3600)  return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

interface Props {
  post:       ForumPost;
  replies:    ForumPost[];
  loading:    boolean;
  onClose:    () => void;
  onVote:     (id: number, v: 1 | -1) => void;
  onRepost:   (id: number) => void;
  onDelete:   (id: number) => void;
  onReply:    (parentId: number, body: string) => Promise<void>;
}

export const ThreadView: React.FC<Props> = ({
  post, replies, loading, onClose, onVote, onRepost, onDelete, onReply,
}) => {
  const { isAuthenticated } = useAuth();
  const [replying, setReplying] = useState(false);

  const handleReply = async (body: string) => {
    await onReply(post.id, body);
    setReplying(false);
  };

  return (
    <div className="flex flex-col bg-itec-bg min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-itec-bg/85 backdrop-blur-md border-b border-itec-border">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-itec-muted hover:text-itec-text transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-itec-text">Hilo</h1>
      </header>

      {/* Post principal */}
      <article className="px-4 pt-4 pb-3 border-b border-itec-border">
        <div className="flex items-start gap-3">
          <AnonAvatar pseudonym={post.pseudonym} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-itec-text">{post.pseudonym.split('#')[0]}</span>
              <span className="text-xs text-itec-muted font-mono">@{(post.pseudonym.split('#')[1] || post.pseudonym).toLowerCase()}</span>
            </div>
            <p className="text-xs text-itec-muted mt-0.5">{timeAgo(post.created_at)}</p>
          </div>
        </div>

        <RichText
          text={post.body}
          className="block mt-3 text-base text-itec-text leading-relaxed whitespace-pre-wrap break-words"
        />

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-itec-border/50 text-xs text-itec-muted">
          <span><strong className="text-itec-text font-semibold">{post.reposts}</strong> reposts</span>
          <span><strong className="text-itec-text font-semibold">{post.upvotes}</strong> likes</span>
          <span><strong className="text-itec-text font-semibold">{post.reply_count}</strong> respuestas</span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4 mt-3" onClick={e => e.stopPropagation()}>
          <VoteButton
            upvotes={post.upvotes}
            userVote={post.user_vote ?? 0}
            onVote={v => onVote(post.id, v)}
            disabled={!isAuthenticated}
          />
          {isAuthenticated && (
            <button
              onClick={() => setReplying(r => !r)}
              className="text-xs text-itec-muted hover:text-itec-text transition-colors"
            >
              {replying ? 'Cancelar' : 'Responder'}
            </button>
          )}
          <button
            onClick={() => onRepost(post.id)}
            className={`text-xs transition-colors ${post.is_reposted ? 'text-itec-red' : 'text-itec-muted hover:text-itec-text'}`}
          >
            {post.is_reposted ? 'Reposteado' : 'Repostear'}
          </button>
        </div>
      </article>

      {/* Compose reply */}
      {replying && isAuthenticated && (
        <div className="border-b border-itec-border">
          <ComposeBox onSubmit={handleReply} compact />
        </div>
      )}

      {/* Replies */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-itec-border border-t-white rounded-full animate-spin" />
        </div>
      ) : replies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <span className="text-3xl opacity-20">💬</span>
          <p className="text-sm text-itec-muted">Sin respuestas todavía</p>
          {isAuthenticated && (
            <button
              onClick={() => setReplying(true)}
              className="text-xs text-itec-red hover:underline mt-1"
            >
              Sé el primero en responder
            </button>
          )}
        </div>
      ) : (
        <div>
          {replies.map((reply, i) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              isLast={i === replies.length - 1}
              onVote={onVote}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
EOF

# ─────────────────────────────────────────────────────────────────────────────
# HOOK: useBanners
# ─────────────────────────────────────────────────────────────────────────────
log "Creando hooks/useBanners.ts…"
cat > "$BASE/hooks/useBanners.ts" << 'EOF'
import { useState, useEffect, useCallback } from 'react';
import { auth } from '@lib/firebase';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/forum`;

export interface ForumBanner {
  id:           number;
  title:        string;
  description:  string;
  redirect_url: string;
  svg_content:  string;
  is_active:    number;  // 1 | 0 (SQLite)
  created_at:   string;
  updated_at:   string;
}

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Hook para leer y CRUD de banners del foro.
 * @param onlyActive true → GET /banners?active=1  (feed)
 *                   false → GET /banners           (admin panel)
 */
export const useBanners = (onlyActive: boolean) => {
  const [banners, setBanners] = useState<ForumBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const qs  = onlyActive ? '?active=1' : '';
      const res = await fetch(`${BASE}/banners${qs}`, { headers: await getAuthHeaders() });
      if (!res.ok) throw new Error('Error al cargar banners');
      const data = await res.json();
      setBanners(data.banners ?? []);
    } catch { setBanners([]); }
    finally  { setLoading(false); }
  }, [onlyActive]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const create = async (payload: Omit<ForumBanner, 'id' | 'created_at' | 'updated_at'>) => {
    const res = await fetch(`${BASE}/banners`, {
      method:  'POST',
      headers: await getAuthHeaders(),
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al crear banner');
    await fetch_();
  };

  const update = async (id: number, payload: Partial<ForumBanner>) => {
    const res = await fetch(`${BASE}/banners/${id}`, {
      method:  'PATCH',
      headers: await getAuthHeaders(),
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al actualizar banner');
    await fetch_();
  };

  const remove = async (id: number) => {
    const res = await fetch(`${BASE}/banners/${id}`, {
      method:  'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Error al eliminar banner');
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  return { banners, loading, refresh: fetch_, create, update, remove };
};
EOF

# ─────────────────────────────────────────────────────────────────────────────
# SERVICE: forumService.ts (completo — agrega banner + trending)
# ─────────────────────────────────────────────────────────────────────────────
log "Sobreescribiendo services/forumService.ts…"
cat > "$BASE/services/forumService.ts" << 'EOF'
// src/features/forum/services/forumService.ts
import { auth } from '@lib/firebase';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/forum`;

const getHeaders = async (authRequired = false) => {
  const token = await auth.currentUser?.getIdToken();
  if (authRequired && !token) throw new Error('Sesión requerida');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const forumService = {
  // ── Feed ───────────────────────────────────────────────────────────────────
  getPosts: async (page = 1, tab = 'para-ti') => {
    const res = await fetch(`${BASE}/posts?page=${page}&tab=${tab}`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Error al cargar el foro');
    return res.json();
  },

  // ── Hilo ───────────────────────────────────────────────────────────────────
  getThread: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Error al cargar el hilo');
    return res.json();
  },

  // ── Crear post ─────────────────────────────────────────────────────────────
  createPost: async (body: string) => {
    const res = await fetch(`${BASE}/posts`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al publicar');
    }
    return res.json();
  },

  // ── Responder ──────────────────────────────────────────────────────────────
  createReply: async (parentId: number, body: string) => {
    const res = await fetch(`${BASE}/posts/${parentId}/replies`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al responder');
    }
    return res.json();
  },

  // ── Votar ──────────────────────────────────────────────────────────────────
  vote: async (id: number, value: 1 | -1) => {
    const res = await fetch(`${BASE}/posts/${id}/vote`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error('Error al votar');
    return res.json();
  },

  // ── Repost ─────────────────────────────────────────────────────────────────
  repost: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}/repost`, {
      method:  'POST',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al repostear');
    return res.json();
  },

  // ── Eliminar ───────────────────────────────────────────────────────────────
  deletePost: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}`, {
      method:  'DELETE',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al eliminar');
  },

  // ── Trending ───────────────────────────────────────────────────────────────
  getTrending: async () => {
    const res = await fetch(`${BASE}/trending`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Error al cargar tendencias');
    return res.json();
  },

  // ── VAPID / Push ───────────────────────────────────────────────────────────
  getVapidKey: async (): Promise<string> => {
    const res  = await fetch(`${BASE}/push/vapid-key`);
    const data = await res.json();
    return data.key;
  },

  subscribePush: async (subscription: PushSubscription) => {
    await fetch(`${BASE}/push/subscribe`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify(subscription),
    });
  },
};
EOF

# ─────────────────────────────────────────────────────────────────────────────
# PAGE: ForumThreadPage (vista aislada de hilo — ruta /foro/:postId)
# ─────────────────────────────────────────────────────────────────────────────
log "Creando src/pages/ForumThreadPage.tsx…"
mkdir -p src/pages
cat > src/pages/ForumThreadPage.tsx << 'EOF'
import React, { useEffect, useState }    from 'react';
import { useParams, useNavigate }        from 'react-router-dom';
import { MainLayout }                    from '@components/templates/MainLayout';
import { ThreadView }                    from '@features/forum/components/organisms/ThreadView';
import { usePageTitle }                  from '@hooks/usePageTitle';
import { forumService }                  from '@features/forum/services/forumService';
import type { ForumPost }                from '@features/forum/types/forum';

export const ForumThreadPage: React.FC = () => {
  usePageTitle('Hilo · Foro Anónimo · iTEC BA');
  const { postId }                = useParams<{ postId: string }>();
  const navigate                  = useNavigate();
  const [post, setPost]           = useState<ForumPost | null>(null);
  const [replies, setReplies]     = useState<ForumPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    forumService
      .getThread(Number(postId))
      .then(data => { setPost(data.post); setReplies(data.replies); })
      .catch(e => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleVote = async (id: number, value: 1 | -1) => {
    const { upvotes } = await forumService.vote(id, value);
    const upd = (p: ForumPost): ForumPost => p.id === id
      ? { ...p, upvotes, user_vote: p.user_vote === value ? 0 : value }
      : p;
    if (post) setPost(upd(post));
    setReplies(prev => prev.map(upd));
  };

  const handleRepost = async (id: number) => {
    const { reposts, is_reposted } = await forumService.repost(id);
    const upd = (p: ForumPost): ForumPost => p.id === id ? { ...p, reposts, is_reposted } : p;
    if (post) setPost(upd(post));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    await forumService.deletePost(id);
    if (post?.id === id) navigate('/foro', { replace: true });
    else setReplies(prev => prev.filter(r => r.id !== id));
  };

  const handleReply = async (_parentId: number, body: string) => {
    const reply = await forumService.createReply(Number(postId), body);
    setReplies(prev => [...prev, reply]);
    if (post) setPost(p => p ? { ...p, reply_count: (p.reply_count || 0) + 1 } : p);
  };

  if (error) return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-itec-muted text-sm">{error}</p>
        <button onClick={() => navigate('/foro')} className="text-itec-red text-sm mt-4 hover:underline">
          Volver al foro
        </button>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full">
        <div className="rounded-2xl border border-itec-border overflow-hidden bg-itec-bg">
          {post ? (
            <ThreadView
              post={post}
              replies={replies}
              loading={loading}
              onClose={() => navigate('/foro')}
              onVote={handleVote}
              onRepost={handleRepost}
              onDelete={handleDelete}
              onReply={handleReply}
            />
          ) : (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-itec-border border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ForumThreadPage;
EOF

# ─────────────────────────────────────────────────────────────────────────────
# PATCH App.tsx — agregar ruta /foro/:postId y import de ForumThreadPage
# ─────────────────────────────────────────────────────────────────────────────
log "Parcheando src/App.tsx…"
APP="src/App.tsx"

# Agregar import de ForumThreadPage solo si no existe
if ! grep -q "ForumThreadPage" "$APP"; then
  # Insertar después del import de ForumPage
  sed -i "/const ForumPage = lazy/a const ForumThreadPage = lazy(() => import('@pages\/ForumThreadPage').then(m => ({ default: m.ForumThreadPage })));" "$APP"
  echo "  → Import de ForumThreadPage agregado"
else
  warn "   Import ForumThreadPage ya existe, se omite"
fi

# Agregar ruta /foro/:postId solo si no existe
if ! grep -q '"/foro/:postId"' "$APP"; then
  # Insertar después de la línea que tiene /foro
  sed -i '/path="\/foro"/a \          <Route path="\/foro\/:postId" element={<PageSuspense><ForumThreadPage \/><\/PageSuspense>} \/>' "$APP"
  echo "  → Ruta /foro/:postId agregada en App.tsx"
else
  warn "   Ruta /foro/:postId ya existe, se omite"
fi

# ─────────────────────────────────────────────────────────────────────────────
log "✅ Frontend del foro listo."
echo ""
echo "  Archivos creados/actualizados:"
echo "  • src/features/forum/components/atoms/VoteButton.tsx"
echo "  • src/features/forum/components/atoms/RichText.tsx"
echo "  • src/features/forum/components/atoms/TrendingBanner.tsx  (carrusel + admin)"
echo "  • src/features/forum/components/atoms/index.ts             (actualizado)"
echo "  • src/features/forum/components/molecules/ForumSkeleton.tsx"
echo "  • src/features/forum/components/molecules/ComposeModal.tsx"
echo "  • src/features/forum/components/molecules/BannerAdminModal.tsx (CRUD)"
echo "  • src/features/forum/components/organisms/ThreadView.tsx"
echo "  • src/features/forum/hooks/useBanners.ts"
echo "  • src/features/forum/services/forumService.ts  (+ repost, trending, push)"
echo "  • src/pages/ForumThreadPage.tsx"
echo "  • src/App.tsx  (ruta /foro/:postId + import ForumThreadPage)"