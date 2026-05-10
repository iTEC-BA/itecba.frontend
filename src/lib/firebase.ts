import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     "itec-utn.firebasestorage.app",
  messagingSenderId: "475388859660",
  appId:             "1:475388859660:web:3fa9d2a9b9230c38cd2529",
  measurementId:     "G-RQ80098R02",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Caché persistente con soporte multi-pestaña.
// Reemplaza enableIndexedDbPersistence() que:
//   ① está deprecada
//   ② lanza "failed-precondition" cuando hay varias pestañas abiertas
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(), // ← multi-tab safe
  }),
});
