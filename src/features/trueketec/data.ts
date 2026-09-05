import type { Turno, TurnoDeseado, EstadoPost } from "./types/trueketec.types";

export const TRUEKETEC_ACCENT = "itec-section-trueketec";

export const SOPORTE = {
  email: "sguglielmino@frba.utn.edu.ar",
  telefono: "1128629988",
  contactoNombre: "Santiago",
};

export const TURNOS: Turno[] = ["Mañana", "Tarde", "Noche"];
export const TURNOS_DESEADOS: TurnoDeseado[] = ["Mañana", "Tarde", "Noche", "Cualquiera"];

export const LIMITE_SOLICITUDES_ACTIVAS = 3;

export const ESTADOS_OPCIONES: EstadoPost[] = ["Activo", "En Negociación", "Trueque Realizado"];

export const ESTADO_CONFIG: Record<EstadoPost, { label: string; cls: string }> = {
  "Activo":            { label: "Activo",  cls: `text-${TRUEKETEC_ACCENT} border-${TRUEKETEC_ACCENT}/40` },
  "En Negociación":    { label: "En Trámite", cls: "text-itec-text border-itec-border" },
  "Trueque Realizado": { label: "Cerrado", cls: "text-itec-muted border-itec-border" },
};

export const PASOS_COMO_FUNCIONA: { titulo: string; detalle: string }[] = [
  {
    titulo: "Cargá tu solicitud",
    detalle: `Hacé clic en "Cargar Solicitud" para publicar tu comisión actual y las que te sirven de destino.`,
  },
  {
    titulo: "Buscá tu match",
    detalle: "Usá los filtros del Directorio General para encontrar a alguien compatible y contactalo.",
  },
  {
    titulo: "Oficializá el cambio",
    detalle: `Cuando ambos estén de acuerdo, es fundamental que LOS DOS envíen un mail a ${SOPORTE.email} para que la gestión actualice el registro oficial.`,
  },
];

export const AVISO_GESTION = `En caso de que en gestión no den la posibilidad del trueque, den aviso de inmediato al ${SOPORTE.telefono} (${SOPORTE.contactoNombre}).`;

export const OFICIALIZACION_DETALLE = `Una vez acordado el intercambio, AMBOS estudiantes deben enviar un correo a ${SOPORTE.email} confirmando el trueque, indicando sus nombres, legajos y comisiones a intercambiar.`;

export const COMISION_REGEX = /^[A-Za-z]\d{4}$/;

export const MENSAJES = {
  filtrosIncompletos: "Parámetros incompletos.",
  comisionCorta: "Requiere 2 caracteres mínimo.",
  ayudaFiltros: "Exclusivo materias de tu carrera y homogéneas.",
  ayudaComision: "Formato estándar: Letra + 4 números.",
  documentacionIncompleta: "Documentación incompleta.",
  sinSesion: "Sin sesión.",
  errorGenerico: "Error interno.",
  postulacionOk: "Postulación asentada correctamente.",
  sinRegistrosVinculados: "Sin registros vinculados.",
  sinExpedientes: "Usted no posee expedientes activos en el sistema.",
  sinResultados: "Sin resultados para esta búsqueda.",
  sinResultadosFeed: "No hay solicitudes activas con esos filtros.",
  estadoInicial: "Establezca los parámetros de búsqueda para consultar el directorio oficial.",
};

export const EMPTY_FORM = {
  departamento: "",
  materia: "",
  comision_actual: "",
  turno_actual: "" as Turno | "",
  comision_deseada: "",
  turno_deseado: "" as TurnoDeseado | "",
};

export const getCarreraValue = (specialty?: string): string | null => {
  if (!specialty) return null;
  const s = specialty.trim().toLowerCase();

  if (s.includes("sistemas")) return "sistemas";
  if (s.includes("mecanica") || s.includes("mecánica")) return "mecanica";
  if (s.includes("electronica") || s.includes("electrónica")) return "electronica";
  if (s.includes("electrica") || s.includes("eléctrica")) return "electrica";
  if (s.includes("civil")) return "civil";
  if (s.includes("industrial")) return "industrial";
  if (s.includes("quimica") || s.includes("química")) return "quimica";
  if (s.includes("naval")) return "naval";
  if (s.includes("textil")) return "textil";

  return null;
};
