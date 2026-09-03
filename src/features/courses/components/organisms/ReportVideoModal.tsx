import React, { useState } from "react";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/icons/Icons";
import { useReportVideo } from "../../hooks/useReportVideo";

type Reason = "no-reproduce" | "error-404" | "privado" | "contenido-incorrecto";

const REASONS: { value: Reason; label: string; emoji: string }[] = [
  { value: "no-reproduce",         label: "El video no reproduce",       emoji: "▶️" },
  { value: "error-404",            label: "Video eliminado (error 404)", emoji: "🔗" },
  { value: "privado",              label: "Video privado o restringido", emoji: "🔒" },
  { value: "contenido-incorrecto", label: "Contenido incorrecto",        emoji: "⚠️" },
];

interface Props {
  isOpen: boolean; onClose: () => void; courseId: string; videoId: string; videoTitle: string;
}

export const ReportVideoModal: React.FC<Props> = ({ isOpen, onClose, courseId, videoId, videoTitle }) => {
  const [reason, setReason] = useState<Reason>("no-reproduce");
  const { report, isLoading, isSuccess, isError, errorMsg, reset } = useReportVideo();

  const handleClose = () => { reset(); onClose(); };
  const handleSubmit = async () => { await report(courseId, videoId, reason); };

  return (
    <LayoutModal isOpen={isOpen} onClose={handleClose} title="Reportar video" description={videoTitle} maxWidth="max-w-md">
      <div className="p-5">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center border border-dashed border-itec-border rounded-xl bg-itec-sidebar">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <Icons type="check" className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="font-bold text-itec-text text-sm">Reporte enviado</p>
            <p className="text-xs text-itec-gray">Gracias por colaborar. El equipo lo revisará.</p>
            <Button onClick={handleClose} variant="secondary" className="mt-2">Cerrar</Button>
          </div>
        ) : (
          <>
            <p className="text-xs text-itec-gray mb-3 font-medium">¿Por qué no funciona?</p>
            <div className="space-y-2 mb-5">
              {REASONS.map((r) => (
                <label key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    reason === r.value
                      ? "border-itec-section-courses bg-itec-section-courses/10 text-itec-text"
                      : "border-itec-border hover:border-itec-gray text-itec-gray bg-itec-box"
                  }`}>
                  <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="accent-itec-section-courses shrink-0" />
                  <span className="text-sm">{r.emoji} {r.label}</span>
                </label>
              ))}
            </div>
            {isError && <p className="mb-3 text-xs text-itec-red bg-itec-red/10 border border-itec-red/20 px-3 py-2 rounded-lg">{errorMsg}</p>}
            <div className="flex gap-2 border-t border-itec-border pt-4">
              <Button variant="slate" hierarchy="ghost" onClick={handleClose} className="flex-1">Cancelar</Button>
              <Button variant="danger" hierarchy="solid" onClick={handleSubmit} isLoading={isLoading} className="flex-1">Enviar reporte</Button>
            </div>
          </>
        )}
      </div>
    </LayoutModal>
  );
};
