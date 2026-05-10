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
