import { Icons } from '@components/ui/Icons';
export default function CardCourseState() {
  return (

      <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-colors flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all"></div>
        
        <div>
          <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-4">
            Continuar Estudiando
          </h3>
          <h4 className="text-slate-100 font-bold text-lg leading-tight mb-2">
            Análisis Matemático II
          </h4>
          <p className="text-xs text-slate-400">Unidad 3: Integrales Múltiples</p>
        </div>

        <button className="mt-6 w-full bg-slate-800 hover:bg-orange-500 text-itec-texttext-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
          <div className="w-4 h-4"><Icons type="playFill" /></div>
          Retomar Clase
        </button>
      </div>
  )
}
