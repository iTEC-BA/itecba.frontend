import { useState, useMemo, useEffect } from 'react';
import { materiasService } from '../services/materiasService';
import type { GroupData } from '../services/groupsService';

const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const useGroupSearch = (allGroups: GroupData[]) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');
  const [comision, setComision] = useState('');
  const [supabaseMaterias, setSupabaseMaterias] = useState<string[]>([]);

  useEffect(() => {
    if (!carrera || !nivel) { setSupabaseMaterias([]); return; }
    
    // Preparamos las peticiones a Supabase
    const peticiones = [materiasService.getMaterias(carrera, nivel)];
    
    // Si elige una ingeniería y es 1er o 2do año, también pedimos las homogéneas
    if (carrera !== 'homogeneas' && carrera !== 'ingreso' && (nivel === '1' || nivel === '2')) {
      peticiones.push(materiasService.getMaterias('homogeneas', nivel));
    }

    Promise.all(peticiones)
      .then(resultados => {
        // Unimos los arrays de resultados y extraemos solo los nombres
        const combinadas = resultados.flat().map(r => r.materia);
        setSupabaseMaterias(combinadas);
      })
      .catch(() => setSupabaseMaterias([]));
  }, [carrera, nivel]);

  const materiasSearchDisponibles = useMemo(() => {
    if (!carrera || !nivel) return [];
    return Array.from(new Set(supabaseMaterias)).sort();
  }, [carrera, nivel, supabaseMaterias]);

  const handleClear = () => { setCarrera(''); setNivel(''); setMateria(''); setComision(''); setHasSearched(false); };
  const handleSearch = () => setHasSearched(true);
  const handleCarreraChange = (val: string) => { setCarrera(val); setNivel(val === 'ingreso' ? '0' : ''); setMateria(''); setComision(''); };
  const handleNivelChange = (val: string) => { setNivel(val); setMateria(''); };

  const filteredResults = useMemo(() => {
    if (!hasSearched) return [];
    const sm = norm(materia);
    const sc = norm(comision);
    return (allGroups || []).filter(g => {
      const gc = String(g.carrera || '').toLowerCase().trim();
      const gn = String(g.nivel || '').trim();
      const gm = norm(g.materia || '');
      const gco = norm(g.comision || '');
      // Magia: Si el grupo es de homogéneas, que haga match con cualquier ingeniería
      const matchCarrera = carrera === '' || gc === carrera || (carrera !== 'homogeneas' && gc === 'homogeneas');
      return matchCarrera && (nivel === '' || gn === nivel) && (sm === '' || gm.includes(sm)) && (sc === '' || gco.includes(sc));
    });
  }, [allGroups, hasSearched, carrera, nivel, materia, comision]);

  return {
    filters: { carrera, handleCarreraChange, nivel, handleNivelChange, materia, setMateria, comision, setComision, materiasSearchDisponibles, handleClear, handleSearch },
    filteredResults,
    hasSearched,
    handleSpecialtyClick: (val: string) => { handleCarreraChange(val); setHasSearched(true); },
  };
};