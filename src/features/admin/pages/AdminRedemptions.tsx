import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LayoutModal } from "@components/templates/LayoutModal";
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
    <div className="space-y-5 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Icons type="ticket" className="w-5 h-5 text-itec-emerald" /> Canjes</h2>
          <p className="text-xs text-itec-muted mt-1">Revisión de recompensas reclamadas por los usuarios.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Icons type="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
           <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all" />
        </div>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-white/5 bg-itec-box">
        <table className="w-full min-w-[600px] text-xs text-left whitespace-nowrap">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Usuario</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Beneficio</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Costo</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-itec-muted">Estado</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-itec-muted">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-itec-muted animate-pulse">Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-itec-muted">No hay canjes registrados.</td></tr>
            ) : (
              filtered.map(red => {
                const st = getStatusInfo(red.status);
                return (
                  <tr key={red._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-white">{red.userEmail}</td>
                    <td className="px-4 py-3 font-medium text-white truncate max-w-[200px]">{red.benefitTitle}</td>
                    <td className="px-4 py-3 font-bold text-itec-rewards">{red.pointsCost} pts</td>
                    <td className="px-4 py-3">
                      <span className={`border px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="slate" hierarchy="outline" onClick={() => setContact({uid: red.userId, email: red.userEmail})} text="Contactar" className="h-7 text-[10px]" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {contact && <MessageModal email={contact.email} uid={contact.uid} onClose={() => setContact(null)} />}
    </div>
  );
};
