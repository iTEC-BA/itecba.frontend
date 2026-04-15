import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Icons } from '@/components/atoms/Icons';

export interface VideoItem {
  title: string;
  youtubeId: string;
  duration: string;
}

interface Props {
  videos: VideoItem[];
  setVideos: (videos: VideoItem[]) => void;
  mode: 'manual' | 'youtube';
  setMode: (mode: 'manual' | 'youtube') => void;
  playlistUrl: string;
  setPlaylistUrl: (url: string) => void;
  onFetchPlaylist: () => void;
  isFetching: boolean;
}

export const CourseVideoListEditor: React.FC<Props> = ({
  videos, setVideos,
  mode, setMode,
  playlistUrl, setPlaylistUrl,
  onFetchPlaylist, isFetching
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addVideoRow = () => setVideos([...videos, { title: '', youtubeId: '', duration: '' }]);
  const removeVideoRow = (index: number) => setVideos(videos.filter((_, i) => i !== index));

  const updateVideo = (index: number, field: keyof VideoItem, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideos(newVideos);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newVideos = [...videos];
    const draggedVideo = newVideos[draggedIndex];
    newVideos.splice(draggedIndex, 1);
    newVideos.splice(index, 0, draggedVideo);
    setVideos(newVideos);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-itec-gray pb-2">
        <div>
          <h3 className="text-lg font-bold text-white">Contenido del curso</h3>
          <p className="text-[11px] text-gray-400">Pista: Mantén presionado el ícono ⋮⋮ para reordenar los videos.</p>
        </div>

        <div className="flex bg-itec-surface border border-itec-gray rounded-full p-1">
          <button type="button" onClick={() => setMode('manual')} className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase transition-colors ${mode === 'manual' ? 'bg-itec-gray text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            Manual
          </button>
          <button type="button" onClick={() => setMode('youtube')} className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase transition-colors ${mode === 'youtube' ? 'bg-[#FF0000]/20 text-red-500' : 'text-gray-500 hover:text-gray-300'}`}>
            YouTube
          </button>
        </div>
      </div>

      {mode === 'youtube' && (
        <div className="flex flex-col sm:flex-row gap-2 pb-4">
          <div className="flex-1">
             <Input fullWidth placeholder="Pega el link de la Playlist aquí..." value={playlistUrl} onChange={(e: any) => setPlaylistUrl(e.target.value)} className="bg-itec-surface border-red-500/30 text-sm py-2 focus:border-red-500" />
          </div>
          <Button type="button" onClick={onFetchPlaylist} disabled={isFetching || !playlistUrl} className="bg-red-600 hover:bg-red-700 border-none text-white px-6 w-full sm:w-auto shrink-0 py-2">
            {isFetching ? 'Extrayendo...' : 'Extraer Videos'}
          </Button>
        </div>
      )}

      <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 pb-10">
        {videos.map((video, index) => (
          <div 
            key={index} 
            draggable 
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`flex items-center gap-2 p-2 rounded-xl bg-itec-surface/30 hover:bg-itec-surface border border-transparent hover:border-itec-gray/50 transition-all group ${draggedIndex === index ? 'opacity-40 scale-[0.98] border-dashed border-itec-gray' : ''}`}
          >
            <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white px-2 py-2 flex items-center justify-center">
              <span className="text-xl leading-none font-bold">⋮⋮</span>
            </div>
            
            <div className="w-6 h-6 rounded-full bg-itec-bg border border-itec-gray flex items-center justify-center shrink-0 text-gray-400 group-hover:text-white group-hover:border-itec-blue transition-colors">
              <span className="text-[10px] font-bold">{index + 1}</span>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-7 relative">
                <input 
                  type="text" 
                  placeholder="Ej: Unidad 1: Introducción..." 
                  value={video.title} 
                  onChange={(e) => updateVideo(index, 'title', e.target.value)} 
                  title="Clic para editar el título"
                  className="w-full bg-transparent border border-transparent hover:border-itec-gray/80 focus:border-itec-blue focus:bg-itec-bg rounded-md px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-itec-blue outline-none placeholder-gray-600 font-medium transition-all"
                />
              </div>
              <div className="sm:col-span-3">
                <input 
                  type="text" 
                  placeholder="ID: dQw4w9WgXcQ" 
                  value={video.youtubeId} 
                  onChange={(e) => updateVideo(index, 'youtubeId', e.target.value)} 
                  className="w-full bg-transparent border border-transparent hover:border-itec-gray/80 focus:border-itec-blue focus:bg-itec-bg rounded-md px-2 py-1.5 text-[11px] text-gray-400 font-mono focus:ring-1 focus:ring-itec-blue outline-none placeholder-gray-700 transition-all"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <input 
                  type="text" 
                  placeholder="00:00" 
                  value={video.duration} 
                  onChange={(e) => updateVideo(index, 'duration', e.target.value)} 
                  className="w-full bg-transparent border border-transparent hover:border-itec-gray/80 focus:border-itec-blue focus:bg-itec-bg rounded-md px-2 py-1.5 text-xs text-gray-400 text-right focus:ring-1 focus:ring-itec-blue outline-none placeholder-gray-600 transition-all"
                />
              </div>
            </div>

            <button type="button" onClick={() => removeVideoRow(index)} disabled={videos.length === 1} className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg disabled:opacity-0 transition-all shrink-0">
              <Icons type="trash" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addVideoRow} className="mt-4 text-gray-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors py-2">
        <div className="w-6 h-6 rounded-full bg-itec-surface border border-itec-gray flex items-center justify-center">
          <Icons type="plus" className="w-3 h-3" />
        </div>
        Añadir nuevo video
      </button>
    </div>
  );
};