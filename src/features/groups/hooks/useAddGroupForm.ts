import { useState, useEffect, useMemo } from 'react';
import { materiasService } from '../services/materiasService';

export const useAddGroupForm = () => {
  const [form, setForm] = useState({
    carrera: '', nivel: '', materia: '', comision: '', link: '', tipo: 'Alumnos' as 'Alumnos' | 'Oficial',
  });
  const [supabaseMaterias, setSupabaseMaterias] = useState<string[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(false);

  useEffect(() => {
    if (!form.carrera || !form.nivel) { setSupabaseMaterias([]); return; }
    setLoadingMaterias(true);
    
    const peticiones = [materiasService.getMaterias(form.carrera, form.nivel)];
    
    if (form.carrera !== 'homogeneas' && form.carrera !== 'ingreso' && (form.nivel === '1' || form.nivel === '2')) {
      peticiones.push(materiasService.getMaterias('homogeneas', form.nivel));
    }

    Promise.all(peticiones)
      .then(resultados => {
        const combinadas = resultados.flat().map(r => r.materia);
        setSupabaseMaterias(combinadas);
      })
      .catch(() => setSupabaseMaterias([]))
      .finally(() => setLoadingMaterias(false));
  }, [form.carrera, form.nivel]);

  const materiasDisponibles = useMemo(() => {
    if (!form.carrera || !form.nivel) return [];
    return Array.from(new Set(supabaseMaterias)).sort();
  }, [form.carrera, form.nivel, supabaseMaterias]);

  const handleCarreraChange = (val: string) => setForm(f => ({ ...f, carrera: val, nivel: val === 'ingreso' ? '0' : '', materia: '' }));
  const handleNivelChange = (val: string) => setForm(f => ({ ...f, nivel: val, materia: '' }));

  return { form, setForm, materiasDisponibles, loadingMaterias, handleCarreraChange, handleNivelChange };
};