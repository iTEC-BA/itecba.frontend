import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'; // 🔴 Importamos el manejador de caché

// Importaciones con Alias
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Icons } from '@/components/atoms/Icons'; 
import { useAuth } from '@/context/AuthContext';

import { CourseVideoPlayer } from '@features/courses/components/organisms/CourseVideoPlayer';
import { CoursePlaylist } from '@features/courses/components/organisms/CoursePlaylist';

// 🔴 Importamos tus hooks de React Query
import { useCourseById } from '@features/courses/hooks/useCourses';
import type { Video } from "@features/courses/services/coursesService";
// Asumiendo que crearás este hook para resources, si no, lo cambias por tu service normal
import { useResources } from '@features/resources/hooks/useResources'; 

// Lazy Loading de Modales
const AddCourseModal = React.lazy(() => import('@features/courses/components/organisms/AddCourseModal').then(m => ({ default: m.AddCourseModal })));
const CourseMaterialModal = React.lazy(() => import('@features/courses/components/organisms/CourseMaterialModal').then(m => ({ default: m.CourseMaterialModal })));

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // 1. 🔴 REEMPLAZO DEL USEEFFECT: Usamos React Query para traer el curso y los recursos
  const { data: course, isLoading: isCourseLoading } = useCourseById(id || '');
  const { data: allResources = [], isLoading: isResourcesLoading } = useResources();

  // Estados locales (Solo UI y Progreso)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 2. 🔴 Lógica de Progreso Local y Video Inicial
  // Este useEffect solo se encarga de leer el localStorage y setear el video activo
  // No hace llamadas a la API.
  useEffect(() => {
    if (course && course.videos && course.videos.length > 0) {
      const savedData = localStorage.getItem(`itec_course_${id}`);
      let lastVideoId = null;

      if (savedData) {
        const parsed = JSON.parse(savedData);
        setWatchedVideos(new Set(parsed.watched || []));
        lastVideoId = parsed.lastVideo;
      }

      if (lastVideoId) {
        const last = course.videos.find((v: any) => v.id === lastVideoId || v._id === lastVideoId);
        setActiveVideo(last || course.videos[0]);
      } else {
        setActiveVideo(course.videos[0]);
      }
    }
  }, [course, id]); // Depende de que React Query termine de cargar 'course'

  // Filtrado de recursos relacionados
  const relatedResources = useMemo(() => {
    if (!course) return [];
    
    const courseId = course.id || (course as any)._id || "";
    const cleanCourseTitle = course.title.toLowerCase().replace('curso de ', '').trim();

    return allResources.filter((res: any) => {
      const rSubj = res.materia.toLowerCase();
      const isMatch = cleanCourseTitle.includes(rSubj) || rSubj.includes(cleanCourseTitle);
      const isIngreso = courseId.includes('seminario') && res.carrera === 'ingreso';

      return isMatch || isIngreso;
    }); 
  }, [course, allResources]);

  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      const vidId = video.id || (video as any)._id;
      newSet.add(vidId);
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({ watched: Array.from(newSet), lastVideo: vidId }));
      return newSet;
    });
  };

  const toggleWatchedStatus = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) newSet.delete(videoId);
      else newSet.add(videoId);
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({ watched: Array.from(newSet), lastVideo: activeVideo?.id || (activeVideo as any)?._id }));
      return newSet;
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `ITEC UTN BA - ${course?.title}`, url: shareUrl }); } 
      catch (error) { console.error('Error al compartir', error); }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Estados de carga (Controlados por React Query)
  if (isCourseLoading || isResourcesLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
           <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course || !activeVideo) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-itec-surface border border-itec-gray rounded-xl">
          <span className="text-5xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-white mb-2">Curso no encontrado</h2>
          <Link to="/cursos" className="bg-itec-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors inline-block mt-4">Volver a Mis Cursos</Link>
        </div>
      </DashboardLayout>
    );
  }

  const currentProgress = Math.round((watchedVideos.size / (course.videos?.length || 1)) * 100);

  return (
    <DashboardLayout>
    
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/cursos" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium bg-itec-surface px-3 py-1.5 rounded-lg border border-itec-gray">
              <div className="w-4 h-4"><Icons type="arrowLeft" /></div> Volver
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-600 text-sm font-bold truncate">{course.title}</span>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-itec-surface hover:bg-itec-gray border border-itec-gray text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 w-fit"
            >
              <span>✏️</span> Editar Curso
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CourseVideoPlayer 
              course={course}
              activeVideo={activeVideo}
              watchedVideos={watchedVideos}
              relatedResourcesCount={relatedResources.length}
              copySuccess={copySuccess}
              onToggleWatched={toggleWatchedStatus}
              onOpenMaterialModal={() => setIsMaterialModalOpen(true)}
              onShare={handleShare}
            />
          </div>

          <div className="lg:col-span-1">
            <CoursePlaylist 
              course={course}
              activeVideo={activeVideo}
              watchedVideos={watchedVideos}
              currentProgress={currentProgress}
              onVideoSelect={handleVideoSelect}
            />
          </div>
        </div>

      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
        {isMaterialModalOpen && (
          <CourseMaterialModal 
            isOpen={isMaterialModalOpen} 
            onClose={() => setIsMaterialModalOpen(false)} 
            relatedResources={relatedResources} 
          />
        )}
        
      {isAdmin && isEditModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
          <AddCourseModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            existingCourse={course}
            onCourseAdded={(updatedCourse) => {
              // 3. 🔴 Al editar, le decimos a React Query que vuelva a buscar los datos
              queryClient.invalidateQueries({ queryKey: ['course', id] });
              queryClient.invalidateQueries({ queryKey: ['courses'] });
              setIsEditModalOpen(false);
            }}
          />
        </Suspense>
      )}
      </Suspense>

    </DashboardLayout>
  );
};