import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { usePageAccess } from "@features/pageAccess/context/PageAccessContext";
import { pageAccessService } from "@features/pageAccess/services/pageAccessService";
import type { PageAccessState } from "@features/pageAccess/types/pageAccess.types";
import { Icons } from "@components/ui/icons/Icons";

const KNOWN_PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Inicio" }, { path: "/foro", label: "Comunidad" }, { path: "/trueketec", label: "TruekeTEC" },
  { path: "/aulas", label: "Buscar aula" }, { path: "/cursos", label: "Cursos" }, { path: "/guiatec", label: "GuíaTEC" },
  { path: "/recursos", label: "BiblioTEC" }, { path: "/grupos", label: "Grupos" }, { path: "/faqs", label: "Preguntas Frecuentes" },
  { path: "/grado", label: "Plan de Estudios" }, { path: "/calendario", label: "Calendario académico" }, { path: "/plugins", label: "Plugins y apps" },
  { path: "/beneficios", label: "Recompensas" }, { path: "/progreso", label: "Seguidor de carrera" },
];

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button type="button" onClick={onChange} disabled={disabled} className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors disabled:opacity-40 ${checked ? "bg-itec-groups" : "bg-white/10"}`}>
    <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-3.5" : "translate-x-1"}`} />
  </button>
);

export const PageAccessManagement: React.FC = () => {
  const { getState, loading } = usePageAccess();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handlePatch = async (path: string, patch: Partial<PageAccessState>) => {
    setPendingPath(path);
    try {
      await pageAccessService.setPageState(path, patch);
    } catch (err) { alert("Error guardando el cambio."); } finally { setPendingPath(null); }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted mb-1">Control de plataforma</p>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2"><Icons type="lock" className="w-5 h-5" /> Páginas</h2>
        <p className="text-xs text-itec-muted mt-1">Activá, desactivá o marcá como "Próximamente" cualquier sección.</p>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-white/5 bg-itec-box">
        <table className="w-full min-w-[600px] text-xs text-left whitespace-nowrap">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Ruta</th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-itec-muted">Habilitada</th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-itec-muted">Próximamente</th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-itec-muted">Oculta (Sidebar)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {KNOWN_PAGES.map(({ path, label }) => {
              const state = getState(path);
              const isPending = pendingPath === path;
              return (
                <tr key={path} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{label}</span>
                      <span className="text-[9px] text-itec-muted font-mono bg-white/5 px-1.5 rounded">{path}</span>
                      {isPending && <Loader2 className="w-3 h-3 animate-spin text-itec-muted" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center"><ToggleSwitch checked={state.enabled} disabled={loading || isPending} onChange={() => handlePatch(path, { enabled: !state.enabled })} /></td>
                  <td className="px-4 py-3 text-center"><ToggleSwitch checked={state.comingSoon} disabled={loading || isPending} onChange={() => handlePatch(path, { comingSoon: !state.comingSoon })} /></td>
                  <td className="px-4 py-3 text-center"><ToggleSwitch checked={state.hidden} disabled={loading || isPending} onChange={() => handlePatch(path, { hidden: !state.hidden })} /></td>
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
