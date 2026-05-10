#!/usr/bin/env bash
# ============================================================
#  setup_notifications.sh — Sistema de Notificaciones iTEC BA
#  Push (web-push) + Local (Notification API) + In-app (bell)
#  Ejecutar desde la RAÍZ del FRONTEND
# ============================================================
set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()     { echo -e "${GREEN}[NOTIF]${NC} $1"; }
section() { echo -e "\n${CYAN}══ $1 ══${NC}"; }

[ -f "src/lib/firebase.ts" ] || { echo "❌ Ejecutá desde la raíz del frontend."; exit 1; }
mkdir -p src/features/notifications/{services,hooks,components,types}

# ================================================================
#  TIPOS — src/features/notifications/types/notification.ts
#  Define TODOS los eventos que pueden generar notificación.
#  Cada feature usa su propio NotificationEvent.
# ================================================================
section "1. Tipos globales de notificación"
cat > src/features/notifications/types/notification.ts << 'EOF'
// ── Orígenes de notificación (un origen por feature) ─────────
export type NotificationSource =
  | 'news'        // Cartelera de avisos → siempre
  | 'calendar'    // Calendario académico → 24h antes del evento
  | 'benefits'    // Beneficios → cuando se agrega uno nuevo
  | 'rewards'     // Recompensas → confirmación de canje
  | 'points'      // Gamificación → puntos otorgados
  | 'forum'       // Foro anónimo → respuesta en tu hilo
  | 'tutoring'    // Tutorías → confirmación y recordatorio 2h antes
  | 'jobs'        // Bolsa de trabajo → match de oferta
  | 'auth'        // Auth → login en dispositivo nuevo
  | 'system';     // Sistema → T&C actualizados, mantenimiento

// ── Canales disponibles ───────────────────────────────────────
export type NotificationChannel = 'push' | 'local' | 'inapp' | 'email';

// ── Prioridad (controla badge, sonido y urgencia) ─────────────
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

// ── Notificación in-app (lo que muestra el bell) ─────────────
export interface InAppNotification {
  id: string;
  source: NotificationSource;
  title: string;
  body: string;
  url?: string;         // Ruta interna a la que navega al hacer click
  createdAt: string;    // ISO string
  read: boolean;
  priority: NotificationPriority;
}

// ── Payload para enviar push desde backend ────────────────────
export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;        // Default: /icons/pwa-192.png
  badge?: string;       // Default: /icons/pwa-64.png
  source: NotificationSource;
  priority?: NotificationPriority;
}

// ── Qué devuelve useNotificationCenter ───────────────────────
export interface NotificationState {
  items: InAppNotification[];
  unreadCount: number;
  isPushEnabled: boolean;
  isPushSupported: boolean;
  enablePush: () => Promise<void>;
  markAllRead: () => void;
  markRead: (id: string) => void;
}
EOF

# ================================================================
#  SERVICIO GLOBAL — src/features/notifications/services/notificationService.ts
#  Un servicio único para TODOS los features.
#  El backend tiene un módulo /api/notifications/ separado del foro.
# ================================================================
section "2. Servicio global de notificaciones"
cat > src/features/notifications/services/notificationService.ts << 'EOF'
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
EOF

# ================================================================
#  HOOK GLOBAL — src/features/notifications/hooks/usePushNotifications.ts
#  Reemplaza el hook de forum. Funciona para TODOS los features.
#  Usa useCallback para no recrear funciones en cada render.
# ================================================================
section "3. Hook global usePushNotifications"
cat > src/features/notifications/hooks/usePushNotifications.ts << 'EOF'
import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

interface PushState {
  isSupported:  boolean;
  permission:   NotificationPermission;
  isSubscribed: boolean;
  isLoading:    boolean;
  enable:       () => Promise<void>;
  disable:      () => Promise<void>;
}

