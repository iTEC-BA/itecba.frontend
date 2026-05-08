import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { usePageTitle } from "@hooks/usePageTitle";

type ResultType = "materia" | "aula" | "grupo" | "recurso";

interface SearchResult {
  type: ResultType;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: "green" | "gold" | "blue" | "red";
  iconName: string;
}

const MOCK_RESULTS: SearchResult[] = [
  { type: "materia", title: "Análisis Matemático II", subtitle: "Ing. Sistemas · Anual · 2.° año · 6 comisiones", badge: "Disponible", badgeColor: "green", iconName: "calculator" },
  { type: "aula", title: "Aula 304 — 3.° piso", subtitle: "Medrano · Ala norte · Lun y Mié 18hs", badge: "Comisión A", badgeColor: "blue", iconName: "map-pin" },
  { type: "grupo", title: "Grupo AM2 — Comisión A", subtitle: "47 miembros · Activo hoy", badge: "Unirme", badgeColor: "green", iconName: "users" },
  { type: "recurso", title: "GuíaTEC — AM2 desde cero", subtitle: "Video · Jairo T. · 45 min", badge: "Gratis", badgeColor: "green", iconName: "video" },
];

const BADGE_CLASSES: Record<string, string> = {
  green: "bg-[#008854]/15 text-[#2fcc8a]",
  gold: "bg-[#f0b100]/12 text-[#f0b100]",
  blue: "bg-[#004aad]/15 text-[#5b9cf6]",
  red: "bg-itec-red/12 text-[#e01540]",
};

const TYPE_ICON_BG: Record<ResultType, string> = {
  materia: "bg-[#004aad]/15 text-[#5b9cf6]",
  aula: "bg-itec-red/12 text-[#e01540]",
  grupo: "bg-[#008854]/15 text-[#2fcc8a]",
  recurso: "bg-[#f0b100]/12 text-[#f0b100]",
};

const FILTERS = ["Todas", "Materias", "Aulas", "Grupos", "Recursos"];

export const BuscaTECPage: React.FC = () => {
  usePageTitle("BuscaTEC");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearched(true);
  };

  const filtered = MOCK_RESULTS.filter((r) => {
    if (activeFilter === "Todas") return true;
    const map: Record<string, ResultType> = {
      Materias: "materia", Aulas: "aula", Grupos: "grupo", Recursos: "recurso",
    };
    return r.type === map[activeFilter];
  });

  return (
    <MainLayout>
      <PageHeader
        title="BuscaTEC"
        description="Buscá materias, aulas, grupos y recursos sin necesidad de entrar al SIU."
        iconType="search"
        colorTheme="blue"
      />

      {/* Buscador principal */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-itec-card border border-white/7 rounded-xl px-4 py-3 focus-within:border-itec-blue-skye transition-colors">
          <div className="w-4 h-4 text-[#5a6475] shrink-0">
            <Icons type="search" className="w-full h-full" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá materia, aula, grupo, docente..."
            className="flex-1 bg-transparent text-itec-text text-sm placeholder-[#5a6475] outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setSearched(false); }}
              className="text-[#5a6475] hover:text-itec-text transition-colors text-lg leading-none">×</button>
          )}
        </div>
        <button
          type="submit"
          className="bg-itec-red hover:bg-[#e01540] text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors shrink-0"
        >
          Buscar
        </button>
      </form>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeFilter === f
                ? "bg-itec-red border-itec-red text-white"
                : "bg-transparent border-itec-border text-[#9aa3b0] hover:border-white/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Resultados o estado vacío */}
      {!searched ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#004aad]/15 flex items-center justify-center text-[#5b9cf6]">
            <div className="w-6 h-6"><Icons type="search" className="w-full h-full" /></div>
          </div>
          <p className="text-[#5a6475] text-sm">Escribí algo arriba para buscar<br/>materias, aulas, grupos y más</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#5a6475]">
            Resultados para <span className="text-itec-text font-medium">"{query}"</span>
          </p>
          {filtered.map((r, i) => (
            <div
              key={i}
              className="bg-itec-card border border-white/7 rounded-xl p-3.5 flex items-center gap-3 hover:border-white/12 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TYPE_ICON_BG[r.type]}`}>
                <div className="w-5 h-5"><Icons type={r.iconName} className="w-full h-full" /></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-itec-text truncate">{r.title}</p>
                <p className="text-xs text-[#5a6475] mt-0.5 truncate">{r.subtitle}</p>
              </div>
              {r.badge && (
                <span className={`text-[10px] font-medium px-2 py-1 rounded-md shrink-0 ${BADGE_CLASSES[r.badgeColor ?? "blue"]}`}>
                  {r.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};
