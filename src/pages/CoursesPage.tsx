// src/pages/CoursesPage.tsx
// Pagina de cursos: busqueda normalizada, filtros, paginacion y modales admin.
// Debe estar envuelta en <ToastProvider> (lo hace App.tsx).
import React, { useState, useEffect } from "react";

import { MainLayout }     from "@/components/templates/MainLayout";
import { PageHeader }     from "@/components/ui/PageHeader";
import { PaginationBar }  from "@/components/ui/PaginationBar";
import { usePagination }  from "@/hooks/usePagination";
import { usePageTitle }   from "@/hooks/usePageTitle";
import { useAuth }        from "@/context/AuthContext";
import { useToast }       from "@/features/notifications/components/atoms/Toast";

import { useCourses, useDeleteCourse }  from "@/features/courses/hooks/useCourses";
import { useCourseFilters }             from "@/features/courses/hooks/useCourseFilters";
import { CourseFilters }                from "@/features/courses/components/molecules/CourseFilters";
import { CourseAdminBar }               from "@/features/courses/components/molecules/CourseAdminBar";
import {
  CourseGrid,
  type CourseWithLocalProgress,
} from "@/features/courses/components/organisms/CourseGrid";
import { AddCourseModal }    from "@/features/courses/components/organisms/AddCourseModal";
import { BrokenVideosModal } from "@/features/courses/components/organisms/BrokenVideosModal";
import { CourseResultsInfo } from "@/features/courses/components/atoms/CourseResultsInfo";
import type { CourseData }   from "@/features/courses/services/coursesService";

const PAGE_SIZE = 9;

const readLocalProgress = (courseId: string, totalVideos: number): number => {
  if (!totalVideos) return 0;
  try {
    const raw = localStorage.getItem(`itec_course_${courseId}`);
    if (!raw) return 0;
    const { watched } = JSON.parse(raw) as { watched?: string[] };
    return Math.min(100, Math.round(((watched?.length ?? 0) / totalVideos) * 100));
  } catch {
    return 0;
  }
};

const enrichWithProgress = (courses: CourseData[]): CourseWithLocalProgress[] =>
  courses.map((course) => {
    const id = course._id ?? course.id ?? "";
    return {
      ...course,
      localProgress: readLocalProgress(id, course.videos?.length ?? 0),
    };
  });

export const CoursesPage: React.FC = () => {
  usePageTitle("Cursos");

  const { isAdmin }  = useAuth();
  const { toast }    = useToast();
  const deleteMutation = useDeleteCourse();

  const { data: rawCourses = [], isLoading } = useCourses();
  const coursesWithProgress = enrichWithProgress(rawCourses);
  const { filters, filteredCourses } = useCourseFilters(coursesWithProgress);
  const { paged, page, setPage, totalPages, reset } = usePagination(filteredCourses, PAGE_SIZE);

  useEffect(() => {
    reset();
  }, [filters.searchQuery, filters.selectedMateria, filters.selectedCategoria, reset]);

  const [addOpen,    setAddOpen]    = useState(false);
  const [brokenOpen, setBrokenOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseWithLocalProgress | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!window.confirm("Eliminar este curso permanentemente?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Curso eliminado"),
      onError:   () => toast.error("Error al eliminar el curso"),
    });
  };

  const handleEdit     = (course: CourseWithLocalProgress) => setEditCourse(course);
  const handleAddClose = () => { setAddOpen(false); setEditCourse(null); };

  return (
    <MainLayout>
      <PageHeader
        title="Cursos"
        description="Explora el contenido educativo creado por la comunidad iTEC y el equipo oficial."
        iconType="video"
        colorTheme="blue"
      >
        {isAdmin && (
          <CourseAdminBar
            onAdd={() => setAddOpen(true)}
            onBrokenVideos={() => setBrokenOpen(true)}
          />
        )}
      </PageHeader>

      <CourseFilters filters={filters} isLoading={isLoading} />

      <CourseResultsInfo
        total={filteredCourses.length}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
      />

      <CourseGrid
        courses={paged}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        onEdit={isAdmin ? handleEdit : undefined}
      />

      <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />

      {isAdmin && (
        <>
          <AddCourseModal
            isOpen={addOpen || !!editCourse}
            onClose={handleAddClose}
            existingCourse={editCourse}
          />
          <BrokenVideosModal
            isOpen={brokenOpen}
            onClose={() => setBrokenOpen(false)}
          />
        </>
      )}
    </MainLayout>
  );
};
