// src/features/trueketec/components/molecules/TrueketecCard.tsx
import React from "react";
import { ArrowRight, Sparkles, BookOpen, Mail } from "lucide-react";
import { EstadoBadge } from "../atoms/EstadoBadge";
import { TurnoBadge }  from "../atoms/TurnoBadge";
import type { TrueketecPost } from "../../types/trueketec.types";

interface Props {
  post:          TrueketecPost;
  onContact?:    (post: TrueketecPost) => void; // Abre Modal 1
}

export const TrueketecCard: React.FC<Props> = ({ post, onContact }) => {
  const isPerfect   = post.isPerfectMatch;
  const isCompleted = post.estado === "Trueque Realizado";

  return (
    <article
      className={`
        relative flex flex-col gap-3 rounded-3xl border p-4 transition-all duration-200
        ${isPerfect
          ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_32px_rgba(16,185,129,0.12)]"
          : "border-white/8 bg-itec-box hover:border-white/14 hover:bg-itec-card"
        }
        ${isCompleted ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      {/* ── Banner animado de Match Perfecto ──────────────────────────── */}
      {isPerfect && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="
            inline-flex items-center gap-1.5 rounded-full
            bg-gradient-to-r from-emerald-500 to-teal-500
            px-3 py-1 text-[11px] font-black text-white
            shadow-lg shadow-emerald-500/40
            animate-pulse
          ">
            <Sparkles size={11} className="shrink-0" />
            ¡MATCH PERFECTO!
            <Sparkles size={11} className="shrink-0" />
          </span>
        </div>
      )}

      {/* ── Encabezado: autor + estado ────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-[11px] font-semibold text-itec-muted truncate max-w-[60%]">
          {post.userName || post.userEmail?.split("@")[0] || "Estudiante"}
        </span>
        <EstadoBadge estado={post.estado} />
      </div>

      {/* ── Materia ───────────────────────────────────────────────────── */}
      <div className="flex items-start gap-2">
        <BookOpen size={13} className="mt-0.5 shrink-0 text-itec-muted" />
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-itec-muted/70">{post.departamento}</span>
          <span className="text-sm font-bold text-itec-text leading-tight">{post.materia}</span>
        </div>
      </div>

      {/* ── Comisiones ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-itec-muted uppercase tracking-widest">Tiene</span>
          <span className="rounded-xl bg-itec-surface border border-itec-border px-3 py-1 font-mono text-sm font-bold text-itec-text">
            {post.comision_actual}
          </span>
          <TurnoBadge turno={post.turno_actual} />
        </div>

        <ArrowRight size={14} className="text-itec-muted shrink-0 mt-1" />

        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-itec-muted uppercase tracking-widest">Busca</span>
          <span className={`rounded-xl border px-3 py-1 font-mono text-sm font-bold transition-colors
            ${isPerfect
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-itec-border bg-itec-surface text-itec-text"
            }`}>
            {post.comision_deseada}
          </span>
          <TurnoBadge turno={post.turno_deseado} />
        </div>
      </div>

      {/* ── Footer: fecha + botón Contactar ───────────────────────────── */}
      <div className="flex items-center justify-between gap-2 mt-1 pt-2 border-t border-white/5">
        <span className="text-[10px] text-itec-muted">
          {new Date(post.createdAt).toLocaleDateString("es-AR", {
            day: "numeric", month: "short",
          })}
        </span>
        {onContact && !isCompleted && (
          <button
            onClick={() => onContact(post)}
            className={`
              inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold
              transition-all duration-150 active:scale-95
              ${isPerfect
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-400"
                : "bg-itec-surface border border-itec-border text-itec-text hover:bg-itec-box2"
              }
            `}
          >
            <Mail size={11} />
            Contactarse
          </button>
        )}
      </div>
    </article>
  );
};
