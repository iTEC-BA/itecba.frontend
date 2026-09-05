import { create } from 'zustand';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type Role = 'admin' | 'student' | 'moderator';

export interface User {
  id?: string;
  name: string;
  email: string;
  photoURL?: string;
  dni?: string;
  legajo?: string;
  specialty?: string;
  phone?: string;
  role: Role;
  points?: number;
}

interface AuthState {
  // ── Estado Puro ──
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  // ── Reglas de Negocio (Computed Values) ──
  isAdmin: boolean;
  hasTarjetec: boolean;
  needsProfileCompletion: boolean;

  // ── Acciones ──
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || "";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // Valores derivados por defecto
  isAdmin: false,
  hasTarjetec: false,
  needsProfileCompletion: false,

  setUser: (user) => {
    if (!user) {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        hasTarjetec: false,
        needsProfileCompletion: false
      });
      return;
    }

    // 🔥 REGLAS DE NEGOCIO GLOBALES 🔥
    const adminRole = user.role === 'admin' || user.role === 'moderator';
    const hasCard = Boolean(user.dni && user.dni.trim() !== "");
    const needsProfile = !user.specialty || user.specialty.trim() === "";

    set({ 
      user, 
      isAuthenticated: true, 
      isAdmin: adminRole,
      hasTarjetec: hasCard,
      needsProfileCompletion: needsProfile
    });
  },

  setLoading: (loading) => set({ loading }),

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user.email?.endsWith('@frba.utn.edu.ar')) {
        await signOut(auth);
        throw new Error('Solo se permiten correos institucionales de la UTN BA.');
      }
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert(error.message || 'Error al iniciar sesión.');
      }
    }
  },

  logout: () => signOut(auth),

  updateProfile: async (data: Partial<User>) => {
    const currentUser = get().user;
    if (!auth.currentUser || !currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, { ...currentUser, ...data }, { merge: true });
      get().setUser({ ...currentUser, ...data } as User);
    } catch (error) {
      console.error("Error guardando perfil:", error);
      throw error;
    }
  }
}));

// Listener puro que alimenta a Zustand (Se ejecuta una vez en App.tsx)
export const initAuthListener = () => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    const store = useAuthStore.getState();
    if (firebaseUser) {
      if (!firebaseUser.email?.endsWith('@frba.utn.edu.ar')) {
        await signOut(auth);
        store.setUser(null);
        store.setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          store.setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
        } else {
          const initialRole: Role = firebaseUser.email === SUPER_ADMIN_EMAIL ? 'admin' : 'student';
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Estudiante',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            role: initialRole,
            points: 0
          };

          await setDoc(docRef, newUser);
          store.setUser(newUser);
        }
      } catch (error) {
        console.error("Error validando usuario", error);
      } finally {
        store.setLoading(false);
      }
    } else {
      store.setUser(null);
      store.setLoading(false);
    }
  });
};
