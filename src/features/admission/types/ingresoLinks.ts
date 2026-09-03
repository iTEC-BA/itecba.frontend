export interface ActionLink { id: string; title: string; subtitle: string; url: string; }
export interface MainLink { id: string; title: string; subtitle: string; url: string; iconType: 'whatsapp' | 'instagram' | 'youtube' | 'sheets'; colorClass: string; hoverClass: string; }
export interface MaterialLink { id: string; title: string; subtitle: string; url: string; emoji: string; }
export interface SiuLink { id: string; title: string; subtitle: string; url: string; }
export interface AdmissionStep { id: string; stepNumber: number; title: string; description: string; status: 'done' | 'current' | 'pending'; }
export interface AdmissionModality { id: string; title: string; shortDesc: string; content: string[]; }

export interface IngresoDataProps {
  actions: ActionLink[];
  mainLinks: MainLink[];
  materials: MaterialLink[];
  siuLinks: SiuLink[];
  steps: AdmissionStep[];
  modalities: AdmissionModality[];
}

export const INGRESO_DATA: IngresoDataProps = {
  actions: [
    { id: 'act1', title: 'SIU Preinscripción', subtitle: 'Anotate por primera vez', url: 'https://guarani.frba.utn.edu.ar/preinscripcion/utn/acceso/' },
    { id: 'act2', title: 'SIU Aspirantes', subtitle: 'Para alumnos de años anteriores', url: 'https://guarani.frba.utn.edu.ar/autogestion/aspirantes/' }
  ],
  mainLinks: [
    { id: 'ml1', title: 'WhatsApp', subtitle: 'Grupo Oficial', url: 'https://chat.whatsapp.com/FwTft3cZZ6g5Re8JccjGV2?mode=gi_t', iconType: 'whatsapp', colorClass: 'text-emerald-400', hoverClass: 'hover:border-emerald-500' },
    { id: 'ml2', title: 'Instagram', subtitle: '@itecba', url: 'https://www.instagram.com/itecba', iconType: 'instagram', colorClass: 'text-pink-400', hoverClass: 'hover:border-pink-500' },
    { id: 'ml3', title: 'YouTube', subtitle: 'Clases Grabadas', url: 'https://youtube.com/@itecba', iconType: 'youtube', colorClass: 'text-red-400', hoverClass: 'hover:border-red-500' }
  ],
  materials: [
    { id: 'mat1', title: 'BiblioTEC', subtitle: 'Todo el material de ingreso', url: 'https://bit.ly/biblioTEC', emoji: '📚' },
  ],
  siuLinks: [
    { id: 'siu2', title: 'Campus Virtual', subtitle: 'Aulas virtuales UTN', url: 'https://aulasvirtuales.frba.utn.edu.ar/' }
  ],
  steps: [
    { id: 'st1', stepNumber: 1, title: 'Preinscripción Online', description: 'Completar el formulario en el SIU y elegir turno.', status: 'done' },
    { id: 'st2', stepNumber: 2, title: 'Documentación', description: 'Presentar documentación requerida.', status: 'done' },
    { id: 'st3', stepNumber: 3, title: 'Modalidad de Ingreso', description: 'Elegir y cursar una de las modalidades disponibles.', status: 'current' },
    { id: 'st4', stepNumber: 4, title: 'TIVU', description: 'Taller de Inicio a la Vida Universitaria.', status: 'pending' },
  ],
  modalities: [
    { 
      id: 'mod1', 
      title: 'Instancia Evaluación Diagnóstica', 
      shortDesc: 'Octubre a Diciembre - Actividades Virtuales', 
      content: [
        'Las actividades virtuales de Matemática y Física son preparatorias para la evaluación y deben ser cumplimentadas.',
        'El objetivo es que los aspirantes realicen una autoevaluación de sus conocimientos.',
        'No son clases tradicionales, son actividades asincrónicas en el Campus Virtual.',
        'Quienes no aprueben o no se presenten a la Evaluación Diagnóstica podrán anotarse al Curso de Verano.'
      ]
    },
    { 
      id: 'mod2', 
      title: 'Seminario Universitario Intensivo', 
      shortDesc: 'Febrero a Marzo - Modalidad Presencial', 
      content: [
        'Se desarrolla de forma presencial en la Sede Campus (Mozart 2300).',
        'Materias a cursar: Matemática y Física (tres encuentros semanales).',
        'Taller de Inicio a la Vida Universitaria (TIVU): Se cursa luego de aprobar las materias exactas.',
        'Si no se logra aprobar, habrá dos instancias de Evaluación Diagnóstica Libre.'
      ]
    },
    { 
      id: 'mod3', 
      title: 'Expo Carreras y Reglas de Comunidad', 
      shortDesc: 'Información general y normas', 
      content: [
        'Expo Carreras: Jornada para conocer de cerca la propuesta académica. Presencial en Sede Campus. Requiere inscripción previa.',
        'Normas de la Comunidad iTEC: No Spam, No contenido obsceno, Respeto a todos, No salirse de la temática.'
      ]
    }
  ]
};
