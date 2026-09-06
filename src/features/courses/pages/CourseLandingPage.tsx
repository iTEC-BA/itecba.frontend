import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { CourseBreadcrumb } from "@features/courses/components/molecules/CourseBreadcrumb";
import { CurriculumAccordion } from "@features/courses/components/molecules/CurriculumAccordion";
import { CourseSidebar } from "@features/courses/components/organisms/CourseSidebar";
import { useCourseById } from "@features/courses/hooks/useCourses";
import { useCourseProgress } from "@features/courses/hooks/useCourseProgress";
import { useAuthStore } from "@/stores/authStore";

export const CourseLandingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { data: course, isLoading, isError } = useCourseById(id ?? "");
  const { watchedVideos, progressPercent } = useCourseProgress(course, user?.id);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-itec-gray/30 border-t-itec-section-courses rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !course) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <p className="text-sm font-bold text-itec-text">Curso no encontrado</p>
          <button onClick={() => navigate("/cursos")} className="text-xs text-itec-section-courses hover:underline">
            Volver al catálogo
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 w-full grid lg:grid-cols-[1fr_332px] gap-6 lg:gap-10 pb-12">
        
        {/* ── Columna Izquierda: Información y Temario ── */}
        <div className="flex flex-col gap-6">
          <CourseBreadcrumb
            crumbs={[{ label: "Cursos", href: "/cursos" }, { label: course.title }]}
            className="mb-2"
          />

          <div className="relative w-full aspect-video rounded-2xl border border-itec-border overflow-hidden bg-itec-sidebar">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-itec-box">
                <span className="text-itec-gray font-medium">Sin portada</span>
              </div>
            )}
            {course.categoria === "Oficial" && (
              <div className="absolute top-4 left-4">
                <span className="bg-itec-section-courses/10 text-itec-section-courses border border-itec-section-courses/30 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest backdrop-blur-sm">
                  Oficial
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-itec-text leading-tight text-balance">
              {course.title}
            </h1>
            {course.materia && (
              <span className="text-xs font-bold uppercase tracking-widest text-itec-gray">
                {course.materia}
              </span>
            )}
            <p className="text-sm text-itec-gray leading-relaxed max-w-[80ch]">
              {course.description || "Este curso aún no tiene una descripción detallada."}
            </p>
          </div>

          <div className="mt-6 border-t border-itec-border pt-8">
            <h2 className="text-lg font-bold text-itec-text mb-6">Contenido del curso</h2>
            {course.sections && course.sections.length > 0 ? (
              <CurriculumAccordion sections={course.sections} watchedVideos={watchedVideos} />
            ) : (
              <div className="p-8 border border-dashed border-itec-border rounded-xl text-center bg-itec-box">
                <p className="text-sm font-medium text-itec-gray">No hay clases publicadas todavía.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Columna Derecha: Sidebar Sticky ── */}
        <aside className="lg:sticky lg:top-24 self-start order-first lg:order-last mb-6 lg:mb-0">
          <CourseSidebar
            course={course}
            progressPercent={progressPercent}
            onStartCourse={() => navigate(`/cursos/${course.id || course._id}/clase`)}
          />
        </aside>

      </div>
    </MainLayout>
  );
};
