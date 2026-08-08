import React from "react";
import { ArrowRightLeft, Sparkles, Mail, MapPin } from "lucide-react";
import { EstadoBadge } from "../atoms/EstadoBadge";
import { TurnoBadge }  from "../atoms/TurnoBadge";
import type { TrueketecPost } from "../../types/trueketec.types";
import { cn } from "@/lib/utils";

interface Props {
  post: TrueketecPost;
  onContact?: (post: TrueketecPost) => void;
}

export const TrueketecCard: React.FC<Props> = ({ post, onContact }) => {
  const isPerfect   = post.isPerfectMatch;
  const isCompleted = post.estado === "Trueque Realizado";

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border bg-itec-box p-5 transition-all duration-200",
        isPerfect ? "border-itec-emerald/30 shadow-[0_0_20px_rgba(16,185,129,0.08)] bg-itec-emerald/[0.02]" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]",
        isCompleted ? "opacity-50 grayscale-[50%]" : ""
      )}
    >
      {/* ── Banner animado de Match Perfecto ──────────────────────────── */}
      {isPerfect && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-itec-emerald/30 bg-itec-emerald/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-itec-emerald backdrop-blur-md">
            <Sparkles size={12} className="shrink-0" /> Match Perfecto
          </span>
        </div>
      )}

      {/* ── Encabezado: autor + estado ────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50">
            {post.userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-white/80 truncate">
            {post.userName || post.userEmail?.split("@")[0] || "Estudiante"}
          </span>
        </div>
        <EstadoBadge estado={post.estado} />
      </div>

      {/* ── Materia ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <MapPin size={12} /> {post.departamento}
        </div>
        <h3 className="text-sm font-bold leading-tight text-white line-clamp-2">
          {post.materia}
        </h3>
      </div>

      {/* ── Intercambio (Caja Ticket) ─────────────────────────────────── */}
      <div className="relative flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 p-4">
        {/* Origen */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ofrece</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-white">{post.comision_actual}</span>
            <TurnoBadge turno={post.turno_actual} />
          </div>
        </div>

        {/* Separador */}
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute w-full h-px border-t border-dashed border-white/10" />
          <div className="relative rounded-full border border-white/10 bg-itec-box p-1 text-white/30">
            <ArrowRightLeft size={12} />
          </div>
        </div>

        {/* Destino */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Busca</span>
          <div className="flex items-center gap-2">
            <span className={cn("font-mono text-sm font-bold", isPerfect ? "text-itec-emerald" : "text-white")}>
              {post.comision_deseada}
            </span>
            <TurnoBadge turno={post.turno_deseado} />
          </div>
        </div>
      </div>

      {/* ── Footer: fecha + botón Contactar ───────────────────────────── */}
      <div className="mt-auto flex items-end justify-between pt-1">
        <span className="text-[10px] font-medium text-white/40">
          Publicado el {new Date(post.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
        </span>
        {onContact && !isCompleted && (
          <button
            onClick={() => onContact(post)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
              isPerfect
                ? "border-itec-emerald/30 bg-itec-emerald/10 text-itec-emerald hover:bg-itec-emerald hover:text-black"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            )}
            title="Contactar"
          >
            <Mail size={14} />
          </button>
        )}
      </div>
    </article>
  );
};
