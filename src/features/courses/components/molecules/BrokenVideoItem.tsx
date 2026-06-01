// src/features/courses/components/molecules/BrokenVideoItem.tsx
// Tarjeta individual de video reportado: muestra info, editor de ID y acciones.
import React, { useState } from "react";
import { Link }   from "react-router-dom";
import { Icons }  from "@/components/ui/icons/Icons";
import type { BrokenVideo } from "../../hooks/useBrokenVideos";

interface Props {
  item:         BrokenVideo;
  onFix:        (courseId: string, videoId: string, newYtId: string) => Promise<void>;
  onDelete:     (courseId: string, videoId: string) => Promise<void>;
  onClearReports: (courseId: string, videoId: string) => Promise<void>;
}

export const BrokenVideoItem: React.FC<Props> = ({
  item, onFix, onDelete, onClearReports,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newYtId,   setNewYtId]   = useState(item.video.youtubeId);
  const [saving,    setSaving]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onFix(item.courseId, item.video._id, newYtId);
    setSaving(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este video del curso?")) return;
    await onDelete(item.courseId, item.video._id);
  };

  return (
    <div className="bg-itec-card border border-itec-border rounded-xl p-4 space-y-3">

      {/* Encabezado: curso + badge de estado */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            to={`/cursos/${item.courseId}`}
            className="text-xs font-bold text-itec-text hover:text-itec-blue-skye transition-colors"
          >
            {item.courseTitle}
          </Link>
          {item.materia && (
            <span className="ml-2 text-[10px] text-itec-gray">
              • {item.materia}
            </span>
          )}
        </div>
        <span
          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            item.video.isBroken
              ? "bg-itec-red/15 text-itec-red"
              : "bg-yellow-500/15 text-yellow-400"
          }`}
        >
          {item.video.isBroken
            ? "Roto"
            : `${item.video.reportCount} reporte${item.video.reportCount > 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Preview del video */}
      <div className="bg-black/20 rounded-lg p-3 flex items-center gap-3">
        <img
          src={`https://img.youtube.com/vi/${item.video.youtubeId}/default.jpg`}
          alt=""
          className="w-16 aspect-video object-cover rounded-md shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-itec-text truncate">
            {item.video.title}
          </p>
          <p className="text-[10px] text-itec-gray mt-0.5 font-mono">
            {item.video.youtubeId}
          </p>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${item.video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-itec-gray hover:text-itec-text transition-colors"
        >
          <Icons type="externalLink" className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Editor inline de YouTube ID */}
      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nuevo ID de YouTube"
            value={newYtId}
            onChange={(e) => setNewYtId(e.target.value)}
            className="flex-1 bg-itec-bg border border-itec-border rounded-lg px-3 py-2 text-xs text-itec-text placeholder-itec-gray/40 outline-none focus:border-itec-blue-skye/50"
          />
          <button
            onClick={handleSave}
            disabled={saving || !newYtId.trim()}
            className="px-3 py-2 bg-itec-blue-skye text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {saving ? "..." : "Guardar"}
          </button>
          <button
            onClick={() => { setIsEditing(false); setNewYtId(item.video.youtubeId); }}
            className="px-3 py-2 bg-white/5 border border-itec-border text-xs text-itec-gray rounded-lg hover:text-itec-text transition-all"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-itec-border rounded-lg text-xs text-itec-gray hover:text-itec-text transition-all"
          >
            <Icons type="edit" className="w-3 h-3" />
            Corregir ID
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-itec-red/10 border border-itec-red/20 rounded-lg text-xs text-itec-red hover:bg-itec-red/20 transition-all"
          >
            <Icons type="trash" className="w-3 h-3" />
            Eliminar video
          </button>
          <button
            onClick={() => onClearReports(item.courseId, item.video._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-itec-border rounded-lg text-xs text-itec-gray hover:text-itec-text transition-all"
          >
            <Icons type="check" className="w-3 h-3" />
            Limpiar reportes
          </button>
        </div>
      )}
    </div>
  );
};
