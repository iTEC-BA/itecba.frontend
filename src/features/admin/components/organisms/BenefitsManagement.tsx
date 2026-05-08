import React, { useEffect, useState } from "react";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { auth } from "@/lib/firebase";

const BASE = import.meta.env.VITE_API_URL ?? "";

interface Benefit {
  _id: string; title: string; discount: string;
  location: string; category: string; isActive: boolean; logoUrl?: string;
}

type BenefitForm = Omit<Benefit, "_id" | "isActive">;

const EMPTY: BenefitForm = { title: "", discount: "", location: "", category: "medrano", logoUrl: "" };

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
    const res = await fetch(`${BASE}/benefits/all`, { headers: { Authorization: `Bearer ${t}` } });
    const data = await res.json();
    setBenefits(data.benefits ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.discount) { setError("Título y descuento son obligatorios."); return; }
    setSaving(true); setError(null);
    const t = await auth.currentUser?.getIdToken();
    const url    = editId ? `${BASE}/benefits/${editId}` : `${BASE}/benefits`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify(form),
    });
    if (!res.ok) { const e = await res.json(); setError(e.message ?? "Error"); setSaving(false); return; }
    setForm(EMPTY); setEditId(null); setSaving(false); load();
  };

  const remove = async (id: string) => {
    const t = await auth.currentUser?.getIdToken();
    await fetch(`${BASE}/benefits/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${t}` } });
    load();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-itec-text mb-1">Descuentos TarjeTEC</h2>
        <p className="text-xs text-itec-muted">Administrá el catálogo de beneficios desde la base de datos.</p>
      </div>

      {/* Formulario */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-itec-text mb-4">{editId ? "Editar Beneficio" : "Nuevo Beneficio"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["title", "discount", "location", "logoUrl"] as const).map((field) => (
            <label key={field} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-itec-muted uppercase tracking-widest">{field}</span>
              <input
                className="bg-itec-surface border border-itec-border text-itec-text text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-itec-sky/50"
                value={(form as any)[field]}
                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
              />
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-itec-muted uppercase tracking-widest">Categoría</span>
            <select
              className="bg-itec-surface border border-itec-border text-itec-text text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-itec-sky/50 appearance-none"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {["medrano", "campus", "digital"].map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </label>
        </div>
        {error && <p className="text-red-400 text-xs mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button
            onClick={save}
            disabled={saving}
            className="bg-itec-sky text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-itec-sky/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : editId ? "Actualizar" : "Crear"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(EMPTY); }} className="text-xs text-itec-muted hover:text-itec-text transition-colors">
              Cancelar
            </button>
          )}
        </div>
      </GlassCard>

      {/* Listado */}
      <GlassCard className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-itec-surface/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-itec-muted border-b border-itec-border">
                  {["Nombre", "Descuento", "Categoría", "Estado", ""].map((h) => (
                    <th key={h} className="text-left font-bold uppercase tracking-widest pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {benefits.map((b) => (
                  <tr key={b._id} className="border-b border-itec-border/50 hover:bg-itec-surface/30 transition-colors">
                    <td className="py-3 pr-4 font-bold text-itec-text">{b.title}</td>
                    <td className="py-3 pr-4 text-itec-sky font-bold">{b.discount}</td>
                    <td className="py-3 pr-4 capitalize text-itec-muted">{b.category}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold ${b.isActive ? "bg-itec-emerald/15 text-itec-emerald" : "bg-itec-muted/15 text-itec-muted"}`}>
                        {b.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 flex gap-2">
                      <button
                        onClick={() => { setEditId(b._id); setForm({ title: b.title, discount: b.discount, location: b.location, category: b.category, logoUrl: b.logoUrl ?? "" }); }}
                        className="text-itec-sky hover:underline font-bold"
                      >Editar</button>
                      <button onClick={() => remove(b._id)} className="text-itec-accent hover:underline font-bold">Desactivar</button>
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
