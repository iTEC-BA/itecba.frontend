import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { Icons } from "@/components/ui/icons/Icons";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from '@/stores/authStore';
import { CourseVideoPlayer } from "@features/courses/components/organisms/CourseVideoPlayer";
import { CoursePlaylist } from "@features/courses/components/organisms/CoursePlaylist";
import { useCourseById, useDeleteCourse } from "@features/courses/hooks/useCourses";
import { useResources } from "@features/resources/hooks/useResources";

import { CourseBreadcrumb } from "@features/courses/components/molecules/CourseBreadcrumb";
import { ReportVideoModal } from "@features/courses/components/organisms/ReportVideoModal";
import { AddCourseModal } from "@features/courses/components/organisms/AddCourseModal";
import { Edit, Trash, AlertTriangle } from "lucide-react";
import type { Lesson } from "../types/Course";

const CourseAddResourceModal = React.lazy(() =>
  import("@features/courses/components/organisms/CourseAddResourceModal").then((m) => ({ default: m.CourseAddResourceModal }))
);
const CourseMaterialModal = React.lazy(() =>
  import("@features/courses/components/organisms/CourseMaterialModal").then((m) => ({ default: m.CourseMaterialModal }))
);

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();

  const { data: course, isLoading, isError } = useCourseById(id ?? "");
  const { data: allResources = [] } = useResources();
  const deleteMutation = useDeleteCourse();

  const [videoIndex, setVideoIndex] = useState(0);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [isMaterialOpen, setMaterialOpen] = useState(false);
  const [isAddResOpen, setAddResOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [copyOk, setCopyOk] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  const courseId = course?.id || (course as unknown as { _id?: string })?._id || "";

  // ── Extraer todas las lecciones en orden lineal (Planing) ──
  const flatLessons = useMemo<Lesson[]>(() => {
    if (!course) return [];
    if (course.sections && course.sections.length > 0) {
      return course.sections.flatMap(s => s.lessons || []);
    }
    return course.videos || []; // Fallback legacy
  }, [course]);

  useEffect(() => {
    if (courseId && user?.id) {
      try {
        const raw = localStorage.getItem(`itec_course_progress_${user.id}_${courseId}`);
        if (raw) setWatched(new Set(JSON.parse(raw)));
      } catch (e) {
        void e;
      }
    }
  }, [courseId, user?.id]);

  const toggleWatched = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!courseId || !user?.id) return;
    setWatched((prev) => {
      const next = new Set(prev);
      next.has(videoId) ? next.delete(videoId) : next.add(videoId);
      try { localStorage.setItem(`itec_course_progress_${user.id}_${courseId}`, JSON.stringify([...next])); } catch (e) { void e; }
      return next;
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopyOk(true);
    setTimeout(() => setCopyOk(false), 3000);
  };

  const handleDelete = () => {
    if (!window.confirm("¿Eliminar este curso permanentemente?")) return;
    deleteMutation.mutate(courseId, { onSuccess: () => navigate("/cursos") });
  };

  const relatedResources = useMemo(() => {
    if (!course || !allResources.length) return [];
    const clean = (course.title || "").toLowerCase().replace("curso de ", "").trim();
    return allResources.filter((r: any) => r.materia === course.materia || (r.title || "").toLowerCase().includes(clean));
  }, [course, allResources]);

  const activeVideo = flatLessons[videoIndex];
  const hasNext = videoIndex < flatLessons.length - 1;
  const hasPrev = videoIndex > 0;

  if (isLoading) return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-itec-gray/30 border-t-itec-section-courses rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  if (isError || !course) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-itec-gray">
        <span className="text-4xl opacity-40">😕</span>
        <p className="font-bold text-sm">Curso no encontrado</p>
        <Link to="/cursos" className="text-xs text-itec-section-courses hover:underline">Volver a cursos</Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto w-full px-2 lg:px-6 pb-12">
        
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <CourseBreadcrumb 
            crumbs={[
              { label: 'Cursos', href: '/cursos' }, 
              { label: course.title, href: `/cursos/${courseId}` },
              { label: activeVideo?.title || "Reproductor" }
            ]} 
          />
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-itec-box border border-itec-border text-itec-gray hover:text-white hover:border-white/20 text-xs font-bold transition-all">
                <Edit className="size-4" /> Editar
              </button>
              <Button onClick={handleDelete} variant="danger" hierarchy="solid" className="px-3 py-1.5 rounded-lg text-xs font-bold" icon={<Trash className="size-4" />}>
                Eliminar
              </Button>
            </div>
          )}
        </div>

        {/* ── Layout Principal: Grid adaptativo ── */}
        <div className="grid lg:grid-cols-[1fr_332px] xl:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
          
          {/* Columna Izquierda: Reproductor */}
          <div className="flex flex-col min-w-0 w-full gap-6">
            <CourseVideoPlayer
              course={course}
              activeVideo={activeVideo}
              watchedVideos={watched}
              relatedResourcesCount={relatedResources.length}
              copySuccess={copyOk}
              onToggleWatched={toggleWatched}
              onOpenMaterialModal={() => setMaterialOpen(true)}
              onShare={handleShare}
              onNext={() => hasNext && setVideoIndex(videoIndex + 1)}
              onPrev={() => hasPrev && setVideoIndex(videoIndex - 1)}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
            
            {/* Reportar en Desktop inferior */}
            <div className="flex justify-end border-t border-itec-border pt-4">
              <button onClick={() => setReportOpen(true)} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-itec-gray hover:text-itec-red transition-colors">
                <AlertTriangle className="size-3.5" /> Reportar video
              </button>
            </div>
            
            {/* Botón de añadir recurso en mobile */}
            {isAdmin && (
              <button onClick={() => setAddResOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-itec-border bg-itec-box text-itec-gray hover:text-white hover:border-white/20 text-xs font-semibold transition-all lg:hidden">
                <Icons type="plus" className="size-4" /> Añadir recurso a la materia
              </button>
            )}
          </div>

          {/* Columna Derecha: Playlist (Sticky en Desktop) */}
          <aside className="lg:sticky lg:top-24 flex flex-col gap-4">
            <CoursePlaylist
              sections={course.sections}
              currentIndex={videoIndex}
              onSelectVideo={setVideoIndex}
              watchedVideos={watched}
            />
            {isAdmin && (
              <button onClick={() => setAddResOpen(true)}
                className="hidden lg:flex w-full items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-itec-border bg-itec-box text-itec-gray hover:text-white hover:border-white/20 text-xs font-semibold transition-all">
                <Icons type="plus" className="size-4" /> Añadir recurso
              </button>
            )}
          </aside>
        </div>
      </div>

      {/* Modales */}
      <Suspense fallback={null}>
        <CourseMaterialModal isOpen={isMaterialOpen} onClose={() => setMaterialOpen(false)} relatedResources={relatedResources} />
        {isAdmin && <CourseAddResourceModal isOpen={isAddResOpen} onClose={() => setAddResOpen(false)} courseTitle={course.title} materia={course.materia ?? ""} />}
      </Suspense>

      {activeVideo && (
        <ReportVideoModal
          isOpen={reportOpen}
          onClose={() => setReportOpen(false)}
          courseId={courseId}
          videoId={activeVideo.id || (activeVideo as any)._id || ""}
          videoTitle={activeVideo.title}
        />
      )}

      {isAdmin && (
        <AddCourseModal
          isOpen={isEditOpen}
          onClose={() => setEditOpen(false)}
          existingCourse={course}
        />
      )}
    </MainLayout>
  );
};
