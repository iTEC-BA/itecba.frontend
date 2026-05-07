import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@components/ui/Button';
import { FilterField } from '../molecules/FilterField';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS, MATERIAS_POR_CARRERA } from '@features/groups/types/groups';

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
  const [openDrop, setOpenDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const hasFilters = searchQuery || carrera || nivel || materia;

  const allMaterias = useMemo(() => {
    const s = new Set<string>();
    Object.values(MATERIAS_POR_CARRERA).forEach(n => Object.values(n).forEach(m => m.forEach(x => s.add(x))));
    return [...s].sort();
  }, []);

  const materiaOptions =
    carrera && nivel && MATERIAS_POR_CARRERA[carrera]?.[nivel]
      ? MATERIAS_POR_CARRERA[carrera][nivel]
      : allMaterias;

  const filtered = materiaOptions.filter(m => m.toLowerCase().includes(materia.toLowerCase()));

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!dropRef.current?.contains(e.target as Node)) setOpenDrop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <section className="bg-itec-box border border-itec-gray/30 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl shadow-black/20">

      {/* Grid de filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Búsqueda por título — ocupa 2 cols en lg */}
        <FilterField label="Buscar título" className="sm:col-span-2">
          <Input
            fullWidth
            placeholder="Ej: Resumen Análisis I..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={INPUT_CLS}
          />
        </FilterField>

        {/* Carrera */}
        <FilterField label="Carrera">
          <Select
            fullWidth
            options={CARRERAS_OPTIONS}
            value={carrera}
            onChange={e => { setCarrera(e.target.value); setNivel(e.target.value === 'ingreso' ? '0' : ''); }}
            className={`${INPUT_CLS} cursor-pointer`}
          />
        </FilterField>

        {/* Nivel */}
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

        {/* Materia con autocomplete */}
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
            {openDrop && filtered.length > 0 && (
              <ul className="absolute z-50 top-full mt-1 w-full max-h-48 overflow-y-auto bg-itec-sidebar border border-itec-gray/40 rounded-xl shadow-2xl shadow-black/40">
                {filtered.slice(0, 30).map(m => (
                  <li
                    key={m}
                    onMouseDown={() => { setMateria(m); setOpenDrop(false); }}
                    className="px-3 py-2 text-sm text-itec-text hover:bg-orange-600/80 hover:text-itec-text cursor-pointer border-b border-itec-gray/20 last:border-0 transition-colors truncate"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </FilterField>
      </div>

      {/* Footer: contador + limpiar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-itec-gray/20">
        <span className="text-xs text-itec-gray">
          <span className="font-bold text-itec-text">{totalVisible}</span> aporte{totalVisible !== 1 ? 's' : ''} encontrado{totalVisible !== 1 ? 's' : ''}
        </span>
        {hasFilters && (
          <Button
            onClick={onClear}
            className="text-xs py-1.5 px-3 bg-itec-red/10 text-itec-red-skye border border-itec-red/20 hover:bg-itec-red hover:text-itec-text hover:border-itec-red transition-all rounded-lg"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </section>
  );
};