export const usePushNotifications = (): PushState => {
  const [isSupported,  setIsSupported]  = useState(false);
  const [permission,   setPermission]   = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  // ── Al montar: verificar soporte y suscripción existente ───
  useEffect(() => {
    const check = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);
      if (!supported) return;

      setPermission(Notification.permission);
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    };
    check();
  }, []);

  // ── enable: pide permiso y suscribe al backend ─────────────
  const enable = useCallback(async () => {
    if (!isSupported || isLoading) return;
    setIsLoading(true);
    try {
      const sub = await notificationService.requestAndSubscribe();
      if (sub) {
        setIsSubscribed(true);
        setPermission('granted');
        // Muestra notificación local de bienvenida
        notificationService.showLocal({
          title: '¡Notificaciones activadas! 🎉',
          body:  'Recibirás avisos de iTEC BA directamente en tu dispositivo.',
          url:   '/',
        });
      } else {
        setPermission(Notification.permission);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, isLoading]);

  // ── disable: cancela la suscripción ────────────────────────
  const disable = useCallback(async () => {
    if (!isLoading) return;
    setIsLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await notificationService.unsubscribe(sub.endpoint);
        setIsSubscribed(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return { isSupported, permission, isSubscribed, isLoading, enable, disable };
};
EOF

# ================================================================
#  HOOK CENTRO — src/features/notifications/hooks/useNotificationCenter.ts
#  Agrega todas las fuentes: news (MongoDB), push status, etc.
#  Persiste "vistos" en localStorage (sin afectar el bundle principal).
# ================================================================
section "4. Hook useNotificationCenter"
cat > src/features/notifications/hooks/useNotificationCenter.ts << 'EOF'
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { InAppNotification } from '../types/notification';

const STORAGE_KEY = 'itec_notifications_v2';

// ── Carga/guarda en localStorage de forma segura ────────────
const loadSeen = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
};
const saveSeen = (ids: Set<string>) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])); } catch {}
};

interface CenterState {
  items:       InAppNotification[];
  unreadCount: number;
  markRead:    (id: string) => void;
  markAllRead: () => void;
}

