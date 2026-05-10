import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { LayoutModal }    from '@components/templates/LayoutModal';
import { Button }         from '@/components/ui/Button';
import { useAuth }        from '@context/AuthContext';
import { forumService }   from '../../services/forumService';
import type { ForumBanner } from '../../types/forum';

// ── Carousel ────────────────────────────────────────────────────────────────
const Carousel: React.FC<{ banners: ForumBanner[] }> = ({ banners }) => {
  const [idx,   setIdx]   = useState(0);
  const timerRef          = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setIdx(i => (i + 1) % banners.length), [banners.length]);
  const prev = () => setIdx(i => (i - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, banners.length]);

  if (!banners.length) return null;
  const b = banners[idx];
  const color = b.banner_color || '#b71234';

  return (
    <a
      href={b.redirect_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 relative overflow-hidden no-underline group"
      style={{ background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
               borderBottom: `1px solid ${color}30` }}
    >
      {/* SVG icon */}
      {b.svg_content ? (
        <div className="w-10 h-10 shrink-0 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: b.svg_content }} />
      ) : (
        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}25`, border: `1px solid ${color}40` }}>
          📢
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-itec-text truncate">{b.title}</p>
        {b.description && (
          <p className="text-[11px] text-itec-muted truncate">{b.description}</p>
        )}
      </div>

      {/* Nav arrows (solo si hay más de 1) */}
      {banners.length > 1 && (
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.preventDefault()}>
          <button
            onClick={e => { e.preventDefault(); prev(); }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-itec-muted hover:text-white transition-colors"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="text-[10px] font-mono text-itec-muted">{idx + 1}/{banners.length}</span>
          <button
            onClick={e => { e.preventDefault(); next(); }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-itec-muted hover:text-white transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {banners.map((_, i) => (
            <span key={i} className={`w-1 h-1 rounded-full transition-all ${i === idx ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
      )}
    </a>
  );
};

// ── Admin Modal Content ──────────────────────────────────────────────────────
const EMPTY_FORM: Partial<ForumBanner> = {
  title: '', description: '', redirect_url: '',
  svg_content: '', banner_color: '#b71234', is_active: 1,
};

