import { SubjectStateEntry } from '../services/progress.service';

export type EvaluatedStatus = 'aprobada' | 'promocionada' | 'regular' | 'cursando' | 'habilitada_cursar' | 'habilitada_rendir' | 'bloqueada';

export interface SubjectDef {
  codigo: string;
  nombre: string;
  correlativas_cursar: string[]; // Códigos
  correlativas_rendir: string[]; // Códigos
}

// Lógica de Negocio UTN
export const evaluateSubject = (
  subject: SubjectDef,
  progressMap: Record<string, SubjectStateEntry>
): EvaluatedStatus => {
  const entry = progressMap[subject.codigo];
  
  // 1. Estados directos
  if (entry?.s === 'a') return 'aprobada';
  if (entry?.s === 'pr') return 'promocionada';
  if (entry?.s === 'r') return 'regular';
  if (entry?.s === 'c') return 'cursando';

  // 2. Evaluar correlativas para cursar
  const canCursar = subject.correlativas_cursar.every(reqCode => {
    const reqState = progressMap[reqCode]?.s;
    // Para cursar, alcanza con tenerla regularizada (o aprobada/promocionada)
    return reqState === 'r' || reqState === 'a' || reqState === 'pr';
  });

  // 3. Evaluar correlativas para rendir (solo importa si ya está regular)
  // Pero si no está cursada siquiera, evaluamos si está "Habilitada Cursar" o "Bloqueada"
  if (!canCursar) return 'bloqueada';

  return 'habilitada_cursar';
};

export const calculateStats = (subjects: SubjectDef[], progressMap: Record<string, SubjectStateEntry>) => {
  let aprobadas = 0;
  let enCurso = 0;
  
  subjects.forEach(sub => {
    const s = progressMap[sub.codigo]?.s;
    if (s === 'a' || s === 'pr') aprobadas++;
    if (s === 'c') enCurso++;
  });

  return {
    aprobadas,
    enCurso,
    total: subjects.length,
    porcentaje: subjects.length > 0 ? Math.round((aprobadas / subjects.length) * 100) : 0
  };
};
