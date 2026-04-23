import React, { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';

interface Props {
  createMutation: UseMutationResult<string, Error, { title: string; message: string; hours: number }, unknown>;
}

export const NewsForm: React.FC<Props> = ({ createMutation }) => {
  const [form, setForm] = useState({ title: '', message: '', hours: '24' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title: form.title, message: form.message, hours: parseInt(form.hours) },
      { onSuccess: () => setForm({ title: '', message: '', hours: '24' }) }
    );
  };

  return (
    <div className="bg-itec-surface/40 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <span className="text-orange-500">📢</span> Redactar Aviso
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input 
            type="text" required placeholder="Título (Ej: Inscripciones)" 
            value={form.title} onChange={e => setForm({...form, title: e.target.value})} 
            className="w-full bg-black/30 border border-white/10 rounded-2xl py-3 px-4 text-white text-sm focus:border-orange-500/50 outline-none transition-colors" 
          />
        </div>
        <div>
          <textarea 
            required placeholder="Cuerpo del comunicado..."
            value={form.message} onChange={e => setForm({...form, message: e.target.value})} 
            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-orange-500/50 outline-none min-h-[120px] resize-none transition-colors" 
          />
        </div>
        <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-2xl px-4 py-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duración</span>
          <select 
            value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} 
            className="flex-1 bg-transparent text-white text-sm outline-none cursor-pointer text-right appearance-none"
          >
            <option value="12" className="bg-itec-bg">12 Horas</option>
            <option value="24" className="bg-itec-bg">1 Día</option>
            <option value="72" className="bg-itec-bg">3 Días</option>
            <option value="168" className="bg-itec-bg">1 Semana</option>
          </select>
        </div>
        <Button 
          type="submit" disabled={createMutation.isPending} 
          className="w-full py-3.5 rounded-2xl font-bold bg-orange-600 hover:bg-orange-500 text-white border-none mt-2 shadow-lg shadow-orange-500/20"
        >
          {createMutation.isPending ? 'PUBLICANDO...' : 'PUBLICAR EN LA WEB'}
        </Button>
      </form>
    </div>
  );
};