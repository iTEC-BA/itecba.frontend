import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@components/atoms/Card";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { auth } from "@/lib/firebase";
import { adminService } from "../services/adminService";
import { PointsActivityManager } from "@features/points/components/PointsActivityManager";
import type { Benefit, BenefitFormData, BenefitCategory } from "@features/benefits/types/benefits";

const EMPTY: BenefitFormData = { title: "", description: "", discount: "", location: "", category: "medrano", pointsCost: 0, img: "", icon: "" };

export const BenefitsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BenefitFormData>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: benefits = [], isLoading } = useQuery<Benefit[]>({
    queryKey: ["adminBenefits"],
    queryFn: async () => adminService.getAllBenefits(await auth.currentUser!.getIdToken()),
  });

  const saveMutation = useMutation({
    mutationFn: async () => adminService.saveBenefit(form, editId, await auth.currentUser!.getIdToken()),
    onSuccess: () => { setForm(EMPTY); setEditId(null); queryClient.invalidateQueries({ queryKey: ["adminBenefits"] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminService.deleteBenefit(id, await auth.currentUser!.getIdToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBenefits"] }),
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Catálogo General</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-itec-text">Beneficios y Recompensas</h2>
        <p className="text-xs text-itec-muted">Administrá descuentos gratis y recompensas premium (con puntos).</p>
      </div>

      <Card className="p-6 border-itec-sky/20 shadow-none">
        <h3 className="mb-4 text-base font-bold text-itec-text">{editId ? "Editar ítem" : "Nuevo ítem del catálogo"}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5"><span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Título</span>
            <input className="rounded-xl border border-itec-border bg-itec-surface/80 px-3 py-2 text-sm outline-none focus:border-itec-sky/40" value={form.title} onChange={e => setForm((p: BenefitFormData) => ({...p, title: e.target.value}))} />
          </label>
          <label className="flex flex-col gap-1.5"><span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Descripción Corta / Descuento</span>
            <input className="rounded-xl border border-itec-border bg-itec-surface/80 px-3 py-2 text-sm outline-none focus:border-itec-sky/40" value={form.discount} onChange={e => setForm((p: BenefitFormData) => ({...p, discount: e.target.value}))} />
          </label>
          <label className="flex flex-col gap-1.5"><span className="text-[10px] font-bold uppercase tracking-widest text-itec-sky">Costo en Puntos (0 = Gratis)</span>
            <input type="number" className="rounded-xl border border-itec-sky/30 bg-itec-surface/80 px-3 py-2 text-sm outline-none focus:border-itec-sky font-bold text-itec-sky" value={form.pointsCost} onChange={e => setForm((p: BenefitFormData) => ({...p, pointsCost: Number(e.target.value)}))} />
          </label>
          <label className="flex flex-col gap-1.5"><span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Categoría</span>
            <select className="appearance-none rounded-xl border border-itec-border bg-itec-surface/80 px-3 py-2 text-sm outline-none" value={form.category} onChange={e => setForm((p: BenefitFormData) => ({...p, category: e.target.value as BenefitCategory}))}>
              <option value="medrano">Medrano</option><option value="campus">Campus</option><option value="digital">Digital</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <Button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending} variant="primary" hierarchy="outline" text={editId ? "Actualizar" : "Crear"} />
          {editId && <Button onClick={() => {setEditId(null); setForm(EMPTY);}} variant="slate" hierarchy="ghost" text="Cancelar" />}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-itec-border"><h3 className="text-sm font-bold">Ítems activos</h3></div>
        {isLoading ? <div className="p-5 text-center text-xs">Cargando...</div> : (
          <table className="w-full text-xs text-left">
            <thead className="bg-white/5 border-b border-itec-border">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Nombre</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Costo</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Categoría</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-border/50">
              {benefits.map((b: Benefit) => (
                <tr key={b._id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-bold">{b.title}</td>
                  <td className="px-5 py-3 font-bold text-itec-sky">{b.pointsCost > 0 ? `${b.pointsCost} pts` : "Gratis"}</td>
                  <td className="px-5 py-3 capitalize">{b.category}</td>
                  <td className="px-5 py-3">{b.isActive ? "Activo" : "Inactivo"}</td>
                  <td className="px-5 py-3 flex gap-2">
                    <Button onClick={() => { setEditId(b._id); setForm(b); }} variant="slate" hierarchy="ghost" text="Editar" className="h-7 px-2" />
                    <Button onClick={() => { if(window.confirm("Borrar?")) deleteMutation.mutate(b._id); }} variant="danger" hierarchy="ghost" text="Borrar" className="h-7 px-2" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card className="overflow-hidden mt-2 p-0">
        <div className="px-5 py-4 border-b border-itec-border flex items-center gap-2">
           <Icons type="star" className="w-4 h-4 text-itec-rewards" /><h3 className="text-sm font-bold">Sistema de Puntos</h3>
        </div>
        <div className="p-5"><PointsActivityManager /></div>
      </Card>
    </div>
  );
};
