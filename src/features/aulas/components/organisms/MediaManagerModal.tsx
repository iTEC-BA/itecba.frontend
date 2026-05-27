// src/features/aulas/components/organisms/MediaManagerModal.tsx
import React, { useRef, useState } from "react";
import { LayoutModal }    from "@components/templates/LayoutModal";
import { Button }         from "@components/ui/Button";
import { aulasService }   from "../../services/aulas.service";
import { invalidateAulasCache } from "../../hooks/useAulas";
import { Upload, Trash2, X, Link, Play, Video } from "lucide-react";
import type { Aula } from "../../types/aulas.types";

interface Props {
  isOpen:  boolean;
  onClose: () => void;
  onSaved: () => void;
  aula:    Aula | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const getYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const kw = ["shorts", "live", "embed", "v"];
    const idx = parts.findIndex((p) => kw.includes(p));
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    if (u.hostname === "youtu.be") return parts[0] ?? null;
  } catch { /* noop */ }
  return null;
};

const isYouTube   = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");
const isDrive     = (url: string) => url.includes("drive.google.com");

/** Thumbnail para mostrar en la lista de videos ya guardados */
const VideoRowThumb: React.FC<{ url: string }> = ({ url }) => {
  if (isYouTube(url)) {
    const id = getYouTubeId(url);
    if (id) return (
      <img
        src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
        alt="thumb"
        className="w-16 h-10 object-cover rounded-lg shrink-0"
      />
    );
  }
  return (
    <div className="w-16 h-10 bg-itec-bg rounded-lg flex items-center justify-center shrink-0">
      <Play size={14} className="text-itec-muted" />
    </div>
  );
};

/** Etiqueta del tipo de link */
const videoPlatformLabel = (url: string): string => {
  if (isYouTube(url))  return "YouTube";
  if (isDrive(url))    return "Google Drive";
  if (url.includes("vimeo.com"))  return "Vimeo";
  return "Video externo";
};

