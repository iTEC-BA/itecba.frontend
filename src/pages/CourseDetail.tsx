import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Componentes Globales
import { DashboardLayout } from '@components/templates/DashboardLayout';
import { Icons } from '@components/ui/Icons'; 
import { useAuth } from '@context/AuthContext';

// Componentes de courses
import { CourseVideoPlayer } from '@features/courses/components/organisms/CourseVideoPlayer';
import { CoursePlaylist } from '@features/courses/components/organisms/CoursePlaylist';

// Hooks
import { useCourseById, useDeleteCourse } from '@features/courses/hooks/useCourses';
import { useResources } from '@features/resources/hooks/useResources'; 

// Lazy, carga retrasada
const CourseResourcesModal = React.lazy(() => import('@features/courses/components/organisms/CourseResourcesModal').then(m => ({ default: m.CourseResourcesModal })));
const CourseAddResourceModal = React.lazy(() => import('@features/courses/components/organisms/CourseAddResourceModal').then(m => ({ default: m.CourseAddResourceModal })));

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const { data: course, isLoading: isCourseLoading } = useCourseById(id || '');
  const { data: allResources = [] } = useResources();
  const deleteCourseMutation = useDeleteCourse();

  // Estados Separados para Visualización y Creación
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (course && user) {
      try {
        const key = `itec_course_progress_${user.uid}_${course.id || (course as any)._id}`;
        const stored = localStorage.getItem(key);
        if (stored) setWatchedVideos(new Set(JSON.parse(stored)));
      } catch (e) { console.error("Error cargando progreso:", e); }
    }
  }, [course, user]);

  const handleToggleWatched = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!course || !user) return;
    
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) newSet.delete(videoId);
      else newSet.add(videoId);
      
      try {
        const key = `itec_course_progress_${user.uid}_${course.id || (course as any)._id}`;
        localStorage.setItem(key, JSON.stringify(Array.from(newSet)));
      } catch (err) { console.error("Error guardando progreso:", err); }
      
      return newSet;
    });
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const relatedResources = useMemo(() => {
    if (!course || !allResources.length) return [];
    const cleanCourseTitle = course.title.toLowerCase().replace('curso de ', '').trim();
    return allResources.filter((r: any) => r.materia === course.materia || r.title.toLowerCase().includes(cleanCourseTitle));
  }, [course, allResources]);

  const handleDelete = () => {
    if (window.confirm("🔴 ¿Estás seguro de que quieres eliminar este curso permanentemente?")) {
      deleteCourseMutation.mutate(course?.id || (course as any)?._id || '', {
        onSuccess: () => navigate('/cursos')
      });
    }
  };

  if (isCourseLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-5">
          <div className="w-10 h-10 border-4 border-white/10 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase animate-pulse">Preparando entorno...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
           <div className="bg-itec-surface/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2rem] text-center max-w-md shadow-2xl">
             <span className="text-5xl block mb-6 opacity-80">🔍</span>
             <h2 className="text-xl font-bold text-white mb-2">Curso no encontrado</h2>
             <p className="text-sm text-gray-400 mb-8 leading-relaxed">El material que intentas visualizar no existe o ha sido retirado de la plataforma.</p>
             <Link to="/cursos" className="bg-white text-black font-bold px-8 py-3.5 rounded-xl transition-transform hover:scale-[0.98] outline-none inline-block text-xs uppercase tracking-widest shadow-lg">
               Volver al Catálogo
             </Link>
           </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentVideo = (course.videos && course.videos.length > 0) ? course.videos[currentVideoIndex] : undefined;

  return (
    <DashboardLayout>
      <div className="max-w-[1300px] mx-auto pb-24 pt-6 px-4 lg:px-6 xl:px-0 animate-fade-in">
        
        {/* Controles Superiores */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Link to="/cursos" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors w-fit group outline-none">
            <div className="w-5 h-5 group-hover:-translate-x-1 transition-transform"><Icons type="play" /></div>
            Catálogo Principal
          </Link>
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link 
                to={`/cursos/editar/${course.id || (course as any)._id}`}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all outline-none"
              >
                Editar
              </Link>
              <button 
                onClick={handleDelete}
                disabled={deleteCourseMutation.isPending}
                className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all outline-none border border-red-500/20 hover:border-red-500 cursor-pointer"
              >
                {deleteCourseMutation.isPending ? 'BORRANDO...' : 'ELIMINAR'}
              </button>
            </div>
          )}
        </div>

        {/* Título Principal */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-sm">
              {course.materia}
            </span>
            <span className="bg-white/5 text-gray-400 border border-white/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
              {course.categoria}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 leading-tight">{course.title}</h1>
        </div>

        {/* Layout Principal: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Columna Izquierda (Video Player) */}
          <div className="lg:col-span-2 w-full">
            <CourseVideoPlayer 
              course={course}
              activeVideo={currentVideo} 
              watchedVideos={watchedVideos}
              relatedResourcesCount={relatedResources.length}
              copySuccess={copySuccess}
              onToggleWatched={handleToggleWatched}
              onOpenMaterialModal={() => setIsViewModalOpen(true)} // 🟢 ABRE MODAL DE VISUALIZACIÓN
              onShare={handleShare}
            />
          </div>

          {/* Columna Derecha (Sidebar: Playlist y Recursos) */}
          <div className="lg:col-span-1 flex flex-col gap-8 w-full">
            <CoursePlaylist 
              videos={course.videos} 
              currentIndex={currentVideoIndex} 
              onSelectVideo={setCurrentVideoIndex}
              watchedVideos={watchedVideos} 
            />

            {/* Widget de Material Extra */}
            <div className="bg-itec-surface/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-sm tracking-wide">
                  <span className="text-orange-500 mr-2 text-lg">📚</span> Material Extra
                </h3>
                {isAdmin && (
                  <button 
                    onClick={() => setIsAddModalOpen(true)} // 🟢 ABRE MODAL DE CREACIÓN
                    className="text-[9px] bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors font-bold uppercase tracking-widest outline-none"
                  >
                    + Vincular PDF
                  </button>
                )}
              </div>
              
              {relatedResources.length === 0 ? (
                <div className="border border-dashed border-white/5 rounded-2xl p-6 text-center opacity-60">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">No hay archivos vinculados</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {relatedResources.slice(0, 4).map((res: any) => (
                    <a key={res.id} href={res.driveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-2xl transition-all group outline-none shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                        📄
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">{res.title}</h4>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{res.materia}</p>
                      </div>
                      <div className="text-gray-600 group-hover:text-white transition-colors w-4 h-4 shrink-0">
                        <Icons type="external-link" />
                      </div>
                    </a>
                  ))}
                  {relatedResources.length > 4 && (
                    <Link to="/recursos" className="text-[10px] text-center text-gray-400 hover:text-white mt-4 font-bold uppercase tracking-widest block transition-colors outline-none bg-white/5 hover:bg-white/10 py-3 rounded-xl border border-white/5">
                      Ver todo el catálogo
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 RENDERIZADO CONDICIONAL DE MODALES (Aislados y Optimizados) */}
      {isViewModalOpen && (
        <Suspense fallback={null}>
          <CourseResourcesModal 
            isOpen={isViewModalOpen} 
            onClose={() => setIsViewModalOpen(false)} 
            resources={relatedResources}
          />
        </Suspense>
      )}

      {isAddModalOpen && (
        <Suspense fallback={null}>
          <CourseAddResourceModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            courseTitle={course.title}
            materia={course.materia}
          />
        </Suspense>
      )}

    </DashboardLayout>
  );
};