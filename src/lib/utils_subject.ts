// ============================================================================
// UTILIDADES - itec_data.ts
// Funciones de ayuda para consultar la base hardcodeada de materias/carreras.
// ============================================================================
import { CARRERAS_DATA, ESPECIALIDADES, Subject, SpecialtyUI } from '@data/subject';

/** Devuelve todas las materias de una carrera (o [] si no existe). */
export function getMateriasPorCarrera(carrera: string): Subject[] {
  return CARRERAS_DATA[carrera] ?? [];
}

/** Busca una materia por su id (codigo real o sintetico) dentro de una carrera. */
export function getMateriaPorId(carrera: string, id: string): Subject | undefined {
  return getMateriasPorCarrera(carrera).find((m) => m.id === id);
}

/** Busca una materia por id en TODAS las carreras (util si solo tenes el id). */
export function getMateriaPorIdGlobal(id: string): { carrera: string; materia: Subject } | undefined {
  for (const carrera of Object.keys(CARRERAS_DATA)) {
    const materia = CARRERAS_DATA[carrera].find((m) => m.id === id);
    if (materia) return { carrera, materia };
  }
  return undefined;
}

/** Devuelve las materias de un nivel/año especifico de una carrera. */
export function getMateriasPorNivel(carrera: string, nivel: number): Subject[] {
  return getMateriasPorCarrera(carrera).filter((m) => m.level === nivel);
}

/**
 * Dado un set de ids de materias APROBADAS y otro de CURSADAS por el alumno,
 * devuelve qué materias de la carrera está habilitado a cursar.
 * (cumple reqCursada con "cursadas o aprobadas" y reqAprobada solo con "aprobadas")
 */
export function getMateriasHabilitadas(
  carrera: string,
  aprobadas: Set<string>,
  cursadas: Set<string>,
): Subject[] {
  const todasCursadasOAprobadas = new Set([...aprobadas, ...cursadas]);
  return getMateriasPorCarrera(carrera).filter((materia) => {
    // ya la curso o aprobo -> no está "para habilitar"
    if (aprobadas.has(materia.id) || cursadas.has(materia.id)) return false;
    const cumpleCursada = materia.reqCursada.every((id) => todasCursadasOAprobadas.has(id));
    const cumpleAprobada = materia.reqAprobada.every((id) => aprobadas.has(id));
    return cumpleCursada && cumpleAprobada;
  });
}

/** Devuelve las correlativas (cursada + aprobada) de una materia, resueltas con nombre. */
export function getCorrelativas(carrera: string, id: string): {
  cursada: Subject[];
  aprobada: Subject[];
} {
  const materia = getMateriaPorId(carrera, id);
  if (!materia) return { cursada: [], aprobada: [] };
  const byId = new Map(getMateriasPorCarrera(carrera).map((m) => [m.id, m]));
  return {
    cursada: materia.reqCursada.map((rid) => byId.get(rid)).filter(Boolean) as Subject[],
    aprobada: materia.reqAprobada.map((rid) => byId.get(rid)).filter(Boolean) as Subject[],
  };
}

/** Datos de una especialidad/carrera por su carreraValue (ej. 'sistemas'). */
export function getEspecialidad(carreraValue: string): SpecialtyUI | undefined {
  return ESPECIALIDADES.find((e) => e.carreraValue === carreraValue);
}