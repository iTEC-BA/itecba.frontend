import React, { useState } from "react";
import { ExternalLink, Link2, ChevronDown, GraduationCap, Monitor, BookOpen, FlaskConical, FolderKanban, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const MAIN_LINKS = [
  { label: "SIU Guaraní", url: "https://guarani.frba.utn.edu.ar/" },
  { label: "Campus Virtual", url: "https://aulasvirtuales.frba.utn.edu.ar/login/index.php" },
];

const AUTOGESTION_LINKS = [
  { label: "Seminario Universitario", url: "https://www.frba.utn.edu.ar/autogestion/aspirantes" },
  { label: "Tec. y Licenciaturas", url: "https://www.frba.utn.edu.ar/autogestion/extension" },
  { label: "Carreras de Grado", url: "https://www.frba.utn.edu.ar/autogestion/grado" },
  { label: "Escuela de Posgrado", url: "https://www.frba.utn.edu.ar/autogestion/posgrado" },
];

const CAMPUS_LINKS = [
  { label: "Grado", icon: GraduationCap, url: "https://aulasvirtuales.frba.utn.edu.ar/course/index.php?categoryid=1" },
  { label: "Posgrado", icon: BookOpen, url: "https://aulasvirtuales.frba.utn.edu.ar/course/index.php?categoryid=6" },
  { label: "Educación a Distancia", icon: Monitor, url: "https://aulasvirtuales.frba.utn.edu.ar/course/index.php?categoryid=11" },
  { label: "Investigación", icon: FlaskConical, url: "https://aulasvirtuales.frba.utn.edu.ar/course/index.php?categoryid=301" },
  { label: "Proyectos Acad.", icon: FolderKanban, url: "https://aulasvirtuales.frba.utn.edu.ar/course/index.php?categoryid=1285" },
  { label: "Extensión", icon: Globe, url: "https://aulasvirtuales.frba.utn.edu.ar/course/index.php?categoryid=676" },
];

export const QuickLinksWidget: React.FC = () => {
  const [openSection, setOpenSection] = useState<"campus" | "auto" | null>(null);

  const toggle = (section: "campus" | "auto") => {
    setOpenSection(prev => prev === section ? null : section);
  };

  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-itec-muted pl-1 flex items-center gap-1.5">
        <Link2 size={12} /> Accesos Rápidos
      </h3>

      <div className="flex flex-col gap-1.5">
        {/* Links Principales (SIU y Campus Home) */}
        {MAIN_LINKS.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-colors group"
          >
            <span className="text-[11px] font-bold text-itec-text group-hover:text-white">
              {link.label}
            </span>
            <ExternalLink size={12} className="text-itec-muted group-hover:text-white transition-colors" />
          </a>
        ))}

        {/* Acordeón: Aulas por Categoría */}
        <div className="flex flex-col rounded-lg border border-white/5 bg-white/[0.01] overflow-hidden mt-1">
          <button 
            onClick={() => toggle("campus")}
            className="flex items-center justify-between p-2.5 text-[11px] font-bold text-itec-muted hover:text-white hover:bg-white/[0.02] transition-colors"
          >
            Categorías Campus
            <ChevronDown size={12} className={cn("transition-transform", openSection === "campus" && "rotate-180")} />
          </button>
          
          {openSection === "campus" && (
            <div className="flex flex-col p-1.5 border-t border-white/5 bg-itec-box">
              {CAMPUS_LINKS.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 transition-colors group">
                  <link.icon size={10} className="text-itec-muted group-hover:text-itec-sky" />
                  <span className="text-[10px] text-itec-muted group-hover:text-white truncate">{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Acordeón: Autogestión */}
        <div className="flex flex-col rounded-lg border border-white/5 bg-white/[0.01] overflow-hidden">
          <button 
            onClick={() => toggle("auto")}
            className="flex items-center justify-between p-2.5 text-[11px] font-bold text-itec-muted hover:text-white hover:bg-white/[0.02] transition-colors"
          >
            Autogestión
            <ChevronDown size={12} className={cn("transition-transform", openSection === "auto" && "rotate-180")} />
          </button>
          
          {openSection === "auto" && (
            <div className="flex flex-col p-1.5 border-t border-white/5 bg-itec-box">
              {AUTOGESTION_LINKS.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 transition-colors group">
                  <div className="w-1 h-1 rounded-full bg-itec-muted group-hover:bg-itec-sky" />
                  <span className="text-[10px] text-itec-muted group-hover:text-white truncate">{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};