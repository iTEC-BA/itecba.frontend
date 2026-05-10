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
