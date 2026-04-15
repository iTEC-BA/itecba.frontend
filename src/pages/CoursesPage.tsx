import React, { useState, Suspense } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { PageHeader } from "@/components/molecules/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { Icons } from "@/components/atoms/Icons";

import { useCourses, useDeleteCourse } from "@features/courses/hooks/useCourses"; 
import { useCourseSearch } from "@features/courses/hooks/useCourseSearch";
import { CourseGrid } from "@features/courses/components/organisms/CourseGrid";
import { CourseFilters } from "@features/courses/components/molecules/CourseFilters";

const AddCourseModal = React.lazy(() =>
  import("@features/courses/components/organisms/AddCourseModal").then((m) => ({ default: m.AddCourseModal }))
);

export const CoursesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dbCourses = [], isLoading } = useCourses();
  const deleteCourseMutation = useDeleteCourse();

  // 🟢 Lógica encapsulada
  const { filters, filteredCourses } = useCourseSearch(dbCourses);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("¿Seguro que deseas eliminar este curso definitivamente?")) return;

    localStorage.removeItem(`itec_course_${id}`);
    deleteCourseMutation.mutate(id, {
      onError: () => alert("Error al eliminar el curso.")
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 relative z-10">
        
        <PageHeader
          title="Campus de Cursos"
          description="Material audiovisual oficial y comunitario. Potenciá tus estudios, retomá tus clases donde las dejaste y aprendé a tu propio ritmo."
          iconType="playFill"
          colorTheme="blue"
        >
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer bg-slate-900/90 border border-white/10 hover:border-sky-500/50 hover:bg-sky-500/10 text-slate-300 hover:text-sky-400 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 shrink-0"
            >
              <div className="w-4 h-4"><Icons type="plus" /></div>
              Aportar Curso
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
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-slate-950/90" />}>
          <AddCourseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}
    </DashboardLayout>
  );
};