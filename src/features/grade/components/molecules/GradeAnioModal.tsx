// GradeAnioModal.tsx — Usa LayoutModal global. Video arriba, materias abajo.
import React from 'react';
import { LayoutModal }    from '@components/templates/LayoutModal';
import { GradeMateriaRow } from '../atoms/GradeMateriaRow';
import type { AnioEstudios } from '../../types/grade.types';

interface Props {
  anio: AnioEstudios;
  onClose: () => void;
  /** Mapa código → nombre oficial de la DB */
  byCode?: Record<string, string>;
}

export const GradeAnioModal: React.FC<Props> = ({ anio, onClose, byCode = {} }) => (
  <LayoutModal
    isOpen
    onClose={onClose}
    title={anio.label}
    description={`${anio.materias.length} materia${anio.materias.length !== 1 ? 's' : ''}`}
    maxWidth="max-w-xl"
  >
    <div className="px-4 pb-4 space-y-4">
      {/* Video introductorio */}
      {anio.videoUrl && (
        <div className="aspect-video rounded-xl overflow-hidden border border-itec-border bg-itec-bg mt-4">
          <iframe
            src={anio.videoUrl}
            title={`Video ${anio.label}`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}

      {/* Lista de materias */}
      <div className="space-y-0.5">
        {anio.materias.map(m => (
          <GradeMateriaRow
            key={m.codigo}
            materia={m}
            nombreDB={byCode[m.codigo.toUpperCase()]}
          />
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 pt-1 border-t border-itec-border">
        <span className="flex items-center gap-1.5 text-[11px] text-itec-blue-skye">
          <span className="w-3 h-px bg-itec-blue-skye rounded" /> Para cursar
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-itec-red-skye">
          <span className="w-3 h-px bg-itec-red-skye rounded" /> Para rendir
        </span>
      </div>
    </div>
  </LayoutModal>
);
