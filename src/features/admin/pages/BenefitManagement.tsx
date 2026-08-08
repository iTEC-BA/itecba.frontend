import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Search, Gift, Star, Ticket, Tag, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { auth } from "@/lib/firebase";
import { adminService } from "../services/adminService";
import { PointsActivityManager } from "@features/points/components/PointsActivityManager";
import type { Benefit, BenefitFormData, BenefitCategory } from "@features/benefits/types/benefits";
import { isFreeBenefit, CATEGORY_CONFIG } from "@features/benefits/types/benefits";
import { useToast } from "@features/notifications/components/atoms/Toast";
import { cn } from "@/lib/utils";

const EMPTY: BenefitFormData = {
  title: "", description: "", discount: "", location: "", category: "medrano", img: "", icon: "gift", pointsCost: 0
};

const CATEGORIES: BenefitCategory[] = ["medrano", "campus", "digital"];

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
      setIsModalOpen(false);
      setForm(EMPTY);
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["adminBenefits"] });
      
      if (editId) {
        toast.success("Beneficio actualizado correctamente.");
      } else {
        toast.success("Beneficio creado. Se envió una notificación PUSH a los alumnos.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Ocurrió un error al guardar el beneficio.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminService.deleteBenefit(id, await auth.currentUser!.getIdToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBenefits"] });
      toast.info("Beneficio desactivado.");
    },
    onError: () => toast.error("Error al desactivar el beneficio.")
  });

  const openModal = (b?: Benefit) => {
    if (b) {
      setEditId(b._id || b.id!);
      setForm({
        title: b.title, description: b.description ?? "", discount: b.discount ?? "",
        location: b.location ?? "", category: b.category, img: b.img ?? "",
        icon: b.icon ?? "gift", pointsCost: b.pointsCost ?? 0,
      });
    } else {
      setEditId(null);
      setForm(EMPTY);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm(EMPTY);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return benefits;
    const q = search.toLowerCase();
    return benefits.filter((b) => b.title.toLowerCase().includes(q));
  }, [benefits, search]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      {/* ── Cabecera de la sección ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-rewards mb-1">Catálogo General</p>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-itec-rewards" /> Beneficios y Recompensas
          </h2>
          <p className="mt-1 text-xs text-white/50">
            Administrá descuentos y recompensas canjeables con puntos PDEP.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 rounded-xl bg-itec-rewards/10 px-5 py-2.5 text-sm font-bold text-itec-rewards transition-colors hover:bg-itec-rewards/20 border border-itec-rewards/20 shadow-[0_0_15px_rgba(240,177,0,0.15)]"
        >
          <Plus className="h-4 w-4" /> Nuevo Beneficio
        </button>
      </div>

      {/* ── Buscador y Lista ── */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/30"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Tag className="h-8 w-8 text-white/20" />
              <p className="text-sm font-bold text-white/60">No se encontraron beneficios</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Ítem</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Costo</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Sede</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Estado</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-white/40">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((b) => {
                  const cat = CATEGORY_CONFIG[b.category] ?? CATEGORY_CONFIG.medrano;
                  const free = isFreeBenefit(b);
                  
                  return (
                    <tr key={b._id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5">
                            {b.img ? <img src={b.img} alt="" className="h-full w-full object-contain" /> : <Gift className="h-5 w-5 text-white/40" />}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm truncate max-w-[200px]">{b.title}</p>
                            {b.discount && <p className="text-[11px] font-bold text-itec-rewards mt-0.5">{b.discount}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {free ? (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-itec-emerald/20 bg-itec-emerald/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-itec-emerald">
                            <Ticket className="w-3 h-3" /> Gratis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-itec-amber/20 bg-itec-amber/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-itec-amber">
                            <Star className="w-3 h-3" /> {b.pointsCost} pts
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest", cat.color)}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {b.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-itec-emerald">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                            <XCircle className="w-3.5 h-3.5" /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openModal(b)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-transparent text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Editar">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => { if(window.confirm("¿Desactivar beneficio?")) deleteMutation.mutate(b._id); }} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-transparent text-itec-red/60 transition-colors hover:bg-itec-red/10 hover:border-itec-red/20 hover:text-itec-red" aria-label="Desactivar">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Gestor de Puntos (En bloque inferior) ── */}
      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-itec-rewards" /> Sistema de Puntos Automático
        </h3>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner">
          <PointsActivityManager />
        </div>
      </div>

      {/* ── Modal de Formulario ── */}
      <LayoutModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editId ? "Editar Beneficio" : "Nuevo Beneficio"} 
        description="Completá los datos para publicar un beneficio o recompensa."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Título *</label>
              <input required value={form.title} onChange={e => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Ej: Burger King" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Sede / Categoría *</label>
              <div className="relative">
                <select value={form.category} onChange={e => setForm((p) => ({ ...p, category: e.target.value as BenefitCategory }))} className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30 cursor-pointer">
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-itec-bg">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Descripción</label>
              <textarea rows={2} value={form.description} onChange={e => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Detalles, términos y condiciones..." className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30 custom-scrollbar" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Descuento Promocional</label>
              <input value={form.discount} onChange={e => setForm((p) => ({ ...p, discount: e.target.value }))} placeholder="Ej: 20% OFF en efectivo" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Ubicación</label>
              <input value={form.location} onChange={e => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Ej: Medrano 951" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">URL del Logo (Opcional)</label>
              <input value={form.img} onChange={e => setForm((p) => ({ ...p, img: e.target.value }))} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-itec-rewards">Costo en Puntos (0 = Gratis)</label>
              <div className="relative">
                <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-rewards" />
                <input type="number" min={0} value={form.pointsCost} onChange={e => setForm((p) => ({ ...p, pointsCost: Number(e.target.value) }))} className="w-full rounded-xl border border-itec-rewards/30 bg-itec-rewards/5 pl-10 pr-4 py-3 text-sm font-bold text-itec-rewards outline-none transition-colors placeholder:text-white/30 focus:border-itec-rewards/60" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={closeModal} className="w-1/3 rounded-xl bg-white/5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 border border-transparent">
              Cancelar
            </button>
            <button type="submit" disabled={saveMutation.isPending || !form.title.trim()} className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-itec-rewards py-3 text-sm font-bold text-black transition-colors hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {saveMutation.isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : (editId ? "Guardar cambios" : "Publicar y notificar")}
            </button>
          </div>
        </form>
      </LayoutModal>
    </div>
  );
};