import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Card } from "@components/atoms/Card";
import { adminRedemptionsService } from "../services/adminRedemptionsService";
import type { RedemptionRecord } from "@features/rewards/types/rewards";

// Tokens itec — sin colores crudos
type StatusInfo = { label: string; cls: string };

const getStatusInfo = (status: string): StatusInfo => {
  const map: Record<string, StatusInfo> = {
    pending:   { label: "Pendiente",  cls: "bg-itec-amber/10   text-itec-amber   border-itec-amber/20"   },
    completed: { label: "Completado", cls: "bg-itec-emerald/10 text-itec-emerald border-itec-emerald/20" },
    cancelled: { label: "Cancelado",  cls: "bg-itec-accent/10  text-itec-accent  border-itec-accent/20"  },
  };
  return map[status] ?? map.pending;
};

const getToken = async () => {
  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error("No autenticado");
  return token;
};

/* ── Modal de mensaje directo — usa LayoutModal global ───────────────────── */
interface MessageModalProps { email: string; uid: string; onClose: () => void }

const MessageModal: React.FC<MessageModalProps> = ({ email, uid, onClose }) => {
  const [form, setForm] = useState({ subject: "", content: "" });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return adminRedemptionsService.sendMessage(
        { userId: uid, userEmail: email, ...form },
        token
      );
    },
    onSuccess: onClose,
    onError: () => alert("Error al enviar el mensaje."),
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate();
  };

  return (
    <LayoutModal
      isOpen
      onClose={onClose}
      title="Mensaje directo"
      description={email}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSend} className="space-y-4 p-5">
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
            className="rounded-xl border border-itec-border bg-itec-surface/80 px-4 py-2.5 text-sm focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10"
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
          <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose} fullWidth text="Cancelar" />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={sendMutation.isPending}
            isLoading={sendMutation.isPending}
            text="Enviar aviso"
          />
        </div>
      </form>
    </LayoutModal>
  );
};

/* ── Componente principal — datos vía react-query ─────────────────────────── */
export const AdminRedemptions: React.FC = () => {
  const [contact, setContact] = useState<{ uid: string; email: string } | null>(null);
  const [search, setSearch]   = useState("");

  const { data: redemptions = [], isLoading } = useQuery<RedemptionRecord[]>({
    queryKey: ["adminRedemptions"],
    queryFn: async () => {
      const token = await getToken();
      const data = await adminRedemptionsService.getAllRedemptions(token);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5,
  });

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
            className="rounded-xl border border-itec-border bg-itec-surface/80 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Tabla */}
      <Card className="overflow-hidden !p-0 !rounded-xl bg-itec-box border-itec-border">
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
                  const st = getStatusInfo(red.status);
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
      </Card>

      {contact && (
        <MessageModal email={contact.email} uid={contact.uid} onClose={() => setContact(null)} />
      )}
    </div>
  );
};
