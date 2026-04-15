import React from 'react';
import { Icons } from '@/components/atoms/Icons';
import { useContributors } from '../../hooks/useContributors';
import { useNavigate } from 'react-router-dom';

export const ContributorsWidget: React.FC = () => {
  const { team, isLoading } = useContributors();
  const navigate = useNavigate();

  return (
    <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      <div className="bg-itec-surface border border-itec-gray rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Lado Izquierdo: Título y Equipo */}
          <div className="flex-1 w-full text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Conocé al <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Equipo ITEC</span>
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto md:mx-0 leading-relaxed">
              Somos un grupo de estudiantes comprometidos con mantener esta plataforma viva, organizada y actualizada todos los días para vos.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start">
              {isLoading ? (
                 <div className="w-8 h-8 border-2 border-itec-gray border-t-red-500 rounded-full animate-spin"></div>
              ) : (
                <div className="flex -space-x-4 hover:space-x-2 transition-all duration-300">
                  {team?.map((user, index) => {
                    const displayName = user?.name || 'Miembro';
                    const initial = displayName.charAt(0).toUpperCase();
                    const firstName = displayName.split(' ')[0];

                    return (
                      <div key={index} className="group relative transition-transform hover:scale-110 hover:-translate-y-2 hover:z-20 cursor-default">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-itec-surface bg-itec-sidebar overflow-hidden shadow-lg flex items-center justify-center text-xl font-bold text-gray-500 ring-2 ring-transparent group-hover:ring-red-500/50 transition-all">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            initial
                          )}
                        </div>
                        
                        {/* Tooltip del Miembro */}
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-itec-bg border border-itec-gray text-white text-[10px] px-3 py-2 rounded-xl whitespace-nowrap z-30 shadow-2xl pointer-events-none flex flex-col items-center">
                          <span className="font-bold text-xs">{firstName}</span>
                          <span className="text-red-400 font-medium">Equipo ITEC</span>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-itec-bg border-r border-b border-itec-gray rotate-45"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Lado Derecho: Banner de Colaboración Estudiantil */}
          <div className="w-full md:w-auto shrink-0">
            <div className="bg-gradient-to-br from-gray-800 to-black p-[1px] rounded-3xl shadow-2xl">
              <div className="bg-itec-bg rounded-3xl p-6 md:p-8 flex flex-col items-center text-center h-full border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
                  <Icons type="file" ></Icons>
                </div>
                
                <h4 className="text-white font-bold mb-2">Sé parte del proyecto</h4>
                <p className="text-xs text-gray-400 max-w-[200px] mb-6 leading-relaxed">
                  Ayudanos a crecer subiendo tus apuntes o sumando tu grupo de WhatsApp a la comunidad.
                </p>
                <button 
                  onClick={() => navigate('/recursos')} 
                  className="w-full py-3 px-6 bg-white text-black hover:bg-gray-200 hover:scale-[1.02] rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 flex items-center justify-center gap-2"
                >
                  Compartir un Apunte
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};