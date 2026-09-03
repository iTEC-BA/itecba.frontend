import React from "react";
import { ArrowRight, Mail, BookOpen } from "lucide-react";
import { LayoutModal } from "@components/templates/LayoutModal";
import type { Postulante } from "../../types/trueketec.types";

export const PostulanteModal: React.FC<{ postulante: Postulante | null; onClose: () => void; }> = ({ postulante, onClose }) => {
  if (!postulante) return null;
  return (
    <LayoutModal isOpen={!!postulante} onClose={onClose} title={`Expediente: ${postulante.userName}`} description="Documentación vinculada al alumno." maxWidth="max-w-md">
      <div className="flex flex-col gap-5 px-6 py-6">
        <a href={`mailto:${postulante.userEmail}`} className="flex items-center gap-3 text-sm font-mono text-white hover:underline pb-5 border-b border-itec-border">
          <div className="p-2.5 bg-itec-surface border border-itec-border rounded-xl"><Mail size={16} className="text-itec-blue-skye" /></div>
          {postulante.userEmail}
        </a>

        {postulante.ofertas.length === 0 ? (
          <div className="bg-itec-surface rounded-xl border border-itec-border p-8 text-center text-[10px] uppercase tracking-widest font-bold text-white/30">0 Registros Activos</div>
        ) : (
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted px-1">Permutas Ofertadas</span>
            {postulante.ofertas.map((oferta) => (
              <div key={oferta._id} className="flex flex-col gap-4 rounded-xl border border-itec-border bg-itec-box p-5">
                <div className="flex items-start gap-3 border-b border-itec-border pb-3">
                  <BookOpen size={16} className="mt-0.5 shrink-0 text-itec-muted" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-itec-blue-skye uppercase tracking-wider mb-0.5">{oferta.departamento}</span>
                    <span className="text-sm font-bold text-white leading-tight">{oferta.materia}</span>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 bg-itec-surface border border-itec-border p-3 rounded-lg">
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] uppercase tracking-widest text-itec-muted font-bold">Ofrece</span>
                    <span className="font-mono text-sm font-bold text-white mt-1">{oferta.comision_actual}</span>
                  </div>
                  <div className="text-white/20"><ArrowRight size={14} /></div>
                  <div className="flex flex-col text-center">
                    <span className="text-[9px] uppercase tracking-widest text-itec-muted font-bold">Busca</span>
                    <span className="font-mono text-sm font-bold text-itec-blue-skye mt-1">{oferta.comision_deseada}</span>
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
