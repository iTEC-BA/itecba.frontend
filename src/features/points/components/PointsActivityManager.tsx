import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Clock, Target, Pencil } from "lucide-react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Input } from "@components/ui/Input";
import { Button } from "@components/ui/Button";
import { useToast } from "@features/notifications/components/atoms/Toast";
import { getAdminActivities, updateActivity } from "../services/points.service";
import type { PointActivity } from "../points.types";

export const PointsActivityManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingAct, setEditingAct] = useState<PointActivity | null>(null);
  const [form, setForm] = useState({ points: 0, cooldownMinutes: 0, dailyCap: 0, isActive: true });

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["adminPointsActivities"],
    queryFn: getAdminActivities,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<PointActivity>) => updateActivity(editingAct!.key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPointsActivities"] });
      toast.success("Reglas actualizadas correctamente");
      setEditingAct(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "No se pudo actualizar la actividad");
    }
  });

  const handleEdit = (act: PointActivity) => {
    setEditingAct(act);
    setForm({ 
      points: act.points, 
      cooldownMinutes: act.cooldownMinutes, 
      dailyCap: act.dailyCap, 
      isActive: act.isActive ?? true
    });
  };

  if (isLoading) return <div className="animate-pulse h-20 bg-white/5 rounded-xl border border-itec-border/50" />;

  return (
    <>
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="border-b border-itec-border/50">
          <tr>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Actividad</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Puntos</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Cooldown</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Límite Diario</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Estado</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-white/40">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {activities.map((act) => (
            <tr key={act.key} className="hover:bg-white/2 transition-colors">
              <td className="px-4 py-3">
                <p className="font-bold text-white text-sm">{act.name}</p>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">{act.key}</p>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-itec-rewards bg-itec-rewards/10 px-2 py-0.5 rounded border border-itec-rewards/20">
                  <Star className="w-3 h-3" /> +{act.points}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-white/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{act.cooldownMinutes > 0 ? `${act.cooldownMinutes} min` : "Sin espera"}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-white/60">
                  <Target className="w-3.5 h-3.5" />
                  <span>{act.dailyCap > 0 ? `${act.dailyCap} max` : "Ilimitado"}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {act.isActive ? 
                  <span className="text-itec-emerald font-bold uppercase text-[10px] bg-itec-emerald/10 border border-itec-emerald/20 px-2 py-0.5 rounded">Activo</span> : 
                  <span className="text-white/30 font-bold uppercase text-[10px] bg-white/5 border border-itec-border/50 px-2 py-0.5 rounded">Inactivo</span>
                }
              </td>
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => handleEdit(act)} 
                  className="p-1.5 text-white/60 hover:text-itec-blue-skye hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <LayoutModal isOpen={!!editingAct} onClose={() => setEditingAct(null)} title="Editar Reglas de Puntos" description={editingAct?.name} maxWidth="max-w-md">
        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(form); }} className="p-6 flex flex-col gap-5">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest pl-1">Puntos a otorgar</label>
            <Input 
              type="number" min="0" required fullWidth
              value={form.points} 
              onChange={e => setForm({...form, points: Number(e.target.value)})} 
              className="bg-itec-box border-itec-border/50 focus:border-itec-blue-skye/50 py-2.5 rounded-xl font-mono text-itec-rewards font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest pl-1">Minutos de Cooldown (0 = Sin espera)</label>
            <Input 
              type="number" min="0" required fullWidth
              value={form.cooldownMinutes} 
              onChange={e => setForm({...form, cooldownMinutes: Number(e.target.value)})} 
              className="bg-itec-box border-itec-border/50 focus:border-itec-blue-skye/50 py-2.5 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest pl-1">Límite Diario (0 = Ilimitado)</label>
            <Input 
              type="number" min="0" required fullWidth
              value={form.dailyCap} 
              onChange={e => setForm({...form, dailyCap: Number(e.target.value)})} 
              className="bg-itec-box border-itec-border/50 focus:border-itec-blue-skye/50 py-2.5 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="sr-only peer" />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-itec-border/50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-itec-blue-skye"></div>
              <span className="ml-3 text-xs font-bold text-white uppercase tracking-widest">Actividad Habilitada</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-itec-border/50 mt-2">
            <Button type="button" variant="slate" hierarchy="ghost" onClick={() => setEditingAct(null)} fullWidth text="Cancelar" disabled={updateMutation.isPending} />
            <Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={updateMutation.isPending} text="Guardar Cambios" className="bg-itec-blue-skye hover:bg-itec-blue-skye/80 text-white border-transparent" />
          </div>

        </form>
      </LayoutModal>
    </>
  );
};
