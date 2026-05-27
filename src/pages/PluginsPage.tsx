import React from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { Link } from "react-router-dom";
import { usePageTitle } from "@hooks/usePageTitle";

interface Plugin {
  title: string;
  description: string;
  iconName: string;
  iconColor: string;
  href: string;
  isExternal?: boolean;
  tag?: string;
  tagColor?: string;
}

const PLUGINS: Plugin[] = [
  {
    title: "Buscar Aula",
    description: "Encontrá cualquier aula de Medrano o Campus con referencias para llegar.",
    iconName: "map-pin",
    iconColor: "bg-itec-red/12 text-[#e01540]",
    href: "/aulas",
    tag: "Propio",
    tagColor: "bg-itec-red/12 text-[#e01540]",
  },
  {
    title: "Calculadora de promedio",
    description: "Calculá tu promedio ponderado con las materias y notas del SIU.",
    iconName: "calculator",
    iconColor: "bg-[#f0b100]/12 text-[#f0b100]",
    href: "/grado",
    tag: "Propio",
    tagColor: "bg-[#f0b100]/12 text-[#f0b100]",
  },
  {
    title: "Seguidor de carrera",
    description: "Visualizá tu progreso académico, correlatividades y materias pendientes.",
    iconName: "chart-line",
    iconColor: "bg-[#008854]/15 text-[#2fcc8a]",
    href: "/progreso",
    tag: "Privado",
    tagColor: "bg-[#008854]/15 text-[#2fcc8a]",
  },
  {
    title: "GuíaTEC",
    description: "Videos explicativos gratuitos para materias clave e ingresantes.",
    iconName: "video",
    iconColor: "bg-teal-500/12 text-teal-400",
    href: "/guiatec",
    tag: "Propio",
    tagColor: "bg-teal-500/12 text-teal-400",
  },
  {
    title: "Calendario Académico",
    description: "Fechas de parciales, finales, feriados y actividades de la FRBA.",
    iconName: "calendar",
    iconColor: "bg-purple-500/12 text-purple-400",
    href: "/calendario",
    tag: "Propio",
    tagColor: "bg-purple-500/12 text-purple-400",
  },
  {
    title: "SIU Guaraní",
    description: "Sistema oficial de gestión académica de la UTN FRBA.",
    iconName: "siuGuarani",
    iconColor: "bg-white/8 text-[#9aa3b0]",
    href: "https://guarani.frba.utn.edu.ar",
    isExternal: true,
    tag: "Externo",
    tagColor: "bg-white/8 text-[#9aa3b0]",
  },
  {
    title: "Aulas Virtuales",
    description: "Plataforma oficial de clases virtuales y materiales de la UTN.",
    iconName: "aulasVirtuales",
    iconColor: "bg-white/8 text-[#9aa3b0]",
    href: "https://aulasvirtuales.frba.utn.edu.ar",
    isExternal: true,
    tag: "Externo",
    tagColor: "bg-white/8 text-[#9aa3b0]",
  },
];

export const PluginsPage: React.FC = () => {
  usePageTitle("Plugins y Herramientas");

  return (
    <MainLayout>
      <PageHeader
        title="Plugins y Herramientas"
        description="Accesos directos a todas las herramientas propias de ITEC y los recursos oficiales de la UTN FRBA."
        iconType="tool"
        colorTheme="orange"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLUGINS.map((p) => {
          const inner = (
            <>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.iconColor}`}>
                <div className="w-5 h-5"><Icons type={p.iconName} className="w-full h-full" /></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-itec-text">{p.title}</p>
                  {p.tag && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${p.tagColor}`}>{p.tag}</span>
                  )}
                </div>
                <p className="text-xs text-[#5a6475] mt-1 leading-relaxed">{p.description}</p>
              </div>
              {p.isExternal && (
                <div className="w-4 h-4 text-[#5a6475] shrink-0">
                  <Icons type="externalLink" className="w-full h-full" />
                </div>
              )}
            </>
          );

          const cls = "flex items-start gap-3 bg-itec-card border border-white/7 rounded-xl p-4 hover:border-white/12 transition-colors";

          return p.isExternal ? (
            <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
          ) : (
            <Link key={p.title} to={p.href} className={cls}>{inner}</Link>
          );
        })}
      </div>
    </MainLayout>
  );
};
