// src/features/courses/components/molecules/CourseDetailHeader.tsx
// Encabezado del detalle de un curso: título, materia, badge oficial.
// Molécula pura: combina átomos, sin lógica de negocio.

import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons/Icons";
import type { CourseData } from "../../services/coursesService";
import { CourseDetailActions } from "../atoms/CourseDetailActions";

interface Props {
  course: CourseData;
  isAdmin: boolean;
  copySuccess: boolean;
  relatedResourcesCount: number;
  onShare: () => void;
  onOpenMaterialModal: () => void;
  onOpenAddResourceModal: () => void;
  onDelete: () => void;
}

export const CourseDetailHeader: React.FC<Props> = ({ course, isAdmin, copySuccess, relatedResourcesCount, onShare, onOpenMaterialModal, onOpenAddResourceModal, onDelete }) => {
  const courseId = course.id || (course as any)._id;
  const isOficial = course.categoria === "Oficial";

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <Link
        to="/cursos"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4"
      >
        <div className="w-4 h-4"><Icons type="arrowLeft" /></div>
        Volver a Cursos
      </Link>

      {/* Título y badges */}
      <div className="flex flex-wrap items-start gap-3 mb-2">
        <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight flex-1">
          {course.title}
        </h1>
        {isOficial && (
          <span className="shrink-0 mt-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Curso Oficial
          </span>
        )}
      </div>

      {course.materia && (
        <p className="text-slate-400 text-sm mb-4">{course.materia}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <CourseDetailActions
          isAdmin={isAdmin}
          copySuccess={copySuccess}
          relatedResourcesCount={relatedResourcesCount}
          onShare={onShare}
          onOpenMaterialModal={onOpenMaterialModal}
          onOpenAddResourceModal={onOpenAddResourceModal}
          onDelete={onDelete}
        />
        {isAdmin && (
          <Link
            to={`/cursos/editar/${courseId}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-itec-border text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold active:scale-95"
          >
            <div className="w-4 h-4"><Icons type="edit" /></div>
            Editar
          </Link>
        )}
      </div>
    </div>
  );
};
