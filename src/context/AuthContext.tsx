import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore'; // <-- Añadido increment y updateDoc

export type Role = 'admin' | 'student';

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
  points?: number; // <-- NUEVO: Sistema de puntos
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addPoints: (pointsToAdd: number) => Promise<void>; // <-- NUEVA FUNCIÓN
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAIL = 'jtumiricuellar@frba.utn.edu.ar';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.email?.endsWith('@frba.utn.edu.ar')) {
          await signOut(auth);
          setUser(null); setLoading(false); return;
        }

        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
          } else {
            const initialRole: Role = firebaseUser.email === SUPER_ADMIN_EMAIL ? 'admin' : 'student';
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Estudiante',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              role: initialRole,
              points: 0 // <-- Inicia con 0 puntos
            };
            
            await setDoc(docRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Error validando usuario", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
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
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, { ...user, ...data }, { merge: true });
      setUser((prev) => ({ ...prev, ...data }) as User);
    } catch (error) {
      console.error("Error guardando perfil:", error);
      throw error;
    }
  };

  // Función para sumar puntos en tiempo real
  const addPoints = async (pointsToAdd: number) => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { points: increment(pointsToAdd) }); // Suma en la base de datos
      setUser((prev) => prev ? { ...prev, points: (prev.points || 0) + pointsToAdd } : prev); // Suma en la pantalla
    } catch (error) {
      console.error("Error agregando puntos:", error);
    }
  };

  const logoutUser = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      user, loginWithGoogle, updateProfile, addPoints, logout: logoutUser, 
      isAuthenticated: !!user, isAdmin: user?.role === 'admin', loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};