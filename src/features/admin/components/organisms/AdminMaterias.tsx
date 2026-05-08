import React, { useState, useEffect, useMemo } from "react";
import { materiasService, type MateriaRow } from "@features/groups/services/materiasService";
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from "@features/groups/types/groups";
import { Icons } from "@components/ui/icons/Icons";
import { Select } from "@components/ui/Select";
import { Input } from "@components/ui/Input";

export const AdminMaterias: React.FC = () => {
  const [materias, setMaterias]       = useState<MateriaRow[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [form, setForm]               = useState({ id: "", carrera: "sistemas", nivel: "1", materia: "" });
  const [isEditing, setIsEditing]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterias = async () => {
    try {
      const data = await materiasService.getMaterias();
      setMaterias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterias(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.materia.trim()) return;
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await materiasService.updateMateria(form.id, {
          carrera: form.carrera,
          nivel:   form.nivel,
          materia: form.materia,
        });
      } else {
        await materiasService.createMateria({
          carrera: form.carrera,
          nivel:   form.nivel,
          materia: form.materia,
        });
      }
      setForm({ id: "", carrera: "sistemas", nivel: "1", materia: "" });
      setIsEditing(false);
      await fetchMaterias();
    } catch {
      alert("Hubo un error al guardar. Revisá tus permisos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (m: MateriaRow) => {
    setForm({ id: m.id, carrera: m.carrera, nivel: m.nivel, materia: m.materia });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que querés eliminar esta materia? Esto podría afectar la búsqueda de grupos asociados."))
      return;
    try {
      await materiasService.deleteMateria(id);
      await fetchMaterias();
    } catch {
      alert("Error al eliminar la materia.");
    }
  };

  const filteredMaterias = useMemo(
    () =>
      materias.filter(
        (m) =>
          m.materia.toLowerCase().includes(search.toLowerCase()) ||
          m.carrera.toLowerCase().includes(search.toLowerCase())
      ),
    [materias, search]
  );

  const getCarreraLabel = (val: string) => CARRERAS_OPTIONS.find((c) => c.value === val)?.label ?? val;
  const getNivelLabel   = (val: string) => NIVEL_OPTIONS.find((n) => n.value === val)?.label ?? val;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">

      {/* ── Formulario Lateral ────────────────────────────────────────────── */}
      <div className="relative xl:col-span-1 overflow-hidden rounded-3xl border border-itec-border bg-itec-box p-6 h-fit sticky top-6 backdrop-blur-sm shadow-glass">
        {/* glow sutil */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-itec-emerald/5 blur-3xl" />

        <div className="relative z-10 mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted">
            {isEditing
              ? <Icons type="edit" className="h-4 w-4" />
              : <Icons type="plus" className="h-4 w-4" />
            }
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Académico</p>
            <h3 className="text-sm font-bold text-itec-text">{isEditing ? "Editar Materia" : "Nueva Materia"}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Carrera / Especialidad
            </label>
            <Select
              fullWidth
              options={CARRERAS_OPTIONS}
              value={form.carrera}
              onChange={(e) => setForm({ ...form, carrera: e.target.value })}
              className="text-sm py-2.5 bg-itec-bg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Nivel / Año
            </label>
            <Select
              fullWidth
              options={NIVEL_OPTIONS}
              value={form.nivel}
              onChange={(e) => setForm({ ...form, nivel: e.target.value })}
              className="text-sm py-2.5 bg-itec-bg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Nombre de la Materia
            </label>
            <Input
              fullWidth
              placeholder="Ej: Redes de Datos..."
              value={form.materia}
              onChange={(e) => setForm({ ...form, materia: e.target.value })}
              className="text-sm py-2.5 bg-itec-bg"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => { setIsEditing(false); setForm({ id: "", carrera: "sistemas", nivel: "1", materia: "" }); }}
                className="w-1/3 rounded-2xl border border-itec-border bg-itec-surface/60 py-2.5 text-xs font-bold text-itec-muted transition-all hover:bg-itec-surface hover:text-itec-text active:scale-95"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !form.materia.trim()}
              className={[
                "flex-1 rounded-2xl py-2.5 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50",
                isEditing
                  ? "border border-itec-sky/30 bg-itec-sky/20 text-itec-sky hover:bg-itec-sky/30"
                  : "border border-itec-emerald/30 bg-itec-emerald/20 text-itec-emerald hover:bg-itec-emerald/30",
              ].join(" ")}
            >
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Agregar Materia"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Tabla Central ─────────────────────────────────────────────────── */}
      <div className="xl:col-span-2 flex flex-col rounded-3xl border border-itec-border bg-itec-box h-[75vh] overflow-hidden">
        <div className="p-5 border-b border-itec-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Base de Datos</p>
            <h2 className="mt-1 text-sm font-bold text-itec-text">Materias registradas</h2>
            <p className="text-xs text-itec-muted">{materias.length} en total</p>
          </div>
          <div className="w-full sm:w-64">
            <Input
              fullWidth
              placeholder="Buscar por materia o carrera..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm py-2 bg-itec-bg"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-itec-sky" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-itec-border/50">
                  {["Materia", "Carrera", "Nivel", ""].map((h) => (
                    <th key={h} className="pb-3 px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-itec-border/30">
                {filteredMaterias.map((m) => (
                  <tr key={m.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="py-3 px-2 font-medium text-itec-text">{m.materia}</td>
                    <td className="py-3 px-2 text-itec-muted">{getCarreraLabel(m.carrera)}</td>
                    <td className="py-3 px-2 text-itec-muted">{getNivelLabel(m.nivel)}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleEdit(m)}
                          className="rounded-xl border border-itec-sky/20 bg-itec-sky/10 p-1.5 text-itec-sky transition-all hover:bg-itec-sky/20 active:scale-95"
                        >
                          <Icons type="edit" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="rounded-xl border border-itec-accent/20 bg-itec-accent/10 p-1.5 text-itec-accent transition-all hover:bg-itec-accent/20 active:scale-95"
                        >
                          <Icons type="trash" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMaterias.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-itec-muted">
                      No se encontraron materias.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
