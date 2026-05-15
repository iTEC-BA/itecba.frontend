// src/features/trueketec/types/trueketec.types.ts

export type Turno         = "Mañana" | "Tarde" | "Noche";
export type TurnoDeseado  = Turno | "Cualquiera";
export type EstadoPost    = "Activo" | "En Negociación" | "Trueque Realizado";

export interface TrueketecPost {
  _id:              string;
  userId:           string;
  userEmail:        string | null;
  userName:         string;
  departamento:     string;
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

  // Enriquecido por el backend
  isOwn?:               boolean;
  isPerfectMatch?:      boolean;
  authorEmail?:         string | null;
  myPostId?:            string;
  postulacionesCount?:  number;
}

export interface Postulante {
  userId:    string;
  userEmail: string;
  userName:  string;
  ofertas:   TrueketecPost[];
}

export interface TrueketecFeedResponse {
  posts:      TrueketecPost[];
  total:      number;
  page:       number;
  totalPages: number;
  hasMore:    boolean;
}

export interface TrueketecMatchesResponse {
  matches: TrueketecPost[];
}

export interface TrueketecFilters {
  materia?:       string;
  departamento?:  string;
  turno_deseado?: TurnoDeseado | "";
  comision?:      string;
}

export interface TrueketecFormData {
  departamento:     string;
  materia:          string;
  comision_actual:  string;
  turno_actual:     Turno | "";
  comision_deseada: string;
  turno_deseado:    TurnoDeseado | "";
}
