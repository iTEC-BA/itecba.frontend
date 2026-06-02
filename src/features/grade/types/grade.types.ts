// grade.types.ts

export interface Materia {
  codigo: string;
  nombre: string;
  correlativasCursada?: string[];
  correlativasAprobada?: string[];
}

export interface AnioEstudios {
  anio: number;
  label: string;
  videoUrl?: string;
  materias: Materia[];
}

export interface InfoItem {
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface GradeConfig {
  id: string;
  titulo: string;
  /** Texto plano corto para el PageHeader */
  descripcion: string;
  /** Descripción enriquecida en Markdown (opcional) — se muestra bajo el header */
  descripcionMd?: string;
  duracion: string;
  grado: string;
  media: Array<{
    tipo: 'imagen' | 'video';
    url: string;
    titulo?: string;
  }>;
  plan: AnioEstudios[];
  info: InfoItem[];
}

/** Forma de la respuesta del backend /api/materias */
export interface MateriaDB {
  id: number;
  materia: string;
  codigo: string | null;
  carrera: string;
  nivel: string;
}
