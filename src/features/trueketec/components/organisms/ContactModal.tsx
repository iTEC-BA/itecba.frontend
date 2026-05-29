// src/features/trueketec/components/organisms/ContactModal.tsx
// Modal 1: Muestra email del publicador.
//   - Si es el dueño: permite cambiar estado + ver lista de interesados.
//   - Si NO es el dueño: muestra email y botón "Postularme".
import React, { useState, useEffect } from "react";
import { Mail, CheckCheck, Clock, Handshake, Users } from "lucide-react";
import { LayoutModal }         from "@components/templates/LayoutModal";
import { Button }              from "@components/ui/Button";
import { EstadoBadge }         from "../atoms/EstadoBadge";
import { trueketecService }    from "../../services/trueketec.service";
import type { TrueketecPost, EstadoPost, Postulante } from "../../types/trueketec.types";

interface Props {
  post:            TrueketecPost | null;
  isOwn:           boolean;
  onClose:         () => void;
  onEstadoChanged: (postId: string, estado: EstadoPost) => void;
  onOpenPostulante:(postulante: Postulante) => void;
}

const ESTADOS_OPCIONES: EstadoPost[] = ["Activo", "En Negociación", "Trueque Realizado"];

export const ContactModal: React.FC<Props> = ({
  post, isOwn, onClose, onEstadoChanged, onOpenPostulante,
}) => {
  const [savingEstado, setSavingEstado]     = useState(false);
  const [postulando, setPostulando]         = useState(false);
  const [yaPostulado, setYaPostulado]       = useState(false);
  const [postulantes, setPostulantes]       = useState<Postulante[]>([]);
  const [loadingPost, setLoadingPost]       = useState(false);
  const [feedbackMsg, setFeedbackMsg]       = useState("");

  useEffect(() => {
    if (!post || !isOwn) return;
    setLoadingPost(true);
    trueketecService.getPostulantes(post._id)
      .then(({ postulantes: p }) => setPostulantes(p))
      .catch(() => {})
      .finally(() => setLoadingPost(false));
  }, [post, isOwn]);

  if (!post) return null;

  const handleChangeEstado = async (estado: EstadoPost) => {
    if (savingEstado) return;
    setSavingEstado(true);
    try {
      await trueketecService.changeEstado(post._id, estado);
      onEstadoChanged(post._id, estado);
      setFeedbackMsg(`Estado actualizado a "${estado}"`);
    } catch {
      setFeedbackMsg("Error al actualizar el estado.");
    } finally {
      setSavingEstado(false);
    }
  };

  const handlePostular = async () => {
    if (postulando || yaPostulado) return;
    setPostulando(true);
    try {
      await trueketecService.postular(post._id);
      setYaPostulado(true);
      setFeedbackMsg("¡Te postulaste! El publicador recibirá una notificación.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al postularse.";
      setFeedbackMsg(msg);
    } finally {
      setPostulando(false);
    }
  };

  const email = post.userEmail || post.authorEmail;

  return (
    <LayoutModal
      isOpen={!!post}
      onClose={onClose}
      title={isOwn ? "Mi publicación" : "Contactar publicador"}
      description={`${post.materia} — ${post.comision_actual} → ${post.comision_deseada}`}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5 px-6 py-5">

        {/* ── Badge de estado ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-itec-muted">Estado actual:</span>
          <EstadoBadge estado={post.estado} size="md" />
        </div>

        {/* ── Email del publicador ─────────────────────────────────────── */}
        {email ? (
          <div className="flex items-center gap-3 rounded-2xl border border-itec-border bg-itec-surface px-4 py-3">
            <Mail size={16} className="text-itec-sky shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-itec-muted uppercase tracking-widest">Email de contacto</span>
              <a href={`mailto:${email}`} className="text-sm font-semibold text-itec-sky hover:underline break-all">
                {email}
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-itec-border bg-itec-surface px-4 py-3 text-itec-muted">
            <Mail size={16} className="shrink-0" />
            <span className="text-sm">El email se revela cuando hay un match aceptado.</span>
          </div>
        )}

        {/* ── Acciones para quien NO es dueño ──────────────────────────── */}
        {!isOwn && (
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              hierarchy="solid"
              text={yaPostulado ? "✓ Postulado" : "Postularme como interesado"}
              isLoading={postulando}
              disabled={yaPostulado}
              onClick={handlePostular}
              fullWidth
              className="rounded-2xl py-3"
            />
            <p className="text-[11px] text-itec-muted text-center">
              Al postularte, el publicador verá tu nombre y tus comisiones activas.
            </p>
          </div>
        )}

        {/* ── Panel de dueño: cambiar estado ───────────────────────────── */}
        {isOwn && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-itec-muted">
              Cambiar estado
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ESTADOS_OPCIONES.map((e) => {
                const icons: Record<EstadoPost, React.ElementType> = {
                  "Activo":            CheckCheck,
                  "En Negociación":    Clock,
                  "Trueque Realizado": Handshake,
                };
                const Icon = icons[e];
                const isCurrentEstado = post.estado === e;
                return (
                  <button
                    key={e}
                    onClick={() => handleChangeEstado(e)}
                    disabled={isCurrentEstado || savingEstado}
                    className={`
                      flex flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 text-[10px] font-bold
                      transition-all duration-150 disabled:opacity-40 disabled:cursor-default
                      ${isCurrentEstado
                        ? "border-itec-sky bg-itec-sky/10 text-itec-sky"
                        : "border-itec-border bg-itec-surface text-itec-muted hover:border-itec-sky/40 hover:text-itec-text"
                      }
                    `}
                  >
                    <Icon size={14} />
                    {e}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Lista de interesados (sólo dueño) ───────────────────────── */}
        {isOwn && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Users size={13} className="text-itec-muted" />
              <p className="text-xs font-bold uppercase tracking-widest text-itec-muted">
                Interesados ({postulantes.length})
              </p>
            </div>
            {loadingPost ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-12 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : postulantes.length === 0 ? (
              <p className="text-xs text-itec-muted py-2 text-center">
                Aún no hay interesados en esta publicación.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {postulantes.map((p) => (
                  <button
                    key={p.userId}
                    onClick={() => onOpenPostulante(p)}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-itec-border bg-itec-surface px-4 py-3 hover:border-itec-sky/30 hover:bg-itec-box transition-colors text-left"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-itec-text">{p.userName}</span>
                      <span className="text-[11px] text-itec-muted">{p.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-itec-sky font-medium shrink-0">
                      {p.ofertas.length} oferta{p.ofertas.length !== 1 ? "s" : ""}
                      <span className="ml-1 opacity-60">›</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Feedback ─────────────────────────────────────────────────── */}
        {feedbackMsg && (
          <p className="rounded-2xl border border-itec-sky/20 bg-itec-sky/10 px-4 py-2.5 text-xs text-itec-sky text-center">
            {feedbackMsg}
          </p>
        )}
      </div>
    </LayoutModal>
  );
};
