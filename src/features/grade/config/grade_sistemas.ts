import type { GradeConfig } from '../types/grade.types';

export const GRADE_SISTEMAS: GradeConfig = {
  id: 'sistemas',
  titulo: 'Ingeniería en Sistemas de Información',
  descripcion: 'Plan de estudios, materias y correlativas de la carrera.',
  duracion: '5 años y medio',
  grado: 'Ingeniero en Sistemas de Información',

  descripcionMd: `
## ¿Qué vas a aprender?

La carrera combina **matemática**, **programación**, **redes** e **ingeniería de software** para formar profesionales capaces de diseñar, desarrollar y gestionar sistemas de información complejos.

Vas a trabajar con bases de datos, arquitectura de sistemas, inteligencia artificial, seguridad informática y gestión de proyectos.

> 💡 **Título intermedio:** Analista Universitario de Sistemas al aprobar el 3er año.

## Perfil del egresado

- Diseño y desarrollo de software a gran escala
- Arquitectura y administración de sistemas de información
- Gestión de proyectos de tecnología
- Consultoría y auditoría de sistemas

## Modalidad de cursada

Presencial en **Sede Medrano** (Av. Medrano 951, Almagro, CABA) y **Sede Campus** (Mozart 2300, Parque Avellaneda). Las materias del Ciclo Básico (1er año) se cursan en Campus; las específicas a partir de 2do/3er año en Medrano.
`,

  media: [
    { tipo: 'imagen', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', titulo: 'Laboratorio de Sistemas' },
    { tipo: 'video',  url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', titulo: 'Presentación de la carrera' },
    { tipo: 'imagen', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', titulo: 'Programación aplicada' },
    { tipo: 'imagen', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', titulo: 'Desarrollo de software' },
  ],

  plan: [
    {
      anio: 1, label: '1er Año',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materias: [
        { codigo: 'AM1',  nombre: 'Análisis Matemático I' },
        { codigo: 'AGA',  nombre: 'Álgebra y Geometría Analítica' },
        { codigo: 'F1',   nombre: 'Física I' },
        { codigo: 'ING1', nombre: 'Inglés I' },
        { codigo: 'LyED', nombre: 'Lógica y Estructuras Discretas' },
        { codigo: 'AyED', nombre: 'Algoritmos y Estructuras de Datos' },
        { codigo: 'AdC',  nombre: 'Arquitectura de Computadoras' },
        { codigo: 'SyPN', nombre: 'Sistemas y Procesos de Negocio' },
        { codigo: 'IyS',  nombre: 'Ingeniería y Sociedad' },
      ],
    },
    {
      anio: 2, label: '2do Año',
      materias: [
        { codigo: 'AM2',  nombre: 'Análisis Matemático II',      correlativasCursada: ['AM1', 'AGA'] },
        { codigo: 'F2',   nombre: 'Física II',                   correlativasCursada: ['AM1', 'F1'] },
        { codigo: 'ING2', nombre: 'Inglés II',                   correlativasCursada: ['ING1'] },
        { codigo: 'SySL', nombre: 'Sintaxis y Semántica',        correlativasCursada: ['LyED', 'AyED'] },
        { codigo: 'PdP',  nombre: 'Paradigmas de Programación',  correlativasCursada: ['LyED', 'AyED'] },
        { codigo: 'SSOO', nombre: 'Sistemas Operativos',         correlativasCursada: ['AdC'] },
        { codigo: 'ASI',  nombre: 'Análisis de Sistemas',        correlativasCursada: ['AyED', 'SyPN'] },
        { codigo: 'PyE',  nombre: 'Probabilidad y Estadística',  correlativasCursada: ['AM1', 'AGA'] },
        { codigo: 'ECO',  nombre: 'Economía',                    correlativasAprobada: ['AM1', 'AGA'] },
      ],
    },
    {
      anio: 3, label: '3er Año',
      materias: [
        { codigo: 'BD',  nombre: 'Bases de Datos',         correlativasCursada: ['SySL', 'ASI'], correlativasAprobada: ['LyED', 'AyED'] },
        { codigo: 'DdS', nombre: 'Desarrollo de Software', correlativasCursada: ['PdP', 'ASI'],  correlativasAprobada: ['LyED', 'AyED'] },
        { codigo: 'CD',  nombre: 'Comunicación de Datos',  correlativasAprobada: ['F1', 'AdC'] },
        { codigo: 'AN',  nombre: 'Análisis Numérico',      correlativasCursada: ['AM2'],         correlativasAprobada: ['AM1', 'AGA'] },
        { codigo: 'DSI', nombre: 'Diseño de Sistemas',     correlativasCursada: ['PdP', 'ASI'],  correlativasAprobada: ['LyED', 'AyED'] },
        { codigo: 'GPy', nombre: 'Gestión de Proyectos',   correlativasCursada: ['ASI'],         correlativasAprobada: ['ECO'] },
        { codigo: 'AM3', nombre: 'Análisis Matemático III',correlativasCursada: ['AM2'],         correlativasAprobada: ['AM1', 'AGA'] },
      ],
    },
    {
      anio: 4, label: '4to Año',
      materias: [
        { codigo: 'ISI',   nombre: 'Ingeniería de Sistemas',       correlativasCursada: ['DSI'],        correlativasAprobada: ['ASI'] },
        { codigo: 'Redes', nombre: 'Redes de Información',         correlativasCursada: ['CD'],          correlativasAprobada: ['F1', 'AdC'] },
        { codigo: 'AISI',  nombre: 'Auditoría y Seg. Informática', correlativasCursada: ['BD', 'DSI'] },
        { codigo: 'E1',    nombre: 'Electiva I' },
        { codigo: 'LAB1',  nombre: 'Laboratorio de Proyectos I',   correlativasCursada: ['GPy', 'DdS'] },
        { codigo: 'IORE',  nombre: 'Investigación Operativa',      correlativasCursada: ['PyE', 'AN'] },
      ],
    },
    {
      anio: 5, label: '5to Año',
      materias: [
        { codigo: 'PI',   nombre: 'Proyecto Final',              correlativasAprobada: ['ISI', 'LAB1'] },
        { codigo: 'E2',   nombre: 'Electiva II' },
        { codigo: 'E3',   nombre: 'Electiva III' },
        { codigo: 'LAB2', nombre: 'Laboratorio de Proyectos II', correlativasCursada: ['LAB1'] },
        { codigo: 'DER',  nombre: 'Derecho Informático',         correlativasAprobada: ['ECO'] },
      ],
    },
    {
      anio: 6, label: 'Fin de Carrera',
      materias: [
        { codigo: 'TF', nombre: 'Trabajo Final de Carrera', correlativasAprobada: ['PI', 'LAB2'] },
      ],
    },
  ],

  info: [
    { icono: '💼', titulo: 'Salida Laboral',       descripcion: 'Amplio mercado en desarrollo de software, arquitectura de sistemas, gestión de TI y consultorías.' },
    { icono: '📋', titulo: 'Requisitos',            descripcion: 'Título secundario completo. Ingreso por PREINGENIERÍA + Ciclo Básico UTN-FRBA. Sin examen eliminatorio.' },
    { icono: '📍', titulo: 'Sede',                  descripcion: 'UTN – FRBA. Medrano 951 (Almagro) y Campus Mozart 2300 (Parque Avellaneda), CABA.' },
    { icono: '⏰', titulo: 'Carga Horaria',         descripcion: 'Aprox. 4.000 horas distribuidas en 5 años y medio. Turnos mañana, tarde y noche.' },
    { icono: '🎓', titulo: 'Título',                descripcion: 'Ingeniero/a en Sistemas de Información. Título intermedio: Analista Universitario de Sistemas.' },
    { icono: '🌐', titulo: 'Modalidad',             descripcion: 'Presencial. Algunos electivos disponibles en modalidad semi-presencial.' },
  ],
};
