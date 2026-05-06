import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Icons } from '@components/ui/icons/Icons';
import { Reward, RedemptionPayload } from '../../types/rewards';

interface RedeemModalProps {
  reward: Reward;
  onClose: () => void;
  onConfirm: (payload: RedemptionPayload) => Promise<void>;
  isLoading: boolean;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({ reward, onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState<Partial<RedemptionPayload>>({
    rewardId: reward.id,
    contact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(formData as RedemptionPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Configurar Canje</h2>
          <button onClick={onClose} className="text-itec-text hover:text-white">
            <Icons type="close" className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#2a2a2a] p-4 rounded-lg mb-6 border border-itec-blue/30">
          <p className="text-sm text-gray-300">Vas a canjear <strong>{reward.title}</strong> por <span className="text-itec-blue font-bold">{reward.pointsCost} puntos</span>.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos específicos para llamadas / mentorías */}
          {reward.type === 'mentorship' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-itec-text mb-1">Fecha preferida</label>
                  <Input 
                    type="date" 
                    required 
                    fullWidth 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-itec-text mb-1">Hora preferida</label>
                  <Input 
                    type="time" 
                    required 
                    fullWidth 
                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-itec-text mb-1">Temas a tratar / Dudas específicas</label>
                <textarea 
                  className="w-full bg-[#0a0a0a] border border-[#262626] text-itec-text px-4 py-2 rounded-lg focus:outline-none focus:border-itec-blue"
                  rows={3}
                  required
                  placeholder="Ej: Ayuda con excepciones y manejo de errores, diagramas de arquitectura..."
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </>
          )}

          {/* Campo universal de contacto */}
          <div>
            <label className="block text-sm text-itec-text mb-1">
              {reward.type === 'group_access' ? 'Tu número de WhatsApp (con código de área)' : 'Email o Teléfono de contacto'}
            </label>
            <Input 
              type="text" 
              required 
              fullWidth 
              placeholder={reward.type === 'group_access' ? '+54 9 11...' : 'estudiante@itec.edu'}
              onChange={(e) => setFormData({...formData, contact: e.target.value})} 
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Confirmar Canje'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};