import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { usePageTitle } from "@hooks/usePageTitle";

type GuiaCategory = "Ingresantes" | "Matemática" | "Programación" | "Física" | "Otros";

interface GuiaVideo {
  id: string;
  title: string;
  author: string;
  duration: string;
  category: GuiaCategory;
  pinned?: boolean;
  youtubeId: string;
}

const VIDEOS: GuiaVideo[] = [
  { id: "1", title: "GuíaTEC Ingresantes 2026 — SIU, aula virtual e inscripciones", author: "ITEC", duration: "22 min", category: "Ingresantes", pinned: true, youtubeId: "dQw4w9WgXcQ" },
  { id: "2", title: "AM1 — Límites y continuidad desde cero", author: "Gabi N.", duration: "38 min", category: "Matemática", youtubeId: "dQw4w9WgXcQ" },
  { id: "3", title: "AM2 — Integrales: técnicas y aplicaciones", author: "Jairo T.", duration: "45 min", category: "Matemática", youtubeId: "dQw4w9WgXcQ" },
  { id: "4", title: "C++ para Ingeniería de Sistemas — Fundamentos", author: "Ramón M.", duration: "55 min", category: "Programación", youtubeId: "dQw4w9WgXcQ" },
  { id: "5", title: "PDEP — Programación funcional explicada simple", author: "Gabi N.", duration: "40 min", category: "Programación", youtubeId: "dQw4w9WgXcQ" },
  { id: "6", title: "Física I — Cinemática y dinámica: parcial modelo", author: "Santiago G.", duration: "50 min", category: "Física", youtubeId: "dQw4w9WgXcQ" },
  { id: "7", title: "Álgebra — Transformaciones lineales para parcial", author: "María L.", duration: "30 min", category: "Matemática", youtubeId: "dQw4w9WgXcQ" },
];

const CATEGORIES: GuiaCategory[] = ["Ingresantes", "Matemática", "Programación", "Física", "Otros"];
const CAT_COLORS: Record<GuiaCategory, string> = {
  Ingresantes: "bg-[#004aad]/15 text-[#5b9cf6]",
  Matemática: "bg-[#f0b100]/12 text-[#f0b100]",
  Programación: "bg-[#008854]/15 text-[#2fcc8a]",
  Física: "bg-purple-500/12 text-purple-400",
  Otros: "bg-white/8 text-[#9aa3b0]",
};

export const GuiaTECPage: React.FC = () => {
  usePageTitle("GuíaTEC");
  const [activeCategory, setActiveCategory] = useState<"Todas" | GuiaCategory>("Todas");
  const [playing, setPlaying] = useState<GuiaVideo | null>(null);

  const filtered = VIDEOS.filter(
    (v) => activeCategory === "Todas" || v.category === activeCategory
  );
  const pinned = filtered.filter((v) => v.pinned);
  const rest = filtered.filter((v) => !v.pinned);

  return (
    <MainLayout>
      <PageHeader
        title="GuíaTEC"
        description="Videos explicativos anclados para materias clave, ingresantes y más. Todos gratuitos."
        iconType="video"
        colorTheme="teal"
      />

      {/* Player activo */}
      {playing && (
        <div className="mb-6 bg-itec-card border border-white/7 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="aspect-video bg-black flex items-center justify-center relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-itec-red/20 flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 text-[#e01540]"><Icons type="playFill" className="w-full h-full" /></div>
              </div>
              <p className="text-sm text-[#9aa3b0]">Video en YouTube →</p>
              <a
                href={`https://youtube.com/watch?v=${playing.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#5b9cf6] hover:underline"
              >
                Abrir en YouTube <div className="w-3 h-3"><Icons type="externalLink" className="w-full h-full" /></div>
              </a>
            </div>
          </div>
          <div className="p-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-itec-text">{playing.title}</h3>
              <p className="text-xs text-[#5a6475] mt-1">{playing.author} · {playing.duration}</p>
            </div>
            <button onClick={() => setPlaying(null)} className="text-[#5a6475] hover:text-itec-text shrink-0 text-xl">×</button>
          </div>
        </div>
      )}

      {/* Filtros de categoría */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar">
        {(["Todas", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeCategory === c
                ? "bg-itec-red border-itec-red text-white"
                : "bg-transparent border-white/10 text-[#9aa3b0] hover:border-white/20"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Videos anclados */}
      {pinned.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 text-[#f0b100]"><Icons type="pin" className="w-full h-full" /></div>
            <span className="text-xs font-medium text-[#9aa3b0] uppercase tracking-wider">Anclados para ingresantes</span>
          </div>
          <div className="flex flex-col gap-2">
            {pinned.map((v) => <VideoCard key={v.id} video={v} catColors={CAT_COLORS} onPlay={() => setPlaying(v)} />)}
          </div>
        </div>
      )}

      {/* Resto de videos */}
      {rest.length > 0 && (
        <div>
          <p className="text-xs text-[#5a6475] uppercase tracking-wider mb-3">
            {pinned.length > 0 ? "Más videos" : "Videos disponibles"}
          </p>
          <div className="flex flex-col gap-2">
            {rest.map((v) => <VideoCard key={v.id} video={v} catColors={CAT_COLORS} onPlay={() => setPlaying(v)} />)}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

const VideoCard = ({
  video,
  catColors,
  onPlay,
}: {
  video: GuiaVideo;
  catColors: Record<GuiaCategory, string>;
  onPlay: () => void;
}) => (
  <button
    onClick={onPlay}
    className="text-left w-full bg-itec-card border border-white/7 hover:border-white/12 rounded-xl p-3.5 flex items-center gap-3 transition-colors group"
  >
    <div className="w-11 h-11 rounded-xl bg-itec-red/12 text-[#e01540] flex items-center justify-center shrink-0 group-hover:bg-itec-red/20 transition-colors">
      <div className="w-5 h-5"><Icons type="playFill" className="w-full h-full" /></div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-itec-text truncate">{video.title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-[#5a6475]">{video.author}</span>
        <span className="text-[#5a6475]">·</span>
        <div className="w-3 h-3 text-[#5a6475]"><Icons type="clock" className="w-full h-full" /></div>
        <span className="text-xs text-[#5a6475]">{video.duration}</span>
      </div>
    </div>
    <span className={`text-[10px] font-medium px-2 py-1 rounded-md shrink-0 hidden sm:inline ${catColors[video.category]}`}>
      {video.category}
    </span>
  </button>
);
