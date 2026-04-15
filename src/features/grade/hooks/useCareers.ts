import { useState, useMemo } from 'react';
import { CAREERS_DATA } from '@/data/carreras';

export interface CareerOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  border: string;
  shadow: string;
  bgGlow: string;
}

export const useCareers = (initialCareers: CareerOption[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Enriquecemos las carreras con datos reales de tu base (materias y años)
  const careersWithStats = useMemo(() => {
    return initialCareers.map(career => {
      const data = CAREERS_DATA[career.id];
      const subjectsCount = data ? data.length : 0;
      const yearsCount = data ? Math.max(...data.map(s => s.level)) : 0;
      
      return { 
        ...career, 
        subjectsCount, 
        yearsCount 
      };
    });
  }, [initialCareers]);

  // Filtro de búsqueda en tiempo real
  const filteredCareers = useMemo(() => {
    if (!searchTerm) return careersWithStats;
    return careersWithStats.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [careersWithStats, searchTerm]);

  return { 
    searchTerm, 
    setSearchTerm, 
    filteredCareers 
  };
};