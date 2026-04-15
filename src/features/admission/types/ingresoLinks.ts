// 1. Definición de Tipos
export interface ActionLink { id: string; title: string; subtitle: string; url: string; }
export interface MainLink { id: string; title: string; subtitle: string; url: string; iconType: 'whatsapp' | 'instagram' | 'youtube' | 'sheets'; colorClass: string; hoverClass: string; }
export interface MaterialLink { id: string; title: string; subtitle: string; url: string; emoji: string; }
export interface SiuLink { id: string; title: string; subtitle: string; url: string; }

// 🟢 NUEVO TIPO: Pasos del Ingreso
export interface AdmissionStep { id: string; stepNumber: number; title: string; description: string; status: 'done' | 'current' | 'pending'; }

export interface IngresoDataProps {
  actions: ActionLink[];
  mainLinks: MainLink[];
  materials: MaterialLink[];
  siuLinks: SiuLink[];
  steps: AdmissionStep[]; // 🟢 NUEVO
}

// 2. Base de Datos
export const INGRESO_DATA: IngresoDataProps = {
  actions: [
    { id: 'act1', title: 'Inscripción - TIVU', subtitle: 'Taller de Inicio a la Vida Universitaria', url: 'https://docs.google.com/forms/d/e/1FAIpQLSd1gMnFehCE7menTbnO0dJ6ybJq2eo_hdVkAf18EVRoQJf2HQ/viewform' },
    { id: 'act2', title: 'Simulacro de 2° Parcial', subtitle: '¡Inscribite acá para practicar!', url: 'https://bit.ly/simulacro2P-iTEC' }
  ],
  mainLinks: [
    { id: 'ml1', title: 'Grupo de WhatsApp', subtitle: 'Ingreso 2026', url: 'https://chat.whatsapp.com/FwTft3cZZ6g5Re8JccjGV2?mode=gi_t', iconType: 'whatsapp', colorClass: 'text-green-500', hoverClass: 'hover:border-green-500 hover:shadow-green-500/20' },
    { id: 'ml2', title: 'Seguinos en IG', subtitle: '@itecba', url: 'https://www.instagram.com/itecba', iconType: 'instagram', colorClass: 'text-pink-500', hoverClass: 'hover:border-pink-500 hover:shadow-pink-500/20' },
    { id: 'ml3', title: 'YouTube / Clases', subtitle: 'Clases Grabadas', url: 'https://drive.google.com/drive/folders/1hD5wlG2Eu6xStYjBw1siFlhkurOKnXha', iconType: 'youtube', colorClass: 'text-red-500', hoverClass: 'hover:border-red-500 hover:shadow-red-500/20' },
    { id: 'ml4', title: 'Grupos por aula', subtitle: '(Comisiones)', url: 'https://docs.google.com/spreadsheets/d/1oopEG5XrVHnXLd10fxlDmy9x4dFCFICt/edit?pli=1&gid=1089878495#gid=1089878495', iconType: 'sheets', colorClass: 'text-green-400', hoverClass: 'hover:border-green-400 hover:shadow-green-400/20' }
  ],
  materials: [
    { id: 'mat1', title: 'FINALES', subtitle: 'Resueltos paso a paso', url: 'https://drive.google.com/drive/folders/1ZE3FNe-zes1woiEw-ct0glWvBP_FbZKO?usp=drive_link', emoji: '🎓' },
    { id: 'mat2', title: 'PARCIALES', subtitle: 'Resueltos paso a paso', url: 'https://drive.google.com/drive/folders/1lRr5MXyjosxNiAQ-cyJrzIDSri4tiJ73?usp=drive_link', emoji: '✍️' },
    { id: 'mat3', title: 'TEORÍA', subtitle: 'Matemática y Física', url: 'https://drive.google.com/drive/folders/14iNjzc6SD5Q3zhaiev_e0KPAO8cq1V_k?usp=drive_link', emoji: '📚' },
    { id: 'mat4', title: 'RESUMEN TIVU', subtitle: 'Presentación Interactiva', url: 'https://view.genially.com/67915badbba0dbb2de069182/presentation-resumen-tivu-itec', emoji: '💡' }
  ],
  siuLinks: [
    { id: 'siu1', title: 'SIU GUARANÍ ASPIRANTES', subtitle: 'Únicamente si ya estás inscripto', url: 'https://guarani.frba.utn.edu.ar/autogestion/aspirantes/' },
    { id: 'siu2', title: 'SIU PREINSCRIPCIÓN', subtitle: 'Para anotarte por primera vez', url: 'https://guarani.frba.utn.edu.ar/preinscripcion/utn/acceso/' }
  ],
  // 🟢 NUEVA DATA: Hoja de ruta del ingresante
  steps: [
    { id: 'st1', stepNumber: 1, title: 'Preinscripción Online', description: 'Completar el formulario en el SIU y elegir turno.', status: 'done' },
    { id: 'st2', stepNumber: 2, title: 'Entrega de Documentación', description: 'Llevar DNI y Título Secundario a la sede.', status: 'done' },
    { id: 'st3', stepNumber: 3, title: 'Cursar el TIVU', description: 'Taller de Inicio a la Vida Universitaria (Obligatorio).', status: 'current' },
    { id: 'st4', stepNumber: 4, title: 'Exámenes de Ingreso', description: 'Rendir Matemática y Física.', status: 'pending' },
  ]
};