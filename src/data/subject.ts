// ============================================================================
// BASE DE DATOS HARDCODEADA - iTEC BA
// Combina especialidades (specialties.ts) + materias reales (materias_rows.sql)
// + correlatividades (carreras.ts), cruzadas por nombre de materia.
//
// subject_id = codigo real de la materia en la base (columna 'codigo' de la
// tabla materias) cuando existe. Si una materia del plan de correlatividades
// no tiene codigo real cargado en la base, se usa un id sintetico estable
// con el patron '<carrera>_<nombre_normalizado>' (sin tildes, minusculas,
// espacios reemplazados por '_'). Estos casos se listan en DATA_ISSUES.
// ============================================================================

export interface Specialty {
  code: string;
  name: string;
  carreraValue: string;
}

export interface Subject {
  /** id estable para usar en toda la app (codigo real o sintetico) */
  id: string;
  /** nombre oficial de la materia */
  name: string;
  /** codigo real en la base de datos (columna materias.codigo). null si no existe */
  codigo: string | null;
  /** nivel/año del plan (1 a 6; 6 = electivas en algunas carreras) */
  level: number;
  /** sigla corta usada en el plan de estudios (ej. AM1, F2) */
  sigla: string;
  /** ids de materias que hay que tener CURSADAS (regularizadas) */
  reqCursada: string[];
  /** ids de materias que hay que tener APROBADAS (finales rendidos) */
  reqAprobada: string[];
}

export interface SpecialtyUI extends Specialty {
  colorClass: string;
}

export const ESPECIALIDADES: SpecialtyUI[] = [
  { code: 'E', name: 'INGRESO', carreraValue: 'ingreso', colorClass: 'border-green-500/30 hover:border-green-500 group-hover:text-green-400' },
  { code: 'I', name: 'INDUSTRIAL', carreraValue: 'industrial', colorClass: 'border-yellow-500/30 hover:border-yellow-500 group-hover:text-yellow-400' },
  { code: 'K', name: 'SISTEMAS', carreraValue: 'sistemas', colorClass: 'border-blue-500/30 hover:border-blue-500 group-hover:text-blue-400' },
  { code: 'O', name: 'CIVIL', carreraValue: 'civil', colorClass: 'border-orange-500/30 hover:border-orange-500 group-hover:text-orange-400' },
  { code: 'Q', name: 'ELECTRICA', carreraValue: 'electrica', colorClass: 'border-amber-500/30 hover:border-amber-500 group-hover:text-amber-400' },
  { code: 'R', name: 'ELECTRONICA', carreraValue: 'electronica', colorClass: 'border-red-500/30 hover:border-red-500 group-hover:text-red-400' },
  { code: 'S', name: 'MECANICA', carreraValue: 'mecanica', colorClass: 'border-gray-400/30 hover:border-gray-400 group-hover:text-gray-300' },
  { code: 'U', name: 'NAVAL', carreraValue: 'naval', colorClass: 'border-cyan-500/30 hover:border-cyan-500 group-hover:text-cyan-400' },
  { code: 'V', name: 'QUIMICA', carreraValue: 'quimica', colorClass: 'border-purple-500/30 hover:border-purple-500 group-hover:text-purple-400' },
  { code: 'W', name: 'TEXTIL', carreraValue: 'textil', colorClass: 'border-pink-500/30 hover:border-pink-500 group-hover:text-pink-400' },
];

// ---------------------------------------------------------------------------
// SISTEMAS
// ---------------------------------------------------------------------------
export const SISTEMAS: Subject[] = [
  { id: '082021', name: 'Algorítmos y Estructuras de Datos', codigo: '082021', level: 1, sigla: 'AyED', reqCursada: [], reqAprobada: [] },
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '082022', name: 'Arquitectura de Computadores', codigo: '082022', level: 1, sigla: 'AdC', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 1, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '232010', name: 'Lógica y Estructuras Discretas', codigo: '232010', level: 1, sigla: 'LyED', reqCursada: [], reqAprobada: [] },
  { id: '232011', name: 'Sistemas y Procesos de Negocio', codigo: '232011', level: 1, sigla: 'SyPN', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '082024', name: 'Análisis de Sistemas de Información', codigo: '082024', level: 2, sigla: 'ASI', reqCursada: ['082021', '232011'], reqAprobada: [] },
  { id: '950309', name: 'Economía', codigo: '950309', level: 2, sigla: 'ECO', reqCursada: [], reqAprobada: ['950701', '950702'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 2, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '951603', name: 'Inglés Técnico Nivel II', codigo: '951603', level: 2, sigla: 'ING2', reqCursada: ['951602'], reqAprobada: [] },
  { id: '082026', name: 'Paradigmas de Programación', codigo: '082026', level: 2, sigla: 'PdP', reqCursada: ['082021', '232010'], reqAprobada: [] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '082025', name: 'Sintaxis y Semántica de los Lenguajes', codigo: '082025', level: 2, sigla: 'SySL', reqCursada: ['082021', '232010'], reqAprobada: [] },
  { id: '082027', name: 'Sistemas Operativos', codigo: '082027', level: 2, sigla: 'SSOO', reqCursada: ['082022'], reqAprobada: [] },
  { id: '232033', name: 'Análisis Numérico', codigo: '232033', level: 3, sigla: 'AN', reqCursada: ['950703'], reqAprobada: ['950701', '950702'] },
  { id: '232030', name: 'Bases de Daos', codigo: '232030', level: 3, sigla: 'BD', reqCursada: ['082024', '082025'], reqAprobada: ['082021', '232010'] },
  { id: '232032', name: 'Comunicación de Datos', codigo: '232032', level: 3, sigla: 'CD', reqCursada: [], reqAprobada: ['082022', '950605'] },
  { id: '232031', name: 'Desarrollo del Software', codigo: '232031', level: 3, sigla: 'DdS', reqCursada: ['082024', '082026'], reqAprobada: ['082021', '232010'] },
  { id: '232034', name: 'Diseño de Sistemas de Información', codigo: '232034', level: 3, sigla: 'DSI', reqCursada: ['082024', '082026'], reqAprobada: ['082021', '232011', '951602'] },
  { id: '950310', name: 'Legislación', codigo: '950310', level: 3, sigla: 'LEG', reqCursada: ['951604'], reqAprobada: [] },
  { id: '232045', name: 'Administración de Sistemas de Información', codigo: '232045', level: 4, sigla: 'AdmSI', reqCursada: ['232034', '950309'], reqAprobada: ['082024'] },
  { id: '232040', name: 'Ingeniería y Calidad de Software', codigo: '232040', level: 4, sigla: 'IyCS', reqCursada: ['082025', '082026', '232030', '232031', '232034'], reqAprobada: [] },
  { id: '232042', name: 'Investigación Operativa', codigo: '232042', level: 4, sigla: 'IO', reqCursada: ['232033', '950704'], reqAprobada: [] },
  { id: '232041', name: 'Redes de Datos', codigo: '232041', level: 4, sigla: 'RD', reqCursada: ['082027', '232032'], reqAprobada: [] },
  { id: '232043', name: 'Simulación', codigo: '232043', level: 4, sigla: 'SIM', reqCursada: ['950703', '950704'], reqAprobada: [] },
  { id: '232044', name: 'Tecnologías para la Automatización', codigo: '232044', level: 4, sigla: 'TpA', reqCursada: ['232033', '950606'], reqAprobada: ['950703'] },
  { id: '082039', name: 'Administración Gerencial', codigo: '082039', level: 5, sigla: 'GG', reqCursada: ['232045', '950310'], reqAprobada: ['950309'] },
  { id: '232050', name: 'Ciencia de Datos', codigo: '232050', level: 5, sigla: 'CdD', reqCursada: ['232030', '232043', '950704'], reqAprobada: [] },
  { id: '082040', name: 'Inteligencia Artificial', codigo: '082040', level: 5, sigla: 'IA', reqCursada: ['232043'], reqAprobada: ['232033', '950704'] },
  { id: '082037', name: 'Proyecto Final', codigo: '082037', level: 5, sigla: 'PF', reqCursada: ['232040', '232041', '232045'], reqAprobada: ['232031', '232034', '951603'] },
  { id: 'sistemas_seguridad_en_los_sistemas_de_informacion', name: 'Seguridad en los Sistemas de Información', codigo: null, level: 5, sigla: 'SSI', reqCursada: ['232041', '232045'], reqAprobada: ['232031', '232032'] },
  { id: '082035', name: 'Sistemas de Gestión', codigo: '082035', level: 5, sigla: 'SG', reqCursada: ['232042', '950309'], reqAprobada: ['232034'] },
];