// ── El hook recibe los items de news ya cargados desde useQuery ─
// Esto permite que NotificationBell no haga su propio fetch.
export const useNotificationCenter = (
  rawNews: Array<{ id?: string; title?: string; body?: string; createdAt?: any }> = []
): CenterState => {
  const [seenIds, setSeenIds] = useState<Set<string>>(loadSeen);

  // ── Convierte news del backend a InAppNotification ─────────
  const items = useMemo<InAppNotification[]>(() => {
    return rawNews
      .filter((n) => n?.id)
      .map((n) => ({
        id:        n.id!,
        source:    'news' as const,
        title:     n.title ?? 'Aviso iTEC',
        body:      n.body ?? '',
        url:       '/',
        createdAt: n.createdAt?.toDate?.().toISOString?.() ?? new Date().toISOString(),
        read:      seenIds.has(n.id!),
        priority:  'normal' as const,
      }));
  }, [rawNews, seenIds]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const markRead = useCallback((id: string) => {
    setSeenIds((prev) => {
      const next = new Set(prev).add(id);
      saveSeen(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    const allIds = new Set(items.map((i) => i.id));
    setSeenIds(allIds);
    saveSeen(allIds);
  }, [items]);

  return { items, unreadCount, markRead, markAllRead };
};
EOF

# ================================================================
#  SKELETON — src/features/notifications/components/NotificationBellSkeleton.tsx
# ================================================================
section "5. Skeleton del Bell"
cat > src/features/notifications/components/NotificationBellSkeleton.tsx << 'EOF'
export const NotificationBellSkeleton: React.FC = () => (
  <div className="relative flex items-center justify-center w-7 h-7 animate-pulse">
    <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
  </div>
);
EOF

# ================================================================
#  NOTIFICATION BELL MEJORADO
#  src/features/notifications/components/NotificationBell.tsx
#  Cambios respecto al original:
#  ① Combina news (in-app) + estado de push en un solo componente
#  ② Botón para activar push si no está suscrito
#  ③ useCallback en todos los handlers
#  ④ Skeleton propio para Suspense
# ================================================================
section "6. NotificationBell mejorado"
cat > src/features/notifications/components/NotificationBell.tsx << 'EOF'
import React, { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@features/admin/services/adminService';
import { useNotificationCenter } from '../hooks/useNotificationCenter';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { NotificationBellSkeleton } from './NotificationBellSkeleton';

// ── El panel de detalles se carga en diferido (heavy) ─────────
const NotificationPanel = lazy(() =>
  import('./NotificationPanel').then((m) => ({ default: m.NotificationPanel }))
);

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Fetch de news (fuente in-app) ─────────────────────────
  const { data: rawNews = [] } = useQuery({
    queryKey: ['announcements', 'active'],
    queryFn:  () => adminService.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const { items, unreadCount, markRead, markAllRead } = useNotificationCenter(rawNews);
  const push = usePushNotifications();

  // ── Handlers memorizados ──────────────────────────────────
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev && unreadCount > 0) markAllRead();
      return !prev;
    });
  }, [unreadCount, markAllRead]);

  // Cierre al click fuera
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell button ───────────────────────────── */}
      <button
        onClick={toggleOpen}
        className="relative outline-none flex items-center justify-center cursor-pointer"
        aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-gray-300 size-3.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-itec-text text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-itec-bg shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-bounce-short">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Panel lazy ───────────────────────────────── */}
      {isOpen && (
        <Suspense fallback={
          <div className="absolute right-0 w-80 sm:w-96 bg-itec-box border border-itec-box/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 z-100">
            <div className="animate-pulse space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl bg-white/5" />)}
            </div>
          </div>
        }>
          <NotificationPanel
            items={items}
            push={push}
            onMarkRead={markRead}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
EOF

# ================================================================
#  PANEL (lazy) — src/features/notifications/components/NotificationPanel.tsx
# ================================================================
section "7. NotificationPanel (lazy)"
cat > src/features/notifications/components/NotificationPanel.tsx << 'EOF'
import React, { useCallback } from 'react';
import type { InAppNotification } from '../types/notification';
import type { usePushNotifications } from '../hooks/usePushNotifications';

interface Props {
  items:      InAppNotification[];
  push:       ReturnType<typeof usePushNotifications>;
  onMarkRead: (id: string) => void;
  onClose:    () => void;
}

const sourceLabel: Record<string, string> = {
  news:      'Aviso',
  calendar:  'Calendario',
  benefits:  'Beneficio',
  rewards:   'Recompensa',
  points:    'Puntos',
  forum:     'Foro',
  tutoring:  'Tutoría',
  jobs:      'Bolsa IT',
  auth:      'Seguridad',
  system:    'Sistema',
};

export const NotificationPanel: React.FC<Props> = ({ items, push, onMarkRead, onClose }) => {
  const handleItemClick = useCallback((item: InAppNotification) => {
    onMarkRead(item.id);
    if (item.url) window.location.href = item.url;
    onClose();
  }, [onMarkRead, onClose]);

  return (
    <div className="absolute right-0 w-80 sm:w-96 bg-itec-box border border-itec-box/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-100 animate-in slide-in-from-top-2 fade-in">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-itec-box/20">
        <h3 className="text-itec-text font-bold tracking-wide text-sm">Notificaciones</h3>

        {/* Botón activar push si no está suscrito */}
        {push.isSupported && !push.isSubscribed && push.permission !== 'denied' && (
          <button
            onClick={push.enable}
            disabled={push.isLoading}
            className="text-[10px] font-bold uppercase tracking-widest text-itec-accent hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {push.isLoading ? 'Activando…' : '🔔 Activar push'}
          </button>
        )}
        {push.isSubscribed && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
            ✓ Push activo
          </span>
        )}
        {push.permission === 'denied' && (
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">
            Push bloqueado
          </span>
        )}
      </div>

      {/* Lista */}
      <div className="max-h-[60vh] overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-3xl block mb-2">🎉</span>
            <p className="text-xs font-medium">Sin novedades por ahora.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${!item.read ? 'bg-itec-accent/5' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!item.read && (
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-itec-accent shrink-0" />
                  )}
                  <div className={!item.read ? '' : 'pl-3.5'}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted mb-0.5">
                      {sourceLabel[item.source] ?? item.source}
                    </p>
                    <p className="text-xs font-semibold text-itec-text leading-snug">{item.title}</p>
                    {item.body && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.body}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
EOF

# ================================================================
#  INDEX — src/features/notifications/index.ts
#  Barrel export para imports limpios
# ================================================================
section "8. Barrel export"
cat > src/features/notifications/index.ts << 'EOF'
export { NotificationBell } from './components/NotificationBell';
export { NotificationBellSkeleton } from './components/NotificationBellSkeleton';
export { usePushNotifications } from './hooks/usePushNotifications';
export { useNotificationCenter } from './hooks/useNotificationCenter';
export { notificationService } from './services/notificationService';
export type * from './types/notification';
EOF

# ================================================================
#  ACTUALIZAR NavbarTop — reemplazar import del NotificationBell
#  El original importaba desde @features/home/..., ahora es global.
# ================================================================
section "9. Actualizar NavbarTop para usar el nuevo NotificationBell"

# Lazy en NavbarTop (el bell solo se ve cuando el navbar carga)
if grep -q "NotificationBell" src/components/organisms/NavbarTop.tsx 2>/dev/null; then
  # Agregar lazy import y quitar el estático
  sed -i 's|import { NotificationBell } from "@features/home/components/organisms/NotificationBell";||' \
    src/components/organisms/NavbarTop.tsx

  # Insertar lazy al inicio del archivo (después de los imports de React)
  if ! grep -q "lazy.*NotificationBell" src/components/organisms/NavbarTop.tsx; then
    sed -i '/^import React/a const NotificationBell = lazy(() => import("@features\/notifications").then(m => ({ default: m.NotificationBell })));' \
      src/components/organisms/NavbarTop.tsx
    sed -i '/^import React/a import { lazy, Suspense } from "react";' \
      src/components/organisms/NavbarTop.tsx
  fi

  # Envolver el uso del bell en Suspense
  sed -i 's|<NotificationBell />|<Suspense fallback={<div className="w-7 h-7 rounded-full bg-white\/10 animate-pulse" />}><NotificationBell /></Suspense>|g' \
    src/components/organisms/NavbarTop.tsx

  log "  → NavbarTop actualizado."
fi

# ================================================================
#  SERVICE WORKER — public/sw-notifications.js
#  Handler de push events para cuando la app está cerrada.
#  Este archivo lo IMPORTA el SW generado por vite-plugin-pwa
#  mediante importScripts() o el injectManifest mode.
#  NOTA: Si usás generateSW mode en VitePWA, agregar los handlers
#  en el campo additionalManifestEntries o vía workbox.importScripts.
# ================================================================
section "10. Service Worker push handler"
mkdir -p public
cat > public/sw-push-handler.js << 'EOF'
// ── Push event: llega cuando el backend envía una notificación ──
// Este código corre en el SW, FUERA del contexto de React.
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: 'iTEC BA', body: event.data.text(), url: '/' }; }

  const options = {
    body:    payload.body   ?? '',
    icon:    payload.icon   ?? '/icons/pwa-192.png',
    badge:   payload.badge  ?? '/icons/pwa-64.png',
    data:    { url: payload.url ?? '/' },
    vibrate: [200, 100, 200],
    // Agrupa notificaciones del mismo source para no saturar
    tag:     payload.source ?? 'itec-general',
    renotify: payload.priority === 'critical',
    actions: [
      { action: 'open',    title: 'Ver' },
      { action: 'dismiss', title: 'Descartar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'iTEC BA', options)
  );
});

