// useMaterias.ts — Obtiene todas las materias de una carrera desde el backend.
// Se usa para enriquecer los nombres del plan estático con los de la DB.
import { useEffect, useState } from 'react';
import type { MateriaDB } from '../types/grade.types';

interface UseMaterias {
  materias: MateriaDB[];
  loading: boolean;
  /** Mapa código → nombre oficial de la DB */
  byCode: Record<string, string>;
}

export const useMaterias = (carreraId: string): UseMaterias => {
  const [materias, setMaterias] = useState<MateriaDB[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!carreraId) return;
    setLoading(true);
    const API = import.meta.env.VITE_API_URL ?? '';
    fetch(`${API}/api/materias?carrera=${encodeURIComponent(carreraId)}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: MateriaDB[]) => setMaterias(data))
      .catch(() => setMaterias([]))
      .finally(() => setLoading(false));
  }, [carreraId]);

  const byCode: Record<string, string> = {};
  materias.forEach(m => {
    if (m.codigo) byCode[m.codigo.toUpperCase()] = m.materia;
  });

  return { materias, loading, byCode };
};
