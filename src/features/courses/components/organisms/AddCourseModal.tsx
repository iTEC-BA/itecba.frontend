import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icons } from '@/components/atoms/Icons';
import { coursesService, type CourseData } from '../../services/coursesService';
import { CourseGeneralData } from '../molecules/CourseGeneralData';
import { CourseVideoListEditor, type VideoItem } from './CourseVideoListEditor';
import { useAddCourse, useUpdateCourse } from '../../hooks/useCourses';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existingCourse?: CourseData | null; 
}

export const AddCourseModal: React.FC<Props> = ({ isOpen, onClose, existingCourse }) => {
  // Estados Generales
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [materia, setMateria] = useState('');
  const [categoria, setCategoria] = useState('Comunidad');
  
  // Estados de Videos
  const [videos, setVideos] = useState<VideoItem[]>([{ title: '', youtubeId: '', duration: '' }]);
  const [mode, setMode] = useState<'manual' | 'youtube'>('manual');
  const [playlistUrl, setPlaylistUrl] = useState('');
  
  // Estados de Control
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  
  // Inicializamos las mutaciones
  const addCourseMutation = useAddCourse();
  const updateCourseMutation = useUpdateCourse();

  // Estado de carga unificado que nos da React Query gratis
  const isPending = addCourseMutation.isPending || updateCourseMutation.isPending;

  // Pre-cargar datos si estamos en Modo Edición
  useEffect(() => {
    if (existingCourse) {
      setCourseTitle(existingCourse.title || '');
      setCourseDesc(existingCourse.description || '');
      setImageUrl(existingCourse.imageUrl || '');
      setMateria(existingCourse.materia || '');
      setCategoria(existingCourse.categoria || 'Comunidad');
      if (existingCourse.videos && existingCourse.videos.length > 0) {
        setVideos(existingCourse.videos.map(v => ({
          title: v.title,
          youtubeId: v.youtubeId,
          duration: v.duration || '0:00'
        })));
      }
    }
  }, [existingCourse]);

  // (handleFetchPlaylist queda exactamente igual, porque es solo una consulta útil, no altera la base de datos)
  const handleFetchPlaylist = async () => {
    if (!playlistUrl) return;
    setIsFetching(true);
    setError('');
    try {
      const data = await coursesService.fetchPlaylistDetails(playlistUrl);
      if (!courseTitle && data.title) setCourseTitle(data.title);
      const extractedVideos = data.videos?.map((v: any) => ({
        title: v.title || '',
        youtubeId: v.youtubeId || v.id || '',
        duration: v.duration || '0:00'
      })) || [];

      if (extractedVideos.length > 0) {
        setVideos(extractedVideos);
        if (!imageUrl) setImageUrl(`https://i.ytimg.com/vi/${extractedVideos[0].youtubeId}/hqdefault.jpg`);
      } else {
        setError('La playlist fue leída, pero no tiene videos.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con YouTube. Verifica el link.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (isPending) return; // Evitamos doble click usando el isPending de React Query
    setError('');

    const cleanVideos = videos.filter(v => v.title.trim() && v.youtubeId.trim());

    if (!courseTitle || !courseDesc || cleanVideos.length === 0) {
      setError('Completa el título, la descripción y asegúrate de tener al menos un video válido.');
      return;
    }
    if (!materia) {
      setError('Por favor, selecciona o escribe la materia a la que pertenece el curso.');
      return;
    }

    const finalImageUrl = imageUrl || `https://i.ytimg.com/vi/${cleanVideos[0].youtubeId}/hqdefault.jpg`;

    const coursePayload = {
      title: courseTitle,
      description: courseDesc,
      imageUrl: finalImageUrl,
      materia: materia,
      categoria: categoria,
      videos: cleanVideos.map((v, idx) => ({
        id: `v_${Date.now()}_${idx}`,
        youtubeId: v.youtubeId,
        title: v.title,
        duration: v.duration || '0:00'
      }))
    };

    //Lógica limpia usando .mutate()
    if (existingCourse && (existingCourse.id || (existingCourse as any)._id)) {
      const idToUpdate = existingCourse.id || (existingCourse as any)._id;
      
      updateCourseMutation.mutate(
        { id: idToUpdate as string, courseData: coursePayload },
        {
          onSuccess: () => onClose(), // Si todo va bien, cerramos el modal. La tabla de fondo se refresca sola.
          onError: () => setError('Error al actualizar el curso en la base de datos.')
        }
      );
    } else {
      addCourseMutation.mutate(
        { ...coursePayload, progress: 0, playlistId: mode === 'youtube' ? playlistUrl : `custom_${Date.now()}` } as any,
        {
          onSuccess: () => onClose(),
          onError: () => setError('Error al subir el curso en la base de datos.')
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-itec-bg border border-itec-gray rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden">

        <button onClick={onClose} disabled={isPending} className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-itec-surface border border-itec-gray text-gray-500 hover:text-white transition-colors disabled:opacity-50">
          <Icons type="close" className="w-4 h-4" />
        </button>

        <div className="p-8 pb-4 shrink-0">
          <h2 className="text-2xl font-bold text-white mb-1">
            {existingCourse ? 'Editar Curso' : 'Creador de Cursos'}
          </h2>
          <p className="text-sm text-gray-400">
            {existingCourse ? 'Modifica la información o reordena los videos.' : 'Agrega o importa contenido para los estudiantes.'}
          </p>
        </div>

        {error && (
          <div className="px-8 pt-2 shrink-0">
            <p className="text-itec-red-skye text-xs font-bold bg-itec-red/10 p-3 rounded-lg border border-itec-red/20">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            
            <CourseGeneralData 
              title={courseTitle} setTitle={setCourseTitle} 
              image={imageUrl} setImage={setImageUrl} 
              desc={courseDesc} setDesc={setCourseDesc}
              materia={materia} setMateria={setMateria}
              categoria={categoria} setCategoria={setCategoria}
            />
            
            <CourseVideoListEditor 
              videos={videos} setVideos={setVideos}
              mode={mode} setMode={setMode}
              playlistUrl={playlistUrl} setPlaylistUrl={setPlaylistUrl}
              onFetchPlaylist={handleFetchPlaylist} isFetching={isFetching}
            />

          </div>

          <div className="p-6 border-t border-itec-gray bg-itec-surface flex justify-end gap-3 shrink-0">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending} className="bg-itec-bg border-itec-gray text-gray-400 hover:text-white">
              Cancelar
            </Button>
            {/* Usamos isPending en el botón */}
            <Button type="submit" variant="primary" disabled={isPending || videos.length === 0} className="bg-white text-black hover:bg-gray-200 border-none">
              {isPending ? 'Guardando...' : (existingCourse ? 'Guardar Cambios' : 'Publicar Curso')}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};