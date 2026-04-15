import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Icons } from '../components/atoms/Icons';
import { usePageTitle } from '../hooks/usePageTitle';

export const ErrorPage: React.FC = () => {
  usePageTitle('Página no encontrada');
  const navigate = useNavigate();

  // Ampliamos el listado a 12 utilidades clave (Internas y Externas)
  const UTILITIES = [
    {
      title: 'Clases y Cursos',
      description: 'Videos de apoyo',
      icon: 'play',
      link: '/cursos',
      containerColor: 'bg-blue-500/10 text-blue-400',
      hoverBorder: 'hover:border-blue-500',
      hoverBg: 'hover:bg-blue-500/5'
    },
    {
      title: 'Aportes',
      description: 'Resúmenes y Finales',
      icon: 'compass',
      link: '/explore',
      containerColor: 'bg-orange-500/10 text-orange-400',
      hoverBorder: 'hover:border-orange-500',
      hoverBg: 'hover:bg-orange-500/5'
    },
    {
      title: 'Comunidades WA',
      description: 'Grupos por comisión',
      icon: 'users',
      link: '/grupos',
      containerColor: 'bg-green-500/10 text-green-400',
      hoverBorder: 'hover:border-green-500',
      hoverBg: 'hover:bg-green-500/5'
    },
    {
      title: 'Ingreso UTN',
      description: 'TIVU y Módulo B',
      icon: 'entry',
      link: '/ingreso',
      containerColor: 'bg-purple-500/10 text-purple-400',
      hoverBorder: 'hover:border-purple-500',
      hoverBg: 'hover:bg-purple-500/5'
    },
    {
      title: 'Grado (Planes 23)',
      description: 'Planes y correlativas',
      icon: 'degree',
      link: '/grado',
      containerColor: 'bg-yellow-500/10 text-yellow-400',
      hoverBorder: 'hover:border-yellow-500',
      hoverBg: 'hover:bg-yellow-500/5'
    },
    {
      title: 'Chat y FAQs',
      description: 'Resolvé tus dudas',
      icon: 'message',
      link: '/chat',
      containerColor: 'bg-teal-500/10 text-teal-400',
      hoverBorder: 'hover:border-teal-500',
      hoverBg: 'hover:bg-teal-500/5'
    },
    {
      title: 'Mi Perfil',
      description: 'Tu TarjeTEC digital',
      icon: 'profile',
      link: '/perfil',
      containerColor: 'bg-red-500/10 text-red-400',
      hoverBorder: 'hover:border-red-500',
      hoverBg: 'hover:bg-red-500/5'
    },
    {
      title: 'Sobre ITEC',
      description: 'Valores y contacto',
      icon: 'heart',
      link: '/nosotros',
      containerColor: 'bg-pink-500/10 text-pink-400',
      hoverBorder: 'hover:border-pink-500',
      hoverBg: 'hover:bg-pink-500/5'
    },
    {
      title: 'SIU Guaraní',
      description: 'Autogestión UTN',
      icon: 'externalLink',
      link: 'https://guarani.frba.utn.edu.ar/autogestion/grado/',
      containerColor: 'bg-slate-500/10 text-slate-400',
      hoverBorder: 'hover:border-slate-500',
      hoverBg: 'hover:bg-slate-500/5',
      isExternal: true
    },
    {
      title: 'Aulas Virtuales',
      description: 'Campus Virtual',
      icon: 'externalLink',
      link: 'https://aulasvirtuales.frba.utn.edu.ar/',
      containerColor: 'bg-slate-500/10 text-slate-400',
      hoverBorder: 'hover:border-slate-500',
      hoverBg: 'hover:bg-slate-500/5',
      isExternal: true
    },
    {
      title: 'Horarios 2026',
      description: 'Grillas de cursada',
      icon: 'calendar',
      link: 'https://drive.google.com/drive/folders/1tRhcVZsWeyj3VMVYnR1xseDewGYcsNLu?usp=sharing',
      containerColor: 'bg-slate-500/10 text-slate-400',
      hoverBorder: 'hover:border-slate-500',
      hoverBg: 'hover:bg-slate-500/5',
      isExternal: true
    },
    {
      title: 'Mapas de Sedes',
      description: 'Campus y Medrano',
      icon: 'externalLink',
      link: 'https://drive.google.com/file/d/1-puLyo4kv3HcNH0_WeaYsIKBJ6WC0Kse/view',
      containerColor: 'bg-slate-500/10 text-slate-400',
      hoverBorder: 'hover:border-slate-500',
      hoverBg: 'hover:bg-slate-500/5',
      isExternal: true
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 relative z-10 pb-20">
        
        {/* Luz de fondo decorativa */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-itec-blue/10 blur-[120px] pointer-events-none rounded-full"></div>

        {/* CONTENIDO PRINCIPAL 404 */}
        <div className="relative z-10 mb-8 mt-10 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-8xl md:text-[140px] font-black bg-clip-text text-itec-red-skye leading-none mb-2 drop-shadow-lg">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¡Uy! Te perdiste en los pasillos de Medrano
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            La página que estás buscando no existe, fue movida o te pasaste de la parada del bondi. No te preocupes, te ayudamos a volver.
          </p>
        </div>

        {/* BOTONES DE ACCIÓN PRINCIPAL */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="bg-itec-surface border border-itec-gray hover:border-gray-400 text-white px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
          >
            <div className="w-[18px] h-[18px] shrink-0">
               <Icons type="arrowLeft" />
            </div>
            Volver atrás
          </button>
          <Link 
            to="/inicio"
            className="bg-itec-blue hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,64,147,0.4)]"
          >
            <div className="w-5 h-5 shrink-0">
               <Icons type="home" />
            </div>
            Ir al Inicio
          </Link>
        </div>

        {/* CAJAS DE UTILIDADES (Grilla expandida) */}
        <div className="w-full max-w-6xl text-left relative z-10 border-t border-itec-gray pt-10">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">
            Atajos útiles para salvar el cuatrimestre
          </h3>
          
          {/* Grilla ajustada para soportar hasta 4 columnas en Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {UTILITIES.map((item, idx) => {
              // Contenido interno de la tarjeta (para no repetir código entre <a> y <Link>)
              const CardContent = (
                <>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 ${item.containerColor}`}>
                    <div className="w-5 h-5">
                       <Icons type={item.icon} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-[13px] truncate">{item.title}</h3>
                    <p className="text-[11px] text-gray-500 truncate">{item.description}</p>
                  </div>
                </>
              );

              const cardClasses = `bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 transition-all group overflow-hidden ${item.hoverBorder} ${item.hoverBg}`;

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
    </DashboardLayout>
  );
};