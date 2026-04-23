import React, { useMemo } from 'react';
import { Icons } from '@/components/ui/Icons';
import type { Video } from '../../services/coursesService';

interface Props {
  videos?: Video[];
  currentIndex: number;
  onSelectVideo: (index: number) => void;
  watchedVideos?: Set<string>;
}

export const CoursePlaylist: React.FC<Props> = ({ 
  videos = [], 
  currentIndex, 
  onSelectVideo, 
  watchedVideos = new Set() 
}) => {
  
  // 🟢 Lógica Pura: Cálculo seguro del progreso usando youtubeId como llave maestra
  const { total, watchedCount, progressPercent } = useMemo(() => {
    const totalVideos = videos.length;
    if (totalVideos === 0) return { total: 0, watchedCount: 0, progressPercent: 0 };

    const watched = videos.filter(v => {
      // Usamos youtubeId como ID principal de seguimiento, fallback a id
      const vidId = v.youtubeId || v.id || (v as any)._id;
      return vidId && watchedVideos.has(vidId);
    }).length;

    const percent = Math.round((watched / totalVideos) * 100);
    return { total: totalVideos, watchedCount: watched, progressPercent: percent };
  }, [videos, watchedVideos]);

  // UI: Estado Vacío
  if (total === 0) {
    return (
      <div className="bg-itec-surface/40 border border-white/5 rounded-3xl p-10 shadow-2xl flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
         <span className="text-4xl mb-4 opacity-50">📭</span>
         <p className="text-xs uppercase tracking-widest font-bold">Sin lecciones publicadas</p>
      </div>
    );
  }

  return (
    <div className="bg-itec-surface/40 border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[450px] md:h-auto md:max-h-[650px] animate-fade-in relative group">
      
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none transition-opacity group-hover:bg-blue-500/20"></div>

      {/* HEADER DE LA PLAYLIST */}
      <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01] shrink-0 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm tracking-wide">Contenido del Curso</h3>
          <span className="bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
            {watchedCount} / {total} Completados
          </span>
        </div>
        
        {/* Barra de Progreso Premium */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tu Progreso</span>
            <span className={`text-xl font-black tracking-tighter ${progressPercent === 100 ? 'text-green-400' : 'text-white'}`}>
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                progressPercent === 100 
                  ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
                  : 'bg-gradient-to-r from-blue-500 to-sky-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* LISTA DE VIDEOS (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 relative z-10">
        <div className="flex flex-col gap-1.5">
          {videos.map((video, index) => {
            const isActive = index === currentIndex;
            const videoId = video.youtubeId || video.id || (video as any)._id || '';
            const isWatched = videoId ? watchedVideos.has(videoId) : false;

            return (
              <button
                key={index}
                onClick={() => onSelectVideo(index)}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center gap-4 transition-all duration-300 outline-none group/item ${
                  isActive 
                    ? 'bg-white/[0.08] border border-white/10 shadow-lg' 
                    : 'bg-transparent border border-transparent hover:bg-white/[0.04]'
                }`}
              >
                {/* Ícono de Estado */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isWatched 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : isActive
                      ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                      : 'bg-black/50 text-gray-500 border border-white/10 group-hover/item:text-gray-300 group-hover/item:border-white/20'
                }`}>
                  <div className="w-5 h-5">
                    {isWatched ? <Icons type="check" /> : <Icons type="play" />}
                  </div>
                </div>

                {/* Textos */}
                <div className="flex-1 overflow-hidden pr-2">
                  <h4 className={`text-xs font-bold line-clamp-2 leading-snug transition-colors ${
                    isActive ? 'text-white' : isWatched ? 'text-gray-400' : 'text-gray-300 group-hover/item:text-white'
                  }`}>
                    <span className="text-gray-500 mr-1">{index + 1}.</span> 
                    {video.title || 'Lección sin título'}
                  </h4>
                  {video.duration && (
                    <p className={`text-[9px] uppercase tracking-widest mt-1.5 font-bold ${
                      isActive ? 'text-sky-500' : 'text-gray-600'
                    }`}>
                      {video.duration}
                    </p>
                  )}
                </div>

                {/* Indicador visual lateral si está activo */}
                {isActive && (
                  <div className="w-1 h-8 bg-sky-700 rounded-full shadow-[0_0_10px_rgba(22,123,249,0.8)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};