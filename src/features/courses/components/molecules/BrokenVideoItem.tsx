import React, { useState } from "react";
import { Link }   from "react-router-dom";
import { Icons }  from "@/components/ui/icons/Icons";
import { Button } from "@/components/ui/Button";
import type { BrokenVideo } from "../../hooks/useBrokenVideos";

interface Props {
  item: BrokenVideo;
  onFix: (courseId: string, videoId: string, newYtId: string) => Promise<void>;
  onDelete: (courseId: string, videoId: string) => Promise<void>;
  onClearReports: (courseId: string, videoId: string) => Promise<void>;
}

export const BrokenVideoItem: React.FC<Props> = ({ item, onFix, onDelete, onClearReports }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newYtId, setNewYtId] = useState(item.video.youtubeId);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => { setSaving(true); await onFix(item.courseId, item.video._id, newYtId); setSaving(false); setIsEditing(false); };
  const handleDelete = async () => { if (!window.confirm("¿Eliminar este video del curso?")) return; await onDelete(item.courseId, item.video._id); };

  return (
    <div className="bg-itec-sidebar border border-itec-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link to={`/cursos/${item.courseId}`} className="text-xs font-bold text-itec-text hover:text-itec-section-courses transition-colors">{item.courseTitle}</Link>
          {item.materia && <span className="ml-2 text-[10px] text-itec-gray">• {item.materia}</span>}
        </div>
        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.video.isBroken ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"}`}>
          {item.video.isBroken ? "Roto" : `${item.video.reportCount} reporte${item.video.reportCount > 1 ? "s" : ""}`}
        </span>
      </div>
      <div className="bg-itec-box border border-itec-border rounded-lg p-3 flex items-center gap-3">
        <img src={`https://img.youtube.com/vi/${item.video.youtubeId}/default.jpg`} alt="" className="w-16 aspect-video object-cover rounded-md shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-itec-text truncate">{item.video.title}</p>
          <p className="text-[10px] text-itec-gray mt-0.5 font-mono">{item.video.youtubeId}</p>
        </div>
        <a href={`https://www.youtube.com/watch?v=${item.video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-itec-gray hover:text-itec-section-courses transition-colors">
          <Icons type="externalLink" className="w-3.5 h-3.5" />
        </a>
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          <input type="text" placeholder="Nuevo ID de YouTube" value={newYtId} onChange={(e) => setNewYtId(e.target.value)} className="flex-1 bg-itec-box border border-itec-border rounded-lg px-3 py-2 text-xs text-itec-text outline-none focus:border-itec-section-courses transition-colors" />
          <Button onClick={handleSave} disabled={saving || !newYtId.trim()} variant="primary" className="bg-itec-section-courses border-none text-white">{saving ? "..." : "Guardar"}</Button>
          <Button onClick={() => { setIsEditing(false); setNewYtId(item.video.youtubeId); }} variant="slate" hierarchy="ghost">Cancelar</Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 border-t border-itec-border pt-3">
          <Button onClick={() => setIsEditing(true)} variant="slate" hierarchy="outline" icon={<Icons type="edit" className="w-3 h-3" />} className="text-xs">Corregir ID</Button>
          <Button onClick={handleDelete} variant="danger" hierarchy="outline" icon={<Icons type="trash" className="w-3 h-3" />} className="text-xs">Eliminar</Button>
          <Button onClick={() => onClearReports(item.courseId, item.video._id)} variant="slate" hierarchy="outline" icon={<Icons type="check" className="w-3 h-3" />} className="text-xs">Limpiar reportes</Button>
        </div>
      )}
    </div>
  );
};
