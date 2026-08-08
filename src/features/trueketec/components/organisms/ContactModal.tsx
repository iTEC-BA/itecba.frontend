import React, { useState, useEffect } from "react";
import { Mail, CheckCircle2, Clock, Handshake, Users, ArrowRightLeft } from "lucide-react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Button } from "@components/ui/Button";
import { EstadoBadge } from "../atoms/EstadoBadge";
import { trueketecService } from "../../services/trueketec.service";
import type { TrueketecPost, EstadoPost, Postulante } from "../../types/trueketec.types";
import { cn } from "@/lib/utils";

interface Props {
  post: TrueketecPost | null;
  isOwn: boolean;
  onClose: () => void;
  onEstadoChanged: (postId: string, estado: EstadoPost) => void;
  onOpenPostulante: (postulante: Postulante) => void;
}

const ESTADOS_OPCIONES: EstadoPost[] = ["Activo", "En Negociación", "Trueque Realizado"];

export const ContactModal: React.FC<Props> = ({ post, isOwn, onClose, onEstadoChanged, onOpenPostulante }) => {
  const [savingEstado, setSavingEstado] = useState(false);
  const [postulando, setPostulando] = useState(false);
  const [yaPostulado, setYaPostulado] = useState(false);
  const [postulantes, setPostulantes] = useState<Postulante[]>([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    if (!post || !isOwn) return;
    setLoadingPost(true);
    trueketecService.getPostulantes(post._id).then(({ postulantes: p }) => setPostulantes(p)).catch(() => {}).finally(() => setLoadingPost(false));
  }, [post, isOwn]);

  if (!post) return null;

  const handleChangeEstado = async (estado: EstadoPost) => {
    if (savingEstado) return;
    setSavingEstado(true);
    try {
      await trueketecService.changeEstado(post._id, estado);
      onEstadoChanged(post._id, estado);
      setFeedbackMsg(`Estado actualizado a "${estado}"`);
    } catch { setFeedbackMsg("Error al actualizar el estado."); } finally { setSavingEstado(false); }
  };

  const handlePostular = async () => {
    if (postulando || yaPostulado) return;
    setPostulando(true);
    try {
      await trueketecService.postular(post._id);
      setYaPostulado(true);
      setFeedbackMsg("¡Te postulaste! El publicador recibirá una notificación.");
    } catch (e: any) { setFeedbackMsg(e.message || "Error al postularse."); } finally { setPostulando(false); }
  };

  const email = post.userEmail || post.authorEmail;

  return (
    <LayoutModal isOpen={!!post} onClose={onClose} title={isOwn ? "Mi publicación" : "Contactar estudiante"} description={post.materia} maxWidth="max-w-lg">
      <div className="flex flex-col gap-6 px-6 py-6">
        
        {/* ── Resumen de Intercambio ── */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Origen</span>
            <span className="font-mono text-sm font-bold text-white">{post.comision_actual}</span>
          </div>
          <ArrowRightLeft size={16} className="text-white/30" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Destino</span>
            <span className={cn("font-mono text-sm font-bold", post.isPerfectMatch ? "text-itec-emerald" : "text-white")}>{post.comision_deseada}</span>
          </div>
        </div>

        {/* ── Estado Actual ── */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Estado de solicitud</span>
          <EstadoBadge estado={post.estado} size="md" />
        </div>

        {/* ── Email ── */}
        {email ? (
          <div className="flex items-center gap-3 rounded-xl border border-itec-sky/20 bg-itec-sky/10 px-4 py-3">
            <div className="p-2 bg-itec-sky/20 rounded-lg"><Mail size={16} className="text-itec-sky" /></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-itec-sky/70">Correo de contacto</span>
              <a href={`mailto:${email}`} className="text-sm font-bold text-itec-sky hover:underline">{email}</a>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/40">
            <Mail size={16} className="shrink-0" />
            <span className="text-xs">El correo se revelará cuando ambas partes acepten el trueque.</span>
          </div>
        )}

        {/* ── Acciones de Dueño ── */}
        {isOwn && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Forzar cambio de estado</span>
              <div className="grid grid-cols-3 gap-2">
                {ESTADOS_OPCIONES.map((e) => {
                  const icons: any = { "Activo": CheckCircle2, "En Negociación": Clock, "Trueque Realizado": Handshake };
                  const Icon = icons[e];
                  const isCurrent = post.estado === e;
                  return (
                    <button key={e} onClick={() => handleChangeEstado(e)} disabled={isCurrent || savingEstado} className={cn("flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-all", isCurrent ? "border-itec-sky bg-itec-sky/10 text-itec-sky" : "border-white/10 bg-white/5 text-white/40 hover:border-white/30 hover:text-white")}>
                      <Icon size={16} /> <span className="text-center">{e}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2"><Users size={12}/> Interesados ({postulantes.length})</span>
              {loadingPost ? <div className="h-10 animate-pulse bg-white/5 rounded-xl" /> : postulantes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-white/30">Nadie se postuló todavía.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {postulantes.map(p => (
                    <button key={p.userId} onClick={() => onOpenPostulante(p)} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors text-left">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{p.userName}</span>
                        <span className="text-[10px] font-mono text-white/40">{p.userEmail}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-itec-sky border border-itec-sky/20 bg-itec-sky/10 px-2 py-1 rounded-md">{p.ofertas.length} Ofertas</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Acciones NO dueño ── */}
        {!isOwn && (
          <div className="flex flex-col gap-2 mt-2">
            <Button variant={yaPostulado ? "secondary" : "primary"} hierarchy={yaPostulado ? "ghost" : "solid"} text={yaPostulado ? "✓ Solicitud enviada" : "Postularme para este Trueque"} isLoading={postulando} disabled={yaPostulado} onClick={handlePostular} fullWidth className="rounded-xl py-3.5" />
            <p className="text-[10px] text-white/40 text-center px-4">Al postularte, el publicador recibirá una alerta y podrá ver las comisiones que vos tenés activas para intercambiar.</p>
          </div>
        )}

        {feedbackMsg && <p className="text-[10px] font-bold uppercase tracking-widest text-itec-sky text-center">{feedbackMsg}</p>}
      </div>
    </LayoutModal>
  );
};
