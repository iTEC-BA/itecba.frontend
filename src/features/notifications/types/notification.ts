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
