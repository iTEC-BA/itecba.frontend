import { create } from 'zustand';
import { auth, db, googleProvider } from '../lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
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
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  hasTarjetec: boolean;
  needsProfileCompletion: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || "";

// Reutilizable para chequear al vuelo sin esperar al Listener
const checkInstitutionalOrException = async (firebaseUser: any) => {
  const isInstitutional = firebaseUser.email?.endsWith('@frba.utn.edu.ar');
  const docRef = doc(db, 'users', firebaseUser.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() && !isInstitutional) {
    await signOut(auth);
    throw new Error("Acceso denegado: Se requiere correo institucional (@frba.utn.edu.ar) o habilitación previa de un administrador.");
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  isAdmin: false,
  hasTarjetec: false,
  needsProfileCompletion: false,

  setUser: (user) => {
    if (!user) {
      set({ user: null, isAuthenticated: false, isAdmin: false, hasTarjetec: false, needsProfileCompletion: false });
      return;
    }
    const adminRole = user.role === 'admin' || user.role === 'moderator';
    const hasCard = Boolean(user.dni && user.dni.trim() !== "");
    const needsProfile = !user.specialty || user.specialty.trim() === "";
    set({ user, isAuthenticated: true, isAdmin: adminRole, hasTarjetec: hasCard, needsProfileCompletion: needsProfile });
  },

  setLoading: (loading) => set({ loading }),

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await checkInstitutionalOrException(result.user);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        throw error;
      }
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    await checkInstitutionalOrException(result.user);
  },

  registerWithEmail: async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    await updateFirebaseProfile(result.user, { displayName: name });
    await checkInstitutionalOrException(result.user);
  },

  logout: () => signOut(auth),

  updateProfile: async (data: Partial<User>) => {
    const currentUser = get().user;
    if (!auth.currentUser || !currentUser) return;
    const docRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(docRef, { ...currentUser, ...data }, { merge: true });
    get().setUser({ ...currentUser, ...data } as User);
  }
}));

export const initAuthListener = () => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    const store = useAuthStore.getState();
    if (firebaseUser) {
      try {
        const isInstitutional = firebaseUser.email?.endsWith('@frba.utn.edu.ar');
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          store.setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
        } else if (isInstitutional) {
          const initialRole = firebaseUser.email === SUPER_ADMIN_EMAIL ? 'admin' : 'student';
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
        } else {
          // No es institucional y no está habilitado por el admin -> Lo echamos silenciósamente
          await signOut(auth);
          store.setUser(null);
        }
      } catch (error) {
        console.error("Error validando usuario", error);
        store.setUser(null);
      } finally {
        store.setLoading(false);
      }
    } else {
      store.setUser(null);
      store.setLoading(false);
    }
  });
};
