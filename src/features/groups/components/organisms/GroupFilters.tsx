import React from 'react';
import { Icons } from '@components/ui/icons/Icons';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { AutocompleteInput } from '@components/molecules/AutocompleteInput';
import { Input } from '@components/ui/Input';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '../../types/groups';
import type { GroupFiltersProps } from '../../hooks/useGroupFilters';

interface Props {
  filters: GroupFiltersProps;
  isLoading: boolean;
}

export const GroupFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const {
    carrera, handleCarreraChange,
    nivel,   handleNivelChange,
    materia, setMateria,
    comision, setComision,
    materiasSearchDisponibles,
    handleClear,
    handleSearch,
    canSearch,
  } = filters;

  // El botón buscar se habilita con la regla del hook (carrera+nivel+materia OR comision≥3)
  const isSearchEnabled = !isLoading && canSearch;
  const hasFilters = !!(carrera || nivel || materia || comision);

  return (
    <div className="bg-itec-box border border-white/[0.07] rounded-xl p-4 sm:p-6 mb-5 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-itec-groups/40 to-transparent" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-itec-groups/10 border border-itec-groups/20 rounded-xl flex items-center justify-center text-emerald-400">
          <Icons type="search" className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-itec-text">Radar de Grupos</h3>
          <p className="text-[11px] text-itec-gray">Buscá por carrera, nivel, materia o comisión</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
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
          placeholder={(!carrera || !nivel) ? 'Seleccioná carrera y nivel...' : 'Buscá la materia...'}
          disabled={!carrera || !nivel}
        />
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 pl-1">
            4. Comisión (Opcional)
          </label>
          <Input
            fullWidth
            placeholder="EJ: K1043"
            value={comision}
            onChange={e => setComision(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && isSearchEnabled && handleSearch()}
            className="text-sm py-3.5 bg-itec-box/50 border-itec-border hover:border-emerald-500/50 focus:border-emerald-500 transition-all rounded-xl uppercase"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
        <p className="hidden sm:block text-[11px] text-itec-gray">
          💡 Tip: &quot;Homogéneas&quot; para materias básicas comunes a todas las carreras.
        </p>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          {hasFilters && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 text-xs font-bold text-itec-gray hover:text-itec-red hover:bg-itec-red/10 rounded-xl transition-all"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={!isSearchEnabled}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              isSearchEnabled
                ? 'bg-itec-groups hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(0,136,84,0.25)] hover:scale-[1.02] active:scale-95'
                : 'bg-white/5 text-itec-gray cursor-not-allowed'
            }`}
          >
            {isLoading
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />Buscando...</>
              : 'Buscar grupos'
            }
          </button>
        </div>
      </div>
    </div>
  );
};
