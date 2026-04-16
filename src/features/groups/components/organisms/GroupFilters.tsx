import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Icons } from '@/components/ui/Icons';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '../../types/groups';
import { CustomSelect } from '@/components/molecules/CustomSelect';
import { AutocompleteInput } from '@/components/molecules/AutocompleteInput';

interface Props {
  // 🟢 Tipado Estricto de la interfaz (Soluciona el error)
  filters: {
    carrera: string;
    handleCarreraChange: (val: string) => void;
    nivel: string;
    handleNivelChange: (val: string) => void;
    materia: string;
    setMateria: (val: string) => void;
    comision: string;
    setComision: (val: string) => void;
    materiasSearchDisponibles: string[];
    handleClear: () => void;
    handleSearch: () => void;
  };
  isLoading: boolean;
}

export const GroupFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const { 
    carrera, handleCarreraChange,
    nivel, handleNivelChange,
    materia, setMateria,
    comision, setComision,
    materiasSearchDisponibles,
    handleClear, handleSearch 
  } = filters;

  const isSearchDisabled = isLoading || (!carrera && !materia && !comision);

  return (
    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl mb-10 relative animate-in slide-in-from-top-4 duration-500">
      <div className="absolute top-0 left-10 w-32 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 blur-sm opacity-40"></div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shadow-sm">
          <Icons type="search" className="w-5 h-5" />
        </div>
        <h3 className="text-white font-bold text-lg">Radar de Grupos</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 relative z-10">
        
        <CustomSelect 
          label="1. Especialidad" 
          value={carrera} 
          options={CARRERAS_OPTIONS} 
          onChange={handleCarreraChange} 
        />

        <CustomSelect 
          label="2. Nivel Académico" 
          value={nivel} 
          options={NIVEL_OPTIONS} 
          onChange={handleNivelChange} 
          disabled={!carrera} 
        />

        <AutocompleteInput 
          label="3. Materia" 
          value={materia} 
          suggestions={materiasSearchDisponibles} 
          onChange={setMateria} 
          placeholder={(!carrera || !nivel) ? "Requerido..." : "Ej: Análisis Matemático"} 
          disabled={!carrera || !nivel} 
        />

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">4. Comisión (Opcional)</label>
          <Input 
            fullWidth placeholder="Ej: K1043" value={comision} 
            onChange={e => setComision(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && !isSearchDisabled && handleSearch()} 
            className="cursor-text text-sm py-3.5 bg-slate-950/50 border-white/10 hover:border-slate-500/50 focus:border-slate-500 transition-all rounded-xl uppercase" 
          />
        </div>

      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-6 relative">
        <div className="text-xs text-slate-500 font-medium hidden md:block">
           Tip: Filtrá por Homogéneas para materias básicas comunes.
        </div>
        
        <div className="flex w-full md:w-auto justify-end gap-4">
          {(carrera || nivel || materia || comision) && (
            <button 
              onClick={handleClear} 
              className="cursor-pointer px-5 py-3 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              Limpiar
            </button>
          )}
          <button 
            onClick={handleSearch} 
            disabled={isSearchDisabled} 
            className={`cursor-pointer px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg w-full md:w-auto ${
              isSearchDisabled 
                ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Escaneando...</>
            ) : (
              <>Buscar Redes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};