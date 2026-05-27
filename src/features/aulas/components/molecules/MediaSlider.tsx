// src/features/aulas/components/molecules/MediaSlider.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X, Play } from "lucide-react";

interface Props {
  imagenes: string[];
  videos:   string[];
}

// ── Helpers de URL ────────────────────────────────────────────────────────────

/** Extrae el ID de video de YouTube de cualquier formato de URL */
const getYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    // youtube.com/watch?v=ID
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    // youtube.com/shorts/ID  |  youtube.com/live/ID  |  youtube.com/embed/ID
    const pathParts = u.pathname.split("/").filter(Boolean);
    const videoKeywords = ["shorts", "live", "embed", "v"];
    const idx = pathParts.findIndex((p) => videoKeywords.includes(p));
    if (idx !== -1 && pathParts[idx + 1]) return pathParts[idx + 1];
    // youtu.be/ID
    if (u.hostname === "youtu.be") return pathParts[0] ?? null;
  } catch { /* URL inválida */ }
  return null;
};

const isYouTube = (url: string) =>
  url.includes("youtube.com") || url.includes("youtu.be");

const isGoogleDrive = (url: string) =>
  url.includes("drive.google.com");

/**
 * Convierte cualquier URL de video soportada en una URL de embed reproducible.
 * Soporta: YouTube (watch, shorts, live, youtu.be), Google Drive.
 * Para otros dominios devuelve la URL original (se intenta con <video>).
 */
const toEmbedUrl = (url: string): string => {
  if (isYouTube(url)) {
    const id = getYouTubeId(url);
    if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    // si ya es embed, devolverla tal cual
    if (url.includes("/embed/")) return url;
  }

  if (isGoogleDrive(url)) {
    // Formatos:
    //   drive.google.com/file/d/FILE_ID/view
    //   drive.google.com/open?id=FILE_ID
    try {
      const u = new URL(url);
      const fileId =
        u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ??
        u.searchParams.get("id");
      if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
    } catch { /* noop */ }
  }

  return url; // otros (Cloudinary video, Vimeo, etc.)
};

/** Thumbnail para mostrar en la tira inferior */
const VideoThumbnail: React.FC<{ url: string }> = ({ url }) => {
  if (isYouTube(url)) {
    const id = getYouTubeId(url);
    if (id) {
      return (
        <img
          src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
          alt="thumb"
          className="w-full h-full object-cover"
        />
      );
    }
  }
  // Fallback genérico para Drive / otros
  return (
    <div className="w-full h-full bg-itec-surface flex flex-col items-center justify-center gap-1 text-itec-muted">
      <Play size={14} />
      <span className="text-[9px]">Video</span>
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

export const MediaSlider: React.FC<Props> = ({ imagenes, videos }) => {
  const allMedia: Array<{ type: "image" | "video"; url: string }> = [
    ...imagenes.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url)   => ({ type: "video" as const, url })),
  ];

  const [idx,      setIdx]      = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (allMedia.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-56 rounded-2xl bg-itec-surface border border-itec-border text-itec-muted">
        <ImageIcon size={32} className="opacity-30" />
        <span className="text-sm">Sin imágenes disponibles aún</span>
      </div>
    );
  }

  const current = allMedia[Math.min(idx, allMedia.length - 1)];
  const prev = () => setIdx((i) => (i - 1 + allMedia.length) % allMedia.length);
  const next = () => setIdx((i) => (i + 1) % allMedia.length);

  const embedUrl = current.type === "video" ? toEmbedUrl(current.url) : null;
  // Decidir si usar <iframe> o <video>: Drive e YouTube usan iframe, el resto puede intentar <video>
  const useIframe = current.type === "video" && (isYouTube(current.url) || isGoogleDrive(current.url) || embedUrl !== current.url);

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-itec-border select-none">
        {/* Media actual */}
        <div className="w-full aspect-video flex items-center justify-center bg-black">
          {current.type === "image" ? (
            <img
              src={current.url}
              alt={`Foto ${idx + 1}`}
              className="w-full h-full object-contain cursor-zoom-in"
              onClick={() => setLightbox(current.url)}
            />
          ) : useIframe ? (
            <iframe
              key={embedUrl!}            // fuerza re-mount al cambiar de video
              src={embedUrl!}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              title={`Video ${idx + 1}`}
            />
          ) : (
            <video
              key={current.url}
              src={current.url}
              controls
              className="w-full h-full"
            />
          )}
        </div>

        {/* Controles prev / next */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allMedia.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`transition-all rounded-full ${
                    i === idx
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Ir a media ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mt-2">
          {allMedia.map((m, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                i === idx
                  ? "border-itec-sky scale-105"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              {m.type === "image" ? (
                <img src={m.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
              ) : (
                <VideoThumbnail url={m.url} />
              )}
              {/* Badge de video */}
              {m.type === "video" && (
                <div className="absolute bottom-0.5 right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-black/70">
                  <Play size={7} className="text-white fill-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox de imágenes */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <img
            src={lightbox}
            alt="Foto ampliada"
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
