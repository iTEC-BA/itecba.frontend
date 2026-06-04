export interface PadronData {
  apellido: string;
  nombre: string;
  especialidad: string;
  sede: string;
  mesa: string;
}

export interface PadronResponse {
  success: boolean;
  data?: PadronData;
  error?: string;
}