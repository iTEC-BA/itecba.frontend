import React from "react";
import { Icons } from "@/components/ui/icons/Icons";
import type { CourseData, Video } from "../../services/coursesService";

interface Props {
  course: CourseData;
  activeVideo?: Video;
  watchedVideos: Set<string>;
  relatedResourcesCount: number;
  copySuccess: boolean;
  onToggleWatched: (videoId: string, e: React.MouseEvent) => void;
  onOpenMaterialModal: () => void;
  onShare: () => void;
}

export const CourseVideoPlayer: React.FC<Props> = ({
  course, activeVideo, watchedVideos, relatedResourcesCount,
  copySuccess, onToggleWatched, onOpenMaterialModal, onShare,
}) => {
  if (!activeVideo) return (
    <div className="w-full aspect-video bg-itec-card rounded-2xl flex items-center justify-center text-itec-gray">
      <div className="text-center">
        <span className="text-4xl block mb-2 opacity-30">🎬</span>
        <p className="text-xs font-bold uppercase tracking-widest opacity-50">Sin video</p>
      </div>
    </div>
  );

  const vidId = activeVideo.youtubeId || activeVideo.id || "";
  const isWatched = vidId ? watchedVideos.has(vidId) : false;

  return (
    <div className="flex flex-col gap-4">
      {/* iFrame */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {activeVideo.youtubeId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`}
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

      {/* Meta + acciones */}
      <div className="flex flex-col gap-3">
        <h1 className="text-lg md:text-xl font-black text-itec-text leading-snug">
          {activeVideo.title ?? "Lección sin título"}
        </h1>

        {/* Botonera responsive */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={(e) => { if (vidId) onToggleWatched(vidId, e); }}
            disabled={!vidId}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all active:scale-95 ${
              isWatched
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20"
                : "bg-white/5 text-itec-text border border-itec-border hover:bg-white/10"
            }`}
          >
            <div className="w-3.5 h-3.5">
              {isWatched ? <Icons type="check" /> : <Icons type="play" />}
            </div>
            {isWatched ? "Visto" : "Marcar visto"}
          </button>

          <button
            onClick={onOpenMaterialModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide bg-white/5 text-itec-text border border-itec-border hover:bg-white/10 transition-all active:scale-95"
          >
            <div className="w-3.5 h-3.5"><Icons type="documentFill" /></div>
            Recursos
            {relatedResourcesCount > 0 && (
              <span className="bg-itec-blue-skye text-white text-[9px] font-black px-1.5 py-0.5 rounded ml-1">
                {relatedResourcesCount}
              </span>
            )}
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide bg-white/5 text-itec-text border border-itec-border hover:bg-white/10 transition-all active:scale-95"
          >
            <div className="w-3.5 h-3.5">
              {copySuccess ? <Icons type="check" /> : <Icons type="shareNetwork" />}
            </div>
            {copySuccess ? "Copiado" : "Compartir"}
          </button>
        </div>

        {/* Descripción */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
          <p className="text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-2">{course.title}</p>
          <p className="text-sm text-itec-text/80 leading-relaxed">
            {course.description ?? "Sin descripción disponible."}
          </p>
        </div>
      </div>
    </div>
  );
};
