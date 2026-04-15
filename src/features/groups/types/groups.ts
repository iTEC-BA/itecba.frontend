// ============================================================================
// SELECTORES DE INTERFAZ
// ============================================================================
export const CARRERAS_OPTIONS = [
  { value: 'sistemas', label: 'Ingeniería en Sistemas (K)' },
  { value: 'industrial', label: 'Ingeniería Industrial (I)' },
  { value: 'civil', label: 'Ingeniería Civil (O)' },
  { value: 'electronica', label: 'Ingeniería Electrónica (R)' },
  { value: 'electrica', label: 'Ingeniería Eléctrica (Q)' },
  { value: 'mecanica', label: 'Ingeniería Mecánica (S)' },
  { value: 'quimica', label: 'Ingeniería Química (V)' },
  { value: 'naval', label: 'Ingeniería Naval (U)' },
  { value: 'textil', label: 'Ingeniería Textil (W)' },
  { value: 'homogeneas', label: 'Ciencias Básicas / Homogéneas (Z)' },
  { value: 'ingreso', label: 'Seminario de Ingreso (E)' },
];

export const NIVEL_OPTIONS = [
  { value: '0', label: 'Nivel 0 (Ingreso)' },
  { value: '1', label: 'Nivel 1' },
  { value: '2', label: 'Nivel 2' },
  { value: '3', label: 'Nivel 3' },
  { value: '4', label: 'Nivel 4' },
  { value: '5', label: 'Nivel 5' },
  { value: '6', label: 'Electivas' },
];
// ============================================================================
// MATERIAS HOMOGÉNEAS (Compartidas por todas las ingenierías)
// ============================================================================
export const MATERIAS_HOMOGENEAS: Record<string, string[]> = {
  '1': [
    'Análisis Matemático I', 
    'Álgebra y Geometría Analítica', 
    'Física I', 
    'Química General', 
    'Ingeniería y Sociedad', 
    'Sistemas de Representación', 
    'Inglés I'
  ],
  '2': [
    'Análisis Matemático II', 
    'Física II', 
    'Probabilidad y Estadística', 
    'Inglés II'
  ]
};

