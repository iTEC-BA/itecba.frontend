import React, { useState, useEffect } from 'react';
import { Icons } from '@components/ui/icons/Icons';
import type { CampusLink } from '@features/home/services/linksService';

interface Props {
  initial?: Partial<CampusLink>;
  onSave: (data: Omit<CampusLink, 'id'>) => Promise<void>;
  onCancel: () => void;
  totalLinks: number;
}

export const LinkFormInline: React.FC<Props> = ({ initial, onSave, onCancel, totalLinks }) => {
  const [form, setForm] = useState({
    icon: initial?.icon ?? '🔗',
    title: initial?.title ?? '',
    url: initial?.url ?? '',
    order: initial?.order ?? totalLinks,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      icon: initial?.icon ?? '🔗',
      title: initial?.title ?? '',
      url: initial?.url ?? '',
      order: initial?.order ?? totalLinks,
    });
  }, [initial, totalLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.url.trim()) {
      setError('Título y URL son obligatorios.');
      return;
    }
    if (!form.url.startsWith('http') && !form.url.startsWith('/')) {
      setError('La URL debe comenzar con http/https o /');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } catch {
      setError('Error al guardar. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-itec-bg border border-white/[0.08] rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-2">
          <label className="block text-[10px] text-itec-gray font-bold uppercase tracking-wider mb-1">
            Emoji
          </label>
          <input
            value={form.icon}
            onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
            className="w-full bg-itec-box border border-white/[0.08] text-itec-text rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-itec-blue-skye transition-colors"
          />
        </div>
        <div className="col-span-10 sm:col-span-5">
          <label className="block text-[10px] text-itec-gray font-bold uppercase tracking-wider mb-1">
            Título
          </label>
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Ej: SIU Guaraní..."
            className="w-full bg-itec-box border border-white/[0.08] text-itec-text rounded-lg px-3 py-2 text-sm outline-none focus:border-itec-blue-skye transition-colors placeholder:text-itec-gray/40"
          />
        </div>
        <div className="col-span-12 sm:col-span-5">
          <label className="block text-[10px] text-itec-gray font-bold uppercase tracking-wider mb-1">
            URL
          </label>
          <input
            value={form.url}
            onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-itec-box border border-white/[0.08] text-itec-text rounded-lg px-3 py-2 text-sm outline-none focus:border-itec-blue-skye transition-colors placeholder:text-itec-gray/40"
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-itec-gray hover:text-itec-text transition-colors px-3 py-1.5"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 text-xs font-semibold bg-itec-blue-skye hover:bg-itec-blue text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving
            ? <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            : <Icons type="check" className="w-3 h-3" />
          }
          {saving ? 'Guardando...' : initial?.title ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </form>
  );
};
