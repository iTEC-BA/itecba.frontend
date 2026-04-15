import React, { useState } from 'react';
import { Icons } from '@/components/atoms/Icons';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import type { ImportantDate } from '../organisms/ImportantDatesWidget';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newDate: ImportantDate) => void;
}

export const AddDateModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    // TODO: Reemplazar con llamado a API (ej: datesService.createDate(...))
    const newDate: ImportantDate = {
      id: Date.now().toString(),
      title,
      date,
      description
    };
    
    onAdd(newDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-2xl w-full max-w-md shadow-2xl relative p-6 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <Icons type="close" className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-1">Agregar Fecha</h2>
        <p className="text-xs text-gray-400 mb-5">Será visible para todos los estudiantes.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Título del Evento</label>
            <Input fullWidth placeholder="Ej: Exámenes Finales" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Día / Rango</label>
            <Input fullWidth placeholder="Ej: 10 al 15 de Diciembre" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Descripción breve</label>
            <Input fullWidth placeholder="Anotarse por SIGA..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          
          <div className="pt-4 border-t border-itec-gray flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" className="bg-orange-600 hover:bg-orange-500 border-none">Guardar Fecha</Button>
          </div>
        </form>
      </div>
    </div>
  );
};