// ============================================================================
// MATERIAS ESPECÍFICAS (Excluyendo las Homogéneas para evitar duplicados)
// ============================================================================
export const MATERIAS_POR_CARRERA: Record<string, Record<string, string[]>> = {
  
  ingreso: {
    '0': ['Matemática', 'Física', 'Módulo B', 'Seminario de Ingreso Universitario']
  },
  
  homogeneas: MATERIAS_HOMOGENEAS,

  sistemas: {
    '1': ['Lógica y Estructuras Discretas', 'Algoritmos y Estructuras de Datos', 'Arquitectura de Computadoras', 'Sistemas y Procesos de Negocio'],
    '2': ['Sintaxis y Semántica de los Lenguajes', 'Paradigmas de Programación', 'Sistemas Operativos', 'Análisis de Sistemas de Información', 'Economía'],
    '3': ['Bases de Datos', 'Desarrollo de Software', 'Comunicación de Datos', 'Análisis Numérico', 'Diseño de Sistemas de Información', 'Legislación'],
    '4': ['Ingeniería y Calidad de Software', 'Redes de Datos', 'Investigación Operativa', 'Simulación', 'Tecnologías para la Automatización', 'Administración de Sistemas de Información'],
    '5': ['Inteligencia Artificial', 'Ciencia de Datos', 'Sistemas de Gestión', 'Gestión Gerencial', 'Seguridad en los Sistemas de Información', 'Proyecto Final'],
  },

  mecanica: {
    '1': ['Ingeniería Mecánica I', 'Fundamentos de Informática'],
    '2': ['Materiales No Metálicos', 'Estabilidad I', 'Materiales Metálicos', 'Ing. Ambiental y Seg. Ind.', 'Ingeniería Mecánica II'],
    '3': ['Termodinámica', 'Mecánica Racional', 'Estabilidad II', 'Mediciones y Ensayos', 'Diseño Mecánico', 'Cálculo Avanzado', 'Ingeniería Mecánica III'],
    '4': ['Economía', 'Elementos de Máquinas', 'Tecnología del Calor', 'Metrología e Ing. de Calidad', 'Mecánica de los Fluidos', 'Electrotecnia y Máquinas Eléctricas', 'Electrónica y Sist. de Control', 'Estabilidad III'],
    '5': ['Mantenimiento', 'Máquinas Alt. y Turbomáquinas', 'Instalaciones Industriales', 'Organización Industrial', 'Legislación', 'Tecnología de Fabricación', 'Proyecto Final'],
  },

  electronica: {
    '1': ['Informática I', 'Diseño asistido por computadora'],
    '2': ['Informática II', 'Análisis de Señales y Sistemas', 'Física Electrónica', 'Teoría de los Circuitos I', 'Técnicas Digitales I', 'Dispositivos Electrónicos'],
    '3': ['Legislación', 'Electrónica Aplicada I', 'Medios de Enlace', 'Técnicas Digitales II', 'Medidas Electrónicas I', 'Teoría de los Circuitos II'],
    '4': ['Máquinas e Instalaciones Eléctricas', 'Sistemas de Comunicaciones', 'Electrónica Aplicada II', 'Seguridad, Higiene y Medio Ambiente', 'Técnicas Digitales III', 'Medidas Electrónicas II', 'Sistemas de Control'],
    '5': ['Electrónica Aplicada III', 'Tecnología Electrónica', 'Electrónica de Potencia', 'Organización Industrial', 'Economía', 'Proyecto Final'],
  },

  electrica: {
    '1': ['Integración Eléctrica I', 'Fundamentos de Informática'],
    '2': ['Electrotecnia I', 'Estabilidad', 'Mecánica Técnica', 'Integración Eléctrica II', 'Cálculo Numérico'],
    '3': ['Tecnología y Ensayos de Materiales Eléctricos', 'Instrumentos y Mediciones Eléctricas', 'Teoría de los Campos', 'Física III', 'Máquinas Eléctricas I', 'Electrotecnia II', 'Termodinámica', 'Fundamentos para Análisis de Señales'],
    '4': ['Economía', 'Electrónica I', 'Máquinas Eléctricas II', 'Seguridad, Riesgo Eléctrico y MA', 'Instalaciones Eléctricas y Luminotecnia', 'Control Automático', 'Máquinas Térmicas Hidráulicas y de Fluidos', 'Legislación'],
    '5': ['Electrónica II', 'Generación, Transmisión y Dist. de la E.E.', 'Sistemas de Potencia', 'Accionamientos y Controles Eléctricos', 'Organización y Administración de Empresas', 'Proyecto Final'],
  },

  civil: {
    '1': ['Ingeniería Civil I', 'Fundamentos de Informática'],
    '2': ['Estabilidad', 'Ingeniería Civil II', 'Tecnología de los Materiales'],
    '3': ['Resistencia de Materiales', 'Tecnología del Hormigón', 'Tecnología de la Construcción', 'Geotopografía', 'Hidráulica General y Aplicada', 'Instalaciones Eléctricas y Acústicas', 'Instalaciones Termomecánicas', 'Economía', 'Ingeniería Legal'],
    '4': ['Cálculo Avanzado', 'Geotecnia', 'Instalaciones Sanitarias y de Gas', 'Diseño Arquitectónico, Planeamiento y Urbanismo', 'Análisis Estructural I', 'Estructuras de Hormigón', 'Hidrología y Obras Hidráulicas', 'Vías de Comunicación I'],
    '5': ['Construcciones Metálicas y de Madera', 'Cimentaciones', 'Ingeniería Sanitaria', 'Organización y Conducción de Obras', 'Análisis Estructural II', 'Vías de Comunicación II'],
    '6': ['Proyecto Final', 'Gestión Ambiental y Desarrollo Sustentable'],
  },

  industrial: {
    '1': ['Pensamiento Sistémico', 'Informática I'],
    '2': ['Administración General', 'Ciencia de Materiales', 'Economía General', 'Informática II'],
    '3': ['Costos y Presupuestos', 'Estudio del Trabajo', 'Comercialización', 'Termodinámica y Máquinas Térmicas', 'Estática y Resistencia de Materiales', 'Mecánica de los Fluidos', 'Economía de la Empresa', 'Electrotecnia y Máquinas Eléctricas', 'Análisis Numérico y Cálculo Avanzado', 'Seguridad, Higiene e Ing. Ambiental'],
    '4': ['Evaluación de Proyectos', 'Instalaciones Industriales', 'Investigación Operativa', 'Planificación y Control de la Producción', 'Ingeniería en Calidad', 'Procesos Industriales', 'Mecánica y Mecanismos', 'Legislación'],
    '5': ['Control de Gestión', 'Manejo de Materiales y Distribución en Planta', 'Diseño de Producto', 'Comercio Exterior', 'Mantenimiento', 'Relaciones Industriales', 'Proyecto Final'],
  },

  quimica: {
    '1': ['Introducción a la Ingeniería Química', 'Fundamentos de Informática'],
    '2': ['Introducción a Equipos y Procesos', 'Química Inorgánica', 'Química Orgánica'],
    '3': ['Matemática Superior Aplicada', 'Balance de Masa y Energía', 'Economía', 'Química Aplicada', 'Termodinámica', 'Ciencia de los materiales', 'Química Analítica', 'Microbiología y Química Biológica', 'Fisicoquímica'],
    '4': ['Legislación', 'Fenómenos de Transporte', 'Diseño, Simulación y Opt. de Procesos', 'Operaciones Unitarias I', 'Tecnología de la Energía Térmica', 'Organización Industrial', 'Ingeniería de Reacciones Químicas', 'Operaciones Unitarias II'],
    '5': ['Proyecto Final', 'Mecánica Industrial', 'Procesos Biotecnológicos', 'Control Automático de Procesos', 'Máquinas e Instalaciones Eléctricas', 'Ingeniería Ambiental', 'Calidad y Control Estadístico de Procesos', 'Higiene y Seguridad en el Trabajo'],
  },

  naval: {
    '1': ['Introducción a la Ing. Naval', 'Fundamentos de Informática'],
    '2': ['Física III', 'Análisis Estructural I', 'Dibujo Naval', 'Legislación'],
    '3': ['Análisis Estructural II', 'Termodinámica', 'Mecánica Racional', 'Teoría del Buque I', 'Matemática Aplicada a la Ingeniería', 'Electrotecnia y Máquinas Eléctricas', 'Mecánica de los Fluidos'],
    '4': ['Teoría del Buque II', 'Alistamiento de Buques', 'Análisis Estructural III', 'Máquinas Alternativas y Turbomáquinas', 'Materiales Navales', 'Construcción Naval', 'Actividad Naviera'],
    '5': ['Plantas Eléctricas Navales', 'Plantas Propulsoras Navales', 'Cálculo de Estructuras de Buques', 'Mecánica Aplicada a las Máquinas', 'Proyecto de Buques', 'Organización Industrial', 'Soldadura', 'Análisis por Elementos Finitos'],
    '6': ['Proyecto Final', 'Embarcaciones Veloces', 'Seguridad, Higiene e Ingeniería Ambiental', 'Procedimientos de Astilleros', 'Práctica Profesional Supervisada'],
  },

  textil: {
    '1': ['Química Orgánica', 'Introducción a la Industria Textil'],
    '2': ['Fibras Textiles', 'Estabilidad', 'Química Analítica', 'Diseño I', 'Termodinámica'],
    '3': ['Química Textil', 'Hilandería de Lana y Fibras Largas', 'Diseño II', 'Hilandería de Algodón y F. Cortas', 'Legislación', 'Electrotecnia', 'Telas no tejidas', 'Informática Textil'],
    '4': ['Tejeduría de Calada y sus Ligamentos', 'Tejeduría de Punto y sus Ligamentos', 'Tintorería, Estampado, Apresto', 'Diseño III', 'Economía', 'Gestión de Calidad', 'Seguridad e Higiene Industrial', 'Administración y Marketing'],
    '5': ['Diseño de Tejidos de Calada', 'Diseño de Tejidos de Punto', 'Confección', 'Proyecto e Ingeniería de Planta', 'Diseño IV'],
  }
};