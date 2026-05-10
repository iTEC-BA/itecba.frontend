// src/features/courses/components/organisms/ReportVideoModal.tsx
// Modal para que los estudiantes reporten videos que no funcionan
import React, { useState } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { useReportVideo } from "../../hooks/useReportVideo";

type Reason = "no-reproduce" | "error-404" | "privado" | "contenido-incorrecto";

const REASONS: { value: Reason; label: string; emoji: string }[] = [
  { value: "no-reproduce",         label: "El video no reproduce",       emoji: "▶️" },
  { value: "error-404",            label: "Video eliminado (error 404)",  emoji: "🔗" },
  { value: "privado",              label: "Video privado o restringido",  emoji: "🔒" },
  { value: "contenido-incorrecto", label: "Contenido incorrecto",         emoji: "⚠️" },
];

interface Props {
  isOpen:     boolean;
  onClose:    () => void;
  courseId:   string;
  videoId:    string;
  videoTitle: string;
}

export const ReportVideoModal: React.FC<Props> = ({
  isOpen, onClose, courseId, videoId, videoTitle,
}) => {
  const [reason, setReason] = useState<Reason>("no-reproduce");
  const { report, isLoading, isSuccess, isError, errorMsg, reset } = useReportVideo();

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    await report(courseId, videoId, reason);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-md bg-itec-card border border-itec-border rounded-t-3xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-itec-text">Reportar video</h2>
            <p className="text-xs text-itec-gray mt-0.5 line-clamp-1 max-w-xs">{videoTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-itec-gray hover:text-itec-text transition-colors p-1"
          >
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Éxito */}
        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <Icons type="check" className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="font-bold text-itec-text text-sm">Reporte enviado</p>
            <p className="text-xs text-itec-gray">Gracias por colaborar. El equipo lo revisará.</p>
            <button
              onClick={handleClose}
              className="mt-2 px-6 py-2 rounded-xl bg-white/5 border border-itec-border text-xs font-bold text-itec-text hover:bg-white/10 transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* Motivos */}
            <p className="text-xs text-itec-gray mb-3 font-medium">¿Por qué no funciona?</p>
            <div className="space-y-2 mb-5">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    reason === r.value
                      ? "border-itec-blue-skye/40 bg-itec-blue-skye/5 text-itec-text"
                      : "border-itec-border hover:border-white/20 text-itec-gray"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-itec-blue-skye shrink-0"
                  />
                  <span className="text-sm">{r.emoji} {r.label}</span>
                </label>
              ))}
            </div>

            {/* Error */}
            {isError && (
              <p className="mb-3 text-xs text-itec-red bg-itec-red/10 border border-itec-red/20 px-3 py-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-itec-border text-xs font-bold text-itec-gray hover:text-itec-text hover:border-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-itec-red text-white text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 active:scale-95"
              >
                {isLoading ? "Enviando..." : "Enviar reporte"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
