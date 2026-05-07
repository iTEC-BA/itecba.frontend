import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Icons } from '@/components/ui/icons/Icons';
import { auth } from '@/lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  materia: string;
}

export const CourseAddResourceModal: React.FC<Props> = ({ isOpen, onClose, courseTitle, materia }) => {
  const [title, setTitle] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();

  const addResourceMutation = useMutation({
    mutationFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const payload = {
        title: title.trim(),
        materia, // Se auto-hereda del curso actual
        driveUrl: driveUrl.trim(),
        carrera: 'General', 
        nivel: 1
      };
      
      const res = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Error en el servidor al intentar vincular el archivo.');
      }
      return res.json();
    },
    onSuccess: () => {
      // Obliga a recargar los recursos para que aparezca instantáneamente
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !driveUrl.trim()) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }
    setError('');
    addResourceMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 animate-fade-in">
      <div className="bg-itec-box/95 border border-white/10 rounded-[2rem] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 relative group">
        
        {/* Resplandor decorativo */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none transition-opacity group-hover:bg-orange-500/20"></div>

        {/* Cabecera */}
        <div className="p-6 md:p-8 border-b border-white/5 relative bg-white/[0.01] z-10">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-itec-textbg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors outline-none">
            <div className="w-5 h-5"><Icons type="close" /></div>
          </button>
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center text-3xl mb-5 shadow-inner">
            📎
          </div>
          <h2 className="text-2xl font-bold text-itec-texttracking-tight leading-tight">Vincular Archivo</h2>
          <p className="text-xs text-itec-text mt-1.5 font-medium leading-relaxed">
            Se publicará en el catálogo general y en <span className="text-orange-400 font-bold">{courseTitle}</span>
          </p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 z-10">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-itec-text pl-1">Nombre del Archivo</label>
            <input 
              type="text" required placeholder="Ej: Diapositivas Clase 1" 
              value={title} onChange={e => setTitle(e.target.value)} 
              className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 px-4 text-itec-texttext-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-colors" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-itec-text pl-1">Enlace de Descarga (Drive, PDF)</label>
            <input 
              type="url" required placeholder="https://drive.google.com/..." 
              value={driveUrl} onChange={e => setDriveUrl(e.target.value)} 
              className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 px-4 text-itec-texttext-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-colors" 
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={addResourceMutation.isPending} 
              className="w-full py-4 rounded-xl font-black tracking-widest text-xs uppercase bg-white hover:bg-gray-200 text-black border-none shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[0.98] transition-all outline-none"
            >
              {addResourceMutation.isPending ? 'GUARDANDO...' : 'VINCULAR ARCHIVO'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};