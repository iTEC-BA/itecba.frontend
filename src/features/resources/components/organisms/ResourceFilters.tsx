import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '../../../../components/atoms/Input';
import { Select } from '../../../../components/atoms/Select';
import { Button } from '../../../../components/atoms/Button';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS, MATERIAS_POR_CARRERA } from '../../../../features/groups/types/groups'; 

interface Props {
  searchQuery: string; setSearchQuery: (v: string) => void;
  carrera: string; setCarrera: (v: string) => void;
  nivel: string; setNivel: (v: string) => void;
  materia: string; setMateria: (v: string) => void;
  onClear: () => void;
}

export const ResourceFilters: React.FC<Props> = ({
  searchQuery, setSearchQuery, carrera, setCarrera,
  nivel, setNivel, materia, setMateria, onClear
}) => {
  const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);
  const searchMateriaRef = useRef<HTMLDivElement>(null);

  // Obtener todas las materias si no hay carrera seleccionada
  const todasLasMaterias = useMemo(() => {
    const materias = new Set<string>();
    Object.values(MATERIAS_POR_CARRERA).forEach(niveles => {
      Object.values(niveles).forEach(mats => {
        mats.forEach(m => materias.add(m));
      });
    });
    return Array.from(materias);
  }, []);

  const materiasSearchDisponibles = (carrera && nivel && MATERIAS_POR_CARRERA[carrera] && MATERIAS_POR_CARRERA[carrera][nivel])
    ? MATERIAS_POR_CARRERA[carrera][nivel] : todasLasMaterias;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { 
      if (searchMateriaRef.current && !searchMateriaRef.current.contains(e.target as Node)) {
        setShowMateriaDropdown(false); 
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 shadow-xl mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Buscar por Título</label>
          <Input fullWidth placeholder="Ej: Resumen Primer Parcial..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="text-sm py-2 bg-itec-bg border-itec-gray" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Carrera</label>
          <Select fullWidth options={CARRERAS_OPTIONS} value={carrera} onChange={e => { setCarrera(e.target.value); setNivel(e.target.value === 'ingreso' ? '0' : ''); }} className="text-sm py-2 bg-itec-bg border-itec-gray" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nivel</label>
          <Select fullWidth disabled={!carrera} options={NIVEL_OPTIONS} value={nivel} onChange={e => { setNivel(e.target.value); }} className="text-sm py-2 bg-itec-bg border-itec-gray disabled:opacity-50" />
        </div>
        <div ref={searchMateriaRef} className="relative">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Materia (Libre)</label>
          <Input 
            fullWidth 
            placeholder="Ej: Análisis Matemático..." 
            value={materia} 
            onChange={e => { setMateria(e.target.value); setShowMateriaDropdown(true); }} 
            onFocus={() => setShowMateriaDropdown(true)} 
            className="text-sm py-2 bg-itec-bg border-itec-gray focus:border-orange-500" 
          />
          {showMateriaDropdown && materiasSearchDisponibles.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-itec-sidebar border border-itec-gray rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
              {materiasSearchDisponibles.filter(m => m.toLowerCase().includes(materia.toLowerCase())).map(m => (
                <li key={m} onClick={() => { setMateria(m); setShowMateriaDropdown(false); }} className="px-3 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white cursor-pointer border-b border-itec-gray/50">{m}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {(searchQuery || carrera || nivel || materia) && (
         <div className="flex justify-end mt-4 pt-4 border-t border-itec-gray">
           <Button variant="secondary" onClick={onClear} className="text-xs py-1.5 bg-itec-red/10 text-itec-red-skye border-itec-red/30 hover:bg-itec-red hover:text-white transition-colors">
             Limpiar Filtros
           </Button>
         </div>
      )}
    </div>
  );
};