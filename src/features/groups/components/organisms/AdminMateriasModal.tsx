// src/features/groups/components/organisms/AdminMateriasModal.tsx
// Correcciones:
//  - "Nueva materia" abre un modal separado (MateriaFormModal) — ya no un
//    formulario inline que desaparecía o no se veía.
//  - Notificaciones via Toast (useToast).
//  - Botones de editar/eliminar siempre visibles en móvil.
//  - Componentizado: MateriaFormModal, MateriasToolbar, MateriaListItem.

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, BookOpen, Search } from "lucide-react";
import { PaginationBar } from "@components/ui/PaginationBar";
import { usePagination }  from "@hooks/usePagination";
import { useToast }       from "@features/notifications/components/atoms/Toast";
import { LayoutModal } from "@components/templates/LayoutModal";
import { materiasService, type MateriaRow } from "../../services/materiasService";
import { CARRERAS_OPTIONS, NIVEL_OPTIONS }   from "../../types/groups";

interface Props { isOpen: boolean; onClose: () => void }

const INPUT_CLS =
  "bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none focus:border-itec-groups/50 placeholder:text-itec-gray/60 transition-colors";
const SELECT_CLS =
  "bg-itec-bg border border-white/10 text-itec-text text-xs px-3 py-2 rounded-xl outline-none focus:border-itec-groups/50 cursor-pointer transition-colors";

// ── MateriaFormModal ──────────────────────────────────────────────────────────

interface MateriaFormValue { carrera: string; nivel: string; materia: string; codigo: string }
const EMPTY_FORM: MateriaFormValue = { carrera: "", nivel: "", materia: "", codigo: "" };

interface MateriaFormModalProps {
  editing:  MateriaRow | null;
  onClose:  () => void;
  onSaved:  () => void;
}

const MateriaFormModal: React.FC<MateriaFormModalProps> = ({ editing, onClose, onSaved }) => {
  const { toast } = useToast();
  const [form, setForm]     = useState<MateriaFormValue>(
    editing
      ? { carrera: editing.carrera, nivel: editing.nivel, materia: editing.materia, codigo: editing.codigo ?? "" }
      : EMPTY_FORM,
  );
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const field = <K extends keyof MateriaFormValue>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.carrera || !form.nivel || !form.materia.trim()) {
      setFormError("Carrera, nivel y nombre son obligatorios.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        carrera: form.carrera,
        nivel:   form.nivel,
        materia: form.materia.trim(),
        codigo:  form.codigo.trim() || undefined,
      };
      if (editing) {
        await materiasService.updateMateria(editing.id, payload);
        toast.success(`"${payload.materia}" actualizada`);
      } else {
        await materiasService.createMateria(payload);
        toast.success(`"${payload.materia}" agregada al catálogo`);
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al guardar.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={editing ? `Editando: ${editing?.materia}` : "Nueva materia"}
      description={editing ? "Modificá los campos que necesites." : "Se sumará al catálogo de materias."}
      maxWidth="max-w-md"
    >
      <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">Carrera *</span>
              <select className={SELECT_CLS} value={form.carrera} onChange={field("carrera")}>
                <option value="">Elegir...</option>
                {CARRERAS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">Nivel *</span>
              <select className={SELECT_CLS} value={form.nivel} onChange={field("nivel")}>
                <option value="">Elegir...</option>
                {NIVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">Nombre *</span>
            <input
              className={`${INPUT_CLS} text-sm py-2.5 w-full`}
              placeholder="Ej: Análisis Matemático I"
              value={form.materia}
              onChange={field("materia")}
              onKeyDown={(e) => e.key === "Enter" && !saving && handleSave()}
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">
              Código <span className="normal-case font-normal text-itec-gray/50">(opcional)</span>
            </span>
            <input
              className={`${INPUT_CLS} text-sm py-2.5 font-mono w-full`}
              placeholder="Ej: 950605"
              value={form.codigo}
              onChange={field("codigo")}
            />
          </label>
          {formError && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
              {formError}
            </p>
          )}
      </div>

      <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-itec-gray hover:text-itec-text bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-itec-groups hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-50 active:scale-95"
          >
            {saving ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando...</>
            ) : editing ? (
              <><Pencil className="size-3.5" />Guardar cambios</>
            ) : (
              <><Plus className="size-3.5" />Crear materia</>
            )}
          </button>
      </div>
    </LayoutModal>
  );
};

// ── MateriasToolbar ────────────────────────────────────────────────────────────

