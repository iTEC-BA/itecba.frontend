import React from "react";
import { Icons } from "@/components/ui/icons/Icons";
import type { CourseData, Video } from "../../services/coursesService";

interface Props {
  course: CourseData; activeVideo?: Video; watchedVideos: Set<string>; relatedResourcesCount: number; copySuccess: boolean;
  onToggleWatched: (videoId: string, e: React.MouseEvent) => void; onOpenMaterialModal: () => void; onShare: () => void;
}

export const CourseVideoPlayer: React.FC<Props> = ({ course, activeVideo, watchedVideos, relatedResourcesCount, copySuccess, onToggleWatched, onOpenMaterialModal, onShare }) => {
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
    <div className="flex flex-col gap-4">
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-itec-border">
        {activeVideo.youtubeId ? (
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`} title={activeVideo.title ?? "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-itec-gray text-xs font-bold uppercase tracking-widest">
            ID de YouTube no válido
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-lg md:text-xl font-bold text-itec-text leading-snug">{activeVideo.title ?? "Lección sin título"}</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={(e) => { if (vidId) onToggleWatched(vidId, e); }} disabled={!vidId}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              isWatched ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500 hover:bg-emerald-500/20" : "bg-itec-sidebar text-itec-text border border-itec-border hover:border-itec-section-courses"
            }`}>
            <div className="w-3.5 h-3.5">{isWatched ? <Icons type="check" /> : <Icons type="play" />}</div>
            {isWatched ? "Visto" : "Marcar visto"}
          </button>
          <button onClick={onOpenMaterialModal} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide bg-itec-sidebar text-itec-text border border-itec-border hover:border-itec-section-courses transition-colors">
            <div className="w-3.5 h-3.5"><Icons type="documentFill" /></div> Recursos
            {relatedResourcesCount > 0 && <span className="bg-itec-section-courses text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">{relatedResourcesCount}</span>}
          </button>
          <button onClick={onShare} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide bg-itec-sidebar text-itec-text border border-itec-border hover:border-itec-section-courses transition-colors">
            <div className="w-3.5 h-3.5">{copySuccess ? <Icons type="check" /> : <Icons type="shareNetwork" />}</div> {copySuccess ? "Copiado" : "Compartir"}
          </button>
        </div>
        <div className="bg-itec-sidebar border border-itec-border rounded-xl p-4">
          <p className="text-[10px] font-bold text-itec-section-courses uppercase tracking-widest mb-2">{course.title}</p>
          <p className="text-sm text-itec-gray leading-relaxed">{course.description ?? "Sin descripción disponible."}</p>
        </div>
      </div>
    </div>
  );
};
