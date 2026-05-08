import React from 'react';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Button } from '@components/ui/Button';
import { FilterField } from '../molecules/FilterField';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '@features/groups/types/groups';
import { useResourceMaterias } from '../../hooks/useResourceMaterias';

interface Props {
  searchQuery: string; setSearchQuery: (v: string) => void;
  carrera: string;     setCarrera:     (v: string) => void;
  nivel: string;       setNivel:       (v: string) => void;
  materia: string;     setMateria:     (v: string) => void;
  onClear: () => void;
  totalVisible: number;
}

const INPUT_CLS = 'text-sm py-2.5 bg-itec-bg border-itec-gray/60 focus:border-orange-500/70 transition-colors placeholder:text-itec-gray/40';

export const ResourceFilters: React.FC<Props> = ({
  searchQuery, setSearchQuery,
  carrera, setCarrera,
  nivel, setNivel,
  materia, setMateria,
  onClear, totalVisible,
}) => {
  const hasFilters = Boolean(searchQuery || carrera || nivel || materia);

  // Delegamos toda la lógica compleja de datos y estados visuales al Hook
  const { 
    dropRef, 
    openDrop, 
    setOpenDrop, 
    filteredOptions, 
    handleSelectMateria 
  } = useResourceMaterias(carrera, nivel, materia, setMateria);

  return (
    <section className="bg-itec-box border border-itec-gray/30 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl shadow-black/20">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <FilterField label="Buscar título" className="sm:col-span-2">
          <Input
            fullWidth
            placeholder="Ej: Resumen Análisis I..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={INPUT_CLS}
          />
        </FilterField>

        <FilterField label="Carrera">
          <Select
            fullWidth
            options={CARRERAS_OPTIONS}
            value={carrera}
            onChange={e => { setCarrera(e.target.value); setNivel(e.target.value === 'ingreso' ? '0' : ''); }}
            className={`${INPUT_CLS} cursor-pointer`}
          />
        </FilterField>

        <FilterField label="Año">
          <Select
            fullWidth
            disabled={!carrera}
            options={NIVEL_OPTIONS}
            value={nivel}
            onChange={e => setNivel(e.target.value)}
            className={`${INPUT_CLS} disabled:opacity-40 cursor-pointer`}
          />
        </FilterField>

        <FilterField label="Materia">
          <div ref={dropRef} className="relative">
            <Input
              fullWidth
              placeholder="Buscar materia..."
              value={materia}
              onChange={e => { setMateria(e.target.value); setOpenDrop(true); }}
              onFocus={() => setOpenDrop(true)}
              className={INPUT_CLS}
            />
            {openDrop && filteredOptions.length > 0 && (
              <ul className="absolute z-50 top-full mt-1 w-full max-h-48 overflow-y-auto bg-itec-sidebar border border-itec-gray/40 rounded-xl shadow-2xl shadow-black/40">
                {filteredOptions.slice(0, 30).map(m => (
                  <li
                    key={m}
                    onMouseDown={() => handleSelectMateria(m)}
                    className="px-3 py-2 text-sm text-itec-text hover:bg-orange-600/80 hover:text-itec-text cursor-pointer border-b border-itec-border last:border-0 transition-colors truncate"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </FilterField>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-itec-border">
        <span className="text-xs text-itec-gray">
          <span className="font-bold text-itec-text">{totalVisible}</span> aporte{totalVisible !== 1 ? 's' : ''} encontrado{totalVisible !== 1 ? 's' : ''}
        </span>
        {hasFilters && (
          <Button variant="danger" hierarchy="ghost" onClick={onClear} icon="trash">Limpiar filtros</Button>
        )}
      </div>
    </section>
  );
};