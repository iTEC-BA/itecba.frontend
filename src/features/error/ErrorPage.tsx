import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/templates/MainLayout';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons/Icons';
import { usePageTitle } from '@hooks/usePageTitle';
import { UTILITIES } from '@/features/error/types/linksUtils';

export const ErrorPage: React.FC = () => {
  usePageTitle('Página no encontrada | ITEC');
  const navigate = useNavigate();

  return (
    <MainLayout>
        <section className="relative z-10 mt-10 mb-10 flex w-full max-w-4xl flex-col items-center gap-2 text-center animate-in slide-in-from-bottom-4 duration-700 md:flex-row md:items-center md:gap-4 md:text-left">
          <figure className="flex shrink-0 items-center justify-center rounded-full bg-itec-box shadow-sm">
            <img
              src="/mascot/TEC-Triste.webp"
              alt="Mascota de ITEC triste"
              className="h-36 w-36 object-contain md:h-48 md:w-48"
            />
          </figure>
          <div className="flex flex-col items-center md:items-start">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-itec-red-skye">Error 404</p>
            <h1 className="mb-3 text-4xl font-bold leading-tight text-itec-text md:text-5xl">
              ¡Uy! Te perdiste en los pasillos de Medrano
            </h1>
            <p className="max-w-lg text-sm text-itec-text md:text-base">
              La página que estás buscando no existe, fue movida o te pasaste de la parada del bondi. No te preocupes, te ayudamos a volver.
            </p>
          </div>
        </section>
        <section aria-label="Acciones de navegación" className="relative z-10 mb-16 flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="bg-itec-red px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2"
          >
            <div className="w-5 h-5 shrink-0">
               <Icons type="arrowLeft" />
            </div>
            Volver atrás
          </Button>
          <Link 
            to="/inicio"
            className="bg-itec-blue hover:bg-itec-blue/90 text-itec-text px-6 py-3 rounded-full font-bold text-sm transition-colors flex items-center gap-2"
          >
            <div className="w-5 h-5 shrink-0">
               <Icons type="home" />
            </div>
            <span className='text-sm'>
            Ir al Inicio
            </span>
          </Link>
        </section>
        <section aria-labelledby="shortcuts-title" className="relative z-10 w-full max-w-6xl p  t-2 text-left">
          <h3 className="text-sm font-bold text-itec-text/60 uppercase tracking-widest mb-6 text-center">
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
                    <h3 className="font-bold text-itec-text text-[13px] truncate">{item.title}</h3>
                    <p className="text-[11px] text-gray-500 truncate">{item.description}</p>
                  </div>
                </>
              );

              const cardClasses = `bg-itec-box rounded-xl p-3.5 flex items-center gap-3 transition-colors group overflow-hidden ${item.hoverBorder} ${item.hoverBg}`;

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
        </section>

    </MainLayout>
  );
};