import React, { useState } from "react";
import { ChevronDown, PlayCircle, FileText, CheckCircle, Lock } from "lucide-react";
import type { Section, Lesson } from "../../types/Course";

interface Props {
  sections: Section[];
  watchedVideos?: Set<string>;
}

export const CurriculumAccordion: React.FC<Props> = ({ sections, watchedVideos = new Set() }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [sections[0]?._id || 0]: true, // Abre la primera sección por defecto
  });

  const toggleSection = (id: string | number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getLessonIcon = (lesson: Lesson, isWatched: boolean) => {
    if (lesson.isPremium) return <Lock className="size-6 text-itec-gray" />;
    if (isWatched) return <CheckCircle className="size-6 text-emerald-400" />;
    if (lesson.type === "article") return <FileText className="size-4 text-itec-gray" />;
    return <PlayCircle className="size-6 text-itec-section-courses" />;
  };

  return (
    <div className="flex flex-col border border-itec-border bg-itec-box rounded-xl overflow-hidden">
      {sections.map((section, sIdx) => {
        const key = section._id || sIdx;
        const isOpen = openSections[key] ?? false;
        const lessonsCount = section.lessons?.length || 0;

        return (
          <div key={key} className="border-b border-itec-border last:border-b-0">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-4 bg-itec-section-courses/33 hover:bg-itec-section-courses/17.5 transition-colors focus:outline-none cursor-pointer"
            >
              <div className="flex flex-col items-start text-left gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-itec-section-courses">
                  Módulo {(sIdx + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-sm font-bold text-itec-text">{section.title}</span>
                <span className="text-xs text-itec-gray font-medium mt-1">{lessonsCount} clases</span>
              </div>
              <ChevronDown className={`size-5 text-itec-gray transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <ul className="bg-itec-sidebar border-t border-itec-border py-1.5">
                {section.lessons?.map((lesson: Lesson, lIdx: number) => {
                  const vidId = lesson.youtubeId || lesson._id || "";
                  const isWatched = vidId ? watchedVideos.has(vidId) : false;

                  return (
                    <li
                      key={lesson._id || lIdx}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="shrink-0 flex items-center justify-center size-8 bg-white rounded-full">
                        {getLessonIcon(lesson, isWatched)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isWatched ? "text-itec-gray" : "text-itec-text"}`}>
                          {lesson.title}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] text-itec-gray font-mono">
                        {lesson.duration}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};
