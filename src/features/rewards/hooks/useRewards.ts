import { useState, useEffect } from 'react';
import { rewardsService } from '../services/rewardsService';
import { Reward, RedemptionPayload } from '../types/rewards';
import { useAuth } from '@context/AuthContext'; 

export const useRewards = () => {
  const { user, addPoints } = useAuth(); // <-- Traemos addPoints del contexto
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointsBalance, setPointsBalance] = useState<number>(user?.points || 0); 
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    // Sincronizar estado local si los puntos globales cambian en otro lado
    setPointsBalance(user?.points || 0);
  }, [user?.points]);

  useEffect(() => {
    const fetchRewards = async () => {
      // Usamos getAuth().currentUser para el token en vez del user.token si no lo tienes en el tipo
      import('firebase/auth').then(({ getAuth }) => {
        const authUser = getAuth().currentUser;
        if (!authUser) return;
        authUser.getIdToken().then(async (token) => {
          try {
            const data = await rewardsService.getAvailableRewards(token);
            setRewards(data);
          } catch (error) {
            console.error("Error cargando beneficios", error);
          } finally {
            setIsLoading(false);
          }
        });
      });
    };
    fetchRewards();
  }, []);

  const handleRedeem = async (payload: RedemptionPayload, rewardId: string, cost: number) => {
    if (pointsBalance < cost) return false;
    
    setIsRedeeming(true);
    try {
      const { getAuth } = await import('firebase/auth');
      const authUser = getAuth().currentUser;
      if (!authUser) throw new Error("No autenticado");
      
      const token = await authUser.getIdToken();
      const response = await rewardsService.redeemReward(payload, rewardId, token);
      
      if (response.success) {
        // ACTUALIZAMOS EL ESTADO GLOBAL RESTANDO LOS PUNTOS
        // No llamamos a updateDoc de nuevo porque el Backend ya lo hizo.
        // Solo actualizamos la UI:
        addPoints(-cost); 
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en canje:", error);
      return false;
    } finally {
      setIsRedeeming(false);
    }
  };

  return { rewards, pointsBalance, isLoading, isRedeeming, handleRedeem };
};