// src/features/aulas/components/molecules/AulaCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Layers, Pencil, Trash2 } from "lucide-react";
import { FuncionBadge } from "../atoms/FuncionBadge";
import type { AulaResumen } from "../../types/aulas.types";

interface Props {
  aula:      AulaResumen;
  isAdmin?:  boolean;
  onEdit?:   (aula: AulaResumen) => void;
  onDelete?: (aula: AulaResumen) => void;
}

const SEDE_LABEL: Record<string, string> = { medrano: "Medrano", campus: "Campus" };

export const AulaCard: React.FC<Props> = ({ aula, isAdmin, onEdit, onDelete }) => {
  return (
    <article className="group relative flex flex-col gap-3 rounded-xl border border-white/8 bg-itec-box p-4 transition-all duration-200 hover:border-white/14 hover:bg-itec-card">

      {/* Admin controls — visibles solo en hover */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => { e.preventDefault(); onEdit?.(aula); }}
            className="flex items-center justify-center w-7 h-7 rounded-xl bg-itec-surface border border-white/10 text-itec-muted hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Editar aula"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onDelete?.(aula); }}
            className="flex items-center justify-center w-7 h-7 rounded-xl bg-itec-surface border border-white/10 text-itec-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            aria-label="Eliminar aula"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      <Link to={`/aulas/${aula.slug}`} className="flex flex-col gap-3 flex-1 min-h-0">

        {/* Header: sede + número + badge función */}
        <div className="flex items-start justify-between gap-2 pr-8">
          <div className="min-w-0">
            <span className="text-xs font-bold text-itec-muted uppercase tracking-widest block truncate">
              {SEDE_LABEL[aula.sede] ?? aula.sede}
            </span>
            <h3 className="text-lg font-black text-itec-text leading-tight truncate">
              {aula.numero}
            </h3>
          </div>
          <FuncionBadge funcion={aula.funcion} size="sm" />
        </div>

        {/* Meta: piso + pasillo */}
        <div className="flex items-center gap-3 text-xs text-itec-muted">
          <span className="flex items-center gap-1">
            <Layers size={11} /> Piso {aula.piso}
          </span>
          {aula.pasillo && (
            <span className="flex items-center gap-1 truncate">
              <MapPin size={11} /> {aula.pasillo}
            </span>
          )}
        </div>

        {/* Carrera / departamento */}
        {aula.carrera && (
          <p className="text-[11px] text-itec-muted/70 truncate">{aula.carrera}</p>
        )}
      </Link>
    </article>
  );
};
