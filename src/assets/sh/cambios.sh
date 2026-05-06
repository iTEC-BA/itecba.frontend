#!/bin/bash
# =============================================================================
# ITEC.BA — Script de mejoras: páginas faltantes + adaptación mobile
# Ejecutar desde la RAÍZ del proyecto (donde está package.json)
# =============================================================================

set -e

ROOT_DIR=$(pwd)
SRC="$ROOT_DIR/src"
BACKUP_DIR="$ROOT_DIR/.itec_backup_$(date +%Y%m%d_%H%M%S)"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║          ITEC.BA — Aplicando mejoras                ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  1. Backup del estado actual                        ║"
echo "║  2. BottomNavbar mejorado (mobile)                  ║"
echo "║  3. Página /buscatec (BuscaTECPage)                 ║"
echo "║  4. Página /aulas (AulasPage)                       ║"
echo "║  5. Página /guiatec (GuiaTECPage)                   ║"
echo "║  6. Página /calendario (CalendarioPage)             ║"
echo "║  7. Página /plugins (PluginsPage)                   ║"
echo "║  8. Página /terminos (TerminosPage)                 ║"
echo "║  9. Rutas en App.tsx                                ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# --- Verificar que estamos en la raíz correcta ---
if [ ! -f "$ROOT_DIR/package.json" ]; then
  echo "❌ Error: No se encontró package.json. Ejecutá este script desde la raíz del proyecto."
  exit 1
fi

if [ ! -d "$SRC" ]; then
  echo "❌ Error: No se encontró el directorio src/."
  exit 1
fi

# =============================================================================
# PASO 1: BACKUP
# =============================================================================
echo "📦 Creando backup en: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Backup de archivos que vamos a modificar
[ -f "$SRC/App.tsx" ] && cp "$SRC/App.tsx" "$BACKUP_DIR/App.tsx"
[ -f "$SRC/components/molecules/BottomNavbar.tsx" ] && cp "$SRC/components/molecules/BottomNavbar.tsx" "$BACKUP_DIR/BottomNavbar.tsx"

echo "✅ Backup creado."
echo ""

# =============================================================================
# PASO 2: BOTTOMNAVBAR MEJORADO — mobile con rutas correctas y estado activo
# =============================================================================
echo "📱 Actualizando BottomNavbar con rutas completas y estado activo..."

cat > "$SRC/components/molecules/BottomNavbar.tsx" << 'BOTTOMNAV_EOF'
import { Link, useLocation } from "react-router-dom";
import { Icons } from "../ui/icons/Icons";
import Raccoon from "../ui/icons/Raccoon";
import { useAuth } from "../../context/AuthContext";

