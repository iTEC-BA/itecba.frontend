import React, { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { Button } from '@components/ui/Button';

interface Props {
  createMutation: UseMutationResult<string, Error, { title: string; message: string; hours: number; isCritical: boolean }, unknown>;
}

export const NewsForm: React.FC<Props> = ({ createMutation }) => {
  const [form, setForm] = useState({ title: '', message: '', hours: '24', isCritical: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createMutation.mutate(
        { title: form.title, message: form.message, hours: parseInt(form.hours) || 24, isCritical: form.isCritical },
        { onSuccess: () => setForm({ title: '', message: '', hours: '24', isCritical: false }) }
      );
    } catch (error) {
      console.error("❌ Error al procesar submit en NewsForm:", error);
    }
  };

  return (
    <div className="bg-itec-box border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none transition-opacity group-hover:bg-orange-500/10"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-itec-texttracking-tight">Redactar Aviso</h3>
            <p className="text-xs text-itec-text font-medium mt-0.5">Comunica novedades a todos los alumnos.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-itec-text pl-1">Título del Comunicado</label>
            <input 
              type="text" required placeholder="Ej: Apertura de inscripciones 2026" 
              value={form.title} onChange={e => setForm({...form, title: e.target.value})} 
              className="w-full bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-xl py-3.5 px-4 text-itec-texttext-sm focus:bg-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder-gray-500" 
            />
          </div>

          {/* Mensaje */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-itec-text pl-1">Cuerpo del Mensaje</label>
            <textarea 
              required placeholder="Detalla la información aquí..."
              value={form.message} onChange={e => setForm({...form, message: e.target.value})} 
              className="w-full bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-xl p-4 text-itec-texttext-sm focus:bg-white/10 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none min-h-[140px] resize-none transition-all placeholder-gray-500 custom-scrollbar" 
            />
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center transition-colors hover:bg-white/[0.07]">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tiempo Visible</label>
              <select 
                value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} 
                className="w-full bg-transparent text-itec-texttext-sm font-semibold outline-none cursor-pointer appearance-none p-2"
              >
                <option value="5" className="bg-itec-bg ">5 Horas</option>
                <option value="12" className="bg-itec-bg">12 Horas</option>
                <option value="24" className="bg-itec-bg">1 Día</option>
                <option value="72" className="bg-itec-bg">3 Días</option>
                <option value="168" className="bg-itec-bg">1 Semana</option>
              </select>
            </div>

            {/* Custom Switch: Alerta Crítica */}
            <div 
              onClick={() => setForm({...form, isCritical: !form.isCritical})}
              className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                form.isCritical 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <div>
                <span className={`text-sm font-bold block leading-tight ${form.isCritical ? 'text-red-400' : 'text-white'}`}>
                  Alerta Crítica
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5 block">
                  Activa Pop-up
                </span>
              </div>
              
              {/* Toggle Animado */}
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out shadow-inner ${form.isCritical ? 'bg-red-500' : 'bg-white/20'}`}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ease-in-out ${form.isCritical ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>

          </div>

          {/* Botón Submit */}
          <Button type="submit" variant="orange" hierarchy="solid" fullWidth isLoading={createMutation.isPending}>PUBLICAR EN LA PLATAFORMA</Button>
        </form>
      </div>
    </div>
  );
};