import { auth } from '@/lib/firebase';
import type { PushPayload } from '../types/notification';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/notifications`;

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ── Convierte la clave VAPID base64 a Uint8Array (requerido por pushManager) ─
const urlBase64ToUint8Array = (base64: string): Uint8Array => {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

export const notificationService = {
  // ── Obtiene la clave VAPID pública del backend ─────────────
  getVapidKey: async (): Promise<string> => {
    const res = await fetch(`${BASE}/vapid-key`);
    if (!res.ok) throw new Error('No se pudo obtener la clave VAPID');
    const { key } = await res.json();
    return key;
  },

  // ── Registra la suscripción push del dispositivo ──────────
  // Llama a este método después de que el usuario acepta los permisos.
  // El backend asocia la suscripción al uid del usuario autenticado.
  subscribe: async (subscription: PushSubscription): Promise<void> => {
    const res = await fetch(`${BASE}/subscribe`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(subscription),
    });
    if (!res.ok) throw new Error('No se pudo registrar la suscripción push');
  },

  // ── Elimina la suscripción (cuando el usuario desactiva notificaciones) ──
  unsubscribe: async (endpoint: string): Promise<void> => {
    await fetch(`${BASE}/unsubscribe`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ endpoint }),
    });
  },

  // ── Solicita permiso y suscribe al push en un solo paso ──────
  // Retorna la suscripción creada o null si fue denegado.
  requestAndSubscribe: async (): Promise<PushSubscription | null> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const reg    = await navigator.serviceWorker.ready;
    const vapid  = await notificationService.getVapidKey();
    const sub    = await reg.pushManager.subscribe({
      userVisibleOnly:    true,
      applicationServerKey: urlBase64ToUint8Array(vapid),
    });

    await notificationService.subscribe(sub);
    return sub;
  },

  // ── Dispara una notificación LOCAL (sin backend, instantánea) ─
  // Usar para feedback inmediato: canje exitoso, puntos ganados, etc.
  showLocal: (payload: Omit<PushPayload, 'source'> & { source?: string }): void => {
    if (Notification.permission !== 'granted') return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(payload.title, {
        body:  payload.body,
        icon:  payload.icon  ?? '/icons/pwa-192.png',
        badge: payload.badge ?? '/icons/pwa-64.png',
        data:  { url: payload.url ?? '/' },
        // Vibration API (Android PWA)
        // @ts-ignore
        vibrate: [200, 100, 200],
      });
    });
  },
};
