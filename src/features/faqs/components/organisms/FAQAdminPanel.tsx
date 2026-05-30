import React, { useState, useEffect } from "react";
import { useFAQs } from "../../hooks/useFAQs";
import type { FAQ, AIContext } from "../../types/faqs";
import { LayoutModal } from "@/components/templates/LayoutModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "faqs" | "context";

const EMPTY_FAQ: Partial<FAQ> = {
  question: "",
  answer: "",
  keywords: [],
  category: "general",
  isActive: true,
};

// ── Estilos reutilizables ──────────────────────────────────────────────────
const inputCls =
  "w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/25 transition-colors placeholder:text-white/25";
const labelCls =
  "block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5";
const btnPrimary =
  "py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-40";
const btnSecondary =
  "py-2.5 px-4 rounded-xl text-xs font-bold bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors";

// ── Panel principal ────────────────────────────────────────────────────────
export const FAQAdminPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    faqs, aiContext, loading,
    load, loadContext,
    create, update, remove,
    updateContext, clearCache,
  } = useFAQs();

  const [tab, setTab]       = useState<Tab>("faqs");
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [form, setForm]     = useState<Partial<FAQ>>(EMPTY_FAQ);
  const [ctxForm, setCtxForm] = useState<Partial<AIContext & { aiCost: number }>>({});
  const [saving, setSaving] = useState(false);
  const [cacheMsg, setCacheMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) { load(); loadContext(); }
  }, [isOpen, load, loadContext]);

  useEffect(() => {
    if (aiContext) {
      setCtxForm({
        personality:          aiContext.personality,
        institutionalContext: aiContext.institutionalContext,
        rules:                aiContext.rules,
        aiCost:               aiContext.aiCost ?? 2,
      });
    }
  }, [aiContext]);

  if (!isOpen) return null;

  // ── FAQ CRUD ──────────────────────────────────────────────────────────────
  const startEdit  = (faq: FAQ) => { setEditing(faq); setForm(faq); };
  const cancelEdit = () => { setEditing(null); setForm(EMPTY_FAQ); };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?._id) await update(editing._id, form);
      else await create(form);
      cancelEdit();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("¿Eliminar esta FAQ?")) return;
    await remove(id).catch((e: unknown) =>
      alert(e instanceof Error ? e.message : "Error al eliminar")
    );
  };

  // ── Contexto + config ─────────────────────────────────────────────────────
  const handleSaveContext = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContext(ctxForm);
      setCacheMsg("✅ Contexto guardado. Cache limpiado automáticamente.");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    setCacheMsg(null);
    try {
      await clearCache();
      setCacheMsg("✅ Cache del prompt limpiado. Los cambios aplican de inmediato.");
    } catch (err: unknown) {
      setCacheMsg("❌ " + (err instanceof Error ? err.message : "Error"));
    }
  };

  const filtered = faqs.filter(
    f =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  const TABS: { id: Tab; label: string }[] = [
    { id: "faqs",    label: `FAQs (${faqs.length})` },
    { id: "context", label: "Contexto IA" },
  ];

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Panel de FAQs" description="Gestión de preguntas frecuentes y contexto del asistente" maxWidth="max-w-3xl">
      {/* double_wrapper_fixed */}
      <div className="flex flex-col">

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 shrink-0 border-b border-white/5 pb-3">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  tab === t.id
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Contenido scrollable */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">

            {/* ── Tab: FAQs ─────────────────────────────────────────────── */}
            {tab === "faqs" && (
              <>
                {/* Formulario crear/editar */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">
                    {editing ? "Editar FAQ" : "Nueva FAQ"}
                  </h3>
                  <form onSubmit={handleSaveFAQ} className="space-y-3">
                    <div>
                      <label className={labelCls}>Pregunta *</label>
                      <input
                        required
                        className={inputCls}
                        placeholder="¿Cómo...?"
                        value={form.question ?? ""}
                        onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        Respuesta * <span className="normal-case text-white/25 font-normal">(soporta Markdown y LaTeX: $formula$)</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        className={`${inputCls} resize-y`}
                        placeholder="La respuesta... Podés usar **negrita**, $x^2$ para fórmulas, listas con - o 1. etc."
                        value={form.answer ?? ""}
                        onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Categoría</label>
                        <input
                          className={inputCls}
                          placeholder="general"
                          value={form.category ?? ""}
                          onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Keywords (coma)</label>
                        <input
                          className={inputCls}
                          placeholder="inscripcion, siu..."
                          value={(form.keywords ?? []).join(", ")}
                          onChange={e =>
                            setForm(p => ({
                              ...p,
                              keywords: e.target.value
                                .split(",")
                                .map(k => k.trim())
                                .filter(Boolean),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      {editing && (
                        <button type="button" onClick={cancelEdit} className={btnSecondary}>
                          Cancelar
                        </button>
                      )}
                      <button type="submit" disabled={saving} className={`flex-1 ${btnPrimary}`}>
                        {saving ? "Guardando..." : editing ? "Actualizar" : "Agregar FAQ"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Buscador */}
                <input
                  className={inputCls}
                  placeholder="Buscar FAQ..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />

                {/* Lista */}
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map(faq => (
                      <div
                        key={faq._id}
                        className="group bg-white/3 border border-white/8 rounded-xl p-4 flex items-start gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{faq.question}</p>
                          <p className="text-xs text-white/40 truncate mt-0.5">{faq.answer}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">
                              {faq.category}
                            </span>
                            <span className="text-[10px] text-white/30">
                              ↑ {faq.popularity ?? 0} consultas
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 flex-col">
                          <button
                            onClick={() => startEdit(faq)}
                            className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center hover:bg-blue-500/25 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteFAQ(faq._id)}
                            className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {filtered.length === 0 && (
                      <p className="text-center py-8 text-sm text-white/30">
                        {search ? "Sin resultados para esa búsqueda." : "No hay FAQs aún."}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ── Tab: Contexto IA + Config ──────────────────────────────── */}
            {tab === "context" && (
              <div className="space-y-5">
                <form onSubmit={handleSaveContext} className="space-y-4">
                  <div>
                    <label className={labelCls}>Personalidad del asistente</label>
                    <textarea
                      rows={3}
                      className={`${inputCls} resize-none`}
                      placeholder="Soy el asistente de ITEC BA..."
                      value={ctxForm.personality ?? ""}
                      onChange={e => setCtxForm(p => ({ ...p, personality: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Contexto institucional <span className="normal-case font-normal text-white/25">(soporta Markdown y LaTeX)</span>
                    </label>
                    <textarea
                      rows={5}
                      className={`${inputCls} resize-y`}
                      placeholder="UTN FRBA es la Facultad Regional Buenos Aires..."
                      value={ctxForm.institutionalContext ?? ""}
                      onChange={e => setCtxForm(p => ({ ...p, institutionalContext: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Reglas de comportamiento <span className="normal-case font-normal text-white/25">(una por línea)</span>
                    </label>
                    <textarea
                      rows={4}
                      className={`${inputCls} resize-none`}
                      placeholder={"Solo respondo sobre UTN FRBA...\nSé conciso y amable..."}
                      value={(ctxForm.rules ?? []).join("\n")}
                      onChange={e =>
                        setCtxForm(p => ({
                          ...p,
                          rules: e.target.value.split("\n").filter(Boolean),
                        }))
                      }
                    />
                  </div>

                  {/* Costo IA */}
                  <div>
                    <label className={labelCls}>
                      Costo por consulta IA avanzada (puntos)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        className={`${inputCls} w-24`}
                        value={ctxForm.aiCost ?? 2}
                        onChange={e =>
                          setCtxForm(p => ({ ...p, aiCost: Math.max(1, Number(e.target.value)) }))
                        }
                      />
                      <p className="text-xs text-white/40">
                        pts por consulta. Los cambios aplican al guardar.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full ${btnPrimary} py-3`}
                  >
                    {saving ? "Guardando..." : "Guardar contexto y configuración"}
                  </button>
                </form>

                {/* Limpiar cache manualmente */}
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <p className="text-xs text-white/40">
                    El cache del prompt se limpia automáticamente al guardar. Usá este botón si cambiaste datos externos (FAQs, calendario).
                  </p>
                  <button
                    onClick={handleClearCache}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/25 hover:bg-violet-500/25 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                    </svg>
                    Limpiar cache del prompt ahora
                  </button>
                  {cacheMsg && (
                    <p className={`text-xs px-3 py-2 rounded-xl ${
                      cacheMsg.startsWith("✅")
                        ? "bg-green-500/10 text-green-300"
                        : "bg-red-500/10 text-red-300"
                    }`}>
                      {cacheMsg}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
      </div>
    </LayoutModal>
  );
};
