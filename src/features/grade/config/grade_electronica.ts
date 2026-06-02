import type { GradeConfig } from '../types/grade.types';

export const GRADE_ELECTRONICA: GradeConfig = {
  id: 'electronica',
  titulo: 'Ingeniería Electrónica',
  descripcion: 'Plan de estudios, materias y correlativas de la carrera.',
  duracion: '5 años y medio',
  grado: 'Ingeniero/a en Electrónica',

  descripcionMd: `
## ¿Qué vas a aprender?

La carrera forma ingenieros/as capaces de diseñar, desarrollar e implementar **sistemas electrónicos analógicos y digitales**, comunicaciones, control automático y sistemas embebidos.

> 💡 **Título intermedio:** Técnico Universitario en Electrónica al aprobar el 3er año.

## Perfil del egresado

- Diseño de circuitos y sistemas electrónicos
- Telecomunicaciones y procesamiento de señales
- Automatización industrial y control
- Hardware, embedded systems e IoT

## Modalidad de cursada

Presencial en **Sede Campus** (Mozart 2300, CABA) para el Ciclo Básico y en **Sede Medrano** (Av. Medrano 951) para las materias específicas.
`,

  media: [
    { tipo: 'imagen', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', titulo: 'Laboratorio de Electrónica' },
    { tipo: 'video',  url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', titulo: 'Presentación de la carrera' },
    { tipo: 'imagen', url: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800', titulo: 'Circuitos integrados' },
  ],

  plan: [
    {
      anio: 1, label: '1er Año',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materias: [
        { codigo: 'AM1',   nombre: 'Análisis Matemático I' },
        { codigo: 'AGA',   nombre: 'Álgebra y Geometría Analítica' },
        { codigo: 'F1',    nombre: 'Física I' },
        { codigo: 'ING1',  nombre: 'Inglés I' },
        { codigo: 'QUI',   nombre: 'Química' },
        { codigo: 'IyS',   nombre: 'Ingeniería y Sociedad' },
        { codigo: 'ELEC1', nombre: 'Electrónica I' },
      ],
    },
    {
      anio: 2, label: '2do Año',
      materias: [
        { codigo: 'AM2',   nombre: 'Análisis Matemático II',     correlativasCursada: ['AM1'] },
        { codigo: 'F2',    nombre: 'Física II',                  correlativasCursada: ['F1', 'AM1'] },
        { codigo: 'ING2',  nombre: 'Inglés II',                  correlativasCursada: ['ING1'] },
        { codigo: 'ELEC2', nombre: 'Electrónica II',             correlativasCursada: ['ELEC1'] },
        { codigo: 'CDIG',  nombre: 'Circuitos Digitales',        correlativasCursada: ['ELEC1'] },
        { codigo: 'PyE',   nombre: 'Probabilidad y Estadística', correlativasCursada: ['AM1'] },
      ],
    },
    {
      anio: 3, label: '3er Año',
      materias: [
        { codigo: 'AM3',   nombre: 'Análisis Matemático III', correlativasCursada: ['AM2'] },
        { codigo: 'ELEC3', nombre: 'Electrónica III',         correlativasCursada: ['ELEC2', 'F2'] },
        { codigo: 'EMBD',  nombre: 'Sistemas Embebidos',      correlativasCursada: ['CDIG'] },
        { codigo: 'CD',    nombre: 'Comunicación de Datos',   correlativasCursada: ['F2'] },
        { codigo: 'CONT',  nombre: 'Control Automático I',    correlativasCursada: ['AM3'] },
      ],
    },
    {
      anio: 4, label: '4to Año',
      materias: [
        { codigo: 'ELEC4', nombre: 'Electrónica IV',          correlativasCursada: ['ELEC3'] },
        { codigo: 'REDES', nombre: 'Redes de Comunicaciones', correlativasCursada: ['CD'] },
        { codigo: 'CONT2', nombre: 'Control Automático II',   correlativasCursada: ['CONT'] },
        { codigo: 'E1',    nombre: 'Electiva I' },
        { codigo: 'PF',    nombre: 'Proyecto Final I',        correlativasAprobada: ['ELEC3', 'EMBD'] },
      ],
    },
    {
      anio: 5, label: '5to Año',
      materias: [
        { codigo: 'TF',  nombre: 'Trabajo Final de Carrera', correlativasAprobada: ['PF'] },
        { codigo: 'E2',  nombre: 'Electiva II' },
        { codigo: 'DER', nombre: 'Legislación' },
      ],
    },
  ],

  info: [
    { icono: '💼', titulo: 'Salida Laboral', descripcion: 'Industria electrónica, telecomunicaciones, automatización industrial, IoT, diseño de hardware y sistemas embebidos.' },
    { icono: '📋', titulo: 'Requisitos',     descripcion: 'Título secundario completo. Ingreso por PREINGENIERÍA UTN-FRBA.' },
    { icono: '📍', titulo: 'Sede',           descripcion: 'UTN – FRBA. Medrano 951, CABA.' },
    { icono: '🎓', titulo: 'Título',         descripcion: 'Ingeniero/a en Electrónica. Título intermedio: Técnico Universitario en Electrónica.' },
  ],
};
