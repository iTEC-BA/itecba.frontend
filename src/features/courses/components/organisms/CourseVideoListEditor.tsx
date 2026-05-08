import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";
import { Icons } from "@/components/ui/icons/Icons";

export interface VideoItem { title: string; youtubeId: string; duration: string; }

interface Props {
  videos: VideoItem[];
  setVideos: (v: VideoItem[]) => void;
  mode: "manual" | "youtube";
  setMode: (m: "manual" | "youtube") => void;
  playlistUrl: string;
  setPlaylistUrl: (u: string) => void;
  onFetchPlaylist: () => void;
  isFetching: boolean;
}

export const CourseVideoListEditor: React.FC<Props> = ({
  videos, setVideos, mode, setMode, playlistUrl, setPlaylistUrl, onFetchPlaylist, isFetching,
}) => {
  const [dragged, setDragged] = useState<number | null>(null);

  const add = () => setVideos([...videos, { title: "", youtubeId: "", duration: "" }]);
  const remove = (i: number) => setVideos(videos.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof VideoItem, val: string) => {
    const next = [...videos]; next[i] = { ...next[i], [field]: val }; setVideos(next);
  };
  const drop = (i: number) => {
    if (dragged === null || dragged === i) return;
    const next = [...videos];
    const item = next.splice(dragged, 1)[0];
    next.splice(i, 0, item);
    setVideos(next); setDragged(null);
  };

  return (
    <div className="space-y-4">
      {/* Header + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-3">
        <div>
          <h3 className="text-xs font-black text-itec-text uppercase tracking-widest">Contenido</h3>
          <p className="text-[10px] text-itec-gray mt-0.5">Arrastrá el ⋮⋮ para reordenar.</p>
        </div>
        <div className="flex bg-itec-box border border-itec-border rounded-xl p-1 self-start sm:self-auto">
          {(["manual", "youtube"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${mode === m ? (m === "youtube" ? "bg-red-600 text-white" : "bg-itec-blue-skye text-white") : "text-itec-gray hover:text-itec-text"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Import playlist */}
      {mode === "youtube" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input fullWidth placeholder="Link de la playlist de YouTube..." value={playlistUrl} onChange={(e: any) => setPlaylistUrl(e.target.value)} className="bg-white/[0.04] border-red-500/30 text-sm py-2.5 rounded-xl" />
          <Button type="button" variant="danger" hierarchy="solid" onClick={onFetchPlaylist} isLoading={isFetching} disabled={!playlistUrl}>Importar</Button>
        </div>
      )}

      {/* Lista de videos */}
      <div className="space-y-1.5 max-h-[35vh] overflow-y-auto pr-1">
        {videos.map((v, i) => (
          <div key={i} draggable onDragStart={() => setDragged(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(i)}
            className={`flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-transparent hover:border-white/8 transition-all group ${dragged === i ? "opacity-40 border-dashed border-white/20" : ""}`}>
            <span className="text-itec-gray cursor-grab active:cursor-grabbing px-1 text-lg font-black leading-none">⋮⋮</span>
            <span className="w-5 h-5 rounded-full bg-itec-bg border border-itec-border flex items-center justify-center text-[9px] font-black text-itec-gray shrink-0">{i + 1}</span>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
              <input type="text" placeholder="Título del video..." value={v.title} onChange={(e) => update(i, "title", e.target.value)}
                className="sm:col-span-7 bg-transparent border border-transparent focus:border-itec-blue-skye/40 focus:bg-white/[0.04] rounded-lg px-2 py-1.5 text-xs text-itec-text placeholder-itec-gray/40 outline-none transition-all" />
              <input type="text" placeholder="ID YouTube" value={v.youtubeId} onChange={(e) => update(i, "youtubeId", e.target.value)}
                className="sm:col-span-3 bg-transparent border border-transparent focus:border-itec-blue-skye/40 focus:bg-white/[0.04] rounded-lg px-2 py-1.5 text-[10px] font-mono text-itec-text placeholder-itec-gray/40 outline-none transition-all" />
              <input type="text" placeholder="0:00" value={v.duration} onChange={(e) => update(i, "duration", e.target.value)}
                className="sm:col-span-2 bg-transparent border border-transparent focus:border-itec-blue-skye/40 focus:bg-white/[0.04] rounded-lg px-2 py-1.5 text-[10px] text-itec-text text-right placeholder-itec-gray/40 outline-none transition-all" />
            </div>
            <button type="button" onClick={() => remove(i)} disabled={videos.length === 1}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-itec-gray hover:text-itec-red hover:bg-itec-red/10 rounded-lg transition-all disabled:opacity-0">
              <Icons type="trash" className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={add} className="flex items-center gap-2 text-xs text-itec-gray hover:text-itec-text transition-colors font-semibold mt-1">
        <div className="w-5 h-5 rounded-full bg-white/5 border border-itec-border flex items-center justify-center">
          <Icons type="plus" className="w-3 h-3" />
        </div>
        Añadir video
      </button>
    </div>
  );
};
