import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";
import { Icons } from "@/components/ui/icons/Icons";
import { Star } from "lucide-react";
import type { Section, Lesson } from "../../types/Course";

interface Props {
  sections: Section[];
  setSections: (s: Section[]) => void;
}

const LESSON_TYPES: { value: NonNullable<Lesson["type"]>; label: string }[] = [
  { value: "video", label: "Video" },
  { value: "exam", label: "Examen" },
  { value: "article", label: "Artículo" },
];

export const CourseCurriculumEditor: React.FC<Props> = ({ sections, setSections }) => {
  const addSection = () => setSections([...sections, { title: "", orderIndex: sections.length, lessons: [] }]);
  const updateSectionTitle = (sIdx: number, val: string) => { const next = [...sections]; next[sIdx].title = val; setSections(next); };
  const removeSection = (sIdx: number) => setSections(sections.filter((_, i) => i !== sIdx));
  
  const addLesson = (sIdx: number) => {
    const next = [...sections];
    next[sIdx].lessons.push({ title: "", youtubeId: "", duration: "0:00", description: "", type: "video", isPremium: false });
    setSections(next);
  };

  const updateLesson = (sIdx: number, lIdx: number, field: keyof Lesson, val: string | boolean) => {
    const next = [...sections];
    next[sIdx].lessons[lIdx] = { ...next[sIdx].lessons[lIdx], [field]: val };
    setSections(next);
  };

  const removeLesson = (sIdx: number, lIdx: number) => {
    const next = [...sections];
    next[sIdx].lessons = next[sIdx].lessons.filter((_, i) => i !== lIdx);
    setSections(next);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-itec-section-courses uppercase tracking-widest border-b border-white/10 pb-2">Temario y Apuntes</h3>
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="bg-itec-box border border-itec-border rounded-[1.2rem] p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-[10px] font-bold text-white bg-itec-section-courses px-2.5 py-1 rounded-md uppercase tracking-widest shrink-0">Módulo {sIdx + 1}</span>
              <Input fullWidth placeholder="Título del módulo..." value={sec.title} onChange={(e) => updateSectionTitle(sIdx, e.target.value)} className="bg-white/5 border-transparent focus:border-itec-section-courses/50 text-sm py-2" />
              <button type="button" onClick={() => removeSection(sIdx)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors self-end sm:self-auto shrink-0">
                <Icons type="trash" className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 pl-3 sm:pl-5 border-l-[3px] border-itec-section-courses/30 ml-2">
              {sec.lessons.map((les, lIdx) => (
                <div key={lIdx} className="flex flex-col gap-3 bg-itec-sidebar border border-itec-border hover:border-itec-section-courses/60 rounded-xl p-4 group relative transition-colors shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <Input placeholder="Título de la clase..." value={les.title} onChange={(e) => updateLesson(sIdx, lIdx, "title", e.target.value)} className="md:col-span-6 bg-itec-box border-transparent focus:border-itec-section-courses/50 text-sm py-2" />
                    <Input placeholder="ID YouTube" value={les.youtubeId} onChange={(e) => updateLesson(sIdx, lIdx, "youtubeId", e.target.value)} className="md:col-span-4 bg-itec-box border-transparent focus:border-itec-section-courses/50 text-xs font-mono py-2" />
                    <Input placeholder="0:00" value={les.duration} onChange={(e) => updateLesson(sIdx, lIdx, "duration", e.target.value)} className="md:col-span-2 bg-itec-box border-transparent focus:border-itec-section-courses/50 text-xs text-center py-2 shrink-0" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex bg-itec-box border border-itec-border rounded-lg p-1">
                      {LESSON_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => updateLesson(sIdx, lIdx, "type", t.value)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${
                            (les.type || "video") === t.value
                              ? "bg-itec-section-courses text-white"
                              : "text-itec-gray hover:text-itec-text"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateLesson(sIdx, lIdx, "isPremium", !les.isPremium)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all ${
                        les.isPremium
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                          : "bg-itec-box border-itec-border text-itec-gray hover:text-itec-text"
                      }`}
                    >
                      <Star className="w-3 h-3" /> {les.isPremium ? "Premium" : "Gratuito"}
                    </button>
                  </div>

                  {(les.type === "article" || les.type === "exam") && (
                    <Input
                      fullWidth
                      placeholder="URL del material (PDF, artículo, examen)..."
                      value={les.mediaUrl || ""}
                      onChange={(e) => updateLesson(sIdx, lIdx, "mediaUrl", e.target.value)}
                      className="bg-itec-box border-transparent focus:border-itec-section-courses/50 text-xs py-2"
                    />
                  )}

                  <textarea
                    placeholder="Apuntes de la clase (Soporta Markdown y LaTeX $$x^2$$)..."
                    value={les.description || ""}
                    onChange={(e) => updateLesson(sIdx, lIdx, "description", e.target.value)}
                    className="w-full bg-itec-box border border-transparent rounded-lg px-3 py-2 text-xs text-itec-text placeholder-itec-gray/40 outline-none focus:border-itec-section-courses/50 min-h-[60px] resize-y custom-scrollbar"
                  />
                  <button type="button" onClick={() => removeLesson(sIdx, lIdx)} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-sm">
                    <Icons type="close" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addLesson(sIdx)} className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-itec-section-courses bg-itec-section-courses/10 border border-itec-section-courses/30 hover:bg-itec-section-courses hover:text-white transition-colors">
                <Icons type="plus" className="w-3.5 h-3.5" /> Añadir clase
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="primary" hierarchy="outline" fullWidth onClick={addSection} icon={<Icons type="plus" className="w-4 h-4" />}>
        Añadir nuevo Módulo
      </Button>
    </div>
  );
};
