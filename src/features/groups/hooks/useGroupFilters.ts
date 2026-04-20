import { useState, useMemo } from 'react';
import { MATERIAS_POR_CARRERA, MATERIAS_HOMOGENEAS } from '../types/groups';
import type { GroupData } from '../services/groupsService';

const normalizeString = (str: string) => {
  return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

export const useGroupSearch = (allGroups: GroupData[]) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');
  const [comision, setComision] = useState('');

  const materiasSearchDisponibles = useMemo(() => {
    if (!carrera || !nivel) return [];
    
    let materias = MATERIAS_POR_CARRERA[carrera]?.[nivel] || [];
    if (carrera !== 'homogeneas' && carrera !== 'ingreso') {
      if (nivel === '1') materias = [...materias, ...(MATERIAS_HOMOGENEAS['1'] || [])];
      if (nivel === '2') materias = [...materias, ...(MATERIAS_HOMOGENEAS['2'] || [])];
    }
    return Array.from(new Set(materias)).sort();
  }, [carrera, nivel]);

  const handleClear = () => {
    setCarrera(''); setNivel(''); setMateria(''); setComision('');
    setHasSearched(false);
  };

  const handleSearch = () => setHasSearched(true);

  const handleCarreraChange = (val: string) => {
    setCarrera(val);
    setNivel(val === 'ingreso' ? '0' : ''); 
    setMateria('');
    setComision('');
  };

  const handleNivelChange = (val: string) => {
    setNivel(val);
    setMateria('');
  };

  const filteredResults = useMemo(() => {
    // Si el usuario aún no inició la búsqueda, no hay resultados que calcular
    if (!hasSearched) return [];

    const searchMateria = normalizeString(materia);
    const searchComision = normalizeString(comision);

    return (allGroups || []).filter(group => {
      // Normalización Defensiva
      // Las bases de datos pueden devolver variaciones (mayúsculas, números). Estandarizamos todo a string y minúsculas.
      const groupCarrera = String(group.carrera || '').toLowerCase().trim();
      const groupNivel = String(group.nivel || '').trim();
      const groupMateria = normalizeString(group.materia || '');
      const groupComision = normalizeString(group.comision || '');

      // Reglas de Pertenencia de Especialidad
      const coincideCarreraExacta = carrera === '' || groupCarrera === carrera;
      const esMateriaHomogeneaCompartida = carrera !== 'homogeneas' && groupCarrera === 'homogeneas';
      
      // Evaluación de Condiciones Individuales
      const cumpleCarrera = coincideCarreraExacta || esMateriaHomogeneaCompartida;
      const cumpleNivel = nivel === '' || groupNivel === nivel;
      const cumpleMateria = searchMateria === '' || groupMateria.includes(searchMateria);
      const cumpleComision = searchComision === '' || groupComision.includes(searchComision);

      // Decisión Final
      // El grupo sobrevive al filtro única y exclusivamente si pasa todas las validaciones
      return cumpleCarrera && cumpleNivel && cumpleMateria && cumpleComision;
    });
  }, [allGroups, hasSearched, carrera, nivel, materia, comision]);

  return {
    filters: {
      carrera, handleCarreraChange,
      nivel, handleNivelChange,
      materia, setMateria,
      comision, setComision,
      materiasSearchDisponibles,
      handleClear, handleSearch
    },
    filteredResults,
    hasSearched,
    handleSpecialtyClick: (val: string) => { handleCarreraChange(val); setHasSearched(true); }
  };
};