// src/features/aulas/types/aulas.types.ts

export type FuncionAula =
  | "aula_comun"
  | "laboratorio_informatica"
  | "laboratorio_especialidad"
  | "departamento"
  | "bedelia"
  | "ceit"
  | "sala_reunion"
  | "secretaria"
  | "otro";

export type SedeAula = "medrano" | "campus";

export interface Aula {
  _id:          string;
  numero:       string;
  slug:         string;
  sede:         SedeAula;
  piso:         number;
  funcion:      FuncionAula;
  pasillo?:     string;
  ala?:         string;
  capacidad?:   number;
  carrera?:     string;
  descripcion?: string;
  referencias?: string;
  imagenes:     string[];
  videos:       string[];
  activo:       boolean;
  createdAt:    string;
  updatedAt:    string;
}

/** Payload reducido que devuelve GET /api/aulas (sin imagenes, videos, referencias) */
export type AulaResumen = Omit<Aula, "imagenes" | "videos" | "referencias">;

export interface AulasListResponse {
  aulas:   AulaResumen[];
  version: string;   // ISO timestamp del aula más recientemente modificada
}

export interface AulaDetailResponse {
  aula: Aula;
}

export interface AulasFilters {
  sede?:    SedeAula | "";
  funcion?: FuncionAula | "";
  texto?:   string;
}

export interface AulaFormData {
  numero:      string;
  sede:        SedeAula | "";
  piso:        number | "";
  funcion:     FuncionAula | "";
  pasillo:     string;
  ala:         string;
  capacidad:   number | "";
  carrera:     string;
  descripcion: string;
  referencias: string;
  videos:      string[];
}
