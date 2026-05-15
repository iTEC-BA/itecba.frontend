// src/features/trueketec/components/organisms/PostulanteModal.tsx
// Modal 2: Detalle de todas las comisiones que ofrece un interesado.
import React from "react";
import { ArrowRight, BookOpen, Mail } from "lucide-react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { TurnoBadge }  from "../atoms/TurnoBadge";
import type { Postulante } from "../../types/trueketec.types";

interface Props {
  postulante: Postulante | null;
  onClose:    () => void;
}

export const PostulanteModal: React.FC<Props> = ({ postulante, onClose }) => {
  if (!postulante) return null;

  return (
    <LayoutModal
      isOpen={!!postulante}
      onClose={onClose}
      title={`Ofertas de ${postulante.userName}`}
      description={postulante.userEmail}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 px-6 py-5">

        {/* ── Email del interesado ────────────────────────────────────── */}
        <a
          href={`mailto:${postulante.userEmail}`}
          className="flex items-center gap-2 text-sm text-itec-sky hover:underline font-medium"
        >
          <Mail size={14} className="shrink-0" />
          {postulante.userEmail}
        </a>

        {/* ── Publicaciones activas del interesado ───────────────────── */}
        {postulante.ofertas.length === 0 ? (
          <div className="text-center py-8 text-itec-muted">
            <p className="text-sm">Este interesado no tiene publicaciones activas actualmente.</p>
            <p className="text-xs mt-1">Podés contactarlo por email para coordinar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-itec-muted">
              Sus intercambios activos
            </p>
            {postulante.ofertas.map((oferta) => (
              <div
                key={oferta._id}
                className="flex flex-col gap-2 rounded-2xl border border-itec-border bg-itec-surface p-4"
              >
                {/* Materia */}
                <div className="flex items-start gap-2">
                  <BookOpen size={12} className="mt-0.5 shrink-0 text-itec-muted" />
                  <div>
                    <p className="text-[10px] text-itec-muted">{oferta.departamento}</p>
                    <p className="text-sm font-bold text-itec-text leading-tight">{oferta.materia}</p>
                  </div>
                </div>

                {/* Comisiones */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-itec-muted uppercase tracking-widest">Tiene</span>
                    <span className="rounded-lg bg-itec-box border border-itec-border px-2.5 py-0.5 font-mono text-xs font-bold text-itec-text">
                      {oferta.comision_actual}
                    </span>
                    <TurnoBadge turno={oferta.turno_actual} />
                  </div>
                  <ArrowRight size={12} className="text-itec-muted shrink-0 mt-1" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-itec-muted uppercase tracking-widest">Busca</span>
                    <span className="rounded-lg bg-itec-box border border-itec-border px-2.5 py-0.5 font-mono text-xs font-bold text-itec-text">
                      {oferta.comision_deseada}
                    </span>
                    <TurnoBadge turno={oferta.turno_deseado} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutModal>
  );
};