const AdminBannerPanel: React.FC<{
  onBannersChange: (bs: ForumBanner[]) => void;
}> = ({ onBannersChange }) => {
  const [banners, setBanners] = useState<ForumBanner[]>([]);
  const [view,    setView]    = useState<'list' | 'form'>('list');
  const [form,    setForm]    = useState<Partial<ForumBanner>>(EMPTY_FORM);
  const [editId,  setEditId]  = useState<number | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setBanners(await forumService.getBanners(false)); } catch (e) { /* noop */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setForm(EMPTY_FORM); setEditId(null); setView('form'); setErr(null); };
  const openEdit = (b: ForumBanner) => { setForm({ ...b }); setEditId(b.id); setView('form'); setErr(null); };
  const back     = () => setView('list');

  const handleSave = async () => {
    if (!form.title?.trim())        { setErr('El título es requerido'); return; }
    if (!form.redirect_url?.trim()) { setErr('La URL es requerida'); return; }
    setSaving(true);
    setErr(null);
    try {
      if (editId !== null) {
        await forumService.updateBanner(editId, form);
      } else {
        await forumService.createBanner(form);
      }
      await load();
      onBannersChange(await forumService.getBanners(true));
      setView('list');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (b: ForumBanner) => {
    try {
      await forumService.updateBanner(b.id, { is_active: b.is_active ? 0 : 1 });
      await load();
      onBannersChange(await forumService.getBanners(true));
    } catch (e) { /* noop */ }
  };

  const handleDelete = async (id: number) => {
    try {
      await forumService.deleteBanner(id);
      await load();
      onBannersChange(await forumService.getBanners(true));
    } catch (e) { /* noop */ }
  };

  if (view === 'form') {
    return (
      <div className="p-5 space-y-4">
        <button onClick={back} className="text-xs text-itec-muted hover:text-itec-text flex items-center gap-1 mb-2">
          ← Volver
        </button>
        <div>
          <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">Título *</label>
          <input
            value={form.title || ''}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Título del banner"
            className="w-full bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-sm text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">Descripción</label>
          <input
            value={form.description || ''}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Subtítulo opcional"
            className="w-full bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-sm text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors"
          />
        </div>
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
        <div>
          <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">Color del banner</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.banner_color || '#b71234'}
              onChange={e => setForm(p => ({ ...p, banner_color: e.target.value }))}
              className="w-10 h-10 rounded-lg cursor-pointer border border-itec-border bg-transparent"
            />
            <input
              value={form.banner_color || '#b71234'}
              onChange={e => setForm(p => ({ ...p, banner_color: e.target.value }))}
              placeholder="#b71234"
              className="flex-1 bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-sm text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors font-mono"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest block mb-1.5">SVG (icono opcional)</label>
          <textarea
            value={form.svg_content || ''}
            onChange={e => setForm(p => ({ ...p, svg_content: e.target.value }))}
            placeholder={'<svg width="40" height="40" ...></svg>'}
            rows={3}
            className="w-full bg-itec-card border border-itec-border rounded-xl px-3 py-2.5 text-xs font-mono text-itec-text placeholder:text-itec-muted outline-none focus:border-itec-red/50 transition-colors resize-none"
          />
          {form.svg_content && (
            <div className="mt-2 p-2 bg-itec-card border border-dashed border-itec-border rounded-xl flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: form.svg_content }} />
              <span className="text-xs text-itec-muted">Preview</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setForm(p => ({ ...p, is_active: p.is_active ? 0 : 1 }))}
            className={`w-10 h-6 rounded-full transition-all ${form.is_active ? 'bg-emerald-500' : 'bg-white/10'} flex items-center px-0.5`}
          >
            <span className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm text-itec-text">{form.is_active ? 'Activo' : 'Inactivo'}</span>
        </div>
        {err && <p className="text-xs text-itec-red">{err}</p>}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-itec-border">
          <button onClick={back} className="px-4 py-2 text-sm text-itec-muted hover:text-itec-text transition-colors">
            Cancelar
          </button>
          <Button variant="danger" hierarchy="solid" onClick={handleSave} isLoading={saving} disabled={saving}>
            {editId ? 'Guardar cambios' : 'Crear banner'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-itec-muted uppercase tracking-widest">
          {banners.length} banner{banners.length !== 1 ? 's' : ''}
        </span>
        <Button variant="primary" hierarchy="solid" onClick={openNew}>
          <Plus size={14} className="mr-1" />
          Nuevo banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="py-10 text-center text-itec-muted text-sm">Sin banners creados</div>
      ) : (
        <div className="space-y-2">
          {banners.map(b => (
            <div
              key={b.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-itec-border bg-itec-card"
            >
              {/* Color dot */}
              <span className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: b.banner_color || '#b71234' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-itec-text truncate">{b.title}</p>
                {b.description && (
                  <p className="text-xs text-itec-muted truncate">{b.description}</p>
                )}
              </div>
              {/* Toggle activo */}
              <button
                onClick={() => handleToggle(b)}
                title={b.is_active ? 'Desactivar' : 'Activar'}
                className={`p-1.5 rounded-lg transition-colors ${b.is_active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-itec-muted hover:bg-white/5'}`}
              >
                <Check size={14} />
              </button>
              {/* Editar */}
              <button
                onClick={() => openEdit(b)}
                className="p-1.5 rounded-lg text-itec-muted hover:text-itec-blue-skye hover:bg-itec-blue-skye/10 transition-colors"
              >
                <Pencil size={14} />
              </button>
              {/* Eliminar */}
              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 rounded-lg text-itec-muted hover:text-itec-red hover:bg-itec-red/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Export principal ─────────────────────────────────────────────────────────
export const TrendingBanner: React.FC = () => {
  const { isAdmin }               = useAuth();
  const [banners, setBanners]     = useState<ForumBanner[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    forumService.getBanners(true).then(setBanners).catch(() => {});
  }, []);

  if (!isAdmin && !banners.length) return null;

  return (
    <div className="relative">
      {banners.length > 0 && <Carousel banners={banners} />}

      {/* Botón admin */}
      {isAdmin && (
        <div className="flex justify-end px-4 py-1.5 border-b border-itec-border bg-itec-bg">
          <Button
            variant="secondary"
            hierarchy="ghost"
            onClick={() => setAdminOpen(true)}
          >
            <Pencil size={12} className="mr-1" />
            Gestionar banners
          </Button>
        </div>
      )}

      <LayoutModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        title="Banners institucionales"
        description="Administrá los anuncios que se muestran sobre el feed"
        maxWidth="max-w-xl"
      >
        <AdminBannerPanel onBannersChange={setBanners} />
      </LayoutModal>
    </div>
  );
};
