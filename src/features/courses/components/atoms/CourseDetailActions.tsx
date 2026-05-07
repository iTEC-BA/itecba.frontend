// src/features/courses/components/atoms/CourseDetailActions.tsx
// Barra de acciones del detalle de un curso (compartir, recursos, admin).
// Átomo puro: sin lógica propia, recibe todo por props.

import React from "react";
import { Icons } from "@/components/ui/icons/Icons";

interface Props {
  isAdmin: boolean;
  copySuccess: boolean;
  relatedResourcesCount: number;
  onShare: () => void;
  onOpenMaterialModal: () => void;
  onOpenAddResourceModal: () => void;
  onDelete: () => void;
}

export const CourseDetailActions: React.FC<Props> = ({
  isAdmin,
  copySuccess,
  relatedResourcesCount,
  onShare,
  onOpenMaterialModal,
  onOpenAddResourceModal,
  onDelete,
}) => (
  <div className="flex flex-wrap items-center gap-3 mt-4">
    <button
      onClick={onShare}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold active:scale-95"
    >
      <div className="w-4 h-4">
        <Icons type={copySuccess ? "check" : "share"} />
      </div>
      {copySuccess ? "¡Copiado!" : "Compartir"}
    </button>

    {relatedResourcesCount > 0 && (
      <button
        onClick={onOpenMaterialModal}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-semibold active:scale-95"
      >
        <div className="w-4 h-4"><Icons type="file" /></div>
        {relatedResourcesCount} Recursos
      </button>
    )}

    {isAdmin && (
      <>
        <button
          onClick={onOpenAddResourceModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-all text-sm font-semibold active:scale-95"
        >
          <div className="w-4 h-4"><Icons type="plus" /></div>
          Añadir Recurso
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-semibold active:scale-95"
        >
          <div className="w-4 h-4"><Icons type="trash" /></div>
          Eliminar
        </button>
      </>
    )}
  </div>
);
