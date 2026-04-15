export interface MateriaNodeData {
  codigo: string;
  title: string;
  category: 'math' | 'prog' | 'sys' | 'hw' | 'gen';
  level: number;
  cursada: string;
  aprobada: string;
}

export interface PlanDeEstudio {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
}

export const CATEGORY_STYLES = {
  math: { border: 'border-blue-500', header: 'bg-blue-500/20 text-blue-300' },
  prog: { border: 'border-purple-500', header: 'bg-purple-500/20 text-purple-300' },
  sys: { border: 'border-green-500', header: 'bg-green-500/20 text-green-300' },
  hw: { border: 'border-amber-500', header: 'bg-amber-500/20 text-amber-300' }, // hw ahora usa amber/amarillo (ideal para Eléctrica y Electrónica)
  gen: { border: 'border-orange-500', header: 'bg-orange-500/20 text-orange-300' },
};

// HELPER para crear nodos rápido
const createNode = (id: string, codigo: string, title: string, cat: string, lvl: number, yIndex: number, cursada: string, aprobada: string) => ({
  id, type: 'materia', position: { x: (lvl - 1) * 380, y: yIndex * 150 }, // Ampliado ligeramente X e Y para evitar superposiciones
  data: { codigo, title, category: cat, level: lvl, cursada, aprobada }
});

// HELPER para crear aristas (edges). Regular = línea sólida color primario, Aprobar = punteada roja.
const createEdges = (source: string, targets: string[], type: 'cursada' | 'aprobada', baseColor: string = '#3b82f6') => {
  return targets.map(target => ({
    id: `e-${source}-${target}-${type}`, source, target,
    animated: type === 'cursada',
    type: 'smoothstep',
    style: type === 'cursada' ? { stroke: baseColor, strokeWidth: 2 } : { stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '5,5', opacity: 0.6 },
  }));
};

