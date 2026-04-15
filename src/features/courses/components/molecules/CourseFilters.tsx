import React from 'react';
import { SearchInput } from '../atoms/SearchInput';
import { FilterSelect } from '../atoms/FilterSelect';
import { CategoryPill } from '../atoms/CategoryPill';

interface Props {
  filters: any; 
  isLoading: boolean;
}

export const CourseFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const { 
    searchQuery, setSearchQuery, 
    selectedMateria, setSelectedMateria, 
    selectedCategoria, setSelectedCategoria, 
    materiasDisponibles, handleClearFilters 
  } = filters;

  const hasActiveFilters = searchQuery || selectedMateria || selectedCategoria;
  const categories = ['Todos', 'Oficial', 'Comunidad'];

  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-[2rem] p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden">
      {/* Brillo Premium */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/20 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-5 mb-8 relative z-10">
        <SearchInput 
          value={searchQuery} 
          onChange={setSearchQuery} 
          disabled={isLoading} 
          placeholder="Buscar por título, tema o tecnología..." 
        />
        <FilterSelect 
          value={selectedMateria} 
          options={materiasDisponibles} 
          onChange={setSelectedMateria} 
          disabled={isLoading} 
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mr-3">Filtros:</span>
          {categories.map((cat) => (
            <CategoryPill 
              key={cat} 
              label={cat} 
              isActive={selectedCategoria === cat || (cat === 'Todos' && !selectedCategoria)} 
              onClick={() => setSelectedCategoria(cat === 'Todos' ? '' : cat)} 
            />
          ))}
        </div>

        {hasActiveFilters && (
          <button 
            onClick={handleClearFilters}
            className="cursor-pointer ml-4 px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all whitespace-nowrap active:scale-95"
          >
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>
  );
};