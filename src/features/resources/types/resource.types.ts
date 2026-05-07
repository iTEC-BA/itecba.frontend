/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ResourceData {
  id: string;
  title: string;
  carrera: string;
  nivel: string;
  materia: string;
  tipo: string;
  formato: string;
  link: string;
  autor: string;
  createdAt?: any;
  submittedBy?: string;
}

export interface ResourceFormState {
  title: string;
  carrera: string;
  nivel: string;
  materia: string;
  tipo: string;
  formato: string;
  link: string;
}

export const TIPOS_ARCHIVO = [
  { value: 'Apunte',   label: 'Apunte de Clase' },
  { value: 'Resumen',  label: 'Resumen Teórico' },
  { value: 'Parcial',  label: 'Modelo de Parcial' },
  { value: 'Final',    label: 'Modelo de Final' },
  { value: 'Guía',     label: 'Guía de Ejercicios' },
  { value: 'Carpeta',  label: 'Carpeta Drive Completa' },
] as const;

export const FORMATOS_ARCHIVO = [
  { value: 'PDF',    label: 'Documento PDF' },
  { value: 'Drive',  label: 'Google Drive' },
  { value: 'Notion', label: 'Notion / Web' },
  { value: 'ZIP',    label: 'Archivo Comprimido' },
] as const;

export const FORMATO_META: Record<string, { color: string; short: string }> = {
  PDF:    { color: 'text-red-400',   short: 'PDF' },
  Drive:  { color: 'text-green-400', short: 'GDR' },
  Notion: { color: 'text-blue-400',  short: 'NTN' },
  ZIP:    { color: 'text-yellow-400',short: 'ZIP' },
};
