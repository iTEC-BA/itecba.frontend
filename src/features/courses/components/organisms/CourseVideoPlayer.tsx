import React from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import type { CourseData } from "../../types/Course";
import type { Lesson } from "../../types/Course";

interface Props {
  course: CourseData;
  activeVideo?: Lesson;
  watchedVideos: Set<string>;
  relatedResourcesCount: number;
  copySuccess: boolean;
  onToggleWatched: (videoId: string, e: React.MouseEvent) => void;
  onOpenMaterialModal: () => void;
  onShare: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const CourseVideoPlayer: React.FC<Props> = ({
  course, activeVideo, watchedVideos, relatedResourcesCount, copySuccess,
  onToggleWatched, onOpenMaterialModal, onShare, onNext, onPrev, hasNext, hasPrev
}) => {
  if (!activeVideo) return (
    <div className="w-full aspect-video bg-itec-box border border-dashed border-itec-border rounded-xl flex items-center justify-center text-itec-gray">
      <div className="text-center">
        <span className="text-4xl block mb-2 opacity-30">🎬</span>
        <p className="text-xs font-bold uppercase tracking-widest opacity-50">Sin video</p>
      </div>
    </div>
  );

  const vidId = activeVideo.youtubeId || activeVideo.id || "";
  const isWatched = vidId ? watchedVideos.has(vidId) : false;

  return (
    <div className="flex flex-col gap-6">
      
      {/* ── Reproductor de Video ── */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-itec-border relative">
        {activeVideo.youtubeId ? (
          <iframe 
            className="w-full h-full border-0" 
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0&autoplay=1`} 
            title={activeVideo.title ?? "Video"} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-itec-gray text-xs font-bold uppercase tracking-widest">
            ID de YouTube no válido
          </div>
        )}
      </div>

      {/* ── Información de la Clase y Acciones ── */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-itec-text leading-snug">
          {activeVideo.title ?? "Lección sin título"}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 border-b border-itec-border pb-6">
          <button 
            onClick={(e) => { if (vidId) onToggleWatched(vidId, e); }} 
            disabled={!vidId}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
              isWatched 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20" 
                : "bg-itec-sidebar text-itec-text border-itec-border hover:border-itec-blue-skye/60"
            }`}
          >
            <div className="w-4 h-4">{isWatched ? <Icons type="check" /> : <Icons type="play" />}</div>
            {isWatched ? "Visto" : "Marcar visto"}
          </button>

          <button 
            onClick={onOpenMaterialModal} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide bg-itec-sidebar text-itec-text border border-itec-border hover:border-itec-blue-skye/60 transition-all"
          >
            <div className="w-4 h-4"><Icons type="documentFill" /></div> Recursos
            {relatedResourcesCount > 0 && (
              <span className="bg-itec-blue-skye/20 text-itec-blue-skye border border-itec-blue-skye/40 px-1.5 py-0.5 rounded-md ml-1 leading-none">
                {relatedResourcesCount}
              </span>
            )}
          </button>

          <button 
            onClick={onShare} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide bg-itec-sidebar text-itec-text border border-itec-border hover:border-itec-blue-skye/60 transition-all"
          >
            <div className="w-4 h-4">{copySuccess ? <Icons type="check" className="text-emerald-400" /> : <Icons type="shareNetwork" />}</div> 
            {copySuccess ? "Copiado" : "Compartir"}
          </button>
        </div>

        {/* ── Perfil del Docente (Estilo Flat) ── */}
        <div className="flex items-center gap-4 py-2">
          <div className="w-12 h-12 rounded-xl bg-itec-sidebar border border-itec-border flex items-center justify-center overflow-hidden shrink-0">
            <Icons type="user" className="w-6 h-6 text-itec-gray" />
          </div>
          <div className="flex flex-col min-w-0">
            {course.profesores && course.profesores.length > 0 ? (
              <MarkdownContent
                content={course.profesores.join(", ")}
                className="[&_p]:font-bold [&_p]:text-itec-text [&_p]:mb-0 [&_p]:leading-tight"
              />
            ) : (
              <h4 className="font-bold text-itec-text leading-tight">{course.createdBy || "Equipo iTEC BA"}</h4>
            )}
            <p className="text-xs text-itec-gray mt-0.5">{course.profesores && course.profesores.length > 1 ? "Docentes del curso" : "Docente del curso"}</p>
          </div>
        </div>

        {/* ── Descripciones Markdown (LaTeX soportado) ── */}
        <div className="bg-itec-box border border-itec-border rounded-xl p-5 mt-2 flex flex-col gap-6">
          {activeVideo.description && (
            <div>
              <p className="text-[10px] font-bold text-itec-blue-skye uppercase tracking-widest mb-3">
                Apuntes de la lección
              </p>
              <MarkdownContent content={activeVideo.description} />
            </div>
          )}
          
          <div className={activeVideo.description ? "pt-6 border-t border-itec-border" : ""}>
            <p className="text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-3">
              Acerca del curso: {course.title}
            </p>
            <MarkdownContent content={course.description || "Sin descripción disponible para este curso."} />
          </div>
        </div>
      </div>

      {/* ── Navegación entre clases ── */}
      <nav aria-label="Navegación entre clases" className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {hasPrev ? (
          <button 
            onClick={onPrev}
            className="group flex flex-row items-center gap-3 overflow-hidden rounded-xl border border-itec-border bg-itec-box text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-itec-blue-skye/60"
          >
            <div className="flex shrink-0 items-center justify-center bg-itec-sidebar px-4 py-4 transition-colors border-r border-itec-border group-hover:bg-itec-blue-skye/10">
              <Icons type="arrowLeft" className="h-5 w-5 text-itec-text transition-transform group-hover:-translate-x-1" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-3 pr-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-itec-blue-skye">Clase anterior</span>
              <span className="truncate text-sm font-semibold text-itec-text">Volver a la lección</span>
            </div>
          </button>
        ) : <div aria-hidden="true" className="hidden sm:block"></div>}

        {hasNext && (
          <button 
            onClick={onNext}
            className="group flex flex-row items-center gap-3 overflow-hidden rounded-xl border border-itec-border bg-itec-box text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-itec-blue-skye/60"
          >
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-3 pl-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-itec-blue-skye">Siguiente clase</span>
              <span className="truncate text-sm font-semibold text-itec-text">Avanzar lección</span>
            </div>
            <div className="flex shrink-0 items-center justify-center bg-itec-sidebar px-4 py-4 transition-colors border-l border-itec-border group-hover:bg-itec-blue-skye/10">
              <Icons type="arrowLeft" className="h-5 w-5 rotate-180 text-itec-text transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        )}
      </nav>
    </div>
  );
};
