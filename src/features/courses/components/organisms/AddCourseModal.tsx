import React, { useState, useEffect } from "react";
import { LayoutModal }    from "@/components/templates/LayoutModal";
import { Button }         from "@/components/ui/Button";
import { useToast }       from "@/features/notifications/components/atoms/Toast";
import type { CourseData, Section, Lesson } from "../../types/Course";
import { CourseGeneralData }   from "../molecules/CourseGeneralData";
import { CourseCurriculumEditor } from "./CourseCurriculumEditor";
import { useAddCourse, useUpdateCourse } from "../../hooks/useCourses";

interface Props {
  isOpen:          boolean;
  onClose:         () => void;
  existingCourse?: CourseData | null;
}

export const AddCourseModal: React.FC<Props> = ({ isOpen, onClose, existingCourse }) => {
  const { toast } = useToast();

  const [title,       setTitle]       = useState("");
  const [desc,        setDesc]        = useState("");
  const [image,       setImage]       = useState("");
  const [materia,     setMateria]     = useState("");
  const [categoria,   setCategoria]   = useState("Comunidad");
  const [status,      setStatus]      = useState<"draft"|"approved"|"archived">("approved");
  const [sections,    setSections]    = useState<Section[]>([]);
  const [profesores,  setProfesores]  = useState<string[]>([]);
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
      setStatus((existingCourse.status as any) ?? "approved");
      setProfesores(Array.isArray(existingCourse.profesores) ? [...existingCourse.profesores] : []);
      
      if (existingCourse.sections && existingCourse.sections.length > 0) {
        setSections(existingCourse.sections);
      } else if (existingCourse.videos && existingCourse.videos.length > 0) {
        setSections([{ title: "Contenido General", orderIndex: 0, lessons: existingCourse.videos as any }]);
      } else {
        setSections([{ title: "Módulo 1", orderIndex: 0, lessons: [{ title: "", youtubeId: "", duration: "0:00" }] }]);
      }
    } else {
      setTitle(""); setDesc(""); setImage(""); setMateria("");
      setCategoria("Comunidad"); setStatus("approved"); setProfesores([]);
      setSections([{ title: "Módulo 1", orderIndex: 0, lessons: [{ title: "", youtubeId: "", duration: "0:00" }] }]);
    }
    setError("");
  }, [isOpen, existingCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setError("");
    
    const cleanSections = sections.map((sec, i) => ({
      ...sec,
      orderIndex: i,
      lessons: sec.lessons.filter(l => l.title.trim() && l.youtubeId.trim()).map((l: Lesson, j: number) => ({ ...l, orderIndex: j }))
    })).filter(sec => sec.lessons.length > 0 && sec.title.trim());

    const cleanProfesores = profesores.map((p) => p.trim()).filter(Boolean);

    if (!title || !desc || !materia || !cleanSections.length) {
      setError("Completá título, descripción, materia y al menos un módulo con un video válido."); return;
    }

    const firstValidVideo = cleanSections[0].lessons[0].youtubeId;

    const payload = {
      title, description: desc,
      imageUrl: image || `https://i.ytimg.com/vi/${firstValidVideo}/hqdefault.jpg`,
      materia, categoria, status,
      profesores: cleanProfesores,
      sections: cleanSections
    };

    const editId = existingCourse?.id || existingCourse?._id;
    
    if (editId) {
      updateMutation.mutate(
        { id: editId, courseData: payload },
        { onSuccess: () => { toast.success("Curso actualizado"); onClose(); },
          onError:   () => setError("Error al actualizar el curso.") }
      );
    } else {
      addMutation.mutate(
        { ...payload, progress: 0, playlistId: "" } as any,
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
      description={existingCourse ? "Modificá la información o los módulos." : "Completá los datos y publicá el contenido."}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded-xl">
            {error}
          </div>
        )}
        <div className="p-4 sm:p-6 space-y-8 overflow-y-auto max-h-[65vh] sm:max-h-[75vh]">
          <CourseGeneralData
            title={title} setTitle={setTitle}
            image={image} setImage={setImage}
            desc={desc}   setDesc={setDesc}
            materia={materia} setMateria={setMateria}
            categoria={categoria} setCategoria={setCategoria}
            status={status} setStatus={setStatus}
            profesores={profesores} setProfesores={setProfesores}
          />
          <CourseCurriculumEditor sections={sections} setSections={setSections} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-white/10 shrink-0 bg-itec-box">
          <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose} disabled={isPending} className="flex-1 py-3">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isPending} className="py-3 bg-itec-section-courses hover:bg-itec-section-courses/90">
            {existingCourse ? "Guardar cambios" : "Publicar curso"}
          </Button>
        </div>
      </form>
    </LayoutModal>
  );
};