// ── Notification click: navega a la URL del payload ────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      // Si ya hay una ventana abierta, enfocarla y navegar
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus().then((c) => c.navigate(url));
      return clients.openWindow(url);
    })
  );
});
EOF

# ================================================================
#  BACKEND — src/modules/notifications/ (archivo de instrucciones)
#  El backend necesita un módulo dedicado para las notificaciones.
#  Este script crea los archivos backend en ./backend-notifications/
#  para que los copies manualmente al repo del backend.
# ================================================================
section "11. Módulo backend (copiar a itecba-backend)"
mkdir -p backend-notifications

cat > backend-notifications/notification.controller.js << 'BEOF'
// src/modules/notifications/notification.controller.js
// ─────────────────────────────────────────────────────
// Reemplaza los endpoints de push que estaban en forum.routes.js
// y añade el envío a segmentos específicos de usuarios.
import webpush from 'web-push';
import { turso } from '../../config/turso.js';

// ── Inicialización de VAPID (se llama desde index.js) ──────────
export function initWebPush() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      process.env.VAPID_EMAIL || 'mailto:admin@itecba.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    console.log('🟢 Web Push (VAPID) configurado');
  } else {
    console.warn('🟡 VAPID keys no configuradas — push desactivado');
  }
}

// ── GET /api/notifications/vapid-key ───────────────────────────
export const getVapidKey = (_req, res) => {
  res.json({ key: process.env.VAPID_PUBLIC_KEY || '' });
};

