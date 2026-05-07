import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { adminRedemptionsService } from "../../services/adminRedemptionsService";
import type { RedemptionRecord } from "@features/rewards/types/rewards";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Pendiente", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  completed: { label: "Completado", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
  cancelled: { label: "Cancelado", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const MessageModal: React.FC<{
  email: string;
  uid: string;
  onClose: () => void;
}> = ({ email, uid, onClose }) => {
  const [form, setForm] = useState({ subject: "", content: "" });
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) { setSending(false); return; }
    try {
      await adminRedemptionsService.sendMessage({ userId: uid, userEmail: email, ...form }, token);
      onClose();
    } catch {
      alert("Error al enviar el mensaje.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full sm:max-w-md bg-itec-card border border-white/8 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-itec-text/40 mb-0.5">Mensaje directo para</p>
            <p className="text-sm font-bold text-itec-text truncate max-w-xs">{email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-itec-text/60 transition-colors">
            <Icons type="close" className="size-4" />
          </button>
        </div>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-itec-text/40 uppercase tracking-wider mb-1.5">Asunto *</label>
            <Input type="text" required fullWidth placeholder="Ej: Tu canje fue aprobado" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-itec-text/40 uppercase tracking-wider mb-1.5">Mensaje *</label>
            <textarea
              required rows={5}
              placeholder="Escribí el aviso que recibirá el estudiante..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full bg-itec-bg border border-white/8 text-itec-text text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-itec-blue-skye transition-colors resize-none placeholder:text-itec-text/25"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} fullWidth className="h-10 rounded-xl text-sm font-bold">Cancelar</Button>
            <Button type="submit" variant="primary" fullWidth disabled={sending} className="h-10 rounded-xl text-sm font-bold">
              {sending ? "Enviando..." : "Enviar aviso"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminRedemptions: React.FC = () => {
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contact, setContact] = useState<{ uid: string; email: string } | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken();
        if (!token) return;
        const data = await adminRedemptionsService.getAllRedemptions(token);
        setRedemptions(Array.isArray(data) ? data : []);
      } catch { setRedemptions([]); }
      finally { setIsLoading(false); }
    })();
  }, []);

  const filtered = redemptions.filter(r =>
    r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
    r.rewardTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-itec-text flex items-center gap-2">
            <Icons type="star" className="size-4 text-itec-rewards" />
            Historial de canjes
          </h2>
          <p className="text-xs text-itec-text/40 mt-0.5">{redemptions.length} canjes registrados</p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Buscar por usuario o beneficio..."
            fullWidth
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-itec-card border border-white/5 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-itec-text/40 text-sm animate-pulse">Cargando historial...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-itec-text/40 text-sm">
            {search ? "Sin resultados para esa búsqueda." : "No hay canjes registrados."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-itec-text/40">Usuario</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-itec-text/40 hidden sm:table-cell">Beneficio</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-itec-text/40 hidden md:table-cell">Costo</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-itec-text/40 hidden lg:table-cell">Estado</th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-itec-text/40 hidden lg:table-cell">Fecha</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-itec-text/40">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {filtered.map(red => {
                  const st = STATUS_MAP[red.status] ?? STATUS_MAP.pending;
                  return (
                    <tr key={red._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3.5 text-itec-text/80 text-xs font-mono truncate max-w-[160px]">{red.userEmail}</td>
                      <td className="px-5 py-3.5 font-medium text-itec-text hidden sm:table-cell">{red.rewardTitle}</td>
                      <td className="px-5 py-3.5 font-bold text-itec-rewards hidden md:table-cell">{red.pointsCost} pts</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-3.5 text-itec-text/40 text-xs hidden lg:table-cell">
                        {new Date(red.createdAt).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="secondary"
                          onClick={() => setContact({ uid: red.userId, email: red.userEmail })}
                          className="text-xs h-7 px-3 rounded-lg"
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
