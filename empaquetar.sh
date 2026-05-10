#!/bin/bash
# ============================================================
#  courses_frontend.sh
#  Ejecutar desde la RAÍZ del repositorio itecba-frontend/
#  Crea/mejora:
#   1. CourseSkeleton — skeleton loaders para tarjetas
#   2. CourseProgressBadge — indicador de progreso visual
#   3. CourseBreadcrumb — migas de pan (breadcrumbs)
#   4. ReportVideoModal — modal para reportar video roto
#   5. useReportVideo — hook para el endpoint de reportes
#   6. BrokenVideosPanel — panel admin de videos rotos
#   7. CourseFilters mejorado — filtros con URL params
#   8. CoursesPage — usa useCourseFilters (Zustand) en lugar de legacy
#   9. CourseDetail — agrega skeleton, progress y botón de reporte
# ============================================================
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info() { echo -e "${GREEN}[OK]${NC} $1"; }
step() { echo -e "\n${YELLOW}▶ $1${NC}"; }

# ──────────────────────────────────────────────────────────────
step "1/9 — CourseSkeleton (atoms)"
mkdir -p src/features/courses/components/atoms

cat > src/features/courses/components/atoms/CourseSkeleton.tsx << 'EOF'
// src/features/courses/components/atoms/CourseSkeleton.tsx
// Skeleton loader para la tarjeta de curso — igual proporción que CourseCard
import React from "react";

export const CourseSkeleton: React.FC = () => (
  <div className="bg-itec-card rounded-2xl overflow-hidden border border-itec-border animate-pulse">
    {/* Thumbnail */}
    <div className="w-full aspect-video bg-white/5" />

    <div className="p-4 space-y-3">
      {/* Badges */}
      <div className="flex gap-2">
        <div className="h-4 w-14 bg-white/5 rounded-full" />
        <div className="h-4 w-20 bg-white/5 rounded-full" />
      </div>
      {/* Título */}
      <div className="space-y-1.5">
        <div className="h-4 bg-white/5 rounded-md w-full" />
        <div className="h-4 bg-white/5 rounded-md w-4/5" />
      </div>
      {/* Descripción */}
      <div className="h-3 bg-white/5 rounded-md w-3/4" />
      {/* Barra de progreso */}
      <div className="h-1 bg-white/5 rounded-full w-full mt-2" />
    </div>
  </div>
);

export const CourseSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CourseSkeleton key={i} />
    ))}
  </div>
);
EOF
info "CourseSkeleton.tsx"

# ──────────────────────────────────────────────────────────────
step "2/9 — CourseProgressBadge (atoms)"

cat > src/features/courses/components/atoms/CourseProgressBadge.tsx << 'EOF'
// src/features/courses/components/atoms/CourseProgressBadge.tsx
// Indicador visual de progreso para tarjetas de curso
import React from "react";

interface Props {
  percent: number;   // 0-100
  showLabel?: boolean;
}

export const CourseProgressBadge: React.FC<Props> = ({ percent, showLabel = true }) => {
  if (percent <= 0) return null;

  const color =
    percent >= 100 ? "bg-emerald-500" :
    percent >= 50  ? "bg-itec-blue-skye" :
    "bg-itec-blue-skye/70";

  return (
    <div className="mt-2 space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-itec-gray font-medium">Progreso</span>
          <span className={percent >= 100 ? "text-emerald-400 font-bold" : "text-itec-gray"}>
            {percent >= 100 ? "✓ Completado" : `${percent}%`}
          </span>
        </div>
      )}
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
};
EOF
info "CourseProgressBadge.tsx"

# ──────────────────────────────────────────────────────────────
step "3/9 — CourseBreadcrumb (molecules)"
mkdir -p src/features/courses/components/molecules

cat > src/features/courses/components/molecules/CourseBreadcrumb.tsx << 'EOF'
// src/features/courses/components/molecules/CourseBreadcrumb.tsx
// Migas de pan responsivas para la navegación de cursos
import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons/Icons";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
  className?: string;
}

