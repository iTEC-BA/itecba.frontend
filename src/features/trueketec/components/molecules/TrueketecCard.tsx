// src/features/trueketec/components/molecules/TrueketecCard.tsx
import React, { useState } from "react";
import { ArrowRight, Sparkles, Trash2, CheckCheck, BookOpen } from "lucide-react";
import { Button } from "@components/ui/Button";
import { TurnoBadge } from "../atoms/TurnoBadge";
import type { TrueketecPost } from "../../types/trueketec.types";

interface Props {
  post:      TrueketecPost;
  isOwn?:    boolean;
  myPostId?: string; // ID de MI post que genera el match
  onDelete?: (id: string) => void;
  onAccept?: (myPostId: string, targetPostId: string) => Promise<{ theirEmail: string }>;
}

export const TrueketecCard: React.FC<Props> = ({
  post, isOwn, myPostId, onDelete, onAccept,
}) => {
  const [accepting, setAccepting]         = useState(false);
  const [accepted,  setAccepted]          = useState(false);
  const [revealedEmail, setRevealedEmail] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!myPostId || !onAccept) return;
    setAccepting(true);
    try {
      const res = await onAccept(myPostId, post._id);
      setRevealedEmail(res.theirEmail);
      setAccepted(true);
    } finally {
      setAccepting(false);
    }
  };

  const isMatch     = post.isMatch && !isOwn;
  const isCompleted = post.estado === "completado";

  return (
    <div
      className={`
        relative flex flex-col gap-3 rounded-3xl border p-4
        transition-all duration-200
        ${isMatch
          ? "border-itec-emerald/40 bg-itec-emerald/5 shadow-[0_0_24px_rgba(0,0,0,0.3)]"
          : "border-itec-border bg-itec-box hover:border-white/15"}
        ${isCompleted ? "opacity-60" : ""}
      `}
    >
      {/* Badge de match */}
      {isMatch && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-itec-emerald px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-itec-emerald/30">
          <Sparkles size={10} />
          MATCH DIRECTO
        </span>
      )}

      {/* Materia */}
      <div className="flex items-start gap-2">
        <BookOpen size={14} className="mt-0.5 shrink-0 text-itec-muted" />
        <span className="text-sm font-bold text-itec-text leading-tight">{post.materia}</span>
      </div>

      {/* Comisiones */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-itec-muted font-medium uppercase tracking-widest">Tiene</span>
          <span className="rounded-xl bg-itec-surface border border-itec-border px-3 py-1 font-mono text-sm font-bold text-itec-text">
            {post.comision_actual}
          </span>
          <TurnoBadge turno={post.turno_actual} />
        </div>

        <ArrowRight size={16} className="text-itec-muted shrink-0 mt-1" />

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-itec-muted font-medium uppercase tracking-widest">Busca</span>
          <span className={`rounded-xl border px-3 py-1 font-mono text-sm font-bold
            ${isMatch
              ? "border-itec-emerald/40 bg-itec-emerald/10 text-itec-emerald"
              : "border-itec-border bg-itec-surface text-itec-text"}`}>
            {post.comision_deseada}
          </span>
          <TurnoBadge turno={post.turno_deseado} />
        </div>
      </div>

      {/* Email revelado tras match */}
      {(revealedEmail || post.matchedEmail) && (
        <div className="flex items-center gap-2 rounded-2xl border border-itec-emerald/30 bg-itec-emerald/10 px-3 py-2">
          <CheckCheck size={13} className="text-itec-emerald shrink-0" />
          <span className="text-xs text-itec-emerald font-medium">
            Contacto: <strong>{revealedEmail ?? post.matchedEmail}</strong>
          </span>
        </div>
      )}

      {/* Fecha */}
      <p className="text-[11px] text-itec-muted">
        {new Date(post.createdAt).toLocaleDateString("es-AR", {
          day: "numeric", month: "short", year: "numeric",
        })}
      </p>

      {/* Acciones */}
      <div className="flex gap-2 mt-1">
        {isMatch && !accepted && !isCompleted && myPostId && onAccept && (
          <Button
            variant="success"
            hierarchy="solid"
            text="Aceptar intercambio"
            isLoading={accepting}
            onClick={handleAccept}
            className="flex-1 rounded-2xl text-xs py-2"
          />
        )}
        {accepted && (
          <span className="flex-1 text-center text-xs text-itec-emerald font-bold py-2">
            ✅ ¡Intercambio confirmado!
          </span>
        )}
        {isOwn && onDelete && !isCompleted && (
          <button
            onClick={() => onDelete(post._id)}
            className="ml-auto flex items-center gap-1 rounded-2xl px-3 py-2 text-xs text-itec-muted hover:text-itec-accent hover:bg-itec-accent/10 transition-colors"
          >
            <Trash2 size={13} />
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};
