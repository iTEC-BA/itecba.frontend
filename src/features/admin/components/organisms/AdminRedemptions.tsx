import React, { useState, useEffect } from 'react';
import { Button } from '@components/atoms/Button';
import { Icons } from '@components/ui/Icons';
import { getAuth } from 'firebase/auth';
import { adminRedemptionsService } from '../../services/adminRedemptionsService';
import { RedemptionRecord } from '@features/rewards/types/rewards';

export const AdminRedemptions: React.FC = () => {
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{uid: string, email: string} | null>(null);
  const [messageData, setMessageData] = useState({ subject: '', content: '' });

  useEffect(() => {
    const fetchRedemptions = async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken();
        if (token) {
          const data = await adminRedemptionsService.getAllRedemptions(token);
          if (Array.isArray(data)) {
            setRedemptions(data);
          } else {
            console.error("El backend no devolvió un arreglo de canjes:", data);
            setRedemptions([]);
          }
        }
      } catch (error) {
        console.error("Error al cargar el historial:", error);
        setRedemptions([]); // Previene el crash si el fetch lanza excepción
      } finally {
        setIsLoading(false);
      }
    };
    fetchRedemptions();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const token = await getAuth().currentUser?.getIdToken();
    if (token) {
      try {
        await adminRedemptionsService.sendMessage({
          userId: selectedUser.uid,
          userEmail: selectedUser.email,
          subject: messageData.subject,
          content: messageData.content
        }, token);
        setSelectedUser(null);
        setMessageData({ subject: '', content: '' });
        alert("Mensaje enviado y notificado por correo");
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        alert("Hubo un error al enviar el mensaje.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#333]">
          <h2 className="text-xl font-bold text-itec-textflex items-center gap-2">
            <Icons type="star" className="w-5 h-5 text-itec-blue" /> Historial de Canjes
          </h2>
        </div>
        
        {isLoading ? (
           <div className="p-8 text-center text-gray-500 animate-pulse">Cargando historial...</div> 
        ) : redemptions.length === 0 ? (
           <div className="p-8 text-center text-gray-500">No hay canjes registrados aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1a1a1a] text-xs uppercase font-semibold text-itec-text border-b border-[#333]">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Beneficio Canjeado</th>
                  <th className="px-6 py-4">Costo</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {redemptions.map((red) => (
                  <tr key={red._id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4">{red.userEmail}</td>
                    <td className="px-6 py-4 text-itec-textfont-medium">{red.rewardTitle}</td>
                    <td className="px-6 py-4 text-itec-blue">{red.pointsCost} pts</td>
                    <td className="px-6 py-4">{new Date(red.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Button variant="secondary" onClick={() => setSelectedUser({uid: red.userId, email: red.userEmail})} className="text-xs py-1">
                        Contactar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Mensaje Directo</h2>
              <button onClick={() => setSelectedUser(null)} className="text-itec-text hover:text-white">
                <Icons type="close" className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-itec-text mb-4">Para: <span className="text-itec-textfont-medium">{selectedUser.email}</span></p>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm text-itec-text mb-1">Asunto</label>
                <input required type="text" className="w-full bg-[#0a0a0a] border border-[#333] text-itec-textpx-4 py-2 rounded-lg focus:outline-none focus:border-itec-blue transition-colors"
                  value={messageData.subject} onChange={(e) => setMessageData({...messageData, subject: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-itec-text mb-1">Mensaje (Se enviará por Mail y Buzón)</label>
                <textarea required rows={5} className="w-full bg-[#0a0a0a] border border-[#333] text-itec-textpx-4 py-2 rounded-lg resize-none focus:outline-none focus:border-itec-blue transition-colors"
                  value={messageData.content} onChange={(e) => setMessageData({...messageData, content: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setSelectedUser(null)} fullWidth>Cancelar</Button>
                <Button type="submit" variant="primary" fullWidth>Enviar Aviso</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};