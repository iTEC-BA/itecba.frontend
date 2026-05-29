import React, { useEffect, useState } from "react";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { Icons } from "@components/ui/icons/Icons";
import { auth } from "@/lib/firebase";

const BASE = import.meta.env.VITE_API_URL ?? "";

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

export const BenefitsManagement: React.FC = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState<BenefitForm>(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [editId,   setEditId]   = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const t = await auth.currentUser?.getIdToken();
    const res = await fetch(`${BASE}/benefits/all`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    const data = await res.json();
    setBenefits(data.benefits ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.discount) {
      setError("Título y descuento son obligatorios.");
      return;
    }
    setSaving(true);
    setError(null);
    const t      = await auth.currentUser?.getIdToken();
    const url    = editId ? `${BASE}/benefits/${editId}` : `${BASE}/benefits`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const e = await res.json();
      setError(e.message ?? "Error al guardar");
      setSaving(false);
      return;
    }
    setForm(EMPTY);
    setEditId(null);
    setSaving(false);
    load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("¿Desactivar este beneficio?")) return;
    const t = await auth.currentUser?.getIdToken();
    await fetch(`${BASE}/benefits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${t}` },
    });
    load();
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

  const cancelEdit = () => { setEditId(null); setForm(EMPTY); };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">TarjeTEC</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-itec-text">Descuentos y beneficios</h2>
        <p className="text-xs text-itec-muted">Administrá el catálogo desde la base de datos.</p>
      </div>

      {/* ── Formulario ─────────────────────────────────────────────────────── */}
      <GlassCard className="p-6" variant="elevated" glow="sky">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Formulario</p>
            <h3 className="mt-1 text-base font-bold text-itec-text">
              {editId ? "Editar beneficio" : "Nuevo beneficio"}
            </h3>
          </div>
          {editId && (
            <button
              onClick={cancelEdit}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:bg-itec-box hover:text-itec-text active:scale-95"
            >
              <Icons type="close" className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["title", "discount", "location", "logoUrl"] as const).map((field) => (
            <label key={field} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
                {FIELD_LABELS[field]}
              </span>
              <input
                className="rounded-2xl border border-itec-border bg-itec-surface/80 px-3 py-2.5 text-sm text-itec-text outline-none backdrop-blur-sm transition-all placeholder:text-itec-muted/50 focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10"
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
              className="appearance-none rounded-2xl border border-itec-border bg-itec-surface/80 px-3 py-2.5 text-sm text-itec-text outline-none backdrop-blur-sm transition-all focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10"
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
          <p className="mt-3 rounded-2xl border border-itec-accent/20 bg-itec-accent/10 px-3 py-2 text-xs text-itec-accent">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-2xl border border-itec-sky/30 bg-itec-sky/20 px-5 py-2.5 text-xs font-bold text-itec-sky transition-all hover:bg-itec-sky/30 active:scale-95 disabled:opacity-50"
          >
            {saving ? "Guardando..." : editId ? "Actualizar" : "Crear"}
          </button>
          {editId && (
            <button
              onClick={cancelEdit}
              className="rounded-2xl border border-itec-border bg-itec-surface/60 px-5 py-2.5 text-xs font-bold text-itec-muted transition-all hover:text-itec-text active:scale-95"
            >
              Cancelar
            </button>
          )}
        </div>
      </GlassCard>

      {/* ── Listado ─────────────────────────────────────────────────────────── */}
      <GlassCard className="overflow-hidden" variant="elevated">
        <div className="flex items-center justify-between gap-4 border-b border-itec-border px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Catálogo</p>
            <h3 className="mt-1 text-sm font-bold text-itec-text">Beneficios activos</h3>
          </div>
          <span className="rounded-full border border-itec-sky/20 bg-itec-sky/10 px-3 py-1 text-xs font-bold text-itec-sky">
            {benefits.filter((b) => b.isActive).length} activos
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-2xl bg-itec-surface/40" />
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
                        <button
                          onClick={() => startEdit(b)}
                          className="rounded-xl border border-itec-sky/20 bg-itec-sky/10 p-1.5 text-itec-sky transition-all hover:bg-itec-sky/20 active:scale-95"
                          aria-label="Editar"
                        >
                          <Icons type="edit" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(b._id)}
                          className="rounded-xl border border-itec-accent/20 bg-itec-accent/10 p-1.5 text-itec-accent transition-all hover:bg-itec-accent/20 active:scale-95"
                          aria-label="Desactivar"
                        >
                          <Icons type="trash" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