interface ToolbarProps {
  searchQ: string; filterCarrera: string; filterNivel: string;
  onSearch: (v: string) => void; onCarrera: (v: string) => void; onNivel: (v: string) => void;
  onNuevaMateria: () => void;
}
const MateriasToolbar: React.FC<ToolbarProps> = ({
  searchQ, filterCarrera, filterNivel,
  onSearch, onCarrera, onNivel, onNuevaMateria,
}) => (
  <div className="px-5 py-3 border-b border-white/6 shrink-0 flex flex-wrap gap-2 items-center">
    <div className="relative flex-1 min-w-40">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-itec-gray/50 pointer-events-none" />
      <input className={`${INPUT_CLS} w-full pl-8`} placeholder="Buscar por nombre o código..." value={searchQ} onChange={(e) => onSearch(e.target.value)} />
    </div>
    <select className={SELECT_CLS} value={filterCarrera} onChange={(e) => { onCarrera(e.target.value); onNivel(""); }}>
      <option value="">Todas las carreras</option>
      {CARRERAS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <select className={SELECT_CLS} value={filterNivel} onChange={(e) => onNivel(e.target.value)}>
      <option value="">Todos los niveles</option>
      {NIVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <button
      onClick={onNuevaMateria}
      className="flex items-center gap-1.5 px-4 py-2 bg-itec-groups hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap active:scale-95"
    >
      <Plus className="size-3.5" />Nueva materia
    </button>
  </div>
);

// ── MateriaListItem ────────────────────────────────────────────────────────────

interface MateriaListItemProps { materia: MateriaRow; onEdit: (m: MateriaRow) => void; onDelete: (m: MateriaRow) => void }
const MateriaListItem: React.FC<MateriaListItemProps> = ({ materia: m, onEdit, onDelete }) => (
  <div className="bg-itec-bg border border-white/7 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/12 transition-colors group">
    {m.codigo && (
      <span className="font-mono text-[11px] font-bold text-emerald-400 bg-itec-groups/10 px-2 py-0.5 rounded border border-itec-groups/20 shrink-0">
        {m.codigo}
      </span>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-itec-text truncate">{m.materia}</p>
      <p className="text-[11px] text-itec-gray">
        {CARRERAS_OPTIONS.find((o) => o.value === m.carrera)?.label ?? m.carrera}
        {" · "}
        {NIVEL_OPTIONS.find((o) => o.value === m.nivel)?.label ?? `Nivel ${m.nivel}`}
      </p>
    </div>
    <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
      <button onClick={() => onEdit(m)} title="Editar" className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/15 text-itec-gray hover:text-blue-400 transition-colors">
        <Pencil className="size-3.5" />
      </button>
      <button onClick={() => onDelete(m)} title="Eliminar" className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/15 text-itec-gray hover:text-red-400 transition-colors">
        <Trash2 className="size-3.5" />
      </button>
    </div>
  </div>
);

// ── AdminMateriasModal ─────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export const AdminMateriasModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [materias,      setMaterias]      = useState<MateriaRow[]>([]);
  const [isLoading,     setIsLoading]     = useState(false);
  const [loadError,     setLoadError]     = useState("");
  const [searchQ,       setSearchQ]       = useState("");
  const [filterCarrera, setFilterCarrera] = useState("");
  const [filterNivel,   setFilterNivel]   = useState("");
  const [formTarget,    setFormTarget]    = useState<MateriaRow | null | undefined>(null);
  const isFormOpen = formTarget !== null;

  const fetchMaterias = useCallback(async () => {
    setIsLoading(true); setLoadError("");
    try {
      const data = await materiasService.getMaterias(filterCarrera || undefined, filterNivel || undefined);
      setMaterias(data);
    } catch { setLoadError("Error al cargar materias."); }
    finally { setIsLoading(false); }
  }, [filterCarrera, filterNivel]);

  useEffect(() => { if (isOpen) fetchMaterias(); }, [isOpen, fetchMaterias]);

  useEffect(() => {
    if (!isOpen || isFormOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, isFormOpen, onClose]);

  const displayed = searchQ.trim()
    ? materias.filter((m) => {
        const q = searchQ.trim().toLowerCase();
        return m.materia.toLowerCase().includes(q) || (m.codigo ?? "").toLowerCase().includes(q);
      })
    : materias;

  const { paged, page, setPage, totalPages, reset: resetPage } = usePagination(displayed, PAGE_SIZE);
  useEffect(() => { resetPage(); }, [searchQ, filterCarrera, filterNivel, resetPage]);

  const handleDelete = async (m: MateriaRow) => {
    if (!window.confirm(`¿Eliminar "${m.materia}"? Esta acción no se puede deshacer.`)) return;
    try {
      await materiasService.deleteMateria(m.id);
      toast.success(`"${m.materia}" eliminada`);
      fetchMaterias();
    } catch { toast.error("No se pudo eliminar la materia."); }
  };

  if (!isOpen) return null;

  return (
    <>
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión de Materias"
      description="Crear, editar o eliminar materias del catálogo."
      maxWidth="max-w-5xl"
    >
      <MateriasToolbar
        searchQ={searchQ}
        filterCarrera={filterCarrera}
        filterNivel={filterNivel}
        onSearch={setSearchQ}
        onCarrera={setFilterCarrera}
        onNivel={setFilterNivel}
        onNuevaMateria={() => setFormTarget(undefined)}
      />
      <div className="flex-1 overflow-auto p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-6 h-6 border-2 border-itec-border border-t-itec-groups rounded-full animate-spin" />
                <p className="text-itec-gray text-sm">Cargando materias...</p>
              </div>
            ) : loadError ? (
              <p className="text-red-400 text-sm text-center py-10">{loadError}</p>
            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                <BookOpen className="size-8 text-itec-gray/30" />
                <p className="text-itec-gray text-sm">{searchQ ? "Sin resultados." : "No hay materias cargadas."}</p>
                {!searchQ && (
                  <button onClick={() => setFormTarget(undefined)} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                    + Agregar la primera materia
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                {paged.map((m) => (
                  <MateriaListItem key={m.id} materia={m} onEdit={(mat) => setFormTarget(mat)} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
      <div className="px-5 py-3 border-t border-white/6 shrink-0 flex items-center justify-between gap-4">
        <p className="text-[11px] text-itec-gray">{displayed.length} materia{displayed.length !== 1 ? "s" : ""} encontradas</p>
        <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
        <button onClick={onClose} className="text-xs font-semibold bg-itec-blue-skye hover:bg-itec-blue text-white px-5 py-2 rounded-xl transition-colors">
          Cerrar
        </button>
      </div>
    </LayoutModal>
    {isFormOpen && (
      <MateriaFormModal editing={formTarget ?? null} onClose={() => setFormTarget(null)} onSaved={fetchMaterias} />
    )}
    </>
  );
};
