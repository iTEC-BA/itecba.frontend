import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@components/atoms/Card";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { auth } from "@/lib/firebase";
import { adminService } from "../services/adminService";

interface Benefit {
  _id: string;
  title: string;
  discount: string;
  location: string;
  category: string;
  isActive: boolean;
  logoUrl?: string;
}

type BenefitForm = Omit<Benefit, "_id" | "isActive">;

const EMPTY: BenefitForm = {
  title: "", discount: "", location: "", category: "medrano", logoUrl: "",
};

const FIELD_LABELS: Record<keyof BenefitForm, string> = {
  title:    "Título",
  discount: "Descuento",
  location: "Ubicación",
  logoUrl:  "URL del logo",
  category: "Categoría",
};

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No autenticado");
  return token;
};

export const BenefitsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [form,   setForm]   = useState<BenefitForm>(EMPTY);
  const [error,  setError]  = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: benefits = [], isLoading } = useQuery<Benefit[]>({
    queryKey: ["adminBenefits"],
    queryFn: async () => {
      const token = await getToken();
      return adminService.getAllBenefits(token);
    },
    staleTime: 1000 * 60 * 5,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return adminService.saveBenefit(form, editId, token);
    },
    onSuccess: () => {
      setForm(EMPTY);
      setEditId(null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["adminBenefits"] });
    },
    onError: (err: Error) => setError(err.message ?? "Error al guardar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return adminService.deleteBenefit(id, token);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBenefits"] }),
  });

  const save = () => {
    if (!form.title || !form.discount) {
      setError("Título y descuento son obligatorios.");
      return;
    }
    saveMutation.mutate();
  };

  const remove = (id: string) => {
    if (!window.confirm("¿Desactivar este beneficio?")) return;
    deleteMutation.mutate(id);
  };

  const startEdit = (b: Benefit) => {
    setEditId(b._id);
    setForm({
      title:    b.title,
      discount: b.discount,
      location: b.location,
      category: b.category,
      logoUrl:  b.logoUrl ?? "",
    });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY); setError(null); };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">TarjeTEC</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-itec-text">Descuentos y beneficios</h2>
        <p className="text-xs text-itec-muted">Administrá el catálogo desde la base de datos.</p>
      </div>

      {/* ── Formulario ─────────────────────────────────────────────────────── */}
      <Card className="p-6 border-itec-sky/20 shadow-[0_0_40px_-15px_rgba(56,189,248,0.3)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Formulario</p>
            <h3 className="mt-1 text-base font-bold text-itec-text">
              {editId ? "Editar beneficio" : "Nuevo beneficio"}
            </h3>
          </div>
          {editId && (
            <Button
              onClick={cancelEdit}
              variant="slate"
              hierarchy="outline"
              className="h-8 w-8 p-0 rounded-xl"
              icon={<Icons type="close" className="h-4 w-4" />}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["title", "discount", "location", "logoUrl"] as const).map((field) => (
            <label key={field} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
                {FIELD_LABELS[field]}
              </span>
              <input
                className="rounded-xl border border-itec-border bg-itec-surface/80 px-3 py-2.5 text-sm text-itec-text outline-none  transition-all placeholder:text-itec-muted/50 focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10"
                value={(form as Record<string, string>)[field]}
                placeholder={`Ej: ${field === "title" ? "Burger King" : field === "discount" ? "20% OFF" : field === "location" ? "Av. Corrientes 1234" : "https://..."}`}
                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
              />
            </label>
          ))}

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              {FIELD_LABELS.category}
            </span>
            <select
              className="appearance-none rounded-xl border border-itec-border bg-itec-surface/80 px-3 py-2.5 text-sm text-itec-text outline-none  transition-all focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {["medrano", "campus", "digital"].map((c) => (
                <option key={c} value={c} className="bg-itec-box">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p className="mt-3 rounded-xl border border-itec-accent/20 bg-itec-accent/10 px-3 py-2 text-xs text-itec-accent">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <Button
            onClick={save}
            disabled={saveMutation.isPending}
            isLoading={saveMutation.isPending}
            variant="primary"
            hierarchy="outline"
            className="rounded-xl px-5 py-2.5 text-xs"
            text={editId ? "Actualizar" : "Crear"}
          />
          {editId && (
            <Button
              onClick={cancelEdit}
              variant="slate"
              hierarchy="ghost"
              className="rounded-xl px-5 py-2.5 text-xs"
              text="Cancelar"
            />
          )}
        </div>
      </Card>

      {/* ── Listado ─────────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-itec-border px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Catálogo</p>
            <h3 className="mt-1 text-sm font-bold text-itec-text">Beneficios activos</h3>
          </div>
          <span className="rounded-full border border-itec-sky/20 bg-itec-sky/10 px-3 py-1 text-xs font-bold text-itec-sky">
            {benefits.filter((b) => b.isActive).length} activos
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-itec-surface/40" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-itec-border bg-itec-box/50">
                <tr>
                  {["Nombre", "Descuento", "Categoría", "Estado", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-itec-border/40">
                {benefits.map((b) => (
                  <tr
                    key={b._id}
                    className="group transition-colors hover:bg-itec-surface/30"
                  >
                    <td className="px-5 py-3 font-bold text-itec-text">{b.title}</td>
                    <td className="px-5 py-3 font-bold text-itec-sky">{b.discount}</td>
                    <td className="px-5 py-3 capitalize text-itec-muted">{b.category}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-xl border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          b.isActive
                            ? "border-itec-emerald/20 bg-itec-emerald/10 text-itec-emerald"
                            : "border-itec-border bg-itec-surface/50 text-itec-muted"
                        }`}
                      >
                        {b.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          onClick={() => startEdit(b)}
                          variant="primary"
                          hierarchy="outline"
                          className="p-1.5 rounded-xl"
                          icon={<Icons type="edit" className="h-3.5 w-3.5" />}
                          aria-label="Editar"
                        />
                        <Button
                          onClick={() => remove(b._id)}
                          variant="danger"
                          hierarchy="outline"
                          className="p-1.5 rounded-xl"
                          icon={<Icons type="trash" className="h-3.5 w-3.5" />}
                          aria-label="Desactivar"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
