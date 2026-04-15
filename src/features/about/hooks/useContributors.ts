import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { User } from '@/context/AuthContext';

export const useContributors = () => {
  const [team, setTeam] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const snap = await getDocs(q);
        const adminsData = snap.docs.map(doc => doc.data() as User);
        
        setTeam(adminsData || []);
      } catch (error) {
        console.error("Error cargando la comunidad:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return { team, isLoading };
};