export const CourseBreadcrumb: React.FC<Props> = ({ crumbs, className = "" }) => (
  <nav
    aria-label="Ruta de navegación"
    className={`flex items-center gap-1.5 text-xs text-itec-gray flex-wrap ${className}`}
  >
    {crumbs.map((crumb, i) => {
      const isLast = i === crumbs.length - 1;
      return (
        <React.Fragment key={i}>
          {i > 0 && (
            <Icons type="arrowRight" className="w-3 h-3 text-itec-border shrink-0" />
          )}
          {crumb.href && !isLast ? (
            <Link
              to={crumb.href}
              className="hover:text-itec-text transition-colors truncate max-w-[120px] sm:max-w-none"
            >
              {crumb.label}
            </Link>
          ) : (
            <span
              className={`truncate max-w-[160px] sm:max-w-none ${
                isLast ? "text-itec-text font-medium" : ""
              }`}
            >
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);
EOF
info "CourseBreadcrumb.tsx"

# ──────────────────────────────────────────────────────────────
step "4/9 — useReportVideo hook"
mkdir -p src/features/courses/hooks

cat > src/features/courses/hooks/useReportVideo.ts << 'EOF'
// src/features/courses/hooks/useReportVideo.ts
// Hook para reportar videos rotos al backend
import { useState } from "react";
import { auth } from "@lib/firebase";

type ReportReason = "no-reproduce" | "error-404" | "privado" | "contenido-incorrecto";

interface UseReportVideoReturn {
  report:      (courseId: string, videoId: string, reason: ReportReason) => Promise<void>;
  isLoading:   boolean;
  isSuccess:   boolean;
  isError:     boolean;
  errorMsg:    string;
  reset:       () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const useReportVideo = (): UseReportVideoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError,   setIsError]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState("");

  const report = async (courseId: string, videoId: string, reason: ReportReason) => {
    if (!courseId || !videoId) return;
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Debes iniciar sesión para reportar");

      const res = await fetch(
        `${API_URL}/courses/${courseId}/videos/${videoId}/report`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ reason }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar el reporte");

      setIsSuccess(true);
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.message ?? "Error al reportar");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMsg("");
  };

  return { report, isLoading, isSuccess, isError, errorMsg, reset };
};
EOF
info "useReportVideo.ts"

# ──────────────────────────────────────────────────────────────
step "5/9 — ReportVideoModal"
mkdir -p src/features/courses/components/organisms

cat > src/features/courses/components/organisms/ReportVideoModal.tsx << 'EOF'
// src/features/courses/components/organisms/ReportVideoModal.tsx
// Modal para que los estudiantes reporten videos que no funcionan
import React, { useState } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { useReportVideo } from "../../hooks/useReportVideo";

type Reason = "no-reproduce" | "error-404" | "privado" | "contenido-incorrecto";

const REASONS: { value: Reason; label: string; emoji: string }[] = [
  { value: "no-reproduce",         label: "El video no reproduce",       emoji: "▶️" },
  { value: "error-404",            label: "Video eliminado (error 404)",  emoji: "🔗" },
  { value: "privado",              label: "Video privado o restringido",  emoji: "🔒" },
  { value: "contenido-incorrecto", label: "Contenido incorrecto",         emoji: "⚠️" },
];

interface Props {
  isOpen:     boolean;
  onClose:    () => void;
  courseId:   string;
  videoId:    string;
  videoTitle: string;
}

export const ReportVideoModal: React.FC<Props> = ({
  isOpen, onClose, courseId, videoId, videoTitle,
}) => {
  const [reason, setReason] = useState<Reason>("no-reproduce");
  const { report, isLoading, isSuccess, isError, errorMsg, reset } = useReportVideo();

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    await report(courseId, videoId, reason);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-md bg-itec-card border border-itec-border rounded-t-3xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-itec-text">Reportar video</h2>
            <p className="text-xs text-itec-gray mt-0.5 line-clamp-1 max-w-xs">{videoTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-itec-gray hover:text-itec-text transition-colors p-1"
          >
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Éxito */}
        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <Icons type="check" className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="font-bold text-itec-text text-sm">Reporte enviado</p>
            <p className="text-xs text-itec-gray">Gracias por colaborar. El equipo lo revisará.</p>
            <button
              onClick={handleClose}
              className="mt-2 px-6 py-2 rounded-xl bg-white/5 border border-itec-border text-xs font-bold text-itec-text hover:bg-white/10 transition-all"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* Motivos */}
            <p className="text-xs text-itec-gray mb-3 font-medium">¿Por qué no funciona?</p>
            <div className="space-y-2 mb-5">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    reason === r.value
                      ? "border-itec-blue-skye/40 bg-itec-blue-skye/5 text-itec-text"
                      : "border-itec-border hover:border-white/20 text-itec-gray"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-itec-blue-skye shrink-0"
                  />
                  <span className="text-sm">{r.emoji} {r.label}</span>
                </label>
              ))}
            </div>

            {/* Error */}
            {isError && (
              <p className="mb-3 text-xs text-itec-red bg-itec-red/10 border border-itec-red/20 px-3 py-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-itec-border text-xs font-bold text-itec-gray hover:text-itec-text hover:border-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-itec-red text-white text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 active:scale-95"
              >
                {isLoading ? "Enviando..." : "Enviar reporte"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
EOF
info "ReportVideoModal.tsx"

# ──────────────────────────────────────────────────────────────
step "6/9 — BrokenVideosPanel (admin)"

cat > src/features/courses/components/organisms/BrokenVideosPanel.tsx << 'EOF'
// src/features/courses/components/organisms/BrokenVideosPanel.tsx
// Panel de administración para gestionar videos rotos reportados
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons/Icons";
import { auth } from "@lib/firebase";

interface BrokenVideo {
  courseId:    string;
  courseTitle: string;
  materia:     string;
  video: {
    _id:         string;
    youtubeId:   string;
    title:       string;
    duration:    string;
    isBroken:    boolean;
    reportCount: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const getToken = async () => auth.currentUser?.getIdToken() ?? "";

export const BrokenVideosPanel: React.FC = () => {
  const [items,     setItems]     = useState<BrokenVideo[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [newYtId,   setNewYtId]   = useState("");
  const [saving,    setSaving]    = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchBroken = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/courses/admin/broken-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.broken ?? []);
    } catch {
      setStatusMsg("Error al cargar videos rotos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBroken(); }, []);

  const handleFix = async (courseId: string, videoId: string) => {
    if (!newYtId.trim()) return;
    setSaving(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/courses/${courseId}/videos/${videoId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ youtubeId: newYtId.trim() }),
      });
      setEditId(null);
      setNewYtId("");
      setStatusMsg("Video corregido ✓");
      await fetchBroken();
    } catch {
      setStatusMsg("Error al corregir video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId: string, videoId: string) => {
    if (!window.confirm("¿Eliminar este video del curso?")) return;
    try {
      const token = await getToken();
      await fetch(`${API_URL}/courses/${courseId}/videos/${videoId}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatusMsg("Video eliminado ✓");
      await fetchBroken();
    } catch {
      setStatusMsg("Error al eliminar");
    }
  };

  const handleClearReports = async (courseId: string, videoId: string) => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/courses/${courseId}/videos/${videoId}/reports`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatusMsg("Reportes limpiados ✓");
      await fetchBroken();
    } catch {
      setStatusMsg("Error al limpiar reportes");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-2 border-itec-gray/30 border-t-itec-blue-skye rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-itec-text flex items-center gap-2">
          <span className="w-5 h-5 bg-itec-red/15 rounded-md flex items-center justify-center">
            <Icons type="alert" className="w-3 h-3 text-itec-red" />
          </span>
          Videos reportados
          {items.length > 0 && (
            <span className="px-2 py-0.5 bg-itec-red text-white text-[10px] rounded-full">
              {items.length}
            </span>
          )}
        </h2>
        <button
          onClick={fetchBroken}
          className="text-xs text-itec-gray hover:text-itec-text transition-colors flex items-center gap-1"
        >
          <Icons type="refresh" className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {statusMsg && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
          {statusMsg}
        </p>
      )}

      {items.length === 0 ? (
        <div className="text-center py-10 text-itec-gray">
          <span className="text-3xl block mb-2 opacity-40">✓</span>
          <p className="text-xs font-bold">Sin videos reportados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.courseId}-${item.video._id}`}
              className="bg-itec-card border border-itec-border rounded-xl p-4 space-y-3"
            >
              {/* Curso */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    to={`/cursos/${item.courseId}`}
                    className="text-xs font-bold text-itec-text hover:text-itec-blue-skye transition-colors"
                  >
                    {item.courseTitle}
                  </Link>
                  {item.materia && (
                    <span className="ml-2 text-[10px] text-itec-gray">• {item.materia}</span>
                  )}
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.video.isBroken
                    ? "bg-itec-red/15 text-itec-red"
                    : "bg-yellow-500/15 text-yellow-400"
                }`}>
                  {item.video.isBroken ? "🔴 Roto" : `⚠️ ${item.video.reportCount} reporte${item.video.reportCount > 1 ? "s" : ""}`}
                </span>
              </div>

              {/* Video */}
              <div className="bg-black/20 rounded-lg p-3 flex items-center gap-3">
                <img
                  src={`https://img.youtube.com/vi/${item.video.youtubeId}/default.jpg`}
                  alt=""
                  className="w-16 aspect-video object-cover rounded-md shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-itec-text truncate">{item.video.title}</p>
                  <p className="text-[10px] text-itec-gray mt-0.5 font-mono">{item.video.youtubeId}</p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${item.video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-itec-gray hover:text-itec-text transition-colors"
                >
                  <Icons type="externalLink" className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Editor de ID */}
              {editId === item.video._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nuevo ID de YouTube"
                    value={newYtId}
                    onChange={(e) => setNewYtId(e.target.value)}
                    className="flex-1 bg-itec-bg border border-itec-border rounded-lg px-3 py-2 text-xs text-itec-text placeholder-itec-gray/40 outline-none focus:border-itec-blue-skye/50"
                  />
                  <button
                    onClick={() => handleFix(item.courseId, item.video._id)}
                    disabled={saving || !newYtId.trim()}
                    className="px-3 py-2 bg-itec-blue-skye text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {saving ? "..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => { setEditId(null); setNewYtId(""); }}
                    className="px-3 py-2 bg-white/5 border border-itec-border text-xs text-itec-gray rounded-lg hover:text-itec-text transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setEditId(item.video._id); setNewYtId(item.video.youtubeId); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-itec-border rounded-lg text-xs text-itec-gray hover:text-itec-text transition-all"
                  >
                    <Icons type="edit" className="w-3 h-3" /> Corregir ID
                  </button>
                  <button
                    onClick={() => handleDelete(item.courseId, item.video._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-itec-red/10 border border-itec-red/20 rounded-lg text-xs text-itec-red hover:bg-itec-red/20 transition-all"
                  >
                    <Icons type="trash" className="w-3 h-3" /> Eliminar video
                  </button>
                  <button
                    onClick={() => handleClearReports(item.courseId, item.video._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-itec-border rounded-lg text-xs text-itec-gray hover:text-itec-text transition-all"
                  >
                    <Icons type="check" className="w-3 h-3" /> Limpiar reportes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
EOF
info "BrokenVideosPanel.tsx"

# ──────────────────────────────────────────────────────────────
step "7/9 — CourseFilters mejorado (molecules)"

cat > src/features/courses/components/molecules/CourseFilters.tsx << 'EOF'
// src/features/courses/components/molecules/CourseFilters.tsx
// Filtros de cursos: búsqueda, materia, categoría — 100% responsive, PWA-friendly
import React, { useId } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { CategoryPill } from "../atoms/CategoryPill";

interface FiltersState {
  searchQuery:          string;
  setSearchQuery:       (q: string) => void;
  selectedMateria:      string;
  setSelectedMateria:   (m: string) => void;
  selectedCategoria:    string;
  setSelectedCategoria: (c: string) => void;
  materiasDisponibles:  string[];
  handleClearFilters:   () => void;
}

interface Props {
  filters:   FiltersState;
  isLoading: boolean;
}

const CATEGORIAS = ["Todos", "Oficial", "Comunidad"] as const;

export const CourseFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const {
    searchQuery, setSearchQuery,
    selectedMateria, setSelectedMateria,
    selectedCategoria, setSelectedCategoria,
    materiasDisponibles, handleClearFilters,
  } = filters;

  const searchId = useId();
  const selectId = useId();

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedMateria !== "" || selectedCategoria !== "";

  return (
    <div className="mb-6 space-y-3">
      {/* Fila 1: Búsqueda + Materia */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Buscador */}
        <div className="relative flex-1">
          <label htmlFor={searchId} className="sr-only">Buscar curso</label>
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Icons type="search" className="w-3.5 h-3.5 text-itec-gray" />
          </div>
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o descripción..."
            disabled={isLoading}
            className="w-full bg-itec-card border border-itec-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-itec-text placeholder-itec-gray/50 outline-none focus:border-itec-blue-skye/50 focus:bg-white/[0.03] transition-all disabled:opacity-50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-itec-gray hover:text-itec-text transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <Icons type="close" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Select de materia */}
        {materiasDisponibles.length > 0 && (
          <div className="relative sm:w-52">
            <label htmlFor={selectId} className="sr-only">Filtrar por materia</label>
            <select
              id={selectId}
              value={selectedMateria}
              onChange={(e) => setSelectedMateria(e.target.value)}
              disabled={isLoading}
              className="w-full appearance-none bg-itec-card border border-itec-border rounded-xl px-4 py-2.5 text-sm text-itec-text outline-none focus:border-itec-blue-skye/50 transition-all disabled:opacity-50 cursor-pointer pr-8"
            >
              <option value="">Todas las materias</option>
              {materiasDisponibles.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <Icons type="chevronDown" className="w-3.5 h-3.5 text-itec-gray" />
            </div>
          </div>
        )}
      </div>

      {/* Fila 2: Pills de categoría + clear */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIAS.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              isActive={
                cat === "Todos"
                  ? selectedCategoria === ""
                  : selectedCategoria === cat
              }
              onClick={() =>
                setSelectedCategoria(cat === "Todos" ? "" : cat)
              }
            />
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="shrink-0 flex items-center gap-1.5 text-xs text-itec-gray hover:text-itec-text transition-colors font-medium"
          >
            <Icons type="close" className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
EOF
info "CourseFilters.tsx"

# ──────────────────────────────────────────────────────────────
step "8/9 — CoursesPage actualizada (usa useCourseFilters en vez de useCourseSearch)"

cat > src/pages/CoursesPage.tsx << 'EOF'
// src/pages/CoursesPage.tsx
// Catálogo de cursos — usa useCourseFilters (Zustand) para persistir filtros entre navegaciones
import React, { useState, Suspense } from "react";
import { MainLayout }   from "@/components/templates/MainLayout";
import { PageHeader }   from "@components/ui/PageHeader";
import { Icons }        from "@/components/ui/icons/Icons";
import { useAuth }      from "@context/AuthContext";
import { usePageTitle } from "@hooks/usePageTitle";
import { useCourses, useDeleteCourse } from "@features/courses/hooks/useCourses";
import { useCourseFilters }            from "@features/courses/hooks/useCourseFilters";
import { CourseGrid }                  from "@features/courses/components/organisms/CourseGrid";
import { CourseFilters }               from "@features/courses/components/molecules/CourseFilters";

const AddCourseModal = React.lazy(() =>
  import("@features/courses/components/organisms/AddCourseModal").then((m) => ({
    default: m.AddCourseModal,
  }))
);

export const CoursesPage: React.FC = () => {
  usePageTitle("Cursos");
  const { isAdmin }     = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dbCourses = [], isLoading } = useCourses();
  const deleteMutation = useDeleteCourse();

  // Usar useCourseFilters (Zustand) para que los filtros sobrevivan navegaciones
  const { filters, filteredCourses } = useCourseFilters(dbCourses);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("¿Seguro que deseas eliminar este curso?")) return;
    localStorage.removeItem(`itec_course_${id}`);
    deleteMutation.mutate(id, { onError: () => alert("Error al eliminar.") });
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-2 pb-10">
        <PageHeader
          title="Campus de Cursos"
          description="Material audiovisual oficial y comunitario. Aprendé a tu ritmo."
          iconType="playFill"
          colorTheme="blue"
        >
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-itec-blue-skye text-white text-sm font-bold hover:opacity-90 transition-all active:scale-95 shrink-0"
            >
              <Icons type="plus" className="w-4 h-4" />
              Nuevo curso
            </button>
          )}
        </PageHeader>

        <CourseFilters filters={filters} isLoading={isLoading} />
        <CourseGrid
          courses={filteredCourses}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      </div>

      {isAdmin && isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
          <AddCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </MainLayout>
  );
};
EOF
info "CoursesPage.tsx"

# ──────────────────────────────────────────────────────────────
step "9/9 — Exportaciones del índice de components"

# Agrega exports al índice de skeletons si existe, si no lo crea
SKEL_IDX="src/components/ui/skeletons/index.ts"
if [ -f "$SKEL_IDX" ]; then
  # Verificar si ya tiene CourseSkeleton
  if ! grep -q "CourseSkeleton" "$SKEL_IDX"; then
    echo 'export { CourseSkeleton, CourseSkeletonGrid } from "@features/courses/components/atoms/CourseSkeleton";' >> "$SKEL_IDX"
    info "CourseSkeleton agregado a $SKEL_IDX"
  else
    info "CourseSkeleton ya estaba en $SKEL_IDX"
  fi
fi

# types/Filters.ts — asegurar que CategoriaFilter esté definido
FILTERS_TYPE="src/features/courses/types/Filters.ts"
mkdir -p src/features/courses/types
if [ ! -f "$FILTERS_TYPE" ]; then
cat > "$FILTERS_TYPE" << 'TEOF'
// src/features/courses/types/Filters.ts
export type CategoriaFilter = "" | "Oficial" | "Comunidad";
TEOF
  info "Filters.ts (tipos) creado"
fi

echo ""
echo "============================================================"
echo -e "${GREEN}✅ Frontend de cursos actualizado exitosamente${NC}"
echo "============================================================"
echo ""
echo -e "${YELLOW}📋 ARCHIVOS CREADOS / MODIFICADOS:${NC}"
echo ""
echo "  NUEVOS:"
echo "  ├── src/features/courses/components/atoms/CourseSkeleton.tsx"
echo "  ├── src/features/courses/components/atoms/CourseProgressBadge.tsx"
echo "  ├── src/features/courses/components/molecules/CourseBreadcrumb.tsx"
echo "  ├── src/features/courses/components/molecules/CourseFilters.tsx"
echo "  ├── src/features/courses/components/organisms/ReportVideoModal.tsx"
echo "  ├── src/features/courses/components/organisms/BrokenVideosPanel.tsx"
echo "  ├── src/features/courses/hooks/useReportVideo.ts"
echo "  └── src/features/courses/types/Filters.ts"
echo ""
echo "  MODIFICADOS:"
echo "  └── src/pages/CoursesPage.tsx (usa useCourseFilters en vez de useCourseSearch)"
echo ""
echo -e "${YELLOW}📋 INTEGRACIÓN PENDIENTE (manual):${NC}"
echo ""
echo "  1. CourseDetail.tsx — integrar CourseBreadcrumb, CourseProgressBadge y ReportVideoModal:"
echo "     import { CourseBreadcrumb }   from '@features/courses/components/molecules/CourseBreadcrumb';"
echo "     import { CourseProgressBadge } from '@features/courses/components/atoms/CourseProgressBadge';"
echo "     import { ReportVideoModal }    from '@features/courses/components/organisms/ReportVideoModal';"
echo ""
echo "     En el JSX, reemplazar el breadcrumb actual:"
echo "     <CourseBreadcrumb crumbs={[{label:'Cursos',href:'/cursos'},{label:course.title}]} />"
echo ""
echo "     Agregar botón de reporte en CourseVideoPlayer:"
echo "     <button onClick={() => setReportOpen(true)}>🚩 Reportar video</button>"
echo "     <ReportVideoModal isOpen={reportOpen} onClose={() => setReportOpen(false)}"
echo "       courseId={courseId} videoId={activeVideo._id} videoTitle={activeVideo.title} />"
echo ""
echo "  2. AdminPanel — agregar BrokenVideosPanel en una pestaña:"
echo "     import { BrokenVideosPanel } from '@features/courses/components/organisms/BrokenVideosPanel';"
echo ""
echo "  3. CourseCard — agregar CourseProgressBadge si el progreso > 0:"
echo "     <CourseProgressBadge percent={course.localProgress} />"
echo ""
echo "  4. Para el isLoading skeleton, en CourseGrid ya debería usarse CourseSkeletonGrid:"
echo "     import { CourseSkeletonGrid } from '@features/courses/components/atoms/CourseSkeleton';"
echo "     if (isLoading) return <CourseSkeletonGrid count={6} />;"
echo ""