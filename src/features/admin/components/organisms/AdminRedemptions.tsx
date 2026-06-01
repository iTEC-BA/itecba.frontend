import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { adminRedemptionsService } from "../../services/adminRedemptionsService";
import type { RedemptionRecord } from "@features/rewards/types/rewards";

// Tokens itec — sin colores crudos
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Pendiente",  cls: "bg-itec-amber/10   text-itec-amber   border-itec-amber/20"   },
  completed: { label: "Completado", cls: "bg-itec-emerald/10 text-itec-emerald border-itec-emerald/20" },
  cancelled: { label: "Cancelado",  cls: "bg-itec-accent/10  text-itec-accent  border-itec-accent/20"  },
};

/* ── Modal de mensaje directo ─────────────────────────────────────────────── */
const MessageModal: React.FC<{ email: string; uid: string; onClose: () => void }> = ({
  email,
  uid,
  onClose,
}) => {
  const [form, setForm]       = useState({ subject: "", content: "" });
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) { setSending(false); return; }
    try {
      await adminRedemptionsService.sendMessage(
        { userId: uid, userEmail: email, ...form },
        token
      );
      onClose();
    } catch {
      alert("Error al enviar el mensaje.");
    } finally {
      setSending(false);
    }
  };

  return (
    /* Bottom-sheet en mobile, modal centrado en sm+ */
    <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full sm:max-w-md overflow-hidden rounded-t-4xl sm:rounded-xl border border-itec-border bg-itec-box p-6 shadow-glass">
        {/* glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-itec-sky/5 blur-3xl" />

        <div className="relative z-10 mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Mensaje directo para</p>
            <p className="mt-1 max-w-xs truncate text-sm font-bold text-itec-text">{email}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:bg-itec-box hover:text-itec-text active:scale-95"
          >
            <Icons type="close" className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="relative z-10 space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Asunto *
            </label>
            <Input
              type="text"
              required
              fullWidth
              placeholder="Ej: Tu canje fue aprobado"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Mensaje *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Escribí el aviso que recibirá el estudiante..."
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full resize-none rounded-xl border border-itec-border bg-itec-surface/80 px-4 py-2.5 text-sm text-itec-text outline-none transition-all placeholder:text-itec-muted/50 focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={sending}>
              {sending ? "Enviando..." : "Enviar aviso"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Componente principal ─────────────────────────────────────────────────── */
export const AdminRedemptions: React.FC = () => {
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [contact, setContact]         = useState<{ uid: string; email: string } | null>(null);
  const [search, setSearch]           = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken();
        if (!token) return;
        const data = await adminRedemptionsService.getAllRedemptions(token);
        setRedemptions(Array.isArray(data) ? data : []);
      } catch {
        setRedemptions([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = redemptions.filter(
    (r) =>
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.rewardTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Gestión</p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-bold tracking-tight text-itec-text">
            <Icons type="star" className="h-4 w-4 text-itec-rewards" />
            Historial de canjes
          </h2>
          <p className="text-xs text-itec-muted mt-0.5">{redemptions.length} canjes registrados</p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Buscar por usuario o beneficio..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-itec-border bg-itec-box">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-itec-muted animate-pulse">
            Cargando historial...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-itec-muted">
            {search ? "Sin resultados para esa búsqueda." : "No hay canjes registrados."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-itec-border">
                  {["Usuario", "Beneficio", "Costo", "Estado", "Fecha", ""].map((h) => (
                    <th
                      key={h}
                      className={[
                        "px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted text-left",
                        h === "Beneficio" ? "hidden sm:table-cell" :
                        h === "Costo"    ? "hidden md:table-cell" :
                        (h === "Estado" || h === "Fecha") ? "hidden lg:table-cell" : "",
                      ].join(" ")}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-itec-border/40">
                {filtered.map((red) => {
                  const st = STATUS_MAP[red.status] ?? STATUS_MAP.pending;
                  return (
                    <tr key={red._id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="max-w-[160px] truncate px-5 py-3.5 font-mono text-xs text-itec-muted">
                        {red.userEmail}
                      </td>
                      <td className="hidden px-5 py-3.5 font-medium text-itec-text sm:table-cell">
                        {red.rewardTitle}
                      </td>
                      <td className="hidden px-5 py-3.5 font-bold text-itec-rewards md:table-cell">
                        {red.pointsCost} pts
                      </td>
                      <td className="hidden px-5 py-3.5 lg:table-cell">
                        <span className={`inline-flex items-center rounded-xl border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3.5 text-xs text-itec-muted lg:table-cell">
                        {new Date(red.createdAt).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="slate"
                          hierarchy="ghost"
                          onClick={() => setContact({ uid: red.userId, email: red.userEmail })}
                          className="h-7 rounded-xl px-3 text-xs"
                          text="Contactar"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {contact && (
        <MessageModal email={contact.email} uid={contact.uid} onClose={() => setContact(null)} />
      )}
    </div>
  );
};
