import React from "react";
import { User, Clock, FileText, Handshake, ArrowRight } from "lucide-react";
import { EstadoBadge } from "../atoms/EstadoBadge";
import { TurnoBadge } from "../atoms/TurnoBadge";
import { Button } from "@components/ui/Button";
import type { TrueketecPost } from "../../types/trueketec.types";
import { cn } from "@/lib/utils";

interface Props { post: TrueketecPost; onContact?: (post: TrueketecPost) => void; }

export const TrueketecCard: React.FC<Props> = ({ post, onContact }) => {
  const isCompleted = post.estado === "Trueque Realizado";
  const isPerfect = post.isPerfectMatch;

  return (
    <article className={cn(
      "flex flex-col rounded-2xl p-4 gap-4 transition-colors duration-200 h-full border border-itec-border",
      isPerfect ? "bg-itec-section-trueketec/10 border-itec-section-trueketec/30" : "bg-itec-box hover:bg-itec-surface",
      isCompleted && "opacity-50 grayscale"
    )}>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", isPerfect ? "text-itec-section-trueketec" : "text-itec-muted")}>
            {post.departamento}
          </span>
          {isPerfect ? (
            <span className="px-2 py-0.5 rounded bg-itec-section-trueketec text-white text-[9px] font-bold uppercase tracking-widest shrink-0 flex items-center gap-1">
              <Handshake size={10}/> Coincidencia
            </span>
          ) : (
            <EstadoBadge estado={post.estado} />
          )}
        </div>
        <h3 className="text-base font-bold text-white leading-tight line-clamp-2" title={post.materia}>
          {post.materia}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-itec-muted mt-1">
          <User size={12} className="shrink-0" />
          <span className="truncate">{post.userName || post.userEmail?.split("@")[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-auto bg-itec-surface rounded-xl p-3 border border-itec-border">
        <div className="flex flex-col gap-1 text-center">
          <span className="text-[9px] uppercase tracking-widest text-itec-muted font-bold">Posee</span>
          <span className="font-mono text-sm font-bold text-white">{post.comision_actual}</span>
          <TurnoBadge turno={post.turno_actual} />
        </div>
        <div className="text-itec-muted/40 shrink-0"><ArrowRight size={14} /></div>
        <div className="flex flex-col gap-1 text-center">
          <span className="text-[9px] uppercase tracking-widest text-itec-muted font-bold">Requiere</span>
          <span className={cn("font-mono text-sm font-bold", isPerfect ? "text-itec-section-trueketec" : "text-white")}>
            {post.comision_deseada}
          </span>
          <TurnoBadge turno={post.turno_deseado} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-itec-muted">
          <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString("es-AR")}
        </div>
        {onContact && !isCompleted && (
          <Button
            variant="primary"
            hierarchy={isPerfect ? "solid" : "outline"}
            text="Gestionar"
            icon={<FileText size={12} />}
            onClick={() => onContact(post)}
            className={cn(
              "py-2 px-4 text-[10px] uppercase tracking-wider rounded-lg",
              isPerfect
                ? "bg-itec-section-trueketec text-white border-transparent hover:bg-itec-section-trueketec/80"
                : "bg-itec-surface text-itec-text border-itec-border hover:bg-itec-bg"
            )}
          />
        )}
      </div>
    </article>
  );
};
