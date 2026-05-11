// src/features/trueketec/types/trueketec.types.ts

export type Turno         = "Mañana" | "Tarde" | "Noche";
export type TurnoDeseado  = Turno | "Cualquiera";
export type EstadoPost    = "activo" | "completado";

export interface TrueketecPost {
  _id:              string;
  userId:           string;
  userEmail:        string | null;  // revelado sólo si hay match aceptado
  materia:          string;
  comision_actual:  string;
  turno_actual:     Turno;
  comision_deseada: string;
  turno_deseado:    TurnoDeseado;
  estado:           EstadoPost;
  matchedWith?:     string | null;
  matchedEmail?:    string | null;
  createdAt:        string;
  expiresAt?:       string | null;

  // Enriquecido por el backend al listar
  isMatch?:         boolean;
  authorEmail?:     string | null;
  myPostId?:        string;
}

export interface TrueketecFeedResponse {
  posts:       TrueketecPost[];
  total:       number;
  page:        number;
  totalPages:  number;
}

export interface TrueketecMatchesResponse {
  matches: TrueketecPost[];
}

export interface TrueketecFilters {
  materia?:         string;
  turno_deseado?:   TurnoDeseado | "";
  comision_actual?: string;
}

export interface TrueketecFormData {
  materia:          string;
  comision_actual:  string;
  turno_actual:     Turno | "";
  comision_deseada: string;
  turno_deseado:    TurnoDeseado | "";
}
