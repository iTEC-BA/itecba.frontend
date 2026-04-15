import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'; // <-- Importar persistencia
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "itec-utn.firebasestorage.app",
  messagingSenderId: "475388859660",
  appId: "1:475388859660:web:3fa9d2a9b9230c38cd2529",
  measurementId: "G-RQ80098R02",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ACTIVAR CACHÉ (Ahorra MUCHÍSIMOS recursos)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn("Múltiples pestañas abiertas, el caché solo funciona en una.");
  } else if (err.code == 'unimplemented') {
    console.warn("El navegador no soporta caché de Firebase.");
  }
});