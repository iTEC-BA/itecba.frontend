// src/features/progress/data/careers.data.ts
// FIX (tabla vacía): re-exporta los planes reales de src/data/carreras.ts
// para que getCareerPlan en useProgress devuelva materias en lugar de [].
import {
  CAREERS_DATA,
  type SubjectDef,
} from '@/data/carreras';

export type { SubjectDef };

/** Mapa de ID de carrera → nombre completo mostrado en la UI */
export const CAREER_NAMES: Record<string, string> = {
  sistemas:    'Ingeniería en Sistemas de Información',
  industrial:  'Ingeniería Industrial',
  civil:       'Ingeniería Civil',
  electronica: 'Ingeniería Electrónica',
  electrica:   'Ingeniería Eléctrica',
  mecanica:    'Ingeniería Mecánica',
  quimica:     'Ingeniería Química',
  naval:       'Ingeniería Naval',
  textil:      'Ingeniería Textil',
};

/**
 * Devuelve el plan de estudios de la carrera solicitada.
 * Si la carrera no existe en el catálogo retorna [] en lugar de crashear,
 * lo que produce una pantalla de "Sin materias" en lugar de una excepción.
 */
export const getCareerPlan = (careerId: string): SubjectDef[] =>
  CAREERS_DATA[careerId] ?? [];
