import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Clock, Target, Pencil } from "lucide-react";
import { auth } from "@/lib/firebase";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Button } from "@components/ui/Button";
import { useToast } from "@features/notifications/components/atoms/Toast";
import { updateActivity } from "../services/points.service";
import type { PointActivity } from "../points.types";
import { cn } from "@/lib/utils";

export const PointsActivityManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<PointActivity | null>(null);
  
  const [form, setForm] = useState({
    points: 0,
    cooldownMinutes: 0,
    dailyCap: 0,
    isActive: true,
  });

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["adminPointsActivities"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/points/activities/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token || !editing?.id) throw new Error("Error de sesión o ID");
      return updateActivity(editing.id, form, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPointsActivities"] });
      toast.success("Regla de puntos actualizada.");
      setEditing(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al actualizar la regla.");
    }
  });

  const openEdit = (act: PointActivity) => {
    setEditing(act);
    setForm({
      points: act.points,
      cooldownMinutes: act.cooldownMinutes,
      dailyCap: act.dailyCap,
      isActive: act.isActive ?? true,
    });
  };

  if (isLoading) return <div className="animate-pulse h-20 bg-white/5 rounded-xl border border-white/10" />;

  return (
    <>
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="border-b border-white/10">
          <tr>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Actividad</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Puntos</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Espera (Min)</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Límite Diario</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Estado</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-white/40">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {activities.map((act: PointActivity) => (
            <tr key={act.id} className="hover:bg-white/2 transition-colors">
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
                  <span className="text-white/30 font-bold uppercase text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded">Inactivo</span>
                }
              </td>
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => openEdit(act)} 
                  className="h-8 w-8 rounded-lg border border-white/10 bg-transparent text-white/60 hover:bg-white/10 flex items-center justify-center ml-auto transition-colors"
                  title="Editar regla"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <LayoutModal 
          isOpen={!!editing} 
          onClose={() => setEditing(null)} 
          title="Editar Regla de Puntos" 
          description={`Modificando la actividad: ${editing.name}`}
          maxWidth="max-w-md"
        >
          <form 
            className="flex flex-col gap-5 p-6" 
            onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Puntos a otorgar</label>
                <input 
                  type="number" 
                  min={0}
                  value={form.points} 
                  onChange={e => setForm(f => ({ ...f, points: Number(e.target.value) }))} 
                  className="rounded-xl border border-itec-rewards/30 bg-itec-rewards/5 px-4 py-3 text-sm font-bold text-itec-rewards outline-none focus:border-itec-rewards/60" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Límite Diario</label>
                <input 
                  type="number" 
                  min={0}
                  value={form.dailyCap} 
                  onChange={e => setForm(f => ({ ...f, dailyCap: Number(e.target.value) }))} 
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30" 
                  placeholder="0 = Sin límite"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Tiempo de espera (Minutos)</label>
              <input 
                type="number" 
                min={0}
                value={form.cooldownMinutes} 
                onChange={e => setForm(f => ({ ...f, cooldownMinutes: Number(e.target.value) }))} 
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30" 
                placeholder="Ej: 60 (1 hora)"
              />
              <p className="text-[10px] text-white/30">Minutos obligatorios entre una recompensa y otra. 0 para desactivar.</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 mt-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Habilitar regla</span>
                <span className="text-[10px] text-white/40">Si se apaga, no dará puntos temporalmente.</span>
              </div>
              <button 
                type="button" 
                onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))} 
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors outline-none", 
                  form.isActive ? "bg-itec-emerald" : "bg-white/10"
                )}
              >
                <span className={cn(
                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform", 
                  form.isActive ? "translate-x-4" : "translate-x-1"
                )} />
              </button>
            </div>

            <div className="mt-4 flex gap-3 pt-2">
              <Button type="button" variant="slate" hierarchy="outline" onClick={() => setEditing(null)} text="Cancelar" fullWidth />
              <Button type="submit" variant="primary" hierarchy="solid" isLoading={mutation.isPending} text="Guardar cambios" fullWidth className="bg-itec-rewards text-black hover:bg-itec-rewards/90 border-transparent" />
            </div>
          </form>
        </LayoutModal>
      )}
    </>
  );
};
