import React, { useState, useEffect } from 'react';
import { linksService, type CampusLink } from '../../services/linksService';
import { Icons } from '../../../../components/atoms/Icons';
import { Input } from '../../../../components/atoms/Input';
import { Button } from '../../../../components/atoms/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLinksUpdated: () => void;
}

export const EditLinksModal: React.FC<Props> = ({ isOpen, onClose, onLinksUpdated }) => {
  const [links, setLinks] = useState<CampusLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el formulario de nuevo/editar
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', url: '', icon: '🔗', order: 0 });

  useEffect(() => {
    if (isOpen) loadLinks();
  }, [isOpen]);

  const loadLinks = async () => {
    setIsLoading(true);
    const data = await linksService.getLinks();
    setLinks(data);
    setForm({ ...form, order: data.length }); // Por defecto el nuevo va al final
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;

    if (editingId) {
      await linksService.updateLink(editingId, form);
    } else {
      await linksService.addLink(form as any);
    }
    
    setEditingId(null);
    setForm({ title: '', url: '', icon: '🔗', order: links.length + 1 });
    await loadLinks();
    onLinksUpdated();
  };

  const handleEdit = (link: CampusLink) => {
    setEditingId(link.id!);
    setForm({ title: link.title, url: link.url, icon: link.icon, order: link.order });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar este link?")) return;
    await linksService.deleteLink(id);
    await loadLinks();
    onLinksUpdated();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-5 border-b border-itec-gray flex justify-between items-center bg-itec-bg rounded-t-2xl shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-orange-500">⚙️</span> Gestionar Links Universitarios
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><Icons type="close" className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
          
          {/* FORMULARIO */}
          <form onSubmit={handleSave} className="bg-itec-bg p-4 rounded-xl border border-itec-gray space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{editingId ? 'Editar Link' : 'Agregar Nuevo Link'}</h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-500 mb-1">Emoji</label>
                <Input fullWidth value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="bg-itec-surface text-center" />
              </div>
              <div className="col-span-10 md:col-span-5">
                <label className="block text-[10px] text-gray-500 mb-1">Título</label>
                <Input fullWidth placeholder="Ej: Mapa Sede..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-itec-surface" />
              </div>
              <div className="col-span-12 md:col-span-5">
                <label className="block text-[10px] text-gray-500 mb-1">URL / Link</label>
                <Input fullWidth placeholder="https://..." value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="bg-itec-surface" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {editingId && <Button type="button" variant="secondary" onClick={() => {setEditingId(null); setForm({title:'', url:'', icon:'🔗', order:links.length})}} className="text-xs py-1.5">Cancelar Edición</Button>}
              <Button type="submit" variant="primary" className="text-xs py-1.5 bg-itec-blue border-none">{editingId ? 'Guardar Cambios' : 'Agregar Link'}</Button>
            </div>
          </form>

          {/* LISTA ACTUAL */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Links Activos</h3>
            {isLoading ? <p className="text-gray-500 text-sm">Cargando...</p> : (
              <div className="space-y-2">
                {links.map(link => (
                  <div key={link.id} className="flex items-center justify-between bg-itec-bg border border-itec-gray p-3 rounded-lg group">
                    <div className="flex items-center gap-3 overflow-hidden pr-4">
                      <span className="text-xl">{link.icon}</span>
                      <div className="truncate">
                        <p className="text-sm font-bold text-white truncate">{link.title}</p>
                        <p className="text-[10px] text-gray-500 truncate">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => handleEdit(link)} className="p-2 bg-itec-surface hover:bg-itec-blue text-gray-400 hover:text-white rounded-md transition-colors"><Icons type="edit" className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(link.id!)} className="p-2 bg-itec-surface hover:bg-red-500 text-gray-400 hover:text-white rounded-md transition-colors"><Icons type="trash" className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};