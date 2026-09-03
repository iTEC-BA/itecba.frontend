import React from "react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { TrueketecCard } from "../molecules/TrueketecCard";
import type { TrueketecPost } from "../../types/trueketec.types";
import { CheckCircle2, BookMarked } from "lucide-react";
import { LIMITE_SOLICITUDES_ACTIVAS, MENSAJES } from "../../data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  matches: TrueketecPost[];
  myPosts: TrueketecPost[];
  onContact: (post: TrueketecPost) => void;
}

export const MyPostsModal: React.FC<Props> = ({ isOpen, onClose, matches, myPosts, onContact }) => {
  const misActivos = myPosts.filter(p => p.estado === "Activo");

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Panel de Gestión" description="Tus solicitudes y coincidencias actuales." maxWidth="max-w-4xl">
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">

        {matches.length === 0 && misActivos.length === 0 ? (
          <div className="bg-itec-surface rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 border border-itec-border">
            <BookMarked className="w-8 h-8 text-itec-muted opacity-50" />
            <p className="text-sm text-itec-muted font-medium">{MENSAJES.sinExpedientes}</p>
          </div>
        ) : (
          <>
            {matches.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-itec-section-trueketec/10 rounded text-itec-section-trueketec"><CheckCircle2 size={14} strokeWidth={3}/></div>
                  <h3 className="text-[10px] font-bold text-itec-section-trueketec uppercase tracking-widest">Coincidencias Detectadas ({matches.length})</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matches.map((m) => <TrueketecCard key={m._id} post={{ ...m, isPerfectMatch: true }} onContact={onContact} />)}
                </div>
              </div>
            )}

            {misActivos.length > 0 && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center justify-between border-b border-itec-border pb-2">
                  <h3 className="text-[10px] font-bold text-itec-muted uppercase tracking-widest px-1">Registros Activos</h3>
                  <span className="text-[10px] font-mono font-bold text-itec-muted bg-itec-box px-2 py-0.5 rounded border border-itec-border">{misActivos.length} / {LIMITE_SOLICITUDES_ACTIVAS} Límite</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {misActivos.map((p) => <TrueketecCard key={p._id} post={p} onContact={onContact} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutModal>
  );
};
