import React, { useState, useEffect } from "react";
import { useAuth } from "@context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";

export const ProfileForm: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', dni: '', specialty: '', phone: '' });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const handleRequestCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.dni || !formData.phone || !formData.specialty) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name, dni: formData.dni, legajo: formData.dni, specialty: formData.specialty, phone: formData.phone
      } as any);
    } catch {
      setError('Ocurrió un error al guardar tus datos.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-10 relative z-10">
      <div className="bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Destellos de fondo */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-sky-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-slate-950 border border-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-inner">
            <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-2xl font-black text-itec-textmb-2 text-center tracking-tight">Solicitar TarjeTEC</h2>
          <p className="text-sm text-slate-400 mb-8 text-center">Completá tus datos para generar tu credencial y acceder a beneficios UTN.</p>
          
          <form onSubmit={handleRequestCard} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nombre y Apellido *</label>
              <Input fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="py-3 bg-slate-950/50 text-sm border-white/10 focus:border-sky-500" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Correo Estudiantil</label>
              <Input fullWidth disabled value={formData.email} className="py-3 bg-slate-950 text-sm border-white/5 opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">DNI / Legajo *</label>
              <Input fullWidth placeholder="Sin puntos" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className="py-3 bg-slate-950/50 text-sm border-white/10 focus:border-sky-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Carrera *</label>
                <select 
                  value={formData.specialty} 
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                  className="w-full py-3 px-4 bg-slate-950/50 text-slate-200 text-sm border border-white/10 rounded-xl focus:outline-none focus:border-sky-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Sistemas">Ing. en Sistemas</option>
                  <option value="Industrial">Ing. Industrial</option>
                  <option value="Civil">Ing. Civil</option>
                  <option value="Electrónica">Ing. Electrónica</option>
                  <option value="Eléctrica">Ing. Eléctrica</option>
                  <option value="Química">Ing. Química</option>
                  <option value="Mecánica">Ing. Mecánica</option>
                  <option value="Naval">Ing. Naval</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Celular *</label>
                <Input fullWidth placeholder="+54 9 11..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="py-3 bg-slate-950/50 text-sm border-white/10 focus:border-sky-500" />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs font-bold text-center mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>}
            
            <div className="pt-4 flex flex-col gap-3">
              <Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isSaving}>Generar Credencial</Button>
              <button type="button" onClick={logout} className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium cursor-pointer">
                Cancelar y salir
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};