// ── POST /api/notifications/subscribe ──────────────────────────
// Guarda la suscripción asociada al uid del usuario autenticado.
export const subscribePush = async (req, res, next) => {
  try {
    const subscription = req.body;
    const userHash = req.user?.uid ?? 'anonymous';
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO push_subscriptions (user_hash, subscription, updated_at)
            VALUES (?1, ?2, ?3)
            ON CONFLICT(user_hash)
            DO UPDATE SET subscription = excluded.subscription, updated_at = ?3`,
      args: [userHash, JSON.stringify(subscription), now],
    });

    res.status(200).json({ ok: true });
  } catch (err) { next(err); }
};

// ── DELETE /api/notifications/unsubscribe ──────────────────────
export const unsubscribePush = async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    await turso.execute({
      sql: `DELETE FROM push_subscriptions WHERE subscription LIKE ?1`,
      args: [`%${endpoint}%`],
    });
    res.status(200).json({ ok: true });
  } catch (err) { next(err); }
};

// ── Helper: enviar push a TODOS los suscriptores ───────────────
export async function broadcastPush(payload) {
  const { rows } = await turso.execute('SELECT subscription FROM push_subscriptions');
  const results = await Promise.allSettled(
    rows.map(async (row) => {
      const sub = JSON.parse(row.subscription);
      await webpush.sendNotification(sub, JSON.stringify(payload));
    })
  );
  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed > 0) console.warn(`⚠️ ${failed} push fallaron (suscripciones expiradas).`);
}

// ── Helper: enviar push a un usuario específico (por uid) ───────
export async function pushToUser(uid, payload) {
  const { rows } = await turso.execute({
    sql: `SELECT subscription FROM push_subscriptions WHERE user_hash = ?1`,
    args: [uid],
  });
  if (rows.length === 0) return;
  try {
    await webpush.sendNotification(JSON.parse(rows[0].subscription), JSON.stringify(payload));
  } catch (e) {
    console.warn(`⚠️ Push a user ${uid} falló:`, e.message);
  }
}
BEOF

cat > backend-notifications/notification.routes.js << 'BEOF'
// src/modules/notifications/notification.routes.js
import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware.js';
import { getVapidKey, subscribePush, unsubscribePush } from './notification.controller.js';

const router = Router();

router.get('/vapid-key', getVapidKey);
router.post('/subscribe', verifyToken, subscribePush);
router.delete('/unsubscribe', verifyToken, unsubscribePush);

export default router;
BEOF

cat > backend-notifications/INSTRUCCIONES.md << 'BEOF'
# Integración del módulo de notificaciones en el backend

## 1. Copiar los archivos
```bash
cp notification.controller.js ../itecba-backend/src/modules/notifications/
cp notification.routes.js     ../itecba-backend/src/modules/notifications/
```

## 2. Agregar la ruta en src/index.js
```js
import notificationRoutes from './modules/notifications/notification.routes.js';
import { initWebPush }     from './modules/notifications/notification.controller.js';

// Después de initForumDB():
initWebPush();

// En las rutas:
app.use('/api/notifications', notificationRoutes);
```

## 3. Usar broadcastPush en los triggers correctos

### ─ Nuevo beneficio (benefit.controller.js) ─
```js
import { broadcastPush } from '../notifications/notification.controller.js';
// Al final de createBenefit():
await broadcastPush({
  title:  '🎁 Nuevo beneficio disponible',
  body:   `${title} — Descuento exclusivo para estudiantes iTEC`,
  url:    '/perfil',
  source: 'benefits',
  priority: 'normal',
});
```

### ─ Noticia crítica (ads.controller.js) ─
```js
import { broadcastPush } from '../notifications/notification.controller.js';
// Solo si priority === 'alta':
if (priority === 'alta') {
  await broadcastPush({
    title:  `📢 ${title}`,
    body:   body,
    url:    '/',
    source: 'news',
    priority: 'high',
  });
}
```

### ─ Canje exitoso (rewards.controller.js) ─
```js
import { pushToUser } from '../notifications/notification.controller.js';
// Al confirmar el canje:
await pushToUser(req.user.uid, {
  title:  '✅ Canje confirmado',
  body:   `Tu canje de ${rewardName} fue procesado. Retiralo en administración.`,
  url:    '/perfil',
  source: 'rewards',
  priority: 'normal',
});
```

### ─ Puntos otorgados (user.controller.js) ─
```js
import { pushToUser } from '../notifications/notification.controller.js';
await pushToUser(uid, {
  title:  `+${points} puntos 🏆`,
  body:   'Seguí participando para desbloquear más recompensas.',
  url:    '/perfil',
  source: 'points',
  priority: 'low',
});
```

### ─ Recordatorio calendario (calendar.controller.js) ─
// Ya tenés checkAndSendReminders() — reemplazá webpush.sendNotification directo
// por broadcastPush() con source: 'calendar'.

## 4. Cuándo dispara cada notificación

| Evento                          | Canal         | Trigger                                  |
|----------------------------------|---------------|------------------------------------------|
| Nuevo beneficio                  | Push broadcast| POST /api/benefits (admin)               |
| Aviso crítico                    | Push broadcast| POST /api/announcements (priority=alta)  |
| Canje exitoso                    | Push usuario  | POST /api/rewards/redeem                 |
| Puntos otorgados                 | Push usuario  | PATCH /api/users/:uid/points             |
| Recordatorio examen/evento       | Push broadcast| Cron 24h antes (checkAndSendReminders)   |
| Respuesta en foro                | Push usuario  | POST /api/forum/posts/:id/replies        |
| Confirmación tutoría             | Push usuario  | PATCH /api/tutorships/:id (status=OK)    |
| Recordatorio tutoría (2h antes)  | Push usuario  | Cron cada hora (busca tutorships en 2h)  |

## 5. Email (nodemailer triggers)
Los emails se envían desde los controllers que ya tienen nodemailer.
No agregar push Y email en el mismo evento — elegir uno según urgencia.
- Push: feedback inmediato, recordatorios
- Email: confirmaciones con detalle (canje, tutoría), seguridad (login nuevo)
BEOF

log "  → Archivos backend generados en ./backend-notifications/"

# ================================================================
#  RESUMEN FINAL
# ================================================================
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  SISTEMA DE NOTIFICACIONES — LISTO${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "  FRONTEND creado en src/features/notifications/:"
echo "  ✅ types/notification.ts          → tipos + cuándo dispara cada uno"
echo "  ✅ services/notificationService.ts → VAPID, subscribe, local"
echo "  ✅ hooks/usePushNotifications.ts   → global (reemplaza forum hook)"
echo "  ✅ hooks/useNotificationCenter.ts  → combina todas las fuentes"
echo "  ✅ components/NotificationBell.tsx → lazy + Suspense + push toggle"
echo "  ✅ components/NotificationPanel.tsx→ panel lazy con estado push"
echo "  ✅ components/NotificationBellSkeleton.tsx"
echo "  ✅ public/sw-push-handler.js       → SW handler para push cerrado"
echo ""
echo "  BACKEND (copiar de ./backend-notifications/):"
echo -e "  ${YELLOW}⚠️  Ver INSTRUCCIONES.md — tabla de triggers por evento${NC}"
echo ""
echo "  CUÁNDO dispara cada push:"
echo "  🔔 Nuevo beneficio     → broadcast al crear (admin)"
echo "  🔔 Noticia crítica     → broadcast si priority=alta"
echo "  🔔 Canje confirmado    → push al usuario que canjeó"
echo "  🔔 Puntos otorgados    → push al usuario que los recibió"
echo "  🔔 Recordatorio evento → broadcast cron 24h antes"
echo "  🔔 Respuesta foro      → push al autor del hilo"
echo "  🔔 Tutoría confirmada  → push al alumno + tutor"
echo "  🔔 Recordatorio tutoría→ push 2h antes (cron)"
echo ""
echo -e "  ${YELLOW}PASO CRÍTICO: registrar sw-push-handler.js en vite.config.ts${NC}"
echo "  En VitePWA workbox config agregar:"
echo '  importScripts: ["/sw-push-handler.js"]  ← dentro de workbox: {}'
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"