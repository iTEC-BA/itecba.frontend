import { useState, useEffect, useMemo, useRef } from 'react';
import { materiasService } from '@features/groups/services/materiasService';

export const useResourceMaterias = (
  carrera: string,
  nivel: string,
  materia: string,
  setMateria: (v: string) => void
) => {
  const [supabaseMaterias, setSupabaseMaterias] = useState<string[]>([]);
  const [openDrop, setOpenDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Efecto 1: Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) {
        setOpenDrop(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Efecto 2: Cargar materias dinámicamente desde Supabase
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        // Si no hay carrera seleccionada, traemos todas para el buscador libre
        if (!carrera) {
          const data = await materiasService.getMaterias();
          setSupabaseMaterias(data.map(d => d.materia));
          return;
        }

        // Si hay carrera, preparamos la petición específica
        const peticiones = [materiasService.getMaterias(carrera, nivel || undefined)];

        // Mezclamos homogéneas si es ingeniería de 1er o 2do año
        if (carrera !== 'homogeneas' && carrera !== 'ingreso' && (nivel === '1' || nivel === '2')) {
          peticiones.push(materiasService.getMaterias('homogeneas', nivel));
        }

        const resultados = await Promise.all(peticiones);
        const combinadas = resultados.flat().map(r => r.materia);
        setSupabaseMaterias(combinadas);
      } catch (error) {
        console.error("Error al cargar materias en recursos:", error);
        setSupabaseMaterias([]);
      }
    };

    fetchMaterias();
  }, [carrera, nivel]);

  // Derivado: Filtrar la lista según lo que el usuario escribe
  const filteredOptions = useMemo(() => {
    const unicas = Array.from(new Set(supabaseMaterias)).sort();
    if (!materia) return unicas;
    return unicas.filter(m => m.toLowerCase().includes(materia.toLowerCase()));
  }, [supabaseMaterias, materia]);

  // Handler: Seleccionar materia del dropdown
  const handleSelectMateria = (m: string) => {
    setMateria(m);
    setOpenDrop(false);
  };

  return {
    dropRef,
    openDrop,
    setOpenDrop,
    filteredOptions,
    handleSelectMateria
  };
};