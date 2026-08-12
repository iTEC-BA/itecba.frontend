import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';

// Lista de grupos unificada sin colores fuertes en la base de datos
const WHATSAPP_GROUPS = [
  { id: 'basicas1',    title: 'Materias',   subtitle: 'Básicas I',          link: 'https://chat.whatsapp.com/HPEFNAHIqIIABPna0p0Mjj' },
  { id: 'basicas2',    title: 'Materias',   subtitle: 'Básicas II',         link: 'https://chat.whatsapp.com/FyDAm5IZERvC7KmhwetR2l' },
  { id: 'sistemas',    title: 'Ingeniería', subtitle: 'Sistemas',           link: 'https://chat.whatsapp.com/Ktq8BKAZma97cZE9VR228T' },
  { id: 'materias sistemas',     title: 'Ingeniería',subtitle: 'Sistemas',           link: 'https://chat.whatsapp.com/Dknxt7vGxnEAegm8VqJJG6' },
  { id: 'civil',       title: 'Ingeniería', subtitle: 'Civil',              link: 'https://chat.whatsapp.com/JKlTa2rg5RVGdQESAhx9sm' },
  { id: 'electrica',   title: 'Ingeniería',    subtitle: 'Eléctrica',          link: 'https://chat.whatsapp.com/JCO7s0cskas7q3NyCB2ivA' },
  { id: 'electronica', title: 'Ingeniería', subtitle: 'Electrónica',        link: 'https://chat.whatsapp.com/KTsbXqiRbRx26sBuQ3Z6UV' },
  { id: 'industrial',  title: 'Ingeniería', subtitle: 'Industrial',         link: 'https://chat.whatsapp.com/CUyNKsby41tJczZmjaOv7D' },
  { id: 'mecanica',    title: 'Ingeniería', subtitle: 'Mecánica',           link: 'https://chat.whatsapp.com/DVuWxxLvEmsFDh6xAp0Uj0' },
  { id: 'quimica',     title: 'Ingeniería', subtitle: 'Química',            link: 'https://chat.whatsapp.com/CGSo9jNg6EAI1lbPbmGGK2' },
  { id: 'naval',       title: 'Ingeniería', subtitle: 'Naval (No Formal)',  link: 'https://chat.whatsapp.com/JrIu9mMUZgn2aEss3nJsbg' },
];

export const WhatsAppGroupsList: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 pb-8 flex flex-col gap-5">
      
      {/* ── Encabezado Flat ── */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1.5 h-5 bg-itec-groups rounded-full" />
        <h3 className="text-xs font-bold text-itec-gray uppercase tracking-widest">
          Comunidades de WhatsApp
        </h3>
      </div>
      
      {/* ── Grilla Limpia y Minimalista ── */}
      <div className="flex flex-col gap-3">
        {WHATSAPP_GROUPS.map((group) => (
          <a
            key={group.id}
            href={group.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-itec-box hover:bg-white/[0.02] hover:border-white/10 transition-all duration-200 active:scale-[0.98]"
          >
            {/* Lado izquierdo: Logo WA + Título */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-white/5 border border-white/10 text-itec-muted group-hover:text-emerald-400 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-colors duration-300">
                <Icons type="whatsapp" className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-itec-muted truncate">
                  {group.title}
                </span>
                <span className="text-sm font-bold text-white mt-0.5 truncate">
                  {group.subtitle}
                </span>
              </div>
            </div>

            {/* Lado derecho: Acción (Entrar) */}
            <div className="flex items-center gap-3 pl-3 shrink-0">
              <span className="text-[9px] font-bold uppercase tracking-widest text-itec-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                Unirse
              </span>
              <div className="text-itec-muted/50 group-hover:text-white transition-colors duration-300">
                <Icons type="externalLink" className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};