// ── Componente ────────────────────────────────────────────────────────────────
export const MediaManagerModal: React.FC<Props> = ({ isOpen, onClose, onSaved, aula }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  // Imágenes
  const [previews,  setPreviews]  = useState<{ file: File; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Video URL
  const [videoInput,   setVideoInput]   = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [addingVideo,  setAddingVideo]  = useState(false);
  const [videoError,   setVideoError]   = useState("");

  // General
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState("");

  // ── Imágenes ──────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = 10 - (aula?.imagenes.length ?? 0) - previews.length;
    const toAdd = files.slice(0, Math.max(0, remaining));
    setPreviews((p) => [...p, ...toAdd.map((f) => ({ file: f, url: URL.createObjectURL(f) }))]);
    e.target.value = "";
  };

  const removePreview = (i: number) => {
    setPreviews((p) => {
      URL.revokeObjectURL(p[i].url);
      return p.filter((_, j) => j !== i);
    });
  };

  const handleUpload = async () => {
    if (!aula || previews.length === 0) return;
    setUploading(true); setError("");
    try {
      await aulasService.uploadImages(aula._id, previews.map((p) => p.file));
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      invalidateAulasCache();
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imágenes.");
    } finally {
      setUploading(false);
    }
  };

  // ── Video URL ─────────────────────────────────────────────────────────────
  const validateVideoUrl = (url: string): string | null => {
    if (!url.trim()) return "Pegá el link del video.";
    try {
      const u = new URL(url);
      if (!["http:", "https:"].includes(u.protocol)) return "El link debe empezar con http o https.";
    } catch {
      return "Eso no parece un link válido.";
    }
    if (aula?.videos.includes(url)) return "Ese link ya está agregado a esta aula.";
    return null;
  };

  const handleVideoInputChange = (url: string) => {
    setVideoInput(url);
    setVideoError("");
    // Preview inmediato si es YouTube
    if (url.trim() && isYouTube(url.trim())) {
      const id = getYouTubeId(url.trim());
      setVideoPreview(id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null);
    } else {
      setVideoPreview(null);
    }
  };

  const handleAddVideo = async () => {
    if (!aula) return;
    const valErr = validateVideoUrl(videoInput.trim());
    if (valErr) { setVideoError(valErr); return; }
    setAddingVideo(true); setVideoError("");
    try {
      await aulasService.addVideoUrl(aula._id, videoInput.trim());
      setVideoInput("");
      setVideoPreview(null);
      invalidateAulasCache();
      onSaved();
    } catch (e) {
      setVideoError(e instanceof Error ? e.message : "Error al agregar el video.");
    } finally {
      setAddingVideo(false);
    }
  };

  // ── Eliminar media ────────────────────────────────────────────────────────
  const handleDeleteMedia = async (tipo: "imagen" | "video", url: string) => {
    if (!aula) return;
    setDeleting(url); setError("");
    try {
      await aulasService.deleteMedia(aula._id, tipo, url);
      invalidateAulasCache();
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar.");
    } finally {
      setDeleting(null);
    }
  };

  if (!aula) return null;

  const fieldCls = "flex-1 px-3 py-2.5 text-sm rounded-2xl bg-itec-bg border border-itec-border text-itec-text outline-none focus:border-itec-sky transition-colors placeholder:text-itec-muted/50";

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestión de medios — ${aula.numero}`}
      description="Subí fotos y pegá links de videos del aula"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6 px-6 py-5">
        {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-2xl px-4 py-3">{error}</p>}

        {/* ── Imágenes actuales ──────────────────────────────────────────── */}
        {aula.imagenes.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-itec-muted uppercase tracking-widest">
              Imágenes actuales ({aula.imagenes.length}/10)
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {aula.imagenes.map((url) => (
                <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-itec-border">
                  <img src={url} alt="Foto del aula" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDeleteMedia("imagen", url)}
                    disabled={deleting === url}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    {deleting === url ? <span className="animate-spin">⏳</span> : <Trash2 size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Videos guardados ───────────────────────────────────────────── */}
        {aula.videos.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-itec-muted uppercase tracking-widest">
              Videos guardados ({aula.videos.length}/3)
            </h3>
            <div className="flex flex-col gap-2">
              {aula.videos.map((url) => (
                <div
                  key={url}
                  className="flex items-center gap-3 rounded-2xl bg-itec-surface border border-itec-border px-3 py-2.5"
                >
                  <VideoRowThumb url={url} />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-itec-sky uppercase tracking-widest">
                      {videoPlatformLabel(url)}
                    </span>
                    <span className="text-xs text-itec-muted truncate">{url}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMedia("video", url)}
                    disabled={deleting === url}
                    className="flex items-center justify-center w-8 h-8 shrink-0 rounded-xl text-itec-muted hover:text-red-400 transition-colors"
                    title="Eliminar video"
                  >
                    {deleting === url ? <span className="animate-spin text-xs">⏳</span> : <Trash2 size={13} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Agregar link de video ──────────────────────────────────────── */}
        {aula.videos.length < 3 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-itec-muted uppercase tracking-widest flex items-center gap-1.5">
              <Video size={11} /> Agregar link de video ({3 - aula.videos.length} disponible{3 - aula.videos.length !== 1 ? "s" : ""})
            </h3>

            {/* Preview thumbnail si es YouTube */}
            {videoPreview && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-itec-border bg-black">
                <img src={videoPreview} alt="preview" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600/90">
                    <Play size={20} className="text-white fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                  YouTube · Preview
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... · Drive · Vimeo..."
                value={videoInput}
                onChange={(e) => handleVideoInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddVideo()}
                className={fieldCls}
              />
              <Button
                variant="primary"
                hierarchy="solid"
                onClick={handleAddVideo}
                isLoading={addingVideo}
                disabled={!videoInput.trim()}
              >
                <Link size={14} className="mr-1" /> Agregar
              </Button>
            </div>

            {videoError && (
              <p className="text-xs text-red-400 px-1">{videoError}</p>
            )}

            <p className="text-[10px] text-itec-muted/60 leading-relaxed">
              Soporta: YouTube (incluye Shorts y videos en vivo), Google Drive (compartido como "Cualquiera con el link"),
              Vimeo, y cualquier URL directa de video. El link se embebe directamente en el slider del aula.
            </p>
          </section>
        )}

        {/* ── Subir nuevas imágenes ──────────────────────────────────────── */}
        {aula.imagenes.length < 10 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-itec-muted uppercase tracking-widest">
              Agregar imágenes ({10 - aula.imagenes.length} disponible{10 - aula.imagenes.length !== 1 ? "s" : ""})
            </h3>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 h-24 rounded-2xl border-2 border-dashed border-itec-border text-itec-muted hover:border-itec-sky hover:text-itec-sky transition-colors text-sm"
            >
              <Upload size={18} /> Seleccionar imágenes (máx. {10 - aula.imagenes.length - previews.length} más)
            </button>
            {previews.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {previews.map(({ url }, i) => (
                    <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-itec-border">
                      <img src={url} alt={`preview-${i}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black/70 text-white text-xs"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="primary" hierarchy="solid" onClick={handleUpload} isLoading={uploading}>
                  Subir {previews.length} imagen{previews.length !== 1 ? "es" : ""}
                </Button>
              </div>
            )}
          </section>
        )}

        <div className="flex justify-end pt-2 border-t border-white/5">
          <Button variant="secondary" hierarchy="ghost" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </LayoutModal>
  );
};
