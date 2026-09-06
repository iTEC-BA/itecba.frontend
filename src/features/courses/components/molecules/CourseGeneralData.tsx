import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { MarkdownTextarea } from "@/components/ui/MarkdownTextarea";
import { UploadCloud, Users, X, Plus, ImageOff } from "lucide-react";
import { useToast } from "@features/notifications/components/atoms/Toast";
import { coursesService } from "../../services/coursesService";

const MATERIAS = [
  "Análisis Matemático", "Álgebra y Geometría Analítica",
  "Sistemas y Procesos de Negocio", "Paradigmas de Programación",
  "Arquitectura de Computadoras", "Física", "Química", "Inglés Técnico"
];

const LABEL_CLS = "block text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-1.5";

interface Props {
  title: string; setTitle: (v: string) => void;
  image: string; setImage: (v: string) => void;
  desc: string;  setDesc: (v: string) => void;
  materia: string; setMateria: (v: string) => void;
  categoria: string; setCategoria: (v: string) => void;
  status: string; setStatus: (v: any) => void;
  /** Uno o más profesores/docentes a cargo del curso. */
  profesores: string[]; setProfesores: (v: string[]) => void;
}

export const CourseGeneralData: React.FC<Props> = ({
  title, setTitle, image, setImage, desc, setDesc, materia, setMateria, categoria, setCategoria, status, setStatus,
  profesores, setProfesores,
}) => {
  const [isCustomMateria, setIsCustomMateria] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const [profesorInput, setProfesorInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (materia && !MATERIAS.includes(materia)) setIsCustomMateria(true);
  }, [materia]);

  useEffect(() => {
    setImgBroken(false);
  }, [image]);

  const materiaOptions = [
    ...MATERIAS.map(m => ({ value: m, label: m })),
    { value: "otra", label: "Otra materia..." }
  ];

  const handleMateriaChange = (val: string) => {
    if (val === "otra") { setIsCustomMateria(true); setMateria(""); } 
    else { setIsCustomMateria(false); setMateria(val); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await coursesService.uploadCover(file);
      setImage(url);
      toast.success("Portada subida correctamente");
    } catch (err) {
      toast.error("Error al subir la imagen");
    } finally {
      setIsUploading(false);
      // Permite volver a subir el mismo archivo si el usuario lo desea.
      e.target.value = "";
    }
  };

  const addProfesor = () => {
    const clean = profesorInput.trim();
    if (!clean) return;
    if (profesores.some((p) => p.toLowerCase() === clean.toLowerCase())) {
      setProfesorInput("");
      return;
    }
    setProfesores([...profesores, clean]);
    setProfesorInput("");
  };

  const removeProfesor = (idx: number) => {
    setProfesores(profesores.filter((_, i) => i !== idx));
  };

  const handleProfesorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addProfesor();
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-xs font-bold text-itec-section-courses uppercase tracking-widest border-b border-white/10 pb-2">
        Datos de Publicación
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label className={LABEL_CLS}>Título del curso</label>
          <Input fullWidth placeholder="Ej: Clase de Paradigmas..." value={title} onChange={(e) => setTitle(e.target.value)} className="bg-itec-box border-itec-border focus:border-itec-section-courses/60 py-2.5 rounded-xl" />
        </div>

        <div className="flex flex-col">
          <label className={LABEL_CLS}>Portada (Enlace o Subida)</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1 min-w-0">
              <Input fullWidth placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} className="bg-itec-box border-itec-border focus:border-itec-section-courses/60 py-2.5 rounded-xl flex-1 min-w-0" />
              <div className="relative shrink-0 flex items-center justify-center">
                <input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <Button type="button" variant="primary" hierarchy="outline" isLoading={isUploading} className="h-full px-3 py-0">
                  <UploadCloud className="w-4 h-4 text-itec-section-courses" />
                </Button>
              </div>
            </div>
            {image && (
              <div className="shrink-0 w-full sm:w-14 h-14 rounded-xl overflow-hidden border border-itec-border bg-itec-box flex items-center justify-center">
                {imgBroken ? (
                  <ImageOff className="w-4 h-4 text-itec-gray" />
                ) : (
                  <img src={image} alt="Vista previa de portada" className="w-full h-full object-cover" onError={() => setImgBroken(true)} />
                )}
              </div>
            )}
          </div>
          <p className="text-[10px] text-itec-gray/70 mt-1.5">Se sube automáticamente a Cloudinary (carpeta <span className="text-itec-section-courses font-bold">portadas_courses</span>) o pegá un link directo.</p>
        </div>

        <div className="flex flex-col relative z-30">
          <label className={LABEL_CLS}>Materia</label>
          {isCustomMateria ? (
            <div className="flex gap-2">
              <Input fullWidth placeholder="Escribí la materia..." value={materia} onChange={(e) => setMateria(e.target.value)} className="bg-itec-box border-itec-section-courses/50 py-2.5 rounded-xl flex-1" />
              <button type="button" onClick={() => { setIsCustomMateria(false); setMateria(""); }} className="text-itec-gray hover:text-white px-2 transition-colors">↩</button>
            </div>
          ) : (
            <CustomSelect value={materia} onChange={handleMateriaChange} options={materiaOptions} placeholder="Seleccioná..." className="py-2.5" />
          )}
        </div>

        <div className="flex flex-col relative z-20">
          <label className={LABEL_CLS}>Categoría</label>
          <CustomSelect 
            value={categoria} onChange={setCategoria} 
            options={[{ value: "Comunidad", label: "Comunidad (Estudiantes)" }, { value: "Oficial", label: "Oficial (Institucional)" }]} 
            className="py-2.5" 
          />
        </div>

        <div className="flex flex-col relative z-10">
          <label className={LABEL_CLS}>Estado de Publicación</label>
          <CustomSelect 
            value={status} onChange={(v) => setStatus(v as any)} 
            options={[
              { value: "draft", label: "Borrador (Oculto)" },
              { value: "approved", label: "Publicado (Visible)" },
              { value: "archived", label: "Archivado" }
            ]} 
            className="py-2.5" 
          />
        </div>

        <div className="flex flex-col">
          <label className={LABEL_CLS}>Profesores / Docentes</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <MarkdownTextarea
              placeholder="Nombre y apellido, luego Enter..."
              value={profesorInput}
              onChange={setProfesorInput}
              onKeyDown={handleProfesorKeyDown}
              className="flex-1"
              textareaClassName="bg-itec-box border-itec-border focus:border-itec-section-courses/60 py-2.5 rounded-xl min-h-[42px]"
              hint=""
            />
            <Button type="button" variant="primary" hierarchy="outline" onClick={addProfesor} className="px-4 py-2.5 shrink-0">
              <Plus className="w-4 h-4 text-itec-section-courses" />
            </Button>
          </div>
          {profesores.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {profesores.map((p, idx) => (
                <span
                  key={`${p}-${idx}`}
                  className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-itec-section-courses/15 border border-itec-section-courses/30 text-itec-section-courses text-xs font-bold max-w-full"
                >
                  <Users className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-40">{p}</span>
                  <button
                    type="button"
                    onClick={() => removeProfesor(idx)}
                    className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-itec-section-courses hover:text-white transition-colors shrink-0"
                    aria-label={`Quitar a ${p}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-itec-gray/70 mt-1.5">Podés cargar más de un profesor para este curso.</p>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label className={LABEL_CLS}>Descripción corta</label>
          <MarkdownTextarea
            placeholder="Breve resumen del curso..."
            value={desc}
            onChange={setDesc}
            textareaClassName="rounded-xl py-2.5 min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};