// ---------------------------------------------------------------------------
// MECANICA
// ---------------------------------------------------------------------------
export const MECANICA: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '940861', name: 'Fundamentos de Informática', codigo: '940861', level: 1, sigla: 'FI', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '940820', name: 'Ingeniería Mecánica I', codigo: '940820', level: 1, sigla: 'IM1', reqCursada: [], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 1, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '951407', name: 'Química General', codigo: '951407', level: 1, sigla: 'QG', reqCursada: [], reqAprobada: [] },
  { id: '951601', name: 'Sistemas de Representación', codigo: '951601', level: 1, sigla: 'SR', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '230821', name: 'Estabilidad I', codigo: '230821', level: 2, sigla: 'EST1', reqCursada: ['950605', '950701', '950702'], reqAprobada: [] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: [] },
  { id: '940899', name: 'Ingeniería Ambiental y Seguridad Industrial', codigo: '940899', level: 2, sigla: 'IASI', reqCursada: ['950605', '951407'], reqAprobada: [] },
  { id: '940825', name: 'Ingeniería Mecánica II', codigo: '940825', level: 2, sigla: 'IM2', reqCursada: ['940820', '950605'], reqAprobada: [] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 2, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '230822', name: 'Materiales Metálicos', codigo: '230822', level: 2, sigla: 'MM', reqCursada: ['950701', '951407'], reqAprobada: [] },
  { id: '230820', name: 'Materiales No Metálicos', codigo: '230820', level: 2, sigla: 'MNM', reqCursada: ['950605', '951407'], reqAprobada: [] },
  { id: '940848', name: 'Cálculo Avanzado', codigo: '940848', level: 3, sigla: 'CA', reqCursada: ['950703'], reqAprobada: ['940861', '950701', '950702'] },
  { id: '230832', name: 'Diseño Mecánico', codigo: '230832', level: 3, sigla: 'DM', reqCursada: ['230820', '230821', '230822'], reqAprobada: ['940820', '940861', '950605', '951601'] },
  { id: '230830', name: 'Estabilidad II', codigo: '230830', level: 3, sigla: 'EST2', reqCursada: ['230821', '950703'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '940832', name: 'Ingeniería Mecánica III', codigo: '940832', level: 3, sigla: 'IM3', reqCursada: ['230820', '230822', '940825'], reqAprobada: ['940820', '950605', '950702', '951407'] },
  { id: '951603', name: 'Inglés Técnico Nivel II', codigo: '951603', level: 3, sigla: 'ING2', reqCursada: [], reqAprobada: ['951602'] },
  { id: '940897', name: 'Mecánica Racional', codigo: '940897', level: 3, sigla: 'MR', reqCursada: ['230821', '950703'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '230831', name: 'Mediciones y Ensayos', codigo: '230831', level: 3, sigla: 'MyE', reqCursada: ['230821', '230822', '950606'], reqAprobada: ['950605', '950702'] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 3, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '940898', name: 'Termodinámica', codigo: '940898', level: 3, sigla: 'TERM', reqCursada: ['950606', '950703'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '950309', name: 'Economía', codigo: '950309', level: 4, sigla: 'ECO', reqCursada: ['940825'], reqAprobada: ['951604'] },
  { id: '940834', name: 'Electrotecnia y Máquinas Eléctricas', codigo: '940834', level: 4, sigla: 'EME', reqCursada: ['950606', '950703'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '940835', name: 'Electrónica y Sistemas de Control', codigo: '940835', level: 4, sigla: 'ESC', reqCursada: ['940848', '950606', '950703'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '940836', name: 'Elementos de Máquinas', codigo: '940836', level: 4, sigla: 'EM', reqCursada: ['230820', '230822', '230830', '940832', '940897'], reqAprobada: ['230821', '950703', '951407'] },
  { id: '230840', name: 'Estabilidad III', codigo: '230840', level: 4, sigla: 'EST3', reqCursada: ['230830'], reqAprobada: ['230821', '950605', '950701', '950702'] },
  { id: '940833', name: 'Mecánica de los Fluidos', codigo: '940833', level: 4, sigla: 'MF', reqCursada: ['940898'], reqAprobada: ['950606', '950703'] },
  { id: '940841', name: 'Metrología e Ingeniería de Calidad', codigo: '940841', level: 4, sigla: 'MIC', reqCursada: ['230831', '950704'], reqAprobada: ['230822', '950606', '950701'] },
  { id: '950838', name: 'Tecnología del Calor', codigo: '950838', level: 4, sigla: 'TC', reqCursada: ['940898'], reqAprobada: ['950606', '950703'] },
  { id: '940843', name: 'Instalaciones Industriales', codigo: '940843', level: 5, sigla: 'II', reqCursada: ['230831', '940833', '940834', '940835', '950838'], reqAprobada: ['230821', '940898', '940899'] },
  { id: '950310', name: 'Legislación', codigo: '950310', level: 5, sigla: 'LEG', reqCursada: ['940825', '951604'], reqAprobada: [] },
  { id: '940840', name: 'Mantenimiento', codigo: '940840', level: 5, sigla: 'MANT', reqCursada: ['230822', '230830', '230831', '940836', '940897', '950309', '950606'], reqAprobada: [] },
  { id: '940839', name: 'Máquinas Alternativas y Turbomáquinas', codigo: '940839', level: 5, sigla: 'MAT', reqCursada: ['950838'], reqAprobada: ['940898', '950606'] },
  { id: '940831', name: 'Organización Industrial', codigo: '940831', level: 5, sigla: 'OI', reqCursada: ['940825'], reqAprobada: ['950309'] },
  { id: '940894', name: 'Proyecto Final', codigo: '940894', level: 5, sigla: 'PF', reqCursada: ['940834', '940835', '940836', '940841'], reqAprobada: ['230830', '230831', '230832', '940897'] },
  { id: '230850', name: 'Tecnología de Fabricación', codigo: '230850', level: 5, sigla: 'TF', reqCursada: ['940836', '940841'], reqAprobada: ['230820', '230821', '230822', '230832'] },
];

// ---------------------------------------------------------------------------
// ELECTRONICA
// ---------------------------------------------------------------------------
export const ELECTRONICA: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '230410', name: 'Diseño Asistido Por Computadora', codigo: '230410', level: 1, sigla: 'DAC', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '950452', name: 'Informática I', codigo: '950452', level: 1, sigla: 'INF1', reqCursada: [], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 1, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 1, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '951407', name: 'Química General', codigo: '951407', level: 1, sigla: 'QG', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '950454', name: 'Análisis de Señales y Sistemas', codigo: '950454', level: 2, sigla: 'ASS', reqCursada: ['950703'], reqAprobada: ['950701', '950702'] },
  { id: '950426', name: 'Dispositivos Electrónicos', codigo: '950426', level: 2, sigla: 'DE', reqCursada: ['950452', '950702', '951407'], reqAprobada: [] },
  { id: '950447', name: 'Física Electrónica', codigo: '950447', level: 2, sigla: 'FE', reqCursada: ['950606'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: [] },
  { id: '950453', name: 'Informática II', codigo: '950453', level: 2, sigla: 'INF2', reqCursada: ['950452', '950701', '950702'], reqAprobada: [] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '950424', name: 'Teoría de los Circuitos I', codigo: '950424', level: 2, sigla: 'TC1', reqCursada: ['950606', '950703'], reqAprobada: ['950605', '950702'] },
  { id: '950455', name: 'Técnicas Digitales I', codigo: '950455', level: 2, sigla: 'TD1', reqCursada: ['950452'], reqAprobada: ['950701'] },
  { id: '950427', name: 'Electrónica Aplicada I', codigo: '950427', level: 3, sigla: 'EA1', reqCursada: ['950606', '951407'], reqAprobada: ['950452', '950605', '950702'] },
  { id: '951603', name: 'Inglés Técnico Nivel II', codigo: '951603', level: 3, sigla: 'ING2', reqCursada: [], reqAprobada: ['951602'] },
  { id: '950310', name: 'Legislación', codigo: '950310', level: 3, sigla: 'LEG', reqCursada: ['950453'], reqAprobada: ['951604'] },
  { id: '950430', name: 'Medidas Electrónicas I', codigo: '950430', level: 3, sigla: 'MED1', reqCursada: ['950424', '950427', '950454', '950455'], reqAprobada: ['950606', '950703', '951407'] },
  { id: '950456', name: 'Medios de Enlace', codigo: '950456', level: 3, sigla: 'ME', reqCursada: ['950606', '950703'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '950431', name: 'Teoría de los Circuitos II', codigo: '950431', level: 3, sigla: 'TC2', reqCursada: ['950424', '950454'], reqAprobada: ['950606', '950703'] },
  { id: '950429', name: 'Técnicas Digitales II', codigo: '950429', level: 3, sigla: 'TD2', reqCursada: ['950427', '950453', '950455'], reqAprobada: ['950606', '951407'] },
  { id: '950434', name: 'Electrónica Aplicada II', codigo: '950434', level: 4, sigla: 'EA2', reqCursada: ['950424', '950426', '950427', '950447', '950454'], reqAprobada: ['950606', '950703', '951602'] },
  { id: '950436', name: 'Medidas Electrónicas II', codigo: '950436', level: 4, sigla: 'MED2', reqCursada: ['950429', '950430', '950433', '950434'], reqAprobada: ['230410', '950424', '950427', '950447', '950455', '951603'] },
  { id: '950432', name: 'Máquinas e Instalaciones Eléctricas', codigo: '950432', level: 4, sigla: 'MIE', reqCursada: ['950424', '950454'], reqAprobada: ['950606', '950703'] },
  { id: '950448', name: 'Seguridad, Higiene y Medio Ambiente', codigo: '950448', level: 4, sigla: 'SHMA', reqCursada: [], reqAprobada: ['951407', '951604'] },
  { id: '950433', name: 'Sistemas de Comunicaciones', codigo: '950433', level: 4, sigla: 'SC', reqCursada: ['950427', '950454', '950456', '950704'], reqAprobada: ['950606', '950703'] },
  { id: '950437', name: 'Sistemas de Control', codigo: '950437', level: 4, sigla: 'SCON', reqCursada: ['950431', '950432'], reqAprobada: ['950424', '950447'] },
  { id: '950435', name: 'Técnicas Digitales III', codigo: '950435', level: 4, sigla: 'TD3', reqCursada: ['950429'], reqAprobada: ['950427', '950453', '950455'] },
  { id: '950309', name: 'Economía', codigo: '950309', level: 5, sigla: 'ECO', reqCursada: ['950453'], reqAprobada: ['951604'] },
  { id: '950438', name: 'Electrónica Aplicada III', codigo: '950438', level: 5, sigla: 'EA3', reqCursada: ['950431', '950433', '950434'], reqAprobada: ['950424', '950427', '950447'] },
  { id: '950440', name: 'Electrónica de Potencia', codigo: '950440', level: 5, sigla: 'EP', reqCursada: ['950430', '950432', '950434'], reqAprobada: ['950427', '950447', '950455'] },
  { id: '950449', name: 'Organización Industrial', codigo: '950449', level: 5, sigla: 'OI', reqCursada: ['950310'], reqAprobada: [] },
  { id: '950459', name: 'Proyecto Final', codigo: '950459', level: 5, sigla: 'PF', reqCursada: ['950435', '950436', '950438'], reqAprobada: ['950429', '950430', '950432', '950434'] },
  { id: '950439', name: 'Tecnología Electrónica', codigo: '950439', level: 5, sigla: 'TE', reqCursada: ['950430'], reqAprobada: ['950427', '950447', '950455'] },
];

// ---------------------------------------------------------------------------
// ELECTRICA
// ---------------------------------------------------------------------------
export const ELECTRICA: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '950599', name: 'Fundamentos de Informática', codigo: '950599', level: 1, sigla: 'FI', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 1, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '950520', name: 'Integración Eléctrica I', codigo: '950520', level: 1, sigla: 'IE1', reqCursada: [], reqAprobada: [] },
  { id: '951407', name: 'Química General', codigo: '951407', level: 1, sigla: 'QG', reqCursada: [], reqAprobada: [] },
  { id: '951601', name: 'Sistemas de Representación', codigo: '951601', level: 1, sigla: 'SR', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '950598', name: 'Cálculo Numérico', codigo: '950598', level: 2, sigla: 'CN', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '950521', name: 'Electrotecnia I', codigo: '950521', level: 2, sigla: 'ELEC1', reqCursada: ['950605', '950701', '950702'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '950524', name: 'Estabilidad', codigo: '950524', level: 2, sigla: 'EST', reqCursada: ['950605', '950701'], reqAprobada: ['950605', '950701'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: ['950605', '950702'] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 2, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '950523', name: 'Integración Eléctrica II', codigo: '950523', level: 2, sigla: 'IE2', reqCursada: ['950520', '950605', '950702'], reqAprobada: ['950520', '950605', '950702'] },
  { id: '950527', name: 'Mecánica Técnica', codigo: '950527', level: 2, sigla: 'MT', reqCursada: ['950605', '950702'], reqAprobada: ['950605', '950701'] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '950529', name: 'Electrotecnia II', codigo: '950529', level: 3, sigla: 'ELEC2', reqCursada: ['950521', '950606', '950703'], reqAprobada: ['950521', '950605', '950606', '950701', '950702', '950703'] },
  { id: '950522', name: 'Fundamentos para el Análisis de Señales', codigo: '950522', level: 3, sigla: 'FAS', reqCursada: ['950598', '950703'], reqAprobada: ['950598', '950701', '950702', '950703'] },
  { id: '950531', name: 'Física III', codigo: '950531', level: 3, sigla: 'F3', reqCursada: ['950606', '950703'], reqAprobada: ['950605', '950606', '950701', '950702', '950703'] },
  { id: '950525', name: 'Instrumentos y Mediciones Eléctricas', codigo: '950525', level: 3, sigla: 'IME', reqCursada: ['950521', '950523', '950704'], reqAprobada: ['950520', '950521', '950523', '950605', '950701', '950702', '950704', '951601', '951604'] },
  { id: '950528', name: 'Máquina Eléctricas I', codigo: '950528', level: 3, sigla: 'ME1', reqCursada: ['950521', '950606', '950703'], reqAprobada: ['950520', '950521', '950599', '950605', '950606', '950702', '950703'] },
  { id: '950538', name: 'Tecnologías y Ensayos de Materiales Eléctricos', codigo: '950538', level: 3, sigla: 'TEME', reqCursada: ['950606', '951407'], reqAprobada: ['950605', '950606', '950702', '951407'] },
  { id: '950526', name: 'Teoría de los Campos', codigo: '950526', level: 3, sigla: 'TC', reqCursada: ['950606', '950703'], reqAprobada: ['950605', '950606', '950701', '950702', '950703'] },
  { id: '950530', name: 'Termodinámica', codigo: '950530', level: 3, sigla: 'TERM', reqCursada: ['950606', '950703'], reqAprobada: ['950605', '950606', '950701', '950702', '950703'] },
  { id: '950536', name: 'Control Automático', codigo: '950536', level: 4, sigla: 'CA', reqCursada: ['950522', '950529'], reqAprobada: ['950521', '950522', '950529', '950703'] },
  { id: '950309', name: 'Economía', codigo: '950309', level: 4, sigla: 'ECO', reqCursada: ['950523'], reqAprobada: ['951604'] },
  { id: '950597', name: 'Electrónica I', codigo: '950597', level: 4, sigla: 'EL1', reqCursada: ['950521'], reqAprobada: ['950521', '950605', '950702'] },
  { id: '951603', name: 'Inglés Técnico Nivel II', codigo: '951603', level: 4, sigla: 'ING2', reqCursada: [], reqAprobada: ['951602'] },
  { id: '950535', name: 'Instalaciones Eléctricas y Luminotecnia', codigo: '950535', level: 4, sigla: 'IEL', reqCursada: ['950528', '950529', '950538'], reqAprobada: ['950521', '950523', '950606', '950703', '951407', '951602'] },
  { id: '950310', name: 'Legislación', codigo: '950310', level: 4, sigla: 'LEG', reqCursada: ['950523'], reqAprobada: ['951604'] },
  { id: '950533', name: 'Máquina Eléctricas II', codigo: '950533', level: 4, sigla: 'ME2', reqCursada: ['950526', '950528', '950529', '950538'], reqAprobada: ['950521', '950523', '950525', '950526', '950528', '950529', '950538', '950606', '950703', '950704', '951407'] },
  { id: '950537', name: 'Máquinas Térmicas, Hidráulicas y de Fluido', codigo: '950537', level: 4, sigla: 'MTH', reqCursada: ['950524', '950527', '950530'], reqAprobada: ['950606', '950703'] },
  { id: '950534', name: 'Seguridad, Riesgo Eléctrico y Medio Ambiente', codigo: '950534', level: 4, sigla: 'SREMA', reqCursada: ['950521', '950526'], reqAprobada: ['950605', '950606', '950701', '950702', '950703'] },
  { id: '950561', name: 'Accionamientos y Controles Eléctricos', codigo: '950561', level: 5, sigla: 'ACE', reqCursada: ['950533', '950536', '950597'], reqAprobada: ['950521', '950522', '950528', '950529', '950538'] },
  { id: '950539', name: 'Electrónica II', codigo: '950539', level: 5, sigla: 'EL2', reqCursada: ['950597'], reqAprobada: ['950521'] },
  { id: '950596', name: 'Generación, Transmisión y Distribución de la Energía Eléctrica', codigo: '950596', level: 5, sigla: 'GTD', reqCursada: ['950531', '950533', '950537'], reqAprobada: ['950524', '950527', '950528', '950529', '950530', '950538'] },
  { id: '950595', name: 'Organización y Administración de Empresas', codigo: '950595', level: 5, sigla: 'OAE', reqCursada: ['950309', '950310'], reqAprobada: ['950523'] },
  { id: '950594', name: 'Proyecto Final', codigo: '950594', level: 5, sigla: 'PF', reqCursada: ['950533', '950535', '950536'], reqAprobada: ['950522', '950528', '950529', '950538', '951603'] },
  { id: '950541', name: 'Sistemas de Potencia', codigo: '950541', level: 5, sigla: 'SP', reqCursada: ['950533'], reqAprobada: ['950528', '950529', '950538'] },
];

// ---------------------------------------------------------------------------
// CIVIL
// ---------------------------------------------------------------------------
export const CIVIL: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '950299', name: 'Fundamentos de Informática', codigo: '950299', level: 1, sigla: 'FI', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '950220', name: 'Ingeniería Civil I', codigo: '950220', level: 1, sigla: 'IC1', reqCursada: [], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 1, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '951407', name: 'Química General', codigo: '951407', level: 1, sigla: 'QG', reqCursada: [], reqAprobada: [] },
  { id: '951601', name: 'Sistemas de Representación', codigo: '951601', level: 1, sigla: 'SR', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '950221', name: 'Estabílidad', codigo: '950221', level: 2, sigla: 'EST', reqCursada: ['950299', '950605', '951601', '951604'], reqAprobada: ['950701', '950702'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: ['950702'] },
  { id: '950222', name: 'Ingeniería Civil II', codigo: '950222', level: 2, sigla: 'IC2', reqCursada: ['950220', '950299', '950702', '951601'], reqAprobada: [] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 2, sigla: 'ING1', reqCursada: ['951604'], reqAprobada: [] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701'], reqAprobada: [] },
  { id: '950297', name: 'Tecnología de los Materiales', codigo: '950297', level: 2, sigla: 'TM', reqCursada: ['950605', '951407', '951601'], reqAprobada: [] },
  { id: '950309', name: 'Economía', codigo: '950309', level: 3, sigla: 'ECO', reqCursada: ['950704', '951602'], reqAprobada: ['950220', '950299', '951604'] },
  { id: '950228', name: 'Geotopografía', codigo: '950228', level: 3, sigla: 'GEO', reqCursada: ['950222', '950606', '950703', '950704'], reqAprobada: ['950220', '950605', '950701', '950702', '951601'] },
  { id: '950225', name: 'Hidráulica General y Aplicada', codigo: '950225', level: 3, sigla: 'HGA', reqCursada: ['950221', '950222', '950606', '950703', '950704'], reqAprobada: ['950299', '950605', '950701', '950702', '951601'] },
  { id: '950298', name: 'Ingeniería Legal', codigo: '950298', level: 3, sigla: 'LEG', reqCursada: ['950222', '950703', '950704', '951602'], reqAprobada: ['950220', '950299', '950701', '950702', '951604'] },
  { id: '950296', name: 'Instalaciones Eléctricas y Acústicas', codigo: '950296', level: 3, sigla: 'IE', reqCursada: ['950222', '950297', '950606'], reqAprobada: ['950605', '950701', '950702', '951407', '951601'] },
  { id: '950294', name: 'Instalaciones Termomecánicas', codigo: '950294', level: 3, sigla: 'IT', reqCursada: ['950222', '950297', '950606'], reqAprobada: ['950220', '950605', '950701', '950702', '951407', '951601'] },
  { id: '950224', name: 'Resistencia de los Materiales', codigo: '950224', level: 3, sigla: 'RM', reqCursada: ['950221', '950299', '950605', '950701'], reqAprobada: ['950702'] },
  { id: '950227', name: 'Tecnología de la Construcción', codigo: '950227', level: 3, sigla: 'TC', reqCursada: ['950222', '950297', '951602'], reqAprobada: ['950220', '950299', '950605', '950701', '951407', '951601'] },
  { id: '950244', name: 'Tecnología del Hormigón', codigo: '950244', level: 3, sigla: 'TH', reqCursada: ['950221', '950297', '950704', '951602'], reqAprobada: ['950605', '950701', '950702', '951407'] },
  { id: '950226', name: 'Análisis Estructural I', codigo: '950226', level: 4, sigla: 'AE1', reqCursada: ['950224', '950244'], reqAprobada: ['950221', '950222', '950703', '950704'] },
  { id: '950295', name: 'Cálculo Avanzado', codigo: '950295', level: 4, sigla: 'CA', reqCursada: ['950221', '950297', '950703', '950704'], reqAprobada: ['950299', '950605', '950701', '950702', '951601'] },
  { id: '950229', name: 'Estructuras de Hormigón', codigo: '950229', level: 4, sigla: 'EH', reqCursada: ['950224', '950227', '950228', '950244'], reqAprobada: ['950221', '950222', '950297', '950606', '950703', '950704'] },
  { id: '950230', name: 'Geotecnia', codigo: '950230', level: 4, sigla: 'GT', reqCursada: ['950224', '950225', '950227', '950228', '950244'], reqAprobada: ['950221', '950222', '950297', '950605', '950606', '950703', '950704', '951407', '951601'] },
  { id: '950290', name: 'Vías de Comunicación I', codigo: '950290', level: 4, sigla: 'VC1', reqCursada: ['950227', '950228', '950244'], reqAprobada: ['950221', '950222', '950297', '950703', '950704', '951602'] },
  { id: '950231', name: 'Análisis Estructural II', codigo: '950231', level: 5, sigla: 'AE2', reqCursada: ['950226', '950229'], reqAprobada: ['950224', '950227', '950228', '950244'] },
  { id: '950292', name: 'Cimentaciones', codigo: '950292', level: 5, sigla: 'CIM', reqCursada: ['950226', '950229', '950230', '950295'], reqAprobada: ['950224', '950225', '950227', '950228', '950244'] },
  { id: '950235', name: 'Construcciones Metálicas y de Madera', codigo: '950235', level: 5, sigla: 'CM', reqCursada: ['950226', '950227', '950228', '950295'], reqAprobada: ['950224', '950244'] },
  { id: '950288', name: 'Vías de Comunicación II', codigo: '950288', level: 5, sigla: 'VC2', reqCursada: ['950229', '950230', '950290'], reqAprobada: ['950225', '950227', '950228', '950244', '950309'] },
  { id: '950289', name: 'Proyecto Final', codigo: '950289', level: 6, sigla: 'PF', reqCursada: ['950229', '950294', '950296', '950298', '950309'], reqAprobada: ['950226', '950230'] },
];

// ---------------------------------------------------------------------------
// INDUSTRIAL
// ---------------------------------------------------------------------------
export const INDUSTRIAL: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '952522', name: 'Informática I', codigo: '952522', level: 1, sigla: 'INF1', reqCursada: [], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 1, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '952595', name: 'Pensamiento Sistémico', codigo: '952595', level: 1, sigla: 'PS', reqCursada: [], reqAprobada: [] },
  { id: '951407', name: 'Química General', codigo: '951407', level: 1, sigla: 'QG', reqCursada: [], reqAprobada: [] },
  { id: '951601', name: 'Sistemas de Representación', codigo: '951601', level: 1, sigla: 'SR', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '032521', name: 'Administración General', codigo: '032521', level: 2, sigla: 'AG', reqCursada: ['950701', '951604', '952522', '952595'], reqAprobada: ['950701', '951604', '952522', '952595'] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '072522', name: 'Ciencia de los Materiales', codigo: '072522', level: 2, sigla: 'CM', reqCursada: ['950605', '951407'], reqAprobada: ['950605', '951407'] },
  { id: '952557', name: 'Economía General', codigo: '952557', level: 2, sigla: 'ECO', reqCursada: ['950702', '951604', '952595'], reqAprobada: ['950702', '951604', '952595'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: ['950605', '950702'] },
  { id: '072521', name: 'Informática II', codigo: '072521', level: 2, sigla: 'INF2', reqCursada: ['952522'], reqAprobada: ['952522'] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 2, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '032597', name: 'Análisis Numérico y Cálculo Avanzado', codigo: '032597', level: 3, sigla: 'ANCA', reqCursada: ['950703'], reqAprobada: ['950701', '950702', '950703'] },
  { id: '032599', name: 'Comercialización', codigo: '032599', level: 3, sigla: 'COM', reqCursada: ['032521', '950704', '952557'], reqAprobada: ['032521', '950701', '950702', '950704', '951604', '952522', '952557', '952595'] },
  { id: '952540', name: 'Costos y Presupuestos', codigo: '952540', level: 3, sigla: 'CyP', reqCursada: ['032521', '952557'], reqAprobada: ['032521', '950701', '950702', '951604', '952522', '952557', '952595'] },
  { id: '032525', name: 'Economía de la Empresa', codigo: '032525', level: 3, sigla: 'EE', reqCursada: ['032521', '952557'], reqAprobada: ['032521', '950701', '950702', '951604', '952522', '952557', '952595'] },
  { id: '072524', name: 'Electrotecnia y Máquinas Eléctricas', codigo: '072524', level: 3, sigla: 'EME', reqCursada: ['950606'], reqAprobada: ['950605', '950606', '950702', '950703'] },
  { id: '072523', name: 'Estudio del Trabajo', codigo: '072523', level: 3, sigla: 'ET', reqCursada: ['032521', '950704'], reqAprobada: ['032521', '950701', '950702', '950704', '951604', '952522', '952595'] },
  { id: '032526', name: 'Estática y Resistencia de Materiales', codigo: '032526', level: 3, sigla: 'ERM', reqCursada: ['072522', '950703'], reqAprobada: ['072522', '950605', '950701', '950702', '950703', '951407'] },
  { id: '072525', name: 'Mecánica de los Fluidos', codigo: '072525', level: 3, sigla: 'MF', reqCursada: ['950703'], reqAprobada: ['950605', '950701', '950702', '950703'] },
  { id: '952530', name: 'Seguridad, Higiene e Ingeniería Ambiental', codigo: '952530', level: 3, sigla: 'SHMA', reqCursada: ['072523'], reqAprobada: ['032521', '072523', '950704'] },
  { id: '072526', name: 'Termodinámica y Máquinas Térmicas', codigo: '072526', level: 3, sigla: 'TMT', reqCursada: ['950606', '951407'], reqAprobada: ['950605', '950606', '950702', '951407'] },
  { id: '032590', name: 'Evaluación de Proyectos', codigo: '032590', level: 4, sigla: 'EP', reqCursada: ['032525', '032599', '072523', '952540'], reqAprobada: ['032521', '032525', '032599', '072523', '950704', '951602', '952540', '952557'] },
  { id: '032598', name: 'Investigación Operativa', codigo: '032598', level: 4, sigla: 'IO', reqCursada: ['950703', '950704'], reqAprobada: ['950701', '950702', '950703', '950704'] },
  { id: '072528', name: 'Planificación y Control de la Producción', codigo: '072528', level: 4, sigla: 'PCP', reqCursada: ['072523'], reqAprobada: ['032521', '072523', '950704'] },
  { id: '032591', name: 'Procesos Industriales', codigo: '032591', level: 4, sigla: 'PI', reqCursada: ['072523', '072524', '072526'], reqAprobada: ['032521', '072523', '072524', '072526', '950606', '950704', '951407'] },
  { id: '032596', name: 'Proyecto Final', codigo: '032596', level: 5, sigla: 'PF', reqCursada: ['032590', '032591', '032597', '032598', '072528', '952530'], reqAprobada: ['032525', '032526', '032599', '072523', '072524', '072525', '072526'] },
];

// ---------------------------------------------------------------------------
// QUIMICA
// ---------------------------------------------------------------------------
export const QUIMICA: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '951199', name: 'Fundamentos de Informática', codigo: '951199', level: 1, sigla: 'FI', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 1, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 1, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '231110', name: 'Introducción a la Ingeniería Química', codigo: '231110', level: 1, sigla: 'IyQ', reqCursada: [], reqAprobada: [] },
  { id: '231407', name: 'Química', codigo: '231407', level: 1, sigla: 'Q', reqCursada: [], reqAprobada: [] },
  { id: '951601', name: 'Sistemas de Representación', codigo: '951601', level: 1, sigla: 'SR', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: ['950702'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: ['950605'] },
  { id: '951603', name: 'Inglés Técnico Nivel II', codigo: '951603', level: 2, sigla: 'ING2', reqCursada: ['951602'], reqAprobada: ['951602'] },
  { id: '231120', name: 'Introducción a Equipos y Procesos', codigo: '231120', level: 2, sigla: 'IEP', reqCursada: ['231110', '231407'], reqAprobada: [] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '951122', name: 'Química Inorgánica', codigo: '951122', level: 2, sigla: 'QI', reqCursada: ['231407'], reqAprobada: [] },
  { id: '231121', name: 'Química Orgánica', codigo: '231121', level: 2, sigla: 'QO', reqCursada: ['231407'], reqAprobada: [] },
  { id: '231130', name: 'Balance de Masa y Energía', codigo: '231130', level: 3, sigla: 'BME', reqCursada: ['231120', '231407', '950606', '951199', '951601'], reqAprobada: ['231110', '950701', '950702'] },
  { id: '231131', name: 'Ciencia de lo Materiales', codigo: '231131', level: 3, sigla: 'CM', reqCursada: ['231120', '231121', '951122'], reqAprobada: ['231110', '231407'] },
  { id: '950309', name: 'Economía', codigo: '950309', level: 3, sigla: 'ECO', reqCursada: ['231120'], reqAprobada: ['950701', '951604'] },
  { id: '951128', name: 'Fisicoquímica', codigo: '951128', level: 3, sigla: 'FQ', reqCursada: ['231120', '950606', '950703'], reqAprobada: ['231407', '950701', '950702'] },
  { id: '951198', name: 'Matemática Superior Aplicada', codigo: '951198', level: 3, sigla: 'MSA', reqCursada: ['950703'], reqAprobada: ['950701', '950702'] },
  { id: '231132', name: 'Microbiología y Química Biológica', codigo: '231132', level: 3, sigla: 'MQB', reqCursada: ['231121', '951122'], reqAprobada: ['231407'] },
  { id: '951130', name: 'Química Analítica', codigo: '951130', level: 3, sigla: 'QAn', reqCursada: ['231121', '950704', '951122'], reqAprobada: ['231407', '951604'] },
  { id: '231133', name: 'Química Aplicada', codigo: '231133', level: 3, sigla: 'QAplic', reqCursada: ['231120', '231121', '950606', '951122'], reqAprobada: ['231110', '231407', '951602', '951604'] },
  { id: '951125', name: 'Termodinámica', codigo: '951125', level: 3, sigla: 'TERM', reqCursada: ['950606', '950703', '951122'], reqAprobada: ['231407', '950702'] },
  { id: '231140', name: 'Diseño, simulación, optimización y seguridad de procesos', codigo: '231140', level: 4, sigla: 'DSOP', reqCursada: ['231130', '951198'], reqAprobada: ['231120', '950703', '951199', '951601', '951603'] },
  { id: '951129', name: 'Fenómenos de Transporte', codigo: '951129', level: 4, sigla: 'FT', reqCursada: ['231120', '950606', '950703'], reqAprobada: ['231407', '950701', '950702'] },
  { id: '951194', name: 'Ingeniería de las Reacciones Químicas', codigo: '951194', level: 4, sigla: 'IRQ', reqCursada: ['231130', '951125', '951128', '951129'], reqAprobada: ['231121', '950606', '950703', '951122'] },
  { id: '950310', name: 'Legislación', codigo: '950310', level: 4, sigla: 'LEG', reqCursada: ['231110', '951604'], reqAprobada: [] },
  { id: '231141', name: 'Operaciones Unitarias I', codigo: '231141', level: 4, sigla: 'OU1', reqCursada: ['231130', '951125', '951129'], reqAprobada: ['231120', '950606', '950703'] },
  { id: '951135', name: 'Operaciones Unitarias II', codigo: '951135', level: 4, sigla: 'OU2', reqCursada: ['951125', '951128', '951129'], reqAprobada: ['231120', '231121', '231407', '950702'] },
  { id: '951197', name: 'Organización Industrial', codigo: '951197', level: 4, sigla: 'OI', reqCursada: ['231130', '950704'], reqAprobada: ['231120', '950310', '951604'] },
  { id: '231142', name: 'Tecnología de la Energía Térmica', codigo: '231142', level: 4, sigla: 'TET', reqCursada: ['231130', '951125', '951128', '951129'], reqAprobada: ['231120', '950606', '950703'] },
  { id: '231155', name: 'Proyecto Final', codigo: '231155', level: 5, sigla: 'PF', reqCursada: ['231140', '231141', '231142', '951135', '951194', '951197'], reqAprobada: ['231130', '231133', '950309', '951128', '951129'] },
];

// ---------------------------------------------------------------------------
// NAVAL
// ---------------------------------------------------------------------------
export const NAVAL: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '261021', name: 'Fundamentos de Informática', codigo: '261021', level: 1, sigla: 'FI', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '951602', name: 'Inglés Técnico Nivel I', codigo: '951602', level: 1, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '261020', name: 'Introducción a la Ingeniería Naval', codigo: '261020', level: 1, sigla: 'IN', reqCursada: [], reqAprobada: [] },
  { id: '951407', name: 'Química General', codigo: '951407', level: 1, sigla: 'QG', reqCursada: [], reqAprobada: [] },
  { id: '951601', name: 'Sistemas de Representación', codigo: '951601', level: 1, sigla: 'SR', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '261024', name: 'Análisis Estructural I', codigo: '261024', level: 2, sigla: 'AE1', reqCursada: ['950605', '950701', '950702'], reqAprobada: ['950605', '950701', '950702'] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '261025', name: 'Dibujo Naval', codigo: '261025', level: 2, sigla: 'DN', reqCursada: ['261020', '951601'], reqAprobada: ['261020', '951601'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950701', '950702'], reqAprobada: ['950605', '950701', '950702'] },
  { id: 'naval_fisica_iii', name: 'Física III', codigo: null, level: 2, sigla: 'F3', reqCursada: ['950605', '950702'], reqAprobada: ['950605', '950606', '950702'] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 2, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '950310', name: 'Legislación', codigo: '950310', level: 2, sigla: 'LEG', reqCursada: [], reqAprobada: [] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: ['950701', '950702'] },
  { id: '131024__ae2', name: 'Análisis Estructural III', codigo: '131024', level: 3, sigla: 'AE2', reqCursada: ['261024', '950703'], reqAprobada: ['950605', '950701'] },
  { id: '940834', name: 'Electrotecnia y Máquinas Eléctricas', codigo: '940834', level: 3, sigla: 'EME', reqCursada: ['950606', '950703'], reqAprobada: ['950606', '950703'] },
  { id: '131026', name: 'Matemática Aplicada a la Ingeniería', codigo: '131026', level: 3, sigla: 'MA', reqCursada: ['950703'], reqAprobada: ['950701', '950702'] },
  { id: '940897', name: 'Mecánica Racional', codigo: '940897', level: 3, sigla: 'MR', reqCursada: ['950703'], reqAprobada: ['950605'] },
  { id: '131027', name: 'Mecánica de los Fluidos', codigo: '131027', level: 3, sigla: 'MF', reqCursada: ['950605', '950703'], reqAprobada: ['950702'] },
  { id: '131025', name: 'Teoría del Buque I', codigo: '131025', level: 3, sigla: 'TB1', reqCursada: ['261025', '950703', '950704'], reqAprobada: ['261020', '950702'] },
  { id: '940898', name: 'Termodinámica', codigo: '940898', level: 3, sigla: 'TERM', reqCursada: ['950606', '950703'], reqAprobada: ['950606', '950703'] },
  { id: '131034', name: 'Actividad Naviera', codigo: '131034', level: 4, sigla: 'AN', reqCursada: ['950310'], reqAprobada: ['950310'] },
  { id: '131029', name: 'Alistamiento de Buques', codigo: '131029', level: 4, sigla: 'AB', reqCursada: ['131024__ae2', '131027', '940898'], reqAprobada: ['261025'] },
  { id: '131024', name: 'Análisis Estructural III', codigo: '131024', level: 4, sigla: 'AE3', reqCursada: ['131024__ae2', '131026'], reqAprobada: ['261024'] },
  { id: '131033', name: 'Construcción Naval', codigo: '131033', level: 4, sigla: 'CN', reqCursada: ['131024__ae2', '131025'], reqAprobada: ['261025'] },
  { id: '951603', name: 'Inglés Técnico Nivel II', codigo: '951603', level: 4, sigla: 'ING2', reqCursada: ['951602'], reqAprobada: ['951602'] },
  { id: '131032', name: 'Materiales Navales', codigo: '131032', level: 4, sigla: 'MN', reqCursada: ['131024__ae2'], reqAprobada: ['951407'] },
  { id: '131031', name: 'Máquinas Alternativas y Turbomáquinas', codigo: '131031', level: 4, sigla: 'MAT', reqCursada: ['940897', '940898'], reqAprobada: ['940897', '940898'] },
  { id: '131028', name: 'Teoría del Buque II', codigo: '131028', level: 4, sigla: 'TB2', reqCursada: ['131025', '131026', '131027', '951602'], reqAprobada: ['261025', '950703'] },
  { id: '131041', name: 'Análisis por Elementos Finitos', codigo: '131041', level: 5, sigla: 'AEF', reqCursada: ['131024'], reqAprobada: ['131026'] },
  { id: '131037', name: 'Cálculo de Estructuras de Buques', codigo: '131037', level: 5, sigla: 'CE', reqCursada: ['131024', '131032', '131033'], reqAprobada: ['131024__ae2', '131026'] },
  { id: '131038', name: 'Mecánica Aplicada a las Máquinas', codigo: '131038', level: 5, sigla: 'MAM', reqCursada: ['131024', '131029', '131032'], reqAprobada: ['940897'] },
  { id: '131047', name: 'Organización Industrial', codigo: '131047', level: 5, sigla: 'OI', reqCursada: ['131033'], reqAprobada: ['131033'] },
  { id: '131035', name: 'Plantas Eléctricas Navales', codigo: '131035', level: 5, sigla: 'PEN', reqCursada: ['940834'], reqAprobada: ['940834'] },
  { id: '131036', name: 'Plantas Propulsoras Navales', codigo: '131036', level: 5, sigla: 'PPN', reqCursada: ['131029', '131031'], reqAprobada: ['940898'] },
  { id: '131039', name: 'Proyecto de Buques', codigo: '131039', level: 5, sigla: 'PB', reqCursada: ['131028', '131029', '131033', '951603'], reqAprobada: ['131025', '951602'] },
  { id: '131040', name: 'Soldadura', codigo: '131040', level: 5, sigla: 'SOLD', reqCursada: ['131032'], reqAprobada: ['131026'] },
  { id: '131042', name: 'Proyecto Final', codigo: '131042', level: 6, sigla: 'PF', reqCursada: ['131035', '131036', '131037', '131038', '131039', '131040', '131041', '131047'], reqAprobada: ['131024', '131024__ae2', '131025', '131026', '131027', '131028', '131029', '131031', '131032', '131033', '131034', '261020', '261021', '261024', '261025', '940834', '940897', '940898', '950310', '950605', '950606', '950701', '950702', '950703', '950704', '951407', '951601', '951602', '951603', '951604', 'naval_fisica_iii'] },
];

// ---------------------------------------------------------------------------
// TEXTIL
// ---------------------------------------------------------------------------
export const TEXTIL: Subject[] = [
  { id: '950702', name: 'Análisis Matemático I', codigo: '950702', level: 1, sigla: 'AM1', reqCursada: [], reqAprobada: [] },
  { id: '950605', name: 'Física I', codigo: '950605', level: 1, sigla: 'F1', reqCursada: [], reqAprobada: [] },
  { id: '951604', name: 'Ingeniería y Sociedad', codigo: '951604', level: 1, sigla: 'IyS', reqCursada: [], reqAprobada: [] },
  { id: '171220', name: 'Introducción a la Industria Textil', codigo: '171220', level: 1, sigla: 'IIT', reqCursada: [], reqAprobada: [] },
  { id: '951407', name: 'Química General', codigo: '951407', level: 1, sigla: 'QG', reqCursada: [], reqAprobada: [] },
  { id: 'textil_quimica_organica', name: 'Química Orgánica', codigo: null, level: 1, sigla: 'QO', reqCursada: ['951407'], reqAprobada: ['951407'] },
  { id: '951601', name: 'Sistemas de Representación', codigo: '951601', level: 1, sigla: 'SR', reqCursada: [], reqAprobada: [] },
  { id: '950701', name: 'Álgebra y Geometría Analítica', codigo: '950701', level: 1, sigla: 'AGA', reqCursada: [], reqAprobada: [] },
  { id: '950703', name: 'Análisis Matemático II', codigo: '950703', level: 2, sigla: 'AM2', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: '171222', name: 'Diseño I', codigo: '171222', level: 2, sigla: 'D1', reqCursada: ['171220'], reqAprobada: [] },
  { id: 'textil_estabilidad', name: 'Estabilidad', codigo: null, level: 2, sigla: 'EST', reqCursada: ['950605'], reqAprobada: ['950701'] },
  { id: '171223', name: 'Fibras Textiles', codigo: '171223', level: 2, sigla: 'FT', reqCursada: ['171220'], reqAprobada: ['951407'] },
  { id: '950606', name: 'Física II', codigo: '950606', level: 2, sigla: 'F2', reqCursada: ['950605', '950702'], reqAprobada: [] },
  { id: 'textil_ingles_i', name: 'Inglés I', codigo: null, level: 2, sigla: 'ING1', reqCursada: [], reqAprobada: [] },
  { id: '950704', name: 'Probabilidad y Estadística', codigo: '950704', level: 2, sigla: 'PyE', reqCursada: ['950701', '950702'], reqAprobada: [] },
  { id: 'textil_quimica_analitica', name: 'Química Analítica', codigo: null, level: 2, sigla: 'QA', reqCursada: ['textil_quimica_organica'], reqAprobada: [] },
  { id: '171230', name: 'Temodinámica', codigo: '171230', level: 2, sigla: 'TERM', reqCursada: ['950702', '951407'], reqAprobada: [] },
  { id: '171227', name: 'Diseño II', codigo: '171227', level: 3, sigla: 'D2', reqCursada: ['171222', '171223'], reqAprobada: ['171220'] },
  { id: 'textil_electrotecnia', name: 'Electrotecnia', codigo: null, level: 3, sigla: 'ELEC', reqCursada: ['950606'], reqAprobada: ['950605'] },
  { id: 'textil_hilanderia_de_algodon_y_f_cortas', name: 'Hilandería de Algodón y F. Cortas', codigo: null, level: 3, sigla: 'HAC', reqCursada: ['171222', '171223'], reqAprobada: ['171220', '951601'] },
  { id: 'textil_hilanderia_de_lana_y_fibras_largas', name: 'Hilandería de Lana y Fibras Largas', codigo: null, level: 3, sigla: 'HLL', reqCursada: ['171222', '171223'], reqAprobada: ['171220'] },
  { id: 'textil_informatica_textil', name: 'Informática Textil', codigo: null, level: 3, sigla: 'INF', reqCursada: ['950704'], reqAprobada: ['950701', '950702'] },
  { id: 'textil_ingles_ii', name: 'Inglés II', codigo: null, level: 3, sigla: 'ING2', reqCursada: ['textil_ingles_i'], reqAprobada: [] },
  { id: '950310', name: 'Legislación', codigo: '950310', level: 3, sigla: 'LEG', reqCursada: ['171223'], reqAprobada: [] },
  { id: '171228', name: 'Química Textil', codigo: '171228', level: 3, sigla: 'QT', reqCursada: ['171223', 'textil_quimica_analitica'], reqAprobada: ['171220', '951407', 'textil_quimica_organica'] },
  { id: 'textil_telas_no_tejidas', name: 'Telas no tejidas', codigo: null, level: 3, sigla: 'TNT', reqCursada: ['171223'], reqAprobada: ['171220', '951407'] },
  { id: 'textil_administracion_y_marketing', name: 'Administración y Marketing', codigo: null, level: 4, sigla: 'AM', reqCursada: ['textil_informatica_textil'], reqAprobada: ['950704'] },
  { id: 'textil_diseno_iii', name: 'Diseño III', codigo: null, level: 4, sigla: 'D3', reqCursada: ['171227'], reqAprobada: ['171222', '171223'] },
  { id: '950309', name: 'Economía', codigo: '950309', level: 4, sigla: 'ECO', reqCursada: ['171223'], reqAprobada: [] },
  { id: 'textil_gestion_de_calidad', name: 'Gestión de Calidad', codigo: null, level: 4, sigla: 'GC', reqCursada: ['950704', 'textil_hilanderia_de_algodon_y_f_cortas', 'textil_hilanderia_de_lana_y_fibras_largas'], reqAprobada: ['171223'] },
  { id: '171232', name: 'Seguridad e Higiene Industrial', codigo: '171232', level: 4, sigla: 'SHI', reqCursada: ['950704', 'textil_hilanderia_de_algodon_y_f_cortas', 'textil_hilanderia_de_lana_y_fibras_largas'], reqAprobada: ['171223'] },
  { id: 'textil_tejeduria_de_calada', name: 'Tejeduría de Calada', codigo: null, level: 4, sigla: 'TC', reqCursada: ['textil_hilanderia_de_algodon_y_f_cortas', 'textil_hilanderia_de_lana_y_fibras_largas'], reqAprobada: ['171220', '171222'] },
  { id: 'textil_tejeduria_de_punto', name: 'Tejeduría de Punto', codigo: null, level: 4, sigla: 'TP', reqCursada: ['textil_hilanderia_de_algodon_y_f_cortas', 'textil_hilanderia_de_lana_y_fibras_largas'], reqAprobada: ['171220', '171222'] },
  { id: 'textil_tintoreria_y_apresto', name: 'Tintorería y Apresto', codigo: null, level: 4, sigla: 'TA', reqCursada: ['171228'], reqAprobada: ['171223', 'textil_ingles_i', 'textil_quimica_analitica'] },
  { id: 'textil_confeccion', name: 'Confección', codigo: null, level: 5, sigla: 'CONF', reqCursada: ['textil_gestion_de_calidad'], reqAprobada: ['171227'] },
  { id: 'textil_diseno_iv', name: 'Diseño IV', codigo: null, level: 5, sigla: 'D4', reqCursada: ['textil_diseno_iii'], reqAprobada: ['171227'] },
  { id: 'textil_diseno_de_tejidos_de_calada', name: 'Diseño de Tejidos de Calada', codigo: null, level: 5, sigla: 'DTC', reqCursada: ['textil_tejeduria_de_calada'], reqAprobada: ['textil_hilanderia_de_algodon_y_f_cortas', 'textil_hilanderia_de_lana_y_fibras_largas'] },
  { id: 'textil_diseno_de_tejidos_de_punto', name: 'Diseño de Tejidos de Punto', codigo: null, level: 5, sigla: 'DTP', reqCursada: ['textil_tejeduria_de_punto'], reqAprobada: ['textil_hilanderia_de_algodon_y_f_cortas', 'textil_hilanderia_de_lana_y_fibras_largas'] },
  { id: 'textil_proyecto_e_ingenieria_de_planta', name: 'Proyecto e Ingeniería de Planta', codigo: null, level: 5, sigla: 'PIP', reqCursada: ['171230', '950309', 'textil_electrotecnia', 'textil_estabilidad', 'textil_telas_no_tejidas'], reqAprobada: ['textil_hilanderia_de_algodon_y_f_cortas', 'textil_hilanderia_de_lana_y_fibras_largas', 'textil_ingles_ii'] },
];

// ---------------------------------------------------------------------------
// DICCIONARIO CENTRAL: acceso por carrera
// ---------------------------------------------------------------------------
export const CARRERAS_DATA: Record<string, Subject[]> = {
  'sistemas': SISTEMAS,
  'mecanica': MECANICA,
  'electronica': ELECTRONICA,
  'electrica': ELECTRICA,
  'civil': CIVIL,
  'industrial': INDUSTRIAL,
  'quimica': QUIMICA,
  'naval': NAVAL,
  'textil': TEXTIL,
};

// ---------------------------------------------------------------------------
// DATA ISSUES: cosas para revisar en el origen (materias_rows.sql / carreras.ts)
// ---------------------------------------------------------------------------
export const DATA_ISSUES: string[] = [
  'naval: Analisis Estructural II y III comparten el mismo codigo (131024) en la tabla materias. Se genero un id sintetico (131024__ae2) para Analisis Estructural II para no romper referencias. Corregir el codigo real en la base.',
  'textil: 21 materias del plan de correlatividades no tienen codigo real cargado en materias (ver Subject.codigo === null). El plan de Textil en carreras.ts no coincide con las materias de textil en la tabla SQL actual.',
];