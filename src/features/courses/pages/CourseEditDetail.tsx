import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { Icons } from "@/components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { useCourseById, useUpdateCourse } from "@features/courses/hooks/useCourses";
import { coursesService } from "@features/courses/services/coursesService";
import { CourseGeneralData } from "@features/courses/components/molecules/CourseGeneralData";
import { CourseVideoListEditor, type VideoItem } from "@features/courses/components/organisms/CourseVideoListEditor";

export const CourseEditDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading, isError } = useCourseById(id ?? "");
  const updateMutation = useUpdateCourse();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [materia, setMateria] = useState("");
  const [categoria, setCategoria] = useState("Comunidad");
  const [status, setStatus] = useState<"draft"|"approved"|"archived">("approved");
  const [profesores, setProfesores] = useState<string[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([{ title: "", youtubeId: "", duration: "" }]);
  const [mode, setMode] = useState<"manual" | "youtube">("manual");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (course) {
      setTitle(course.title ?? "");
      setDesc(course.description ?? "");
      setImage((course as any).image || (course as any).thumbnail || course.imageUrl || "");
      setMateria(course.materia ?? "");
      setCategoria(course.categoria ?? "Comunidad");
      setStatus((course.status as any) ?? "approved");
      setProfesores(Array.isArray((course as any).profesores) ? [...(course as any).profesores] : []);
      setVideos(course.videos?.length ? [...course.videos] as any : [{ title: "", youtubeId: "", duration: "" }]);
    }
  }, [course]);

  const handleFetchPlaylist = async () => {
    if (!playlistUrl.trim()) return;
    setIsFetching(true); setError("");
    try {
      const data = await coursesService.fetchPlaylistDetails(playlistUrl);
      if (data?.videos?.length) setVideos(data.videos as any);
      else setError("Playlist vacía o privada.");
    } catch (e: any) { setError(e.message ?? "Error al importar."); }
    finally { setIsFetching(false); }
  };

  const handleSave = () => {
    setError("");
    const clean = videos.filter((v) => v.title.trim() && v.youtubeId.trim());
    if (!title.trim() || !desc.trim() || !clean.length) {
      setError("Completá título, descripción y al menos un video."); return;
    }
    const cleanProfesores = profesores.map((p) => p.trim()).filter(Boolean);
    updateMutation.mutate(
      {
        id: id!,
        // FIX: antes no se enviaba `imageUrl`, por lo que los cambios de
        // portada en esta pantalla legacy nunca se guardaban. Se agrega
        // también `profesores` (ahora soporta más de un docente).
        courseData: {
          title, description: desc, imageUrl: image, materia, categoria, status,
          profesores: cleanProfesores, videos: clean as any,
        },
      },
      { onSuccess: () => navigate(`/cursos/${id}`), onError: () => setError("Error al guardar.") }
    );
  };

  if (isLoading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-2 border-itec-gray/30 border-t-itec-section-courses rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  if (isError || !course) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-itec-gray">
        <p className="font-bold text-sm">No se encontró el curso.</p>
        <Link to="/cursos" className="text-xs text-itec-section-courses hover:underline">Volver</Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 w-full pb-12">
        <div className="flex items-center gap-3 mb-6 mt-4">
          <Link to={`/cursos/${id}`} className="w-9 h-9 flex items-center justify-center rounded-xl bg-itec-box border border-itec-border text-itec-gray hover:text-itec-text hover:border-white/20 transition-all shrink-0">
            <Icons type="arrowLeft" className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-itec-text tracking-tight">Editar curso legacy</h1>
            <p className="text-xs text-itec-gray line-clamp-1">{course.title}</p>
          </div>
        </div>

        {error && <p className="mb-4 text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/30 p-3 rounded-xl">{error}</p>}

        <div className="bg-itec-box border border-itec-border rounded-[2rem] p-4 sm:p-6 md:p-8 space-y-8">
          <CourseGeneralData
            title={title} setTitle={setTitle}
            image={image} setImage={setImage}
            desc={desc} setDesc={setDesc}
            materia={materia} setMateria={setMateria}
            categoria={categoria} setCategoria={setCategoria}
            status={status} setStatus={setStatus}
            profesores={profesores} setProfesores={setProfesores}
          />
          <CourseVideoListEditor videos={videos} setVideos={setVideos} mode={mode} setMode={setMode} playlistUrl={playlistUrl} setPlaylistUrl={setPlaylistUrl} onFetchPlaylist={handleFetchPlaylist} isFetching={isFetching} />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <Button variant="slate" hierarchy="ghost" onClick={() => navigate(`/cursos/${id}`)} className="py-3 px-8">Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={updateMutation.isPending} className="py-3 px-8 bg-itec-section-courses border-none hover:bg-itec-section-courses/90">
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};
