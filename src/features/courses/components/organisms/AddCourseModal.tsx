import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { coursesService, type CourseData } from "../../services/coursesService";
import { CourseGeneralData } from "../molecules/CourseGeneralData";
import { CourseVideoListEditor, type VideoItem } from "./CourseVideoListEditor";
import { useAddCourse, useUpdateCourse } from "../../hooks/useCourses";

interface Props { isOpen: boolean; onClose: () => void; existingCourse?: CourseData | null; }

export const AddCourseModal: React.FC<Props> = ({ isOpen, onClose, existingCourse }) => {
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

  const addMutation = useAddCourse();
  const updateMutation = useUpdateCourse();
  const isPending = addMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (existingCourse) {
      setTitle(existingCourse.title ?? "");
      setDesc(existingCourse.description ?? "");
      setImage(existingCourse.imageUrl ?? "");
      setMateria(existingCourse.materia ?? "");
      setCategoria(existingCourse.categoria ?? "Comunidad");
      if (existingCourse.videos?.length) setVideos(existingCourse.videos.map((v) => ({ title: v.title, youtubeId: v.youtubeId, duration: v.duration ?? "0:00" })));
    }
  }, [existingCourse]);

  const handleFetchPlaylist = async () => {
    if (!playlistUrl) return;
    setIsFetching(true); setError("");
    try {
      const data = await coursesService.fetchPlaylistDetails(playlistUrl);
      if (!title && data.title) setTitle(data.title);
      const vids = (data.videos ?? []).map((v: any) => ({ title: v.title ?? "", youtubeId: v.youtubeId ?? v.id ?? "", duration: v.duration ?? "0:00" }));
      if (vids.length) { setVideos(vids); if (!image) setImage(`https://i.ytimg.com/vi/${vids[0].youtubeId}/hqdefault.jpg`); }
      else setError("La playlist fue leída pero está vacía.");
    } catch (e: any) { setError(e.message ?? "Error al conectar con YouTube."); }
    finally { setIsFetching(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setError("");
    const cleanVids = videos.filter((v) => v.title.trim() && v.youtubeId.trim());
    if (!title || !desc || !materia || !cleanVids.length) {
      setError("Completá título, descripción, materia y al menos un video válido."); return;
    }
    const payload = {
      title, description: desc,
      imageUrl: image || `https://i.ytimg.com/vi/${cleanVids[0].youtubeId}/hqdefault.jpg`,
      materia, categoria,
      videos: cleanVids.map((v, i) => ({ id: `v_${Date.now()}_${i}`, ...v, duration: v.duration || "0:00" })),
    };
    const editId = existingCourse?.id || (existingCourse as any)?._id;
    if (editId) {
      updateMutation.mutate({ id: editId, courseData: payload }, { onSuccess: onClose, onError: () => setError("Error al actualizar el curso.") });
    } else {
      addMutation.mutate({ ...payload, progress: 0, playlistId: mode === "youtube" ? playlistUrl : `custom_${Date.now()}` } as any, { onSuccess: onClose, onError: () => setError("Error al publicar el curso.") });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/75 p-0 sm:p-4">
      <div className="bg-itec-bg border border-itec-border rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8 shrink-0">
          <div>
            <h2 className="text-base font-black text-itec-text">{existingCourse ? "Editar curso" : "Nuevo curso"}</h2>
            <p className="text-xs text-itec-gray">{existingCourse ? "Modificá la información o los videos." : "Completá los datos y publicá el contenido."}</p>
          </div>
          <button onClick={onClose} disabled={isPending} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-itec-gray hover:text-itec-text hover:bg-white/10 transition-all">
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>
        {/* Error */}
        {error && (
          <div className="mx-5 mt-3 bg-itec-red/10 border border-itec-red/30 text-itec-red text-xs font-bold p-3 rounded-xl shrink-0">
            {error}
          </div>
        )}
        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <CourseGeneralData title={title} setTitle={setTitle} image={image} setImage={setImage} desc={desc} setDesc={setDesc} materia={materia} setMateria={setMateria} categoria={categoria} setCategoria={setCategoria} />
            <CourseVideoListEditor videos={videos} setVideos={setVideos} mode={mode} setMode={setMode} playlistUrl={playlistUrl} setPlaylistUrl={setPlaylistUrl} onFetchPlaylist={handleFetchPlaylist} isFetching={isFetching} />
          </div>
          {/* Footer */}
          <div className="flex gap-3 p-5 border-t border-white/8 shrink-0">
            <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose} disabled={isPending} className="flex-1">Cancelar</Button>
            <Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isPending}>{existingCourse ? "Guardar cambios" : "Publicar curso"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
