import { useState, useMemo, useCallback, useEffect } from 'react';
import { materiasService, type MateriaRow } from '../services/materiasService';
import { groupsService, type SearchGroupsResult } from '../services/groupsService';

const EMPTY_RESULT: SearchGroupsResult = {
  groups: [], total: 0, page: 1, totalPages: 0, hasMore: false,
};

export const useGroupSearch = () => {
  const [hasSearched,  setHasSearched]  = useState(false);
  const [isSearching,  setIsSearching]  = useState(false);
  const [searchError,  setSearchError]  = useState<string | null>(null);

  // Filtros del formulario
  const [carrera,  setCarrera]  = useState('');
  const [nivel,    setNivel]    = useState('');
  const [materia,  setMateria]  = useState('');
  const [comision, setComision] = useState('');

  // Materias del catálogo (Supabase)
  const [supabaseMaterias, setSupabaseMaterias] = useState<MateriaRow[]>([]);

  // Resultados paginados
  const [result,      setResult]      = useState<SearchGroupsResult>(EMPTY_RESULT);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Carga de materias al cambiar carrera o nivel ──────────
  const loadMaterias = useCallback(async (c: string, n: string) => {
    if (!c || !n) { setSupabaseMaterias([]); return; }
    const reqs = [materiasService.getMaterias(c, n)];
    const isEngineering = c !== 'homogeneas' && c !== 'ingreso';
    if (isEngineering && (n === '1' || n === '2')) {
      reqs.push(materiasService.getMaterias('homogeneas', n));
    }
    try {
      const rows = (await Promise.all(reqs)).flat();
      setSupabaseMaterias(rows);
    } catch { setSupabaseMaterias([]); }
  }, []);

  useEffect(() => {
    loadMaterias(carrera, nivel);
  }, [carrera, nivel, loadMaterias]);

  // ── Sugerencias de autocompletado ─────────────────────────
  const materiasSearchDisponibles = useMemo(() => {
    if (!carrera || !nivel) return [];
    const seen = new Set<string>();
    return supabaseMaterias
      .filter(r => { if (seen.has(r.materia)) return false; seen.add(r.materia); return true; })
      .sort((a, b) => a.materia.localeCompare(b.materia))
      .map(r => r.materia);
  }, [carrera, nivel, supabaseMaterias]);

  // ── Regla de negocio: cuándo se puede buscar ─────────────
  // OPCIÓN A: carrera + nivel + materia completos
  // OPCIÓN B: solo comision (mín. 3 chars, sin importar el resto)
  const canSearch = (!!carrera && !!nivel && !!materia) || comision.trim().length >= 3;

  // ── Función de búsqueda con página ───────────────────────
  const doSearch = useCallback(async (page: number) => {
    if (!canSearch) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await groupsService.searchGroups(
        { carrera, nivel, materia, comision: comision.trim() },
        page
      );
      setResult(res);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al buscar grupos';
      setSearchError(message);
    } finally {
      setIsSearching(false);
    }
  }, [carrera, nivel, materia, comision, canSearch]);

  const handleSearch    = useCallback(() => doSearch(1), [doSearch]);
  const handlePageChange = useCallback((page: number) => doSearch(page), [doSearch]);

  // ── Cambios de carrera / nivel: resetea campos dependientes
  const handleCarreraChange = useCallback((val: string) => {
    setCarrera(val);
    setNivel(val === 'ingreso' ? '0' : '');
    setMateria('');
    setHasSearched(false);
    setResult(EMPTY_RESULT);
    setSearchError(null);
  }, []);

  const handleNivelChange = useCallback((val: string) => {
    setNivel(val);
    setMateria('');
    setHasSearched(false);
    setResult(EMPTY_RESULT);
    setSearchError(null);
  }, []);

  const handleClear = useCallback(() => {
    setCarrera(''); setNivel(''); setMateria(''); setComision('');
    setHasSearched(false); setResult(EMPTY_RESULT);
    setSearchError(null); setCurrentPage(1);
  }, []);

  // handleSpecialtyClick: pre-rellena carrera desde el grid de especialidades
  const handleSpecialtyClick = useCallback((val: string) => {
    setCarrera(val);
    setNivel(val === 'ingreso' ? '0' : '');
    setMateria('');
    setComision('');
    setHasSearched(false);
    setResult(EMPTY_RESULT);
    setSearchError(null);
  }, []);

  return {
    filters: {
      carrera,  handleCarreraChange,
      nivel,    handleNivelChange,
      materia,  setMateria,
      comision, setComision,
      materiasSearchDisponibles,
      handleClear,
      handleSearch,
      canSearch,
    },
    filteredResults: result.groups,
    pagination: {
      currentPage,
      totalPages:  result.totalPages,
      total:       result.total,
      hasMore:     result.hasMore,
    },
    hasSearched,
    isSearching,
    searchError,
    handlePageChange,
    handleSpecialtyClick,
  };
};

// Re-export para retrocompatibilidad (AddGroupModal lo usa)
export { useGroupSearch as useGroupFilters };

// Tipo exportado para los componentes que reciben filtros
export type GroupFiltersProps = ReturnType<typeof useGroupSearch>['filters'];
