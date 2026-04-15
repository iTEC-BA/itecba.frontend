import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { Icons } from "../components/atoms/Icons";
import { TarjeTec } from "../features/profile/components/organisms/TarjeTec";
import { Input } from "../components/atoms/Input";
import { Button } from "../components/atoms/Button";
import { BENEFITS_DATA } from "../data/profileData";
import logoItec from '../assets/logo.png'; 

export const ProfilePage: React.FC = () => {
  const { user, loginWithGoogle, updateProfile, logout, isAuthenticated, loading, isAdmin } = useAuth();
  
  const navigate = useNavigate();
  const { username } = useParams(); 

  const hasCard = isAuthenticated && user && user.dni && user.dni.trim() !== '';

  const [formData, setFormData] = useState({
    name: '', email: '', dni: '', specialty: '', phone: ''
  });
  
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const expectedUsername = user.email.split('@')[0];
      if (username !== expectedUsername) {
        navigate(`/perfil/${expectedUsername}`, { replace: true });
      }
    } else if (!isAuthenticated && username) {
      navigate('/perfil', { replace: true });
    }
  }, [isAuthenticated, user, username, navigate]);

  useEffect(() => {
    if (user && !hasCard) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user, hasCard]);

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
        name: formData.name,
        dni: formData.dni,
        legajo: formData.dni, 
        specialty: formData.specialty,
        phone: formData.phone
      } as any);
    } catch {
      setError('Ocurrió un error al guardar tus datos.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // VISTA 1: LOGIN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-itec-blue/20 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="bg-itec-surface border border-itec-gray rounded-3xl p-10 max-w-md w-full text-center shadow-2xl relative z-10">
            <div className="w-33 h-33 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <img src={logoItec} alt="Logo" className="w-33 h-33 object-contain" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Portal ITEC</h1>
            <p className="text-gray-400 text-sm mb-8">Accedé a tus beneficios y apuntes usando tu cuenta de la facultad.</p>
            
            <button 
              onClick={loginWithGoogle}
              className="w-full bg-itec-red hover:bg-itec-red/50 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg cursor-pointer"
            >
              <div className="w-5 h-5"><Icons type="google" /></div>
              Iniciar sesión con @frba
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // VISTA 2: FORMULARIO
  // ==========================================
  if (isAuthenticated && !hasCard) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto pt-10">
          <div className="bg-itec-surface border border-itec-gray rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-itec-blue/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Solicitar TarjeTEC</h2>
              <p className="text-xs text-gray-400 mb-6 text-center">Completá tus datos académicos para generar tu credencial digital y acceder a los beneficios de la UTN.</p>
              
              <form onSubmit={handleRequestCard} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Nombre y Apellido *</label>
                  <Input fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="py-2.5 bg-itec-bg text-sm border-itec-gray" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Correo Estudiantil (Solo lectura)</label>
                  <Input fullWidth disabled value={formData.email} className="py-2.5 bg-itec-bg text-sm border-itec-gray opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">DNI / Legajo *</label>
                  <Input fullWidth placeholder="Sin puntos" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className="py-2.5 bg-itec-bg text-sm border-itec-gray" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Carrera *</label>
                    <select 
                      value={formData.specialty} 
                      onChange={e => setFormData({...formData, specialty: e.target.value})}
                      className="w-full py-2.5 px-3 bg-itec-bg text-white text-sm border border-itec-gray rounded-xl focus:outline-none focus:border-itec-blue"
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
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Celular *</label>
                    <Input fullWidth placeholder="+54 9 11..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="py-2.5 bg-itec-bg text-sm border-itec-gray" />
                  </div>
                </div>

                {error && <p className="text-itec-red text-xs font-bold text-center mt-2">{error}</p>}
                
                <Button type="submit" disabled={isSaving} variant="primary" className="py-3.5 mt-4 font-bold text-sm uppercase tracking-wider bg-itec-blue hover:bg-blue-600 border-none transition-colors shadow-lg disabled:opacity-50 cursor-pointer">
                  {isSaving ? 'Guardando...' : 'Generar mi Credencial'}
                </Button>
                <button type="button" onClick={logout} className="text-xs text-gray-500 hover:text-white mt-2 cursor-pointer">Cancelar y salir</button>
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // VISTA 3: PERFIL Y TARJETA
  // ==========================================
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-itec-gray pb-6 gap-4">
          <div className="flex items-center gap-5">
            {user?.photoURL && (
               <div className="hidden sm:flex w-16 h-16 rounded-full bg-itec-sidebar border-2 border-itec-blue items-center justify-center overflow-hidden shadow-lg shrink-0">
                  <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
               </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{user?.name}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><div className="w-4 h-4"><Icons type="users" /></div>{user?.specialty}</span>
                <span className="hidden md:block text-gray-600">•</span>
                <span className="flex items-center gap-1.5"><div className="w-4 h-4"><Icons type="documentFill" /></div>{user?.dni}</span>
                <span className="hidden md:block text-gray-600">•</span>
                <span className="flex items-center gap-1.5"><div className="w-4 h-4"><Icons type="message" /></div>{user?.email}</span>
              </div>
              
              {/* NUEVO BADGE DE PUNTOS */}
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  <span>⭐</span> {user?.points || 0} Puntos ITEC
                </span>
              </div>

            </div>
          </div>
          <button onClick={logout} className="text-sm bg-itec-red px-4 py-2 rounded-lg hover:bg-itec-red-skye hover:text-white transition-colors font-medium cursor-pointer shrink-0">
            Cerrar Sesión
          </button>
        </div>

        <div className="mb-12">{user && <TarjeTec user={user} />}</div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-1">Tus Beneficios TarjeTEC</h2>
          <p className="text-gray-400 text-sm mb-6">Mostrá tu credencial virtual en los locales adheridos.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="flex items-center gap-2 text-xs font-bold text-itec-blue-skye uppercase tracking-widest mb-4">
                <div className="w-4 h-4"><Icons type="pin" /></div> Sede Medrano
              </h3>
              <div className="flex flex-col gap-3">
                {BENEFITS_DATA.medrano.map((b, i) => (
                  <div key={i} className="border-l-2 border-itec-blue-skye pl-4 py-1 bg-transparent group cursor-pointer">
                    <h4 className="text-white font-bold text-sm mb-0.5 group-hover:text-itec-blue-skye transition-colors">{b.title}</h4>
                    <p className="text-green-400 text-xs font-bold">{b.discount}</p>
                    <span className="text-[10px] text-gray-500">{b.location}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">
                  <div className="w-4 h-4"><Icons type="pin" /></div> Sede Campus
                </h3>
                <div className="flex flex-col gap-3">
                  {BENEFITS_DATA.campus.map((b, i) => (
                    <div key={i} className="border-l-2 border-orange-400 pl-4 py-1 bg-transparent group cursor-pointer">
                      <h4 className="text-white font-bold text-sm mb-0.5 group-hover:text-orange-400 transition-colors">{b.title}</h4>
                      <p className="text-green-400 text-xs font-bold">{b.discount}</p>
                      <span className="text-[10px] text-gray-500">{b.location}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
                  <div className="w-4 h-4"><Icons type="lightning" /></div> Digitales
                </h3>
                <div className="flex flex-col gap-3">
                  {BENEFITS_DATA.digital.map((b, i) => (
                    <div key={i} className="border-l-2 border-purple-400 pl-4 py-1 bg-transparent group cursor-pointer">
                      <h4 className="text-white font-bold text-sm mb-0.5 group-hover:text-purple-400 transition-colors">{b.title}</h4>
                      <p className="text-purple-400 text-xs font-bold">{b.discount}</p>
                      <span className="text-[10px] text-gray-500">{b.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};