// src/features/courses/components/organisms/AddCourseModal.tsx
// Modal para crear/editar cursos. Solo para admins.
// Usa LayoutModal global, iconos lucide-react y notificaciones Toast.
import React, { useState, useEffect } from "react";
import { LayoutModal }    from "@/components/templates/LayoutModal";
import { Button }         from "@/components/ui/Button";
import { useToast }       from "@/features/notifications/components/atoms/Toast";
import { coursesService, type CourseData } from "../../services/coursesService";
import { CourseGeneralData }   from "../molecules/CourseGeneralData";
import { CourseVideoListEditor, type VideoItem } from "./CourseVideoListEditor";
import { useAddCourse, useUpdateCourse } from "../../hooks/useCourses";

interface Props {
  isOpen:          boolean;
  onClose:         () => void;
  existingCourse?: CourseData | null;
}

const BLANK_VIDEO: VideoItem = { title: "", youtubeId: "", duration: "" };

const toVideoItems = (videos: CourseData["videos"]): VideoItem[] =>
  videos?.map((v) => ({ title: v.title, youtubeId: v.youtubeId, duration: v.duration ?? "0:00" })) ?? [BLANK_VIDEO];

export const AddCourseModal: React.FC<Props> = ({ isOpen, onClose, existingCourse }) => {
  const { toast } = useToast();

  const [title,       setTitle]       = useState("");
  const [desc,        setDesc]        = useState("");
  const [image,       setImage]       = useState("");
  const [materia,     setMateria]     = useState("");
  const [categoria,   setCategoria]   = useState("Comunidad");
  const [videos,      setVideos]      = useState<VideoItem[]>([BLANK_VIDEO]);
  const [mode,        setMode]        = useState<"manual" | "youtube">("manual");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isFetching,  setIsFetching]  = useState(false);
  const [error,       setError]       = useState("");

  const addMutation    = useAddCourse();
  const updateMutation = useUpdateCourse();
  const isPending      = addMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!isOpen) return;
    if (existingCourse) {
      setTitle(existingCourse.title ?? "");
      setDesc(existingCourse.description ?? "");
      setImage(existingCourse.imageUrl ?? "");
      setMateria(existingCourse.materia ?? "");
      setCategoria(existingCourse.categoria ?? "Comunidad");
      setVideos(toVideoItems(existingCourse.videos));
    } else {
      setTitle(""); setDesc(""); setImage(""); setMateria("");
      setCategoria("Comunidad"); setVideos([BLANK_VIDEO]);
      setPlaylistUrl(""); setMode("manual");
    }
    setError("");
  }, [isOpen, existingCourse]);

  const handleFetchPlaylist = async () => {
    if (!playlistUrl) return;
    setIsFetching(true); setError("");
    try {
      const data = await coursesService.fetchPlaylistDetails(playlistUrl);
      if (!title && data.title) setTitle(data.title);
      const vids = (data.videos ?? []).map((v: any) => ({
        title: v.title ?? "", youtubeId: v.youtubeId ?? v.id ?? "", duration: v.duration ?? "0:00",
      }));
      if (vids.length) {
        setVideos(vids);
        if (!image) setImage(`https://i.ytimg.com/vi/${vids[0].youtubeId}/hqdefault.jpg`);
      } else {
        setError("La playlist fue leída pero está vacía.");
      }
    } catch (e: any) {
      setError(e.message ?? "Error al conectar con YouTube.");
    } finally {
      setIsFetching(false);
    }
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
    const editId = existingCourse?.id ?? (existingCourse as any)?._id;
    if (editId) {
      updateMutation.mutate(
        { id: editId, courseData: payload },
        { onSuccess: () => { toast.success("Curso actualizado"); onClose(); },
          onError:   () => setError("Error al actualizar el curso.") }
      );
    } else {
      addMutation.mutate(
        { ...payload, progress: 0, playlistId: mode === "youtube" ? playlistUrl : `custom_${Date.now()}` } as any,
        { onSuccess: () => { toast.success("Curso publicado"); onClose(); },
          onError:   () => setError("Error al publicar el curso.") }
      );
    }
  };

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={existingCourse ? "Editar curso" : "Nuevo curso"}
      description={existingCourse ? "Modificá la información o los videos." : "Completá los datos y publicá el contenido."}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <div className="mx-5 mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded-xl">
            {error}
          </div>
        )}
        <div className="p-5 space-y-6 overflow-y-auto max-h-[60vh]">
          <CourseGeneralData
            title={title} setTitle={setTitle}
            image={image} setImage={setImage}
            desc={desc}   setDesc={setDesc}
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
        <div className="flex gap-3 p-5 border-t border-white/8 shrink-0">
          <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose} disabled={isPending} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isPending}>
            {existingCourse ? "Guardar cambios" : "Publicar curso"}
          </Button>
        </div>
      </form>
    </LayoutModal>
  );
};
