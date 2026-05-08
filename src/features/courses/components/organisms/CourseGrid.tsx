import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons/Icons";

import { CourseCard } from "../molecules/CourseCard";

import { CourseLoadingState } from "../atoms/LoadingState";
import { EmptyState } from "../atoms/EmptyState";
import type { CourseData } from "../../services/coursesService";
import { CourseCardSkeleton } from "../molecules/CourseCardSeleton";

export interface CourseWithLocalProgress extends CourseData {
  localProgress: number;
}

interface Props {
  courses: CourseWithLocalProgress[];
  isLoading: boolean;
  isAdmin: boolean;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const CourseGrid: React.FC<Props> = ({
  courses,
  isLoading,
  isAdmin,
  onDelete,
}) => {
  if (isLoading) return <CourseLoadingState />;
  if (!courses.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((curso, index) => {
        // Extraemos el ID (Mongoose usa _id, Firebase/Supabase usan id)
        const id = curso.id ?? (curso as unknown as { _id?: string })._id;

        // Verificamos si tiene la información mínima para renderizarse
        const hasData = Boolean(
          curso && (curso.title || curso.description || curso.imageUrl),
        );

        // Si falta información, logueamos el error en la consola y mostramos el Skeleton
        if (!hasData || !id) {
          console.warn(
            `⚠️ [CourseGrid] Error al cargar la tarjeta del curso #${index}. Renderizando Skeleton.`,
            `\nMotivo:`,
            !id
              ? "Falta el ID del curso."
              : "Faltan datos básicos (título, descripción o imagen).",
            `\nDatos recibidos de la base de datos:`,
            curso,
          );
          return <CourseCardSkeleton key={id ?? `skeleton-${index}`} />;
        }

        const isOficial =
          curso.categoria === "Oficial" ||
          id.startsWith("seminario") ||
          id.startsWith("analisis");
        const isSystem =
          isOficial ||
          id.startsWith("arquitectura") ||
          id.startsWith("podcast");

        return (
          <div key={id} className="relative group h-full">
            <Link to={`/cursos/${id}`} className="block h-full">
              {/* Renderizamos la tarjeta real ahora que sabemos que tiene datos */}
              <CourseCard
                title={curso.title}
                description={curso.description ?? ""}
                progress={curso.localProgress}
                imageUrl={curso.imageUrl}
                isOficial={isOficial}
              />
            </Link>

            {isAdmin && !isSystem && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(e, id);
                }}
                className="absolute top-2 right-2 z-20 w-7 h-7 rounded-lg bg-itec-red/90 hover:bg-itec-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                title="Eliminar curso"
              >
                <Icons type="trash" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
