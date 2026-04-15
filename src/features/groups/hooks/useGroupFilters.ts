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
    if (!hasSearched) return [];
    
    const searchMateria = normalizeString(materia);
    const searchComision = normalizeString(comision);
    
    return (allGroups || []).filter(g => {
      const isHomogeneaCompatibility = (carrera !== 'homogeneas' && g.carrera === 'homogeneas' && normalizeString(g.materia) === searchMateria);
      
      const matchCarrera = carrera === '' || g.carrera === carrera || isHomogeneaCompatibility;
      const matchNivel = nivel === '' || g.nivel === nivel;
      const matchMateria = materia === '' || normalizeString(g.materia).includes(searchMateria);
      const matchComision = comision === '' || normalizeString(g.comision).includes(searchComision);
      
      return matchCarrera && matchNivel && matchMateria && matchComision;
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