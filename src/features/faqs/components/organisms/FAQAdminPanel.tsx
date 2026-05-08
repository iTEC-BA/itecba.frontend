import React, { useState, useEffect } from "react";
import { useFAQs } from "../../hooks/useFAQs";
import type { FAQ, AIContext } from "../../types/faqs";
import { LayoutModal } from "@/components/templates/LayoutModal";

interface Props { isOpen: boolean; onClose: () => void }

type Tab = "faqs" | "context";

const EMPTY_FAQ: Partial<FAQ> = { question: "", answer: "", keywords: [], category: "general", isActive: true };

export const FAQAdminPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { faqs, aiContext, loading, load, loadContext, create, update, remove, updateContext } = useFAQs();
  const [tab, setTab] = useState<Tab>("faqs");
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [form, setForm] = useState<Partial<FAQ>>(EMPTY_FAQ);
  const [ctxForm, setCtxForm] = useState<Partial<AIContext>>({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) { load(); loadContext(); }
  }, [isOpen, load, loadContext]);

  useEffect(() => {
    if (aiContext) setCtxForm({ personality: aiContext.personality, institutionalContext: aiContext.institutionalContext, rules: aiContext.rules });
  }, [aiContext]);

  if (!isOpen) return null;

  const startEdit = (faq: FAQ) => { setEditing(faq); setForm(faq); };
  const cancelEdit = () => { setEditing(null); setForm(EMPTY_FAQ); };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?._id) await update(editing._id, form);
      else await create(form);
      cancelEdit();
    } catch (err: unknown) { alert(err instanceof Error ? err.message : "Error al guardar la FAQ"); }
    finally { setSaving(false); }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("¿Eliminar esta FAQ?")) return;
    await remove(id).catch((e: unknown) => alert(e instanceof Error ? e.message : "Error al eliminar la FAQ"));
  };

  const handleSaveContext = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await updateContext(ctxForm); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : "Error al guardar el contexto"); }
    finally { setSaving(false); }
  };

  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/25 transition-colors placeholder:text-white/25";
  const labelCls = "block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5";

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Panel de FAQs">
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full sm:max-w-3xl bg-[#111113] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/6 shrink-0">
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Admin</p>
            <h2 className="text-base font-bold text-white mt-0.5">Panel de FAQs</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 shrink-0">
          {(["faqs", "context"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                tab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}>
              {t === "faqs" ? `FAQs (${faqs.length})` : "Contexto IA"}
            </button>
          ))}
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === "faqs" ? (
            <>
              {/* Formulario */}
              <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">{editing ? "Editar FAQ" : "Nueva FAQ"}</h3>
                <form onSubmit={handleSaveFAQ} className="space-y-3">
                  <div>
                    <label className={labelCls}>Pregunta *</label>
                    <input required className={inputCls} placeholder="¿Cómo...?" value={form.question ?? ""} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Respuesta *</label>
                    <textarea required rows={3} className={`${inputCls} resize-none`} placeholder="La respuesta..." value={form.answer ?? ""} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Categoría</label>
                      <input className={inputCls} placeholder="general" value={form.category ?? ""} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelCls}>Keywords (coma)</label>
                      <input className={inputCls} placeholder="inscripcion, siu..." value={(form.keywords ?? []).join(", ")}
                        onChange={e => setForm(p => ({ ...p, keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) }))} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {editing && <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-white/50 hover:text-white transition-colors">Cancelar</button>}
                    <button type="submit" disabled={saving} className="flex-1 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50">
                      {saving ? "Guardando..." : editing ? "Actualizar" : "Agregar FAQ"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Buscador */}
              <input className={`${inputCls} py-2!`} placeholder="Buscar FAQ..." value={search} onChange={e => setSearch(e.target.value)} />

              {/* Lista */}
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(faq => (
                    <div key={faq._id} className="group bg-white/3 border border-white/8 rounded-xl p-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{faq.question}</p>
                        <p className="text-xs text-white/40 truncate mt-0.5">{faq.answer}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">{faq.category}</span>
                          <span className="text-[10px] text-white/30">↑ {faq.popularity ?? 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => startEdit(faq)} className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center hover:bg-blue-500/25 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => handleDeleteFAQ(faq._id)} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <p className="text-center py-8 text-sm text-white/30">No hay FAQs.</p>}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSaveContext} className="space-y-4">
              <div>
                <label className={labelCls}>Personalidad del asistente</label>
                <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Soy el asistente de ITEC BA..."
                  value={ctxForm.personality ?? ""} onChange={e => setCtxForm(p => ({ ...p, personality: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Contexto institucional</label>
                <textarea rows={5} className={`${inputCls} resize-none`} placeholder="UTN FRBA es..."
                  value={ctxForm.institutionalContext ?? ""} onChange={e => setCtxForm(p => ({ ...p, institutionalContext: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Reglas (una por línea)</label>
                <textarea rows={4} className={`${inputCls} resize-none`} placeholder="Responde solo sobre temas de UTN..."
                  value={(ctxForm.rules ?? []).join("\n")} onChange={e => setCtxForm(p => ({ ...p, rules: e.target.value.split("\n").filter(Boolean) }))} />
              </div>
              <button type="submit" disabled={saving} className="w-full py-3 rounded-2xl text-sm font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar contexto"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </LayoutModal>
  );
};
