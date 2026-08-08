// src/features/admin/pages/PageAccessManagement.tsx
//
// UI de administración: lista todas las páginas conocidas de la plataforma
// (definidas en KNOWN_PAGES) con su estado actual (leído en tiempo real desde
// el PageAccessContext) y permite: activar/desactivar, marcar "Próximamente",
// y ocultar/mostrar en el sidebar principal. Los cambios se escriben directo
// a Firestore — se reflejan en todos los clientes conectados al instante.
import React, { useState } from "react";
import { ShieldAlert, Clock, EyeOff, Eye, Loader2 } from "lucide-react";
import { usePageAccess } from "@features/pageAccess/context/PageAccessContext";
import { pageAccessService } from "@features/pageAccess/services/pageAccessService";
import type { PageAccessState } from "@features/pageAccess/types/pageAccess.types";

// Páginas gestionables desde este panel. Agregá acá cualquier ruta nueva que
// quieras poder activar/desactivar — no se auto-descubren desde App.tsx para
// evitar exponer rutas internas/privadas por error.
const KNOWN_PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Inicio" },
  { path: "/foro", label: "Comunidad" },
  { path: "/trueketec", label: "TruekeTEC" },
  { path: "/aulas", label: "Buscar aula" },
  { path: "/cursos", label: "Cursos" },
  { path: "/guiatec", label: "GuíaTEC" },
  { path: "/recursos", label: "BiblioTEC" },
  { path: "/grupos", label: "Grupos" },
  { path: "/faqs", label: "Preguntas Frecuentes" },
  { path: "/grado", label: "Plan de Estudios" },
  { path: "/calendario", label: "Calendario académico" },
  { path: "/plugins", label: "Plugins y apps" },
  { path: "/beneficios", label: "Recompensas" },
  { path: "/progreso", label: "Seguidor de carrera" },
];

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({
  checked,
  onChange,
  disabled,
}) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-40 ${
      checked ? "bg-itec-groups" : "bg-white/10"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-4.5" : "translate-x-1"
      }`}
    />
  </button>
);

export const PageAccessManagement: React.FC = () => {
  const { getState, loading } = usePageAccess();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handlePatch = async (path: string, patch: Partial<PageAccessState>) => {
    setPendingPath(path);
    try {
      await pageAccessService.setPageState(path, patch);
    } catch (err) {
      console.error("❌ Error actualizando estado de página:", err);
      alert("No se pudo guardar el cambio. Intentá de nuevo.");
    } finally {
      setPendingPath(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted mb-1">
          Control de plataforma
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-itec-text flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" />
          Páginas
        </h2>
        <p className="text-xs text-itec-muted mt-1 max-w-xl">
          Activá, desactivá o marcá como "Próximamente" cualquier sección de la plataforma.
          Los cambios se aplican en tiempo real para todos los usuarios. Los administradores
          siempre pueden ver el contenido real, esté o no habilitado.
        </p>
      </div>

      <div className="rounded-2xl border border-itec-border bg-itec-box overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-itec-border text-[10px] uppercase tracking-widest text-itec-muted">
              <th className="text-left font-bold px-4 py-3">Página</th>
              <th className="text-center font-bold px-3 py-3">Habilitada</th>
              <th className="text-center font-bold px-3 py-3">Próximamente</th>
              <th className="text-center font-bold px-3 py-3">Oculta en sidebar</th>
            </tr>
          </thead>
          <tbody>
            {KNOWN_PAGES.map(({ path, label }) => {
              const state = getState(path);
              const isPending = pendingPath === path;
              return (
                <tr key={path} className="border-b border-itec-border last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-itec-text">{label}</span>
                      <span className="text-[10px] text-itec-muted font-mono">{path}</span>
                      {isPending && <Loader2 className="w-3 h-3 animate-spin text-itec-muted" />}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center">
                      <ToggleSwitch
                        checked={state.enabled}
                        disabled={loading || isPending}
                        onChange={() => handlePatch(path, { enabled: !state.enabled })}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-itec-muted" />
                      <ToggleSwitch
                        checked={state.comingSoon}
                        disabled={loading || isPending}
                        onChange={() => handlePatch(path, { comingSoon: !state.comingSoon })}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center items-center gap-1.5">
                      {state.hidden ? (
                        <EyeOff className="w-3.5 h-3.5 text-itec-muted" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-itec-muted" />
                      )}
                      <ToggleSwitch
                        checked={state.hidden}
                        disabled={loading || isPending}
                        onChange={() => handlePatch(path, { hidden: !state.hidden })}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageAccessManagement;
