import React from "react";
import { Clock, List, LayoutGrid, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CourseData } from "../../types/Course";

interface Props {
  course: CourseData;
  progressPercent: number;
  onStartCourse: () => void;
}

export const CourseSidebar: React.FC<Props> = ({ course, progressPercent, onStartCourse }) => {
  const isComplete = progressPercent >= 100;
  
  const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;
  const totalSections = course.sections?.length || 0;
  const profesores = Array.isArray(course.profesores) ? course.profesores.filter(Boolean) : [];

  return (
    <div className="bg-itec-box border border-itec-border rounded-xl p-5 flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-bold text-itec-text uppercase tracking-widest border-b border-itec-border pb-3 mb-4">
          Resumen del Curso
        </h3>
        <dl className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <dt className="flex items-center gap-2 text-itec-gray font-medium">
              <List className="size-4" /> Capítulos
            </dt>
            <dd className="font-bold text-itec-text">{totalSections}</dd>
          </div>
          <div className="flex items-center justify-between text-xs">
            <dt className="flex items-center gap-2 text-itec-gray font-medium">
              <Clock className="size-4" /> Clases
            </dt>
            <dd className="font-bold text-itec-text">{totalLessons}</dd>
          </div>
          <div className="flex items-center justify-between text-xs">
            <dt className="flex items-center gap-2 text-itec-gray font-medium">
              <LayoutGrid className="size-4" /> Categoría
            </dt>
            <dd className="font-bold text-itec-text">{course.categoria || "Comunidad"}</dd>
          </div>
          {profesores.length > 0 && (
            <div className="flex items-start justify-between gap-3 text-xs">
              <dt className="flex items-center gap-2 text-itec-gray font-medium shrink-0">
                <Users className="size-4" /> {profesores.length > 1 ? "Profesores" : "Profesor"}
              </dt>
              <dd className="font-bold text-itec-text text-right break-words">{profesores.join(", ")}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={onStartCourse}
          variant="primary"
          hierarchy="solid"
          fullWidth
          className="py-3 text-sm bg-itec-section-courses hover:bg-itec-section-courses/90"
        >
          {progressPercent > 0 ? (isComplete ? "Repasar curso" : "Continuar curso") : "Empezar curso"}
        </Button>
        <p className="text-center text-[10px] text-itec-gray mt-1">
          Acceso gratuito con tu cuenta institucional
        </p>
      </div>

      {progressPercent > 0 && (
        <div className="pt-4 border-t border-itec-border">
          <div className="flex justify-between items-center text-[10px] mb-1.5">
            <span className="text-itec-gray font-bold uppercase tracking-widest">Progreso</span>
            <span className={isComplete ? "text-emerald-400 font-bold" : "text-itec-text font-bold"}>
              {isComplete ? "100%" : `${progressPercent}%`}
            </span>
          </div>
          <div className="h-2 w-full bg-itec-sidebar border border-itec-border rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : "bg-itec-section-courses"}`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