export const BottomNavbar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center justify-center flex-col gap-0.5 min-w-0 flex-1 ${
      isActive(path) ? "text-[#e01540]" : "text-[#9aa3b0]"
    }`;

  return (
    <nav className="h-16 w-full bg-itec-sidebar border-t border-white/5 sticky bottom-0 z-[99] flex items-center justify-around px-2 shrink-0 pb-safe">
      <div className="flex gap-1 justify-around w-full items-center">
        {/* Inicio */}
        <Link to="/" className={linkClass("/")}>
          <div className="w-6 h-6">
            <Icons type="home" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">Inicio</span>
        </Link>

        {/* BuscaTEC */}
        <Link to="/buscatec" className={linkClass("/buscatec")}>
          <div className="w-6 h-6">
            <Icons type="search" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">Buscar</span>
        </Link>

        {/* FAB central — Chatbot / Raccoon */}
        <Link to="/faqs" className="flex items-center justify-center flex-col flex-1">
          <span
            className={`rounded-2xl p-2 transition-colors ${
              isActive("/faqs") ? "bg-[#e01540]" : "bg-itec-red"
            }`}
          >
            <Raccoon size={28} fill1="#ffffff" fill2="#ffffff" fill3="#0C1014" />
          </span>
          <span className="text-[9px] font-medium text-[#9aa3b0] mt-0.5">Chat IA</span>
        </Link>

        {/* Grupos */}
        <Link to="/grupos" className={linkClass("/grupos")}>
          <div className="w-6 h-6">
            <Icons type="users" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">Grupos</span>
        </Link>

        {/* Perfil / Login */}
        <Link
          to={isAuthenticated ? "/perfil" : "/login"}
          className={linkClass(isAuthenticated ? "/perfil" : "/login")}
        >
          <div className="w-6 h-6">
            <Icons type="user" className="w-full h-full" />
          </div>
          <span className="text-[9px] font-medium truncate">
            {isAuthenticated ? "Perfil" : "Entrar"}
          </span>
        </Link>
      </div>
    </nav>
  );
};
BOTTOMNAV_EOF

echo "✅ BottomNavbar actualizado."

# =============================================================================
# PASO 3: PÁGINA /buscatec — BuscaTECPage
# =============================================================================
echo "🔍 Creando BuscaTECPage..."

mkdir -p "$SRC/pages"

cat > "$SRC/pages/BuscaTECPage.tsx" << 'BUSCATEC_EOF'
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
        <div className="flex-1 flex items-center gap-2 bg-[#111820] border border-white/7 rounded-xl px-4 py-3 focus-within:border-itec-blue-skye transition-colors">
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
                : "bg-transparent border-white/10 text-[#9aa3b0] hover:border-white/20"
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
              className="bg-[#111820] border border-white/7 rounded-xl p-3.5 flex items-center gap-3 hover:border-white/12 transition-colors cursor-pointer"
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
BUSCATEC_EOF

echo "✅ BuscaTECPage creada."

# =============================================================================
# PASO 4: PÁGINA /aulas — AulasPage
# =============================================================================
echo "🏫 Creando AulasPage..."

cat > "$SRC/pages/AulasPage.tsx" << 'AULAS_EOF'
import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { usePageTitle } from "@hooks/usePageTitle";

interface Aula {
  numero: string;
  piso: string;
  ala: string;
  sede: string;
  capacidad: number;
  referencias: string;
}

const AULAS: Aula[] = [
  { numero: "101", piso: "1.° piso", ala: "Ala central", sede: "Medrano", capacidad: 40, referencias: "Al subir la escalera, primer aula a la derecha." },
  { numero: "204", piso: "2.° piso", ala: "Ala norte", sede: "Medrano", capacidad: 60, referencias: "Subís por el ascensor, giras a la izquierda." },
  { numero: "304", piso: "3.° piso", ala: "Ala norte", sede: "Medrano", capacidad: 35, referencias: "Escalera central, a la derecha." },
  { numero: "Lab-A", piso: "1.° piso", ala: "Ala sur", sede: "Medrano", capacidad: 25, referencias: "Laboratorio de informática, requiere credencial." },
  { numero: "C101", piso: "1.° piso", ala: "Ala central", sede: "Campus", capacidad: 80, referencias: "Edificio central, al fondo del pasillo." },
  { numero: "C203", piso: "2.° piso", ala: "Ala este", sede: "Campus", capacidad: 50, referencias: "Sube por escalera este, tercera puerta." },
];

export const AulasPage: React.FC = () => {
  usePageTitle("Buscar Aula");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Aula | null>(null);
  const [sede, setSede] = useState("Todas");

  const filtered = AULAS.filter((a) => {
    const matchQuery =
      a.numero.toLowerCase().includes(query.toLowerCase()) ||
      a.piso.toLowerCase().includes(query.toLowerCase());
    const matchSede = sede === "Todas" || a.sede === sede;
    return matchQuery && matchSede;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Buscar Aula"
        description="Encontrá cualquier aula de Medrano o Campus en segundos, con referencias visuales para llegar."
        iconType="map-pin"
        colorTheme="red"
      />

      {/* Buscador + filtro sede */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-[#111820] border border-white/7 rounded-xl px-4 py-3 focus-within:border-itec-blue-skye transition-colors">
          <div className="w-4 h-4 text-[#5a6475] shrink-0">
            <Icons type="map-pin" className="w-full h-full" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            placeholder="Ej: 304, Lab-A, C203..."
            className="flex-1 bg-transparent text-itec-text text-sm placeholder-[#5a6475] outline-none"
          />
        </div>
        <select
          value={sede}
          onChange={(e) => setSede(e.target.value)}
          className="bg-[#111820] border border-white/7 text-[#9aa3b0] text-sm px-4 py-3 rounded-xl outline-none focus:border-itec-blue-skye transition-colors"
        >
          <option value="Todas">Todas las sedes</option>
          <option value="Medrano">Medrano</option>
          <option value="Campus">Campus</option>
        </select>
      </div>

      {/* Aula seleccionada — detalle */}
      {selected && (
        <div className="mb-5 bg-[#111820] border border-itec-red/30 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-itec-red/15 text-[#e01540] px-2 py-0.5 rounded-md">{selected.sede}</span>
                <span className="text-xs text-[#5a6475]">{selected.piso} · {selected.ala}</span>
              </div>
              <h2 className="text-2xl font-bold text-itec-text">Aula {selected.numero}</h2>
            </div>
            <button onClick={() => setSelected(null)} className="text-[#5a6475] hover:text-itec-text text-xl leading-none shrink-0">×</button>
          </div>
          {/* Mini mapa visual */}
          <div className="relative h-28 bg-[#0C1014] rounded-xl border border-white/5 overflow-hidden mb-3 flex items-center justify-center">
            <div className="grid grid-cols-8 grid-rows-4 gap-1 absolute inset-2 opacity-20">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="bg-[#1a2230] rounded-sm" />
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-6 h-6 text-[#e01540]"><Icons type="map-pin" className="w-full h-full" /></div>
              <span className="text-xs font-bold text-itec-text">Aula {selected.numero}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 text-[#5a6475] shrink-0 mt-0.5"><Icons type="info" className="w-full h-full" /></div>
            <p className="text-sm text-[#9aa3b0]">{selected.referencias}</p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#5a6475]">
            <div className="w-3 h-3"><Icons type="users" className="w-full h-full" /></div>
            <span>Capacidad: {selected.capacidad} personas</span>
          </div>
        </div>
      )}

      {/* Lista de resultados */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-itec-red/10 flex items-center justify-center text-[#e01540]">
              <div className="w-5 h-5"><Icons type="map-pin" className="w-full h-full" /></div>
            </div>
            <p className="text-[#5a6475] text-sm">No encontramos el aula "{query}".<br/>Probá con otro número o sede.</p>
          </div>
        ) : (
          filtered.map((a) => (
            <button
              key={a.numero}
              onClick={() => setSelected(a)}
              className={`text-left w-full bg-[#111820] border rounded-xl p-3.5 flex items-center gap-3 transition-colors ${
                selected?.numero === a.numero ? "border-itec-red/40" : "border-white/7 hover:border-white/12"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-itec-red/12 text-[#e01540] flex items-center justify-center shrink-0">
                <div className="w-5 h-5"><Icons type="map-pin" className="w-full h-full" /></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-itec-text">Aula {a.numero}</p>
                  <span className="text-[10px] text-[#5a6475] bg-white/5 px-1.5 py-0.5 rounded">{a.sede}</span>
                </div>
                <p className="text-xs text-[#5a6475] mt-0.5">{a.piso} · {a.ala} · {a.capacidad} personas</p>
              </div>
              <div className="w-4 h-4 text-[#5a6475]"><Icons type="arrowLeft" className="w-full h-full rotate-180" /></div>
            </button>
          ))
        )}
      </div>
    </MainLayout>
  );
};
AULAS_EOF

