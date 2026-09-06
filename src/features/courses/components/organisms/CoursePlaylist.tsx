import React, { useMemo } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { ProgressBar } from "../atoms/ProgressBar";
import type { Section, Lesson } from "../../types/Course";

interface Props { sections?: Section[]; currentIndex: number; onSelectVideo: (i: number) => void; watchedVideos?: Set<string>; }

// Aplana secciones -> lecciones en orden, manteniendo el índice global
// que usan CourseDetail.tsx / CourseVideoPlayer para saber "cuál se está viendo".
const flattenLessons = (sections: Section[]): Lesson[] =>
  sections.flatMap((s) => s.lessons || []);

export const CoursePlaylist: React.FC<Props> = ({ sections = [], currentIndex, onSelectVideo, watchedVideos = new Set() }) => {
  const lessons = useMemo(() => flattenLessons(sections), [sections]);

  const { total, watchedCount, pct } = useMemo(() => {
    const total = lessons.length;
    if (!total) return { total: 0, watchedCount: 0, pct: 0 };
    const watchedCount = lessons.filter((l) => watchedVideos.has(l.youtubeId || l._id || "")).length;
    return { total, watchedCount, pct: Math.round((watchedCount / total) * 100) };
  }, [lessons, watchedVideos]);

  if (!total) return (
    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-itec-border rounded-xl text-itec-gray">
      <span className="text-3xl mb-3 opacity-40">📭</span>
      <p className="text-xs font-bold uppercase tracking-widest">Sin lecciones publicadas</p>
    </div>
  );

  return (
    <div className="flex flex-col bg-itec-box border border-itec-border rounded-xl overflow-hidden h-full max-h-[70vh] md:max-h-[600px]">
      <div className="p-4 border-b border-itec-border shrink-0 bg-itec-sidebar">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-itec-text uppercase tracking-widest">Lecciones</span>
          <span className={`text-xs font-bold ${pct === 100 ? "text-emerald-400" : "text-itec-section-courses"}`}>
            {watchedCount}/{total} · {pct}%
          </span>
        </div>
        <ProgressBar progress={pct} variant={pct === 100 ? "green" : "blue"} />
      </div>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {lessons.map((lesson, i) => {
          const vid = lesson.youtubeId || lesson._id || "";
          const isActive = i === currentIndex;
          const isWatched = vid ? watchedVideos.has(vid) : false;
          return (
            <button
              key={lesson._id || i}
              onClick={() => onSelectVideo(i)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors ${
                isActive
                  ? "bg-itec-sidebar border border-itec-section-courses"
                  : "bg-transparent border border-transparent hover:bg-itec-sidebar hover:border-itec-border"
              }`}
            >
              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isWatched ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500" : isActive ? "bg-itec-section-courses text-white border border-itec-section-courses" : "bg-itec-sidebar border border-itec-border text-itec-gray"
              }`}>
                <div className="w-3.5 h-3.5">
                  {isWatched ? <Icons type="check" /> : <Icons type="play" />}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors ${isActive ? "text-itec-section-courses" : isWatched ? "text-itec-gray" : "text-itec-text"}`}>
                  <span className="text-itec-gray mr-1">{i + 1}.</span>
                  {lesson.title || "Lección sin título"}
                </p>
                {lesson.duration && (
                  <p className={`text-[10px] mt-0.5 font-medium ${isActive ? "text-itec-section-courses/70" : "text-itec-gray"}`}>
                    {lesson.duration}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
