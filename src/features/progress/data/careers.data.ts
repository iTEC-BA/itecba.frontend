import { subjectsService } from '@/services/subjectsService';

export const CAREER_NAMES: Record<string, string> = {
  sistemas: 'Ing. en Sistemas de Información',
  industrial: 'Ing. Industrial',
  civil: 'Ing. Civil',
  electronica: 'Ing. Electrónica',
  electrica: 'Ing. Eléctrica',
  mecanica: 'Ing. Mecánica',
  quimica: 'Ing. Química',
  naval: 'Ing. Naval',
  textil: 'Ing. Textil',
  homogeneas: 'Materias Homogéneas',
};

// Obtenemos el plan directo de la DB
export const getCareerPlanAsync = async (careerId: string) => {
  try {
    const subjects = await subjectsService.getSubjects(careerId);
    return subjects.map(s => ({
      id: s.subject_key,
      name: s.materia,
      code: s.codigo || s.sigla || 'N/A',
      level: s.nivel || 1,
      reqCursada: [], // Se pueden popular luego con getCorrelativas si es necesario
      reqAprobada: []
    }));
  } catch (error) {
    console.error("Error al traer plan:", error);
    return [];
  }
};
