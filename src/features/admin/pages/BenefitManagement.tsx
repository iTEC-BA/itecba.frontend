import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Search, Gift, Star, Ticket } from "lucide-react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { auth } from "@/lib/firebase";
import { adminService } from "../services/adminService";
import { PointsActivityManager } from "@features/points/components/PointsActivityManager";
import type { Benefit, BenefitFormData, BenefitCategory } from "@features/benefits/types/benefits";
import { isFreeBenefit, CATEGORY_CONFIG } from "@features/benefits/types/benefits";
import { useToast } from "@features/notifications/components/atoms/Toast";
import { cn } from "@/lib/utils";

const EMPTY: BenefitFormData = { title: "", description: "", discount: "", location: "", category: "medrano", img: "", icon: "gift", pointsCost: 0 };

export const BenefitManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<BenefitFormData>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: benefits = [], isLoading } = useQuery<Benefit[]>({
    queryKey: ["adminBenefits"],
    queryFn: async () => adminService.getAllBenefits(await auth.currentUser!.getIdToken()),
    staleTime: 1000 * 60 * 5,
  });

  const saveMutation = useMutation({
    mutationFn: async () => adminService.saveBenefit(form, editId, await auth.currentUser!.getIdToken()),
    onSuccess: () => {
      setIsModalOpen(false); setForm(EMPTY); setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["adminBenefits"] });
      toast.success(editId ? "Beneficio actualizado." : "Beneficio publicado (Push enviado).");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminService.deleteBenefit(id, await auth.currentUser!.getIdToken()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["adminBenefits"] }); toast.info("Beneficio desactivado."); }
  });

  const openModal = (b?: Benefit) => {
    if (b) {
      setEditId(b._id || b.id!);
      setForm({ title: b.title, description: b.description ?? "", discount: b.discount ?? "", location: b.location ?? "", category: b.category, img: b.img ?? "", icon: b.icon ?? "gift", pointsCost: b.pointsCost ?? 0 });
    } else {
      setEditId(null); setForm(EMPTY);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(EMPTY);
    setEditId(null);
  };

  const filtered = useMemo(() => benefits.filter((b) => b.title.toLowerCase().includes(search.toLowerCase())), [benefits, search]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-rewards mb-1">Catálogo General</p>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2"><Gift className="w-6 h-6 text-itec-rewards" /> Beneficios</h2>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 rounded-xl bg-itec-rewards/10 px-5 py-2.5 text-sm font-bold text-itec-rewards border border-itec-rewards/20 hover:bg-itec-rewards/20">
          <Plus className="h-4 w-4" /> Nuevo Beneficio
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input type="text" placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-white/30" />
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-white/10 bg-white/5">
          <table className="w-full min-w-175 text-left text-xs whitespace-nowrap">
            <thead className="bg-white/2 border-b border-white/10">
              <tr>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Ítem</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Costo</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Sede</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Estado</th>
                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-white/40">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center text-white/40">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-white/40">No se encontraron beneficios</td></tr>
              ) : (
                filtered.map((b) => {
                  const cat = CATEGORY_CONFIG[b.category] ?? CATEGORY_CONFIG.medrano;
                  const free = isFreeBenefit(b);
                  return (
                    <tr key={b._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-1.5">
                            {b.img ? <img src={b.img} alt="" className="h-full w-full object-contain" /> : <Gift className="h-4 w-4 text-white/40" />}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm truncate max-w-50">{b.title}</p>
                            {b.discount && <p className="text-[11px] font-bold text-itec-rewards mt-0.5">{b.discount}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {free ? <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-itec-emerald"><Ticket className="w-3 h-3" /> Gratis</span> : <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-itec-amber"><Star className="w-3 h-3" /> {b.pointsCost} pts</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest", cat.color)}>{cat.label}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {b.isActive ? <span className="text-itec-emerald font-bold uppercase text-[10px]">Activo</span> : <span className="text-white/30 font-bold uppercase text-[10px]">Inactivo</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openModal(b)} className="h-8 w-8 rounded-lg border border-white/10 bg-transparent text-white/60 hover:bg-white/10 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => { if(window.confirm("¿Desactivar beneficio?")) deleteMutation.mutate(b._id); }} className="h-8 w-8 rounded-lg border border-white/10 bg-transparent text-itec-red/60 hover:bg-itec-red/10 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Star className="w-4 h-4 text-itec-rewards" /> Sistema de Puntos Automático</h3>
        <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-white/10 bg-white/5 p-6 shadow-inner"><PointsActivityManager /></div>
      </div>

      <LayoutModal isOpen={isModalOpen} onClose={closeModal} title={editId ? "Editar Beneficio" : "Nuevo Beneficio"} maxWidth="max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold uppercase text-white/50">Título *</label><input required value={form.title} onChange={e => setForm((p) => ({ ...p, title: e.target.value }))} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold uppercase text-white/50">Sede *</label><select value={form.category} onChange={e => setForm((p) => ({ ...p, category: e.target.value as BenefitCategory }))} className="appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"><option value="medrano">Medrano</option><option value="campus">Campus</option><option value="digital">Digital</option></select></div>
            <div className="flex flex-col gap-1.5 sm:col-span-2"><label className="text-[10px] font-bold uppercase text-white/50">Descripción</label><textarea rows={2} value={form.description} onChange={e => setForm((p) => ({ ...p, description: e.target.value }))} className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold uppercase text-white/50">Descuento Promocional</label><input value={form.discount} onChange={e => setForm((p) => ({ ...p, discount: e.target.value }))} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-[10px] font-bold uppercase text-white/50">Costo (0 = Gratis)</label><input type="number" min={0} value={form.pointsCost} onChange={e => setForm((p) => ({ ...p, pointsCost: Number(e.target.value) }))} className="rounded-xl border border-itec-rewards/30 bg-itec-rewards/5 px-4 py-3 text-sm font-bold text-itec-rewards" /></div>
          </div>
          <div className="mt-8 flex gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={closeModal} className="w-1/3 rounded-xl bg-white/5 py-3 text-sm font-bold text-white border border-transparent">Cancelar</button>
            <button type="submit" disabled={saveMutation.isPending || !form.title.trim()} className="w-2/3 rounded-xl bg-itec-rewards py-3 text-sm font-bold text-black disabled:opacity-50">Guardar</button>
          </div>
        </form>
      </LayoutModal>
    </div>
  );
};
