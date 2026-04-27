// src/features/rewards/components/organisms/RewardsWidget.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useRewards } from '../../hooks/useRewards';
import { RewardCard } from '../molecules/RewardCard';
import { RedeemModal } from './RedeemModal';
import { Reward, RedemptionPayload } from '../../types/rewards';
import { Icons } from '@components/ui/Icons';
import { Button } from '@components/atoms/Button';

export const RewardsWidget: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { rewards, pointsBalance, isLoading, isRedeeming, handleRedeem } = useRewards();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const onConfirmRedeem = async (payload: RedemptionPayload) => {
    if (!selectedReward) return;
    const rewardId = (selectedReward as any)._id || selectedReward.id;
    
    const success = await handleRedeem(payload, rewardId, selectedReward.pointsCost);
    if (success) {
      setSelectedReward(null);
      alert("¡Canje realizado con éxito!"); // O tu Toast preferido
    }
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-[#252525] rounded-xl border border-[#333]"></div>;

  return (
    <section className="mb-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Icons type="star" className="w-6 h-6 text-yellow-500" /> 
              Beneficios Estudiantiles
            </h2>
            {isAdmin && (
              <Button 
                variant="secondary" 
                className="flex items-center gap-2 text-xs py-1.5 px-3 bg-[#1a1a1a] border border-[#333] hover:border-itec-blue transition-colors"
                onClick={() => navigate('/admin')}
              >
                <Icons type="plus" className="w-3 h-3" />
                Agregar beneficios
              </Button>
            )}
          </div>
          <p className="text-gray-400 text-sm">Intercambia tus puntos académicos por mentorías, descuentos y accesos exclusivos.</p>
        </div>

        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] border border-[#333] px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-itec-blue/20 flex items-center justify-center">
            <Icons type="lightning" className="w-4 h-4 text-itec-blue" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold leading-none mb-1">Mis Puntos</span>
            <span className="text-xl font-bold text-white leading-none">{pointsBalance}</span>
          </div>
        </div>

      </div>

      {rewards.length === 0 ? (
        <div className="text-center py-12 bg-[#252525] rounded-xl border border-[#333] border-dashed">
          <p className="text-gray-400">Próximamente habrán nuevos beneficios disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {rewards.map((reward: any) => {
            const uniqueId = reward._id || reward.id; // Resolver problema de Keys
            return (
              <RewardCard 
                key={uniqueId} 
                reward={{...reward, id: uniqueId}} // Pasar ID correcto al Card
                userPoints={pointsBalance}
                onSelect={setSelectedReward} 
              />
            );
          })}
        </div>
      )}

      {selectedReward && (
        <RedeemModal 
          reward={selectedReward} 
          isLoading={isRedeeming}
          onClose={() => setSelectedReward(null)} 
          onConfirm={onConfirmRedeem} 
        />
      )}
    </section>
  );
};