import React, { useState, useEffect } from "react";

import { MainLayout }     from "@/components/templates/MainLayout";
import { PageHeader }     from "@/components/ui/PageHeader";
import { PaginationBar }  from "@/components/ui/PaginationBar";
import { usePagination }  from "@/hooks/usePagination";
import { usePageTitle }   from "@/hooks/usePageTitle";
import { useAuthStore }   from '@/stores/authStore';
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

  const { isAdmin }  = useAuthStore();
  const { toast }    = useToast();
  const deleteMutation = useDeleteCourse();

  const { data: rawCourses = [], isLoading } = useCourses();
  const coursesWithProgress: CourseWithLocalProgress[] = enrichWithProgress(rawCourses);
  const { filters, filteredCourses } = useCourseFilters(coursesWithProgress);
  const { paged, page, setPage, totalPages, reset } = usePagination(filteredCourses, PAGE_SIZE);
  const pagedWithProgress: CourseWithLocalProgress[] = enrichWithProgress(paged);

  useEffect(() => {
    reset();
  }, [filters.searchQuery, filters.selectedMateria, filters.selectedCategoria, reset]);

  const [addOpen,    setAddOpen]    = useState(false);
  const [brokenOpen, setBrokenOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseWithLocalProgress | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!window.confirm("¿Eliminar este curso permanentemente?")) return;
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
        title="Todos los cursos de la Academia"
        description="Explora rutas de aprendizaje, preparate para los exámenes y domina nuevas tecnologías."
        iconType="video"
        colorTheme="course"
      >
        {isAdmin && (
          <CourseAdminBar
            onAdd={() => setAddOpen(true)}
            onBrokenVideos={() => setBrokenOpen(true)}
          />
        )}
      </PageHeader>

      <div className="max-w-7xl mx-auto w-full">
        <CourseFilters filters={filters} isLoading={isLoading} />

        <div className="flex items-center justify-between mb-4 mt-2">
          <p className="text-xs text-itec-gray whitespace-nowrap">
            Mostrando <span className="text-itec-text font-bold">{filteredCourses.length}</span> cursos disponibles
          </p>
          <div className="flex-1 hidden sm:block border-t border-dashed border-white/10 mx-4"></div>
        </div>

        <CourseGrid
          courses={pagedWithProgress}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          onEdit={isAdmin ? handleEdit : undefined}
        />

        <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
      </div>

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