echo "✅ AulasPage creada."

# =============================================================================
# PASO 5: PÁGINA /guiatec — GuiaTECPage
# =============================================================================
echo "🎥 Creando GuiaTECPage..."

cat > "$SRC/pages/GuiaTECPage.tsx" << 'GUIATEC_EOF'
import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { usePageTitle } from "@hooks/usePageTitle";

type GuiaCategory = "Ingresantes" | "Matemática" | "Programación" | "Física" | "Otros";

interface GuiaVideo {
  id: string;
  title: string;
  author: string;
  duration: string;
  category: GuiaCategory;
  pinned?: boolean;
  youtubeId: string;
}

const VIDEOS: GuiaVideo[] = [
  { id: "1", title: "GuíaTEC Ingresantes 2026 — SIU, aula virtual e inscripciones", author: "ITEC", duration: "22 min", category: "Ingresantes", pinned: true, youtubeId: "dQw4w9WgXcQ" },
  { id: "2", title: "AM1 — Límites y continuidad desde cero", author: "Gabi N.", duration: "38 min", category: "Matemática", youtubeId: "dQw4w9WgXcQ" },
  { id: "3", title: "AM2 — Integrales: técnicas y aplicaciones", author: "Jairo T.", duration: "45 min", category: "Matemática", youtubeId: "dQw4w9WgXcQ" },
  { id: "4", title: "C++ para Ingeniería de Sistemas — Fundamentos", author: "Ramón M.", duration: "55 min", category: "Programación", youtubeId: "dQw4w9WgXcQ" },
  { id: "5", title: "PDEP — Programación funcional explicada simple", author: "Gabi N.", duration: "40 min", category: "Programación", youtubeId: "dQw4w9WgXcQ" },
  { id: "6", title: "Física I — Cinemática y dinámica: parcial modelo", author: "Santiago G.", duration: "50 min", category: "Física", youtubeId: "dQw4w9WgXcQ" },
  { id: "7", title: "Álgebra — Transformaciones lineales para parcial", author: "María L.", duration: "30 min", category: "Matemática", youtubeId: "dQw4w9WgXcQ" },
];

