import React, { useState, useEffect, type ChangeEvent } from "react";
import { Input } from "@/components/ui/Input";

const MATERIAS: string[] = [
  "Análisis Matemático", "Álgebra y Geometría Analítica",
  "Sistemas y Procesos de Negocio", "Paradigmas de Programación",
  "Arquitectura de Computadoras", "Física", "Química",
  "Inglés Técnico", "Otra...",
];

const FIELD_CLS = "w-full bg-white/[0.04] border border-white/10 text-itec-text text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-itec-blue-skye/60 focus:ring-2 focus:ring-itec-blue-skye/10 transition-all";
const LABEL_CLS = "block text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-1.5";

interface Props {
  title: string; setTitle: (v: string) => void;
  image: string; setImage: (v: string) => void;
  desc: string;  setDesc: (v: string) => void;
  materia: string; setMateria: (v: string) => void;
  categoria: string; setCategoria: (v: string) => void;
}

export const CourseGeneralData: React.FC<Props> = ({
  title, setTitle, image, setImage, desc, setDesc, materia, setMateria, categoria, setCategoria,
}) => {
  const [customMateria, setCustomMateria] = useState(false);

  useEffect(() => {
    if (materia && !MATERIAS.includes(materia) && materia !== "Otra...") setCustomMateria(true);
  }, [materia]);

  const handleMateriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Otra...") { setCustomMateria(true); setMateria(""); }
    else { setCustomMateria(false); setMateria(e.target.value); }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-itec-text uppercase tracking-widest border-b border-white/8 pb-2">
        Datos del curso
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Título</label>
          <Input fullWidth placeholder="Ej: Clase de Paradigmas..." value={title} onChange={(e: any) => setTitle(e.target.value)} className="bg-white/[0.04] border-white/10 text-sm py-2.5 rounded-xl" />
        </div>
        <div>
          <label className={LABEL_CLS}>URL Portada (opcional)</label>
          <Input fullWidth placeholder="https://..." value={image} onChange={(e: any) => setImage(e.target.value)} className="bg-white/[0.04] border-white/10 text-sm py-2.5 rounded-xl" />
        </div>
        <div>
          <label className={LABEL_CLS}>Materia</label>
          {customMateria ? (
            <div className="flex gap-2">
              <Input fullWidth placeholder="Escribí la materia..." value={materia} onChange={(e: any) => setMateria(e.target.value)} className="bg-white/[0.04] border-white/10 text-sm py-2.5 rounded-xl flex-1" />
              <button type="button" onClick={() => { setCustomMateria(false); setMateria(""); }} className="text-itec-gray hover:text-itec-text text-xs px-3 transition-colors">↩</button>
            </div>
          ) : (
            <select value={materia} onChange={handleMateriaChange} className={FIELD_CLS}>
              <option value="">Seleccioná...</option>
              {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          )}
        </div>
        <div>
          <label className={LABEL_CLS}>Categoría</label>
          <select value={categoria} onChange={(e: any) => setCategoria(e.target.value)} className={FIELD_CLS}>
            <option value="Comunidad">Comunidad (Estudiantes)</option>
            <option value="Oficial">Oficial (Institucional)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL_CLS}>Descripción corta</label>
          <Input fullWidth placeholder="Ej: Repaso para el final..." value={desc} onChange={(e: any) => setDesc(e.target.value)} className="bg-white/[0.04] border-white/10 text-sm py-2.5 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
