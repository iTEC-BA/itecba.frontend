import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '@components/ui/icons/Icons';
import { materiasService, type MateriaRow } from '../../services/materiasService';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '../../types/groups';

interface Props { isOpen: boolean; onClose: () => void; }

const EMPTY_FORM = { carrera: '', nivel: '', materia: '', codigo: '' };

export const AdminMateriasModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [materias, setMaterias]       = useState<MateriaRow[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');
  const [searchQ, setSearchQ]         = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterNivel, setFilterNivel]     = useState('');

  // Form
  const [editing, setEditing]   = useState<MateriaRow | null>(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState('');

  const fetchMaterias = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await materiasService.getMaterias(
        filterCarrera || undefined,
        filterNivel   || undefined,
      );
      setMaterias(data);
    } catch {
      setError('Error al cargar materias.');
    } finally {
      setIsLoading(false);
    }
  }, [filterCarrera, filterNivel]);

  useEffect(() => { if (isOpen) fetchMaterias(); }, [isOpen, fetchMaterias]);

  if (!isOpen) return null;

  const displayed = searchQ.trim()
    ? materias.filter(m => {
        const q = searchQ.trim().toLowerCase();
        return (
          m.materia.toLowerCase().includes(q) ||
          (m.codigo || '').toLowerCase().includes(q)
        );
      })
    : materias;

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(''); };
  const openEdit   = (m: MateriaRow) => {
    setEditing(m);
    setForm({ carrera: m.carrera, nivel: m.nivel, materia: m.materia, codigo: m.codigo || '' });
    setFormError('');
  };
  const closeForm  = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(''); };

  const handleSave = async () => {
    if (!form.carrera || !form.nivel || !form.materia.trim()) {
      setFormError('Carrera, nivel y nombre de materia son obligatorios.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        carrera: form.carrera,
        nivel:   form.nivel,
        materia: form.materia.trim(),
        codigo:  form.codigo.trim() || undefined,
      };
      if (editing) {
        await materiasService.updateMateria(editing.id, payload);
      } else {
        await materiasService.createMateria(payload);
      }
      closeForm();
      fetchMaterias();
    } catch (e: any) {
      setFormError(e.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: MateriaRow) => {
    if (!window.confirm(`¿Eliminar "${m.materia}"? Esta acción no se puede deshacer.`)) return;
    try {
      await materiasService.deleteMateria(m.id);
      fetchMaterias();
    } catch {
      alert('Error al eliminar la materia.');
    }
  };

  const showForm = editing !== null || form.carrera !== '' || form.nivel !== '' || form.materia !== '';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-itec-box border border-white/[0.08] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-5xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-full sm:fade-in sm:zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div>
            <h2 className="text-base font-bold text-itec-text">Gestión de Materias</h2>
            <p className="text-[11px] text-itec-gray mt-0.5">Crear, editar o eliminar materias del catálogo.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-itec-gray hover:text-itec-text transition-colors">
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="px-5 py-3 border-b border-white/[0.06] shrink-0 flex flex-wrap gap-2 items-center">
          <input
            className="flex-1 min-w-[160px] bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none focus:border-itec-groups/50 placeholder:text-itec-gray"
            placeholder="Buscar por nombre o código..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
          <select
            className="bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none"
            value={filterCarrera}
            onChange={e => { setFilterCarrera(e.target.value); setFilterNivel(''); }}
          >
            <option value="">Todas las carreras</option>
            {CARRERAS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            className="bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none"
            value={filterNivel}
            onChange={e => setFilterNivel(e.target.value)}
          >
            <option value="">Todos los niveles</option>
            {NIVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-itec-groups hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap"
          >
            <Icons type="plus" className="w-3.5 h-3.5" /> Nueva materia
          </button>
        </div>

        {/* Formulario inline de create/edit */}
        {showForm && (
          <div className="px-5 py-4 border-b border-itec-groups/20 bg-itec-groups/5 shrink-0">
            <p className="text-xs font-bold text-emerald-400 mb-3">
              {editing ? `Editando: ${editing.materia}` : 'Nueva materia'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-itec-gray font-semibold uppercase tracking-wider">Carrera *</label>
                <select
                  className="bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none focus:border-itec-groups/50"
                  value={form.carrera}
                  onChange={e => setForm(f => ({ ...f, carrera: e.target.value }))}
                >
                  <option value="">Elegir...</option>
                  {CARRERAS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-itec-gray font-semibold uppercase tracking-wider">Nivel *</label>
                <select
                  className="bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none focus:border-itec-groups/50"
                  value={form.nivel}
                  onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))}
                >
                  <option value="">Elegir...</option>
                  {NIVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-1">
                <label className="text-[10px] text-itec-gray font-semibold uppercase tracking-wider">Nombre *</label>
                <input
                  className="bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none focus:border-itec-groups/50"
                  placeholder="Ej: Análisis Matemático I"
                  value={form.materia}
                  onChange={e => setForm(f => ({ ...f, materia: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-itec-gray font-semibold uppercase tracking-wider">Código</label>
                <input
                  className="bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none focus:border-itec-groups/50 font-mono"
                  placeholder="Ej: 950605"
                  value={form.codigo}
                  onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))}
                />
              </div>
            </div>
            {formError && <p className="text-itec-red text-[11px] mb-2">{formError}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={closeForm} className="px-4 py-1.5 text-xs font-semibold text-itec-gray hover:text-itec-text bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 text-xs font-bold bg-itec-groups hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear materia')}
              </button>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-6 h-6 border-2 border-itec-border border-t-itec-groups rounded-full animate-spin" />
              <p className="text-itec-gray text-sm">Cargando materias...</p>
            </div>
          ) : error ? (
            <p className="text-itec-red text-sm text-center py-10">{error}</p>
          ) : displayed.length === 0 ? (
            <p className="text-itec-gray text-sm text-center py-10">
              {searchQ ? 'Sin resultados para esa búsqueda.' : 'No hay materias cargadas.'}
            </p>
          ) : (
            <div className="space-y-1.5">
              {displayed.map(m => (
                <div
                  key={m.id}
                  className="bg-itec-bg border border-white/[0.07] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/12 transition-colors group"
                >
                  {m.codigo && (
                    <span className="font-mono text-[11px] font-bold text-emerald-400 bg-itec-groups/10 px-2 py-0.5 rounded border border-itec-groups/20 shrink-0">
                      {m.codigo}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-itec-text truncate">{m.materia}</p>
                    <p className="text-[11px] text-itec-gray">
                      {CARRERAS_OPTIONS.find(o => o.value === m.carrera)?.label ?? m.carrera}
                      {' · '}
                      {NIVEL_OPTIONS.find(o => o.value === m.nivel)?.label ?? `Nivel ${m.nivel}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => openEdit(m)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-itec-blue-skye/15 text-itec-gray hover:text-itec-blue-skye transition-colors"
                      title="Editar"
                    >
                      <Icons type="edit" className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-itec-red/15 text-itec-gray hover:text-itec-red transition-colors"
                      title="Eliminar"
                    >
                      <Icons type="trash" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.06] shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-itec-gray">{displayed.length} materia(s) mostradas</p>
          <button onClick={onClose} className="text-xs font-semibold bg-itec-blue-skye hover:bg-itec-blue text-white px-5 py-2 rounded-xl transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
