// src/pages/CoursesPage.tsx
// Catálogo de cursos — usa useCourseFilters (Zustand) para persistir filtros entre navegaciones.
// Los admins ven dos botones en el header:
//   • "Nuevo curso"     → abre AddCourseModal (crear/editar cursos)
//   • "Videos rotos"   → abre BrokenVideosModal (revisar y corregir reportes)
import React, { useState, Suspense } from "react";
import { MainLayout }       from "@/components/templates/MainLayout";
import { PageHeader }       from "@components/ui/PageHeader";
import { useAuth }          from "@context/AuthContext";
import { usePageTitle }     from "@hooks/usePageTitle";
import { useCourses, useDeleteCourse } from "@features/courses/hooks/useCourses";
import { useCourseFilters }            from "@features/courses/hooks/useCourseFilters";
import { CourseGrid }                  from "@features/courses/components/organisms/CourseGrid";
import { CourseFilters }               from "@features/courses/components/molecules/CourseFilters";
import { AlertOctagon, PlusIcon } from "lucide-react";
import { Button }                from "@components/ui/Button";

// Lazy-load de modales admin (solo se descargan si el usuario es admin)
const AddCourseModal = React.lazy(() =>
  import("@features/courses/components/organisms/AddCourseModal").then((m) => ({
    default: m.AddCourseModal,
  }))
);
const BrokenVideosModal = React.lazy(() =>
  import("@features/courses/components/organisms/BrokenVideosModal").then((m) => ({
    default: m.BrokenVideosModal,
  }))
);

export const CoursesPage: React.FC = () => {
  usePageTitle("Cursos");
  const { isAdmin } = useAuth();

  const [isAddOpen,    setIsAddOpen]    = useState(false);
  const [isBrokenOpen, setIsBrokenOpen] = useState(false);

  const { data: dbCourses = [], isLoading } = useCourses();
  const deleteMutation = useDeleteCourse();

  const { filters: rawFilters, filteredCourses } = useCourseFilters(dbCourses);

  const filters = {
    ...rawFilters,
    setSelectedCategoria: (c: string) =>
      rawFilters.setSelectedCategoria(c as Parameters<typeof rawFilters.setSelectedCategoria>[0]),
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("¿Seguro que deseas eliminar este curso?")) return;
    localStorage.removeItem(`itec_course_${id}`);
    deleteMutation.mutate(id, { onError: () => alert("Error al eliminar.") });
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-2 pb-10">
        <PageHeader
          title="Campus de Cursos"
          description="Material audiovisual oficial y comunitario. Aprendé a tu ritmo."
          iconType="playFill"
          colorTheme="blue"
        >
          {/* ── Acciones admin (solo visible para admins) ─────────────────── */}
          {isAdmin && (
            <>
              {/* Botón: Videos rotos */}
              <Button
                onClick={() => setIsBrokenOpen(true)}
                variant="danger"
                hierarchy="solid"
                icon={<AlertOctagon className="size-4" />}
                className="shrink-0"
                title="Revisar videos reportados"
              >
                Videos rotos
              </Button>

              {/* Botón: Nuevo curso */}
              <Button
                onClick={() => setIsAddOpen(true)}
                variant="primary"
                hierarchy="solid"
                icon={<PlusIcon className="size-4" />}
                className="shrink-0"
              >
                Nuevo curso
              </Button>
            </>
          )}
        </PageHeader>

        <CourseFilters filters={filters} isLoading={isLoading} />
        <CourseGrid
          courses={filteredCourses}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Modales admin (lazy, solo se montan si isAdmin) ─────────────────── */}
      {isAdmin && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
          <AddCourseModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
          />
          <BrokenVideosModal
            isOpen={isBrokenOpen}
            onClose={() => setIsBrokenOpen(false)}
          />
        </Suspense>
      )}
    </MainLayout>
  );
};