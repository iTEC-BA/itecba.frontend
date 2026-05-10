// src/features/courses/components/organisms/BrokenVideosPanel.tsx
// Panel de administración para gestionar videos rotos reportados
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons/Icons";
import { auth } from "@lib/firebase";

interface BrokenVideo {
  courseId:    string;
  courseTitle: string;
  materia:     string;
  video: {
    _id:         string;
    youtubeId:   string;
    title:       string;
    duration:    string;
    isBroken:    boolean;
    reportCount: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const getToken = async () => auth.currentUser?.getIdToken() ?? "";

export const BrokenVideosPanel: React.FC = () => {
  const [items,     setItems]     = useState<BrokenVideo[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [newYtId,   setNewYtId]   = useState("");
  const [saving,    setSaving]    = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchBroken = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/courses/admin/broken-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.broken ?? []);
    } catch {
      setStatusMsg("Error al cargar videos rotos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBroken(); }, []);

  const handleFix = async (courseId: string, videoId: string) => {
    if (!newYtId.trim()) return;
    setSaving(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/courses/${courseId}/videos/${videoId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ youtubeId: newYtId.trim() }),
      });
      setEditId(null);
      setNewYtId("");
      setStatusMsg("Video corregido ✓");
      await fetchBroken();
    } catch {
      setStatusMsg("Error al corregir video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId: string, videoId: string) => {
    if (!window.confirm("¿Eliminar este video del curso?")) return;
    try {
      const token = await getToken();
      await fetch(`${API_URL}/courses/${courseId}/videos/${videoId}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatusMsg("Video eliminado ✓");
      await fetchBroken();
    } catch {
      setStatusMsg("Error al eliminar");
    }
  };

  const handleClearReports = async (courseId: string, videoId: string) => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/courses/${courseId}/videos/${videoId}/reports`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatusMsg("Reportes limpiados ✓");
      await fetchBroken();
    } catch {
      setStatusMsg("Error al limpiar reportes");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-2 border-itec-gray/30 border-t-itec-blue-skye rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-itec-text flex items-center gap-2">
          <span className="w-5 h-5 bg-itec-red/15 rounded-md flex items-center justify-center">
            <Icons type="alert" className="w-3 h-3 text-itec-red" />
          </span>
          Videos reportados
          {items.length > 0 && (
            <span className="px-2 py-0.5 bg-itec-red text-white text-[10px] rounded-full">
              {items.length}
            </span>
          )}
        </h2>
        <button
          onClick={fetchBroken}
          className="text-xs text-itec-gray hover:text-itec-text transition-colors flex items-center gap-1"
        >
          <Icons type="refresh" className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {statusMsg && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
          {statusMsg}
        </p>
      )}

      {items.length === 0 ? (
        <div className="text-center py-10 text-itec-gray">
          <span className="text-3xl block mb-2 opacity-40">✓</span>
          <p className="text-xs font-bold">Sin videos reportados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.courseId}-${item.video._id}`}
              className="bg-itec-card border border-itec-border rounded-xl p-4 space-y-3"
            >
              {/* Curso */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    to={`/cursos/${item.courseId}`}
                    className="text-xs font-bold text-itec-text hover:text-itec-blue-skye transition-colors"
                  >
                    {item.courseTitle}
                  </Link>
                  {item.materia && (
                    <span className="ml-2 text-[10px] text-itec-gray">• {item.materia}</span>
                  )}
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.video.isBroken
                    ? "bg-itec-red/15 text-itec-red"
                    : "bg-yellow-500/15 text-yellow-400"
                }`}>
                  {item.video.isBroken ? "🔴 Roto" : `⚠️ ${item.video.reportCount} reporte${item.video.reportCount > 1 ? "s" : ""}`}
                </span>
              </div>

              {/* Video */}
              <div className="bg-black/20 rounded-lg p-3 flex items-center gap-3">
                <img
                  src={`https://img.youtube.com/vi/${item.video.youtubeId}/default.jpg`}
                  alt=""
                  className="w-16 aspect-video object-cover rounded-md shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-itec-text truncate">{item.video.title}</p>
                  <p className="text-[10px] text-itec-gray mt-0.5 font-mono">{item.video.youtubeId}</p>
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

              {/* Editor de ID */}
              {editId === item.video._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nuevo ID de YouTube"
                    value={newYtId}
                    onChange={(e) => setNewYtId(e.target.value)}
                    className="flex-1 bg-itec-bg border border-itec-border rounded-lg px-3 py-2 text-xs text-itec-text placeholder-itec-gray/40 outline-none focus:border-itec-blue-skye/50"
                  />
                  <button
                    onClick={() => handleFix(item.courseId, item.video._id)}
                    disabled={saving || !newYtId.trim()}
                    className="px-3 py-2 bg-itec-blue-skye text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {saving ? "..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => { setEditId(null); setNewYtId(""); }}
                    className="px-3 py-2 bg-white/5 border border-itec-border text-xs text-itec-gray rounded-lg hover:text-itec-text transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setEditId(item.video._id); setNewYtId(item.video.youtubeId); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-itec-border rounded-lg text-xs text-itec-gray hover:text-itec-text transition-all"
                  >
                    <Icons type="edit" className="w-3 h-3" /> Corregir ID
                  </button>
                  <button
                    onClick={() => handleDelete(item.courseId, item.video._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-itec-red/10 border border-itec-red/20 rounded-lg text-xs text-itec-red hover:bg-itec-red/20 transition-all"
                  >
                    <Icons type="trash" className="w-3 h-3" /> Eliminar video
                  </button>
                  <button
                    onClick={() => handleClearReports(item.courseId, item.video._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-itec-border rounded-lg text-xs text-itec-gray hover:text-itec-text transition-all"
                  >
                    <Icons type="check" className="w-3 h-3" /> Limpiar reportes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
