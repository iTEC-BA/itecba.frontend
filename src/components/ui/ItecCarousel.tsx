/* eslint-disable react-refresh/only-export-components */

/**
 * ItecCarousel — Sistema global de carruseles para iTEC BA (UTN FRBA)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * EXPORTS:
 *   ItecCarousel          → Carrusel horizontal de scroll-snap para tarjetas u
 *                           otros elementos genéricos.
 *   ItecCarousel.Item     → Sub-componente (wrapper shrink-0 / snap-align).
 *
 *   ItecMediaSlider       → Slider de medios completo: imágenes + videos.
 *                           Compatible con YouTube, Google Drive, Vimeo y
 *                           videos nativos (MP4/WebM). Soporta lightbox,
 *                           thumbnails, dots y auto-advance.
 *
 * CARACTERÍSTICAS CLAVE:
 *   ✔ Lazy loading real   — los videos no cargan hasta que el usuario los
 *                           activa (patrón "lite embed").
 *   ✔ Swipe táctil        — navegación con deslizamiento en mobile.
 *   ✔ Responsive          — flechas ocultas en mobile, táctil siempre presente.
 *   ✔ Lightbox de imágenes— zoom a pantalla completa al hacer clic.
 *   ✔ Auto-detección      — detecta tipo de medio por extensión/dominio.
 *   ✔ Thumbnails lazy     — tira inferior con IntersectionObserver.
 *   ✔ Auto-advance        — configurable con pausa al interactuar.
 *
 * USO TÍPICO:
 *
 *   // Carrusel de tarjetas (scroll horizontal)
 *   <ItecCarousel gap="gap-4">
 *     <ItecCarousel.Item className="w-64">...</ItecCarousel.Item>
 *   </ItecCarousel>
 *
 *   // Slider de medios (imágenes y videos)
 *   <ItecMediaSlider
 *     items={[
 *       { url: "https://example.com/foto.jpg" },
 *       { url: "https://youtu.be/dQw4w9WgXcQ", title: "Mi Video" },
 *       { url: "https://drive.google.com/file/d/ID/view" },
 *     ]}
 *   />
 *
 * MIGRACIÓN DESDE COMPONENTES ANTERIORES:
 *   MediaSlider       → <ItecMediaSlider items={fromAulasMedia(imagenes, videos)} />
 *   GradeMediaSlider  → <ItecMediaSlider items={fromGradeMedia(media)} />
 *   ItecCarousel (v1) → Sin cambios, mismo contrato de props.
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, Play, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Tipos públicos
// ─────────────────────────────────────────────────────────────────────────────

export type MediaType = "image" | "video";

/**
 * Ítem de medio para ItecMediaSlider.
 * Si `type` se omite, se detecta automáticamente por la URL.
 */
export interface MediaItem {
  /** URL de la imagen o video */
  url: string;
  /** Tipo de medio. Si se omite, se detecta por extensión/dominio. */
  type?: MediaType;
  /** Título / caption opcional */
  title?: string;
  /**
   * Thumbnail custom.
   * Para YouTube se genera automáticamente; para otros se usa como fallback.
   */
  thumbnail?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Helpers de URL (exportados para reuso)
// ─────────────────────────────────────────────────────────────────────────────

const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|avif|svg|bmp)(\?.*)?$/i;
const VIDEO_EXTS = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)(\?.*)?$/i;

/**
 * Detecta si una URL corresponde a una imagen o video.
 * Prioriza extensiones; luego detecta por dominio conocido.
 */
export function detectMediaType(url: string): MediaType {
  if (IMAGE_EXTS.test(url)) return "image";
  if (VIDEO_EXTS.test(url)) return "video";
  if (isYouTube(url) || isGoogleDrive(url) || isVimeo(url)) return "video";
  return "image"; // fallback seguro
}

export function isYouTube(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export function isGoogleDrive(url: string): boolean {
  return url.includes("drive.google.com");
}

export function isVimeo(url: string): boolean {
  return url.includes("vimeo.com");
}

/** Extrae el ID de video de YouTube de cualquier formato de URL. */
export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const kws = ["shorts", "live", "embed", "v"];
    const i = parts.findIndex((p) => kws.includes(p));
    if (i !== -1 && parts[i + 1]) return parts[i + 1];
    if (u.hostname === "youtu.be") return parts[0] ?? null;
  } catch {
    /* URL inválida */
  }
  return null;
}

