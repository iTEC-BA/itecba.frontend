import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const ContentModeration: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminModeration"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [vRes, gRes, rRes] = await Promise.all([
        fetch(`${API}/courses/admin/broken-videos`, { headers }),
        fetch(`${API}/groups/reported`, { headers }),
        fetch(`${API}/resources/pending`, { headers })
      ]);

      return {
        videos: vRes.ok ? (await vRes.json()).broken || [] : [],
        groups: gRes.ok ? await gRes.json() : [],
        resources: rRes.ok ? await rRes.json() : []
      };
    }
  });

  const actionMutation = useMutation({
    mutationFn: async ({ url, method }: { url: string; method: string }) => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error en la operación");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminModeration"] })
  });

  const executeAction = (url: string, method: string, confirmMsg: string) => {
    if (window.confirm(confirmMsg)) {
      actionMutation.mutate({ url, method });
    }
  };

  if (isLoading) return <div className="animate-pulse p-10 text-center text-xs text-itec-muted">Cargando reportes...</div>;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted mb-1">Moderación</p>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Icons type="verified" className="w-5 h-5 text-itec-red" />
          Reportes y Pendientes
        </h2>
        <p className="text-xs text-itec-muted mt-1">Revisión de videos caídos, grupos inactivos y aportes de la comunidad.</p>
      </div>

      {/* Aportes Pendientes */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Aportes Pendientes ({data?.resources.length})</h3>
        <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-white/5 bg-itec-box">
          <table className="w-full min-w-[700px] text-left text-xs whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Título</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Materia</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Tipo</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-itec-muted">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.resources.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-itec-muted">Sin aportes pendientes.</td></tr>
              ) : data?.resources.map((r: any) => (
                <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white truncate max-w-[250px]">
                    <a href={r.link} target="_blank" rel="noreferrer" className="hover:underline text-itec-sky">{r.title}</a>
                  </td>
                  <td className="px-4 py-3 text-itec-muted truncate max-w-[200px]">{r.materia}</td>
                  <td className="px-4 py-3 text-itec-muted capitalize">{r.tipo}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="success" hierarchy="ghost" className="h-7 text-[10px]" onClick={() => executeAction(`${API}/resources/${r._id}/approve`, 'PUT', '¿Aprobar aporte?')} text="Aprobar" />
                      <Button variant="danger" hierarchy="ghost" className="h-7 text-[10px]" onClick={() => executeAction(`${API}/resources/${r._id}`, 'DELETE', '¿Rechazar aporte?')} text="Rechazar" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Videos Reportados */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Videos Reportados ({data?.videos.length})</h3>
        <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-white/5 bg-itec-box">
          <table className="w-full min-w-[700px] text-left text-xs whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Curso</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Video</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Reportes</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-itec-muted">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.videos.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-itec-muted">No hay videos reportados.</td></tr>
              ) : data?.videos.map((v: any) => (
                <tr key={v.video._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white truncate max-w-[200px]">{v.courseTitle}</td>
                  <td className="px-4 py-3 text-itec-muted truncate max-w-[200px]">{v.video.title}</td>
                  <td className="px-4 py-3 text-rose-400 font-bold">{v.video.reportCount} reportes</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="slate" hierarchy="ghost" className="h-7 text-[10px]" onClick={() => executeAction(`${API}/courses/${v.courseId}/videos/${v.video._id}/reports`, 'DELETE', '¿Descartar reportes?')} text="Descartar" />
                      <Button variant="danger" hierarchy="ghost" className="h-7 text-[10px]" onClick={() => executeAction(`${API}/courses/${v.courseId}/videos/${v.video._id}`, 'DELETE', '¿Borrar video?')} text="Borrar" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grupos Reportados */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Grupos Reportados ({data?.groups.length})</h3>
        <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-white/5 bg-itec-box">
          <table className="w-full min-w-[700px] text-left text-xs whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Materia</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Comisión</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Reportes</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-itec-muted">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.groups.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-itec-muted">No hay grupos reportados.</td></tr>
              ) : data?.groups.map((g: any) => (
                <tr key={g._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white truncate max-w-[250px]">{g.materia}</td>
                  <td className="px-4 py-3 text-itec-muted">{g.comision}</td>
                  <td className="px-4 py-3 text-rose-400 font-bold">{g.reportCount} reportes</td>
                  <td className="px-4 py-3 text-right">
                     <Button variant="danger" hierarchy="ghost" className="h-7 text-[10px]" onClick={() => executeAction(`${API}/groups/${g._id}`, 'DELETE', '¿Borrar grupo?')} text="Borrar Grupo" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
