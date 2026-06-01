// src/features/aulas/components/molecules/AulaCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Layers} from "lucide-react";
import { FuncionBadge } from "../atoms/FuncionBadge";
import type { AulaResumen } from "../../types/aulas.types";

interface Props {
  aula:      AulaResumen;
}

const SEDE_LABEL: Record<string, string> = { medrano: "Medrano", campus: "Campus" };

export const AulaCard: React.FC<Props> = ({ aula}) => {
  return (
    <article className="group relative flex flex-col gap-3 rounded-xl border border-white/8 bg-itec-box p-4 transition-all duration-200 hover:border-white/14 hover:bg-itec-card">
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