/** Thumbnail de YouTube en calidad mqdefault (320×180). */
export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

/** Extrae el ID de video de Vimeo. */
export function getVimeoId(url: string): string | null {
  return url.match(/vimeo\.com\/(\d+)/)?.[1] ?? null;
}

/**
 * Convierte cualquier URL de video en su URL de embed.
 * - YouTube  → /embed/ID?rel=0&autoplay=1
 * - Drive    → /file/d/ID/preview
 * - Vimeo    → player.vimeo.com/video/ID?autoplay=1
 * - Nativos  → misma URL (se usa <video>)
 */
export function toEmbedUrl(url: string): string {
  if (isYouTube(url)) {
    const id = getYouTubeId(url);
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`;
    if (url.includes("/embed/")) return url;
  }
  if (isGoogleDrive(url)) {
    try {
      const u = new URL(url);
      const fileId =
        u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ??
        u.searchParams.get("id");
      if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
    } catch {
      /* noop */
    }
  }
  if (isVimeo(url)) {
    const id = getVimeoId(url);
    if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return url; // video nativo (MP4, WebM, etc.)
}

/** ¿Requiere iframe para embedir? (YouTube, Drive, Vimeo o URL ya transformada). */
function requiresIframe(url: string): boolean {
  return isYouTube(url) || isGoogleDrive(url) || isVimeo(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Helpers de migración
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convierte el formato de MediaSlider (aulas) a MediaItem[].
 * @example
 *   <ItecMediaSlider items={fromAulasMedia(imagenes, videos)} />
 */
export function fromAulasMedia(
  imagenes: string[],
  videos: string[]
): MediaItem[] {
  return [
    ...imagenes.map((url) => ({ url, type: "image" as const })),
    ...videos.map((url) => ({ url, type: "video" as const })),
  ];
}

/**
 * Convierte el formato de GradeMediaSlider a MediaItem[].
 * @example
 *   <ItecMediaSlider items={fromGradeMedia(config.media)} />
 */
export function fromGradeMedia(
  media: Array<{ url: string; tipo: "image" | "video"; titulo?: string }>
): MediaItem[] {
  return media.map((m) => ({
    url: m.url,
    type: m.tipo,
    title: m.titulo,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Normalización interna
// ─────────────────────────────────────────────────────────────────────────────

interface NormalizedItem extends Required<MediaItem> {
  embedUrl: string;
  usesIframe: boolean;
}

function normalizeItems(items: MediaItem[]): NormalizedItem[] {
  return items.map((item) => {
    const type = item.type ?? detectMediaType(item.url);
    const usesIframe = type === "video" && requiresIframe(item.url);
    const embedUrl = type === "video" ? toEmbedUrl(item.url) : item.url;

    let thumbnail = item.thumbnail ?? "";
    if (!thumbnail && type === "video" && isYouTube(item.url)) {
      thumbnail = getYouTubeThumbnail(item.url) ?? "";
    }

    return {
      url: item.url,
      type,
      title: item.title ?? "",
      thumbnail,
      embedUrl,
      usesIframe,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — Sub-componente: VideoPlayer (lazy, click-to-load)
// ─────────────────────────────────────────────────────────────────────────────

interface VideoPlayerProps {
  item: NormalizedItem;
  /** índice usado como key para forzar re-mount al cambiar de ítem */
  slideKey: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ item }) => {
  // Los iframes (YouTube/Drive/Vimeo) no cargan hasta que el usuario hace clic.
  // Esto elimina la carga pesada de scripts de YouTube/Vimeo en el primer render.
  const [activated, setActivated] = useState(false);

  if (item.usesIframe) {
    if (!activated) {
      return (
        <button
          className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer group/play overflow-hidden"
          onClick={() => setActivated(true)}
          aria-label={`Reproducir: ${item.title || "video"}`}
        >
          {/* Thumbnail de fondo */}
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title || "Thumbnail de video"}
              className="absolute inset-0 w-full h-full object-cover opacity-75 transition-opacity group-hover/play:opacity-60"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-itec-surface to-black/80" />
          )}

          {/* Botón play */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl",
                "bg-black/70 border border-white/20",
                "group-hover/play:bg-itec-blue-skye group-hover/play:scale-110",
                "transition-all duration-200"
              )}
            >
              <Play size={26} className="text-white fill-white ml-1.5" />
            </div>
            {item.title && (
              <span className="text-white/80 text-xs font-medium px-3 text-center line-clamp-2 max-w-[80%]">
                {item.title}
              </span>
            )}
          </div>

          {/* Hint touch/click */}
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-white/40 font-medium tracking-wide select-none">
            Tocá para reproducir
          </span>

          {/* Badge de plataforma */}
          {isYouTube(item.url) && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
              YouTube
            </span>
          )}
          {isVimeo(item.url) && (
            <span className="absolute top-3 right-3 bg-[#1ab7ea] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
              Vimeo
            </span>
          )}
          {isGoogleDrive(item.url) && (
            <span className="absolute top-3 right-3 bg-white/10 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/20">
              Drive
            </span>
          )}
        </button>
      );
    }

    // iframe activado (usuario hizo clic → carga el player real)
    return (
      <iframe
        key={item.embedUrl}
        src={item.embedUrl}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        title={item.title || "Video"}
      />
    );
  }

  // Video nativo (MP4, WebM, Cloudinary, itec.ba, etc.)
  return (
    <video
      key={item.url}
      src={item.url}
      controls
      preload="none" // lazy: no descarga nada hasta que el usuario interactúa
      className="w-full h-full"
      playsInline
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — Sub-componente: Thumbnail en la tira inferior
// ─────────────────────────────────────────────────────────────────────────────

interface ThumbnailProps {
  item: NormalizedItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ThumbnailButton: React.FC<ThumbnailProps> = ({
  item,
  index,
  isActive,
  onClick,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  // IntersectionObserver: carga el thumbnail sólo cuando aparece en pantalla
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect(); // ya cargó, no necesita seguir observando
        }
      },
      { threshold: 0.1, rootMargin: "0px 40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hasThumbnail = !!(
    item.thumbnail ||
    (item.type === "image" && item.url)
  );

  const imgSrc = item.type === "image" ? item.url : (item.thumbnail || "");

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={cn(
        "relative shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-itec-blue-skye focus-visible:outline-none",
        isActive
          ? "border-itec-blue-skye scale-105 shadow-[0_0_10px_rgba(0,74,173,0.45)]"
          : "border-transparent opacity-50 hover:opacity-80 hover:border-itec-border"
      )}
      aria-label={`Ir a media ${index + 1}${item.title ? `: ${item.title}` : ""}`}
      aria-pressed={isActive}
    >
      {/* Contenido lazy */}
      {visible && hasThumbnail && (
        <img
          src={imgSrc}
          alt={item.title || `Thumbnail ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Fallback para video sin thumbnail */}
      {visible && !hasThumbnail && (
        <div className="w-full h-full bg-itec-surface flex flex-col items-center justify-center gap-0.5 text-itec-muted">
          <Play size={11} />
          <span className="text-[8px]">Video</span>
        </div>
      )}

      {/* Skeleton mientras no es visible */}
      {!visible && (
        <div className="w-full h-full bg-itec-surface animate-pulse" />
      )}

      {/* Badge de video */}
      {item.type === "video" && (
        <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-black/75 flex items-center justify-center">
          <Play size={7} className="text-white fill-white" />
        </div>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — ItecMediaSlider (componente principal de medios)
// ─────────────────────────────────────────────────────────────────────────────

const ASPECT_MAP: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
};

export interface ItecMediaSliderProps {
  /** Lista de medios a mostrar (imágenes y/o videos). */
  items: MediaItem[];
  /**
   * Proporción del visor principal.
   * @default "video" (16:9)
   */
  aspectRatio?: "video" | "square" | "4/3" | "3/2";
  /**
   * Muestra lightbox al hacer clic en imágenes.
   * @default true
   */
  showLightbox?: boolean;
  /**
   * Muestra dots de navegación superpuestos al visor.
   * @default true
   */
  showDots?: boolean;
  /**
   * Muestra la tira horizontal de thumbnails.
   * @default true
   */
  showThumbnails?: boolean;
  /**
   * Muestra flechas prev/next. En mobile se ocultan; el swipe es la forma
   * natural de navegar.
   * @default true
   */
  showArrows?: boolean;
  /**
   * Milisegundos entre avances automáticos.
   * Si es undefined/0, no hay auto-advance.
   * @example 5000
   */
  autoPlayInterval?: number;
  /** Clase CSS extra para el contenedor raíz. */
  className?: string;
  /** Texto mostrado cuando `items` está vacío. */
  emptyLabel?: string;
  /** Callback al cambiar de ítem. Recibe el índice nuevo. */
  onIndexChange?: (index: number) => void;
}

export const ItecMediaSlider: React.FC<ItecMediaSliderProps> = ({
  items,
  aspectRatio = "video",
  showLightbox = true,
  showDots = true,
  showThumbnails = true,
  showArrows = true,
  autoPlayInterval,
  className,
  emptyLabel = "Sin medios disponibles aún",
  onIndexChange,
}) => {
  const normalized = useMemo(() => normalizeItems(items), [items]);
  const total = normalized.length;

  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Swipe táctil
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // ── Navegación ──────────────────────────────────────────────────────────────

  const goTo = useCallback(
    (newIdx: number) => {
      const clamped = ((newIdx % total) + total) % total;
      setIdx(clamped);
      onIndexChange?.(clamped);
    },
    [total, onIndexChange]
  );

  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);
  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);

  // ── Auto-advance ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!autoPlayInterval || total <= 1 || isPaused) return;
    timerRef.current = setInterval(() => goTo(idx + 1), autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlayInterval, total, isPaused, idx, goTo]);

  // ── Swipe táctil ───────────────────────────────────────────────────────────

  const handleTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true); // pausa auto-advance mientras el usuario toca
  };

  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    // Solo navega si el swipe es principalmente horizontal
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setTimeout(() => setIsPaused(false), 3000); // reanuda tras 3 s
  };

  // ── Keyboard ────────────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(null);
    },
    [prev, next]
  );

  // ── Render vacío ────────────────────────────────────────────────────────────

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-56 rounded-xl bg-itec-surface border border-itec-border text-itec-muted">
        <ImageIcon size={32} className="opacity-30" />
        <span className="text-sm">{emptyLabel}</span>
      </div>
    );
  }

  const current = normalized[Math.min(idx, total - 1)];
  const aspectClass = ASPECT_MAP[aspectRatio] ?? "aspect-video";

  return (
    <>
      <div className={cn("w-full", className)}>
        {/* ── Visor principal ─────────────────────────────────────────────── */}
        <div
          className={cn(
            "relative w-full rounded-xl overflow-hidden select-none",
            "bg-black border border-itec-border",
            aspectClass
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Carrusel de medios"
          aria-roledescription="carousel"
        >
          {/* ── Contenido actual ─── */}
          {current.type === "image" ? (
            <img
              key={`img-${idx}-${current.url}`}
              src={current.url}
              alt={current.title || `Foto ${idx + 1}`}
              className={cn(
                "w-full h-full object-contain transition-opacity duration-300",
                showLightbox && "cursor-zoom-in"
              )}
              loading="lazy"
              decoding="async"
              onClick={() => showLightbox && setLightbox(current.url)}
            />
          ) : (
            // key={idx} fuerza re-mount al cambiar de slide → resetea `activated`
            <VideoPlayer key={idx} item={current} slideKey={idx} />
          )}

          {/* Caption */}
          {current.title && (
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
              aria-hidden="true"
            >
              <div className="bg-linear-to-t from-black/80 via-black/30 to-transparent px-4 py-4">
                <p className="text-white text-xs font-medium truncate">
                  {current.title}
                </p>
              </div>
            </div>
          )}

          {/* ── Flechas de navegación (desktop) ─── */}
          {showArrows && total > 1 && (
            <>
              <button
                onClick={prev}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-20",
                  "hidden md:flex items-center justify-center",
                  "w-9 h-9 rounded-full",
                  "bg-black/60 text-white border border-white/10",
                  "hover:bg-black/85 hover:scale-105",
                  "transition-all duration-150 shadow-lg",
                  "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                )}
                aria-label="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-20",
                  "hidden md:flex items-center justify-center",
                  "w-9 h-9 rounded-full",
                  "bg-black/60 text-white border border-white/10",
                  "hover:bg-black/85 hover:scale-105",
                  "transition-all duration-150 shadow-lg",
                  "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                )}
                aria-label="Siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* ── Dots (superpuestos) ─── */}
          {showDots && total > 1 && (
            <div
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5"
              role="tablist"
              aria-label="Navegación de slides"
            >
              {normalized.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`Slide ${i + 1} de ${total}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "transition-all duration-200 rounded-full",
                    i === idx
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
          )}

          {/* Indicador de posición (para mobile, superpuesto arriba a la derecha) */}
          {total > 1 && (
            <div className="absolute top-2.5 right-2.5 z-20 md:hidden">
              <span className="text-[10px] font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                {idx + 1}/{total}
              </span>
            </div>
          )}
        </div>

        {/* ── Tira de thumbnails ───────────────────────────────────────────── */}
        {showThumbnails && total > 1 && (
          <div
            className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="tablist"
            aria-label="Miniaturas"
          >
            {normalized.map((item, i) => (
              <ThumbnailButton
                key={`${i}-${item.url}`}
                item={item}
                index={i}
                isActive={i === idx}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-300 flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
        >
          <button
            className={cn(
              "absolute top-4 right-4 z-10",
              "flex items-center justify-center w-10 h-10 rounded-full",
              "bg-white/10 text-white hover:bg-white/25",
              "transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            )}
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
          <img
            src={lightbox}
            alt="Vista ampliada"
            className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — ItecCarousel (scroll horizontal para tarjetas genéricas)
// ─────────────────────────────────────────────────────────────────────────────

export interface ItecCarouselProps {
  children: React.ReactNode;
  /** Clase CSS extra para el contenedor. */
  className?: string;
  /**
   * Clase Tailwind de gap entre ítems.
   * @default "gap-4"
   */
  gap?: string;
  /**
   * Muestra flechas de navegación (sólo en Desktop, con hover).
   * @default true
   */
  showArrows?: boolean;
}

export const ItecCarousel = ({
  children,
  className,
  gap = "gap-4",
  showArrows = true,
}: ItecCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    // Margen de 2px para evitar fallos de redondeo cross-browser
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    // ResizeObserver recalcula cuando el contenedor cambia de tamaño
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    window.addEventListener("resize", checkScroll);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [children, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Avanza un 80% del ancho visible → deja siempre un "asomo" del próximo ítem
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative group", className)}>
      {/* ── Track de scroll ── */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar",
          gap
        )}
        role="region"
        aria-label="Carrusel"
      >
        {children}
      </div>

      {/* ── Flechas (Desktop, hover de grupo) ── */}
      {showArrows && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "absolute -left-5 top-[calc(50%-1.25rem)] z-10",
              "w-10 h-10 rounded-full shadow-lg",
              "bg-itec-box border border-itec-border text-itec-text",
              "hidden md:flex items-center justify-center",
              "transition-all duration-300",
              "opacity-0 group-hover:opacity-100",
              "disabled:opacity-0 disabled:pointer-events-none",
              "hover:bg-itec-sidebar hover:border-itec-blue-skye hover:text-itec-blue-skye",
              "focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-itec-blue-skye focus-visible:outline-none"
            )}
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "absolute -right-5 top-[calc(50%-1.25rem)] z-10",
              "w-10 h-10 rounded-full shadow-lg",
              "bg-itec-box border border-itec-border text-itec-text",
              "hidden md:flex items-center justify-center",
              "transition-all duration-300",
              "opacity-0 group-hover:opacity-100",
              "disabled:opacity-0 disabled:pointer-events-none",
              "hover:bg-itec-sidebar hover:border-itec-blue-skye hover:text-itec-blue-skye",
              "focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-itec-blue-skye focus-visible:outline-none"
            )}
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9 — ItecCarousel.Item
// ─────────────────────────────────────────────────────────────────────────────

export interface ItecCarouselItemProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Alineación del snap.
   * @default "start"
   */
  snapAlign?: "start" | "center" | "end";
}

export const ItecCarouselItem = ({
  children,
  className,
  snapAlign = "start",
}: ItecCarouselItemProps) => (
  <div
    className={cn(`shrink-0 snap-${snapAlign}`, className)}
    role="group"
    aria-roledescription="slide"
  >
    {children}
  </div>
);

// Asigna Item al objeto Carousel para el uso idiomático: <ItecCarousel.Item>
ItecCarousel.Item = ItecCarouselItem;