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
      setVideos(course.videos?.length ? [...course.videos] : [{ title: "", youtubeId: "", duration: "" }]);
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
    updateMutation.mutate(
      { id: id!, courseData: { title, description: desc, materia, categoria, videos: clean as any } },
      { onSuccess: () => navigate(`/cursos/${id}`), onError: () => setError("Error al guardar.") }
    );
  };

  if (isLoading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-2 border-itec-gray/30 border-t-itec-blue-skye rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  if (isError || !course) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-itec-gray">
        <p className="font-bold text-sm">No se encontró el curso.</p>
        <Link to="/cursos" className="text-xs text-itec-blue-skye hover:underline">Volver</Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-2 pb-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/cursos/${id}`} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-itec-border text-itec-gray hover:text-itec-text transition-all">
            <Icons type="arrowLeft" className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-itec-text">Editar curso</h1>
            <p className="text-xs text-itec-gray line-clamp-1">{course.title}</p>
          </div>
        </div>

        {/* Error */}
        {error && <p className="mb-4 text-itec-red text-xs font-bold bg-itec-red/10 border border-itec-red/30 p-3 rounded-xl">{error}</p>}

        {/* Formulario */}
        <div className="bg-itec-card rounded-2xl p-5 space-y-6">
          <CourseGeneralData title={title} setTitle={setTitle} image={image} setImage={setImage} desc={desc} setDesc={setDesc} materia={materia} setMateria={setMateria} categoria={categoria} setCategoria={setCategoria} />
          <CourseVideoListEditor videos={videos} setVideos={setVideos} mode={mode} setMode={setMode} playlistUrl={playlistUrl} setPlaylistUrl={setPlaylistUrl} onFetchPlaylist={handleFetchPlaylist} isFetching={isFetching} />
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <Button variant="slate" hierarchy="ghost" onClick={() => navigate(`/cursos/${id}`)} className="flex-1">Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={updateMutation.isPending} className="flex-1 bg-itec-blue-skye border-none hover:opacity-90">
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};
