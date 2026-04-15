import React from 'react';
import { Icons } from '@/components/atoms/Icons';

export const AboutProjectWidget: React.FC = () => {
  return (
    <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta Principal: Misión (Ocupa 2 columnas) */}
        <div className="md:col-span-2 bg-itec-surface border border-itec-gray rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group transition-all hover:border-red-500/30 flex flex-col justify-center">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full group-hover:bg-red-500/20 transition-all duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 shadow-sm">
                <div className="w-6 h-6"><Icons type="info" /></div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Nuestra Misión</h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
              ITEC es una plataforma colaborativa e independiente creada <strong className="text-white">exclusivamente por y para estudiantes</strong> de la UTN BA. Nuestro objetivo es democratizar el acceso a la información académica, centralizando herramientas clave, material de estudio y conectando a la comunidad para facilitar tu recorrido universitario.
            </p>
          </div>
        </div>

        {/* 🟢 Tarjeta Secundaria: EL LOGO DE ITEC BRILLANDO */}
        <div className="md:col-span-1 bg-gradient-to-br from-itec-surface to-itec-sidebar border border-itec-gray rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-red-500/30 transition-all text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Contenedor del Logo con Efecto Float y Glow */}
          <div className="w-24 h-24 mb-4 relative group-hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
            <img 
              src="/logo.png" 
              alt="ITEC Logo" 
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = '/itec.png'; }} 
            />
          </div>
          
          <h3 className="text-white font-bold text-xl mb-1 tracking-wide">ITEC UTN BA</h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            Comunidad Estudiantil
          </p>
        </div>

        {/* Mini Tarjetas de Pilares Institucionales */}
        <div className="bg-itec-surface border border-itec-gray p-6 rounded-3xl hover:bg-itec-sidebar transition-colors shadow-lg flex items-start gap-4">
          <span className="text-3xl">📚</span>
          <div>
            <h3 className="text-white font-bold text-sm mb-1">Aportes Gratuitos</h3>
            <p className="text-[11px] text-gray-400 leading-tight">Acceso libre a miles de resúmenes, parciales y guías sin costo alguno.</p>
          </div>
        </div>

        <div className="bg-itec-surface border border-itec-gray p-6 rounded-3xl hover:bg-itec-sidebar transition-colors shadow-lg flex items-start gap-4">
          <span className="text-3xl">🤝</span>
          <div>
            <h3 className="text-white font-bold text-sm mb-1">Red de Alumnos</h3>
            <p className="text-[11px] text-gray-400 leading-tight">Encontrá tu grupo de WhatsApp por materia y comisión al instante.</p>
          </div>
        </div>

        <div className="bg-itec-surface border border-itec-gray p-6 rounded-3xl hover:bg-itec-sidebar transition-colors shadow-lg flex items-start gap-4">
          <span className="text-3xl">🚀</span>
          <div>
            <h3 className="text-white font-bold text-sm mb-1">Crecimiento Constante</h3>
            <p className="text-[11px] text-gray-400 leading-tight">Agregamos nuevas secciones y herramientas útiles cada cuatrimestre.</p>
          </div>
        </div>

      </div>
    </section>
  );
};