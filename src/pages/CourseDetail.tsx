import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { Icons } from "@/components/ui/icons/Icons";
import { useAuth } from "@context/AuthContext";
import { CourseVideoPlayer } from "@features/courses/components/organisms/CourseVideoPlayer";
import { CoursePlaylist } from "@features/courses/components/organisms/CoursePlaylist";
import { useCourseById, useDeleteCourse } from "@features/courses/hooks/useCourses";
import { useResources } from "@features/resources/hooks/useResources";

// Nuevos componentes integrados
import { CourseBreadcrumb } from "@features/courses/components/molecules/CourseBreadcrumb";
import { CourseProgressBadge } from "@features/courses/components/atoms/CourseProgressBadge";
import { ReportVideoModal } from "@features/courses/components/organisms/ReportVideoModal";

const CourseAddResourceModal = React.lazy(() =>
  import("@features/courses/components/organisms/CourseAddResourceModal").then((m) => ({ default: m.CourseAddResourceModal }))
);
const CourseMaterialModal = React.lazy(() =>
  import("@features/courses/components/organisms/CourseMaterialModal").then((m) => ({ default: m.CourseMaterialModal }))
);

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const { data: course, isLoading } = useCourseById(id ?? "");
  const { data: allResources = [] } = useResources();
  const deleteMutation = useDeleteCourse();

  const [videoIndex, setVideoIndex] = useState(0);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [isMaterialOpen, setMaterialOpen] = useState(false);
  const [isAddResOpen, setAddResOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [copyOk, setCopyOk] = useState(false);

  const courseId = course?.id || (course as unknown as { _id?: string })?._id || "";

  useEffect(() => {
    if (courseId && user?.id) {
      try {
        const raw = localStorage.getItem(`itec_course_progress_${user.id}_${courseId}`);
        if (raw) setWatched(new Set(JSON.parse(raw)));
      } catch (e) {
        // ignore JSON / storage errors
        void e;
      }
    }
  }, [courseId, user?.id]);

  const toggleWatched = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!courseId || !user?.id) return;
    setWatched((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }
      try {
        localStorage.setItem(`itec_course_progress_${user.id}_${courseId}`, JSON.stringify([...next]));
      } catch (e) {
        // ignore storage errors
        void e;
      }
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
    return allResources.filter((r: unknown) => {
      const item = r as { materia?: string; title?: string };
      return item.materia === course.materia || (item.title || "").toLowerCase().includes(clean);
    });
  }, [course, allResources]);

  const activeVideo = course?.videos?.[videoIndex];
  
  // Cálculo de progreso para el CourseProgressBadge
  const progressPercent = course?.videos?.length 
    ? Math.round((watched.size / course.videos.length) * 100) 
    : 0;

  if (isLoading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-2 border-itec-gray/30 border-t-itec-blue-skye rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  if (!course) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-itec-gray">
        <span className="text-4xl opacity-40">😕</span>
        <p className="font-bold text-sm">Curso no encontrado</p>
        <Link to="/cursos" className="text-xs text-itec-blue-skye hover:underline">Volver a cursos</Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-2 pb-10">

        {/* Breadcrumb + admin actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <CourseBreadcrumb crumbs={[{ label: 'Cursos', href: '/cursos' }, { label: course.title }]} />
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link to={`/cursos/editar/${courseId}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-itec-border text-itec-gray hover:text-itec-text text-xs font-bold transition-all">
                <Icons type="edit" className="w-3 h-3" /> Editar
              </Link>
              <button onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-itec-red/10 border border-itec-red/25 text-itec-red hover:bg-itec-red/20 text-xs font-bold transition-all">
                <Icons type="trash" className="w-3 h-3" /> Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Título + badges */}
        <div className="flex flex-wrap items-start gap-2 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-itec-text leading-snug flex-1">{course.title}</h1>
          
          {/* Badge de Progreso Visual */}
          {progressPercent > 0 && (
            <div className="mt-0.5">
              <CourseProgressBadge percent={progressPercent} />
            </div>
          )}

          {course.categoria === "Oficial" && (
            <span className="shrink-0 mt-0.5 bg-itec-blue/20 text-itec-blue-skye border border-itec-blue-skye/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Oficial
            </span>
          )}
          {course.materia && <span className="w-full text-xs text-itec-gray">{course.materia}</span>}
        </div>

        {/* Layout: player + playlist */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Player — ocupa todo el ancho en mobile, 2/3 en desktop */}
          <div className="flex-1 min-w-0">
            <CourseVideoPlayer
              course={course}
              activeVideo={activeVideo}
              watchedVideos={watched}
              relatedResourcesCount={relatedResources.length}
              copySuccess={copyOk}
              onToggleWatched={toggleWatched}
              onOpenMaterialModal={() => setMaterialOpen(true)}
              onShare={handleShare}
            />
            
            {/* Botón de reporte integrado debajo del reproductor */}
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-1.5 text-xs text-itec-gray hover:text-itec-red transition-colors"
              >
                🚩 Reportar video
              </button>
            </div>

            {/* Botón "Ver recursos de la clase" en mobile */}
            {isAdmin && (
              <button onClick={() => setAddResOpen(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-itec-border text-itec-gray hover:text-itec-text hover:border-white/20 text-xs font-semibold transition-all lg:hidden">
                <Icons type="plus" className="w-3.5 h-3.5" /> Añadir recurso
              </button>
            )}
          </div>

          {/* Playlist */}
          <div className="lg:w-80 xl:w-96 shrink-0">
            <CoursePlaylist
              videos={course.videos}
              currentIndex={videoIndex}
              onSelectVideo={setVideoIndex}
              watchedVideos={watched}
            />
            {isAdmin && (
              <button onClick={() => setAddResOpen(true)}
                className="hidden lg:flex mt-3 w-full items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-itec-border text-itec-gray hover:text-itec-text hover:border-white/20 text-xs font-semibold transition-all">
                <Icons type="plus" className="w-3.5 h-3.5" /> Añadir recurso
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <Suspense fallback={null}>
        <CourseMaterialModal isOpen={isMaterialOpen} onClose={() => setMaterialOpen(false)} relatedResources={relatedResources} />
        {isAdmin && <CourseAddResourceModal isOpen={isAddResOpen} onClose={() => setAddResOpen(false)} courseTitle={course.title} materia={course.materia ?? ""} />}
      </Suspense>

      {/* Modal de Reporte */}
          {activeVideo && (
            <ReportVideoModal
              isOpen={reportOpen}
              onClose={() => setReportOpen(false)}
              courseId={courseId}
              videoId={(activeVideo as unknown as { _id?: string; id?: string })._id || (activeVideo as any).id}
              videoTitle={(activeVideo as any).title}
            />
          )}
    </MainLayout>
  );
};