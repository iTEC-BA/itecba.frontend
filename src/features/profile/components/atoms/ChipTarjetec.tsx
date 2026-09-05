
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ChipTarjetecProps {
  showReminder?: boolean
  onDismiss?: () => void
}

export default function ChipTarjetec({
  showReminder = true,
  onDismiss,
}: ChipTarjetecProps) {
  if (!showReminder) return null

  return (
    <div className="relative flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-itec-border bg-itec-box p-3 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-itec-red-skye" />

      <div className="flex items-center gap-3 pl-2">
        <img
          src="/mascot/TEC-respuesta.png"
          alt="¿TarjeTEC?"
          className="h-10 w-10 object-contain drop-shadow-sm transition-transform hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
        <div className="flex flex-col">
          <p className="text-sm font-bold leading-tight text-white">¿Aún no tenés tu TarjeTEC?</p>
          <p className="mt-0.5 text-xs text-itec-muted">Generala gratis para acceder a los beneficios.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-14 pr-2 sm:pl-0">
        <Link
          to="/perfil"
          className="whitespace-nowrap rounded-lg border border-itec-red/20 bg-itec-red/10 px-3 py-1.5 text-xs font-bold text-itec-red-skye transition-colors hover:bg-itec-red/20"
        >
          Solicitar ahora
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          className="cursor-pointer rounded-lg p-1.5 text-itec-muted transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Cerrar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
