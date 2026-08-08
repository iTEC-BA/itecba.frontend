import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Card } from "@components/atoms/Card";
import { adminRedemptionsService } from "../services/adminRedemptionsService";
import type { RedemptionRecord } from "@features/benefits/types/benefits";

const getStatusInfo = (status: string) => {
  const map: Record<string, {label:string; cls:string}> = {
    pending:   { label: "Pendiente",  cls: "bg-itec-amber/10 text-itec-amber border-itec-amber/20" },
    completed: { label: "Completado", cls: "bg-itec-emerald/10 text-itec-emerald border-itec-emerald/20" },
    cancelled: { label: "Cancelado",  cls: "bg-itec-accent/10 text-itec-accent border-itec-accent/20" },
  };
  return map[status] ?? map.pending;
};

const MessageModal: React.FC<{ email: string; uid: string; onClose: () => void }> = ({ email, uid, onClose }) => {
  const [form, setForm] = useState({ subject: "", content: "" });
  const sendMutation = useMutation({
    mutationFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      if(!token) throw new Error("No token");
      return adminRedemptionsService.sendMessage({ userId: uid, userEmail: email, ...form }, token);
    },
    onSuccess: onClose,
  });

  return (
    <LayoutModal isOpen onClose={onClose} title="Mensaje directo" description={email} maxWidth="max-w-md">
      <form onSubmit={(e) => { e.preventDefault(); sendMutation.mutate(); }} className="space-y-4 p-5">
        <Input required fullWidth placeholder="Asunto" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="rounded-xl border border-itec-border bg-itec-surface/80 px-4 py-2.5 text-sm" />
        <textarea required rows={5} placeholder="Escribí el aviso..." value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} className="w-full resize-none rounded-xl border border-itec-border bg-itec-surface/80 px-4 py-2.5 text-sm text-itec-text outline-none" />
        <div className="flex gap-3">
          <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose} fullWidth text="Cancelar" />
          <Button type="submit" variant="primary" fullWidth isLoading={sendMutation.isPending} text="Enviar aviso" />
        </div>
      </form>
    </LayoutModal>
  );
};

export const AdminRedemptions: React.FC = () => {
  const [contact, setContact] = useState<{ uid: string; email: string } | null>(null);
  const [search, setSearch]   = useState("");

  const { data: redemptions = [], isLoading } = useQuery<RedemptionRecord[]>({
    queryKey: ["adminRedemptions"],
    queryFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      return adminRedemptionsService.getAllRedemptions(token!);
    }
  });

  const filtered = redemptions.filter(r => r.userEmail.toLowerCase().includes(search.toLowerCase()) || r.benefitTitle?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2"><Icons type="ticket" className="w-4 h-4 text-itec-emerald" /> Historial de canjes</h2>
        </div>
        <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-64 bg-itec-surface border border-itec-border rounded-xl px-3 py-2 text-sm" />
      </div>

      <Card className="p-0 overflow-hidden bg-itec-box border-itec-border">
        {isLoading ? <div className="p-10 text-center text-sm">Cargando...</div> : (
          <table className="w-full text-sm text-left">
            <thead className="border-b border-itec-border bg-white/5">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Usuario</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Beneficio</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Costo</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-border/40">
              {filtered.map(red => {
                const st = getStatusInfo(red.status);
                return (
                  <tr key={red._id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-mono text-xs">{red.userEmail}</td>
                    <td className="px-5 py-3 font-medium">{red.benefitTitle}</td>
                    <td className="px-5 py-3 font-bold text-itec-rewards">{red.pointsCost} pts</td>
                    <td className="px-5 py-3"><span className={`border px-2 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${st.cls}`}>{st.label}</span></td>
                    <td className="px-5 py-3"><Button variant="slate" hierarchy="ghost" onClick={() => setContact({uid: red.userId, email: red.userEmail})} text="Contactar" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
      {contact && <MessageModal email={contact.email} uid={contact.uid} onClose={() => setContact(null)} />}
    </div>
  );
};
