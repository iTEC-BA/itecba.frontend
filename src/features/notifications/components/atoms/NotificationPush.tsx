import { usePushNotifications } from "../../hooks/usePushNotifications"

export const NotificationPush = () => {
  const{isSupported, isSubscribed, permission,enable,isLoading} = usePushNotifications();
  return (
    <>
    {/* Botón activar push si no está suscrito */}
    {isSupported && !isSubscribed && permission !== 'denied' && (
        <button
        onClick={enable}
        disabled={isLoading}
        className="text-[10px] font-bold uppercase tracking-widest text-itec-accent hover:opacity-80 transition-opacity disabled:opacity-40 border border-itec-gray border-dotted py-1 px-2 rounded-xl"
        >
        {isLoading ? 'Activando…' : '🔔 ¿Activar Notificaciones?'}
        </button>
    )}
    {isSubscribed && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
        ✓ Push activo
        </span>
    )}
    {permission === 'denied' && (
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
        Push bloqueado
        </span>
    )}
    </>
  )
}
