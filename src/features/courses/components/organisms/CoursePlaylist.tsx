import React from 'react';
import { Icons } from '@/components/atoms/Icons';
import type { CourseData, Video } from '../../services/coursesService';

interface Props {
  course: CourseData;
  activeVideo: Video;
  watchedVideos: Set<string>;
  currentProgress: number;
  onVideoSelect: (video: Video) => void;
}

export const CoursePlaylist: React.FC<Props> = ({ course, activeVideo, watchedVideos, currentProgress, onVideoSelect }) => {
  return (
    <div className="bg-itec-surface border border-itec-gray rounded-xl flex flex-col max-h-[600px] lg:max-h-[85vh] overflow-hidden shadow-lg">
      <div className="p-4 bg-itec-surface shrink-0 relative">
        <h3 className="font-bold text-white text-lg">Contenido del curso</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          <span>{watchedVideos.size} / {course.videos?.length || 0} completados</span>
          <span>•</span>
          <span className={`${currentProgress === 100 ? 'text-green-400' : 'text-gray-400'}`}>
            {currentProgress}%
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
          <div className={`h-full transition-all duration-500 ${currentProgress === 100 ? 'bg-green-500' : 'bg-white'}`} style={{ width: `${currentProgress}%` }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
        {course.videos?.map((video, index) => {
          // 🔴 CORRECCIÓN AQUÍ: Soporte para id y _id (MongoDB)
          const vidId = video.id || (video as any)._id;
          const activeId = activeVideo.id || (activeVideo as any)._id;
          
          const isActive = activeId === vidId;
          const isWatched = watchedVideos.has(vidId);

          return (
            <button
              key={vidId || index}
              onClick={() => onVideoSelect(video)}
              className={`w-full text-left flex items-start gap-3 p-2 rounded-lg transition-colors group ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="w-6 flex items-center justify-center shrink-0 mt-1">
                {isActive ? (
                  <div className="w-4 h-4 text-white"><Icons type="playFill" /></div>
                ) : isWatched ? (
                  <div className="w-4 h-4 text-green-500"><Icons type="check" /></div>
                ) : (
                  <span className="text-xs text-gray-500 font-medium group-hover:text-white transition-colors">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className={`text-sm leading-snug line-clamp-2 ${isActive ? 'text-white font-medium' : 'text-gray-300'}`}>
                  {video.title}
                </h4>
                <span className="text-xs text-gray-500 mt-1 block">{video.duration}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};