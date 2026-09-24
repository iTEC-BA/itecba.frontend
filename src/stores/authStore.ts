// @\stores\authStore.ts
import { create } from 'zustand';
import { auth, db, googleProvider } from '../lib/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';

export type Role = 'admin' | 'student' | 'moderator' | 'ingresante' | 'afiliado' | 'profesor';

export interface User {
  id?: string;
  name: string;
  email: string;
  photoURL?: string;
  dni?: string;
  legajo?: string;
  specialty?: string;
  phone?: string;
  careers?: { code: string; name: string }[];
  bio?: string;
  github?: string;
  startYear?: number;
  role: Role;
  authorized: boolean;
  isExternalAuthorization?: boolean;
  points?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  canAccessAdminPanel: boolean;
  hasTarjetec: boolean;
  needsProfileCompletion: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || "";
const ROLES: Role[] = ['admin', 'student', 'moderator', 'ingresante', 'afiliado', 'profesor'];

const normalizeRole = (role: unknown): Role =>
  typeof role === 'string' && ROLES.includes(role as Role) ? role as Role : 'student';

const normalizeUser = (user: Record<string, unknown>, firebaseUser?: FirebaseUser): User => ({
  ...user,
  id: firebaseUser?.uid ?? (typeof user.id === 'string' ? user.id : undefined),
  name: firebaseUser?.displayName || (typeof user.name === 'string' ? user.name : 'Estudiante'),
  email: (firebaseUser?.email || (typeof user.email === 'string' ? user.email : '')).trim().toLowerCase(),
  photoURL: firebaseUser?.photoURL || (typeof user.photoURL === 'string' ? user.photoURL : ''),
  role: normalizeRole(user.role),
  authorized: user.authorized === true || user.authtorized === true,
});

const isAllowedEmail = (email: string | null | undefined) => {
  const normalizedEmail = email?.trim().toLowerCase();
  return Boolean(normalizedEmail?.endsWith('@frba.utn.edu.ar'));
};

const isSuperAdminEmail = (email: string | null | undefined) => {
  const normalizedEmail = email?.trim().toLowerCase();
  return Boolean(normalizedEmail && SUPER_ADMIN_EMAIL.trim().toLowerCase() === normalizedEmail);
};

const getAuthorizedUserData = async (email: string | null | undefined): Promise<Record<string, unknown> | null> => {
  try {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) return null;

    const authorizedQuery = query(
      collection(db, 'users_autorized'),
      where('email', '==', normalizedEmail),
      where('authorized', '==', true),
      limit(1),
    );
    const snapshot = await getDocs(authorizedQuery);
    console.log('[auth] Verificación de autorización completada:', normalizedEmail);
    return snapshot.docs[0]?.data() ?? null;
  } catch (error) {
    console.error('[auth] Error verificando autorización en Firestore:', error);
    return null;
  }
};

const isAuthorizedEmailInFirestore = async (email: string | null | undefined) =>
  Boolean(await getAuthorizedUserData(email));

const isAuthorizedEmail = async (email: string | null | undefined) =>
  isAllowedEmail(email) || isAuthorizedEmailInFirestore(email);

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  isAdmin: false,
  canAccessAdminPanel: false,
  hasTarjetec: false,
  needsProfileCompletion: false,

  setUser: (user) => {
    if (!user) {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        canAccessAdminPanel: false,
        hasTarjetec: false,
        needsProfileCompletion: false
      });
      return;
    }
    const isAdmin = user.role === 'admin';
    const canAccessAdminPanel = isAdmin || user.role === 'moderator';
    const hasCard = Boolean(user.dni && user.dni.trim() !== "");
    const needsProfile = !user.specialty || user.specialty.trim() === "";
    set({
        user,
        isAuthenticated: true,
        isAdmin,
        canAccessAdminPanel,
        hasTarjetec: hasCard,
        needsProfileCompletion: needsProfile
    });
  },

  setLoading: (loading) => set({ loading }),

  loginWithGoogle: async () => {
    try {
      console.log('[auth] Iniciando sesión con Google');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('[auth] Google autenticó la cuenta:', result.user.email);
      // La autorización se resuelve una sola vez en initAuthListener, que
      // también crea el perfil externo cuando corresponde.
    } catch (error: unknown) {
      console.error('[auth] Error en el inicio de sesión:', error);
      const errorCode = error instanceof Error && 'code' in error
        ? (error as { code?: string }).code
        : undefined;
      if (errorCode !== 'auth/popup-closed-by-user' && errorCode !== 'auth/cancelled-popup-request') {
        throw error;
      }
    }
  },

  logout: () => signOut(auth),

  updateProfile: async (data: Partial<User>) => {
    try {
      const currentUser = get().user;
      if (!auth.currentUser || !currentUser) {
        console.warn('[auth] No hay usuario autenticado para actualizar el perfil');
        return;
      }
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const updatedUser = normalizeUser({ ...currentUser, ...data }, auth.currentUser);
      await setDoc(docRef, updatedUser, { merge: true });
      get().setUser(updatedUser);
      console.log('[auth] Perfil actualizado:', auth.currentUser.uid);
    } catch (error) {
      console.error('[auth] Error actualizando el perfil:', error);
      throw error;
    }
  }
}));

export const initAuthListener = () => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    const store = useAuthStore.getState();
    if (firebaseUser) {
      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const user = normalizeUser(userData, firebaseUser);
          const hasTrustedRole = user.role === 'admin' || user.role === 'moderator';
          const isInstitutionalUser = isAllowedEmail(firebaseUser.email);

          if (!hasTrustedRole && !isInstitutionalUser && !(await isAuthorizedEmail(firebaseUser.email))) {
            await signOut(auth);
            store.setUser(null);
            return;
          }

          store.setUser(user);
        } else if (isAllowedEmail(firebaseUser.email) || isSuperAdminEmail(firebaseUser.email)) {
          const initialRole = isSuperAdminEmail(firebaseUser.email)
            ? 'admin'
            : 'student';
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Estudiante',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            role: initialRole,
            authorized: true,
            points: 0
          };
          await setDoc(docRef, newUser);
          store.setUser(newUser);
        } else {
          const authorizedData = await getAuthorizedUserData(firebaseUser.email);
          if (!authorizedData) {
            await signOut(auth);
            store.setUser(null);
            return;
          }

          const newUser = normalizeUser({
            ...authorizedData,
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'student',
            authorized: true,
            points: typeof authorizedData.points === 'number' ? authorizedData.points : 0,
          }, firebaseUser);
          await setDoc(docRef, newUser, { merge: true });
          store.setUser(newUser);
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
