import { useState, useMemo } from 'react';
import { MATERIAS_POR_CARRERA, MATERIAS_HOMOGENEAS } from '../types/groups';

export const useAddGroupForm = () => {
  const [form, setForm] = useState({
    carrera: '',
    nivel: '',
    materia: '',
    comision: '',
    link: '',
    tipo: 'Alumnos' as 'Alumnos' | 'Oficial'
  });

  const materiasDisponibles = useMemo(() => {
    if (!form.carrera || !form.nivel) return [];

    // 1. Materias específicas de la carrera y nivel
    let materias = MATERIAS_POR_CARRERA[form.carrera]?.[form.nivel] || [];

    // 2. Inyectar Homogéneas SOLO si el nivel es 1 o 2
    if (form.carrera !== 'homogeneas' && form.carrera !== 'ingreso') {
      if (form.nivel === '1') materias = [...materias, ...(MATERIAS_HOMOGENEAS['1'] || [])];
      if (form.nivel === '2') materias = [...materias, ...(MATERIAS_HOMOGENEAS['2'] || [])];
    }

    // 3. Si eligió Homogéneas directamente, limitamos por la estructura de MATERIAS_HOMOGENEAS
    if (form.carrera === 'homogeneas') {
        materias = MATERIAS_HOMOGENEAS[form.nivel] || [];
    }

    return Array.from(new Set(materias)).sort();
  }, [form.carrera, form.nivel]);

  const handleCarreraChange = (val: string) => {
    setForm({ ...form, carrera: val, nivel: '', materia: '' });
  };

  return { form, setForm, materiasDisponibles, handleCarreraChange };
};