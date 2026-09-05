import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuthStore } from './authStore';

interface PointsState {
  addPoints: (pointsToAdd: number, updateDatabase?: boolean) => Promise<void>;
}

export const usePointsStore = create<PointsState>(() => ({
  addPoints: async (pointsToAdd: number, updateDatabase: boolean = false) => {
    const authState = useAuthStore.getState();
    const currentUser = authState.user;

    if (!auth.currentUser || !currentUser) return;

    if (updateDatabase) {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, { points: increment(pointsToAdd) });
      } catch (error) {
        console.error("Error actualizando puntos en DB:", error);
      }
    }

    // Actualiza inyectando de vuelta a authStore
    authState.setUser({
      ...currentUser,
      points: (currentUser.points || 0) + pointsToAdd
    });
  }
}));
