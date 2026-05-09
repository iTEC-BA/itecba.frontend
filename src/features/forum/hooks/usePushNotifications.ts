import { useState, useEffect } from 'react';
import { forumService } from '../services/forumService';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
  return outputArray;
};

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => setIsSubscribed(!!sub));
      });
    }
  }, []);

  const subscribeToPush = async () => {
    if (!isSupported) return alert("Navegador no soportado.");
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return alert("Debes permitir las notificaciones.");

      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      
      const vapidPublicKey = await forumService.getVapidKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      await forumService.subscribePush(sub);
      setIsSubscribed(true);
    } catch (error) {
      console.error(error);
      alert("Error. Si estás en iPhone, recuerda Instalar la App primero (PWA).");
    }
  };

  return { permission, isSubscribed, isSupported, subscribeToPush };
};
