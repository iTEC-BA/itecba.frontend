import React from 'react';
import { Icons } from '@components/ui/Icons';
import type { CourseData, Video } from '../../services/coursesService';

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
  course, activeVideo, watchedVideos, relatedResourcesCount, copySuccess,
  onToggleWatched, onOpenMaterialModal, onShare
}) => {
  
  if (!activeVideo) {
    return (
      <div className="w-full bg-itec-box/40 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center pt-[56.25%] relative shadow-2xl">
         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 opacity-60">
           <span className="text-5xl mb-4">🎬</span>
           <p className="text-xs font-bold uppercase tracking-widest">Video no disponible</p>
         </div>
      </div>
    );
  }

  // 🟢 Lógica Pura: El ID de seguimiento es el youtubeId por seguridad
  const currentVideoId = activeVideo.youtubeId || activeVideo.id || (activeVideo as any)._id || '';
  const isVideoWatched = currentVideoId ? watchedVideos.has(currentVideoId) : false;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Reproductor iframe */}
      <div className="w-full bg-black rounded-[2rem] overflow-hidden relative pt-[56.25%] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5">
        {activeVideo.youtubeId ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`}
            title={activeVideo.title || 'Video del curso'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
           <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs uppercase tracking-widest font-bold">
             ID de YouTube no válido
           </div>
        )}
      </div>
      
      {/* Metadatos y Acciones */}
      <div className="px-2">
        <h1 className="text-2xl md:text-3xl font-black text-itec-textleading-tight mb-6">
          {activeVideo.title || 'Lección sin título'}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shrink-0 shadow-lg border border-white/10">
              <span className="text-itec-textfont-black text-xl">
                {course?.title ? course.title.charAt(0).toUpperCase() : 'C'}
              </span>
            </div>
            <div>
              <h2 className="text-itec-textfont-bold text-sm leading-tight">{course?.title || 'Curso General'}</h2>
              <p className="text-itec-text text-xs font-medium mt-1">{course?.videos?.length || 0} lecciones en total</p>
            </div>
          </div>

          {/* Botonera Premium */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar shrink-0">
            <button 
              onClick={(e) => { if (currentVideoId) onToggleWatched(currentVideoId, e); }}
              disabled={!currentVideoId}
              className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all outline-none ${
                isVideoWatched 
                ? 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20' 
                : 'bg-white/5 text-itec-texthover:bg-white/10 border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="w-4 h-4">{isVideoWatched ? <Icons type="check" /> : <Icons type="play" />}</div>
              {isVideoWatched ? 'Completado' : 'Marcar Visto'}
            </button>

            <button 
              onClick={onOpenMaterialModal}
              className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-white/5 text-gray-300 hover:bg-white/10 hover:text-itec-textborder border-white/10 transition-all outline-none"
            >
              <div className="w-4 h-4"><Icons type="documentFill" /></div>
              Recursos
              {relatedResourcesCount > 0 && (
                <span className="bg-orange-500 text-itec-texttext-[10px] font-black px-2 py-0.5 rounded-md ml-1 shadow-md">
                  {relatedResourcesCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={onShare}
              className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-white/5 text-gray-300 hover:bg-white/10 hover:text-itec-textborder border-white/10 transition-all outline-none"
            >
              {copySuccess ? (
                <><div className="w-4 h-4 text-green-400"><Icons type="check" /></div><span className="text-green-400">Copiado</span></>
              ) : (
                <><div className="w-4 h-4"><Icons type="shareNetwork" /></div> Compartir</>
              )}
            </button>
          </div>
        </div>

        {/* Descripción del Curso Glassmorphism */}
        <div className="mt-6 bg-itec-box/40 border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-6 md:p-8 cursor-default">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Resumen del curso</p>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
            {course?.description || 'No hay descripción detallada disponible para este curso.'}
          </p>
        </div>
      </div>
    </div>
  );
};