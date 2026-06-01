// src/features/courses/components/organisms/CourseGrid.tsx
// Grilla de tarjetas de cursos. Admins pueden editar (modal) o eliminar.
import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { CourseCard }           from "../molecules/CourseCard";
import { CourseLoadingState }   from "../atoms/LoadingState";
import { EmptyState }           from "../atoms/EmptyState";
import { CourseCardSkeleton }   from "../molecules/CourseCardSeleton";
import type { CourseData }      from "../../services/coursesService";

export interface CourseWithLocalProgress extends CourseData { localProgress: number; }

interface Props {
  courses:   CourseWithLocalProgress[];
  isLoading: boolean;
  isAdmin:   boolean;
  onDelete:  (e: React.MouseEvent, id: string) => void;
  onEdit?:   (course: CourseWithLocalProgress) => void;
}

const isSystem = (id: string, isOficial: boolean) =>
  isOficial || id.startsWith("arquitectura") || id.startsWith("podcast");

export const CourseGrid: React.FC<Props> = ({ courses, isLoading, isAdmin, onDelete, onEdit }) => {
  if (isLoading) return <CourseLoadingState />;
  if (!courses.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((curso, index) => {
        const id = curso.id ?? ("_id" in curso ? curso._id : undefined);
        const hasData = Boolean(curso && (curso.title || curso.description || curso.imageUrl));

        if (!hasData || !id) {
          console.warn(`⚠️ [CourseGrid] Tarjeta #${index} sin datos suficientes.`, curso);
          return <CourseCardSkeleton key={id ?? `skeleton-${index}`} />;
        }

        const oficial  = curso.categoria === "Oficial" || id.startsWith("seminario") || id.startsWith("analisis");
        const noEditar = isSystem(id, oficial);

        return (
          <div key={id} className="relative group h-full">
            <Link to={`/cursos/${id}`} className="block h-full">
              <CourseCard
                title={curso.title}
                description={curso.description ?? ""}
                progress={curso.localProgress}
                imageUrl={curso.imageUrl}
                isOficial={oficial}
              />
            </Link>

            {/* Botones admin — solo visibles en hover y solo para admins */}
            {isAdmin && !noEditar && (
              <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {onEdit && (
                  <button
                    onClick={(e) => { e.preventDefault(); onEdit(curso); }}
                    className="w-7 h-7 rounded-lg bg-itec-blue-skye/90 hover:bg-itec-blue-skye text-white flex items-center justify-center shadow-md"
                    title="Editar curso"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); onDelete(e, id); }}
                  className="w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-md"
                  title="Eliminar curso"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
