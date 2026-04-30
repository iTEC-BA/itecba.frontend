import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import { Icons } from '@components/ui/Icons';
import { Button } from '@components/atoms/Button';

// Hooks de React Query
import { useCourseById, useUpdateCourse } from '@features/courses/hooks/useCourses';
import { coursesService } from '@features/courses/services/coursesService';

// Componentes Reutilizables de la feature Courses
import { CourseGeneralData } from '@features/courses/components/molecules/CourseGeneralData';
import { CourseVideoListEditor, type VideoItem } from '@features/courses/components/organisms/CourseVideoListEditor';

export const CourseEditDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Extraemos la data cacheada
  const { data: course, isLoading, isError } = useCourseById(id || '');
  const updateCourseMutation = useUpdateCourse();

  // Estados locales para los inputs
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [materia, setMateria] = useState('');
  const [categoria, setCategoria] = useState('Comunidad');
  
  // Estado para la lista de videos
  const [videos, setVideos] = useState<VideoItem[]>([{ title: '', youtubeId: '', duration: '' }]);
  const [mode, setMode] = useState<'manual' | 'youtube'>('manual');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isFetchingPlaylist, setIsFetchingPlaylist] = useState(false);
  const [error, setError] = useState('');

  // Llenar el formulario cuando React Query trae el curso
  useEffect(() => {
    if (course) {
      setCourseTitle(course.title || '');
      setCourseDesc(course.description || '');
      setImageUrl(course.image || '');
      setMateria(course.materia || '');
      setCategoria(course.categoria || 'Comunidad');
      setVideos(course.videos?.length ? [...course.videos] : [{ title: '', youtubeId: '', duration: '' }]);
    }
  }, [course]);

  // Manejo de la Playlist de YouTube
  const handleFetchPlaylist = async () => {
    if (!playlistUrl.trim()) return;
    setIsFetchingPlaylist(true);
    setError('');
    try {
      const fetchedVideos = await coursesService.fetchYoutubePlaylist(playlistUrl);
      if (fetchedVideos && fetchedVideos.length > 0) {
        setVideos(fetchedVideos);
      } else {
        setError('La playlist está vacía o es privada.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al importar los videos de YouTube.');
    } finally {
      setIsFetchingPlaylist(false);
    }
  };

  // Validación y Envío Seguro
  const handleSave = () => {
    setError('');
    const cleanVideos = videos.filter(v => v.title.trim() && v.youtubeId.trim());
    
    if (!courseTitle.trim() || !courseDesc.trim() || cleanVideos.length === 0) {
      setError('Por favor, completa el título, la descripción y añade al menos un video válido.');
      return;
    }

    updateCourseMutation.mutate({
      id: id!,
      courseData: {
        title: courseTitle,
        description: courseDesc,
        image: imageUrl,
        materia,
        categoria,
        videos: cleanVideos
      }
    }, {
      onSuccess: () => {
        // Redirige al detalle del curso cuando termina de guardar
        navigate(`/cursos/${id}`);
      },
      onError: (err) => setError('Fallo al actualizar el curso en la base de datos.')
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="w-10 h-10 border-4 border-itec-gray border-t-itecBlue rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !course) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error al cargar el curso</h2>
          <button onClick={() => navigate('/cursos')} className="text-sm text-itec-text underline hover:text-white">Volver al catálogo</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1000px] mx-auto pb-24 pt-6 px-4 xl:px-0 animate-fade-in">
         
         {/* HEADER Y NAVEGACIÓN */}
         <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-itec-text hover:text-itec-texttransition-colors mb-4 text-[10px] font-bold tracking-widest uppercase outline-none"
             >
               <div className="w-3 h-3"><Icons type="chevron-left" /></div>
               Cancelar y Volver
             </button>
             <h1 className="text-3xl md:text-4xl font-black text-itec-textflex items-center gap-3 tracking-tight">
               <span className="text-itecBlue">✏️</span> Configurar Curso
             </h1>
             <p className="text-itec-text text-sm mt-1 font-medium">Modifica los detalles académicos y el plan de estudios.</p>
           </div>
           
           <Button 
              onClick={handleSave} 
              disabled={updateCourseMutation.isPending} 
              className="bg-itec-red hover:bg-itec-red-skye px-8 py-3.5 rounded-xl font-black shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all outline-none"
           >
             {updateCourseMutation.isPending ? 'GUARDANDO...' : 'Guardar Cambios'}
           </Button>
         </div>

         {/* Alertas */}
         {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
              <Icons type="close" /> {error}
            </div>
         )}

         {/* CONTENEDOR GLASSMORPHISM PREMIUM */}
         <div className="bg-itec-box/40 border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Efecto de Luz de fondo */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-itecBlue/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-itecBlue/20 transition-colors duration-700"></div>
            
            <div className="relative z-10 space-y-10">
              
              {/* SECCIÓN 1: Datos Generales */}
              <CourseGeneralData 
                title={courseTitle} setTitle={setCourseTitle}
                image={imageUrl} setImage={setImageUrl}
                desc={courseDesc} setDesc={setCourseDesc}
                materia={materia} setMateria={setMateria}
                categoria={categoria} setCategoria={setCategoria}
              />

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              {/* SECCIÓN 2: Videos del Curso */}
              <div className="pt-2">
                <CourseVideoListEditor 
                  videos={videos} setVideos={setVideos}
                  mode={mode} setMode={setMode}
                  playlistUrl={playlistUrl} setPlaylistUrl={setPlaylistUrl}
                  handleFetchPlaylist={handleFetchPlaylist} isFetching={isFetchingPlaylist}
                />
              </div>

            </div>
         </div>
      </div>
    </MainLayout>
  );
};