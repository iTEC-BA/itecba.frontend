import React, { useState, useEffect } from 'react';
import { Input } from '@/components/atoms/Input';

export const MATERIAS_UTN = [
  "Análisis Matemático",
  "Álgebra y Geometría Analítica",
  "Sistemas y Procesos de Negocio",
  "Paradigmas de Programación",
  "Arquitectura de Computadoras",
  "Física",
  "Química",
  "Inglés Técnico",
  "Otra..."
];

interface Props {
  title: string;
  setTitle: (val: string) => void;
  image: string;
  setImage: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  materia: string;
  setMateria: (val: string) => void;
  categoria: string;
  setCategoria: (val: string) => void;
}

export const CourseGeneralData: React.FC<Props> = ({
  title, setTitle,
  image, setImage,
  desc, setDesc,
  materia, setMateria,
  categoria, setCategoria
}) => {
  const [isCustomMateria, setIsCustomMateria] = useState(false);

  useEffect(() => {
    if (materia && !MATERIAS_UTN.includes(materia) && materia !== "Otra...") {
      setIsCustomMateria(true);
    }
  }, [materia]);

  const handleMateriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Otra...") {
      setIsCustomMateria(true);
      setMateria("");
    } else {
      setIsCustomMateria(false);
      setMateria(value);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-sm font-bold text-white border-b border-itec-gray pb-2">
        Detalles del Curso
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Título del Curso</label>
          <Input fullWidth placeholder="Ej: Clase de Paradigmas..." value={title} onChange={(e: any) => setTitle(e.target.value)} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">URL Portada (Opcional)</label>
          <Input fullWidth placeholder="https://..." value={image} onChange={(e: any) => setImage(e.target.value)} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Materia</label>
          {isCustomMateria ? (
            <div className="flex gap-2">
              <Input fullWidth placeholder="Escribe la materia..." value={materia} onChange={(e: any) => setMateria(e.target.value)} className="bg-itec-surface border-itec-gray text-sm py-2.5 flex-1" />
              <button type="button" onClick={() => { setIsCustomMateria(false); setMateria(""); }} className="text-gray-400 hover:text-white text-xs px-2">Volver</button>
            </div>
          ) : (
            <select
              value={materia}
              onChange={handleMateriaChange}
              className="w-full bg-itec-surface border border-itec-gray text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-itec-blue transition-all"
            >
              <option value="">Selecciona una materia...</option>
              {MATERIAS_UTN.map(mat => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Categoría</label>
          <select
            value={categoria}
            onChange={(e: any) => setCategoria(e.target.value)}
            className="w-full bg-itec-surface border border-itec-gray text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-itec-blue transition-all"
          >
            <option value="Comunidad">Comunidad (Estudiantes)</option>
            <option value="Oficial">Oficial (Profesores/Institucional)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Descripción corta</label>
          <Input fullWidth placeholder="Ej: Repaso general para finales..." value={desc} onChange={(e: any) => setDesc(e.target.value)} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
        </div>
      </div>
    </div>
  );
};