import React, { useState, useEffect, useMemo } from 'react';
import { materiasService, type MateriaRow } from '@features/groups/services/materiasService';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '@features/groups/types/groups';
import { Icons } from '@components/ui/icons/Icons';
import { Select } from '@components/ui/Select';
import { Input } from '@components/ui/Input';

export const AdminMaterias: React.FC = () => {
  const [materias, setMaterias] = useState<MateriaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Estado del Formulario
  const [form, setForm] = useState({ id: '', carrera: 'sistemas', nivel: '1', materia: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterias = async () => {
    try {
      const data = await materiasService.getMaterias();
      setMaterias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterias(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.materia.trim()) return;
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await materiasService.updateMateria(form.id, { carrera: form.carrera, nivel: form.nivel, materia: form.materia });
      } else {
        await materiasService.createMateria({ carrera: form.carrera, nivel: form.nivel, materia: form.materia });
      }
      setForm({ id: '', carrera: 'sistemas', nivel: '1', materia: '' });
      setIsEditing(false);
      await fetchMaterias();
    } catch (err) {
      alert("Hubo un error al guardar. Revisa tus permisos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (m: MateriaRow) => {
    setForm({ id: m.id, carrera: m.carrera, nivel: m.nivel, materia: m.materia });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta materia? Esto podría afectar la búsqueda de grupos asociados.")) return;
    try {
      await materiasService.deleteMateria(id);
      await fetchMaterias();
    } catch (err) {
      alert("Error al eliminar la materia.");
    }
  };

  const filteredMaterias = useMemo(() => {
    return materias.filter(m => 
      m.materia.toLowerCase().includes(search.toLowerCase()) || 
      m.carrera.toLowerCase().includes(search.toLowerCase())
    );
  }, [materias, search]);

  const getCarreraLabel = (val: string) => CARRERAS_OPTIONS.find(c => c.value === val)?.label || val;
  const getNivelLabel = (val: string) => NIVEL_OPTIONS.find(n => n.value === val)?.label || val;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
      {/* Formulario Lateral */}
      <div className="xl:col-span-1 bg-itec-box border border-itec-border rounded-2xl p-6 h-fit sticky top-6">
        <h3 className="text-sm font-bold text-itec-text mb-4 uppercase tracking-widest text-itec-gray">
          {isEditing ? '✏️ Editar Materia' : '➕ Nueva Materia'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">Carrera / Especialidad</label>
            <Select fullWidth options={CARRERAS_OPTIONS} value={form.carrera} onChange={e => setForm({ ...form, carrera: e.target.value })} className="text-sm py-2.5 bg-itec-bg" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">Nivel / Año</label>
            <Select fullWidth options={NIVEL_OPTIONS} value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })} className="text-sm py-2.5 bg-itec-bg" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-wider mb-1.5">Nombre de la Materia</label>
            <Input fullWidth placeholder="Ej: Redes de Datos..." value={form.materia} onChange={e => setForm({ ...form, materia: e.target.value })} className="text-sm py-2.5 bg-itec-bg" />
          </div>
          <div className="pt-2 flex gap-2">
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setForm({ id: '', carrera: 'sistemas', nivel: '1', materia: '' }); }} className="w-1/3 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white transition-colors">
                Cancelar
              </button>
            )}
            <button type="submit" disabled={isSubmitting || !form.materia.trim()} className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-colors ${isEditing ? 'bg-itec-blue-skye hover:bg-itec-blue' : 'bg-itec-groups hover:bg-emerald-500'} disabled:opacity-50`}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Agregar Materia'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla Central */}
      <div className="xl:col-span-2 bg-itec-box border border-itec-border rounded-2xl flex flex-col h-[75vh]">
        <div className="p-5 border-b border-itec-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-itec-text">Base de Datos de Materias</h2>
            <p className="text-xs text-itec-gray">Total registradas: {materias.length}</p>
          </div>
          <div className="w-full sm:w-64">
            <Input fullWidth placeholder="Buscar por materia o carrera..." value={search} onChange={e => setSearch(e.target.value)} className="text-sm py-2 bg-itec-bg" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {loading ? (
            <div className="flex justify-center py-10"><span className="w-6 h-6 border-2 border-white/20 border-t-itec-blue-skye rounded-full animate-spin"></span></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-itec-gray uppercase tracking-widest border-b border-white/5">
                  <th className="pb-3 font-bold px-2">Materia</th>
                  <th className="pb-3 font-bold px-2">Carrera</th>
                  <th className="pb-3 font-bold px-2">Nivel</th>
                  <th className="pb-3 font-bold px-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {filteredMaterias.map(m => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-2 font-medium text-white">{m.materia}</td>
                    <td className="py-3 px-2 text-itec-gray">{getCarreraLabel(m.carrera)}</td>
                    <td className="py-3 px-2 text-itec-gray">{getNivelLabel(m.nivel)}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(m)} className="p-1.5 text-itec-blue-skye hover:bg-itec-blue-skye/10 rounded-lg"><Icons type="edit" className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-1.5 text-itec-red hover:bg-itec-red/10 rounded-lg"><Icons type="trash" className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMaterias.length === 0 && (
                  <tr><td colSpan={4} className="py-10 text-center text-itec-gray text-sm">No se encontraron materias.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
