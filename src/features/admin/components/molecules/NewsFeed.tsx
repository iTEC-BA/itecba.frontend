import React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AnnouncementData } from "../../services/adminService";
import { Trash2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  announcements: AnnouncementData[];
  isLoading: boolean;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}

export const NewsFeed: React.FC<Props> = ({ announcements, isLoading, deleteMutation }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-white/5 border border-itec-border" />
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-itec-border bg-transparent">
        <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Bandeja vacía</p>
        <p className="mt-1 text-xs text-itec-muted/70">No hay avisos activos en este momento.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {announcements.map((a) => {
        const isCrit = a.isCritical;
        
        // Formateo de fecha similar a "08-AGO, 06:09 P. M."
        const dateObj = a.expiresAt.toDate();
        const dateStr = dateObj.toLocaleDateString("es-AR", { day: '2-digit', month: 'short' }).replace('.', '').toUpperCase();
        const timeStr = dateObj.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

        return (
          <div 
            key={a.id} 
            className={cn(
              "flex flex-col gap-4 p-5 rounded-xl border relative transition-colors", 
              isCrit ? "border-itec-red/40 bg-transparent" : "border-itec-border bg-transparent hover:bg-white/[0.02]"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 pl-1">
                <div className="flex items-center gap-2 mb-2">
                  {isCrit && <AlertTriangle className="w-4 h-4 text-itec-red" />}
                  <h4 className={cn("truncate text-sm font-bold", isCrit ? "text-itec-red" : "text-itec-text")}>
                    {a.title}
                  </h4>
                </div>
                <p className="text-sm text-itec-text leading-relaxed line-clamp-3 whitespace-pre-wrap break-words">{a.message}</p>
              </div>

              <button
                onClick={() => {
                  if(window.confirm("¿Seguro que deseas eliminar este aviso?")) {
                    deleteMutation.mutate(a.id);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-itec-text hover:text-itec-red transition-all disabled:opacity-50 shrink-0"
                title="Eliminar aviso"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 pl-1">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-itec-text" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-itec-text">
                  VENCE: {dateStr}, {timeStr}
                </span>
              </div>
              
              {isCrit && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-itec-red bg-itec-red/10 border border-itec-red/20 px-3 py-1 rounded-md">
                  Crítico
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
