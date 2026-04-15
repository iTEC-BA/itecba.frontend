import React from 'react';
import { Icons } from '@/components/atoms/Icons';
import type { CourseData, Video } from '../../services/coursesService';

interface Props {
  course: CourseData;
  activeVideo: Video;
  watchedVideos: Set<string>;
  relatedResourcesCount: number;
  copySuccess: boolean;
  onToggleWatched: (videoId: string, e: React.MouseEvent) => void;
  onOpenMaterialModal: () => void;
  onShare: () => void;
}

export const CourseVideoPlayer: React.FC<Props> = ({
  course, activeVideo, watchedVideos, relatedResourcesCount, copySuccess,
  onToggleWatched, onOpenMaterialModal, onShare
}) => {
  
  // 🔴 CORRECCIÓN CLAVE: Extraemos el ID real (soporte para MongoDB _id)
  const currentVideoId = activeVideo.id || (activeVideo as any)._id;
  const isVideoWatched = watchedVideos.has(currentVideoId);

  return (
    <div className="flex flex-col gap-4">
      {/* Reproductor */}
      <div className="w-full bg-black rounded-xl overflow-hidden relative pt-[56.25%] shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
          title={activeVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* Detalles y Acciones */}
      <div className="mt-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
          {activeVideo.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-itec-gray pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-itec-blue to-blue-500 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">{course.title.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm leading-tight">{course.title}</h2>
              {/* Agregamos seguridad con el encadenamiento opcional ?. */}
              <p className="text-gray-400 text-xs">{course.videos?.length || 0} videos en total</p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {/* Botón Visto corregido con currentVideoId */}
            <button 
              onClick={(e) => onToggleWatched(currentVideoId, e)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isVideoWatched 
                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="w-4 h-4">{isVideoWatched ? <Icons type="check" /> : <Icons type="play" />}</div>
              {isVideoWatched ? 'Visto' : 'Marcar visto'}
            </button>

            <button 
              onClick={onOpenMaterialModal}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <div className="w-4 h-4"><Icons type="documentFill" /></div>
              Materiales
              {relatedResourcesCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  {relatedResourcesCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={onShare}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {copySuccess ? (
                <><div className="w-4 h-4 text-green-400"><Icons type="check" /></div><span className="text-green-400">¡Copiado!</span></>
              ) : (
                <><div className="w-4 h-4"><Icons type="shareNetwork" /></div> Compartir</>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 cursor-default">
          <p className="text-sm font-medium text-white mb-1">Sobre este curso</p>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {course.description}
          </p>
        </div>
      </div>
    </div>
  );
};