export const PLANES_DB: Record<string, PlanDeEstudio> = {
  
  // =========================================================================
  // PLAN DE ESTUDIOS: INGENIERÍA EN SISTEMAS
  // =========================================================================
  sistemas: {
    id: 'sistemas',
    name: 'Ingeniería en Sistemas de Información (Plan 2023)',
    nodes: [
      // === NIVEL 1 ===
      createNode('sypn', 'SyPN', 'Sistemas y Proc. de Negocios', 'sys', 1, 0, '-', '-'),
      createNode('ayed', 'AyED', 'Algoritmos y Est. de Datos', 'prog', 1, 1, '-', '-'),
      createNode('lyed', 'LyED', 'Lógica y Estructuras Discretas', 'math', 1, 2, '-', '-'),
      createNode('adc', 'ADC', 'Arquitectura de Computadoras', 'hw', 1, 3, '-', '-'),
      createNode('aga', 'AGA', 'Álgebra y Geometría Analítica', 'math', 1, 4, '-', '-'),
      createNode('am1', 'AM1', 'Análisis Matemático I', 'math', 1, 5, '-', '-'),
      createNode('f1', 'F1', 'Física I', 'gen', 1, 6, '-', '-'),
      createNode('iys', 'IyS', 'Ingeniería y Sociedad', 'gen', 1, 7, '-', '-'),
      createNode('i1', 'I1', 'Inglés I', 'gen', 1, 8, '-', '-'),

      // === NIVEL 2 ===
      createNode('ads', 'ADS', 'Análisis de Sistemas', 'sys', 2, 0, 'AyED - SyPN', '-'),
      createNode('pdp', 'PdP', 'Paradigmas de Programación', 'prog', 2, 1, 'LyED - AyED', '-'),
      createNode('ssl', 'SSL', 'Sintaxis y Semántica de Lenguajes', 'prog', 2, 2, 'LyED - AyED', '-'),
      createNode('am2', 'AM2', 'Análisis Matemático II', 'math', 2, 3, 'AM1 - AGA', '-'),
      createNode('f2', 'F2', 'Física II', 'gen', 2, 4, 'AM1 - F1', '-'),
      createNode('so', 'SO', 'Sistemas Operativos', 'hw', 2, 5, 'ADC', '-'),
      createNode('pye', 'PyE', 'Probabilidad y Estadística', 'math', 2, 6, 'AM1 - AGA', '-'),
      createNode('eco', 'ECO', 'Economía', 'gen', 2, 7, '-', 'AM1 - AGA'),
      createNode('i2', 'I2', 'Inglés II', 'gen', 2, 8, 'I1', '-'),

      // === NIVEL 3 ===
      createNode('dsi', 'DSI', 'Diseño de Sistemas de Información', 'sys', 3, 0, 'ADS - PdP', 'I1 - SyPN - AyED'),
      createNode('bd', 'BD', 'Bases de Datos', 'sys', 3, 1, 'ADS - SSL', 'LyED - AyED'),
      createNode('dso', 'DSO', 'Desarrollo de Software', 'prog', 3, 2, 'ADS - PdP', 'LyED - AyED'),
      createNode('cd', 'CD', 'Comunicación de Datos', 'hw', 3, 3, '-', 'ADC - F1'),
      createNode('an', 'AN', 'Análisis Numérico', 'math', 3, 4, 'AM2', 'AM1 - AGA'),
      createNode('leg', 'LEG', 'Legislación', 'gen', 3, 5, 'IyS', '-'),
      createNode('rd', 'RD', 'Redes de Datos', 'hw', 3, 6, 'SO - CD', '-'),

      // === NIVEL 4 ===
      createNode('asi', 'ASI', 'Administración de Sist. de Inf.', 'sys', 4, 0, 'ECO - DSI', 'ADS'),
      createNode('ics', 'ICS', 'Ingeniería y Calidad de Software', 'sys', 4, 1, 'BD - DSO - DSI', 'SSL - PdP'),
      createNode('sim', 'SIM', 'Simulación', 'gen', 4, 2, 'PyE', 'AM2'),
      createNode('io', 'IO', 'Investigación Operativa', 'math', 4, 3, 'PyE - AN', '-'),
      createNode('ta', 'TA', 'Tecnologías para Automatización', 'hw', 4, 4, 'F2 - AN', 'AM2'),

      // === NIVEL 5 ===
      createNode('pf', 'PF', 'Proyecto Final', 'sys', 5, 0, 'ICS - RD - ASI', 'I2 - DSI - DSO'),
      createNode('ia', 'IA', 'Inteligencia Artificial', 'prog', 5, 1, 'SIM', 'PyE - AN'),
      createNode('gg', 'GG', 'Gestión Gerencial', 'gen', 5, 2, 'LEG - ASI', 'ECO'),
      createNode('sg', 'SG', 'Sistemas de Gestión', 'sys', 5, 3, 'ECO - IO', 'DSI'),
      createNode('ssi', 'SSI', 'Seguridad en los Sistemas', 'hw', 5, 4, 'RD - ASI', 'DSO - CD'),
      createNode('dat', 'DAT', 'Ciencia de Datos', 'prog', 5, 5, 'SIM', 'PyE - BD'),
    ],
    edges: [
      ...createEdges('sypn', ['ads'], 'cursada', '#3b82f6'),
      ...createEdges('ayed', ['ads', 'pdp', 'ssl'], 'cursada', '#3b82f6'),
      ...createEdges('lyed', ['pdp', 'ssl'], 'cursada', '#3b82f6'),
      ...createEdges('adc', ['so'], 'cursada', '#3b82f6'),
      ...createEdges('am1', ['am2', 'f2', 'pye'], 'cursada', '#3b82f6'),
      ...createEdges('aga', ['am2', 'pye'], 'cursada', '#3b82f6'),
      ...createEdges('f1', ['f2'], 'cursada', '#3b82f6'),
      ...createEdges('i1', ['i2'], 'cursada', '#3b82f6'),
      ...createEdges('ads', ['dsi', 'bd', 'dso'], 'cursada', '#3b82f6'),
      ...createEdges('pdp', ['dsi', 'dso'], 'cursada', '#3b82f6'),
      ...createEdges('ssl', ['bd'], 'cursada', '#3b82f6'),
      ...createEdges('am2', ['an'], 'cursada', '#3b82f6'),
      ...createEdges('iys', ['leg'], 'cursada', '#3b82f6'),
      ...createEdges('so', ['rd'], 'cursada', '#3b82f6'),
      ...createEdges('cd', ['rd'], 'cursada', '#3b82f6'),
      ...createEdges('eco', ['asi', 'sg'], 'cursada', '#3b82f6'),
      ...createEdges('dsi', ['asi', 'ics'], 'cursada', '#3b82f6'),
      ...createEdges('bd', ['ics'], 'cursada', '#3b82f6'),
      ...createEdges('dso', ['ics'], 'cursada', '#3b82f6'),
      ...createEdges('pye', ['sim', 'io'], 'cursada', '#3b82f6'),
      ...createEdges('an', ['io', 'ta'], 'cursada', '#3b82f6'),
      ...createEdges('f2', ['ta'], 'cursada', '#3b82f6'),
      ...createEdges('rd', ['pf', 'ssi'], 'cursada', '#3b82f6'),
      ...createEdges('asi', ['pf', 'gg', 'ssi'], 'cursada', '#3b82f6'),
      ...createEdges('ics', ['pf'], 'cursada', '#3b82f6'),
      ...createEdges('leg', ['gg'], 'cursada', '#3b82f6'),
      ...createEdges('io', ['sg'], 'cursada', '#3b82f6'),
      ...createEdges('sim', ['ia', 'dat'], 'cursada', '#3b82f6'),
    ]
  },

  // =========================================================================
  // PLAN DE ESTUDIOS: INGENIERÍA ELÉCTRICA
  // =========================================================================
  electrica: {
    id: 'electrica',
    name: 'Ingeniería Eléctrica',
    nodes: [
      // === NIVEL 1 ===
      createNode('am1_e', '1', 'Análisis Matemático I', 'math', 1, 0, '-', '-'),
      createNode('aga_e', '2', 'Álgebra y Geometría Analítica', 'math', 1, 1, '-', '-'),
      createNode('iys_e', '3', 'Ingeniería y Sociedad', 'gen', 1, 2, '-', '-'),
      createNode('sr', '4', 'Sistemas de Representación', 'hw', 1, 3, '-', '-'),
      createNode('f1_e', '5', 'Física I', 'gen', 1, 4, '-', '-'),
      createNode('qg', '6', 'Química General', 'gen', 1, 5, '-', '-'),
      createNode('ie1', '7', 'Integración Eléctrica I', 'hw', 1, 6, '-', '-'),
      createNode('fi', '8', 'Fundamentos de Informática', 'sys', 1, 7, '-', '-'),

      // === NIVEL 2 ===
      createNode('f2_e', '9', 'Física II', 'gen', 2, 0, '1 - 5', '-'),
      createNode('pye_e', '10', 'Probabilidad y Estadística', 'math', 2, 1, '1 - 2', '-'),
      createNode('e1', '11', 'Electrotecnia I', 'hw', 2, 2, '1 - 2 - 5', '-'),
      createNode('est', '12', 'Estabilidad', 'hw', 2, 3, '2 - 5', '-'),
      createNode('mt', '13', 'Mecánica Técnica', 'hw', 2, 4, '1 - 5', '-'),
      createNode('ie2', '14', 'Integración Eléctrica II', 'hw', 2, 5, '1 - 5 - 7', '-'),
      createNode('i1_e', '15', 'Inglés I', 'gen', 2, 6, '-', '-'),
      createNode('am2_e', '16', 'Análisis Matemático II', 'math', 2, 7, '1 - 2', '-'),
      createNode('cn', '17', 'Cálculo Numérico', 'math', 2, 8, '1 - 2', '-'),

      // === NIVEL 3 ===
      createNode('tyeme', '18', 'Tec. y Ens. de Mat. Eléctricos', 'hw', 3, 0, '6 - 9', '1 - 5'),
      createNode('iyme', '19', 'Inst. y Mediciones Eléctricas', 'hw', 3, 1, '10 - 11 - 14', '1-2-3-4-5-7'),
      createNode('tdc', '20', 'Teoría de los Campos', 'hw', 3, 2, '9 - 16', '1 - 2 - 5'),
      createNode('f3', '21', 'Física III', 'gen', 3, 3, '9 - 16', '1 - 2 - 5'),
      createNode('me1', '22', 'Máquinas Eléctricas I', 'hw', 3, 4, '9 - 11 - 16', '1 - 5 - 7 - 8'),
      createNode('e2', '23', 'Electrotecnia II', 'hw', 3, 5, '9 - 11 - 16', '1 - 2 - 5'),
      createNode('termo', '24', 'Termodinámica', 'gen', 3, 6, '9 - 16', '1 - 2 - 5'),
      createNode('fpas', '25', 'Fund. para Análisis de Señales', 'math', 3, 7, '16 - 17', '1 - 2'),

      // === NIVEL 4 ===
      createNode('i2_e', '26', 'Inglés II', 'gen', 4, 0, '-', '15'),
      createNode('eco_e', '27', 'Economía', 'gen', 4, 1, '14', '3'),
      createNode('elec1', '28', 'Electrónica I', 'hw', 4, 2, '11', '1 - 5'),
      createNode('me2', '29', 'Máquinas Eléctricas II', 'hw', 4, 3, '18-20-22-23', '6-9-10-11-14-16'),
      createNode('sreyma', '30', 'Seguridad, Riesgo Eléc. y M.A.', 'sys', 4, 4, '11 - 20', '1-2-5-9-16'),
      createNode('ieyl', '31', 'Inst. Eléctricas y Luminotecnia', 'hw', 4, 5, '18 - 22 - 23', '6-9-11-14-15-16'),
      createNode('ca', '32', 'Control Automático', 'sys', 4, 6, '23 - 25', '11 - 16'),
      createNode('mthyf', '33', 'Máquinas Térmicas, Hid. y Fl.', 'hw', 4, 7, '12 - 13 - 24', '9 - 16'),
      createNode('leg_e', '34', 'Legislación', 'gen', 4, 8, '14', '3'),

      // === NIVEL 5 ===
      createNode('elec2', '35', 'Electrónica II', 'hw', 5, 0, '28', '11'),
      createNode('gtydee', '36', 'Generación, Trans. y Dist. de E.E.', 'hw', 5, 1, '21 - 29 - 33', '12-13-18-22-23-24'),
      createNode('sp', '37', 'Sistemas de Potencia', 'hw', 5, 2, '29', '18 - 22 - 23'),
      createNode('ayce', '38', 'Accionamientos y Controles Eléc.', 'hw', 5, 3, '28 - 29 - 32', '11-18-22-23-25'),
      createNode('oyae', '39', 'Org. y Admin. de Empresas', 'gen', 5, 4, '27 - 34', '14'),
      createNode('pf_elec', '40', 'Proyecto Final', 'sys', 5, 5, '29 - 31 - 32', '18-22-23-25-26'),
    ],
    edges: [
      // CURSADAS (Azul/Ambar Eléctrico)
      ...createEdges('am1_e', ['f2_e', 'pye_e', 'e1', 'mt', 'ie2', 'am2_e', 'cn'], 'cursada', '#fbbf24'),
      ...createEdges('aga_e', ['pye_e', 'e1', 'est', 'am2_e', 'cn'], 'cursada', '#fbbf24'),
      ...createEdges('f1_e', ['f2_e', 'e1', 'est', 'mt', 'ie2'], 'cursada', '#fbbf24'),
      ...createEdges('qg', ['tyeme'], 'cursada', '#fbbf24'),
      ...createEdges('ie1', ['ie2'], 'cursada', '#fbbf24'),
      ...createEdges('f2_e', ['tyeme', 'tdc', 'f3', 'me1', 'e2', 'termo'], 'cursada', '#fbbf24'),
      ...createEdges('pye_e', ['iyme'], 'cursada', '#fbbf24'),
      ...createEdges('e1', ['iyme', 'me1', 'e2', 'elec1', 'sreyma'], 'cursada', '#fbbf24'),
      ...createEdges('est', ['mthyf'], 'cursada', '#fbbf24'),
      ...createEdges('mt', ['mthyf'], 'cursada', '#fbbf24'),
      ...createEdges('ie2', ['iyme', 'eco_e', 'leg_e'], 'cursada', '#fbbf24'),
      ...createEdges('am2_e', ['tdc', 'f3', 'me1', 'e2', 'termo', 'fpas'], 'cursada', '#fbbf24'),
      ...createEdges('cn', ['fpas'], 'cursada', '#fbbf24'),
      ...createEdges('tyeme', ['me2', 'ieyl'], 'cursada', '#fbbf24'),
      ...createEdges('tdc', ['me2', 'sreyma'], 'cursada', '#fbbf24'),
      ...createEdges('me1', ['me2', 'ieyl'], 'cursada', '#fbbf24'),
      ...createEdges('e2', ['me2', 'ieyl', 'ca'], 'cursada', '#fbbf24'),
      ...createEdges('termo', ['mthyf'], 'cursada', '#fbbf24'),
      ...createEdges('fpas', ['ca'], 'cursada', '#fbbf24'),
      ...createEdges('eco_e', ['oyae'], 'cursada', '#fbbf24'),
      ...createEdges('elec1', ['elec2', 'ayce'], 'cursada', '#fbbf24'),
      ...createEdges('me2', ['gtydee', 'sp', 'ayce', 'pf_elec'], 'cursada', '#fbbf24'),
      ...createEdges('ca', ['ayce', 'pf_elec'], 'cursada', '#fbbf24'),
      ...createEdges('leg_e', ['oyae'], 'cursada', '#fbbf24'),
      ...createEdges('mthyf', ['gtydee'], 'cursada', '#fbbf24'),
      ...createEdges('f3', ['gtydee'], 'cursada', '#fbbf24'),

      // APROBADAS (Rojas Punteadas)
      ...createEdges('am1_e', ['tyeme', 'iyme', 'tdc', 'f3', 'me1', 'e2', 'termo', 'fpas', 'elec1', 'sreyma'], 'aprobada'),
      ...createEdges('aga_e', ['iyme', 'tdc', 'f3', 'e2', 'termo', 'fpas', 'sreyma'], 'aprobada'),
      ...createEdges('iys_e', ['iyme', 'eco_e', 'leg_e'], 'aprobada'),
      ...createEdges('sr', ['iyme'], 'aprobada'),
      ...createEdges('f1_e', ['tyeme', 'iyme', 'tdc', 'f3', 'me1', 'e2', 'termo', 'elec1', 'sreyma'], 'aprobada'),
      ...createEdges('qg', ['me2', 'ieyl'], 'aprobada'),
      ...createEdges('ie1', ['iyme', 'me1'], 'aprobada'),
      ...createEdges('fi', ['me1'], 'aprobada'),
      ...createEdges('f2_e', ['me2', 'sreyma', 'ieyl', 'mthyf'], 'aprobada'),
      ...createEdges('pye_e', ['me2'], 'aprobada'),
      ...createEdges('e1', ['me2', 'ieyl', 'ca', 'elec2', 'ayce'], 'aprobada'),
      ...createEdges('est', ['gtydee'], 'aprobada'),
      ...createEdges('mt', ['gtydee'], 'aprobada'),
      ...createEdges('ie2', ['me2', 'ieyl', 'oyae'], 'aprobada'),
      ...createEdges('i1_e', ['i2_e', 'ieyl'], 'aprobada'),
      ...createEdges('am2_e', ['me2', 'sreyma', 'ieyl', 'ca', 'mthyf'], 'aprobada'),
      ...createEdges('tyeme', ['gtydee', 'sp', 'ayce', 'pf_elec'], 'aprobada'),
      ...createEdges('me1', ['gtydee', 'sp', 'ayce', 'pf_elec'], 'aprobada'),
      ...createEdges('e2', ['gtydee', 'sp', 'ayce', 'pf_elec'], 'aprobada'),
      ...createEdges('termo', ['gtydee'], 'aprobada'),
      ...createEdges('fpas', ['ayce', 'pf_elec'], 'aprobada'),
      ...createEdges('i2_e', ['pf_elec'], 'aprobada')
    ]
  }
};