// src/pages/CoursesPage.tsx
// Catálogo de cursos — usa useCourseFilters (Zustand) para persistir filtros entre navegaciones
import React, { useState, Suspense } from "react";
import { MainLayout }   from "@/components/templates/MainLayout";
import { PageHeader }   from "@components/ui/PageHeader";
import { Icons }        from "@/components/ui/icons/Icons";
import { useAuth }      from "@context/AuthContext";
import { usePageTitle } from "@hooks/usePageTitle";
import { useCourses, useDeleteCourse } from "@features/courses/hooks/useCourses";
import { useCourseFilters }            from "@features/courses/hooks/useCourseFilters";
import { CourseGrid }                  from "@features/courses/components/organisms/CourseGrid";
import { CourseFilters }               from "@features/courses/components/molecules/CourseFilters";

const AddCourseModal = React.lazy(() =>
  import("@features/courses/components/organisms/AddCourseModal").then((m) => ({
    default: m.AddCourseModal,
  }))
);

export const CoursesPage: React.FC = () => {
  usePageTitle("Cursos");
  const { isAdmin }     = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dbCourses = [], isLoading } = useCourses();
  const deleteMutation = useDeleteCourse();

  // Usar useCourseFilters (Zustand) para que los filtros sobrevivan navegaciones
  const { filters: rawFilters, filteredCourses } = useCourseFilters(dbCourses);

  // Adaptar setSelectedCategoria para cumplir la interfaz FiltersState (espera string)
  const filters = {
    ...rawFilters,
    setSelectedCategoria: (c: string) => rawFilters.setSelectedCategoria(c as any),
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
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-itec-blue-skye text-white text-sm font-bold hover:opacity-90 transition-all active:scale-95 shrink-0"
            >
              <Icons type="plus" className="w-4 h-4" />
              Nuevo curso
            </button>
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

      {isAdmin && isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
          <AddCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </MainLayout>
  );
};
