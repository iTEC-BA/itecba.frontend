import React from 'react';
import { Button } from '@components/atoms/Button';
import { Icons } from '@components/ui/Icons';
import { Reward } from '../../types/rewards';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onSelect: (reward: Reward) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, userPoints, onSelect }) => {
  const canAfford = userPoints >= reward.pointsCost;
  const progressPercent = Math.min((userPoints / reward.pointsCost) * 100, 100);

  return (
    <div className="relative group bg-[#252525] rounded-xl border border-[#333] p-5 flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(2,42,94,0.3)] hover:border-itec-blue/50">
      
      {/* Brillo de fondo estético */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-itec-blue/10 blur-3xl rounded-full pointer-events-none group-hover:bg-itec-blue/20 transition-all duration-500" />

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg text-itec-blue shadow-inner flex items-center justify-center">
          <Icons type={reward.icon} className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-white leading-tight">{reward.title}</h3>
      </div>
      
      <p className="text-sm text-gray-400 flex-grow mb-6 relative z-10">{reward.description}</p>
      
      <div className="mt-auto relative z-10 space-y-4">
        {/* Progress Bar visual de puntos */}
        <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${canAfford ? 'bg-green-500' : 'bg-itec-blue'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-none ${canAfford ? 'text-white' : 'text-gray-400'}`}>
              {reward.pointsCost} <span className="text-xs font-normal">pts</span>
            </span>
            {!canAfford && (
              <span className="text-[10px] text-gray-500 mt-1">Te faltan {reward.pointsCost - userPoints} pts</span>
            )}
          </div>

          <Button 
            variant={canAfford ? 'primary' : 'secondary'} 
            onClick={() => onSelect(reward)}
            disabled={!canAfford}
            className={canAfford ? 'shadow-[0_0_10px_rgba(2,42,94,0.4)]' : 'opacity-60 cursor-not-allowed'}
          >
            {canAfford ? 'Canjear' : 'Bloqueado'}
          </Button>
        </div>
      </div>
    </div>
  );
};