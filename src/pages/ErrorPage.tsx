import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import { Icons } from '@components/ui/Icons';
import { usePageTitle } from '@hooks/usePageTitle';
import { UTILITIES } from '@/features/error/types/linksUtils';

export const ErrorPage: React.FC = () => {
  usePageTitle('Página no encontrada | ITEC');
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 relative z-10 pb-20">

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-itec-blue/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="relative z-10 mb-8 mt-10 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-8xl md:text-[140px] font-black bg-clip-text text-itec-red-skye leading-none mb-2 drop-shadow-lg">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-itec-textmb-3">
            ¡Uy! Te perdiste en los pasillos de Medrano
          </h2>
          <p className="text-itec-text max-w-lg mx-auto text-sm md:text-base">
            La página que estás buscando no existe, fue movida o te pasaste de la parada del bondi. No te preocupes, te ayudamos a volver.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="bg-itec-box border border-itec-gray hover:border-gray-400 text-itec-textpx-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
          >
            <div className="w-[18px] h-[18px] shrink-0">
               <Icons type="arrowLeft" />
            </div>
            Volver atrás
          </button>
          <Link 
            to="/inicio"
            className="bg-itec-blue hover:bg-blue-600 text-itec-textpx-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,64,147,0.4)]"
          >
            <div className="w-5 h-5 shrink-0">
               <Icons type="home" />
            </div>
            Ir al Inicio
          </Link>
        </div>
        <div className="w-full max-w-6xl text-left relative z-10 border-t border-itec-gray pt-10">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">
            Atajos útiles para salvar el cuatrimestre
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {UTILITIES.map((item, idx) => {
              const CardContent = (
                <>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 ${item.containerColor}`}>
                    <div className="w-5 h-5">
                       <Icons type={item.icon} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-itec-texttext-[13px] truncate">{item.title}</h3>
                    <p className="text-[11px] text-gray-500 truncate">{item.description}</p>
                  </div>
                </>
              );

              const cardClasses = `bg-itec-box border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 transition-all group overflow-hidden ${item.hoverBorder} ${item.hoverBg}`;

              // Si es un link externo, usamos <a>. Si es interno, usamos <Link> de React Router.
              if (item.isExternal) {
                return (
                  <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className={cardClasses}>
                    {CardContent}
                  </a>
                );
              }

              return (
                <Link key={idx} to={item.link} className={cardClasses}>
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};