const CATEGORIES: GuiaCategory[] = ["Ingresantes", "Matemática", "Programación", "Física", "Otros"];
const CAT_COLORS: Record<GuiaCategory, string> = {
  Ingresantes: "bg-[#004aad]/15 text-[#5b9cf6]",
  Matemática: "bg-[#f0b100]/12 text-[#f0b100]",
  Programación: "bg-[#008854]/15 text-[#2fcc8a]",
  Física: "bg-purple-500/12 text-purple-400",
  Otros: "bg-white/8 text-[#9aa3b0]",
};

export const GuiaTECPage: React.FC = () => {
  usePageTitle("GuíaTEC");
  const [activeCategory, setActiveCategory] = useState<"Todas" | GuiaCategory>("Todas");
  const [playing, setPlaying] = useState<GuiaVideo | null>(null);

  const filtered = VIDEOS.filter(
    (v) => activeCategory === "Todas" || v.category === activeCategory
  );
  const pinned = filtered.filter((v) => v.pinned);
  const rest = filtered.filter((v) => !v.pinned);

  return (
    <MainLayout>
      <PageHeader
        title="GuíaTEC"
        description="Videos explicativos anclados para materias clave, ingresantes y más. Todos gratuitos."
        iconType="video"
        colorTheme="teal"
      />

      {/* Player activo */}
      {playing && (
        <div className="mb-6 bg-[#111820] border border-white/7 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="aspect-video bg-black flex items-center justify-center relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-itec-red/20 flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 text-[#e01540]"><Icons type="playFill" className="w-full h-full" /></div>
              </div>
              <p className="text-sm text-[#9aa3b0]">Video en YouTube →</p>
              <a
                href={`https://youtube.com/watch?v=${playing.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#5b9cf6] hover:underline"
              >
                Abrir en YouTube <div className="w-3 h-3"><Icons type="externalLink" className="w-full h-full" /></div>
              </a>
            </div>
          </div>
          <div className="p-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-itec-text">{playing.title}</h3>
              <p className="text-xs text-[#5a6475] mt-1">{playing.author} · {playing.duration}</p>
            </div>
            <button onClick={() => setPlaying(null)} className="text-[#5a6475] hover:text-itec-text shrink-0 text-xl">×</button>
          </div>
        </div>
      )}

      {/* Filtros de categoría */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar">
        {(["Todas", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeCategory === c
                ? "bg-itec-red border-itec-red text-white"
                : "bg-transparent border-white/10 text-[#9aa3b0] hover:border-white/20"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Videos anclados */}
      {pinned.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 text-[#f0b100]"><Icons type="pin" className="w-full h-full" /></div>
            <span className="text-xs font-medium text-[#9aa3b0] uppercase tracking-wider">Anclados para ingresantes</span>
          </div>
          <div className="flex flex-col gap-2">
            {pinned.map((v) => <VideoCard key={v.id} video={v} catColors={CAT_COLORS} onPlay={() => setPlaying(v)} />)}
          </div>
        </div>
      )}

      {/* Resto de videos */}
      {rest.length > 0 && (
        <div>
          <p className="text-xs text-[#5a6475] uppercase tracking-wider mb-3">
            {pinned.length > 0 ? "Más videos" : "Videos disponibles"}
          </p>
          <div className="flex flex-col gap-2">
            {rest.map((v) => <VideoCard key={v.id} video={v} catColors={CAT_COLORS} onPlay={() => setPlaying(v)} />)}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

const VideoCard = ({
  video,
  catColors,
  onPlay,
}: {
  video: GuiaVideo;
  catColors: Record<GuiaCategory, string>;
  onPlay: () => void;
}) => (
  <button
    onClick={onPlay}
    className="text-left w-full bg-[#111820] border border-white/7 hover:border-white/12 rounded-xl p-3.5 flex items-center gap-3 transition-colors group"
  >
    <div className="w-11 h-11 rounded-xl bg-itec-red/12 text-[#e01540] flex items-center justify-center shrink-0 group-hover:bg-itec-red/20 transition-colors">
      <div className="w-5 h-5"><Icons type="playFill" className="w-full h-full" /></div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-itec-text truncate">{video.title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-[#5a6475]">{video.author}</span>
        <span className="text-[#5a6475]">·</span>
        <div className="w-3 h-3 text-[#5a6475]"><Icons type="clock" className="w-full h-full" /></div>
        <span className="text-xs text-[#5a6475]">{video.duration}</span>
      </div>
    </div>
    <span className={`text-[10px] font-medium px-2 py-1 rounded-md shrink-0 hidden sm:inline ${catColors[video.category]}`}>
      {video.category}
    </span>
  </button>
);
GUIATEC_EOF

echo "✅ GuiaTECPage creada."

# =============================================================================
# PASO 6: PÁGINA /calendario — CalendarioPage
# =============================================================================
echo "📅 Creando CalendarioPage..."

cat > "$SRC/pages/CalendarioPage.tsx" << 'CALENDARIO_EOF'
import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { usePageTitle } from "@hooks/usePageTitle";

type EventType = "examen" | "institucional" | "feriado" | "beca" | "actividad";

interface CalEvent {
  date: string; // YYYY-MM-DD
  title: string;
  subtitle?: string;
  type: EventType;
}

const EVENTS: CalEvent[] = [
  { date: "2025-05-01", title: "Día del Trabajador", type: "feriado" },
  { date: "2025-05-25", title: "Revolución de Mayo", type: "feriado" },
  { date: "2025-06-03", title: "Elecciones estudiantiles", subtitle: "Campus y Medrano · No hay clases", type: "institucional" },
  { date: "2025-06-16", title: "1.° Turno de finales", subtitle: "AM2, Física I, Álgebra · Todas las carreras", type: "examen" },
  { date: "2025-06-17", title: "1.° Turno de finales", subtitle: "PDEP, AM1 · Todas las carreras", type: "examen" },
  { date: "2025-06-30", title: "Cierre inscripción Becas Progresar", subtitle: "Plataforma Mi Argentina", type: "beca" },
  { date: "2025-07-07", title: "2.° Turno de finales", subtitle: "AM2, Física I, Álgebra", type: "examen" },
  { date: "2025-07-14", title: "Inicio receso invernal", type: "institucional" },
  { date: "2025-08-04", title: "Reinicio de clases", type: "institucional" },
  { date: "2025-09-15", title: "Visita técnica ITEC a Tenaris", subtitle: "Industrial, Mecánica, Eléctrica", type: "actividad" },
];

const TYPE_CONFIG: Record<EventType, { label: string; color: string; dot: string }> = {
  examen:       { label: "Examen",       color: "bg-itec-red/12 text-[#e01540] border-itec-red/20",   dot: "bg-[#e01540]" },
  institucional:{ label: "Institucional",color: "bg-[#004aad]/12 text-[#5b9cf6] border-[#004aad]/20",dot: "bg-[#5b9cf6]" },
  feriado:      { label: "Feriado",      color: "bg-white/8 text-[#9aa3b0] border-white/10",          dot: "bg-[#9aa3b0]" },
  beca:         { label: "Beca",         color: "bg-[#f0b100]/12 text-[#f0b100] border-[#f0b100]/20", dot: "bg-[#f0b100]" },
  actividad:    { label: "Actividad",    color: "bg-[#008854]/12 text-[#2fcc8a] border-[#008854]/20", dot: "bg-[#2fcc8a]" },
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const FILTER_TYPES: (EventType | "Todos")[] = ["Todos", "examen", "institucional", "feriado", "beca", "actividad"];

export const CalendarioPage: React.FC = () => {
  usePageTitle("Calendario Académico");
  const [filter, setFilter] = useState<EventType | "Todos">("Todos");

  const filtered = EVENTS.filter((e) => filter === "Todos" || e.type === filter);

  const grouped = filtered.reduce<Record<string, CalEvent[]>>((acc, e) => {
    const key = e.date.slice(0, 7); // YYYY-MM
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <MainLayout>
      <PageHeader
        title="Calendario Académico"
        description="Fechas de parciales, finales, feriados, becas y actividades institucionales de la FRBA."
        iconType="calendar"
        colorTheme="blue"
      />

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar">
        {FILTER_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
              filter === t
                ? "bg-itec-red border-itec-red text-white"
                : "bg-transparent border-white/10 text-[#9aa3b0] hover:border-white/20"
            }`}
          >
            {t === "Todos" ? "Todos" : TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      {/* Eventos agrupados por mes */}
      {Object.keys(grouped).sort().map((monthKey) => {
        const [year, month] = monthKey.split("-");
        return (
          <div key={monthKey} className="mb-7">
            <h2 className="text-xs font-semibold text-[#5a6475] uppercase tracking-widest mb-3">
              {MONTHS[parseInt(month) - 1]} {year}
            </h2>
            <div className="flex flex-col gap-2">
              {grouped[monthKey].map((ev, i) => {
                const d = new Date(ev.date + "T00:00:00");
                const day = d.getDate();
                const cfg = TYPE_CONFIG[ev.type];
                return (
                  <div key={i} className="flex items-center gap-3 bg-[#111820] border border-white/7 rounded-xl p-3 hover:border-white/12 transition-colors">
                    <div className={`shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center border ${cfg.color}`}>
                      <span className="text-lg font-bold leading-none">{day}</span>
                      <span className="text-[8px] uppercase mt-0.5">{MONTHS[parseInt(month) - 1].slice(0, 3)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-itec-text truncate">{ev.title}</p>
                      {ev.subtitle && <p className="text-xs text-[#5a6475] mt-0.5 truncate">{ev.subtitle}</p>}
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#004aad]/15 flex items-center justify-center">
            <div className="w-5 h-5 text-[#5b9cf6]"><Icons type="calendar" className="w-full h-full" /></div>
          </div>
          <p className="text-[#5a6475] text-sm">No hay eventos en esta categoría.</p>
        </div>
      )}
    </MainLayout>
  );
};
CALENDARIO_EOF

echo "✅ CalendarioPage creada."

# =============================================================================
# PASO 7: PÁGINA /plugins — PluginsPage
# =============================================================================
echo "🔧 Creando PluginsPage..."

cat > "$SRC/pages/PluginsPage.tsx" << 'PLUGINS_EOF'
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
    title: "BuscaTEC",
    description: "Buscá materias, comisiones y historia académica sin entrar al SIU.",
    iconName: "search",
    iconColor: "bg-[#004aad]/15 text-[#5b9cf6]",
    href: "/buscatec",
    tag: "Propio",
    tagColor: "bg-[#004aad]/15 text-[#5b9cf6]",
  },
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

          const cls = "flex items-start gap-3 bg-[#111820] border border-white/7 rounded-xl p-4 hover:border-white/12 transition-colors";

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
PLUGINS_EOF

echo "✅ PluginsPage creada."

# =============================================================================
# PASO 8: PÁGINA /terminos — TerminosPage
# =============================================================================
echo "📄 Creando TerminosPage..."

cat > "$SRC/pages/TerminosPage.tsx" << 'TERMINOS_EOF'
import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { usePageTitle } from "@hooks/usePageTitle";

interface Section {
  title: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    title: "1. Aceptación de los Términos",
    content:
      "Al acceder o utilizar la plataforma ITEC.BA, el usuario acepta quedar vinculado por los presentes Términos y Condiciones. Si no estás de acuerdo con alguna parte, no podrás acceder al servicio. Estos términos aplican a todos los visitantes, usuarios y personas que accedan o utilicen el servicio.",
  },
  {
    title: "2. Descripción del Servicio",
    content:
      "ITEC.BA es una plataforma educativa independiente desarrollada por estudiantes de la UTN FRBA. No tiene carácter oficial ni representa a la Universidad Tecnológica Nacional. Los servicios incluyen: BuscaTEC (buscador de materias y aulas), cursos dictados por estudiantes, GuíaTEC (videos educativos), BiblioTEC (repositorio de material), grupos de estudio y herramientas académicas complementarias.",
  },
  {
    title: "3. Uso de Contenido de Terceros",
    content:
      "Parte del contenido disponible en GuíaTEC y otras secciones puede estar alojado en plataformas externas como YouTube. ITEC.BA actúa como indexador y no se responsabiliza por el contenido externo. Los derechos de autor de dichos materiales corresponden a sus respectivos creadores. Los usuarios deben respetar las condiciones de uso de dichas plataformas.",
  },
  {
    title: "4. Cuentas de Usuario y Autenticación",
    content:
      "El acceso a funciones avanzadas requiere iniciar sesión mediante una cuenta de Google. Los datos recopilados durante el proceso de autenticación se utilizan exclusivamente para identificar al usuario dentro de la plataforma y no serán compartidos con terceros sin consentimiento explícito, salvo obligación legal.",
  },
  {
    title: "5. Sistema de Puntos y Recompensas",
    content:
      "Los puntos acumulados en la plataforma son virtuales y no tienen valor monetario. ITEC.BA se reserva el derecho de modificar, limitar o cancelar el sistema de puntos en cualquier momento sin previo aviso. Los puntos no son transferibles entre cuentas ni canjeables por dinero en efectivo.",
  },
  {
    title: "6. Cursos y Material de Usuarios",
    content:
      "Los cursos y materiales publicados por usuarios son responsabilidad exclusiva de sus autores. ITEC.BA no garantiza la exactitud, completitud ni actualidad del contenido generado por usuarios. Nos reservamos el derecho de eliminar contenido que infrinja derechos de terceros, sea inapropiado o viole estos términos.",
  },
  {
    title: "7. Limitación de Responsabilidad",
    content:
      "ITEC.BA no garantiza que la plataforma esté disponible de forma ininterrumpida ni libre de errores. No nos hacemos responsables por pérdidas directas o indirectas derivadas del uso o imposibilidad de uso del servicio. La información académica publicada tiene carácter orientativo; para datos oficiales, consultá el SIU Guaraní o la secretaría de tu facultad.",
  },
  {
    title: "8. Privacidad y Datos Personales",
    content:
      "Recopilamos datos mínimos necesarios para el funcionamiento de la plataforma (email, nombre de perfil, foto de Google). No vendemos ni cedemos datos personales a terceros con fines comerciales. Los datos pueden ser usados para mejorar la experiencia del usuario y enviar notificaciones académicas relevantes. Podés solicitar la eliminación de tu cuenta y datos en cualquier momento.",
  },
  {
    title: "9. Modificaciones a los Términos",
    content:
      "ITEC.BA se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigencia a partir de su publicación en la plataforma. El uso continuado del servicio tras dichas modificaciones implica la aceptación de los nuevos términos.",
  },
  {
    title: "10. Contacto",
    content:
      "Para consultas, reclamos o solicitudes relacionadas con estos términos, podés contactarnos a través de nuestras redes sociales o al correo de ITEC UTN FRBA. También podés comunicarte con el equipo de desarrollo a través del repositorio oficial del proyecto.",
  },
];

export const TerminosPage: React.FC = () => {
  usePageTitle("Términos y Condiciones");
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <MainLayout>
      <PageHeader
        title="Términos y Condiciones"
        description="Leé con atención las condiciones de uso de la plataforma ITEC.BA antes de utilizarla."
        iconType="file-text"
        colorTheme="blue"
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-[#111820] border border-white/7 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="text-lg shrink-0">📌</div>
          <p className="text-sm text-[#9aa3b0] leading-relaxed">
            ITEC.BA es un proyecto estudiantil independiente, sin fines de lucro, creado por y para estudiantes de la UTN FRBA. Última actualización: <strong className="text-itec-text">Mayo 2025</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-[#111820] border border-white/7 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left"
              >
                <span className="text-sm font-medium text-itec-text">{s.title}</span>
                <span className={`text-[#5a6475] text-lg leading-none transition-transform shrink-0 ${expanded === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="h-px bg-white/5 mb-4" />
                  <p className="text-sm text-[#9aa3b0] leading-relaxed">{s.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
TERMINOS_EOF

echo "✅ TerminosPage creada."

# =============================================================================
# PASO 9: ACTUALIZAR App.tsx con las nuevas rutas
# =============================================================================
echo "🔀 Actualizando App.tsx con las nuevas rutas..."

cat > "$SRC/App.tsx" << 'APPTSX_EOF'
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { ProtectedRoute } from "@components/templates/ProtectedRoute";
import LoadingState from "@/components/ui/LoadingState";

// Carga Diferida (Code Splitting)
const RewardsPage       = lazy(() => import("@pages/RewardsPage").then(m => ({ default: m.RewardsPage })));
const CourseEditDetail  = lazy(() => import("@pages/CourseEditDetail").then(m => ({ default: m.CourseEditDetail })));
const HomePage          = lazy(() => import("@pages/HomePage").then(m => ({ default: m.HomePage })));
const CoursesPage       = lazy(() => import("@pages/CoursesPage").then(m => ({ default: m.CoursesPage })));
const CourseDetail      = lazy(() => import("@pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
const ResourcesPage     = lazy(() => import("@pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const FaqsPage          = lazy(() => import("@pages/FaqsPage").then(m => ({ default: m.FaqsPage })));
const GroupsPage        = lazy(() => import("@pages/GroupsPage").then(m => ({ default: m.GroupsPage })));
const AdmissionPage     = lazy(() => import("@pages/AdmissionPage").then(m => ({ default: m.AdmissionPage })));
const GradePage         = lazy(() => import("@pages/GradePage").then(m => ({ default: m.GradePage })));
const AboutPage         = lazy(() => import("@pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProfilePage       = lazy(() => import("@pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AdminPanel        = lazy(() => import("@pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ProgressPage      = lazy(() => import("@pages/ProgressPage").then(m => ({ default: m.ProgressPage })));
const ErrorPage         = lazy(() => import("@pages/ErrorPage").then(m => ({ default: m.ErrorPage })));
const LoginPage         = lazy(() => import("@pages/LoginPage").then(m => ({ default: m.LoginPage })));

// ── Páginas nuevas ──────────────────────────────────────────────────────────
const BuscaTECPage  = lazy(() => import("@pages/BuscaTECPage").then(m => ({ default: m.BuscaTECPage })));
const AulasPage     = lazy(() => import("@pages/AulasPage").then(m => ({ default: m.AulasPage })));
const GuiaTECPage   = lazy(() => import("@pages/GuiaTECPage").then(m => ({ default: m.GuiaTECPage })));
const CalendarioPage = lazy(() => import("@pages/CalendarioPage").then(m => ({ default: m.CalendarioPage })));
const PluginsPage   = lazy(() => import("@pages/PluginsPage").then(m => ({ default: m.PluginsPage })));
const TerminosPage  = lazy(() => import("@pages/TerminosPage").then(m => ({ default: m.TerminosPage })));

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/"           element={<HomePage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/cursos"     element={<CoursesPage />} />
            <Route path="/cursos/:id" element={<CourseDetail />} />
            <Route path="/faqs"       element={<FaqsPage />} />
            <Route path="/ingreso"    element={<AdmissionPage />} />
            <Route path="/grado"      element={<GradePage />} />
            <Route path="/nosotros"   element={<AboutPage />} />
            <Route path="/grupos"     element={<GroupsPage />} />

            {/* Nuevas páginas públicas */}
            <Route path="/buscatec"   element={<BuscaTECPage />} />
            <Route path="/aulas"      element={<AulasPage />} />
            <Route path="/guiatec"    element={<GuiaTECPage />} />
            <Route path="/calendario" element={<CalendarioPage />} />
            <Route path="/plugins"    element={<PluginsPage />} />
            <Route path="/terminos"   element={<TerminosPage />} />

            {/* RUTAS PRIVADAS */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cursos/editar/:id" element={<CourseEditDetail />} />
              <Route path="/beneficios"        element={<RewardsPage />} />
              <Route path="/recursos"          element={<ResourcesPage />} />
              <Route path="/progreso"          element={<ProgressPage />} />
              <Route path="/perfil"            element={<ProfilePage />} />
              <Route path="/perfil/:username"  element={<ProfilePage />} />
              <Route path="/admin"             element={<AdminPanel />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
APPTSX_EOF

echo "✅ App.tsx actualizado con las 6 nuevas rutas."
echo ""

# =============================================================================
# FIN
# =============================================================================
echo "╔══════════════════════════════════════════════════════╗"
echo "║            ✅  Cambios aplicados con éxito           ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Backup guardado en:                                ║"
echo "║  $BACKUP_DIR"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Archivos MODIFICADOS:                              ║"
echo "║  • src/App.tsx                                      ║"
echo "║  • src/components/molecules/BottomNavbar.tsx        ║"
echo "║                                                     ║"
echo "║  Archivos CREADOS:                                  ║"
echo "║  • src/pages/BuscaTECPage.tsx   → /buscatec         ║"
echo "║  • src/pages/AulasPage.tsx      → /aulas            ║"
echo "║  • src/pages/GuiaTECPage.tsx    → /guiatec          ║"
echo "║  • src/pages/CalendarioPage.tsx → /calendario       ║"
echo "║  • src/pages/PluginsPage.tsx    → /plugins          ║"
echo "║  • src/pages/TerminosPage.tsx   → /terminos         ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Para levantar el proyecto: npm run dev             ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
