import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";
import { Icons } from "@/components/ui/icons/Icons";

export interface VideoItem { title: string; youtubeId: string; duration: string; }

interface Props {
  videos: VideoItem[]; setVideos: (v: VideoItem[]) => void;
  mode: "manual" | "youtube"; setMode: (m: "manual" | "youtube") => void;
  playlistUrl: string; setPlaylistUrl: (u: string) => void;
  onFetchPlaylist: () => void; isFetching: boolean;
}

export const CourseVideoListEditor: React.FC<Props> = ({
  videos, setVideos, mode, setMode, playlistUrl, setPlaylistUrl, onFetchPlaylist, isFetching,
}) => {
  const [dragged, setDragged] = useState<number | null>(null);

  const add = () => setVideos([...videos, { title: "", youtubeId: "", duration: "" }]);
  const remove = (i: number) => setVideos(videos.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof VideoItem, val: string) => { const next = [...videos]; next[i] = { ...next[i], [field]: val }; setVideos(next); };
  const drop = (i: number) => {
    if (dragged === null || dragged === i) return;
    const next = [...videos]; const item = next.splice(dragged, 1)[0]; next.splice(i, 0, item);
    setVideos(next); setDragged(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-xs font-bold text-itec-section-courses uppercase tracking-widest">Contenido (Legacy)</h3>
          <p className="text-[10px] text-itec-gray mt-0.5">Arrastrá el ⋮⋮ para reordenar.</p>
        </div>
        <div className="flex bg-itec-sidebar border border-itec-border rounded-xl p-1 self-start sm:self-auto">
          {(["manual", "youtube"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${mode === m ? (m === "youtube" ? "bg-red-600 text-white" : "bg-itec-section-courses text-white") : "text-itec-gray hover:text-itec-text"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "youtube" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input fullWidth placeholder="Link de la playlist de YouTube..." value={playlistUrl} onChange={(e: any) => setPlaylistUrl(e.target.value)} className="bg-white/5 border-red-500/30 focus:border-red-500 text-sm py-2.5 rounded-xl" />
          <Button type="button" variant="danger" hierarchy="solid" onClick={onFetchPlaylist} isLoading={isFetching} disabled={!playlistUrl} className="px-6">Importar</Button>
        </div>
      )}

      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        {videos.map((v, i) => (
          <div key={i} draggable onDragStart={() => setDragged(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(i)}
            className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-itec-sidebar border border-itec-border hover:border-itec-section-courses/50 transition-all group ${dragged === i ? "opacity-40 border-dashed border-white/20" : ""}`}>
            <div className="flex items-center gap-2 sm:w-auto shrink-0">
              <span className="text-itec-gray cursor-grab active:cursor-grabbing px-1 text-lg font-bold leading-none">⋮⋮</span>
              <span className="w-6 h-6 rounded-full bg-itec-box border border-itec-border flex items-center justify-center text-[10px] font-bold text-itec-gray">{i + 1}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 items-center w-full">
              <input type="text" placeholder="Título del video..." value={v.title} onChange={(e) => update(i, "title", e.target.value)} className="md:col-span-6 bg-itec-box border border-transparent focus:border-itec-section-courses/40 rounded-lg px-3 py-2 text-xs text-itec-text outline-none transition-all" />
              <input type="text" placeholder="ID YouTube" value={v.youtubeId} onChange={(e) => update(i, "youtubeId", e.target.value)} className="md:col-span-4 bg-itec-box border border-transparent focus:border-itec-section-courses/40 rounded-lg px-3 py-2 text-xs font-mono text-itec-text outline-none transition-all" />
              <input type="text" placeholder="0:00" value={v.duration} onChange={(e) => update(i, "duration", e.target.value)} className="md:col-span-2 bg-itec-box border border-transparent focus:border-itec-section-courses/40 rounded-lg px-3 py-2 text-xs text-center text-itec-text outline-none transition-all" />
            </div>
            <button type="button" onClick={() => remove(i)} disabled={videos.length === 1} className="self-end sm:self-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-all disabled:opacity-0">
              <Icons type="trash" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={add} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-itec-section-courses bg-itec-section-courses/10 border border-itec-section-courses/30 hover:bg-itec-section-courses hover:text-white transition-colors font-bold mt-2">
        <Icons type="plus" className="w-4 h-4" /> Añadir video
      </button>
    </div>
  );
};
