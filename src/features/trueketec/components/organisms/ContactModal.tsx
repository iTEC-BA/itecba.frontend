import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, Info, AlertCircle } from "lucide-react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Button } from "@components/ui/Button";
import { EstadoBadge } from "../atoms/EstadoBadge";
import { trueketecService } from "../../services/trueketec.service";
import type { TrueketecPost, EstadoPost, Postulante } from "../../types/trueketec.types";
import { ESTADOS_OPCIONES, SOPORTE, OFICIALIZACION_DETALLE, AVISO_GESTION, MENSAJES } from "../../data";
import { getAuth } from "firebase/auth";

interface Props { post: TrueketecPost | null; isOwn: boolean; onClose: () => void; onEstadoChanged: (postId: string, estado: EstadoPost) => void; onOpenPostulante: (postulante: Postulante) => void; }

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
    getAuth().currentUser?.getIdToken().then(token => {
      if (token) return trueketecService.getPostulantes(token, post._id);
      throw new Error("No token");
    }).then(({ postulantes: p }) => setPostulantes(p)).catch(() => {}).finally(() => setLoadingPost(false));
  }, [post, isOwn]);

  if (!post) return null;

  const handleChangeEstado = async (estado: EstadoPost) => {
    if (savingEstado) return;
    setSavingEstado(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      if (!token) throw new Error(MENSAJES.sinSesion);
      await trueketecService.changeEstado(token, post._id, estado);
      onEstadoChanged(post._id, estado);
      setFeedbackMsg(`Trámite actualizado a: ${estado}`);
    } catch { setFeedbackMsg(MENSAJES.errorGenerico); } finally { setSavingEstado(false); }
  };

  const handlePostular = async () => {
    if (postulando || yaPostulado) return;
    setPostulando(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      if (!token) throw new Error(MENSAJES.sinSesion);
      await trueketecService.postular(token, post._id);
      setYaPostulado(true);
      setFeedbackMsg(MENSAJES.postulacionOk);
    } catch (e: any) { setFeedbackMsg(e.message || "Error al procesar."); } finally { setPostulando(false); }
  };

  const email = post.userEmail || post.authorEmail;

  return (
    <LayoutModal isOpen={!!post} onClose={onClose} title="Expediente de Permuta" description={`ID: ${post._id.slice(-6).toUpperCase()}`} maxWidth="max-w-md">
      <div className="flex flex-col gap-6 px-6 py-6">

        <div className="flex flex-col bg-itec-box rounded-2xl p-5 gap-4 border border-itec-border">
          <div className="flex items-start justify-between gap-4 border-b border-itec-border pb-4">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-itec-section-trueketec">{post.departamento}</span>
              <h2 className="text-base font-bold text-white mt-1 leading-tight">{post.materia}</h2>
            </div>
            <EstadoBadge estado={post.estado} />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col text-center bg-itec-surface p-3 rounded-xl border border-itec-border">
              <span className="text-[9px] uppercase tracking-widest text-itec-muted font-bold">Ofrece</span>
              <span className="font-mono text-base font-bold text-white mt-1">{post.comision_actual}</span>
            </div>
            <ArrowRight size={16} className="text-itec-muted" />
            <div className="flex flex-col text-center bg-itec-surface p-3 rounded-xl border border-itec-border">
              <span className="text-[9px] uppercase tracking-widest text-itec-muted font-bold">Busca</span>
              <span className="font-mono text-base font-bold text-itec-section-trueketec mt-1">{post.comision_deseada}</span>
            </div>
          </div>
        </div>

        {/* ── INFO DE OFICIALIZACIÓN (lectura densa, siempre visible por ser accionable) ── */}
        <div className="flex flex-col gap-2 bg-itec-section-trueketec/10 border border-itec-section-trueketec/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-itec-section-trueketec">
            <AlertCircle size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">¿Cómo finalizar el Trueque?</span>
          </div>
          <p className="text-xs text-itec-text/80 leading-relaxed mt-1">
            {OFICIALIZACION_DETALLE.split(SOPORTE.email)[0]}
            <strong className="text-itec-section-trueketec">{SOPORTE.email}</strong>
            {OFICIALIZACION_DETALLE.split(SOPORTE.email)[1]}
          </p>
          <p className="text-[10px] text-itec-muted mt-1">{AVISO_GESTION}</p>
        </div>

        {email ? (
          <div className="flex flex-col gap-1 bg-itec-surface p-4 rounded-xl border border-itec-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Contacto Habilitado</span>
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm font-mono text-white hover:text-itec-section-trueketec transition-colors mt-2">
              <Mail size={16} className="text-itec-muted" /> {email}
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[11px] text-itec-muted bg-itec-surface p-4 rounded-xl leading-relaxed border border-itec-border">
            <Info size={16} className="shrink-0 text-itec-section-trueketec" />
            <p>El correo institucional está protegido. Se revelará al confirmar una coincidencia bilateral.</p>
          </div>
        )}

        {isOwn && (
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2 bg-itec-box rounded-xl p-5 border border-itec-border">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 px-1">Acciones Administrativas</span>
              <div className="flex rounded-lg bg-itec-surface p-1 gap-1 border border-itec-border">
                {ESTADOS_OPCIONES.map((e) => (
                  <button key={e} onClick={() => handleChangeEstado(e)} disabled={post.estado === e || savingEstado} className={`flex-1 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${post.estado === e ? "bg-itec-box text-white" : "text-itec-muted hover:text-white disabled:opacity-30"}`}>
                    {e === "Trueque Realizado" ? "Cerrar" : e}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-itec-box rounded-xl p-5 border border-itec-border">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 px-1">Expedientes Interesados ({postulantes.length})</span>
              {loadingPost ? <div className="h-14 bg-itec-surface animate-pulse rounded-xl" /> : postulantes.length === 0 ? (
                <div className="p-4 text-center text-[10px] uppercase tracking-widest text-white/30 rounded-xl bg-itec-surface border border-itec-border">{MENSAJES.sinRegistrosVinculados}</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {postulantes.map(p => (
                    <button key={p.userId} onClick={() => onOpenPostulante(p)} className="flex items-center justify-between p-4 rounded-xl bg-itec-surface hover:bg-itec-bg transition-colors text-left border border-itec-border">
                      <div className="flex flex-col min-w-0 pr-4">
                        <span className="text-sm font-bold text-white truncate">{p.userName}</span>
                        <span className="text-[10px] font-mono text-itec-muted truncate mt-0.5">{p.userEmail}</span>
                      </div>
                      <span className="text-[10px] font-bold text-itec-section-trueketec bg-itec-box px-3 py-1.5 rounded-lg shrink-0 border border-itec-border">{p.ofertas.length} Ofertas</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!isOwn && (
          <div className="pt-2">
            <Button variant={yaPostulado ? "slate" : "primary"} hierarchy={yaPostulado ? "outline" : "solid"} text={yaPostulado ? "Postulación Asentada" : "Registrar Interés"} isLoading={postulando} disabled={yaPostulado} onClick={handlePostular} fullWidth className="py-3.5 rounded-xl text-sm bg-itec-section-trueketec hover:bg-itec-section-trueketec/80 text-white font-bold" />
          </div>
        )}

        {feedbackMsg && <p className="text-[10px] font-bold uppercase tracking-widest text-itec-section-trueketec text-center py-3 bg-itec-surface rounded-xl border border-itec-border">{feedbackMsg}</p>}
      </div>
    </LayoutModal>
  );
};
